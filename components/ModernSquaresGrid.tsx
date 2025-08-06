'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  Star,
  Users,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@solana/wallet-adapter-react';

interface ModernSquaresGridProps {
  gameId: string;
  homeTeam: {
    name: string;
    logo: string;
    color: string;
    record: string;
  };
  awayTeam: {
    name: string;
    logo: string;
    color: string;
    record: string;
  };
  gameTime: string;
  gameDate: string;
  isFreePlay?: boolean;
  onSquareSelect?: (index: number) => void;
  selectedSquares?: number[];
  claimedSquares?: {
    [key: number]: {
      owner: string;
      signatureType?: 'default' | 'color' | 'static-nft' | 'animated-nft';
      color?: string;
      nftImage?: string;
    };
  };
}

const ModernSquaresGrid: React.FC<ModernSquaresGridProps> = ({
  gameId,
  homeTeam,
  awayTeam,
  gameTime,
  gameDate,
  isFreePlay = false,
  onSquareSelect,
  selectedSquares = [],
  claimedSquares = {},
}) => {
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [showNFTPromo, setShowNFTPromo] = useState(false);
  const { connected } = useWallet();

  // Generate gradient based on team colors
  const boardGradient = `linear-gradient(135deg, ${homeTeam.color}20 0%, ${awayTeam.color}20 100%)`;

  const handleSquareClick = (index: number) => {
    if (claimedSquares[index]) return;

    if (isFreePlay && selectedSquares.length >= 3) {
      // Show NFT upgrade prompt for free players
      setShowNFTPromo(true);
      return;
    }

    onSquareSelect?.(index);
  };

  const getSquareContent = (index: number) => {
    const claimed = claimedSquares[index];
    if (!claimed) return null;

    const { signatureType, color, nftImage, owner } = claimed;

    switch (signatureType) {
      case 'color':
        return (
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              color: color,
              textShadow: `0 0 8px ${color}40`,
              filter: 'brightness(1.2)',
            }}
          >
            <span className="font-bold text-xs">{owner.slice(0, 6)}</span>
          </div>
        );

      case 'static-nft':
        return (
          <div className="w-full h-full flex items-center justify-center p-1">
            {nftImage ? (
              <img
                src={nftImage}
                alt="NFT"
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-2xl">
                {['🎨', '🎭', '🎪', '🎯', '🎲'][index % 5]}
              </span>
            )}
          </div>
        );

      case 'animated-nft':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-2xl">
              {['✨', '🌟', '💫', '⚡', '🔥'][index % 5]}
            </span>
          </motion.div>
        );

      default: // 'default' black signature
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-handwriting text-xs text-black dark:text-white">
              {owner.slice(0, 6)}
            </span>
          </div>
        );
    }
  };

  const getSquareStyle = (index: number) => {
    const isClaimed = !!claimedSquares[index];
    const isSelected = selectedSquares.includes(index);
    const isHovered = hoveredSquare === index;

    if (isClaimed) {
      return 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed';
    }

    if (isSelected) {
      return 'bg-green-400 dark:bg-green-600';
    }

    if (isHovered) {
      return 'bg-blue-50 dark:bg-blue-900/50';
    }

    return 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800';
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Game Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Home Team */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                <span className="text-2xl">{homeTeam.logo}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{homeTeam.name}</h3>
                <p className="text-sm opacity-80">{homeTeam.record}</p>
              </div>
            </div>

            {/* Game Info */}
            <div className="text-center">
              <Badge className="mb-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-0">
                {isFreePlay ? 'FREE PLAY' : '💰 CASH GAME'}
              </Badge>
              <p className="text-lg font-semibold">{gameDate}</p>
              <p className="text-sm opacity-80">{gameTime}</p>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h3 className="text-xl font-bold">{awayTeam.name}</h3>
                <p className="text-sm opacity-80">{awayTeam.record}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                <span className="text-2xl">{awayTeam.logo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <Card className="overflow-hidden shadow-2xl border-0">
        <CardContent className="p-0">
          <div className="bg-white dark:bg-gray-950">
            {/* Home Team Banner - Top */}
            <div
              className="h-16 flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: homeTeam.color }}
            >
              <span className="mr-3">{homeTeam.logo}</span>
              {homeTeam.name.toUpperCase()}
            </div>

            {/* Grid Container */}
            <div className="flex">
              {/* Away Team Banner - Left (Vertical) */}
              <div
                className="w-16 flex items-center justify-center text-white font-bold"
                style={{
                  backgroundColor: awayTeam.color,
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                }}
              >
                <span className="mb-3">{awayTeam.logo}</span>
                {awayTeam.name.toUpperCase()}
              </div>

              {/* Main Grid */}
              <div className="flex-1">
                {/* Column Headers */}
                <div className="flex border-b border-gray-300 dark:border-gray-700">
                  <div className="w-12 h-12 border-r border-gray-300 dark:border-gray-700"></div>
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={`col-${i}`}
                      className="flex-1 h-12 flex items-center justify-center font-bold text-sm bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 last:border-r-0"
                    >
                      {isFreePlay ? 'RANDOMIZED'[i] : i}
                    </div>
                  ))}
                </div>

                {/* Grid Rows */}
                {[...Array(10)].map((_, row) => (
                  <div
                    key={`row-${row}`}
                    className="flex border-b border-gray-300 dark:border-gray-700 last:border-b-0"
                  >
                    {/* Row Header */}
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-sm bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700">
                      {isFreePlay ? 'RANDOMIZED'[row] : row}
                    </div>

                    {/* Squares */}
                    {[...Array(10)].map((_, col) => {
                      const index = row * 10 + col;
                      const claimed = claimedSquares[index];

                      return (
                        <button
                          key={`square-${index}`}
                          onClick={() => handleSquareClick(index)}
                          onMouseEnter={() => setHoveredSquare(index)}
                          onMouseLeave={() => setHoveredSquare(null)}
                          className={`flex-1 h-12 border-r border-gray-300 dark:border-gray-700 last:border-r-0 transition-all duration-150 ${getSquareStyle(index)}`}
                          disabled={!!claimed}
                        >
                          {claimed ? getSquareContent(index) : null}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free Play Features */}
      {isFreePlay && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NFT Creation Promo */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">
                    Create Your NFT Signature
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Stand out on the board with a custom NFT signature. Express
                    yourself!
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Design Your NFT
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Player Testimonial</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                    "Free play helped me understand the game before I started
                    playing for real money!"
                  </p>
                  <p className="text-xs font-semibold">- Sarah M., Dallas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CBL Community Promo */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Join a Community</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Team up with CBL communities for bigger rewards!
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Explore CBLs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* NFT Upgrade Modal */}
      <AnimatePresence>
        {showNFTPromo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNFTPromo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Want More Squares?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Free players get 3 squares per game. Upgrade to get up to 10
                  squares and exclusive NFT features!
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => setShowNFTPromo(false)}
                  >
                    Keep Playing Free
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernSquaresGrid;
