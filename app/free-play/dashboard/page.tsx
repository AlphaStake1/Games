'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModernSquaresGrid from '@/components/ModernSquaresGrid';
import {
  Trophy,
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  MessageCircle,
  Star,
  Home,
  Clock,
  Award,
} from 'lucide-react';

// Mock data for demonstration
const MOCK_GAMES = [
  {
    id: 'game-1',
    homeTeam: {
      name: 'Dallas Cowboys',
      logo: '⭐',
      color: '#003594',
      record: '9-3',
    },
    awayTeam: {
      name: 'Philadelphia Eagles',
      logo: '🦅',
      color: '#004C54',
      record: '10-2',
    },
    gameTime: '8:20 PM ET',
    gameDate: 'Sunday, Dec 10',
    status: 'upcoming',
    isHomeTeam: true,
  },
  {
    id: 'game-2',
    homeTeam: {
      name: 'Kansas City Chiefs',
      logo: '🏹',
      color: '#E31837',
      record: '8-4',
    },
    awayTeam: {
      name: 'Buffalo Bills',
      logo: '🦬',
      color: '#00338D',
      record: '7-5',
    },
    gameTime: '4:25 PM ET',
    gameDate: 'Sunday, Dec 10',
    status: 'upcoming',
    isHomeTeam: false,
  },
  {
    id: 'game-3',
    homeTeam: {
      name: 'Miami Dolphins',
      logo: '🐬',
      color: '#008E97',
      record: '9-3',
    },
    awayTeam: {
      name: 'Tennessee Titans',
      logo: '⚔️',
      color: '#0C2340',
      record: '5-7',
    },
    gameTime: '8:15 PM ET',
    gameDate: 'Monday, Dec 11',
    status: 'upcoming',
    isHomeTeam: false,
  },
];

const MOCK_STATS = {
  bluePoints: 285,
  currentStreak: 7,
  longestStreak: 12,
  totalBoards: 24,
};

const MOCK_RECENT_ACTIVITY = [
  {
    game: 'Eagles vs Cowboys',
    points: 25,
    date: '2 hours ago',
  },
  {
    game: 'Bills vs Chiefs',
    points: 15,
    date: 'Yesterday',
  },
  {
    game: 'Dolphins vs Titans',
    points: 35,
    date: '3 days ago',
  },
];

