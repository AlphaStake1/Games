// React hooks for managing board data with real API integration
// Replaces mock data with proper state management and error handling

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardAvailabilityResponse,
  BoardSquaresResponse,
  PurchaseSquareRequest,
  PurchaseSquareResponse,
  BoardUpdateEvent,
  BoardState,
  ApiResponse,
} from '@/lib/api/types';
import { BoardConfiguration, GameSchedule } from '@/lib/boardTypes';
import { boardService, BoardUtils } from '@/lib/api/boardService';
import { websocketService, WebSocketUtils } from '@/lib/api/websocketService';

export interface UseBoardDataOptions {
  gameId?: string;
  boardId?: string;
  tierId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

export interface UseBoardDataResult {
  // Data
  boardAvailability: BoardAvailabilityResponse | null;
  boardSquares: BoardSquaresResponse | null;
  boardConfiguration: BoardConfiguration | null;

  // Loading states
  loading: boolean;
  refreshing: boolean;
  purchasing: boolean;

  // Error states
  error: string | null;
  purchaseError: string | null;

  // Actions
  refreshBoard: () => Promise<void>;
  purchaseSquares: (
    request: PurchaseSquareRequest,
  ) => Promise<PurchaseSquareResponse | null>;
  validateSelection: (
    squareIndices: number[],
    walletAddress: string,
  ) => Promise<boolean>;
  clearErrors: () => void;

