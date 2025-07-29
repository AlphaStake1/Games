import { NFLTeam, getTeamById } from './nflTeams';
import { UserBoardPreferences, SquareSelection } from './boardTypes';

const USER_PREFERENCES_KEY = 'football-squares-user-prefs';

// Default to Dallas Cowboys if no team is selected (as specified in requirements)
const DEFAULT_TEAM_ID = 'dal';

export const getUserPreferences = (
  walletAddress: string,
): UserBoardPreferences | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(
      `${USER_PREFERENCES_KEY}-${walletAddress}`,
    );
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate and reconstruct the team object
    const team = getTeamById(parsed.favoriteTeam?.id);
    if (!team) return null;

    return {
      ...parsed,
      favoriteTeam: team,
      lastUpdated: parsed.lastUpdated || Date.now(),
    };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return null;
  }
};

export const saveUserPreferences = (
  preferences: UserBoardPreferences,
): void => {
  if (typeof window === 'undefined') return;

  try {
    const toStore = {
      ...preferences,
      lastUpdated: Date.now(),
    };

    localStorage.setItem(
      `${USER_PREFERENCES_KEY}-${preferences.walletAddress}`,
      JSON.stringify(toStore),
    );
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

export const createDefaultUserPreferences = (
  walletAddress: string,
): UserBoardPreferences => {
  console.log(
    'createDefaultUserPreferences: Creating for wallet:',
    walletAddress,
  );
  console.log(
    'createDefaultUserPreferences: Default team ID:',
    DEFAULT_TEAM_ID,
  );

  const defaultTeam = getTeamById(DEFAULT_TEAM_ID);
  console.log('createDefaultUserPreferences: Default team found:', defaultTeam);

  if (!defaultTeam) {
    console.error(
      'createDefaultUserPreferences: Default team not found for ID:',
      DEFAULT_TEAM_ID,
    );
    throw new Error('Default team not found');
  }

  const preferences = {
    walletAddress,
    favoriteTeam: defaultTeam,
    isVIP: false,
    selectedBoards: [],
    activeSelections: [],
    lastUpdated: Date.now(),
  };

  console.log(
    'createDefaultUserPreferences: Created preferences:',
    preferences,
  );
  return preferences;
};

export const updateFavoriteTeam = (
  walletAddress: string,
  team: NFLTeam,
): void => {
  const existing = getUserPreferences(walletAddress);
  if (existing) {
    saveUserPreferences({
      ...existing,
      favoriteTeam: team,
    });
  } else {
    saveUserPreferences({
      ...createDefaultUserPreferences(walletAddress),
      favoriteTeam: team,
    });
  }
};

export const updateVIPStatus = (
  walletAddress: string,
  isVIP: boolean,
): void => {
  const existing = getUserPreferences(walletAddress);
  if (existing) {
    saveUserPreferences({
      ...existing,
      isVIP,
    });
  }
};

export const addSquareSelection = (
  walletAddress: string,
  selection: SquareSelection,
): void => {
  const existing = getUserPreferences(walletAddress);
  if (existing) {
    const updatedSelections = existing.activeSelections.filter(
      (sel) => sel.boardId !== selection.boardId,
    );
    updatedSelections.push(selection);

    saveUserPreferences({
      ...existing,
      activeSelections: updatedSelections,
    });
  }
};

export const removeSquareSelection = (
  walletAddress: string,
  boardId: string,
): void => {
  const existing = getUserPreferences(walletAddress);
  if (existing) {
    saveUserPreferences({
      ...existing,
      activeSelections: existing.activeSelections.filter(
        (sel) => sel.boardId !== boardId,
      ),
    });
  }
};

export const addSelectedBoard = (
  walletAddress: string,
  boardId: string,
): void => {
  const existing = getUserPreferences(walletAddress);
  if (existing && !existing.selectedBoards.includes(boardId)) {
    saveUserPreferences({
      ...existing,
      selectedBoards: [...existing.selectedBoards, boardId],
    });
  }
};

export const removeSelectedBoard = (
  walletAddress: string,
  boardId: string,
): void => {
  const existing = getUserPreferences(walletAddress);
  if (existing) {
    saveUserPreferences({
      ...existing,
      selectedBoards: existing.selectedBoards.filter((id) => id !== boardId),
    });
  }
};

export const isFirstTimeUser = (walletAddress: string): boolean => {
  return getUserPreferences(walletAddress) === null;
};

// Hook for React components
import { useState, useEffect } from 'react';

export const useUserPreferences = (walletAddress: string | null) => {
  const [preferences, setPreferences] = useState<UserBoardPreferences | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    console.log('useUserPreferences: walletAddress changed:', walletAddress);

    if (!walletAddress) {
      console.log('useUserPreferences: No wallet address, setting defaults');
      setPreferences(null);
      setIsLoading(false);
      setIsFirstTime(false);
      return;
    }

    const loadPreferences = () => {
      console.log(
        'useUserPreferences: Loading preferences for:',
        walletAddress,
      );
      setIsLoading(true);

      try {
        const stored = getUserPreferences(walletAddress);
        console.log('useUserPreferences: Stored preferences:', stored);

        if (!stored) {
          console.log(
            'useUserPreferences: No stored preferences, creating defaults',
          );
          setIsFirstTime(true);
          const defaultPrefs = createDefaultUserPreferences(walletAddress);
          console.log(
            'useUserPreferences: Default preferences created:',
            defaultPrefs,
          );
          setPreferences(defaultPrefs);
          saveUserPreferences(defaultPrefs); // Persist the new defaults
        } else {
          console.log('useUserPreferences: Using stored preferences');
          setIsFirstTime(false);
          setPreferences(stored);
        }
      } catch (error) {
        console.error('useUserPreferences: Error loading preferences:', error);
        // Create safe defaults even if there's an error
        try {
          const safeDefaults = createDefaultUserPreferences(walletAddress);
          setPreferences(safeDefaults);
          setIsFirstTime(true);
        } catch (defaultError) {
          console.error(
            'useUserPreferences: Error creating defaults:',
            defaultError,
          );
          setPreferences(null);
        }
      }

      setIsLoading(false);
      console.log('useUserPreferences: Loading complete');
    };

    loadPreferences();
  }, [walletAddress]);

  const updatePreferences = (updates: Partial<UserBoardPreferences>) => {
    if (!preferences) return;

    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    saveUserPreferences(updated);
  };

  return {
    preferences,
    isLoading,
    isFirstTime,
    updatePreferences,
    setFavoriteTeam: (team: NFLTeam) => {
      updateFavoriteTeam(walletAddress || '', team);
      updatePreferences({ favoriteTeam: team });
    },
    setVIPStatus: (isVIP: boolean) => {
      updateVIPStatus(walletAddress || '', isVIP);
      updatePreferences({ isVIP });
    },
  };
};
