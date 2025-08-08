import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { NFLTeam } from '@/lib/nflTeams';

interface UserPreferences {
  // User status
  isVIP: boolean;

  // Team preferences
  favoriteTeam?: NFLTeam;
  followedTeams: string[]; // team IDs

  // UI preferences
  theme: 'light' | 'dark' | 'system';
  chatPersistence: {
    isOpen: boolean;
    isMinimized: boolean;
  };
  dashboardLayout: 'grid' | 'list';

  // Notification preferences
  notifications: {
    gameStartReminders: boolean;
    winningNotifications: boolean;
    boardFillAlerts: boolean;
    emailNotifications: boolean;
  };

  // Game preferences
  defaultBoardTier?: string;
  autoSelectBoards: boolean;
  maxSquaresPerGame: number;

  // Accessibility
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };

  // Onboarding
  onboarding: {
    hasCompletedWalletSetup: boolean;
    hasPlayedFirstGame: boolean;
    hasSeenVIPFeatures: boolean;
    dismissedTips: string[];
  };
}

interface UserPrefsStore extends UserPreferences {
  // Actions
  setVIPStatus: (isVIP: boolean) => void;
  setFavoriteTeam: (team: NFLTeam) => void;
  followTeam: (teamId: string) => void;
  unfollowTeam: (teamId: string) => void;

  // UI preferences
  setTheme: (theme: UserPreferences['theme']) => void;
  updateChatPrefs: (prefs: Partial<UserPreferences['chatPersistence']>) => void;
  setDashboardLayout: (layout: UserPreferences['dashboardLayout']) => void;

  // Notifications
  updateNotificationPrefs: (
    prefs: Partial<UserPreferences['notifications']>,
  ) => void;

  // Game preferences
  setDefaultTier: (tierId: string) => void;
  toggleAutoSelect: () => void;
  setMaxSquares: (max: number) => void;

  // Accessibility
  updateAccessibilityPrefs: (
    prefs: Partial<UserPreferences['accessibility']>,
  ) => void;

  // Onboarding
  markOnboardingComplete: (step: keyof UserPreferences['onboarding']) => void;
  dismissTip: (tipId: string) => void;

  // Utilities
  reset: () => void;
  export: () => UserPreferences;
}

const initialState: UserPreferences = {
  isVIP: false,
  followedTeams: [],
  theme: 'system',
  chatPersistence: {
    isOpen: false,
    isMinimized: false,
  },
  dashboardLayout: 'grid',
  notifications: {
    gameStartReminders: true,
    winningNotifications: true,
    boardFillAlerts: false,
    emailNotifications: false,
  },
  autoSelectBoards: false,
  maxSquaresPerGame: 10,
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    screenReader: false,
  },
  onboarding: {
    hasCompletedWalletSetup: false,
    hasPlayedFirstGame: false,
    hasSeenVIPFeatures: false,
    dismissedTips: [],
  },
};

export const useUserPrefsStore = create<UserPrefsStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      setVIPStatus: (isVIP) => {
        set((state) => ({ ...state, isVIP }));
      },

      setFavoriteTeam: (favoriteTeam) => {
        set((state) => ({
          ...state,
          favoriteTeam,
          followedTeams: state.followedTeams.includes(favoriteTeam.id)
            ? state.followedTeams
            : [...state.followedTeams, favoriteTeam.id],
        }));
      },

      followTeam: (teamId) => {
        set((state) => ({
          ...state,
          followedTeams: state.followedTeams.includes(teamId)
            ? state.followedTeams
            : [...state.followedTeams, teamId],
        }));
      },

      unfollowTeam: (teamId) => {
        set((state) => ({
          ...state,
          followedTeams: state.followedTeams.filter((id) => id !== teamId),
          favoriteTeam:
            state.favoriteTeam?.id === teamId ? undefined : state.favoriteTeam,
        }));
      },

      setTheme: (theme) => {
        set((state) => ({ ...state, theme }));
      },

      updateChatPrefs: (prefs) => {
        set((state) => ({
          ...state,
          chatPersistence: { ...state.chatPersistence, ...prefs },
        }));
      },

      setDashboardLayout: (dashboardLayout) => {
        set((state) => ({ ...state, dashboardLayout }));
      },

      updateNotificationPrefs: (prefs) => {
        set((state) => ({
          ...state,
          notifications: { ...state.notifications, ...prefs },
        }));
      },

      setDefaultTier: (defaultBoardTier) => {
        set((state) => ({ ...state, defaultBoardTier }));
      },

      toggleAutoSelect: () => {
        set((state) => ({
          ...state,
          autoSelectBoards: !state.autoSelectBoards,
        }));
      },

      setMaxSquares: (maxSquaresPerGame) => {
        set((state) => ({ ...state, maxSquaresPerGame }));
      },

      updateAccessibilityPrefs: (prefs) => {
        set((state) => ({
          ...state,
          accessibility: { ...state.accessibility, ...prefs },
        }));
      },

      markOnboardingComplete: (step) => {
        set((state) => ({
          ...state,
          onboarding: { ...state.onboarding, [step]: true },
        }));
      },

      dismissTip: (tipId) => {
        set((state) => ({
          ...state,
          onboarding: {
            ...state.onboarding,
            dismissedTips: state.onboarding.dismissedTips.includes(tipId)
              ? state.onboarding.dismissedTips
              : [...state.onboarding.dismissedTips, tipId],
          },
        }));
      },

      reset: () => {
        set(initialState);
      },

      export: () => {
        return get() as UserPreferences;
      },
    })),
    {
      name: 'user-preferences',
      partialize: (state) => ({
        isVIP: state.isVIP,
        favoriteTeam: state.favoriteTeam,
        followedTeams: state.followedTeams,
        theme: state.theme,
        chatPersistence: state.chatPersistence,
        dashboardLayout: state.dashboardLayout,
        notifications: state.notifications,
        defaultBoardTier: state.defaultBoardTier,
        autoSelectBoards: state.autoSelectBoards,
        maxSquaresPerGame: state.maxSquaresPerGame,
        accessibility: state.accessibility,
        onboarding: state.onboarding,
      }),
    },
  ),
);

// Selectors
export const selectUserStatus = (state: UserPrefsStore) => ({
  isVIP: state.isVIP,
  favoriteTeam: state.favoriteTeam,
  followedTeams: state.followedTeams,
});

export const selectUIPrefs = (state: UserPrefsStore) => ({
  theme: state.theme,
  dashboardLayout: state.dashboardLayout,
  chatPersistence: state.chatPersistence,
});

export const selectGamePrefs = (state: UserPrefsStore) => ({
  defaultTier: state.defaultBoardTier,
  autoSelect: state.autoSelectBoards,
  maxSquares: state.maxSquaresPerGame,
});

export const selectNotificationPrefs = (state: UserPrefsStore) =>
  state.notifications;

export const selectAccessibilityPrefs = (state: UserPrefsStore) =>
  state.accessibility;

export const selectOnboardingStatus = (state: UserPrefsStore) => ({
  ...state.onboarding,
  needsOnboarding: !state.onboarding.hasCompletedWalletSetup,
  hasSeenTip: (tipId: string) => state.onboarding.dismissedTips.includes(tipId),
});
