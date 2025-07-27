'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  getExamplePoints,
  getResultDescription,
  getResultExample,
  type Result,
} from '@/lib/scoring';
import {
  Crown,
  Trophy,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Gift,
  ChevronRight,
  CheckCircle,
  Info,
} from 'lucide-react';

interface Conference {
  id: number;
  name: string;
  price: number;
  filled: number;
  capacity: number;
  featured?: boolean;
}

const SeasonPassLandingPage = () => {
  const router = useRouter();
  const [selectedPassType, setSelectedPassType] = useState<'full' | 'half'>(
    'full',
  );

  // Conference data based on tier system from comprehensive docs
  const conferences: Conference[] = [
    {
      id: 1,
      name: 'Eastern Conference',
      price: 25,
      filled: 87,
      capacity: 100,
    },
    {
      id: 2,
      name: 'Southern Conference',
      price: 50,
      filled: 65,
      capacity: 100,
    },
    {
      id: 3,
      name: 'Northern Conference',
      price: 100,
      filled: 43,
      capacity: 100,
    },
    {
      id: 4,
      name: 'Western Conference',
      price: 200,
      filled: 22,
      capacity: 100,
    },
  ];

  const featuredConference: Conference = {
    id: 5,
    name: 'South-East Conference',
    price: 500,
    filled: 8,
    capacity: 100,
    featured: true,
  };

  const handleMintPass = () => {
    router.push('/season-pass/conferences');
  };

  const ConferenceCard = ({ conference }: { conference: Conference }) => {
    const fillPercentage = (conference.filled / conference.capacity) * 100;
    const isAlmostFull = fillPercentage >= 85;
    const isFull = fillPercentage >= 100;

    const cardClasses = conference.featured
      ? 'relative transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 dark:from-indigo-900/80 dark:to-purple-900/80 dark:border-indigo-400/50 shadow-lg'
      : 'relative transition-all duration-300 hover:shadow-lg bg-white/70 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg';

    return (
      <Card className={`${cardClasses} ${isFull ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle
                className={`text-lg ${conference.featured ? 'text-indigo-800 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}
              >
                {conference.name}
              </CardTitle>
              {conference.featured && (
                <Badge className="mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                  ⭐ FEATURED
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${conference.featured ? 'text-indigo-700 dark:text-indigo-200' : 'text-green-600 dark:text-green-400'}`}
              >
                ${conference.price}
              </p>
              <p
                className={`text-xs ${conference.featured ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}
              >
                per pass
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span
                  className={
                    conference.featured
                      ? 'text-indigo-700 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                >
                  Capacity
                </span>
                <span
                  className={`font-medium ${conference.featured ? 'text-indigo-800 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}
                >
                  {conference.filled}/100
                </span>
              </div>
              <Progress value={fillPercentage} className="h-2" />
              {isAlmostFull && !isFull && (
                <p className="text-xs text-orange-600 mt-1">🔥 Almost full!</p>
              )}
              {isFull && <p className="text-xs text-red-600 mt-1">❌ Full</p>}
            </div>

            <Button
              className={`w-full ${conference.featured ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' : ''}`}
              disabled={isFull}
              onClick={() =>
                router.push(`/season-pass/conferences?id=${conference.id}`)
              }
            >
              {isFull ? 'Conference Full' : 'Select Conference'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:bg-none dark:bg-[#030712] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-sm">
              🏆 SEASON-PASS NFT
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Lock-in a Season-Pass NFT & Chase the Board All Year
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            Mint once, play every game. Score on every NFL game and compete for
            a share of $2.5K--$50K prize pools.
          </p>

          <Button
            onClick={handleMintPass}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Crown className="w-6 h-6 mr-2" />
            Mint My Season Pass
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-blue-50/50 dark:bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Mint Once, Play Every Game',
                description:
                  'A one time crypto payment mints a non-transferable Season-Pass NFT that auto-drops your wallet into the next open 100-square Conference.',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Random Square, Every Kickoff',
                description:
                  'Before each matchup your NFT is assigned to one random square, then 0-9 digits are randomly rolled across the Home and Away axes.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Score What the Teams Score',
                description:
                  'Hit patterns (Forward, Backward, ±5 transforms) earn points every quarter, continuing through all overtime periods.',
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: 'Climb the Conference Leaderboard',
                description:
                  'Points accumulate across the entire season plus playoffs, with post-season rounds multiplying your hits.',
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="bg-white/70 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-300 shadow-lg"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-yellow-500 dark:text-yellow-400 mb-4 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Your Season-Pass Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose Your Season-Pass
          </h2>

          {/* Pass Type Selection */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
              <Button
                variant="ghost"
                onClick={() => setSelectedPassType('full')}
                className={`px-8 py-3 mr-2 font-semibold transition-all duration-200 ${
                  selectedPassType === 'full'
                    ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                Full-Season Pass
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedPassType('half')}
                className={`px-8 py-3 font-semibold transition-all duration-200 ${
                  selectedPassType === 'half'
                    ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                Half-Season Pass
              </Button>
            </div>
          </div>

          {/* Pass Type Info */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-white/70 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg">
              <CardContent className="p-6">
                {selectedPassType === 'full' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Full-Season Pass
                      </h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Covers all 18 weeks + playoffs</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>1 pass per wallet maximum</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Compete against 99 other players</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Playoff multipliers up to 3x</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Half-Season Pass
                      </h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Starts Week 10 through playoffs</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Up to 5 passes per wallet</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Scaling prices: 1x, 1.1x, 1.2x, 1.3x, 1.4x</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>
                          Separate leaderboard from Full Season players for fair
                          competition
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Available Conferences */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Available Conferences
            </h3>

            {/* Regular conferences grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {conferences.map((conference) => (
                <ConferenceCard key={conference.id} conference={conference} />
              ))}
            </div>

            {/* Featured conference - full width */}
            <div className="max-w-2xl mx-auto">
              <ConferenceCard conference={featuredConference} />
            </div>
          </div>
        </div>
      </section>

      {/* Payout Structure */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Season-Long Payout Ladder
          </h2>

          <Card className="bg-white/80 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-gray-900 dark:text-white">
                Tier 5 Conference Example: $500 × 100 = $50,000 pot (80% to
                players)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    place: '1st',
                    payout: '~$14,000',
                    percentage: '35% of Band A',
                  },
                  {
                    place: '2nd',
                    payout: '~$9,200',
                    percentage: '23% of Band A',
                  },
                  {
                    place: '3rd',
                    payout: '~$7,200',
                    percentage: '18% of Band A',
                  },
                  {
                    place: '4th-7th',
                    payout: '~$2,400 each',
                    percentage: '6% of Band A each',
                  },
                  {
                    place: '8th-14th',
                    payout: '~$750 each',
                    percentage: '1.5x return',
                  },
                  {
                    place: '15th-21st',
                    payout: '~$525 each',
                    percentage: '1.05x return',
                  },
                ].map((tier, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        {tier.place}
                      </Badge>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tier.payout}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {tier.percentage}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm text-center text-yellow-800 dark:text-yellow-300">
                  <Info className="w-4 h-4 inline mr-1" />
                  All Season-Pass game payouts are distributed in Solana-based
                  USDC. Protocol retains 20% for weekly boards and operations.
                </p>
              </div>
              <div className="mt-3 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-center text-blue-800 dark:text-blue-300">
                  <Info className="w-4 h-4 inline mr-1" />
                  Top 21 players receive payouts. Tier-specific pool totals:
                  $2.5K/$5K/$10K/$20K/$50K.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scoring Engine */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Scoring Engine
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Hit Patterns */}
            <Card className="bg-white/80 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Hit Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: 'Forward',
                      resultType: 'forward' as Result,
                      description: 'Most common hit pattern (45%)',
                    },
                    {
                      type: 'Backward',
                      resultType: 'backward' as Result,
                      description: 'Second most common (30%)',
                    },
                    {
                      type: 'Forward + 5',
                      resultType: '+5f' as Result,
                      description: 'Third most common (15%)',
                    },
                    {
                      type: 'Backward + 5',
                      resultType: '+5b' as Result,
                      description: 'Rarest pattern (10%)',
                    },
                  ].map((pattern, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {pattern.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getResultDescription(pattern.resultType)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Example: {getResultExample(pattern.resultType)}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {pattern.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-600 text-white">
                          {getExamplePoints(pattern.resultType, 'Q1')} pts
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Q1 example</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Playoff Multipliers */}
            <Card className="bg-white/80 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Playoff Multipliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { round: 'Wild-Card', multiplier: '× 1.5', code: 'WC' },
                    { round: 'Divisional', multiplier: '× 2.0', code: 'DIV' },
                    {
                      round: 'Conference Champ',
                      multiplier: '× 3.5',
                      code: 'CONF',
                    },
                    { round: 'Super Bowl', multiplier: '× 5.0', code: 'SB' },
                  ].map((playoff, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {playoff.round}
                      </span>
                      <Badge className="bg-purple-600 text-white font-bold">
                        {playoff.multiplier}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <Zap className="w-4 h-4 inline mr-1" />
                    Each OT period awards 200 base points × hit pattern
                    percentage × playoff multiplier. Q2 & Q4 get bonus points
                    (250 vs 200).
                  </p>
                </div>
                <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <Info className="w-4 h-4 inline mr-1" />
                    Points calculated to 2 decimals to minimize ties. Example:
                    Forward hit in SB Q4 = 250 × 0.45 × 5.0 = 562.50 pts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Squares lock soon—claim your pass before kickoff!
          </h2>
          <Button
            onClick={handleMintPass}
            className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Crown className="w-6 h-6 mr-2" />
            Mint & Play
          </Button>
          <p className="mt-8 text-black text-sm opacity-80 max-w-2xl mx-auto">
            All purchases are final and non-refundable. The only exception is if
            the Conference board does not achieve full subscription. In such an
            event, the original cryptocurrency amount tendered at the time of
            purchase will be returned to all square purchasers, unadjusted for
            any changes in its market value.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SeasonPassLandingPage;
