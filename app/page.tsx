'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import SquaresGrid from '@/components/SquaresGrid';
import HowItWorks from '@/components/HowItWorks';
import SidebarAds from '@/components/SidebarAds';
import VideoSection from '@/components/VideoSection';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const router = useRouter();
  const [gameId, setGameId] = useState<string>('');
  const [showBoard, setShowBoard] = useState(false);

  const handleJoinGame = () => {
    if (gameId.trim()) {
      setShowBoard(true);
    }
  };

  const handleCreateGame = () => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const newGameId = Math.floor(Math.random() * 10000) + 1;
      setGameId(newGameId.toString());
      setShowBoard(true);
    }
  };

  if (showBoard) {
    return (
      <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-[#002244] dark:text-white">
              Football Squares
            </h1>
            <p className="text-[#708090] dark:text-[#96abdc]">
              Game ID: {gameId}
            </p>
          </div>

          <SquaresGrid
            gameId={parseInt(gameId) || 1}
            onSquarePurchase={(squareIndex) => {
              console.log(`Square ${squareIndex} purchase initiated`);
            }}
          />

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowBoard(false)}
              className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white border-[#708090] hover:bg-[#004953] hover:text-white"
            >
              ← Back to Game Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Hero Banner */}
      <Hero />

      {/* Fantasy Football Video Section */}
      <VideoSection />

      {/* Main Content with Sidebar Layout */}
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Main Game Selection Section */}
          <section
            id="ready-to-play"
            className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Ready to Play?
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Choose your path to football squares excitement
                  </p>
                </div>

                {/* Game Type Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  {/* Season-Long Play */}
                  <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white text-xl flex items-center gap-2">
                        🏆 Season-Long Competition
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Compete all season long and accumulate points to win big
                        prizes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Season Pass Benefits:
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• One square per game automatically assigned</li>
                          <li>• Points accumulate across entire season</li>
                          <li>• Playoff multipliers increase your score</li>
                          <li>• Compete in conference leaderboards</li>
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 transition-colors duration-200"
                        onClick={() => router.push('/boards?mode=seasonal')}
                      >
                        Join Season-Long Competition
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Weekly Cash Games */}
                  <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white text-xl flex items-center gap-2">
                        💰 Weekly Cash Games
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Join individual games with instant payouts every quarter
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Weekly Game Features:
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Choose your own squares (up to 5 per board)</li>
                          <li>• Instant payouts after each quarter</li>
                          <li>• No long-term commitment required</li>
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black transition-colors duration-200"
                        onClick={() => router.push('/boards?mode=weekly')}
                      >
                        Browse Weekly Games
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Join Section */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Have a Game ID?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Join a specific game by entering the game ID below
                    </p>
                  </div>
                  <div className="max-w-md mx-auto flex gap-2">
                    <Input
                      type="text"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      placeholder="Enter game ID (e.g., 1234)"
                      className="bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleJoinGame}
                      disabled={!gameId.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 transition-colors duration-200"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <HowItWorks />

          {/* Fantasy Football Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Fantasy Football Hub
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Master fantasy football and enhance your squares strategy
                  </p>
                </div>

                {/* Our Fantasy Guide & Strategy */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white text-xl flex items-center gap-2">
                        🏈 Complete Fantasy Guide
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Master fantasy football with our comprehensive guide
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Learn About:
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Draft strategies and scoring systems</li>
                          <li>• Platform comparisons (ESPN, Yahoo, Sleeper)</li>
                          <li>• Weekly management and waiver wire tactics</li>
                          <li>• Advanced analytics and player evaluation</li>
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 transition-colors duration-200"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open('/fantasy', '_blank');
                          }
                        }}
                      >
                        Explore Fantasy Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white text-xl flex items-center gap-2">
                        🎯 Squares Strategy Integration
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Use fantasy insights to enhance your squares game
                        strategy
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Strategic Advantages:
                        </p>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Analyze team scoring trends and patterns</li>
                          <li>• Understand weather and injury impacts</li>
                          <li>• Leverage advanced stats for better picks</li>
                          <li>• Track player performance correlations</li>
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black transition-colors duration-200"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open('/fantasy', '_blank');
                          }
                        }}
                      >
                        Learn Strategy Integration
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Popular Fantasy Football Platforms */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Popular Fantasy Football Platforms
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      {
                        name: 'ESPN Fantasy',
                        url: 'https://fantasy.espn.com',
                        icon: '🏈',
                        color: 'from-red-600 to-red-800',
                      },
                      {
                        name: 'Yahoo Fantasy',
                        url: 'https://football.fantasysports.yahoo.com',
                        icon: '⚡',
                        color: 'from-purple-600 to-purple-800',
                      },
                      {
                        name: 'NFL Fantasy',
                        url: 'https://fantasy.nfl.com',
                        icon: '🏆',
                        color: 'from-blue-600 to-blue-800',
                      },
                      {
                        name: 'Sleeper',
                        url: 'https://sleeper.app',
                        icon: '💤',
                        color: 'from-green-600 to-green-800',
                      },
                      {
                        name: 'CBS Sports',
                        url: 'https://www.cbssports.com/fantasy/football',
                        icon: '📊',
                        color: 'from-orange-600 to-orange-800',
                      },
                      {
                        name: 'FanDuel',
                        url: 'https://www.fanduel.com',
                        icon: '🎲',
                        color: 'from-indigo-600 to-indigo-800',
                      },
                    ].map((platform, index) => (
                      <Card
                        key={index}
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                      >
                        <CardContent className="p-4 text-center">
                          <div
                            className={`bg-gradient-to-r ${platform.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}
                          >
                            <span className="text-2xl">{platform.icon}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                            {platform.name}
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.open(platform.url, '_blank');
                              }
                            }}
                          >
                            Visit Site
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Fantasy Football Season Overview */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Fantasy Football Season Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">17</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Regular Season Weeks
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">
                        32
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        NFL Teams
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-600">
                        18
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Season Weeks
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-orange-600">
                        272
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Regular Season Games
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features & Benefits Section */}
          <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Why Choose Football Squares?
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    The most trusted and transparent platform for NFL squares
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: '🔐',
                      title: 'Verifiable Randomness',
                      description:
                        'Using Switchboard VRF for provably fair number generation',
                    },
                    {
                      icon: '⚡',
                      title: 'Automated Payouts',
                      description:
                        'Winners are paid automatically via smart contract',
                    },
                    {
                      icon: '📊',
                      title: 'Real-time Updates',
                      description: 'Live score updates and game state changes',
                    },
                    {
                      icon: '🌐',
                      title: 'Transparent & Trustless',
                      description:
                        'All game logic runs on-chain with full transparency',
                    },
                    {
                      icon: '💰',
                      title: 'Low Fees',
                      description:
                        "Minimal transaction fees thanks to Solana's efficiency",
                    },
                    {
                      icon: '📧',
                      title: 'Email Notifications',
                      description:
                        'Get notified when you win or when games start',
                    },
                  ].map((feature, index) => (
                    <Card
                      key={index}
                      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Recent Winners Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Recent Winners
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Congratulations to our latest Football Squares champions
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      game: 'Game #4872',
                      winner: 'Player123',
                      amount: '$2,500',
                      quarter: 'Final',
                    },
                    {
                      game: 'Game #4865',
                      winner: 'SquaresMaster',
                      amount: '$1,200',
                      quarter: 'Q3',
                    },
                    {
                      game: 'Game #4791',
                      winner: 'Michael V',
                      amount: '$3,100',
                      quarter: 'Final',
                    },
                    {
                      game: 'Game #4783',
                      winner: 'GridIron99',
                      amount: '$850',
                      quarter: 'Q2',
                    },
                    {
                      game: 'Game #4724',
                      winner: 'TouchdownKing',
                      amount: '$1,900',
                      quarter: 'Q4',
                    },
                    {
                      game: 'Game #4716',
                      winner: 'SquareWinner',
                      amount: '$750',
                      quarter: 'Q1',
                    },
                  ].map((winner, index) => (
                    <Card
                      key={index}
                      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {winner.game}
                          </span>
                          <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                            {winner.quarter}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {winner.winner}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Winner
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {winner.amount}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Prize
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Community Testimonials */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    What Players Say
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Real testimonials from players who enjoyed our physical
                    boards
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-500 italic">
                    These amazing experiences inspired Coach B to bring Football
                    Squares to the digital world so more players can enjoy the
                    game
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      name: 'Sarah M.',
                      role: 'Season Pass Holder',
                      quote:
                        "I've been playing football squares for years, but this platform makes it so much easier. The automated payouts are a game-changer!",
                      rating: 5,
                    },
                    {
                      name: 'Mike R.',
                      role: 'Weekly Player',
                      quote:
                        'Love the transparency of the blockchain. I can verify every game and know my winnings are secure. Plus, the strategy guides helped me improve my picks!',
                      rating: 5,
                    },
                    {
                      name: 'Jennifer L.',
                      role: 'Fantasy Football Enthusiast',
                      quote:
                        'The integration with fantasy football insights is brilliant. I use the platform stats to make better decisions in both games.',
                      rating: 5,
                    },
                  ].map((testimonial, index) => (
                    <Card
                      key={index}
                      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xl">
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                          "{testimonial.quote}"
                        </p>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h2 className="text-3xl font-bold mb-4">Stay in the Game</h2>
                  <p className="text-lg mb-6 opacity-90">
                    Get weekly NFL insights, game alerts, and exclusive tips
                    delivered to your inbox
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-white/50"
                    />
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-sm opacity-75 mt-3">
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <SidebarAds refreshTrigger={0} />
      </div>
    </div>
  );
}
