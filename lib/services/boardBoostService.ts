/**
 * Board Boost Service
 * Handles Board Boost interactions with the Anchor program
 */

import { AnchorProvider, BN, Program, web3 } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

// Import the IDL type (this would be generated from your Anchor program)
// import { Squares } from '../types/squares';

export interface BoardBoostOptions {
  boardId: string;
  durationDays: 1 | 3 | 7;
  gameId: number;
}

export interface BoardBoostInfo {
  isCurrentlyBoosted: boolean;
  boostExpiresAt?: number;
  totalBoostAmount: number;
  boostScore: number;
}

export class BoardBoostService {
  private connection: Connection;
  private program: Program<any>; // Replace 'any' with your IDL type
  private programId: PublicKey;

  constructor(
    connection: Connection,
    wallet: AnchorWallet,
    programId: string = 'Fg6PaFprPjfrgxLbfXyAyzsK1m1S82mC2f43s5D2qQq',
  ) {
    this.connection = connection;
    this.programId = new PublicKey(programId);

    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });

    // Initialize program (you'll need to load the actual IDL)
    // this.program = new Program(IDL, this.programId, provider);
  }

  /**
   * Initialize the treasury PDA (one-time setup)
   */
  async initializeTreasury(authority: PublicKey): Promise<string> {
    try {
      const [treasuryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        this.programId,
      );

      const tx = await this.program.methods
        .initializeTreasury()
        .accounts({
          treasury: treasuryPda,
          authority: authority,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success('Treasury initialized successfully!');
      return tx;
    } catch (error) {
      console.error('Failed to initialize treasury:', error);
      toast.error('Failed to initialize treasury');
      throw error;
    }
  }

  /**
   * Boost a board for the specified duration
   */
  async boostBoard(
    options: BoardBoostOptions,
    authority: PublicKey,
  ): Promise<string> {
    try {
      const { boardId, durationDays, gameId } = options;

      // Derive board PDA
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.programId,
      );

      // Derive treasury PDA
      const [treasuryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        this.programId,
      );

      const tx = await this.program.methods
        .boostBoard(durationDays)
        .accounts({
          board: boardPda,
          authority: authority,
          treasury: treasuryPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const costSOL = this.getBoostCost(durationDays);
      toast.success(
        `Board boosted for ${durationDays} day${durationDays > 1 ? 's' : ''}!`,
        {
          description: `Cost: ${costSOL} SOL`,
        },
      );

      return tx;
    } catch (error) {
      console.error('Failed to boost board:', error);
      toast.error('Failed to boost board', {
        description: 'Please try again or contact support.',
      });
      throw error;
    }
  }

  /**
   * Update a board's fill rate (for ranking algorithm)
   */
  async updateFillRate(
    gameId: number,
    fillRate: number,
    authority: PublicKey,
  ): Promise<string> {
    try {
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.programId,
      );

      const tx = await this.program.methods
        .updateFillRate(fillRate)
        .accounts({
          board: boardPda,
          authority: authority,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Failed to update fill rate:', error);
      throw error;
    }
  }

  /**
   * Get board boost information
   */
  async getBoardBoostInfo(gameId: number): Promise<BoardBoostInfo> {
    try {
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.programId,
      );

      const boardAccount = await this.program.account.board.fetch(boardPda);
      const currentTimestamp = Math.floor(Date.now() / 1000);

      const isCurrentlyBoosted =
        boardAccount.boostExpiresAt > currentTimestamp &&
        boardAccount.boostAmount > 0;

      // Calculate boost score using the on-chain method logic
      const boostScore = this.calculateBoostScore(
        boardAccount,
        currentTimestamp,
      );

      return {
        isCurrentlyBoosted,
        boostExpiresAt: boardAccount.boostExpiresAt,
        totalBoostAmount: boardAccount.boostAmount,
        boostScore,
      };
    } catch (error) {
      console.error('Failed to get board boost info:', error);
      return {
        isCurrentlyBoosted: false,
        totalBoostAmount: 0,
        boostScore: 0,
      };
    }
  }

  /**
   * Get all boosted boards for discovery ranking
   */
  async getBoostedBoards(): Promise<any[]> {
    try {
      const allBoards = await this.program.account.board.all();
      const currentTimestamp = Math.floor(Date.now() / 1000);

      return allBoards
        .filter(
          ({ account }) =>
            account.boostExpiresAt > currentTimestamp &&
            account.boostAmount > 0,
        )
        .map(({ account, publicKey }) => ({
          ...account,
          publicKey: publicKey.toString(),
          boostScore: this.calculateBoostScore(account, currentTimestamp),
        }))
        .sort((a, b) => b.boostScore - a.boostScore);
    } catch (error) {
      console.error('Failed to get boosted boards:', error);
      return [];
    }
  }

  /**
   * Get discovery boards with boost ranking
   */
  async getDiscoveryBoards(filters?: {
    visibility?: string;
    minPrice?: number;
    maxPrice?: number;
    vipOnly?: boolean;
  }): Promise<any[]> {
    try {
      const allBoards = await this.program.account.board.all();
      const currentTimestamp = Math.floor(Date.now() / 1000);

      let filteredBoards = allBoards.map(({ account, publicKey }) => ({
        ...account,
        publicKey: publicKey.toString(),
        boostScore: this.calculateBoostScore(account, currentTimestamp),
        isCurrentlyBoosted:
          account.boostExpiresAt > currentTimestamp && account.boostAmount > 0,
      }));

      // Apply filters
      if (filters) {
        filteredBoards = filteredBoards.filter((board) => {
          if (filters.visibility && board.visibility !== filters.visibility)
            return false;
          if (filters.minPrice && board.pricePerSquare < filters.minPrice)
            return false;
          if (filters.maxPrice && board.pricePerSquare > filters.maxPrice)
            return false;
          if (filters.vipOnly !== undefined) {
            const requiresVip =
              board.visibility === 'VipOnly' ||
              board.pricePerSquare >= 100_000_000_000; // $100+ House boards
            if (filters.vipOnly !== requiresVip) return false;
          }
          return true;
        });
      }

      // Sort by boost score (boosted boards first, then by score)
      return filteredBoards.sort((a, b) => {
        if (a.isCurrentlyBoosted && !b.isCurrentlyBoosted) return -1;
        if (!a.isCurrentlyBoosted && b.isCurrentlyBoosted) return 1;
        return b.boostScore - a.boostScore;
      });
    } catch (error) {
      console.error('Failed to get discovery boards:', error);
      return [];
    }
  }

  /**
   * Calculate boost cost based on duration
   */
  private getBoostCost(durationDays: 1 | 3 | 7): number {
    const costs = {
      1: 0.05, // 0.05 SOL for 1 day
      3: 0.12, // 0.12 SOL for 3 days
      7: 0.25, // 0.25 SOL for 7 days
    };
    return costs[durationDays];
  }

  /**
   * Calculate boost score (mirrors on-chain logic)
   */
  private calculateBoostScore(
    boardAccount: any,
    currentTimestamp: number,
  ): number {
    if (
      boardAccount.boostExpiresAt <= currentTimestamp ||
      boardAccount.boostAmount === 0
    ) {
      return 0;
    }

    // Normalize boost amount (scale relative to baseline 0.25 SOL)
    const normalizedBoost = Math.min(
      boardAccount.boostAmount / 250_000_000,
      1.0,
    );

    // Weight by fill rate, time remaining, and boost amount
    const fillRateFactor = boardAccount.fillRate / 100.0;
    const timeRemaining = boardAccount.boostExpiresAt - currentTimestamp;
    const urgencyFactor =
      timeRemaining > 0
        ? Math.min(timeRemaining / 86400, 7) / 7 // Normalize to 0-1 based on days remaining
        : 0;

    // Weighted scoring algorithm (matches Anchor program)
    return normalizedBoost * 0.5 + fillRateFactor * 0.3 + urgencyFactor * 0.2;
  }

  /**
   * Check if treasury is initialized
   */
  async isTreasuryInitialized(): Promise<boolean> {
    try {
      const [treasuryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        this.programId,
      );

      const account = await this.connection.getAccountInfo(treasuryPda);
      return account !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get treasury balance
   */
  async getTreasuryBalance(): Promise<number> {
    try {
      const [treasuryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        this.programId,
      );

      const balance = await this.connection.getBalance(treasuryPda);
      return balance / web3.LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get treasury balance:', error);
      return 0;
    }
  }
}

/**
 * Board visibility enum to match Anchor program
 */
export enum BoardVisibility {
  Public = 'Public',
  InviteOnly = 'InviteOnly',
  VipOnly = 'VipOnly',
}

/**
 * Helper function to create board boost service instance
 */
export function createBoardBoostService(
  connection: Connection,
  wallet: AnchorWallet,
  programId?: string,
): BoardBoostService {
  return new BoardBoostService(connection, wallet, programId);
}

/**
 * React hook for board boost functionality
 */
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export function useBoardBoost() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const service = useMemo(() => {
    if (!wallet) return null;
    return new BoardBoostService(connection, wallet);
  }, [connection, wallet]);

  const boostBoard = async (options: BoardBoostOptions) => {
    if (!service || !wallet) throw new Error('Wallet not connected');
    return service.boostBoard(options, wallet.publicKey);
  };

  const getBoardBoostInfo = async (gameId: number) => {
    if (!service)
      return { isCurrentlyBoosted: false, totalBoostAmount: 0, boostScore: 0 };
    return service.getBoardBoostInfo(gameId);
  };

  const getDiscoveryBoards = async (filters?: any) => {
    if (!service) return [];
    return service.getDiscoveryBoards(filters);
  };

  return {
    service,
    boostBoard,
    getBoardBoostInfo,
    getDiscoveryBoards,
    isReady: !!service,
  };
}
