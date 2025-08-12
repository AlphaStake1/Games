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
import HomeAwayExplainer from '@/components/HomeAwayExplainer';

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
  const fullSeasonConferences: Conference[] = [
    {
      id: 1,
      name: 'Eastern Conference',
      price: 50,
      filled: 87,
      capacity: 100,
    },
    {
      id: 2,
      name: 'Southern Conference',
      price: 100,
      filled: 65,
      capacity: 100,
    },
    {
      id: 3,
      name: 'Northern Conference',
      price: 250,
      filled: 43,
      capacity: 100,
    },
    {
      id: 4,
      name: 'Western Conference',
      price: 500,
      filled: 22,
      capacity: 100,
    },
  ];

  const fullSeasonFeaturedConference: Conference = {
    id: 5,
    name: 'South-East Conference',
    price: 1000,
    filled: 8,
    capacity: 100,
    featured: true,
  };

  // Half-Season Division data
  const halfSeasonDivisions: Conference[] = [
    {
      id: 6,
      name: 'AFC East Division',
      price: 150,
      filled: 72,
      capacity: 100,
    },
    {
      id: 7,
      name: 'NFC North Division',
      price: 350,
      filled: 48,
      capacity: 100,
    },
  ];

  const halfSeasonFeaturedDivision: Conference = {
    id: 8,
    name: 'AFC West Division',
    price: 700,
    filled: 15,
    capacity: 100,
    featured: true,
  };

  // Select conferences based on pass type
  const conferences =
    selectedPassType === 'full' ? fullSeasonConferences : halfSeasonDivisions;
  const featuredConference =
    selectedPassType === 'full'
      ? fullSeasonFeaturedConference
      : halfSeasonFeaturedDivision;

  const handleMintPass = () => {
    router.push('/season-pass/conferences');
  };

  const ConferenceCard = ({ conference }: { conference: Conference }) => {
    const fillPercentage = (conference.filled / conference.capacity) * 100;
    const isAlmostFull = fillPercentage >= 85;
    const isFull = fillPercentage >= 100;

    const cardClasses = conference.featured
      ? 'relative transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 dark:from-purple-900/80 dark:to-pink-900/80 dark:border-purple-400/50 shadow-xl ring-2 ring-purple-400/50'
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
                <Badge className="mt-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold">
                  ⭐ PREMIUM TIER
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
                router.push(`/season-pass/leaderboard/${conference.id}`)
              }
            >
              {isFull ? 'Conference Full' : 'View Leaderboard'}
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() =>
                router.push(`/season-pass/conferences?id=${conference.id}`)
              }
            >
              Select Conference
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
            Starting at $50 for Full Season or $150 for Half Season
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
                  'Before each matchup your NFT is assigned to one random square, then 0-9 digits are randomly rolled across the HOME and AWAY axes.',
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
                className="bg-white/70 border-4 border-black dark:border-white dark:bg-gray-800/50 hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-300 shadow-lg"
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

          {/* HOME/AWAY Explanation */}
          <div className="mt-12 max-w-4xl mx-auto">
            <HomeAwayExplainer boardType="season" variant="card" />
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
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border-4 border-black dark:border-white shadow-lg">
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
            <Card className="bg-white/70 border-4 border-black dark:border-white dark:bg-gray-800/50 shadow-lg">
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
              {selectedPassType === 'full'
                ? 'Available Conferences'
                : 'Available Divisions'}
            </h3>

            {/* Conference/Division grid */}
            {selectedPassType === 'full' ? (
              <>
                {/* Full Season: 4 regular + 1 featured below */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {conferences.map((conference) => (
                    <ConferenceCard
                      key={conference.id}
                      conference={conference}
                    />
                  ))}
                </div>
                <div className="max-w-2xl mx-auto">
                  <ConferenceCard conference={featuredConference} />
                </div>
              </>
            ) : (
              /* Half Season: All 3 divisions in one row */
              <div className="grid md:grid-cols-3 gap-6">
                {conferences.map((conference) => (
                  <ConferenceCard key={conference.id} conference={conference} />
                ))}
                <ConferenceCard conference={featuredConference} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Payout Structure */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {selectedPassType === 'full'
              ? 'Season-Long Payout Ladder'
              : 'Half-Season Payout Ladder'}
          </h2>

          <Card className="bg-white/80 border-4 border-black dark:border-white dark:bg-gray-800/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-gray-900 dark:text-white">
                {selectedPassType === 'full'
                  ? 'Tier 4 Conference Example: $500 × 100 = $45,000 prize pool'
                  : 'Tier 2 Division Example: $350 × 100 = $31,500 prize pool'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(selectedPassType === 'full'
                  ? [
                      {
                        place: '1st',
                        payout: '$14,000',
                      },
                      {
                        place: '2nd',
                        payout: '$9,000',
                      },
                      {
                        place: '3rd',
                        payout: '$7,000',
                      },
                      {
                        place: '4th-7th',
                        payout: '$1,518 each',
                      },
                      {
                        place: '8th-14th',
                        payout: '$750 each',
                      },
                      {
                        place: '15th-21st',
                        payout: '$525 each',
                      },
                    ]
                  : [
                      {
                        place: '1st',
                        payout: '$8,400',
                      },
                      {
                        place: '2nd',
                        payout: '$4,900',
                      },
                      {
                        place: '3rd',
                        payout: '$3,500',
                      },
                      {
                        place: '4th-7th',
                        payout: '$2,114 each',
                      },
                      {
                        place: '8th-14th',
                        payout: '$525 each',
                      },
                      {
                        place: '15th-21st',
                        payout: '$367 each',
                      },
                    ]
                ).map((tier, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        {tier.place}
                      </Badge>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tier.payout}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-center text-blue-800 dark:text-blue-300">
                  <Info className="w-4 h-4 inline mr-1" />
                  All Season-Pass game payouts are distributed in Solana-based
                  USDC. Prize pools shown are net amounts after protocol fees.
                </p>
              </div>
              <div className="mt-3 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-center text-blue-800 dark:text-blue-300">
                  <Info className="w-4 h-4 inline mr-1" />
                  Top 21 players receive payouts. Pool sizes vary by tier.
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
            <Card className="bg-white/80 border-4 border-black dark:border-white dark:bg-gray-800/50 shadow-lg">
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
            <Card className="bg-white/80 border-4 border-black dark:border-white dark:bg-gray-800/50 shadow-lg">
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
                    Q2 & Q4 award 250 base points, while Q1, Q3, and each OT
                    period award 200 base points.
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
