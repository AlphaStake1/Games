'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import ModernSquaresGrid from '@/components/ModernSquaresGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Trophy,
  Star,
  Users,
  ArrowRight,
  Info,
  Gift,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';

// Dynamic game data - in production this would come from API
const FEATURED_GAME = {
  id: 'free-game-1',
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
};

const NFT_UPGRADES = [
  {
    id: 'default-signature',
    label: 'Default Signature',
    description: 'Free black handwritten signature automatically provided',
    icon: Star,
    price: 'FREE',
    popular: false,
  },
  {
    id: 'custom-signature',
    label: 'Custom Signature',
    description: 'Same handwritten look in your choice of colors',
    icon: Sparkles,
    price: '$3',
    popular: false,
  },
  {
    id: 'custom-symbol',
    label: 'Custom Symbol',
    description: 'Upload your own doodle or icon',
    icon: Users,
    price: '$5',
    popular: true,
  },
  {
    id: 'ai-artwork',
    label: 'AI-Generated Art',
    description: 'Create unique art with AI from your prompt',
    icon: Sparkles,
    price: '$10',
    popular: false,
  },
];

export default function FreeBoardPage() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);
  const [showDashboardPrompt, setShowDashboardPrompt] = useState(false);
  const [claimedSquares, setClaimedSquares] = useState<{
    [key: number]: { owner: string; avatar?: string };
  }>({
    12: { owner: 'Player456' },
    28: { owner: 'NFTMaster' },
    45: { owner: 'LuckyPlayer' },
    67: { owner: 'SquareKing' },
    83: { owner: 'GridPro' },
  });

  const handleSquareSelect = (index: number) => {
    if (selectedSquares.includes(index)) {
      setSelectedSquares(selectedSquares.filter((s) => s !== index));
    } else if (selectedSquares.length < 3) {
      setSelectedSquares([...selectedSquares, index]);

      // Show dashboard prompt after selecting first square
      if (selectedSquares.length === 0 && connected) {
        setTimeout(() => setShowDashboardPrompt(true), 1500);
      }
    }
  };

  const handleConfirmSquares = () => {
    if (!connected) {
      // Show wallet connection popup
      return;
    }

    // In production, this would save to blockchain
    router.push('/free-play/dashboard');
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: `Free Football Squares - ${FEATURED_GAME.homeTeam.name} vs ${FEATURED_GAME.awayTeam.name}`,
    description:
      'Play Football Squares for free. Perfect for beginners to learn the game with no financial risk.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Free Play Football Squares
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Learn the game risk-free before playing for real prizes
                </p>
              </div>
              <WalletMultiButton />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Welcome to Free Play!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  This is your training ground for Football Squares. Pick up to
                  3 squares per game, track your points, and compete on the
                  leaderboard - all without spending a dime.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span>3 free squares per game</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span>Earn points & climb ranks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span>Create custom NFTs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ModernSquaresGrid
                gameId={FEATURED_GAME.id}
                homeTeam={FEATURED_GAME.homeTeam}
                awayTeam={FEATURED_GAME.awayTeam}
                gameTime={FEATURED_GAME.gameTime}
                gameDate={FEATURED_GAME.gameDate}
                isFreePlay={true}
                selectedSquares={selectedSquares}
                onSquareSelect={handleSquareSelect}
                claimedSquares={claimedSquares}
              />

              {/* Action Bar */}
              <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected squares: {selectedSquares.length}/3
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {connected
                        ? 'Click squares to select them'
                        : 'Connect wallet to start playing'}
                    </p>
                  </div>
                  <Button
                    onClick={handleConfirmSquares}
                    disabled={selectedSquares.length === 0}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {connected ? 'Confirm Squares' : 'Connect Wallet'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Dashboard Prompt */}
              {showDashboardPrompt && (
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-4 border-black dark:border-white animate-pulse">
                  <CardContent className="p-6">
                    <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">
                      Track Your Progress!
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Access your personal dashboard to see all your games,
                      points, and rankings.
                    </p>
                    <Button
                      onClick={() => router.push('/free-play/dashboard')}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Recent Winners Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Recent Winners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div>
                        <p className="font-semibold">Mike R.</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          2 hours ago
                        </p>
                      </div>
                      <Badge className="bg-yellow-600 text-white">$750</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-semibold">Sarah K.</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Yesterday
                        </p>
                      </div>
                      <Badge variant="secondary">250 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-semibold">Alex T.</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          3 days ago
                        </p>
                      </div>
                      <Badge className="bg-green-600 text-white">$1,200</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CBL Community Promo */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-4 border-black dark:border-white">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
                  <h3 className="font-bold text-lg mb-2">CBL Communities</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Join team-based communities for exclusive benefits and group
                    play!
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Cowboys Nation CBL
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Eagles Fly High CBL
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    CBLs offer group rewards and social features
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* NFT Upgrade Options */}
          <section className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Express Yourself with NFT Signatures
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Stand out on the board with custom NFT signatures. Free players
                can create unique signatures that showcase their personality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {NFT_UPGRADES.map((upgrade) => (
                <Card
                  key={upgrade.id}
                  className={`relative hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    upgrade.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {upgrade.popular && (
                    <Badge className="absolute -top-3 -right-2 bg-purple-600 text-white">
                      Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <upgrade.icon className="w-12 h-12 text-purple-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{upgrade.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {upgrade.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">
                        {upgrade.price}
                      </span>
                      <Button size="sm" variant="outline">
                        {upgrade.price === 'FREE' ? 'Active' : 'Upgrade'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                NFT signatures are visible to all players and add personality to
                your squares
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your Signature
              </Button>
            </div>
          </section>

          {/* How to Play & Social */}
          <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  How Free Play Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Game Rules</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Pick up to 3 squares per game</li>
                      <li>• Numbers assigned randomly when game starts</li>
                      <li>• Win points based on quarter scores</li>
                      <li>• Climb the leaderboard with your wins</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• No financial risk</li>
                      <li>• Learn game strategies</li>
                      <li>• Compete for bragging rights</li>
                      <li>• Unlock achievements</li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Complete Rules
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Join the Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect with thousands of Football Squares players on our
                    social channels.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Telegram Community
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Discord Server
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Twitter/X Updates
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Get tips, strategies, and connect with other players
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bottom CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Level Up?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Master the game with free play, then join cash games for real
              prizes. Your journey to becoming a Football Squares champion
              starts here!
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/free-play/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Explore Cash Games
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
