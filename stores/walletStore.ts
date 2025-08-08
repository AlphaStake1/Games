import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Connection, PublicKey } from '@solana/web3.js';

interface WalletState {
  // Connection status
  isConnected: boolean;
  isConnecting: boolean;
  address?: string;
  publicKey?: PublicKey;

  // Network validation
  expectedNetwork: string;
  actualNetwork?: string;
  hasNetworkMismatch: boolean;

  // Balance and transactions
  balance?: number;
  lastBalanceUpdate?: number;
  pendingTransactions: string[];

  // Error states
  connectionError?: string;
  lastError?: string;
}

interface WalletStore extends WalletState {
  // Actions
  setConnected: (address: string, publicKey: PublicKey) => void;
  setConnecting: (isConnecting: boolean) => void;
  setDisconnected: () => void;
  setBalance: (balance: number) => void;
  setNetworkMismatch: (expected: string, actual?: string) => void;
  addPendingTransaction: (signature: string) => void;
  removePendingTransaction: (signature: string) => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  expectedNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'testnet',
  hasNetworkMismatch: false,
  pendingTransactions: [],
};

export const useWalletStore = create<WalletStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setConnected: (address, publicKey) => {
      set((state) => ({
        ...state,
        isConnected: true,
        isConnecting: false,
        address,
        publicKey,
        connectionError: undefined,
        lastError: undefined,
      }));
    },

    setConnecting: (isConnecting) => {
      set((state) => ({
        ...state,
        isConnecting,
        connectionError: isConnecting ? undefined : state.connectionError,
      }));
    },

    setDisconnected: () => {
      set((state) => ({
        ...state,
        isConnected: false,
        isConnecting: false,
        address: undefined,
        publicKey: undefined,
        balance: undefined,
        lastBalanceUpdate: undefined,
        pendingTransactions: [],
        hasNetworkMismatch: false,
        actualNetwork: undefined,
      }));
    },

    setBalance: (balance) => {
      set((state) => ({
        ...state,
        balance,
        lastBalanceUpdate: Date.now(),
      }));
    },

    setNetworkMismatch: (expected, actual) => {
      set((state) => ({
        ...state,
        expectedNetwork: expected,
        actualNetwork: actual,
        hasNetworkMismatch: actual ? actual !== expected : false,
      }));
    },

    addPendingTransaction: (signature) => {
      set((state) => ({
        ...state,
        pendingTransactions: [...state.pendingTransactions, signature],
      }));
    },

    removePendingTransaction: (signature) => {
      set((state) => ({
        ...state,
        pendingTransactions: state.pendingTransactions.filter(
          (tx) => tx !== signature,
        ),
      }));
    },

    setError: (error) => {
      set((state) => ({
        ...state,
        lastError: error,
        connectionError: state.isConnecting ? error : state.connectionError,
      }));
    },

    clearError: () => {
      set((state) => ({
        ...state,
        lastError: undefined,
        connectionError: undefined,
      }));
    },

    reset: () => {
      set({
        ...initialState,
        expectedNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'testnet',
      });
    },
  })),
);

// Selectors
export const selectWalletConnection = (state: WalletStore) => ({
  isConnected: state.isConnected,
  isConnecting: state.isConnecting,
  address: state.address,
  publicKey: state.publicKey,
  hasError: !!state.connectionError,
  error: state.connectionError,
});

export const selectWalletBalance = (state: WalletStore) => ({
  balance: state.balance,
  lastUpdate: state.lastBalanceUpdate,
  isStale: state.lastBalanceUpdate
    ? Date.now() - state.lastBalanceUpdate > 30000
    : true, // 30s staleness
});

export const selectNetworkStatus = (state: WalletStore) => ({
  expectedNetwork: state.expectedNetwork,
  actualNetwork: state.actualNetwork,
  hasNetworkMismatch: state.hasNetworkMismatch,
  needsNetworkSwitch: state.hasNetworkMismatch && state.isConnected,
});

export const selectTransactionStatus = (state: WalletStore) => ({
  pendingCount: state.pendingTransactions.length,
  pendingTransactions: state.pendingTransactions,
  hasPendingTransactions: state.pendingTransactions.length > 0,
});
