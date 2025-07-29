// agents/WinnerAgent/index.ts
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { OpenAI } from 'openai';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface WinnerInfo {
  winner: PublicKey;
  squareIndex: number;
  payoutAmount: number;
  homeScore: number;
  awayScore: number;
  winningDigits: { home: number; away: number };
}

interface PayoutResult {
  success: boolean;
  signature?: string;
  error?: string;
  amount: number;
  recipient: PublicKey;
}

export class WinnerAgent extends EventEmitter {
  private openai: OpenAI;
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(
    connection: Connection,
    provider: AnchorProvider,
    program: Program,
  ) {
    super();
    this.connection = connection;
    this.provider = provider;
    this.program = program;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('WinnerAgent initialized with GPT-4');
  }

  async settleWinner(
    boardPda: PublicKey,
  ): Promise<{ winnerInfo: WinnerInfo; signature: string }> {
    try {
      console.log(`Settling winner for board: ${boardPda.toString()}`);

      // First, get the current board state
      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      // TODO: Check game ended status when smart contract is deployed
      const gameEnded = true; // Mock for now
      if (!gameEnded) {
        throw new Error('Game has not ended yet');
      }

      // TODO: Check winner status when smart contract is deployed
      const winnerAlreadySettled = false; // Mock for now
      if (winnerAlreadySettled) {
        throw new Error('Winner already settled');
      }

      // Execute settle winner instruction
      const tx = await this.program.methods
        .settleWinner()
        .accounts({
          board: boardPda,
          authority: this.provider.wallet.publicKey,
        })
        .rpc();

      // TODO: Fetch updated board state when smart contract is deployed
      // const updatedBoard = await this.program.account.board.fetch(boardPda);

      const winnerInfo: WinnerInfo = {
        winner: boardPda, // Mock winner
        squareIndex: 0, // Mock square index
        payoutAmount: 1000, // Mock payout amount
        homeScore: 21, // Mock home score
        awayScore: 14, // Mock away score
        winningDigits: {
          home: 1, // Mock home digit
          away: 4, // Mock away digit
        },
      };

      this.emit('winnerSettled', { boardPda, winnerInfo, signature: tx });

      console.log(
        `Winner settled: ${winnerInfo.winner.toString()} wins ${winnerInfo.payoutAmount} lamports`,
      );

      return { winnerInfo, signature: tx };
    } catch (error) {
      console.error('Error settling winner:', error);
      throw error;
    }
  }

