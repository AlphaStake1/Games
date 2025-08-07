'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown,
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Clock,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Gift,
  ChevronRight,
  Play,
  Coins,
  Timer,
  Shield,
  Medal,
  Award,
  Flame,
} from 'lucide-react';

interface PlayerStats {
  totalPoints: number;
  seasonRank: number;
  totalHits: number;
  hitRate: number;
  gamesPlayed: number;
  currentStreak: number;
  bestStreak: number;
  playoffMultiplier: number;
}

interface GameHit {
  id: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  week: number;
  quarter: string;
  scoreType: string;
  homeScore: number;
  awayScore: number;
  hitPattern: 'Forward' | 'Backward' | 'Forward+5' | 'Backward+5';
  points: number;
  timestamp: string;
  isPlayoff: boolean;
  gameType: 'season-pass' | 'weekly-cash' | 'free-play';
}

interface ConferenceStanding {
  rank: number;
  walletAddress: string;
  displayName: string;
  points: number;
  hits: number;
  isCurrentUser: boolean;
}

const SeasonPassDashboard = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<
    'season-pass' | 'weekly-cash' | 'free-play'
  >('season-pass');

  // Mock player stats
  const playerStats: PlayerStats = {
    totalPoints: 1847,
    seasonRank: 12,
    totalHits: 94,
    hitRate: 0.67,
    gamesPlayed: 140,
    currentStreak: 7,
    bestStreak: 12,
    playoffMultiplier: 1.5,
  };

  // Mock recent hits with different game types
  const recentHits: GameHit[] = [
    {
      id: '1',
      gameId: 'buf-mia-w18',
      homeTeam: 'MIA',
      awayTeam: 'BUF',
      week: 18,
      quarter: 'Q2',
      scoreType: 'TD',
      homeScore: 14,
      awayScore: 7,
      hitPattern: 'Forward',
      points: 15, // 10 base * 1.5 playoff multiplier
      timestamp: '2024-01-14T18:30:00Z',
      isPlayoff: true,
      gameType: 'season-pass',
    },
    {
      id: '2',
      gameId: 'dal-phi-w17',
      homeTeam: 'PHI',
      awayTeam: 'DAL',
      week: 17,
      quarter: 'Q4',
      scoreType: 'FG',
      homeScore: 24,
      awayScore: 17,
      hitPattern: 'Backward+5',
      points: 3,
      timestamp: '2024-01-07T20:45:00Z',
      isPlayoff: false,
      gameType: 'weekly-cash',
    },
    {
      id: '3',
      gameId: 'kc-den-w16',
      homeTeam: 'DEN',
      awayTeam: 'KC',
      week: 16,
      quarter: 'Q3',
      scoreType: 'TD',
      homeScore: 21,
      awayScore: 14,
      hitPattern: 'Forward+5',
      points: 5,
      timestamp: '2024-12-31T16:25:00Z',
      isPlayoff: false,
      gameType: 'free-play',
    },
  ];

  // Mock conference standings
  const conferenceStandings: ConferenceStanding[] = [
    {
      rank: 1,
      walletAddress: '7xKW...9mPq',
      displayName: 'CryptoKing',
      points: 2456,
      hits: 142,
      isCurrentUser: false,
    },
    {
      rank: 2,
      walletAddress: '9jR3...8nLx',
      displayName: 'SquaresMaster',
      points: 2301,
      hits: 138,
      isCurrentUser: false,
    },
    {
      rank: 3,
      walletAddress: '4mS7...2qTv',
      displayName: 'NFLOracle',
      points: 2178,
      hits: 129,
      isCurrentUser: false,
    },
    {
      rank: 12,
      walletAddress: '8tY5...3wEr',
      displayName: 'You',
      points: 1847,
      hits: 94,
      isCurrentUser: true,
    },
    {
      rank: 13,
      walletAddress: '6pL9...7kMn',
      displayName: 'GridGrinder',
      points: 1832,
      hits: 91,
      isCurrentUser: false,
    },
  ];

  const getGameTypeConfig = (gameType: string) => {
    switch (gameType) {
      case 'season-pass':
        return {
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          textColor: 'text-yellow-400',
          label: 'Season-Pass',
          icon: <Crown className="w-4 h-4" />,
        };
      case 'weekly-cash':
        return {
          color: 'bg-gradient-to-r from-green-400 to-emerald-500',
          textColor: 'text-green-400',
          label: 'Weekly Cash',
          icon: <DollarSign className="w-4 h-4" />,
        };
      case 'free-play':
        return {
          color: 'bg-gradient-to-r from-blue-400 to-cyan-500',
          textColor: 'text-blue-400',
          label: 'Free Play',
          icon: <Play className="w-4 h-4" />,
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-400',
          label: 'Unknown',
          icon: <Shield className="w-4 h-4" />,
        };
    }
  };

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    trend,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-yellow-400">{icon}</div>
            <div>
              <p className="text-sm text-gray-400">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 ${
                trend === 'up'
                  ? 'text-green-400'
                  : trend === 'down'
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}
            >
              {trend === 'up' && <ArrowUp className="w-4 h-4" />}
              {trend === 'down' && <ArrowDown className="w-4 h-4" />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const HitCard = ({ hit }: { hit: GameHit }) => {
    const config = getGameTypeConfig(hit.gameType);

    return (
      <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Badge className={`${config.color} text-black font-bold`}>
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Badge>
              <span className="text-sm text-gray-400">
                {hit.awayTeam} @ {hit.homeTeam} • Week {hit.week}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${config.textColor}`}>
                +{hit.points}
              </span>
              <span className="text-xs text-gray-500 ml-1">pts</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                {hit.quarter} • {hit.scoreType}
              </span>
              <span className="text-gray-400">{hit.hitPattern}</span>
              <span className="text-gray-400">
                {hit.homeScore}-{hit.awayScore}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hit.isPlayoff && (
                <Badge
                  variant="outline"
                  className="text-purple-400 border-purple-400"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {hit.gameType === 'season-pass'
                    ? `${playerStats.playoffMultiplier}x`
                    : 'Playoff'}
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {new Date(hit.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeaderboardRow = ({ standing }: { standing: ConferenceStanding }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        standing.isCurrentUser
          ? 'bg-yellow-900/30 border border-yellow-700'
          : 'bg-gray-800/30 hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            standing.rank === 1
              ? 'bg-yellow-500 text-black'
              : standing.rank === 2
                ? 'bg-gray-400 text-black'
                : standing.rank === 3
                  ? 'bg-orange-500 text-black'
                  : 'bg-gray-700 text-white'
          }`}
        >
          {standing.rank <= 3 ? (
            standing.rank === 1 ? (
              <Trophy className="w-4 h-4" />
            ) : standing.rank === 2 ? (
              <Medal className="w-4 h-4" />
            ) : (
              <Award className="w-4 h-4" />
            )
          ) : (
            standing.rank
          )}
        </div>

        <div>
          <p
            className={`font-semibold ${standing.isCurrentUser ? 'text-yellow-400' : 'text-white'}`}
          >
            {standing.displayName}
          </p>
          <p className="text-xs text-gray-400">{standing.walletAddress}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-green-400">
          {standing.points.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">{standing.hits} hits</p>
      </div>
    </div>
  );

  const filterHitsByGameType = (hits: GameHit[]) => {
    if (selectedTab === 'season-pass') {
      return hits.filter((hit) => hit.gameType === 'season-pass');
    } else if (selectedTab === 'weekly-cash') {
      return hits.filter((hit) => hit.gameType === 'weekly-cash');
    } else if (selectedTab === 'free-play') {
      return hits.filter((hit) => hit.gameType === 'free-play');
    }
    return hits;
  };

  const getFilteredStats = () => {
    const filteredHits = filterHitsByGameType(recentHits);
    const totalPoints = filteredHits.reduce((sum, hit) => sum + hit.points, 0);

    return {
      totalPoints,
      totalHits: filteredHits.length,
      recentHits: filteredHits,
    };
  };

  const filteredStats = getFilteredStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                Season-Pass Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Track your progress across all game types
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/season-pass/conferences')}
                className="border-gray-600 hover:bg-gray-800"
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Conferences
              </Button>
              <Button
                onClick={() => router.push('/season-pass')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Season-Pass Hub
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Game Type Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-3 h-14 bg-gray-800 border border-gray-700">
            <TabsTrigger
              value="season-pass"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black"
            >
              <Crown className="w-4 h-4" />
              Season-Pass
            </TabsTrigger>
            <TabsTrigger
              value="weekly-cash"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-black"
            >
              <DollarSign className="w-4 h-4" />
              Weekly Cash
            </TabsTrigger>
            <TabsTrigger
              value="free-play"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-cyan-500 data-[state=active]:text-black"
            >
              <Play className="w-4 h-4" />
              Free Play
            </TabsTrigger>
          </TabsList>

          {/* Season-Pass Tab */}
          <TabsContent value="season-pass" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Total Points"
                value={playerStats.totalPoints.toLocaleString()}
                subtitle="Season-Pass NFT"
                trend="up"
              />
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                title="Conference Rank"
                value={`#${playerStats.seasonRank}`}
                subtitle="of 100 players"
                trend="up"
              />
              <StatCard
                icon={<Target className="w-6 h-6" />}
                title="Hit Rate"
                value={`${(playerStats.hitRate * 100).toFixed(1)}%`}
                subtitle={`${playerStats.totalHits} total hits`}
                trend="neutral"
              />
              <StatCard
                icon={<Flame className="w-6 h-6" />}
                title="Current Streak"
                value={playerStats.currentStreak}
                subtitle={`Best: ${playerStats.bestStreak}`}
                trend="up"
              />
            </div>

            {/* Season Progress */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Season Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Season Completion</span>
                    <span className="font-medium">Week 18 / 22 Total</span>
                  </div>
                  <Progress value={82} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Regular Season: 18 weeks</span>
                    <span>Playoffs: 4 weeks remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conference Leaderboard */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Northern Conference Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conferenceStandings.map((standing) => (
                    <LeaderboardRow key={standing.rank} standing={standing} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Cash Tab */}
          <TabsContent value="weekly-cash" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Weekly Cash Points"
                value={filteredStats.totalPoints}
                subtitle="This week"
                trend="up"
              />
              <StatCard
                icon={<Timer className="w-6 h-6" />}
                title="Games Remaining"
                value="12"
                subtitle="This week"
                trend="neutral"
              />
              <StatCard
                icon={<Gift className="w-6 h-6" />}
                title="Estimated Winnings"
                value="$247"
                subtitle="If current rank holds"
                trend="up"
              />
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">
                  Weekly Cash Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  Weekly Cash Games integration coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Free Play Tab */}
          <TabsContent value="free-play" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<Play className="w-6 h-6" />}
                title="Free Play Points"
                value={filteredStats.totalPoints}
                subtitle="All time"
                trend="up"
              />
              <StatCard
                icon={<Star className="w-6 h-6" />}
                title="Practice Hits"
                value={filteredStats.totalHits}
                subtitle="Learning the patterns"
                trend="neutral"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                title="Games Played"
                value="23"
                subtitle="Free practice rounds"
                trend="up"
              />
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Free Play Games</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  Free Play Games integration coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity - Shows across all tabs */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Recent Activity
              <Badge variant="outline" className="ml-2">
                {selectedTab === 'season-pass'
                  ? 'Season-Pass'
                  : selectedTab === 'weekly-cash'
                    ? 'Weekly Cash'
                    : 'Free Play'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStats.recentHits.length > 0 ? (
                filteredStats.recentHits.map((hit) => (
                  <HitCard key={hit.id} hit={hit} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No recent activity in{' '}
                    {selectedTab === 'season-pass'
                      ? 'Season-Pass'
                      : selectedTab === 'weekly-cash'
                        ? 'Weekly Cash'
                        : 'Free Play'}{' '}
                    games
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonPassDashboard;