export default function FreePlayerDashboard() {
  const { connected, publicKey } = useWallet();
  const [selectedGame, setSelectedGame] = useState(MOCK_GAMES[0].id);
  const [selectedSquares, setSelectedSquares] = useState<{
    [gameId: string]: number[];
  }>({
    'game-1': [],
    'game-2': [],
    'game-3': [],
  });

  // Generate different claimed squares for each game
  const getClaimedSquaresForGame = (gameId: string) => {
    const baseSquares = {
      'game-1': {
        3: { owner: 'Player123', signatureType: 'default' as const },
        7: {
          owner: 'ColorMaster',
          signatureType: 'color' as const,
          color: '#FF6B6B',
        },
        12: {
          owner: 'GreenGlow',
          signatureType: 'color' as const,
          color: '#4ECDC4',
        },
        18: { owner: 'NFTKing', signatureType: 'static-nft' as const },
        24: { owner: 'ArtLover', signatureType: 'static-nft' as const },
        31: { owner: 'AnimFan', signatureType: 'animated-nft' as const },
        37: { owner: 'BasicJoe', signatureType: 'default' as const },
        42: {
          owner: 'PurpleHaze',
          signatureType: 'color' as const,
          color: '#9B59B6',
        },
        48: { owner: 'StarGazer', signatureType: 'animated-nft' as const },
        56: { owner: 'SimpleSign', signatureType: 'default' as const },
        63: {
          owner: 'BlueWave',
          signatureType: 'color' as const,
          color: '#3498DB',
        },
        71: { owner: 'IconMaster', signatureType: 'static-nft' as const },
        78: { owner: 'FireStorm', signatureType: 'animated-nft' as const },
        85: { owner: 'ClassicFan', signatureType: 'default' as const },
        91: {
          owner: 'GoldRush',
          signatureType: 'color' as const,
          color: '#F1C40F',
        },
      },
      'game-2': {
        8: { owner: 'ChiefsGuy', signatureType: 'default' as const },
        15: {
          owner: 'RedArrow',
          signatureType: 'color' as const,
          color: '#E31837',
        },
        22: {
          owner: 'BuffaloBill',
          signatureType: 'color' as const,
          color: '#00338D',
        },
        29: { owner: 'NFTChief', signatureType: 'static-nft' as const },
        36: { owner: 'BillsMafia', signatureType: 'animated-nft' as const },
        43: { owner: 'PlainJane', signatureType: 'default' as const },
        51: {
          owner: 'GoldFever',
          signatureType: 'color' as const,
          color: '#FFD700',
        },
        58: { owner: 'IconBuff', signatureType: 'static-nft' as const },
        65: { owner: 'FlashBolt', signatureType: 'animated-nft' as const },
        72: { owner: 'BasicBuff', signatureType: 'default' as const },
        79: {
          owner: 'BlueBolt',
          signatureType: 'color' as const,
          color: '#0066CC',
        },
        86: { owner: 'ArtChief', signatureType: 'static-nft' as const },
        93: { owner: 'SparkChief', signatureType: 'animated-nft' as const },
        14: { owner: 'SimpleK', signatureType: 'default' as const },
        27: {
          owner: 'RedStorm',
          signatureType: 'color' as const,
          color: '#CC0000',
        },
      },
      'game-3': {
        4: { owner: 'DolphinFan', signatureType: 'default' as const },
        11: {
          owner: 'AquaWave',
          signatureType: 'color' as const,
          color: '#008E97',
        },
        18: {
          owner: 'TitanUp',
          signatureType: 'color' as const,
          color: '#0C2340',
        },
        25: { owner: 'MiamiNFT', signatureType: 'static-nft' as const },
        32: { owner: 'TitanAnim', signatureType: 'animated-nft' as const },
        39: { owner: 'PlainMiami', signatureType: 'default' as const },
        46: {
          owner: 'TealFin',
          signatureType: 'color' as const,
          color: '#F58220',
        },
        53: { owner: 'NavyIcon', signatureType: 'static-nft' as const },
        60: { owner: 'FlameAnim', signatureType: 'animated-nft' as const },
        67: { owner: 'BasicTitan', signatureType: 'default' as const },
        74: {
          owner: 'SilverWave',
          signatureType: 'color' as const,
          color: '#C0C0C0',
        },
        81: { owner: 'OceanArt', signatureType: 'static-nft' as const },
        88: { owner: 'WaveMotion', signatureType: 'animated-nft' as const },
        16: { owner: 'SimpleFin', signatureType: 'default' as const },
        35: {
          owner: 'DeepBlue',
          signatureType: 'color' as const,
          color: '#003366',
        },
      },
    };

    return baseSquares[gameId as keyof typeof baseSquares] || {};
  };

  const handleSquareSelect = (gameId: string, index: number) => {
    setSelectedSquares((prev) => {
      const gameSquares = prev[gameId] || [];
      if (gameSquares.includes(index)) {
        return {
          ...prev,
          [gameId]: gameSquares.filter((s) => s !== index),
        };
      }
      if (gameSquares.length >= 3) {
        return prev;
      }
      return {
        ...prev,
        [gameId]: [...gameSquares, index],
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Free Play Dashboard
              </h1>
              <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0">
                FREE PLAYER
              </Badge>
            </div>
            <WalletMultiButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Blue Points
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {MOCK_STATS.bluePoints}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">
                    🔥 {MOCK_STATS.currentStreak}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Longest Streak
                  </p>
                  <p className="text-2xl font-bold">
                    {MOCK_STATS.longestStreak}
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Boards Played
                  </p>
                  <p className="text-2xl font-bold">{MOCK_STATS.totalBoards}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Games Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your Games This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedGame} onValueChange={setSelectedGame}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    {MOCK_GAMES.map((game, index) => (
                      <TabsTrigger key={game.id} value={game.id}>
                        <div className="flex items-center gap-1">
                          {game.isHomeTeam && <Home className="w-3 h-3" />}
                          Game {index + 1}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {MOCK_GAMES.map((game) => (
                    <TabsContent key={game.id} value={game.id}>
                      <ModernSquaresGrid
                        gameId={game.id}
                        homeTeam={game.homeTeam}
                        awayTeam={game.awayTeam}
                        gameTime={game.gameTime}
                        gameDate={game.gameDate}
                        isFreePlay={true}
                        selectedSquares={selectedSquares[game.id] || []}
                        onSquareSelect={(index) =>
                          handleSquareSelect(game.id, index)
                        }
                        claimedSquares={getClaimedSquaresForGame(game.id)}
                      />

                      {/* Action Bar - Above Promo Tiles */}
                      <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Selected: {selectedSquares[game.id]?.length || 0}
                              /3 squares
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {connected
                                ? 'Click squares to select them'
                                : 'Connect wallet to start playing'}
                            </p>
                          </div>
                          <Button
                            disabled={!selectedSquares[game.id]?.length}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          >
                            {connected ? 'Confirm Squares' : 'Connect Wallet'}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upgrade CTA */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <Sparkles className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mb-4" />
                <h3 className="font-bold text-lg mb-2">Ready for More?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Upgrade to play for real cash prizes and get up to 10 squares
                  per game!
                </p>
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                  Upgrade to Cash Games
                </Button>
              </CardContent>
            </Card>

            {/* Your Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Your Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_RECENT_ACTIVITY.map((activity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-sm">{activity.game}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                      <Badge className="bg-blue-600 text-white">
                        +{activity.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CBL Communities */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Join a CBL Community
              </h3>

              {/* Cowboys Nation CBL */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⭐</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">
                        Cowboys Nation CBL
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        "We bleed silver & blue! Join your Cowboys family for
                        exclusive team insights and shared victories."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Join 2.4k Members
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Eagles Community */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🦅</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">
                        Eagle Elite CBL
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        "Fly high with fellow Eagles! Get premium analysis and
                        2x reward bonuses on division games."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Join 1.8k Members
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fantasy Masters CBL */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🏆</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">
                        Fantasy Masters CBL
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        "Data-driven winners only. Join our tight-knit group for
                        advanced strategies & insider picks."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Join 892 Members
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family-Style CBL */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">👨‍👩‍👧‍👦</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">
                        Sunday Squad CBL
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        "Like family game day, but bigger! Casual fun, friendly
                        competition, and shared celebrations."
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Join 3.1k Members
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Connect With Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
