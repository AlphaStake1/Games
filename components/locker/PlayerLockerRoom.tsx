'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Trophy,
  Star,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
  Crown,
  Flame,
  Award,
  Target,
  Zap,
  Gift,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LockerUpgradeModal } from './LockerUpgradeModal';
import { StadiumLocker } from './StadiumLocker';

interface NFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  tier: 'default' | 'custom' | 'hand-drawn' | 'house' | 'ai' | 'animated';
  rarity?: 'common' | 'rare' | 'legendary';
  wins?: number;
}

interface LockerData {
  username: string;
  walletAddress?: string;
  displayName: string;
  lockerStyle: 'rookie' | 'pro' | 'mvp' | 'allstar' | 'halloffame';
  teamColors: {
    primary: string;
    secondary: string;
  };
  nfts: NFT[];
  featuredNft?: NFT;
  trophies: number;
  totalGames: number;
  viewCount: number;
  isPublic: boolean;
  jerseyNumber?: string;
  joinedDate?: string;
}

const LOCKER_STYLES = {
  rookie: {
    name: 'Rookie',
    price: 'Free',
    background:
      'bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
    frame: 'border-gray-400 dark:border-gray-600',
    nameplate: 'bg-gray-700 text-white',
    features: [
      'Basic metal locker',
      'Standard nameplate',
      'Simple NFT display',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$6',
    background:
      'bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-950/20',
    frame: 'border-amber-600 dark:border-amber-700',
    nameplate: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
    features: [
      'Wood paneling interior',
      'Bronze nameplate',
      'Trophy shelf',
      'Stats display',
    ],
  },
  allstar: {
    name: 'All-Star',
    price: '$10',
    background:
      'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-950/20',
    frame: 'border-blue-600 dark:border-blue-700',
    nameplate: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    features: [
      'Premium materials',
      'LED accent lighting',
      'Animated nameplate',
      'Featured NFT spotlight',
    ],
  },
  halloffame: {
    name: 'Hall of Fame',
    price: '$14',
    background:
      'bg-gradient-to-b from-yellow-50 via-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:via-yellow-950/20 dark:to-amber-950/20',
    frame: 'border-yellow-500 dark:border-yellow-600',
    nameplate:
      'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black',
    features: [
      'Gold trim finish',
      'Shimmer effects',
      'Trophy case display',
      'Custom team colors',
      'Priority in discovery',
    ],
  },
  vip: {
    name: 'VIP Legendary',
    price: '$21',
    background:
      'bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 dark:from-purple-900/40 dark:via-pink-900/30 dark:to-purple-900/40',
    frame: 'border-purple-500 dark:border-purple-400',
    nameplate:
      'bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white animate-pulse',
    features: [
      'Holographic effects',
      'Custom entrance animation',
      'Exclusive VIP badge',
      'Background music option',
      'Unlimited customization',
      'Top discovery placement',
    ],
  },
};

export function PlayerLockerRoom({ username }: { username: string }) {
  const [lockerData, setLockerData] = useState<LockerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [neighborLeft, setNeighborLeft] = useState<string | null>(null);
  const [neighborRight, setNeighborRight] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    // Simulated data fetch - replace with actual API call
    const fetchLockerData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual API call to fetch from Solana/database
      const mockData: LockerData = {
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        lockerStyle: 'pro',
        teamColors: {
          primary: '#002244',
          secondary: '#ed5925',
        },
        nfts: [
          {
            id: '1',
            name: 'Golden Victory',
            description:
              'Won this beauty in the 2024 Championship Game. The golden glow represents the final touchdown that sealed our victory!',
            image: '/api/placeholder/200/200',
            tier: 'house',
            rarity: 'legendary',
            wins: 5,
          },
          {
            id: '2',
            name: 'Lucky Shamrock',
            description:
              "My St. Patrick's Day special - hasn't lost a game yet!",
            image: '/api/placeholder/200/200',
            tier: 'custom',
            rarity: 'rare',
          },
          {
            id: '3',
            name: 'Electric Thunder',
            description:
              'AI-generated from my prompt: "lightning striking a football". Pure energy!',
            image: '/api/placeholder/200/200',
            tier: 'ai',
            rarity: 'rare',
          },
          {
            id: '4',
            name: 'First Timer',
            description: 'My first ever NFT - simple but special',
            image: '/api/placeholder/200/200',
            tier: 'default',
            rarity: 'common',
          },
          {
            id: '5',
            name: 'Neon Dreams',
            description: 'Animated neon sign that pulses with team colors',
            image: '/api/placeholder/200/200',
            tier: 'animated',
            rarity: 'legendary',
          },
          {
            id: '6',
            name: 'Doodle Champion',
            description:
              'Drew this after our big win - stick figure doing a touchdown dance!',
            image: '/api/placeholder/200/200',
            tier: 'hand-drawn',
            rarity: 'common',
          },
        ],
        featuredNft: {
          id: '5',
          name: 'Neon Dreams',
          description: 'Animated neon sign that pulses with team colors',
          image: '/api/placeholder/200/200',
          tier: 'animated',
          rarity: 'legendary',
        },
        trophies: 12,
        totalGames: 48,
        viewCount: 342,
        isPublic: true,
        jerseyNumber: '88',
        joinedDate: 'Jan 2024',
      };

      setLockerData(mockData);

      // Mock neighbor data
      setNeighborLeft('player123');
      setNeighborRight('champion99');

      setLoading(false);
    };

    fetchLockerData();
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/locker/${username}`,
    );
    // Show toast notification here
  };

  const handleUpgrade = (newStyle: string) => {
    // In production, make API call to upgrade locker
    if (lockerData) {
      setLockerData({
        ...lockerData,
        lockerStyle: newStyle as any,
      });
    }
    // Show success toast
  };

  const incrementViewCount = () => {
    // API call to increment view count
  };

  useEffect(() => {
    if (lockerData?.isPublic) {
      incrementViewCount();
    }
  }, [lockerData]);

  if (loading) {
    return <LockerLoadingSkeleton />;
  }

  if (!lockerData || !lockerData.isPublic) {
    return <LockerPrivate username={username} />;
  }

  const style = LOCKER_STYLES[lockerData.lockerStyle];

  return (
    <>
      <StadiumLocker
        username={lockerData.username}
        displayName={lockerData.displayName}
        lockerStyle={lockerData.lockerStyle}
        jerseyNumber={lockerData.jerseyNumber}
        nfts={lockerData.nfts}
        featuredNft={lockerData.featuredNft}
        stats={{
          trophies: lockerData.trophies,
          games: lockerData.totalGames,
          views: lockerData.viewCount,
        }}
        onUpgrade={() => setShowUpgradeModal(true)}
        onShare={handleShare}
      />

      {/* Locker Upgrade Modal */}
      <LockerUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentStyle={lockerData.lockerStyle}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}

// Component for individual NFT frames
function NFTFrame({ nft, onClick }: { nft: NFT; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-md group-hover:shadow-xl">
        <Image src={nft.image} alt={nft.name} fill className="object-cover" />
        {nft.tier === 'animated' && (
          <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded">
            <Sparkles className="w-3 h-3" />
          </div>
        )}
        {nft.rarity === 'legendary' && (
          <div className="absolute top-1 left-1 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3" />
          </div>
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
        {nft.name}
      </p>
    </button>
  );
}

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="text-center p-3 bg-white/50 dark:bg-black/30 rounded-lg">
      <Icon className={cn('w-8 h-8 mx-auto mb-1', color)} />
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

// Badge component
function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'common' | 'rare' | 'legendary' | 'success';
}) {
  const variants = {
    default: 'bg-gray-500',
    common: 'bg-gray-400',
    rare: 'bg-blue-500',
    legendary: 'bg-yellow-500',
    success: 'bg-green-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white',
        variants[variant],
      )}
    >
      {children}
    </span>
  );
}

// NFT Detail Modal
function NFTDetailModal({ nft, onClose }: { nft: NFT; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{nft.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
              <Image
                src={nft.image}
                alt={nft.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {nft.description || 'No description available'}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">{nft.tier}</span>
                </div>
                {nft.rarity && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Rarity</span>
                    <Badge variant={nft.rarity}>{nft.rarity}</Badge>
                  </div>
                )}
                {nft.wins !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Games Won</span>
                    <span className="font-medium">{nft.wins}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Loading skeleton
function LockerLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="p-8">
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
        </Card>
      </div>
    </div>
  );
}

// Private locker message
function LockerPrivate({ username }: { username: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-8 text-center">
        <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Private Locker</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          @{username}'s locker is currently private
        </p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </Card>
    </div>
  );
}
