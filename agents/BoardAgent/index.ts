// agents/BoardAgent/index.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { OpenAI } from 'openai';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface BoardState {
  gameId: number;
  authority: PublicKey;
  finalized: boolean;
  randomized: boolean;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: PublicKey;
  payoutAmount: number;
  totalPot: number;
  homeScore: number;
  awayScore: number;
  quarter: number;
  squares: PublicKey[];
  homeHeaders: number[];
  awayHeaders: number[];
}

export class BoardAgent extends EventEmitter {
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

    console.log('BoardAgent initialized with GPT-4');
  }

  async createBoard(gameId: number): Promise<{ boardPda: PublicKey; signature: string }> {
    try {
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.program.programId
      );

      console.log(`Creating board for game ${gameId} at PDA: ${boardPda.toString()}`);

      const tx = await this.program.methods
        .createBoard(new BN(gameId))
        .accounts({
          board: boardPda,
          authority: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      this.emit('boardCreated', { gameId, boardPda, signature: tx });
      
      return { boardPda, signature: tx };
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  }

  async getBoardState(boardPda: PublicKey): Promise<BoardState> {
    try {
      const boardAccount = await this.program.account.board.fetch(boardPda);
      
      return {
        gameId: boardAccount.gameId.toNumber(),
        authority: boardAccount.authority,
        finalized: boardAccount.finalized,
        randomized: boardAccount.randomized,
        gameStarted: boardAccount.gameStarted,
        gameEnded: boardAccount.gameEnded,
        winner: boardAccount.winner,
        payoutAmount: boardAccount.payoutAmount.toNumber(),
        totalPot: boardAccount.totalPot.toNumber(),
        homeScore: boardAccount.homeScore,
        awayScore: boardAccount.awayScore,
        quarter: boardAccount.quarter,
        squares: boardAccount.squares,
        homeHeaders: boardAccount.homeHeaders,
        awayHeaders: boardAccount.awayHeaders,
      };
    } catch (error) {
      console.error('Error fetching board state:', error);
      throw error;
    }
  }

  async analyzeBoardStrategy(boardState: BoardState): Promise<string> {
    const prompt = `
Analyze this Football Squares board state and provide strategic insights:

Game ID: ${boardState.gameId}
Game State: ${boardState.gameStarted ? 'Started' : 'Not Started'}
Current Score: ${boardState.homeScore}-${boardState.awayScore} Q${boardState.quarter}
Total Pot: ${boardState.totalPot} lamports
Players: ${boardState.squares.filter(s => !s.equals(PublicKey.default)).length}/100

Home Headers: ${boardState.homeHeaders.join(', ')}
Away Headers: ${boardState.awayHeaders.join(', ')}

Provide analysis on:
1. Most valuable squares based on historical NFL scoring patterns
2. Current market dynamics (filled vs empty squares)
3. Potential payout scenarios
4. Game progression insights

Keep response under 200 words.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      return response.choices[0].message.content || 'No analysis available';
    } catch (error) {
      console.error('Error analyzing board strategy:', error);
      return 'Analysis unavailable due to API error';
    }
  }

  async purchaseSquare(boardPda: PublicKey, squareIndex: number): Promise<string> {
    try {
      const tx = await this.program.methods
        .purchaseSquare(squareIndex)
        .accounts({
          board: boardPda,
          buyer: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      this.emit('squarePurchased', { boardPda, squareIndex, signature: tx });
      
      return tx;
    } catch (error) {
      console.error('Error purchasing square:', error);
      throw error;
    }
  }

  async getAvailableSquares(boardPda: PublicKey): Promise<number[]> {
    try {
      const boardState = await this.getBoardState(boardPda);
      const availableSquares: number[] = [];
      
      for (let i = 0; i < 100; i++) {
        if (boardState.squares[i].equals(PublicKey.default)) {
          availableSquares.push(i);
        }
      }
      
      return availableSquares;
    } catch (error) {
      console.error('Error getting available squares:', error);
      throw error;
    }
  }

  async getBoardStats(boardPda: PublicKey): Promise<{
    totalSquaresSold: number;
    totalRevenue: number;
    occupancyRate: number;
    averageSquareValue: number;
  }> {
    try {
      const boardState = await this.getBoardState(boardPda);
      const totalSquaresSold = boardState.squares.filter(s => !s.equals(PublicKey.default)).length;
      const totalRevenue = boardState.totalPot;
      const occupancyRate = (totalSquaresSold / 100) * 100;
      const averageSquareValue = totalRevenue / Math.max(totalSquaresSold, 1);

      return {
        totalSquaresSold,
        totalRevenue,
        occupancyRate,
        averageSquareValue,
      };
    } catch (error) {
      console.error('Error getting board stats:', error);
      throw error;
    }
  }

  async monitorBoardActivity(boardPda: PublicKey): Promise<void> {
    console.log(`Starting board monitoring for ${boardPda.toString()}`);
    
    // Set up event listener for board changes
    this.program.addEventListener('squarePurchased', (event) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('boardActivity', {
          type: 'square_purchased',
          data: event
        });
      }
    });

    this.program.addEventListener('scoreRecorded', (event) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('boardActivity', {
          type: 'score_recorded',
          data: event
        });
      }
    });

    this.program.addEventListener('winnerSettled', (event) => {
      if (event.boardId.toString() === boardPda.toString()) {
        this.emit('boardActivity', {
          type: 'winner_settled',
          data: event
        });
      }
    });
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
      console.error('BoardAgent health check failed:', error);
      return false;
    }
  }
}

export default BoardAgent;