  // Real-time status
  isConnected: boolean;
  lastUpdate: Date | null;
}

export function useBoardData(options: UseBoardDataOptions): UseBoardDataResult {
  const {
    gameId,
    boardId,
    tierId,
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    enableRealTime = true,
  } = options;

  // State
  const [boardAvailability, setBoardAvailability] =
    useState<BoardAvailabilityResponse | null>(null);
  const [boardSquares, setBoardSquares] = useState<BoardSquaresResponse | null>(
    null,
  );
  const [boardConfiguration, setBoardConfiguration] =
    useState<BoardConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Refs
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // WebSocket event handlers
  const handleBoardUpdate = useCallback(
    (event: BoardUpdateEvent) => {
      if (!mountedRef.current) return;

      setLastUpdate(new Date());

      switch (event.type) {
        case 'square_purchased':
          // Update board availability and squares data
          if (
            boardAvailability &&
            event.data.newAvailableSquares !== undefined
          ) {
            setBoardAvailability((prev) =>
              prev
                ? {
                    ...prev,
                    availableSquares: event.data.newAvailableSquares,
                    totalSquaresSold: 100 - event.data.newAvailableSquares,
                    fillPercentage:
                      event.data.fillPercentage ||
                      ((100 - event.data.newAvailableSquares) / 100) * 100,
                  }
                : null,
            );
          }
          // Refresh squares data to get latest ownership
          if (boardId) {
            refreshBoardSquares();
          }
          break;

        case 'board_locked':
          setBoardAvailability((prev) =>
            prev
              ? {
                  ...prev,
                  isLocked: true,
                  boardState: BoardState.LOCKED,
                }
              : null,
          );
          break;

        case 'board_cancelled':
          setBoardAvailability((prev) =>
            prev
              ? {
                  ...prev,
                  isCancelled: true,
                  boardState: BoardState.CANCELLED,
                }
              : null,
          );
          break;

        case 'vrf_completed':
          setBoardAvailability((prev) =>
            prev
              ? {
                  ...prev,
                  vrfStatus: {
                    isRandomized: true,
                    randomizationTxHash: event.data.vrfTxHash,
                    randomizationTimestamp: event.data.timestamp,
                    homeNumbers: event.data.homeNumbers,
                    awayNumbers: event.data.awayNumbers,
                  },
                }
              : null,
          );
          break;
      }
    },
    [boardAvailability, boardId],
  );

  // Fetch board availability
  const fetchBoardAvailability = useCallback(async (): Promise<void> => {
    if (!gameId || !tierId) return;

    try {
      const response = await boardService.getBoardAvailability(gameId, tierId);

      if (!mountedRef.current) return;

      if (response.success && response.data) {
        setBoardAvailability(response.data);
        setError(null);
      } else {
        setError(
          response.error?.message || 'Failed to fetch board availability',
        );
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [gameId, tierId]);

  // Fetch board squares
  const fetchBoardSquares = useCallback(async (): Promise<void> => {
    if (!boardId) return;

    try {
      const response = await boardService.getBoardSquares(boardId);

      if (!mountedRef.current) return;

      if (response.success && response.data) {
        setBoardSquares(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Failed to fetch board squares');
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [boardId]);

  // Refresh board squares (separate function for WebSocket updates)
  const refreshBoardSquares = useCallback(async (): Promise<void> => {
    await fetchBoardSquares();
  }, [fetchBoardSquares]);

  // Refresh all board data
  const refreshBoard = useCallback(async (): Promise<void> => {
    if (loading) return;

    setRefreshing(true);
    setError(null);

    try {
      await Promise.all([
        fetchBoardAvailability(),
        boardId ? fetchBoardSquares() : Promise.resolve(),
      ]);
    } finally {
      if (mountedRef.current) {
        setRefreshing(false);
      }
    }
  }, [loading, fetchBoardAvailability, fetchBoardSquares, boardId]);

  // Purchase squares
  const purchaseSquares = useCallback(
    async (
      request: PurchaseSquareRequest,
    ): Promise<PurchaseSquareResponse | null> => {
      if (purchasing) return null;

      setPurchasing(true);
      setPurchaseError(null);

      try {
        const response = await boardService.purchaseSquares(request);

        if (!mountedRef.current) return null;

        if (response.success && response.data) {
          // Refresh board data after successful purchase
          await refreshBoard();
          return response.data;
        } else {
          setPurchaseError(
            response.error?.message || 'Failed to purchase squares',
          );
          return null;
        }
      } catch (err) {
        if (!mountedRef.current) return null;
        setPurchaseError(
          err instanceof Error ? err.message : 'Unknown error occurred',
        );
        return null;
      } finally {
        if (mountedRef.current) {
          setPurchasing(false);
        }
      }
    },
    [purchasing, refreshBoard],
  );

  // Validate square selection
  const validateSelection = useCallback(
    async (
      squareIndices: number[],
      walletAddress: string,
    ): Promise<boolean> => {
      if (!boardId || !BoardUtils.validateSquareIndices(squareIndices)) {
        return false;
      }

      try {
        const response = await boardService.validateSquareSelection(
          boardId,
          squareIndices,
          walletAddress,
        );

        return response.success && response.data?.valid === true;
      } catch (err) {
        console.error('Validation error:', err);
        return false;
      }
    },
    [boardId],
  );

  // Clear errors
  const clearErrors = useCallback((): void => {
    setError(null);
    setPurchaseError(null);
  }, []);

  // Create board configuration from availability and game data
  useEffect(() => {
    if (boardAvailability) {
      // Note: You'll need to pass game data to create a complete BoardConfiguration
      // This is a simplified version that works with the current structure
      setBoardConfiguration({
        boardId: boardAvailability.boardId,
        gameId: boardAvailability.gameId,
        tier: { id: boardAvailability.tierId } as any, // You'll need the full tier data
        game: {} as GameSchedule, // You'll need the full game data
        maxSquaresPerUser: boardAvailability.maxSquaresPerUser,
        availableSquares: boardAvailability.availableSquares,
        totalSquaresSold: boardAvailability.totalSquaresSold,
        isActive:
          boardAvailability.isActive &&
          !boardAvailability.isCancelled &&
          !boardAvailability.isLocked,
        createdAt: new Date(boardAvailability.createdAt),
        gameStartTime: new Date(), // You'll need the actual game start time
      });
    }
  }, [boardAvailability]);

  // Initial data load
  useEffect(() => {
    if (!gameId || !tierId) return;

    setLoading(true);
    refreshBoard().finally(() => {
      if (mountedRef.current) {
        setLoading(false);
      }
    });
  }, [gameId, tierId, refreshBoard]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh || loading) return;

    refreshTimerRef.current = setInterval(() => {
      if (!purchasing) {
        refreshBoard();
      }
    }, refreshInterval);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, loading, purchasing, refreshBoard, refreshInterval]);

  // WebSocket connection and subscriptions
  useEffect(() => {
    if (!enableRealTime) return;

    const connectionHandler = (connected: boolean) => {
      setIsConnected(connected);
    };

    websocketService.addConnectionHandler(connectionHandler);
    websocketService.connect();

    return () => {
      websocketService.removeConnectionHandler(connectionHandler);
    };
  }, [enableRealTime]);

  // WebSocket board subscription
  useEffect(() => {
    if (!enableRealTime || !boardId) return;

    websocketService.subscribeToBoard(boardId, handleBoardUpdate);

    return () => {
      websocketService.unsubscribeFromBoard(boardId, handleBoardUpdate);
    };
  }, [enableRealTime, boardId, handleBoardUpdate]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  return {
    // Data
    boardAvailability,
    boardSquares,
    boardConfiguration,

    // Loading states
    loading,
    refreshing,
    purchasing,

    // Error states
    error,
    purchaseError,

    // Actions
    refreshBoard,
    purchaseSquares,
    validateSelection,
    clearErrors,

    // Real-time status
    isConnected,
    lastUpdate,
  };
}

// Hook for managing multiple boards (e.g., for a game with multiple tiers)
export function useGameBoards(gameId: string | undefined) {
  const [boards, setBoards] = useState<BoardAvailabilityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameBoards = useCallback(async () => {
    if (!gameId) {
      console.log('useGameBoards: No gameId provided');
      return;
    }

    console.log('useGameBoards: Fetching boards for gameId:', gameId);
    setLoading(true);
    setError(null);

    try {
      const response = await boardService.getGameBoards(gameId);
      console.log('useGameBoards: Received response:', {
        success: response.success,
        dataLength: response.data?.length || 0,
        error: response.error?.message || 'none',
      });

      if (response.success && response.data) {
        console.log(
          'useGameBoards: Setting boards data:',
          response.data.length,
          'boards',
        );
        setBoards(response.data);
      } else {
        console.error(
          'useGameBoards: Failed to fetch boards:',
          response.error?.message,
        );
        setError(response.error?.message || 'Failed to fetch game boards');
      }
    } catch (err) {
      console.error('useGameBoards: Exception occurred:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameBoards();
  }, [fetchGameBoards]);

  return {
    boards,
    loading,
    error,
    refetch: fetchGameBoards,
  };
}
