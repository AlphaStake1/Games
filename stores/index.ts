// Export all stores
export {
  useNetworkStore,
  selectNetworkHealth,
  selectNetworkInfo,
} from './networkStore';
export {
  useWalletStore,
  selectWalletConnection,
  selectWalletBalance,
  selectNetworkStatus,
  selectTransactionStatus,
} from './walletStore';
export {
  useBoardStore,
  selectBoardsForGame,
  selectBoardById,
  selectGameLoadingState,
  selectSelectedBoards,
} from './boardStore';
export {
  useUserPrefsStore,
  selectUserStatus,
  selectUIPrefs,
  selectGamePrefs,
  selectNotificationPrefs,
  selectAccessibilityPrefs,
  selectOnboardingStatus,
} from './userPrefsStore';

// Re-export types
export type { NetworkStore } from './networkStore';
export type { WalletStore } from './walletStore';
export type { BoardStore } from './boardStore';
export type { UserPrefsStore } from './userPrefsStore';
