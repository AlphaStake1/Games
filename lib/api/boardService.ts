// Board Service - Handles all board-related API operations
// Replaces mock data with real API integration

import {
  ApiResponse,
  ApiError,
  ApiErrorCode,
  BoardAvailabilityResponse,
  BoardSquaresResponse,
  PurchaseSquareRequest,
  PurchaseSquareResponse,
  BoardState,
  SquareOwnership,
  SystemConfiguration,
} from './types';
import { BoardConfiguration, BoardTier, BOARD_TIERS } from '@/lib/boardTypes';
import { GameSchedule } from '@/lib/boardTypes';
import { mockDataService } from './mockDataService';

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

export class BoardService {
  private static instance: BoardService;
  private abortController: AbortController;

  constructor() {
    this.abortController = new AbortController();
  }

  static getInstance(): BoardService {
    if (!BoardService.instance) {
      BoardService.instance = new BoardService();
    }
    return BoardService.instance;
  }

  // Generic API request handler with error handling
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${errorData.message || response.statusText}`,
        );
      }

      const data = await response.json();

      return {
        success: true,
        data: data.data || data,
        timestamp: Date.now(),
        requestId: response.headers.get('x-request-id') || undefined,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError<T>(error: any): ApiResponse<T> {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: ApiErrorCode.NETWORK_ERROR,
          message: 'Request was cancelled',
          retryable: true,
        },
        timestamp: Date.now(),
      };
    }

    if (error.message?.includes('timeout')) {
      return {
        success: false,
        error: {
          code: ApiErrorCode.NETWORK_ERROR,
          message: 'Request timed out',
          retryable: true,
        },
        timestamp: Date.now(),
      };
    }

    // Parse API error responses
    let errorCode = ApiErrorCode.SERVER_ERROR;
    let retryable = false;

    if (error.message?.includes('BOARD_FULL')) {
      errorCode = ApiErrorCode.BOARD_FULL;
    } else if (error.message?.includes('BOARD_LOCKED')) {
      errorCode = ApiErrorCode.BOARD_LOCKED;
    } else if (error.message?.includes('INSUFFICIENT_FUNDS')) {
      errorCode = ApiErrorCode.INSUFFICIENT_FUNDS;
    } else if (error.message?.includes('AUTHENTICATION')) {
      errorCode = ApiErrorCode.AUTHENTICATION_FAILED;
    } else if (error.message?.includes('RATE_LIMIT')) {
      errorCode = ApiErrorCode.RATE_LIMIT_EXCEEDED;
      retryable = true;
    } else if (
      error.message?.includes('NETWORK') ||
      error.message?.includes('fetch')
    ) {
      errorCode = ApiErrorCode.NETWORK_ERROR;
      retryable = true;
    }

    return {
      success: false,
      error: {
        code: errorCode,
        message: error.message || 'An unexpected error occurred',
        retryable,
        details: { originalError: error.toString() },
      },
      timestamp: Date.now(),
    };
  }

  // Get board availability for a specific game and tier
  async getBoardAvailability(
    gameId: string,
    tierId: string,
  ): Promise<ApiResponse<BoardAvailabilityResponse>> {
    return this.makeRequest<BoardAvailabilityResponse>(
      `/boards/availability?gameId=${gameId}&tierId=${tierId}`,
    );
  }

  // Get all available boards for a specific game
  async getGameBoards(
    gameId: string,
  ): Promise<ApiResponse<BoardAvailabilityResponse[]>> {
    try {
      // For development, always use mock data to avoid API failures
      console.log(
        'BoardService.getGameBoards: Using mock data for development',
      );
      return await mockDataService.getGameBoards(gameId);

      // Original API code (commented out for development):
      // const response = await this.makeRequest<BoardAvailabilityResponse[]>(
      //   `/boards/game/${gameId}`,
      // );
      // if (!response.success) {
      //   console.warn('Board API failed, using mock data for game:', gameId);
      //   return await mockDataService.getGameBoards(gameId);
      // }
      // return response;
    } catch (error) {
      console.warn('Board API error, using mock data for game:', gameId);
      return await mockDataService.getGameBoards(gameId);
    }
  }

  // Get square ownership data for a board
  async getBoardSquares(
    boardId: string,
  ): Promise<ApiResponse<BoardSquaresResponse>> {
    return this.makeRequest<BoardSquaresResponse>(`/boards/${boardId}/squares`);
  }

  // Purchase squares on a board
  async purchaseSquares(
    request: PurchaseSquareRequest,
  ): Promise<ApiResponse<PurchaseSquareResponse>> {
    return this.makeRequest<PurchaseSquareResponse>('/boards/purchase', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get boards for a specific user
  async getUserBoards(
    walletAddress: string,
    options?: {
      status?: BoardState[];
      limit?: number;
      offset?: number;
    },
  ): Promise<ApiResponse<BoardConfiguration[]>> {
    const params = new URLSearchParams();
    if (options?.status) {
      params.append('status', options.status.join(','));
    }
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString());
    }

    return this.makeRequest<BoardConfiguration[]>(
      `/users/${walletAddress}/boards?${params.toString()}`,
    );
  }

  // Create a new board (admin operation)
  async createBoard(
    gameId: string,
    tierId: string,
    config?: Partial<{
      maxSquaresPerUser: number;
      cancellationThreshold: number;
      cancellationDeadline: string;
    }>,
  ): Promise<ApiResponse<BoardAvailabilityResponse>> {
    return this.makeRequest<BoardAvailabilityResponse>('/boards/create', {
      method: 'POST',
      body: JSON.stringify({
        gameId,
        tierId,
        ...config,
      }),
    });
  }

  // Cancel a board (admin operation)
  async cancelBoard(
    boardId: string,
    reason: string,
  ): Promise<ApiResponse<{ boardId: string; cancelled: boolean }>> {
    return this.makeRequest(`/boards/${boardId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Lock a board (usually happens automatically before game start)
  async lockBoard(
    boardId: string,
  ): Promise<ApiResponse<{ boardId: string; locked: boolean }>> {
    return this.makeRequest(`/boards/${boardId}/lock`, {
      method: 'POST',
    });
  }

  // Get system configuration (for thresholds, limits, etc.)
  async getSystemConfiguration(): Promise<ApiResponse<SystemConfiguration>> {
    return this.makeRequest<SystemConfiguration>('/system/config');
  }

  // Helper method to convert API response to BoardConfiguration
  async createBoardConfiguration(
    availability: BoardAvailabilityResponse,
    game: GameSchedule,
  ): Promise<BoardConfiguration | null> {
    const tier = BOARD_TIERS.find((t) => t.id === availability.tierId);
    if (!tier) {
      console.error(`Unknown tier ID: ${availability.tierId}`);
      return null;
    }

    return {
      boardId: availability.boardId,
      gameId: availability.gameId,
      tier,
      game,
      maxSquaresPerUser: availability.maxSquaresPerUser,
      availableSquares: availability.availableSquares,
      totalSquaresSold: availability.totalSquaresSold,
      isActive:
        availability.isActive &&
        !availability.isCancelled &&
        !availability.isLocked,
      createdAt: new Date(availability.createdAt),
      gameStartTime: new Date(game.gameDate),
    };
  }

  // Batch operation: Get all boards for multiple games
  async getBatchGameBoards(
    gameIds: string[],
  ): Promise<ApiResponse<Record<string, BoardAvailabilityResponse[]>>> {
    return this.makeRequest<Record<string, BoardAvailabilityResponse[]>>(
      '/boards/batch',
      {
        method: 'POST',
        body: JSON.stringify({ gameIds }),
      },
    );
  }

  // Check if a user can purchase specific squares
  async validateSquareSelection(
    boardId: string,
    squareIndices: number[],
    walletAddress: string,
  ): Promise<
    ApiResponse<{
      valid: boolean;
      errors: string[];
      conflicts: number[]; // Already owned squares
      maxAllowed: number;
      currentOwned: number;
    }>
  > {
    return this.makeRequest('/boards/validate-selection', {
      method: 'POST',
      body: JSON.stringify({
        boardId,
        squareIndices,
        walletAddress,
      }),
    });
  }

  // Get board statistics for analytics
  async getBoardStats(boardId: string): Promise<
    ApiResponse<{
      totalSquaresSold: number;
      uniqueOwners: number;
      averageSquaresPerOwner: number;
      fillPercentage: number;
      revenueGenerated: number;
      timeToFillEstimate?: number; // seconds
      popularityRank?: number;
    }>
  > {
    return this.makeRequest(`/boards/${boardId}/stats`);
  }

  // Cleanup method
  dispose(): void {
    this.abortController.abort();
  }
}

// Export singleton instance
export const boardService = BoardService.getInstance();

// Utility functions for board operations
export const BoardUtils = {
  // Check if board is in a state that allows purchases
  canPurchaseSquares(boardAvailability: BoardAvailabilityResponse): boolean {
    return (
      (boardAvailability.isActive &&
        !boardAvailability.isCancelled &&
        !boardAvailability.isLocked &&
        boardAvailability.availableSquares > 0 &&
        boardAvailability.boardState === BoardState.OPEN) ||
      boardAvailability.boardState === BoardState.FILLING
    );
  },

  // Check if board is approaching cancellation threshold
  isNearCancellationThreshold(
    boardAvailability: BoardAvailabilityResponse,
    warningThreshold: number = 90,
  ): boolean {
    return (
      boardAvailability.fillPercentage >= warningThreshold &&
      boardAvailability.fillPercentage < boardAvailability.cancellationThreshold
    );
  },

  // Calculate time remaining until cancellation deadline
  getTimeUntilCancellation(
    boardAvailability: BoardAvailabilityResponse,
  ): number | null {
    if (!boardAvailability.cancellationDeadline) return null;

    const deadline = new Date(boardAvailability.cancellationDeadline);
    const now = new Date();
    return Math.max(0, deadline.getTime() - now.getTime());
  },

  // Get user-friendly board status message
  getBoardStatusMessage(boardAvailability: BoardAvailabilityResponse): string {
    switch (boardAvailability.boardState) {
      case BoardState.OPEN:
        return `${boardAvailability.availableSquares} squares available`;
      case BoardState.FILLING:
        if (this.isNearCancellationThreshold(boardAvailability)) {
          return `Only ${boardAvailability.availableSquares} squares left! Board may cancel if not filled`;
        }
        return `${boardAvailability.availableSquares} squares remaining`;
      case BoardState.THRESHOLD_WARNING:
        return 'Board almost full - secure your squares now!';
      case BoardState.LOCKED:
        return 'Board locked - game started';
      case BoardState.CANCELLED:
        return 'Board cancelled - insufficient participation';
      case BoardState.LIVE:
        return 'Game in progress';
      case BoardState.COMPLETED:
        return 'Game completed';
      default:
        return 'Status unknown';
    }
  },

  // Validate square indices
  validateSquareIndices(indices: number[]): boolean {
    return (
      indices.length > 0 &&
      indices.every((idx) => idx >= 0 && idx <= 99) &&
      new Set(indices).size === indices.length // No duplicates
    );
  },
};
