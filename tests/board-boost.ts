import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { FootballSquares } from '../target/types/football_squares';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { expect } from 'chai';

describe('Board Boost', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FootballSquares as Program<FootballSquares>;
  const authority = provider.wallet;

  const gameId = new anchor.BN(12345);
  const BOOST_FEE = 0.1 * LAMPORTS_PER_SOL; // 0.1 SOL

  let boardMetadataPda: PublicKey;
  let treasuryVaultPda: PublicKey;

  before(async () => {
    // Derive PDAs
    [boardMetadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('board_meta'), gameId.toBuffer('le', 8)],
      program.programId,
    );

    [treasuryVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury')],
      program.programId,
    );
  });

  it('Should publish a board with metadata', async () => {
    const tags = new Uint8Array(32);
    tags.set(Buffer.from('chiefs,primetime,week1'), 0);

    const tx = await program.methods
      .publishBoard(gameId, Array.from(tags))
      .accounts({
        boardMetadata: boardMetadataPda,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Board published. Tx:', tx);

    // Verify board metadata was created
    const boardMetadata =
      await program.account.boardMetadata.fetch(boardMetadataPda);
    expect(boardMetadata.gameId.toString()).to.equal(gameId.toString());
    expect(boardMetadata.cbl.toString()).to.equal(
      authority.publicKey.toString(),
    );
    expect(boardMetadata.fillRate).to.equal(0);
    expect(boardMetadata.boostAmount.toString()).to.equal('0');
  });

  it('Should boost a board and transfer SOL to treasury', async () => {
    // Get initial treasury balance
    const initialTreasuryBalance =
      await provider.connection.getBalance(treasuryVaultPda);

    const boostAmount = new anchor.BN(BOOST_FEE);

    const tx = await program.methods
      .boostBoard(boostAmount)
      .accounts({
        boardMetadata: boardMetadataPda,
        authority: authority.publicKey,
        treasuryVault: treasuryVaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Board boosted. Tx:', tx);

    // Verify treasury received SOL
    const finalTreasuryBalance =
      await provider.connection.getBalance(treasuryVaultPda);
    expect(finalTreasuryBalance - initialTreasuryBalance).to.equal(BOOST_FEE);

    // Verify board metadata was updated
    const boardMetadata =
      await program.account.boardMetadata.fetch(boardMetadataPda);
    expect(boardMetadata.boostAmount.toString()).to.equal(BOOST_FEE.toString());
    expect(boardMetadata.promotedUntil.toNumber()).to.be.greaterThan(0);
  });

  it('Should fail to boost with insufficient amount', async () => {
    const insufficientAmount = new anchor.BN(0.05 * LAMPORTS_PER_SOL); // 0.05 SOL

    try {
      await program.methods
        .boostBoard(insufficientAmount)
        .accounts({
          boardMetadata: boardMetadataPda,
          authority: authority.publicKey,
          treasuryVault: treasuryVaultPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      expect.fail('Should have thrown error for insufficient boost amount');
    } catch (error) {
      expect(error.error.errorMessage).to.include(
        'Boost amount must be at least 0.1 SOL',
      );
    }
  });

  it('Should allow multiple boosts to accumulate', async () => {
    const additionalBoost = new anchor.BN(0.2 * LAMPORTS_PER_SOL); // 0.2 SOL

    const tx = await program.methods
      .boostBoard(additionalBoost)
      .accounts({
        boardMetadata: boardMetadataPda,
        authority: authority.publicKey,
        treasuryVault: treasuryVaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Additional boost. Tx:', tx);

    // Verify cumulative boost amount
    const boardMetadata =
      await program.account.boardMetadata.fetch(boardMetadataPda);
    const expectedTotal = BOOST_FEE + 0.2 * LAMPORTS_PER_SOL;
    expect(boardMetadata.boostAmount.toString()).to.equal(
      expectedTotal.toString(),
    );
  });
});
