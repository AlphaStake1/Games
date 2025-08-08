import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { BoardAvailabilityResponse } from '@/lib/api/types';

interface BoardData {
  boardId: string;
  gameId: string;
  tierId: string;
  availability: BoardAvailabilityResponse;
  lastUpdated: number;
}

interface BoardState {
  // Board data by ID
  boards: Record<string, BoardData>;

  // UI state
  selectedBoards: string[];
  selectedGameId?: string;

  // Loading states
  loadingBoards: Record<string, boolean>; // gameId -> loading
  refreshingBoards: Record<string, boolean>; // gameId -> refreshing

  // Cache management
  lastRefreshByGame: Record<string, number>; // gameId -> timestamp

  // Errors
  errors: Record<string, string>; // gameId -> error message
}

interface BoardStore extends BoardState {
  // Actions
  setBoardsForGame: (
    gameId: string,
    boards: BoardAvailabilityResponse[],
  ) => void;
  updateBoardAvailability: (
    boardId: string,
    availability: Partial<BoardAvailabilityResponse>,
  ) => void;

  // Selection
  selectBoard: (boardId: string) => void;
  deselectBoard: (boardId: string) => void;
  clearSelection: () => void;
  setSelectedGame: (gameId: string) => void;

  // Loading states
  setLoadingGame: (gameId: string, loading: boolean) => void;
  setRefreshingGame: (gameId: string, refreshing: boolean) => void;

  // Error handling
  setGameError: (gameId: string, error: string) => void;
  clearGameError: (gameId: string) => void;

  // Cache management
  markGameRefreshed: (gameId: string) => void;
  needsRefresh: (gameId: string, maxAge?: number) => boolean;
  clearExpiredBoards: (maxAge?: number) => void;

  // Cleanup
  clearGameData: (gameId: string) => void;
  reset: () => void;
}

const initialState: BoardState = {
  boards: {},
  selectedBoards: [],
  loadingBoards: {},
  refreshingBoards: {},
  lastRefreshByGame: {},
  errors: {},
};

export const useBoardStore = create<BoardStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setBoardsForGame: (gameId, boardsData) => {
      const boardsMap: Record<string, BoardData> = {};
      const now = Date.now();

      boardsData.forEach((availability) => {
        boardsMap[availability.boardId] = {
          boardId: availability.boardId,
          gameId,
          tierId: availability.tierId,
          availability,
          lastUpdated: now,
        };
      });

      set((state) => ({
        ...state,
        boards: {
          ...state.boards,
          ...boardsMap,
        },
        lastRefreshByGame: {
          ...state.lastRefreshByGame,
          [gameId]: now,
        },
        loadingBoards: {
          ...state.loadingBoards,
          [gameId]: false,
        },
        errors: {
          ...state.errors,
          [gameId]: undefined,
        },
      }));
    },

    updateBoardAvailability: (boardId, updates) => {
      set((state) => {
        const currentBoard = state.boards[boardId];
        if (!currentBoard) return state;

        return {
          ...state,
          boards: {
            ...state.boards,
            [boardId]: {
              ...currentBoard,
              availability: {
                ...currentBoard.availability,
                ...updates,
              },
              lastUpdated: Date.now(),
            },
          },
        };
      });
    },

    selectBoard: (boardId) => {
      set((state) => ({
        ...state,
        selectedBoards: state.selectedBoards.includes(boardId)
          ? state.selectedBoards
          : [...state.selectedBoards, boardId],
      }));
    },

    deselectBoard: (boardId) => {
      set((state) => ({
        ...state,
        selectedBoards: state.selectedBoards.filter((id) => id !== boardId),
      }));
    },

    clearSelection: () => {
      set((state) => ({
        ...state,
        selectedBoards: [],
      }));
    },

    setSelectedGame: (gameId) => {
      set((state) => ({
        ...state,
        selectedGameId: gameId,
      }));
    },

    setLoadingGame: (gameId, loading) => {
      set((state) => ({
        ...state,
        loadingBoards: {
          ...state.loadingBoards,
          [gameId]: loading,
        },
      }));
    },

    setRefreshingGame: (gameId, refreshing) => {
      set((state) => ({
        ...state,
        refreshingBoards: {
          ...state.refreshingBoards,
          [gameId]: refreshing,
        },
      }));
    },

    setGameError: (gameId, error) => {
      set((state) => ({
        ...state,
        errors: {
          ...state.errors,
          [gameId]: error,
        },
        loadingBoards: {
          ...state.loadingBoards,
          [gameId]: false,
        },
      }));
    },

    clearGameError: (gameId) => {
      set((state) => ({
        ...state,
        errors: {
          ...state.errors,
          [gameId]: undefined,
        },
      }));
    },

    markGameRefreshed: (gameId) => {
      set((state) => ({
        ...state,
        lastRefreshByGame: {
          ...state.lastRefreshByGame,
          [gameId]: Date.now(),
        },
      }));
    },

    needsRefresh: (gameId, maxAge = 30000) => {
      // 30 seconds default
      const lastRefresh = get().lastRefreshByGame[gameId];
      return !lastRefresh || Date.now() - lastRefresh > maxAge;
    },

    clearExpiredBoards: (maxAge = 300000) => {
      // 5 minutes default
      const now = Date.now();
      set((state) => {
        const freshBoards: Record<string, BoardData> = {};
        Object.entries(state.boards).forEach(([boardId, board]) => {
          if (now - board.lastUpdated <= maxAge) {
            freshBoards[boardId] = board;
          }
        });

        return {
          ...state,
          boards: freshBoards,
        };
      });
    },

    clearGameData: (gameId) => {
      set((state) => {
        const filteredBoards: Record<string, BoardData> = {};
        Object.entries(state.boards).forEach(([boardId, board]) => {
          if (board.gameId !== gameId) {
            filteredBoards[boardId] = board;
          }
        });

        return {
          ...state,
          boards: filteredBoards,
          loadingBoards: {
            ...state.loadingBoards,
            [gameId]: undefined,
          },
          refreshingBoards: {
            ...state.refreshingBoards,
            [gameId]: undefined,
          },
          lastRefreshByGame: {
            ...state.lastRefreshByGame,
            [gameId]: undefined,
          },
          errors: {
            ...state.errors,
            [gameId]: undefined,
          },
        };
      });
    },

    reset: () => {
      set(initialState);
    },
  })),
);

// Selectors
export const selectBoardsForGame = (gameId: string) => (state: BoardStore) => {
  return Object.values(state.boards).filter((board) => board.gameId === gameId);
};

export const selectBoardById = (boardId: string) => (state: BoardStore) => {
  return state.boards[boardId];
};

export const selectGameLoadingState =
  (gameId: string) => (state: BoardStore) => ({
    isLoading: state.loadingBoards[gameId] || false,
    isRefreshing: state.refreshingBoards[gameId] || false,
    error: state.errors[gameId],
    lastRefresh: state.lastRefreshByGame[gameId],
    needsRefresh:
      !state.lastRefreshByGame[gameId] ||
      Date.now() - state.lastRefreshByGame[gameId] > 30000,
  });

export const selectSelectedBoards = (state: BoardStore) => ({
  selectedIds: state.selectedBoards,
  selectedBoards: state.selectedBoards
    .map((id) => state.boards[id])
    .filter(Boolean),
  hasSelection: state.selectedBoards.length > 0,
  selectedCount: state.selectedBoards.length,
});