  async payoutWinner(
    boardPda: PublicKey,
    winnerKey: PublicKey,
  ): Promise<PayoutResult> {
    try {
      console.log(`Processing payout for winner: ${winnerKey.toString()}`);

      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      // TODO: Check winner validation when smart contract is deployed
      const hasWinner = true; // Mock for now
      if (!hasWinner) {
        throw new Error('No winner has been settled yet');
      }

      // TODO: Validate winner key when smart contract is deployed
      const isValidWinner = true; // Mock for now
      if (!isValidWinner) {
        throw new Error('Provided key does not match the settled winner');
      }

      // TODO: Check payout amount when smart contract is deployed
      // const payoutAmount = boardAccount.payoutAmount.toNumber(); // Will be used in production
      const payoutAmount = Math.max(1000, 0); // Mock payout amount for now
      if (payoutAmount === 0) {
        throw new Error('No payout amount available');
      }

      // Execute payout instruction
      const tx = await this.program.methods
        .payoutWinner()
        .accounts({
          board: boardPda,
          winner: winnerKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const result: PayoutResult = {
        success: true,
        signature: tx,
        amount: payoutAmount,
        recipient: winnerKey,
      };

      this.emit('payoutCompleted', { boardPda, result });

      console.log(
        `Payout completed: ${payoutAmount} lamports to ${winnerKey.toString()}`,
      );

      return result;
    } catch (error) {
      console.error('Error processing payout:', error);

      const result: PayoutResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        amount: 0,
        recipient: winnerKey,
      };

      this.emit('payoutFailed', { boardPda, result, error });

      return result;
    }
  }

  async calculatePayout(boardPda: PublicKey): Promise<{
    totalPot: number;
    winnerShare: number;
    feeAmount: number;
    netPayout: number;
  }> {
    try {
      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      const totalPot = 10000; // Mock total pot
      const feePercentage = 0.05; // 5% fee
      const feeAmount = Math.floor(totalPot * feePercentage);
      const netPayout = totalPot - feeAmount;

      return {
        totalPot,
        winnerShare: 1.0, // 100% of net amount goes to winner
        feeAmount,
        netPayout,
      };
    } catch (error) {
      console.error('Error calculating payout:', error);
      throw error;
    }
  }

  private calculateSquareIndex(
    homeHeaders: number[],
    awayHeaders: number[],
    homeDigit: number,
    awayDigit: number,
  ): number {
    const homeIndex = homeHeaders.indexOf(homeDigit);
    const awayIndex = awayHeaders.indexOf(awayDigit);

    if (homeIndex === -1 || awayIndex === -1) {
      throw new Error('Invalid score digits for current headers');
    }

    return homeIndex * 10 + awayIndex;
  }

  async analyzeWinningProbabilities(boardPda: PublicKey): Promise<string> {
    try {
      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      const prompt = `
Analyze the winning probabilities for this Football Squares board:

Home Headers: ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].join(', ')}
Away Headers: ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].join(', ')}
Current Score: 21-14
Game Status: In Progress

Based on historical NFL scoring patterns, provide:
1. Most likely final score digit combinations
2. Probability analysis for each square
3. Which squares have the best/worst odds
4. Impact of current score on remaining possibilities

Focus on the mathematical probabilities of different digit combinations (0-9).
Keep response under 200 words.
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.3,
      });

      return response.choices[0].message.content || 'No analysis available';
    } catch (error) {
      console.error('Error analyzing winning probabilities:', error);
      return 'Analysis unavailable due to API error';
    }
  }

  async getWinnerHistory(boardPda: PublicKey): Promise<{
    gameId: number;
    winnerAddress: PublicKey;
    squareIndex: number;
    payoutAmount: number;
    finalScore: { home: number; away: number };
    settlementTime: Date;
  } | null> {
    try {
      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      // TODO: Check if winner exists when smart contract is deployed
      const hasWinner = false; // Mock for now
      if (!hasWinner) {
        return null;
      }

      return {
        gameId: 1, // Mock game ID
        winnerAddress: boardPda, // Mock winner address
        squareIndex: this.calculateSquareIndex(
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Mock home headers
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Mock away headers
          1, // Mock home score digit
          4, // Mock away score digit
        ),
        payoutAmount: 1000, // Mock payout amount
        finalScore: {
          home: 21, // Mock home score
          away: 14, // Mock away score
        },
        settlementTime: new Date(), // In real implementation, this would be from blockchain timestamp
      };
    } catch (error) {
      console.error('Error getting winner history:', error);
      return null;
    }
  }

  async validateWinnerClaim(
    boardPda: PublicKey,
    claimantKey: PublicKey,
  ): Promise<{
    valid: boolean;
    reason?: string;
    squareIndex?: number;
    payoutAmount?: number;
  }> {
    try {
      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      // TODO: Check game status when smart contract is deployed
      const gameEnded = true; // Mock for now
      if (!gameEnded) {
        return { valid: false, reason: 'Game has not ended' };
      }

      // TODO: Check winner status when smart contract is deployed
      const hasWinner = true; // Mock for now
      if (!hasWinner) {
        return { valid: false, reason: 'Winner has not been settled' };
      }

      // TODO: Validate claimant when smart contract is deployed
      const isValidClaimant = true; // Mock for now
      if (!isValidClaimant) {
        return { valid: false, reason: 'Claimant is not the winner' };
      }

      // TODO: Check payout status when smart contract is deployed
      // const payoutAmount = boardAccount.payoutAmount.toNumber(); // Will be used in production
      const payoutAmount = Math.max(1000, 0); // Mock payout amount for now
      if (payoutAmount === 0) {
        return { valid: false, reason: 'Payout has already been claimed' };
      }

      const squareIndex = this.calculateSquareIndex(
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Mock home headers
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Mock away headers
        1, // Mock home score digit
        4, // Mock away score digit
      );

      return {
        valid: true,
        squareIndex,
        payoutAmount: payoutAmount, // Use the mock payout amount
      };
    } catch (error) {
      console.error('Error validating winner claim:', error);
      return { valid: false, reason: 'Validation error' };
    }
  }

  async monitorWinnerEvents(boardPda: PublicKey): Promise<void> {
    console.log(
      `Starting winner event monitoring for board: ${boardPda.toString()}`,
    );

    // Set up event listeners for winner-related events
    this.program.addEventListener('winnerSettled', (event: any) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('winnerActivity', {
          type: 'winner_settled',
          data: event,
        });
      }
    });

    this.program.addEventListener('winnerPaid', (event: any) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('winnerActivity', {
          type: 'winner_paid',
          data: event,
        });
      }
    });
  }

  async getPayoutStatistics(): Promise<{
    totalPayouts: number;
    averagePayoutAmount: number;
    largestPayout: number;
    successRate: number;
  }> {
    // In real implementation, this would query historical data
    // For now, we'll return mock statistics
    return {
      totalPayouts: 42,
      averagePayoutAmount: 1_000_000_000, // 1 SOL in lamports
      largestPayout: 5_000_000_000, // 5 SOL in lamports
      successRate: 0.98,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check connection to Solana
      await this.connection.getLatestBlockhash();

      // Check OpenAI API
      await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'health check' }],
        max_tokens: 5,
      });

      return true;
    } catch (error) {
      console.error('WinnerAgent health check failed:', error);
      return false;
    }
  }
}

export default WinnerAgent;
