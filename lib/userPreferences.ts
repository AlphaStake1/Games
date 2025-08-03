import { NFLTeam, getTeamById } from './nflTeams';
import { UserBoardPreferences, SquareSelection } from './boardTypes';
import { geolocationService } from './geolocationService';

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

export const createDefaultUserPreferences = async (
  walletAddress: string,
): Promise<UserBoardPreferences> => {
  console.log(
    'createDefaultUserPreferences: Creating for wallet:',
    walletAddress,
  );

  try {
    // Use geolocation to assign team based on user's location
    const geoResult = await geolocationService.getTeamByLocation();
    const assignedTeam = geoResult.team;

    console.log('createDefaultUserPreferences: Team assigned by location:', {
      location: geoResult.location,
      team: assignedTeam.abbreviation,
    });

    const preferences = {
      walletAddress,
      favoriteTeam: assignedTeam,
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
  } catch (error) {
    console.error(
      'createDefaultUserPreferences: Geolocation failed, using fallback:',
      error,
    );

    // Fallback to default team if geolocation fails
    const defaultTeam = getTeamById(DEFAULT_TEAM_ID);
    if (!defaultTeam) {
      throw new Error('Default team not found');
    }

    return {
      walletAddress,
      favoriteTeam: defaultTeam,
      isVIP: false,
      selectedBoards: [],
      activeSelections: [],
      lastUpdated: Date.now(),
    };
  }
};

export const updateFavoriteTeam = async (
  walletAddress: string,
  team: NFLTeam,
): Promise<void> => {
  const existing = getUserPreferences(walletAddress);
  if (existing) {
    saveUserPreferences({
      ...existing,
      favoriteTeam: team,
    });
  } else {
    const defaultPrefs = await createDefaultUserPreferences(walletAddress);
    saveUserPreferences({
      ...defaultPrefs,
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

    const loadPreferences = async () => {
      console.log(
        'useUserPreferences: Loading preferences for:',
        walletAddress,
      );
      setIsLoading(true);

      // Use setTimeout to ensure the loading state is set before processing
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const stored = getUserPreferences(walletAddress);
        console.log('useUserPreferences: Stored preferences:', stored);

        if (!stored) {
          console.log(
            'useUserPreferences: No stored preferences, creating defaults',
          );
          setIsFirstTime(true);
          const defaultPrefs =
            await createDefaultUserPreferences(walletAddress);
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
          const safeDefaults =
            await createDefaultUserPreferences(walletAddress);
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
    setFavoriteTeam: async (team: NFLTeam) => {
      await updateFavoriteTeam(walletAddress || '', team);
      updatePreferences({ favoriteTeam: team });
    },
    setVIPStatus: (isVIP: boolean) => {
      updateVIPStatus(walletAddress || '', isVIP);
      updatePreferences({ isVIP });
    },
  };
};
