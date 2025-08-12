'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface NetworkStatus {
  network: string;
  rpcUrl: string;
  isConnected: boolean;
  latency?: number;
}

export function NetworkBanner() {
  const [status, setStatus] = useState<NetworkStatus>({
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'unknown',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '',
    isConnected: false,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!status.rpcUrl) {
      setIsVisible(false);
      return;
    }
    const checkConnection = async () => {
      const startTime = Date.now();
      try {
        const response = await fetch(status.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getHealth',
          }),
        });

        if (response.ok) {
          const latency = Date.now() - startTime;
          setStatus((prev) => ({
            ...prev,
            isConnected: true,
            latency,
          }));
        } else {
          setStatus((prev) => ({ ...prev, isConnected: false }));
        }
      } catch {
        setStatus((prev) => ({ ...prev, isConnected: false }));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [status.rpcUrl]);

  if (!isVisible) return null;

  const getNetworkColor = () => {
    if (!status.isConnected)
      return 'bg-red-500/10 border-red-500/20 text-red-400';
    if (status.network === 'mainnet-beta')
      return 'bg-green-500/10 border-green-500/20 text-green-400';
    return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
  };

  const getIcon = () => {
    if (!status.isConnected) return <XCircle className="w-4 h-4" />;
    if (status.network === 'mainnet-beta')
      return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 border-b ${getNetworkColor()}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">
            {status.network === 'mainnet-beta'
              ? 'Mainnet'
              : status.network === 'testnet'
                ? 'Testnet'
                : status.network === 'devnet'
                  ? 'Devnet'
                  : 'Unknown Network'}
          </span>
          {status.isConnected && status.latency && (
            <span className="text-xs opacity-75">({status.latency}ms)</span>
          )}
          {!status.isConnected && (
            <span className="text-xs">• Connection Failed</span>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs opacity-75 hover:opacity-100 transition-opacity"
          aria-label="Close network banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
