'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Crown,
  Trophy,
  Star,
  Zap,
  Target,
  Users,
  Calendar,
  DollarSign,
  Shield,
  ArrowRight,
  CheckCircle,
  Info,
  AlertCircle,
  Clock,
  TrendingUp,
  Award,
  Gift,
  Coins,
  ArrowLeft,
  BookOpen,
  Calculator,
  Grid3X3,
  Timer,
  Medal,
  Flame,
  PlayCircle,
} from 'lucide-react';

const SeasonPassRulesPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const HitPatternExample = ({
    homeScore,
    awayScore,
    pattern,
    points,
    description,
  }: {
    homeScore: number;
    awayScore: number;
    pattern: string;
    points: number;
    description: string;
  }) => (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-white">
            {homeScore} - {awayScore}
          </div>
          <Badge
            variant="outline"
            className="text-yellow-400 border-yellow-400"
          >
            {pattern}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-400">+{points}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );

  const StepCard = ({
    step,
    title,
    description,
    icon,
  }: {
    step: number;
    title: string;
    description: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-yellow-400">{icon}</div>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );

  const PrizeStructure = ({ conferencePrice }: { conferencePrice: number }) => {
    const prizePool = conferencePrice * 100;
    const prizes = [
      { place: '1st', percentage: 50, amount: prizePool * 0.5 },
      { place: '2nd', percentage: 20, amount: prizePool * 0.2 },
      { place: '3rd', percentage: 10, amount: prizePool * 0.1 },
      { place: '4th', percentage: 5, amount: prizePool * 0.05 },
      { place: '5th', percentage: 5, amount: prizePool * 0.05 },
      { place: '6th', percentage: 5, amount: prizePool * 0.05 },
      { place: '7th', percentage: 5, amount: prizePool * 0.05 },
    ];

    return (
      <div className="space-y-3">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-green-400">
            ${conferencePrice} Conference = ${prizePool.toLocaleString()} Prize
            Pool
          </h3>
        </div>
        {prizes.map((prize, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0
                    ? 'bg-yellow-500 text-black'
                    : index === 1
                      ? 'bg-gray-400 text-black'
                      : index === 2
                        ? 'bg-orange-500 text-black'
                        : 'bg-gray-700 text-white'
                }`}
              >
                {index < 3 ? (
                  index === 0 ? (
                    <Trophy className="w-4 h-4" />
                  ) : index === 1 ? (
                    <Medal className="w-4 h-4" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )
                ) : (
                  prize.place.replace(/\D/g, '')
                )}
              </div>
              <span className="font-semibold">{prize.place} Place</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                ${prize.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{prize.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/season-pass')}
            className="mb-4 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Season Pass
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                Season-Pass Rules & Onboarding
              </h1>
              <p className="text-gray-400 mt-2">
                Complete guide to the Season-Pass NFT system and points
                accumulation
              </p>
            </div>

            <Button
              onClick={() => router.push('/season-pass/conferences')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 h-14 bg-gray-800 border border-gray-700 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="conferences">Conferences</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  What is Season-Pass NFT?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Season-Pass NFT is a comprehensive NFL squares competition
                  system where players mint a single non-transferable NFT that
                  grants access to every NFL game throughout the season and
                  playoffs. Unlike traditional weekly games, your Season-Pass
                  accumulates points across the entire season, creating a
                  long-term competitive experience.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-400">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>One NFT, entire season access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Automatic square assignment per game</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Points accumulate across all games</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Playoff multipliers increase stakes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Conference-based competition</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-400">
                      Season Structure
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Regular Season</span>
                        <Badge variant="outline">18 weeks</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Wild Card</span>
                        <Badge className="bg-purple-600">1.5x multiplier</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Divisional</span>
                        <Badge className="bg-purple-600">2x multiplier</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Conference Champ</span>
                        <Badge className="bg-purple-600">2.5x multiplier</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Super Bowl</span>
                        <Badge className="bg-purple-600">3x multiplier</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Full-Season vs Half-Season
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-400">
                      Full-Season Pass
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Covers all 18 weeks + playoffs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Maximum 1 pass per wallet</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Compete in 100-player conferences</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Full playoff multiplier benefits</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-400">
                      Half-Season Pass
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Starts Week 10 through playoffs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Up to 5 passes per wallet</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Scaling prices: 1x, 1.1x, 1.2x, 1.3x, 1.4x</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Separate competitive pool</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-green-400" />
                  Getting Started: Step-by-Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <StepCard
                    step={1}
                    title="Connect Your Wallet"
                    description="Connect a Solana wallet (Phantom, Solflare, etc.) with sufficient USDC for your chosen conference tier."
                    icon={<Shield className="w-5 h-5" />}
                  />

                  <StepCard
                    step={2}
                    title="Choose Your Conference"
                    description="Select from 5 conference tiers ($100-$500) based on your preferred competition level and prize pool size."
                    icon={<Users className="w-5 h-5" />}
                  />

                  <StepCard
                    step={3}
                    title="Select Pass Type"
                    description="Choose between Full-Season (18 weeks + playoffs) or Half-Season (Week 10 + playoffs) participation."
                    icon={<Calendar className="w-5 h-5" />}
                  />

                  <StepCard
                    step={4}
                    title="Mint Your NFT"
                    description="Complete USDC payment to mint your soulbound Season-Pass NFT. This grants automatic access to all games."
                    icon={<Crown className="w-5 h-5" />}
                  />

                  <StepCard
                    step={5}
                    title="Auto-Assignment Begins"
                    description="Before each NFL game, your NFT is automatically assigned to a random square. No manual actions required!"
                    icon={<Grid3X3 className="w-5 h-5" />}
                  />

                  <StepCard
                    step={6}
                    title="Track Your Progress"
                    description="Monitor your points accumulation, conference ranking, and hit patterns through your personalized dashboard."
                    icon={<TrendingUp className="w-5 h-5" />}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                  Important Onboarding Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">
                        Soulbound NFTs
                      </span>
                    </div>
                    <p className="text-sm text-yellow-100">
                      Season-Pass NFTs are non-transferable and permanently
                      bound to your wallet. They cannot be sold, traded, or
                      moved to another address.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-blue-400">
                        Auto-Assignment Timing
                      </span>
                    </div>
                    <p className="text-sm text-blue-100">
                      Square assignments happen automatically before each game
                      kickoff. You don&apos;t need to manually select or claim
                      squares.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <span className="font-semibold text-purple-400">
                        USDC Payments
                      </span>
                    </div>
                    <p className="text-sm text-purple-100">
                      All payments are processed in USDC on the Solana network.
                      Ensure your wallet has sufficient USDC plus a small amount
                      of SOL for transaction fees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scoring Tab */}
          <TabsContent value="scoring" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-400" />
                  Hit Patterns & Point Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-300">
                    Points are earned when the last digit of each team&apos;s
                    score matches your assigned square according to these hit
                    patterns. All patterns are checked after every scoring
                    event.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-yellow-400">
                        Hit Pattern Examples
                      </h3>
                      <div className="space-y-3">
                        <HitPatternExample
                          homeScore={7}
                          awayScore={4}
                          pattern="Forward"
                          points={10}
                          description="Direct match: Home=7, Away=4"
                        />
                        <HitPatternExample
                          homeScore={4}
                          awayScore={7}
                          pattern="Backward"
                          points={7}
                          description="Reverse match: Away=7, Home=4"
                        />
                        <HitPatternExample
                          homeScore={2}
                          awayScore={9}
                          pattern="Forward+5"
                          points={5}
                          description="Forward shifted: (7+5)%10=2, (4+5)%10=9"
                        />
                        <HitPatternExample
                          homeScore={9}
                          awayScore={2}
                          pattern="Backward+5"
                          points={3}
                          description="Backward shifted: Reverse of Forward+5"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-yellow-400">
                        Point Values
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <span className="font-semibold">Forward</span>
                            <p className="text-xs text-gray-400">
                              Exact match (Home, Away)
                            </p>
                          </div>
                          <Badge className="bg-green-600">10 pts</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <span className="font-semibold">Backward</span>
                            <p className="text-xs text-gray-400">
                              Reverse match (Away, Home)
                            </p>
                          </div>
                          <Badge className="bg-blue-600">7 pts</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <span className="font-semibold">Forward+5</span>
                            <p className="text-xs text-gray-400">
                              Shifted forward pattern
                            </p>
                          </div>
                          <Badge className="bg-purple-600">5 pts</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <span className="font-semibold">Backward+5</span>
                            <p className="text-xs text-gray-400">
                              Shifted backward pattern
                            </p>
                          </div>
                          <Badge className="bg-orange-600">3 pts</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  Playoff Multipliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    During playoff rounds, all hit points are multiplied by
                    increasing factors to amplify the excitement and stakes of
                    post-season competition.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-purple-400">
                        Multiplier Schedule
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <span className="font-semibold">Wild Card Round</span>
                          <Badge className="bg-purple-600 font-bold">
                            × 1.5
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <span className="font-semibold">
                            Divisional Round
                          </span>
                          <Badge className="bg-purple-600 font-bold">
                            × 2.0
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <span className="font-semibold">
                            Conference Championship
                          </span>
                          <Badge className="bg-purple-600 font-bold">
                            × 2.5
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <span className="font-semibold">Super Bowl</span>
                          <Badge className="bg-purple-600 font-bold">
                            × 3.0
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-purple-400">
                        Example Calculation
                      </h3>
                      <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700">
                        <p className="text-sm mb-3">Super Bowl Forward Hit:</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Base Forward Points:</span>
                            <span>10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Super Bowl Multiplier:</span>
                            <span>× 3.0</span>
                          </div>
                          <Separator className="my-2 bg-purple-700" />
                          <div className="flex justify-between font-bold text-purple-400">
                            <span>Total Points:</span>
                            <span>30</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-6 h-6 text-blue-400" />
                  Overtime Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-blue-400">
                      Full Overtime Scoring
                    </span>
                  </div>
                  <p className="text-sm text-blue-100">
                    All scoring events in overtime periods earn full point
                    values with no reduction. Playoff multipliers apply normally
                    to overtime scoring, making extended games extremely
                    valuable for Season-Pass holders.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conferences Tab */}
          <TabsContent value="conferences" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Conference System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-300">
                    Each conference accommodates exactly 100 players and
                    operates as an independent competitive pool. Higher-tier
                    conferences have larger prize pools and attract more
                    experienced players.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-yellow-400">
                        Conference Tiers
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-600">Bronze</Badge>
                            <span>Entry Level</span>
                          </div>
                          <span className="font-bold text-green-400">$100</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gray-400">Silver</Badge>
                            <span>Intermediate</span>
                          </div>
                          <span className="font-bold text-green-400">$200</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-500">Gold</Badge>
                            <span>Advanced</span>
                          </div>
                          <span className="font-bold text-green-400">$300</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-500">Platinum</Badge>
                            <span>Expert</span>
                          </div>
                          <span className="font-bold text-green-400">$400</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500">Diamond</Badge>
                            <span>Elite</span>
                          </div>
                          <span className="font-bold text-green-400">$500</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-yellow-400">
                        Conference Rules
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Exactly 100 players per conference</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Conferences fill in sequential order</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>New conferences open when previous fills</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>
                            Each tier cycles through all 5 price levels
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Independent leaderboards per conference</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-green-400" />
                  Prize Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-300">
                    Each conference distributes prizes to the top 7 finishers
                    using a fixed percentage structure that scales with the
                    conference&apos;s total prize pool.
                  </p>

                  <Tabs defaultValue="100" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 h-14">
                      <TabsTrigger value="100">$100</TabsTrigger>
                      <TabsTrigger value="200">$200</TabsTrigger>
                      <TabsTrigger value="300">$300</TabsTrigger>
                      <TabsTrigger value="400">$400</TabsTrigger>
                      <TabsTrigger value="500">$500</TabsTrigger>
                    </TabsList>

                    <TabsContent value="100">
                      <PrizeStructure conferencePrice={100} />
                    </TabsContent>
                    <TabsContent value="200">
                      <PrizeStructure conferencePrice={200} />
                    </TabsContent>
                    <TabsContent value="300">
                      <PrizeStructure conferencePrice={300} />
                    </TabsContent>
                    <TabsContent value="400">
                      <PrizeStructure conferencePrice={400} />
                    </TabsContent>
                    <TabsContent value="500">
                      <PrizeStructure conferencePrice={500} />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-400" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What happens if I miss minting before the season starts?
                    </AccordionTrigger>
                    <AccordionContent>
                      If you miss the Full-Season deadline, you can still
                      participate in Half-Season passes starting from Week 10.
                      Half-Season passes allow up to 5 NFTs per wallet with
                      scaling prices and separate competitive pools.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How are squares assigned to my NFT?
                    </AccordionTrigger>
                    <AccordionContent>
                      Before each NFL game, the system automatically assigns
                      your Season-Pass NFT to a random square (0-9 for both home
                      and away teams). This happens automatically without any
                      action required from you.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      Can I trade or sell my Season-Pass NFT?
                    </AccordionTrigger>
                    <AccordionContent>
                      No, Season-Pass NFTs are soulbound and non-transferable.
                      They are permanently tied to your wallet address and
                      cannot be sold, traded, or moved to another wallet.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      What if my conference doesn&apos;t fill up?
                    </AccordionTrigger>
                    <AccordionContent>
                      Conferences must reach exactly 100 players to activate. If
                      a conference doesn&apos;t fill by the season start,
                      participants are automatically moved to the next available
                      conference of the same tier, and any price difference is
                      refunded.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      How are playoff multipliers applied?
                    </AccordionTrigger>
                    <AccordionContent>
                      Playoff multipliers are applied to all hit points earned
                      during playoff games. The multiplier increases with each
                      round: Wild Card (1.5x), Divisional (2x), Conference
                      Championship (2.5x), and Super Bowl (3x).
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>
                      What happens to points in overtime?
                    </AccordionTrigger>
                    <AccordionContent>
                      Overtime scoring events earn full point values with no
                      reduction. If the game is during playoffs, playoff
                      multipliers apply normally to overtime hits, making
                      extended games extremely valuable.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>
                      When and how are prizes distributed?
                    </AccordionTrigger>
                    <AccordionContent>
                      Prizes are distributed in USDC to the top 7 finishers in
                      each conference after the Super Bowl concludes.
                      Distribution happens automatically through smart contracts
                      within 48 hours of the final game.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>
                      Can I participate in multiple conferences?
                    </AccordionTrigger>
                    <AccordionContent>
                      For Full-Season passes, you can only mint one NFT per
                      wallet. However, Half-Season passes allow up to 5 NFTs per
                      wallet within the same conference, with scaling prices for
                      each additional pass.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeasonPassRulesPage;
