'use client';

import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InfoTooltip from '@/components/InfoTooltip';
import {
  Users,
  DollarSign,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  BarChart3,
  Clock,
  Star,
  Award,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Eye,
  Download,
  Filter,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface PointsBreakdown {
  weekly: number;
  seasonal: number;
  cbl: number;
  total: number;
}

interface PlayerStats {
  totalGamesPlayed: number;
  totalSquaresPurchased: number;
  totalWinnings: number;
  totalSpent: number;
  winRate: number;
  profitLoss: number;
  averagePositionsPerGame: number;
  favoriteTeams: string[];
  bestPerformingTier: string;
  currentStreak: { type: 'win' | 'loss'; count: number };
  bluePoints: PointsBreakdown;
  greenPoints: number; // Always cumulative seasonal total
  orangePoints: PointsBreakdown;
}

interface GameHistory {
  gameId: string;
  week: number;
  homeTeam: string;
  awayTeam: string;
  gameDate: Date;
  boardTier: string;
  squaresPurchased: number;
  totalSpent: number;
  winnings: number;
  status: 'completed' | 'active' | 'upcoming';
  mySquares: { position: number; numbers: [number, number] | null }[];
  finalScore?: { home: number; away: number };
}

interface ActivePosition {
  gameId: string;
  boardId: string;
  gameInfo: string;
  squarePosition: number;
  numbers: [number, number] | null;
  potentialPayouts: { q1: number; q2: number; q3: number; final: number };
  potentialPoints: { q1: number; q2: number; q3: number; final: number };
  gameStatus: 'pre-game' | 'q1' | 'q2' | 'q3' | 'q4' | 'final' | 'overtime';
  currentScore?: { home: number; away: number };
  isWinning?: boolean;
}

interface TrendData {
  date: string;
  spent: number;
  winnings: number;
  netProfit: number;
  gamesPlayed: number;
}

function PlayerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('all'); // all, month, quarter, season
  const [dashboardPeriod, setDashboardPeriod] = useState<'weekly' | 'seasonal'>(
    'weekly',
  );
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from API
  // Green Points are always cumulative seasonal total (consistent across views)
  const seasonalTotalGreenPoints = 1247.5; // Season-to-date total with 1 decimal precision

  const playerStatsWeekly: PlayerStats = {
    totalGamesPlayed: 12,
    totalSquaresPurchased: 48,
    totalWinnings: 780,
    totalSpent: 620,
    winRate: 33.3,
    profitLoss: 160,
    averagePositionsPerGame: 4.0,
    favoriteTeams: ['Eagles', 'Cowboys', 'Chiefs'],
    bestPerformingTier: '$20 Entry',
    currentStreak: { type: 'win', count: 2 },
    bluePoints: {
      weekly: 142,
      seasonal: 486,
      cbl: 89,
      total: 717,
    },
    greenPoints: seasonalTotalGreenPoints, // Always cumulative seasonal total
    orangePoints: {
      weekly: 67,
      seasonal: 189,
      cbl: 45,
      total: 301,
    },
  };

  const playerStatsSeasonal: PlayerStats = {
    totalGamesPlayed: 45,
    totalSquaresPurchased: 178,
    totalWinnings: 0, // No dollar tracking for seasonal
    totalSpent: 0, // No dollar tracking for seasonal
    winRate: 28.5,
    profitLoss: 0, // No dollar tracking for seasonal
    averagePositionsPerGame: 3.9,
    favoriteTeams: ['Eagles', 'Cowboys', 'Chiefs'],
    bestPerformingTier: 'Full Season Player',
    currentStreak: { type: 'win', count: 3 },
    bluePoints: {
      weekly: 142,
      seasonal: 486,
      cbl: 89,
      total: 717,
    },
    greenPoints: seasonalTotalGreenPoints, // Always cumulative seasonal total
    orangePoints: {
      weekly: 67,
      seasonal: 189,
      cbl: 45,
      total: 301,
    },
  };

  const playerStats =
    dashboardPeriod === 'weekly' ? playerStatsWeekly : playerStatsSeasonal;

  const activePositions: ActivePosition[] = [
    {
      gameId: 'week15-eagles-cowboys',
      boardId: 'board-001',
      gameInfo: 'Eagles vs Cowboys - Week 15',
      squarePosition: 23,
      numbers: [3, 7],
      potentialPayouts: { q1: 285, q2: 475, q3: 285, final: 855 },
      potentialPoints: { q1: 45, q2: 75, q3: 45, final: 135 },
      gameStatus: 'q2',
      currentScore: { home: 14, away: 7 },
      isWinning: true,
    },
    {
      gameId: 'week15-chiefs-bills',
      boardId: 'board-002',
      gameInfo: 'Chiefs vs Bills - Week 15',
      squarePosition: 67,
      numbers: [0, 4],
      potentialPayouts: { q1: 142, q2: 238, q3: 142, final: 428 },
      potentialPoints: { q1: 25, q2: 40, q3: 25, final: 75 },
      gameStatus: 'pre-game',
    },
    {
      gameId: 'week16-49ers-rams',
      boardId: 'board-003',
      gameInfo: '49ers vs Rams - Week 16',
      squarePosition: 12,
      numbers: null, // Numbers not drawn yet
      potentialPayouts: { q1: 71, q2: 119, q3: 71, final: 214 },
      potentialPoints: { q1: 15, q2: 25, q3: 15, final: 45 },
      gameStatus: 'pre-game',
    },
  ];

  const gameHistory: GameHistory[] = [
    {
      gameId: 'week14-packers-lions',
      week: 14,
      homeTeam: 'Lions',
      awayTeam: 'Packers',
      gameDate: new Date('2024-12-08'),
      boardTier: '$20 Entry',
      squaresPurchased: 4,
      totalSpent: 80,
      winnings: 285,
      status: 'completed',
      mySquares: [
        { position: 15, numbers: [1, 5] },
        { position: 33, numbers: [3, 3] },
        { position: 67, numbers: [6, 7] },
        { position: 89, numbers: [8, 9] },
      ],
      finalScore: { home: 31, away: 29 },
    },
    {
      gameId: 'week13-ravens-steelers',
      week: 13,
      homeTeam: 'Steelers',
      awayTeam: 'Ravens',
      gameDate: new Date('2024-12-01'),
      boardTier: '$10 Entry',
      squaresPurchased: 2,
      totalSpent: 20,
      winnings: 0,
      status: 'completed',
      mySquares: [
        { position: 22, numbers: [2, 2] },
        { position: 78, numbers: [7, 8] },
      ],
      finalScore: { home: 17, away: 14 },
    },
  ];

  const trendData: TrendData[] = [
    {
      date: '2024-11',
      spent: 340,
      winnings: 475,
      netProfit: 135,
      gamesPlayed: 8,
    },
    {
      date: '2024-12',
      spent: 420,
      winnings: 680,
      netProfit: 260,
      gamesPlayed: 12,
    },
    {
      date: '2025-01',
      spent: 280,
      winnings: 195,
      netProfit: -85,
      gamesPlayed: 6,
    },
  ];

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Player Dashboard
              <span className="text-lg font-normal text-muted-foreground ml-3">
                ({dashboardPeriod === 'weekly' ? 'This Week' : 'Full Season'})
              </span>
            </h1>
            <p className="text-muted-foreground">
              {dashboardPeriod === 'weekly'
                ? 'Track your current week performance and active positions'
                : 'View your complete season statistics and historical performance'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Prominent Period Toggle */}
            <div className="flex items-center space-x-1 p-1 rounded-lg bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 border-2 border-blue-200 dark:border-blue-700">
              <button
                onClick={() => setDashboardPeriod('weekly')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  dashboardPeriod === 'weekly'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                }`}
              >
                💰 Weekly
              </button>
              <button
                onClick={() => setDashboardPeriod('seasonal')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  dashboardPeriod === 'seasonal'
                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                    : 'text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
                }`}
              >
                🏆 Seasonal
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Games</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Green Points Card - Featured First for Seasonal Players */}
              {dashboardPeriod === 'seasonal' && (
                <Card className="col-span-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <CardTitle className="text-lg font-bold text-green-700 dark:text-green-300">
                        🏆 Green Points - Season Total
                      </CardTitle>
                      <InfoTooltip
                        title="Green Points - Most Important Metric"
                        description="Your primary seasonal achievement metric. Green Points determine your seasonal ranking and unlock special rewards. Earned through successful gameplay, referrals, and community participation."
                        playbookLink="/docs/player-guide#green-point-system"
                      />
                    </div>
                    <div className="h-6 w-6 bg-green-600 rounded-full shadow-lg" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {playerStats.greenPoints.toLocaleString('en-US', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Primary seasonal ranking metric
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20" />
                        <span className="text-xs text-muted-foreground">
                          vs season goal
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Total Winnings Card - Only for Weekly */}
              {dashboardPeriod === 'weekly' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Winnings
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ${playerStats.totalWinnings.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Net: ${playerStats.profitLoss > 0 ? '+' : ''}
                      {playerStats.profitLoss.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Games Played
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {playerStats.totalGamesPlayed}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {playerStats.totalSquaresPurchased} squares total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    <CardTitle className="text-sm font-medium">
                      Win Rate
                    </CardTitle>
                    <InfoTooltip
                      title="Win Rate Calculation"
                      description="Percentage of games where you won at least one payout. Based on quarters won, not games won."
                      playbookLink="/docs/player-guide#win-rate"
                    />
                  </div>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {playerStats.winRate}%
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={playerStats.winRate} className="w-16" />
                    <span className="text-xs text-muted-foreground">
                      {playerStats.currentStreak.type === 'win' ? (
                        <span className="text-green-600">
                          +{playerStats.currentStreak.count} streak
                        </span>
                      ) : (
                        <span className="text-red-600">
                          -{playerStats.currentStreak.count} streak
                        </span>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Best Tier
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {playerStats.bestPerformingTier}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg {playerStats.averagePositionsPerGame} positions/game
                  </p>
                </CardContent>
              </Card>

              {/* Blue Points Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    <CardTitle className="text-sm font-medium">
                      Blue Points
                    </CardTitle>
                    <InfoTooltip
                      title="Blue Points"
                      description="Total Blue Points earned through Weekly gameplay, Seasonal activities, and CBL management. Click to view breakdown by activity type."
                      playbookLink="/docs/player-guide#blue-point-system"
                    />
                  </div>
                  <div className="h-4 w-4 bg-blue-600 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {playerStats.bluePoints.total.toLocaleString()}
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Weekly:</span>
                      <span className="text-blue-600">
                        {playerStats.bluePoints.weekly}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Seasonal:</span>
                      <span className="text-blue-600">
                        {playerStats.bluePoints.seasonal}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CBL:</span>
                      <span className="text-blue-600">
                        {playerStats.bluePoints.cbl}
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t">
                      <a
                        href="/rewards?tab=blue-points"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        Learn More →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Green Points Card - Regular size for Weekly */}
              {dashboardPeriod === 'weekly' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <CardTitle className="text-sm font-medium">
                        Green Points
                      </CardTitle>
                      <InfoTooltip
                        title="Green Points"
                        description="Running total of Green Points earned this season through successful gameplay, referrals, and bonus achievements."
                        playbookLink="/docs/player-guide#green-point-system"
                      />
                    </div>
                    <div className="h-4 w-4 bg-green-600 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {playerStats.greenPoints.toLocaleString('en-US', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Season total
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Orange Points Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    <CardTitle className="text-sm font-medium">
                      Orange Points
                    </CardTitle>
                    <InfoTooltip
                      title="Orange Points"
                      description="Total Orange Points earned through Weekly promotions, Seasonal referrals, and CBL social activities. Click to view breakdown by activity type."
                      playbookLink="/docs/player-guide#orange-point-system"
                    />
                  </div>
                  <div className="h-4 w-4 bg-orange-600 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {playerStats.orangePoints.total.toLocaleString()}
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Weekly:</span>
                      <span className="text-orange-600">
                        {playerStats.orangePoints.weekly}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Seasonal:</span>
                      <span className="text-orange-600">
                        {playerStats.orangePoints.seasonal}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CBL:</span>
                      <span className="text-orange-600">
                        {playerStats.orangePoints.cbl}
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t">
                      <a
                        href="/rewards?tab=orange-points"
                        className="text-xs text-orange-600 hover:text-orange-800 font-medium inline-flex items-center gap-1"
                      >
                        Learn More →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Positions Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Active Positions ({activePositions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePositions.slice(0, 3).map((position, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{position.gameInfo}</div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Square #{position.squarePosition}</span>
                          {position.numbers ? (
                            <span className="font-mono">
                              [{position.numbers[0]}, {position.numbers[1]}]
                            </span>
                          ) : (
                            <span className="text-yellow-600">
                              Numbers pending
                            </span>
                          )}
                          <Badge
                            variant={
                              position.gameStatus === 'pre-game'
                                ? 'secondary'
                                : position.isWinning
                                  ? 'default'
                                  : 'outline'
                            }
                          >
                            {position.gameStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {dashboardPeriod === 'weekly'
                            ? `$${position.potentialPayouts.final.toLocaleString()}`
                            : `${position.potentialPoints.final} pts`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dashboardPeriod === 'weekly'
                            ? 'max payout'
                            : 'max points'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activePositions.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab('active')}
                    >
                      View All Active Positions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendData.map((month, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{month.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {month.gamesPlayed} games
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-medium ${month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {month.netProfit >= 0 ? '+' : ''}${month.netProfit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${month.winnings} won
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Favorite Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {playerStats.favoriteTeams.map((team, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/team-logos/${team.toLowerCase()}.png`}
                            />
                            <AvatarFallback>{team.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{team}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          #{index + 1} most played
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Games Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Active Positions</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Watch Live
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {activePositions.map((position, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <div className="space-y-1">
                          <div>{position.gameInfo}</div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                position.gameStatus === 'pre-game'
                                  ? 'secondary'
                                  : position.isWinning
                                    ? 'default'
                                    : 'outline'
                              }
                            >
                              {position.gameStatus}
                            </Badge>
                            {position.isWinning && (
                              <Badge variant="default" className="bg-green-600">
                                <Trophy className="h-3 w-3 mr-1" />
                                Winning!
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          Square #{position.squarePosition}
                        </div>
                        {position.numbers ? (
                          <div className="font-mono text-muted-foreground">
                            [{position.numbers[0]}, {position.numbers[1]}]
                          </div>
                        ) : (
                          <div className="text-yellow-600 text-sm">
                            Numbers pending
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">
                          {dashboardPeriod === 'weekly'
                            ? 'Potential Payouts'
                            : 'Potential Points'}
                        </h4>
                        <div className="space-y-2">
                          {dashboardPeriod === 'weekly' ? (
                            // Weekly: Show dollar payouts
                            <>
                              <div className="flex justify-between">
                                <span>1st Quarter:</span>
                                <span className="font-medium">
                                  ${position.potentialPayouts.q1}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>2nd Quarter:</span>
                                <span className="font-medium">
                                  ${position.potentialPayouts.q2}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>3rd Quarter:</span>
                                <span className="font-medium">
                                  ${position.potentialPayouts.q3}
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-medium">
                                  Final Score:
                                </span>
                                <span className="font-bold text-lg">
                                  ${position.potentialPayouts.final}
                                </span>
                              </div>
                            </>
                          ) : (
                            // Seasonal: Show standardized Green Points structure
                            <>
                              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg mb-3">
                                <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                  🏆 Standard Green Points Per Game: 1,000.0 pts
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  Points awarded based on win type (Forward,
                                  Backward, +5s)
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span>1st Quarter:</span>
                                <span className="font-medium text-green-600">
                                  200.0 pts
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>2nd Quarter:</span>
                                <span className="font-medium text-green-600">
                                  250.0 pts
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>3rd Quarter:</span>
                                <span className="font-medium text-green-600">
                                  200.0 pts
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-medium">
                                  4th Quarter:
                                </span>
                                <span className="font-bold text-lg text-green-600">
                                  250.0 pts
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                <span>Overtime (if occurs):</span>
                                <span>+200.0 pts per period</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Game Status</h4>
                        {position.currentScore ? (
                          <div className="space-y-2">
                            <div className="text-2xl font-bold">
                              {position.currentScore.home} -{' '}
                              {position.currentScore.away}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Current Score
                            </div>
                            {position.isWinning && (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Your square is currently winning!
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Game hasn't started yet
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Game History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Game History</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Time</option>
                  <option value="season">This Season</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="month">Last Month</option>
                </select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Game</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Squares</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Won</TableHead>
                      <TableHead>Net</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameHistory.map((game, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {game.homeTeam} vs {game.awayTeam}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Week {game.week}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {game.gameDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>{game.boardTier}</TableCell>
                        <TableCell>{game.squaresPurchased}</TableCell>
                        <TableCell>${game.totalSpent}</TableCell>
                        <TableCell className="text-green-600">
                          ${game.winnings}
                        </TableCell>
                        <TableCell
                          className={
                            game.winnings - game.totalSpent >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {game.winnings - game.totalSpent >= 0 ? '+' : ''}$
                          {game.winnings - game.totalSpent}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              game.status === 'completed'
                                ? 'default'
                                : game.status === 'active'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {game.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Performance Analytics</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ROI by Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>$5 Entry</span>
                      <span className="text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$10 Entry</span>
                      <span className="text-green-600">+8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$20 Entry</span>
                      <span className="text-green-600">+22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$50 Entry</span>
                      <span className="text-red-600">-5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quarter Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>1st Quarter</span>
                      <span>12 wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2nd Quarter</span>
                      <span>8 wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3rd Quarter</span>
                      <span>15 wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Final Score</span>
                      <span>6 wins</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lucky Numbers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>[3, 7]</span>
                      <span>5 wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>[0, 4]</span>
                      <span>4 wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>[7, 0]</span>
                      <span>3 wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>[4, 7]</span>
                      <span>3 wins</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Player Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Game start alerts</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Score updates</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Winning notifications</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly summaries</span>
                    <input type="checkbox" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default board tier
                    </label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>$10 Entry</option>
                      <option>$20 Entry</option>
                      <option>$50 Entry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Auto-buy limit per game
                    </label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>1 square</option>
                      <option>3 squares</option>
                      <option>5 squares</option>
                      <option>No limit</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withAuth(PlayerDashboard, 'PLAYER_ROLE');
