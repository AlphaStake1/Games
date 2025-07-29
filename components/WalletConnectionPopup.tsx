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

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Store intent data in localStorage for after wallet creation
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

      await onConnect();

      // After successful connection, handle the intent
      setTimeout(() => {
        if (intent === 'create-nft') {
          if (intentData?.nftType) {
            window.location.href = `/create-nft/${intentData.nftType}`;
          } else {
            window.location.href = '/my-nfts';
          }
        } else if (intent === 'play-game') {
          if (intentData?.gameId) {
            window.location.href = `/boards?gameId=${intentData.gameId}`;
          } else if (intentData?.redirectPath) {
            window.location.href = intentData.redirectPath;
          } else {
            window.location.href = '/boards';
          }
        } else if (intent === 'view-collection') {
          window.location.href = '/my-nfts';
        }
      }, 1000); // Small delay to allow wallet connection to complete
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

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

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white py-3 rounded-xl font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isConnecting ? 'Connecting...' : currentIntent.primaryAction}
            </Button>

            <Button
              onClick={handleGetPhantom}
              variant="outline"
              className="w-full border-2 border-[#708090]/30 text-[#002244] dark:text-white hover:bg-[#708090]/10 py-3 rounded-xl font-semibold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Phantom Wallet
            </Button>
          </div>

          {/* Info Section */}
          <div className="bg-[#96abdc]/5 rounded-xl p-4 border border-[#96abdc]/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#96abdc] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-[#002244] dark:text-white text-sm mb-1">
                  New to wallets?
                </h5>
                <p className="text-xs text-[#708090] dark:text-[#96abdc] leading-relaxed">
                  Phantom is a free, secure Solana wallet. After installing,
                  return here and click "Connect Wallet" - we'll remember what
                  you wanted to do!
                </p>
              </div>
            </div>
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
