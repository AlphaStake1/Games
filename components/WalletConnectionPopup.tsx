'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Wallet,
  ExternalLink,
  Shield,
  Zap,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import Image from 'next/image';

interface WalletConnectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  intent?: 'create-nft' | 'play-game' | 'view-collection' | 'general';
  intentData?: {
    nftType?: string;
    gameId?: string;
    redirectPath?: string;
  };
}

const WalletConnectionPopup: React.FC<WalletConnectionPopupProps> = ({
  isOpen,
  onClose,
  onConnect,
  intent = 'general',
  intentData,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletName | null>(null);
  const { wallets, select, connected, connecting } = useWallet();

  const intentMessages = {
    'create-nft': {
      title: '🎨 Ready to Create Your NFT?',
      description:
        "To create and manage your custom NFT markers, you'll need to connect a Solana wallet. Your NFTs will be securely stored and ready to use on any game board!",
      primaryAction: 'Connect Wallet & Create NFT',
      benefits: [
        'Create personalized square markers',
        'Own your NFTs forever on blockchain',
        'Use across all future games',
      ],
    },
    'play-game': {
      title: '🏈 Join the Game!',
      description:
        'Connect your wallet to purchase squares and start playing. Your wallet keeps your game history and any NFT markers you own.',
      primaryAction: 'Connect Wallet & Play',
      benefits: [
        'Purchase squares instantly',
        'Track your game history',
        'Use your NFT markers',
      ],
    },
    'view-collection': {
      title: '👀 View Your NFT Collection',
      description:
        'Connect your wallet to see all your NFT markers and manage your collection.',
      primaryAction: 'Connect Wallet & View Collection',
      benefits: [
        'See all your NFTs',
        'Manage your collection',
        'Transfer or trade NFTs',
      ],
    },
    general: {
      title: '🔗 Connect Your Wallet',
      description:
        "To access this feature, you'll need to connect a Solana wallet like Phantom.",
      primaryAction: 'Connect Wallet',
      benefits: [
        'Secure blockchain storage',
        'Full ownership of assets',
        'Access to all features',
      ],
    },
  };

  const currentIntent = intentMessages[intent];

  const handleWalletSelect = async (walletName: WalletName) => {
    setSelectedWallet(walletName);
    setIsConnecting(true);
    try {
      console.log('Selecting wallet:', walletName);
      select(walletName);
      // Give the wallet selection time to process
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Connecting to wallet...');
      await onConnect();
      console.log('Wallet connected successfully');
      onClose();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  // Available wallets with their info
  const availableWallets = [
    {
      name: 'Phantom' as WalletName,
      icon: '/icons/Phantom-Logo-Purple.svg',
      downloadUrl: 'https://phantom.app/',
      description: 'Popular Solana wallet',
    },
    {
      name: 'Solflare' as WalletName,
      icon: '/icons/solflare-icon.svg',
      downloadUrl: 'https://solflare.com/',
      description: 'Secure Solana wallet',
    },
    {
      name: 'Torus' as WalletName,
      icon: '/icons/torus-icon-blue-3.svg',
      downloadUrl: 'https://app.tor.us/',
      description: 'Email-based wallet',
    },
  ];

  const handleGetPhantom = () => {
    // Store intent before redirecting to Phantom
    if (intent !== 'general') {
      localStorage.setItem(
        'userIntent',
        JSON.stringify({
          intent,
          intentData,
          timestamp: Date.now(),
        }),
      );
    }
    window.open('https://phantom.app/', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-[#002244] border-2 border-[#ed5925]/20 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-[#002244] dark:text-white mb-2">
            {currentIntent.title}
          </DialogTitle>
          <DialogDescription className="text-[#708090] dark:text-[#96abdc] leading-relaxed">
            {currentIntent.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Section */}
          <div className="bg-[#faf9f5] dark:bg-[#004953]/20 rounded-xl p-4 border border-[#ed5925]/10">
            <h4 className="font-semibold text-[#002244] dark:text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ed5925]" />
              What you get:
            </h4>
            <ul className="space-y-2">
              {currentIntent.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-[#708090] dark:text-[#96abdc]"
                >
                  <ChevronRight className="w-3 h-3 text-[#ed5925]" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Wallet Selection */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#002244] dark:text-white mb-3 text-center">
              Choose your wallet:
            </h4>
            {availableWallets.map((wallet) => {
              const isInstalled = wallets.some(
                (w) => w.adapter.name === wallet.name,
              );
              const isSelectedWallet = selectedWallet === wallet.name;
              const isCurrentlyConnecting = isConnecting && isSelectedWallet;

              return (
                <div key={wallet.name} className="space-y-2">
                  <Button
                    onClick={() =>
                      isInstalled
                        ? handleWalletSelect(wallet.name)
                        : window.open(wallet.downloadUrl, '_blank')
                    }
                    disabled={isConnecting}
                    className={`w-full ${
                      isInstalled
                        ? 'bg-gradient-to-r from-[#ed5925] to-[#96abdc] hover:from-[#d14a1f] hover:to-[#7a95d1]'
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <img
                          src={wallet.icon}
                          alt={`${wallet.name} icon`}
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">{wallet.name}</div>
                        <div className="text-xs opacity-90">
                          {wallet.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentlyConnecting ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : isInstalled ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                  {!isInstalled && (
                    <div className="text-xs text-[#708090] dark:text-[#96abdc] text-center">
                      Not installed - click to download
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white dark:bg-[#002244]/50 rounded-lg p-3 border border-[#708090]/10">
              <Zap className="w-6 h-6 text-[#ed5925] mx-auto mb-1" />
              <div className="text-xs font-semibold text-[#002244] dark:text-white">
                Fast Setup
              </div>
              <div className="text-xs text-[#708090] dark:text-[#96abdc]">
                2 minutes
              </div>
            </div>
            <div className="bg-white dark:bg-[#002244]/50 rounded-lg p-3 border border-[#708090]/10">
              <Shield className="w-6 h-6 text-[#96abdc] mx-auto mb-1" />
              <div className="text-xs font-semibold text-[#002244] dark:text-white">
                Secure
              </div>
              <div className="text-xs text-[#708090] dark:text-[#96abdc]">
                Your keys
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectionPopup;
