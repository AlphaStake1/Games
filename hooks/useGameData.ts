// React hooks for managing NFL game data with real API integration
// Replaces mock game generation with proper NFL schedule data

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameScheduleResponse,
  NFLScheduleFilters,
  GameStatus,
  ApiResponse,
} from '@/lib/api/types';
import { GameSchedule } from '@/lib/boardTypes';
import { NFLTeam } from '@/lib/nflTeams';
import { gameService, GameUtils } from '@/lib/api/gameService';
import { websocketService, WebSocketUtils } from '@/lib/api/websocketService';

export interface UseGameDataOptions {
  teamId?: string;
  season?: number;
  week?: number;
  upcomingOnly?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

export interface UseGameDataResult {
  // Data
  games: GameSchedule[];
  gameStatuses: Record<string, GameStatus>;

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // Error states
  error: string | null;

  // Actions
  refreshGames: () => Promise<void>;
  refreshGameStatuses: () => Promise<void>;
  getGameStatus: (gameId: string) => GameStatus | undefined;

  // Utility
  currentWeek: number;
  currentSeason: number;
  isConnected: boolean;
  lastUpdate: Date | null;
}

export function useGameData(
  options: UseGameDataOptions = {},
): UseGameDataResult {
  const {
    teamId,
    season,
    week,
    upcomingOnly = false,
    autoRefresh = true,
    refreshInterval = 60000, // 1 minute
    enableRealTime = true,
  } = options;

  // State
  const [games, setGames] = useState<GameSchedule[]>([]);
  const [gameStatuses, setGameStatuses] = useState<Record<string, GameStatus>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Refs
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Ensure mountedRef is always true on hook initialization
  mountedRef.current = true;

  // Debug: Log mount state changes
  console.log('useGameData: Hook initialized, mounted:', mountedRef.current);

  // Get current week and season
  const currentWeek = gameService.getCurrentWeek();
  const currentSeason = gameService.getCurrentSeason();

  // WebSocket event handlers
  const handleGameUpdate = useCallback((event: any) => {
    if (!mountedRef.current) return;

    setLastUpdate(new Date());

    if (event.type === 'score_update' && event.data.gameId) {
      setGameStatuses((prev) => ({
        ...prev,
        [event.data.gameId]: {
          ...prev[event.data.gameId],
          ...event.data,
          lastUpdated: event.timestamp,
        },
      }));
    }
  }, []);

  // Fetch games
  const fetchGames = useCallback(async (): Promise<void> => {
    console.log('useGameData.fetchGames called with options:', {
      teamId,
      season,
      week,
      upcomingOnly,
      currentSeason,
      currentWeek,
    });

    try {
      const filters: NFLScheduleFilters = {
        season: season || currentSeason,
        week: week, // Use week if provided, otherwise undefined
        teamId,
      };

      console.log('Filters prepared:', filters);

      let response: ApiResponse<GameScheduleResponse[]>;

      if (teamId && upcomingOnly) {
        console.log('Using team-specific method for upcoming games');
        // Use team-specific method for upcoming games
        response = await gameService.getTeamGames(teamId, {
          season: filters.season,
          upcoming: true,
        });
      } else if (teamId) {
        console.log('Using team-specific method for all games');
        // Use team-specific method for all team games
        response = await gameService.getTeamGames(teamId, {
          season: filters.season,
          upcoming: upcomingOnly,
        });
      } else {
        console.log('Using general schedule method');
        // Use general schedule method
        response = await gameService.getSchedule(filters);
      }

      console.log('API Response received:', {
        success: response.success,
        dataLength: response.data?.length || 0,
        error: response.error?.message || 'none',
      });

      console.log('useGameData: Component mounted check:', {
        mounted: mountedRef.current,
      });
      if (!mountedRef.current) {
        console.log(
          'useGameData: Component not mounted, skipping state update',
        );
        return;
      }

      if (response.success && response.data) {
        console.log('useGameData: Raw API data:', response.data.slice(0, 2)); // Log first 2 items
        const gameSchedules = response.data.map(
          gameService.convertToGameSchedule,
        );
        console.log(
          'useGameData: Converted game schedules:',
          gameSchedules.slice(0, 2),
        ); // Log first 2 converted items
        console.log(
          'useGameData: Setting games state with',
          gameSchedules.length,
          'games',
        );
        setGames(gameSchedules);
        setError(null);
        console.log('useGameData: Games state update completed');
      } else {
        console.error('Failed to get games:', response.error?.message);
        setError(response.error?.message || 'Failed to fetch games');
        setGames([]);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('Error in fetchGames:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setGames([]);
    }
  }, [teamId, season, week, upcomingOnly, currentSeason, currentWeek]);

  // Fetch game statuses
  const fetchGameStatuses = useCallback(async (): Promise<void> => {
    if (games.length === 0) return;

    try {
      const gameIds = games.map((game) => game.gameId);
      const response = await gameService.getBatchGameStatuses(gameIds);

      if (!mountedRef.current) return;

      if (response.success && response.data) {
        setGameStatuses(response.data);
      } else {
        console.warn('Failed to fetch game statuses:', response.error?.message);
      }
    } catch (err) {
      console.warn('Error fetching game statuses:', err);
    }
  }, [games]);

  // Refresh games
  const refreshGames = useCallback(async (): Promise<void> => {
    if (loading) return;

    setRefreshing(true);
    setError(null);

    try {
      await fetchGames();
    } finally {
      if (mountedRef.current) {
        setRefreshing(false);
      }
    }
  }, [loading, fetchGames]);

  // Refresh game statuses
  const refreshGameStatuses = useCallback(async (): Promise<void> => {
    await fetchGameStatuses();
  }, [fetchGameStatuses]);

  // Get specific game status
  const getGameStatus = useCallback(
    (gameId: string): GameStatus | undefined => {
      return gameStatuses[gameId];
    },
    [gameStatuses],
  );

  // Initial data load
  useEffect(() => {
    setLoading(true);
    fetchGames().finally(() => {
      if (mountedRef.current) {
        setLoading(false);
      }
    });
  }, [fetchGames]);

  // Fetch game statuses when games change
  useEffect(() => {
    if (games.length > 0) {
      fetchGameStatuses();
    }
  }, [games, fetchGameStatuses]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh || loading) return;

    refreshTimerRef.current = setInterval(() => {
      // Refresh games less frequently than statuses
      if (Date.now() % (refreshInterval * 5) < refreshInterval) {
        refreshGames();
      } else {
        refreshGameStatuses();
      }
    }, refreshInterval);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [
    autoRefresh,
    loading,
    refreshInterval,
    refreshGames,
    refreshGameStatuses,
  ]);

  // WebSocket connection
  useEffect(() => {
    if (!enableRealTime) return;

    const connectionHandler = (connected: boolean) => {
      if (!mountedRef.current) return;
      setIsConnected(connected);
      if (connected) {
        setLastUpdate(new Date());
      }
    };

    websocketService.addConnectionHandler(connectionHandler);
    websocketService.connect();

    return () => {
      websocketService.removeConnectionHandler(connectionHandler);
    };
  }, [enableRealTime]);

  // WebSocket game subscriptions
  useEffect(() => {
    if (!enableRealTime || games.length === 0) return;

    games.forEach((game) => {
      websocketService.subscribeToGame(game.gameId, handleGameUpdate);
    });

    return () => {
      games.forEach((game) => {
        websocketService.unsubscribeFromGame(game.gameId, handleGameUpdate);
      });
    };
  }, [enableRealTime, games, handleGameUpdate]);

  // Cleanup
  useEffect(() => {
    console.log('useGameData: Cleanup effect registered');
    return () => {
      console.log(
        'useGameData: Component unmounting, setting mounted to false',
      );
      mountedRef.current = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  return {
    // Data
    games,
    gameStatuses,

    // Loading states
    loading,
    refreshing,

    // Error states
    error,

    // Actions
    refreshGames,
    refreshGameStatuses,
    getGameStatus,

    // Utility
    currentWeek,
    currentSeason,
    isConnected,
    lastUpdate,
  };
}

// Hook for a single game's data and status
export function useGameStatus(gameId: string | undefined) {
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameStatus = useCallback(async () => {
    if (!gameId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await gameService.getGameStatus(gameId);

      if (response.success && response.data) {
        setGameStatus(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch game status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameStatus();
  }, [fetchGameStatus]);

  // Real-time updates - Disabled for development with mock data
  useEffect(() => {
    if (!gameId) return;

    // For development with mock data, skip WebSocket updates
    // In production, uncomment below:
    // const handler = WebSocketUtils.createScoreUpdateHandler(
    //   (updatedGameId, scoreData) => {
    //     if (updatedGameId === gameId) {
    //       setGameStatus((prev) => (prev ? { ...prev, ...scoreData } : null));
    //     }
    //   },
    // );
    //
    // websocketService.subscribeToGame(gameId, handler);
    //
    // return () => {
    //   websocketService.unsubscribeFromGame(gameId, handler);
    // };
  }, [gameId]);

  return {
    gameStatus,
    loading,
    error,
    refetch: fetchGameStatus,
    isLive: gameStatus ? GameUtils.isGameLive(gameStatus) : false,
    isCompleted: gameStatus ? GameUtils.isGameCompleted(gameStatus) : false,
  };
}

// Hook for team-specific games
export function useTeamGames(
  team: NFLTeam | undefined,
  options: {
    upcomingOnly?: boolean;
    season?: number;
  } = {},
) {
  return useGameData({
    teamId: team?.id,
    upcomingOnly: options.upcomingOnly,
    season: options.season,
  });
}

// Hook for current week games
export function useCurrentWeekGames() {
  return useGameData({
    week: gameService.getCurrentWeek(),
    season: gameService.getCurrentSeason(),
  });
}
