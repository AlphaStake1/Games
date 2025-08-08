import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface NetworkStatus {
  name: 'mainnet-beta' | 'testnet' | 'devnet' | 'unknown';
  rpcUrl: string;
  isConnected: boolean;
  latency?: number;
  wsConnected: boolean;
  lastPingAt?: number;
  lastPongAt?: number;
  connectionError?: string;
}

interface NetworkStore extends NetworkStatus {
  // Actions
  updateRpcStatus: (
    status: Partial<
      Pick<NetworkStatus, 'isConnected' | 'latency' | 'connectionError'>
    >,
  ) => void;
  updateWsStatus: (
    status: Partial<
      Pick<NetworkStatus, 'wsConnected' | 'lastPingAt' | 'lastPongAt'>
    >,
  ) => void;
  setNetwork: (name: NetworkStatus['name'], rpcUrl: string) => void;
  reset: () => void;
}

const initialState: NetworkStatus = {
  name:
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as NetworkStatus['name']) ||
    'unknown',
  rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '',
  isConnected: false,
  wsConnected: false,
};

export const useNetworkStore = create<NetworkStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    updateRpcStatus: (status) => {
      set((state) => ({
        ...state,
        ...status,
      }));
    },

    updateWsStatus: (status) => {
      set((state) => ({
        ...state,
        ...status,
      }));
    },

    setNetwork: (name, rpcUrl) => {
      set((state) => ({
        ...state,
        name,
        rpcUrl,
        isConnected: false, // Reset connection status on network change
        wsConnected: false,
        connectionError: undefined,
      }));
    },

    reset: () => {
      set(initialState);
    },
  })),
);

// Selectors for common use cases
export const selectNetworkHealth = (state: NetworkStore) => ({
  isHealthy: state.isConnected && state.wsConnected,
  rpcStatus: state.isConnected,
  wsStatus: state.wsConnected,
  latency: state.latency,
});

export const selectNetworkInfo = (state: NetworkStore) => ({
  name: state.name,
  displayName:
    state.name === 'mainnet-beta'
      ? 'Mainnet'
      : state.name === 'testnet'
        ? 'Testnet'
        : state.name === 'devnet'
          ? 'Devnet'
          : 'Unknown',
  rpcUrl: state.rpcUrl,
});
