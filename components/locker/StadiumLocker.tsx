'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Eye,
  Share2,
  Crown,
  Award,
  Sparkles,
  Target,
  Zap,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  tier: 'default' | 'custom' | 'hand-drawn' | 'house' | 'ai' | 'animated';
  rarity?: 'common' | 'rare' | 'legendary';
  wins?: number;
}

interface StadiumLockerProps {
  username: string;
  displayName: string;
  lockerStyle: 'rookie' | 'pro' | 'allstar' | 'halloffame' | 'vip';
  jerseyNumber?: string;
  nfts: NFT[];
  featuredNft?: NFT;
  stats: {
    trophies: number;
    games: number;
    views: number;
  };
  onUpgrade?: () => void;
  onShare?: () => void;
}

const LOCKER_MATERIALS = {
  rookie: {
    frame: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
    interior: 'linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)',
    nameplate: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    accent: '#6b7280',
  },
  pro: {
    frame: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)',
    interior: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
    nameplate: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
    accent: '#d97706',
  },
  allstar: {
    frame: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    interior: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    nameplate: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    accent: '#3b82f6',
  },
  halloffame: {
    frame:
      'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #d97706 70%, #b45309 100%)',
    interior:
      'linear-gradient(180deg, #fffbeb 0%, #fef3c7 30%, #fde68a 70%, #fcd34d 100%)',
    nameplate: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    accent: '#fbbf24',
  },
  vip: {
    frame:
      'linear-gradient(135deg, #a855f7 0%, #9333ea 30%, #7c3aed 70%, #6d28d9 100%)',
    interior:
      'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 70%, #d8b4fe 100%)',
    nameplate: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #a855f7 100%)',
    accent: '#a855f7',
  },
};

