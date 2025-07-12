// agents/WinnerAgent/index.ts
import { Connection, PublicKey } from '@solana/web3.js';
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

  constructor(connection: Connection, provider: AnchorProvider, program: Program) {
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

  async settleWinner(boardPda: PublicKey): Promise<{ winnerInfo: WinnerInfo; signature: string }> {
    try {
      console.log(`Settling winner for board: ${boardPda.toString()}`);

      // First, get the current board state
      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      if (!boardAccount.gameEnded) {
        throw new Error('Game has not ended yet');
      }

      if (!boardAccount.winner.equals(PublicKey.default)) {
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

      // Fetch updated board state to get winner info
      const updatedBoard = await this.program.account.board.fetch(boardPda);
      
      const winnerInfo: WinnerInfo = {
        winner: updatedBoard.winner,
        squareIndex: this.calculateSquareIndex(
          updatedBoard.homeHeaders,
          updatedBoard.awayHeaders,
          updatedBoard.homeScore % 10,
          updatedBoard.awayScore % 10
        ),
        payoutAmount: updatedBoard.payoutAmount.toNumber(),
        homeScore: updatedBoard.homeScore,
        awayScore: updatedBoard.awayScore,
        winningDigits: {
          home: updatedBoard.homeScore % 10,
          away: updatedBoard.awayScore % 10,
        },
      };

      this.emit('winnerSettled', { boardPda, winnerInfo, signature: tx });
      
      console.log(`Winner settled: ${winnerInfo.winner.toString()} wins ${winnerInfo.payoutAmount} lamports`);
      
      return { winnerInfo, signature: tx };
    } catch (error) {
      console.error('Error settling winner:', error);
      throw error;
    }
  }

  async payoutWinner(boardPda: PublicKey, winnerKey: PublicKey): Promise<PayoutResult> {
    try {
      console.log(`Processing payout for winner: ${winnerKey.toString()}`);

      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      if (boardAccount.winner.equals(PublicKey.default)) {
        throw new Error('No winner has been settled yet');
      }

      if (!boardAccount.winner.equals(winnerKey)) {
        throw new Error('Provided key does not match the settled winner');
      }

      if (boardAccount.payoutAmount.toNumber() === 0) {
        throw new Error('No payout amount available');
      }

      const payoutAmount = boardAccount.payoutAmount.toNumber();

      // Execute payout instruction
      const tx = await this.program.methods
        .payoutWinner()
        .accounts({
          board: boardPda,
          winner: winnerKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      const result: PayoutResult = {
        success: true,
        signature: tx,
        amount: payoutAmount,
        recipient: winnerKey,
      };

      this.emit('payoutCompleted', { boardPda, result });
      
      console.log(`Payout completed: ${payoutAmount} lamports to ${winnerKey.toString()}`);
      
      return result;
    } catch (error) {
      console.error('Error processing payout:', error);
      
      const result: PayoutResult = {
        success: false,
        error: error.message,
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
      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      const totalPot = boardAccount.totalPot.toNumber();
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
    awayDigit: number
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
      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      const prompt = `
Analyze the winning probabilities for this Football Squares board:

Home Headers: ${boardAccount.homeHeaders.join(', ')}
Away Headers: ${boardAccount.awayHeaders.join(', ')}
Current Score: ${boardAccount.homeScore}-${boardAccount.awayScore}
Game Status: ${boardAccount.gameEnded ? 'Ended' : 'In Progress'}

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
      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      if (boardAccount.winner.equals(PublicKey.default)) {
        return null;
      }

      return {
        gameId: boardAccount.gameId.toNumber(),
        winnerAddress: boardAccount.winner,
        squareIndex: this.calculateSquareIndex(
          boardAccount.homeHeaders,
          boardAccount.awayHeaders,
          boardAccount.homeScore % 10,
          boardAccount.awayScore % 10
        ),
        payoutAmount: boardAccount.payoutAmount.toNumber(),
        finalScore: {
          home: boardAccount.homeScore,
          away: boardAccount.awayScore,
        },
        settlementTime: new Date(), // In real implementation, this would be from blockchain timestamp
      };
    } catch (error) {
      console.error('Error getting winner history:', error);
      return null;
    }
  }

  async validateWinnerClaim(boardPda: PublicKey, claimantKey: PublicKey): Promise<{
    valid: boolean;
    reason?: string;
    squareIndex?: number;
    payoutAmount?: number;
  }> {
    try {
      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      if (!boardAccount.gameEnded) {
        return { valid: false, reason: 'Game has not ended' };
      }

      if (boardAccount.winner.equals(PublicKey.default)) {
        return { valid: false, reason: 'Winner has not been settled' };
      }

      if (!boardAccount.winner.equals(claimantKey)) {
        return { valid: false, reason: 'Claimant is not the winner' };
      }

      if (boardAccount.payoutAmount.toNumber() === 0) {
        return { valid: false, reason: 'Payout has already been claimed' };
      }

      const squareIndex = this.calculateSquareIndex(
        boardAccount.homeHeaders,
        boardAccount.awayHeaders,
        boardAccount.homeScore % 10,
        boardAccount.awayScore % 10
      );

      return {
        valid: true,
        squareIndex,
        payoutAmount: boardAccount.payoutAmount.toNumber(),
      };
    } catch (error) {
      console.error('Error validating winner claim:', error);
      return { valid: false, reason: 'Validation error' };
    }
  }

  async monitorWinnerEvents(boardPda: PublicKey): Promise<void> {
    console.log(`Starting winner event monitoring for board: ${boardPda.toString()}`);
    
    // Set up event listeners for winner-related events
    this.program.addEventListener('winnerSettled', (event: any) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('winnerActivity', {
          type: 'winner_settled',
          data: event
        });
      }
    });

    this.program.addEventListener('winnerPaid', (event: any) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('winnerActivity', {
          type: 'winner_paid',
          data: event
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