'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useEffect, useState } from 'react';

// Import wallet adapters
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// Default styles for wallet adapter
require('@solana/wallet-adapter-react-ui/styles.css');

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Network selection based on environment variable
  const network = useMemo(() => {
    const networkName = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    switch (networkName) {
      case 'mainnet-beta':
        return WalletAdapterNetwork.Mainnet;
      case 'testnet':
        return WalletAdapterNetwork.Testnet;
      case 'devnet':
        return WalletAdapterNetwork.Devnet;
      default:
        console.warn(`Unknown network: ${networkName}, defaulting to testnet`);
        return WalletAdapterNetwork.Testnet;
    }
  }, []);

  // RPC endpoint with fallback priority
  const endpoint = useMemo(() => {
    // First priority: explicit RPC URL
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }

    // Second priority: legacy RPC endpoint
    if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
      return process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    }

    // Fallback to cluster API URL
    return clusterApiUrl(network);
  }, [network]);

  // Configure wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={mounted}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="football-squares-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