export function StadiumLocker({
  username,
  displayName,
  lockerStyle,
  jerseyNumber,
  nfts,
  featuredNft,
  stats,
  onUpgrade,
  onShare,
}: StadiumLockerProps) {
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const material = LOCKER_MATERIALS[lockerStyle];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      {/* Stadium Atmosphere */}
      <div className="absolute inset-0">
        {/* Ceiling/Stadium Lights */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-b from-yellow-200/20 via-yellow-100/10 to-transparent"></div>

        {/* Floor Reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent"></div>

        {/* Ambient Stadium Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-yellow-200/5 via-transparent to-gray-900/50"></div>
      </div>

      {/* Locker Room Container - 3D Perspective */}
      <div
        className={cn(
          'relative h-full flex items-center justify-center transition-all duration-1000',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
        style={{ perspective: '1200px' }}
      >
        {/* Left Neighbor Locker Peek */}
        <div
          className="absolute left-8 top-1/2 transform -translate-y-1/2 w-16 h-96 opacity-30 hover:opacity-50 transition-opacity cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            transform: 'rotateY(25deg) translateZ(-100px)',
            borderRadius: '8px 0 0 8px',
          }}
        >
          <div className="h-full flex flex-col justify-center items-center text-white/60 text-xs">
            <div className="rotate-90 whitespace-nowrap">@neighbor</div>
          </div>
        </div>

        {/* Main Stadium Locker */}
        <div
          className="relative w-80 h-96 mx-8"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-5deg)',
          }}
        >
          {/* Locker Frame */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              background: material.frame,
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.3),
                0 8px 32px rgba(0,0,0,0.4),
                0 0 0 2px rgba(255,255,255,0.1)
              `,
            }}
          >
            {/* Nameplate */}
            <div
              className="absolute top-4 left-4 right-4 h-12 rounded flex items-center justify-between px-4 text-white font-bold shadow-lg"
              style={{
                background: material.nameplate,
                boxShadow:
                  'inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                {jerseyNumber && (
                  <span className="text-2xl font-bold">#{jerseyNumber}</span>
                )}
                <div>
                  <div className="text-lg font-bold">{displayName}</div>
                  <div className="text-xs opacity-75">@{username}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {lockerStyle === 'vip' && (
                  <Crown className="w-5 h-5 animate-pulse" />
                )}
                {lockerStyle === 'halloffame' && <Crown className="w-5 h-5" />}
                {lockerStyle === 'allstar' && <Star className="w-5 h-5" />}
                {lockerStyle === 'pro' && <Award className="w-5 h-5" />}
              </div>
            </div>

            {/* Locker Interior - Deep 3D Effect */}
            <div
              className="absolute top-20 left-6 right-6 bottom-6 rounded-lg overflow-hidden"
              style={{
                background: material.interior,
                transform: 'translateZ(-20px)',
                boxShadow: `
                  inset 0 8px 16px rgba(0,0,0,0.3),
                  inset 0 0 0 1px rgba(0,0,0,0.1)
                `,
              }}
            >
              {/* Back Wall - NFT Display */}
              <div
                className="absolute inset-4 top-4 h-48 rounded"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  transform: 'translateZ(-40px)',
                  boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)',
                }}
              >
                {/* NFT Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 h-full">
                  {nfts.slice(0, 9).map((nft, index) => (
                    <div
                      key={nft.id}
                      className="relative bg-white rounded shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                      onClick={() => setSelectedNft(nft)}
                      style={{
                        transform: `translateZ(${5 + index}px)`,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                      <div className="relative p-1 h-full flex flex-col">
                        <div className="flex-1 bg-gray-300 rounded mb-1 flex items-center justify-center text-xs text-gray-600">
                          NFT
                        </div>
                        <div className="text-xs font-bold truncate text-gray-800">
                          {nft.name}
                        </div>
                      </div>
                      {nft.tier === 'animated' && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      )}
                      {nft.rarity === 'legendary' && (
                        <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trophy Shelf */}
              <div
                className="absolute bottom-16 left-4 right-4 h-12 rounded flex items-center justify-around"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(101, 67, 33, 0.8) 100%)',
                  transform: 'translateZ(-10px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex flex-col items-center text-white">
                  <Trophy className="w-4 h-4 text-yellow-400 mb-1" />
                  <span className="text-xs font-bold">{stats.trophies}</span>
                </div>
                <div className="flex flex-col items-center text-white">
                  <Target className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-xs font-bold">{stats.games}</span>
                </div>
                <div className="flex flex-col items-center text-white">
                  <Gift className="w-4 h-4 text-purple-400 mb-1" />
                  <span className="text-xs font-bold">{nfts.length}</span>
                </div>
              </div>

              {/* Featured NFT Bench */}
              {featuredNft && (
                <div
                  className="absolute bottom-4 left-4 right-4 h-8 rounded flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${material.accent}40 0%, ${material.accent}60 100%)`,
                    transform: 'translateZ(-5px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Zap className="w-3 h-3" />
                    <span className="font-bold truncate">
                      {featuredNft.name}
                    </span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>

            {/* Locker Hardware */}
            <div className="absolute top-1/2 right-2 w-2 h-8 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full shadow-lg transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* Right Neighbor Locker Peek */}
        <div
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-16 h-96 opacity-30 hover:opacity-50 transition-opacity cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            transform: 'rotateY(-25deg) translateZ(-100px)',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <div className="h-full flex flex-col justify-center items-center text-white/60 text-xs">
            <div className="rotate-90 whitespace-nowrap">@champion</div>
          </div>
        </div>
      </div>

      {/* UI Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{stats.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>{stats.trophies}</span>
          </div>
        </div>
        {lockerStyle !== 'vip' && onUpgrade && (
          <Button
            onClick={onUpgrade}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
        )}
        {onShare && (
          <Button variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedNft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="max-w-lg w-full p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedNft.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNft(null)}
              >
                ✕
              </Button>
            </div>
            <div className="mb-4">
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">NFT Preview</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {selectedNft.description || 'No description available'}
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {selectedNft.tier}
              </span>
              {selectedNft.rarity && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {selectedNft.rarity}
                </span>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
