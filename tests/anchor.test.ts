// tests/anchor.test.ts
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { expect } from 'chai';
import { Squares } from '../target/types/squares';

describe('Football Squares Program', () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Squares as Program<Squares>;
  const provider = anchor.getProvider();

  let gameId: number;
  let boardPda: PublicKey;
  let authority: Keypair;
  let player1: Keypair;
  let player2: Keypair;

  before(async () => {
    // Generate test accounts
    authority = Keypair.generate();
    player1 = Keypair.generate();
    player2 = Keypair.generate();
    gameId = Math.floor(Math.random() * 10000);

    // Airdrop SOL to test accounts
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        authority.publicKey,
        2 * LAMPORTS_PER_SOL,
      ),
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        player1.publicKey,
        2 * LAMPORTS_PER_SOL,
      ),
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        player2.publicKey,
        2 * LAMPORTS_PER_SOL,
      ),
    );

    // Calculate board PDA
    [boardPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('board'),
        new anchor.BN(gameId).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId,
    );
  });

  describe('Board Creation', () => {
    it('Creates a new football squares board', async () => {
      const tx = await program.methods
        .createBoard(new anchor.BN(gameId))
        .accounts({
          board: boardPda,
          authority: authority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      console.log('Board creation transaction:', tx);

      // Verify board state
      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.gameId.toNumber()).to.equal(gameId);
      expect(boardAccount.authority.toString()).to.equal(
        authority.publicKey.toString(),
      );
      expect(boardAccount.finalized).to.be.false;
      expect(boardAccount.randomized).to.be.false;
      expect(boardAccount.gameStarted).to.be.false;
      expect(boardAccount.gameEnded).to.be.false;
      expect(boardAccount.totalPot.toNumber()).to.equal(0);

      // Verify all squares are empty
      for (let i = 0; i < 100; i++) {
        expect(boardAccount.squares[i].toString()).to.equal(
          PublicKey.default.toString(),
        );
      }

      // Verify headers are unset (sentinel value 10)
      for (let i = 0; i < 10; i++) {
        expect(boardAccount.homeHeaders[i]).to.equal(10);
        expect(boardAccount.awayHeaders[i]).to.equal(10);
      }
    });

    it('Fails to create board with duplicate game ID', async () => {
      try {
        await program.methods
          .createBoard(new anchor.BN(gameId))
          .accounts({
            board: boardPda,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

        expect.fail('Should have thrown an error for duplicate game ID');
      } catch (error) {
        expect(error.message).to.include('custom program error');
      }
    });
  });

  describe('Square Purchase', () => {
    it('Allows a player to purchase a square', async () => {
      const squareIndex = 0;
      const squarePrice = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL

      const initialBalance = await provider.connection.getBalance(
        player1.publicKey,
      );
      const initialBoardBalance =
        await provider.connection.getBalance(boardPda);

      const tx = await program.methods
        .purchaseSquare(squareIndex)
        .accounts({
          board: boardPda,
          buyer: player1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([player1])
        .rpc();

      console.log('Square purchase transaction:', tx);

      // Verify board state
      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.squares[squareIndex].toString()).to.equal(
        player1.publicKey.toString(),
      );
      expect(boardAccount.totalPot.toNumber()).to.equal(squarePrice);

      // Verify balances
      const finalBalance = await provider.connection.getBalance(
        player1.publicKey,
      );
      const finalBoardBalance = await provider.connection.getBalance(boardPda);

      expect(finalBalance).to.be.approximately(
        initialBalance - squarePrice,
        10000,
      ); // Allow for tx fees
      expect(finalBoardBalance).to.equal(initialBoardBalance + squarePrice);
    });

    it('Prevents purchasing the same square twice', async () => {
      const squareIndex = 0;

      try {
        await program.methods
          .purchaseSquare(squareIndex)
          .accounts({
            board: boardPda,
            buyer: player2.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([player2])
          .rpc();

        expect.fail('Should have thrown an error for already owned square');
      } catch (error) {
        expect(error.message).to.include('SquareAlreadyOwned');
      }
    });

    it('Allows different players to purchase different squares', async () => {
      const squareIndex = 1;
      const squarePrice = 0.01 * LAMPORTS_PER_SOL;

      await program.methods
        .purchaseSquare(squareIndex)
        .accounts({
          board: boardPda,
          buyer: player2.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([player2])
        .rpc();

      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.squares[squareIndex].toString()).to.equal(
        player2.publicKey.toString(),
      );
      expect(boardAccount.totalPot.toNumber()).to.equal(squarePrice * 2); // Two squares purchased
    });
  });

  describe('VRF Randomization', () => {
    let vrfAccount: PublicKey;

    before(() => {
      // Mock VRF account for testing
      vrfAccount = Keypair.generate().publicKey;
    });

    it('Requests randomization', async () => {
      const tx = await program.methods
        .requestRandomization()
        .accounts({
          board: boardPda,
          vrfAccount: vrfAccount,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      console.log('Randomization request transaction:', tx);

      // In a real test, we would verify the VRF request was properly formatted
      // For now, we just ensure the transaction succeeds
    });

    it('Fulfills VRF callback with random headers', async () => {
      // Generate mock randomness (32 bytes)
      const randomness = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 256),
      );

      const tx = await program.methods
        .fulfillVrfCallback(randomness)
        .accounts({
          board: boardPda,
          vrfAccount: vrfAccount,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      console.log('VRF fulfillment transaction:', tx);

      // Verify board state
      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.randomized).to.be.true;

      // Verify headers are set (no longer 10)
      const homeHeadersSet = boardAccount.homeHeaders.every((h) => h !== 10);
      const awayHeadersSet = boardAccount.awayHeaders.every((h) => h !== 10);
      expect(homeHeadersSet).to.be.true;
      expect(awayHeadersSet).to.be.true;

      // Verify headers contain values 0-9
      const homeHeadersValid = boardAccount.homeHeaders.every(
        (h) => h >= 0 && h <= 9,
      );
      const awayHeadersValid = boardAccount.awayHeaders.every(
        (h) => h >= 0 && h <= 9,
      );
      expect(homeHeadersValid).to.be.true;
      expect(awayHeadersValid).to.be.true;

      // Verify no duplicate headers
      const homeSet = new Set(boardAccount.homeHeaders);
      const awaySet = new Set(boardAccount.awayHeaders);
      expect(homeSet.size).to.equal(10);
      expect(awaySet.size).to.equal(10);
    });

    it('Prevents double randomization', async () => {
      const randomness = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 256),
      );

      try {
        await program.methods
          .fulfillVrfCallback(randomness)
          .accounts({
            board: boardPda,
            vrfAccount: vrfAccount,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();

        expect.fail('Should have thrown an error for already randomized board');
      } catch (error) {
        expect(error.message).to.include('AlreadyRandomized');
      }
    });
  });

  describe('Score Recording', () => {
    it('Records game scores', async () => {
      const homeScore = 14;
      const awayScore = 7;
      const quarter = 2;

      const tx = await program.methods
        .recordScore(homeScore, awayScore, quarter)
        .accounts({
          board: boardPda,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      console.log('Score recording transaction:', tx);

      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.homeScore).to.equal(homeScore);
      expect(boardAccount.awayScore).to.equal(awayScore);
      expect(boardAccount.quarter).to.equal(quarter);
      expect(boardAccount.gameStarted).to.be.true;
    });

    it('Records final score and ends game', async () => {
      const homeScore = 28;
      const awayScore = 21;
      const quarter = 4;

      await program.methods
        .recordScore(homeScore, awayScore, quarter)
        .accounts({
          board: boardPda,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.homeScore).to.equal(homeScore);
      expect(boardAccount.awayScore).to.equal(awayScore);
      expect(boardAccount.quarter).to.equal(quarter);
      expect(boardAccount.gameEnded).to.be.true;
    });
  });

  describe('Winner Settlement', () => {
    it('Settles the winner based on final score', async () => {
      const tx = await program.methods
        .settleWinner()
        .accounts({
          board: boardPda,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      console.log('Winner settlement transaction:', tx);

      const boardAccount = await program.account.board.fetch(boardPda);
      expect(boardAccount.winner.toString()).to.not.equal(
        PublicKey.default.toString(),
      );
      expect(boardAccount.payoutAmount.toNumber()).to.be.greaterThan(0);

      // Winner should be either player1 or player2 (only ones who bought squares)
      const winnerIsPlayer1 = boardAccount.winner.equals(player1.publicKey);
      const winnerIsPlayer2 = boardAccount.winner.equals(player2.publicKey);
      expect(winnerIsPlayer1 || winnerIsPlayer2).to.be.true;
    });

    it('Prevents settling winner twice', async () => {
      try {
        await program.methods
          .settleWinner()
          .accounts({
            board: boardPda,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();

        expect.fail('Should have thrown an error for already settled game');
      } catch (error) {
        expect(error.message).to.include('AlreadySettled');
      }
    });
  });

  describe('Winner Payout', () => {
    let winner: Keypair;

    before(async () => {
      const boardAccount = await program.account.board.fetch(boardPda);

      // Determine which player won
      if (boardAccount.winner.equals(player1.publicKey)) {
        winner = player1;
      } else if (boardAccount.winner.equals(player2.publicKey)) {
        winner = player2;
      } else {
        throw new Error('Unexpected winner');
      }
    });

    it('Pays out the winner', async () => {
      const boardAccount = await program.account.board.fetch(boardPda);
      const payoutAmount = boardAccount.payoutAmount.toNumber();

      const initialWinnerBalance = await provider.connection.getBalance(
        winner.publicKey,
      );
      const initialBoardBalance =
        await provider.connection.getBalance(boardPda);

      const tx = await program.methods
        .payoutWinner()
        .accounts({
          board: boardPda,
          winner: winner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([winner])
        .rpc();

      console.log('Payout transaction:', tx);

      // Verify balances
      const finalWinnerBalance = await provider.connection.getBalance(
        winner.publicKey,
      );
      const finalBoardBalance = await provider.connection.getBalance(boardPda);

      expect(finalWinnerBalance).to.be.approximately(
        initialWinnerBalance + payoutAmount,
        10000, // Allow for tx fees
      );
      expect(finalBoardBalance).to.equal(initialBoardBalance - payoutAmount);

      // Verify payout amount is reset
      const updatedBoardAccount = await program.account.board.fetch(boardPda);
      expect(updatedBoardAccount.payoutAmount.toNumber()).to.equal(0);
    });

    it('Prevents unauthorized payout claims', async () => {
      // Try to claim payout with wrong winner
      const wrongWinner = winner === player1 ? player2 : player1;

      try {
        await program.methods
          .payoutWinner()
          .accounts({
            board: boardPda,
            winner: wrongWinner.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([wrongWinner])
          .rpc();

        expect.fail('Should have thrown an error for invalid winner');
      } catch (error) {
        expect(error.message).to.include('InvalidWinner');
      }
    });

    it('Prevents double payout', async () => {
      try {
        await program.methods
          .payoutWinner()
          .accounts({
            board: boardPda,
            winner: winner.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([winner])
          .rpc();

        expect.fail('Should have thrown an error for no payout available');
      } catch (error) {
        expect(error.message).to.include('NoPayout');
      }
    });
  });

  describe('Error Cases', () => {
    it('Prevents square purchase with invalid index', async () => {
      try {
        await program.methods
          .purchaseSquare(100) // Invalid index (should be 0-99)
          .accounts({
            board: boardPda,
            buyer: player1.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([player1])
          .rpc();

        expect.fail('Should have thrown an error for invalid square index');
      } catch (error) {
        expect(error.message).to.include('InvalidSquareIndex');
      }
    });

    it('Prevents score recording with invalid quarter', async () => {
      try {
        await program.methods
          .recordScore(10, 7, 5) // Invalid quarter (should be 1-4)
          .accounts({
            board: boardPda,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();

        expect.fail('Should have thrown an error for invalid quarter');
      } catch (error) {
        expect(error.message).to.include('InvalidQuarter');
      }
    });
  });
});
