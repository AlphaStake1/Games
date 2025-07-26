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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import InfoTooltip from '@/components/InfoTooltip';
import {
  Users,
  DollarSign,
  Trophy,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  Shield,
  Star,
  Target,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  Zap,
  Gamepad2,
  Briefcase,
  Play,
  Pause,
} from 'lucide-react';

interface CBLStats {
  activeBoards: number;
  totalPlayers: number;
  revenueGenerated: number;
  leadershipRewards: number;
  weeklyGrowth: number;
  boardFillRate: number;
  communityGrowthRate: number;
  averageRevenuePerPlayer: number;
  playerRetentionRate: number;
  bluePoints: number;
  greenPoints: number;
  orangePoints: number;
}

interface PlayerInfo {
  id: string;
  walletAddress: string;
  username: string;
  totalSpent: number;
  totalWon: number;
  gamesPlayed: number;
  joinDate: Date;
  status: 'active' | 'inactive' | 'banned';
  tier: 'regular' | 'vip';
  favoriteTeams: string[];
  lastActivity: Date;
}

interface BoardInfo {
  id: string;
  name: string;
  gameId: string;
  gameDate: Date;
  homeTeam: string;
  awayTeam: string;
  players: number;
  maxPlayers: number;
  entryFee: number;
  status: 'active' | 'filling' | 'completed' | 'cancelled';
  prizePool: number;
  createdAt: Date;
  fillRate: number;
  revenue: number;
  playersData: PlayerInfo[];
}

interface FinancialSummary {
  totalRevenue: number;
  totalRewards: number;
  netProfit: number;
  averageBoardRevenue: number;
  topPerformingTier: string;
  monthlyTrend: { month: string; revenue: number; boards: number }[];
}

// Player View Interfaces (same as in player dashboard)
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
  bluePoints: number;
  greenPoints: number;
  orangePoints: number;
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
  gameStatus: 'pre-game' | 'q1' | 'q2' | 'q3' | 'q4' | 'final' | 'overtime';
  currentScore?: { home: number; away: number };
  isWinning?: boolean;
}

interface PlayerTrendData {
  date: string;
  spent: number;
  winnings: number;
  netProfit: number;
  gamesPlayed: number;
}

function CBLDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isPlayerView, setIsPlayerView] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all'); // for player view
  const [dashboardPeriod, setDashboardPeriod] = useState<'weekly' | 'seasonal'>(
    'weekly',
  );

  // CBLs can only operate weekly boards, reset to weekly when switching to CBL view
  useEffect(() => {
    if (!isPlayerView) {
      setDashboardPeriod('weekly');
    }
  }, [isPlayerView]);

  // Mock data - in real app, this would come from API
  const dashboardStatsWeekly: CBLStats = {
    activeBoards: 3,
    totalPlayers: 89,
    revenueGenerated: 850,
    leadershipRewards: 85,
    weeklyGrowth: 8.2,
    boardFillRate: 87,
    communityGrowthRate: 12.1,
    averageRevenuePerPlayer: 9.6,
    playerRetentionRate: 82.3,
    bluePoints: 287,
    greenPoints: 203,
    orangePoints: 145,
  };

  const dashboardStatsSeasonal: CBLStats = {
    activeBoards: 12,
    totalPlayers: 247,
    revenueGenerated: 3450,
    leadershipRewards: 345,
    weeklyGrowth: 12.5,
    boardFillRate: 94,
    communityGrowthRate: 18.2,
    averageRevenuePerPlayer: 28.4,
    playerRetentionRate: 78.5,
    bluePoints: 1247,
    greenPoints: 892,
    orangePoints: 634,
  };

  const dashboardStats =
    dashboardPeriod === 'weekly'
      ? dashboardStatsWeekly
      : dashboardStatsSeasonal;

  const activeBoards: BoardInfo[] = [
    {
      id: 'board-001',
      name: 'NFL Week 15 - Championship Board',
      gameId: 'week15-eagles-cowboys',
      gameDate: new Date('2024-12-22T20:00:00'),
      homeTeam: 'Cowboys',
      awayTeam: 'Eagles',
      players: 89,
      maxPlayers: 100,
      entryFee: 50,
      status: 'active',
      prizePool: 4500,
      createdAt: new Date('2024-12-15T10:00:00'),
      fillRate: 89,
      revenue: 4450,
      playersData: [],
    },
    {
      id: 'board-002',
      name: 'Monday Night Special',
      gameId: 'week15-chiefs-bills',
      gameDate: new Date('2024-12-23T20:00:00'),
      homeTeam: 'Bills',
      awayTeam: 'Chiefs',
      players: 34,
      maxPlayers: 50,
      entryFee: 25,
      status: 'filling',
      prizePool: 850,
      createdAt: new Date('2024-12-18T14:00:00'),
      fillRate: 68,
      revenue: 850,
      playersData: [],
    },
  ];

  const playersList: PlayerInfo[] = [
    {
      id: 'player-001',
      walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      username: 'FootballFan2024',
      totalSpent: 450,
      totalWon: 680,
      gamesPlayed: 15,
      joinDate: new Date('2024-10-15'),
      status: 'active',
      tier: 'vip',
      favoriteTeams: ['Eagles', 'Cowboys'],
      lastActivity: new Date('2024-12-20'),
    },
    {
      id: 'player-002',
      walletAddress: '5KJKiTGLB8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtBCDE',
      username: 'SquaresMaster',
      totalSpent: 280,
      totalWon: 195,
      gamesPlayed: 8,
      joinDate: new Date('2024-11-20'),
      status: 'active',
      tier: 'regular',
      favoriteTeams: ['Chiefs', 'Bills'],
      lastActivity: new Date('2024-12-19'),
    },
  ];

  const financialSummary: FinancialSummary = {
    totalRevenue: 15750,
    totalRewards: 1575,
    netProfit: 14175,
    averageBoardRevenue: 1312.5,
    topPerformingTier: '$20 Entry',
    monthlyTrend: [
      { month: '2024-10', revenue: 2450, boards: 3 },
      { month: '2024-11', revenue: 4200, boards: 6 },
      { month: '2024-12', revenue: 9100, boards: 8 },
    ],
  };

  // Player View Mock Data
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
      gameStatus: 'pre-game',
    },
    {
      gameId: 'week16-49ers-rams',
      boardId: 'board-003',
      gameInfo: '49ers vs Rams - Week 16',
      squarePosition: 12,
      numbers: null,
      potentialPayouts: { q1: 71, q2: 119, q3: 71, final: 214 },
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

  const playerTrendData: PlayerTrendData[] = [
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950">
      <div
        className={`space-y-6 p-6 ${isPlayerView ? 'player-view' : 'cbl-view'}`}
      >
        {/* Header with Toggle */}
        <div
          className={`rounded-lg p-6 transition-all duration-300 ${
            isPlayerView
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800'
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {isPlayerView ? (
                  <Gamepad2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                )}
                <h1
                  className={`text-3xl font-bold ${
                    isPlayerView
                      ? 'text-emerald-800 dark:text-emerald-200'
                      : 'text-purple-800 dark:text-purple-200'
                  }`}
                >
                  {isPlayerView ? 'Player Dashboard' : 'CBL Dashboard'}
                  {isPlayerView && (
                    <span className="text-lg font-normal text-muted-foreground ml-3">
                      (
                      {dashboardPeriod === 'weekly'
                        ? 'This Week'
                        : 'Full Season'}
                      )
                    </span>
                  )}
                </h1>
              </div>
              <p
                className={`${
                  isPlayerView
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-purple-700 dark:text-purple-300'
                }`}
              >
                {isPlayerView
                  ? dashboardPeriod === 'weekly'
                    ? 'Track your current week performance and active positions'
                    : 'View your complete season statistics and historical performance'
                  : 'Manage your community and track weekly performance'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isPlayerView
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-purple-100 dark:bg-purple-900/30'
                }`}
              >
                <Label
                  htmlFor="view-toggle"
                  className={`text-sm font-medium cursor-pointer ${
                    !isPlayerView
                      ? 'text-purple-700 dark:text-purple-300'
                      : 'text-emerald-600/60 dark:text-emerald-400/60'
                  }`}
                >
                  CBL View
                </Label>
                <Switch
                  id="view-toggle"
                  checked={isPlayerView}
                  onCheckedChange={setIsPlayerView}
                  className={`${
                    isPlayerView
                      ? 'data-[state=checked]:bg-emerald-600'
                      : 'data-[state=unchecked]:bg-purple-600'
                  }`}
                />
                <Label
                  htmlFor="view-toggle"
                  className={`text-sm font-medium cursor-pointer ${
                    isPlayerView
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-purple-600/60 dark:text-purple-400/60'
                  }`}
                >
                  Player View
                </Label>
              </div>

              {/* Action Buttons - Player View shows period toggle, CBL View doesn't */}
              <div className="flex items-center space-x-2">
                {/* Period Toggle - Only for Player View */}
                {isPlayerView && (
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
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                  className={
                    isPlayerView
                      ? 'border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20'
                      : 'border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20'
                  }
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    isPlayerView
                      ? 'border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20'
                      : 'border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20'
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList
            className={`grid w-full ${isPlayerView ? 'grid-cols-5' : 'grid-cols-6'}`}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isPlayerView ? (
              <>
                <TabsTrigger value="active">Active Games</TabsTrigger>
                <TabsTrigger value="history">Game History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="boards">Boards</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isPlayerView ? (
              // Player View Overview
              <>
                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <Progress
                          value={playerStats.winRate}
                          className="w-16"
                        />
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
                          description="Running total of Blue Points earned this season through gameplay participation, community engagement, and achievement milestones."
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
                          <span className="text-muted-foreground">
                            Seasonal:
                          </span>
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Green Points Card */}
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
                        {dashboardPeriod === 'weekly'
                          ? 'This week'
                          : 'Season total'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Orange Points Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center">
                        <CardTitle className="text-sm font-medium">
                          Orange Points
                        </CardTitle>
                        <InfoTooltip
                          title="Orange Points"
                          description="Running total of Orange Points earned this season through social sharing, referrals, and promotional activities."
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
                          <span className="text-muted-foreground">
                            Seasonal:
                          </span>
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
                            <div className="font-medium">
                              {position.gameInfo}
                            </div>
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
                              $
                              {position.potentialPayouts.final.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              max payout
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
                        {playerTrendData.map((month, index) => (
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
                                {month.netProfit >= 0 ? '+' : ''}$
                                {month.netProfit}
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
                                <AvatarFallback>
                                  {team.slice(0, 2)}
                                </AvatarFallback>
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
              </>
            ) : (
              // CBL View Overview (existing content)
              <>
                {/* Enhanced Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Boards
                      </CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardStats.activeBoards}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +2 from last week
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Players
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardStats.totalPlayers}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +{dashboardStats.weeklyGrowth}% from last week
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center">
                        <CardTitle className="text-sm font-medium">
                          Revenue Generated
                        </CardTitle>
                        <InfoTooltip
                          title="Price Floor Strategy"
                          description="Setting optimal entry fees maximizes both participation and revenue. The price floor represents the minimum viable entry fee that maintains player engagement while ensuring profitability."
                          playbookLink="/docs/cbl-playbook#price-floor-quick-look"
                        />
                      </div>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${dashboardStats.revenueGenerated.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This season
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center">
                        <CardTitle className="text-sm font-medium">
                          Leadership Rewards
                        </CardTitle>
                        <InfoTooltip
                          title="Wallet Cap Management"
                          description="Your reward earnings are subject to wallet capacity limits based on your CBL tier and community performance. Managing your wallet cap effectively ensures maximum reward collection and optimal cash flow."
                          playbookLink="/docs/cbl-playbook#wallet-cap-optimization"
                        />
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${dashboardStats.leadershipRewards}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        10% of revenue
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
                          description="Running total of Blue Points earned this season through community engagement, player retention, and board performance metrics."
                          playbookLink="/docs/cbl-playbook#blue-point-system"
                        />
                      </div>
                      <div className="h-4 w-4 bg-blue-600 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboardStats.bluePoints.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardPeriod === 'weekly'
                          ? 'This week'
                          : 'Season total'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Green Points Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center">
                        <CardTitle className="text-sm font-medium">
                          Green Points
                        </CardTitle>
                        <InfoTooltip
                          title="Green Points"
                          description="Running total of Green Points earned this season through revenue generation, successful board completions, and community growth."
                          playbookLink="/docs/cbl-playbook#green-point-system"
                        />
                      </div>
                      <div className="h-4 w-4 bg-green-600 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardStats.greenPoints.toLocaleString('en-US', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardPeriod === 'weekly'
                          ? 'This week'
                          : 'Season total'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Orange Points Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center">
                        <CardTitle className="text-sm font-medium">
                          Orange Points
                        </CardTitle>
                        <InfoTooltip
                          title="Orange Points"
                          description="Running total of Orange Points earned this season through promotional activities, community referrals, and social media engagement."
                          playbookLink="/docs/cbl-playbook#orange-point-system"
                        />
                      </div>
                      <div className="h-4 w-4 bg-orange-600 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {dashboardStats.orangePoints.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardPeriod === 'weekly'
                          ? 'This week'
                          : 'Season total'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Community Health Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Community Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Growth Rate:</span>
                          <span className="font-medium text-green-600">
                            +{dashboardStats.communityGrowthRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Player Retention:</span>
                          <span className="font-medium">
                            {dashboardStats.playerRetentionRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Revenue/Player:</span>
                          <span className="font-medium">
                            ${dashboardStats.averageRevenuePerPlayer}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-muted-foreground">2h ago</span>
                          <span>New player joined</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-muted-foreground">5h ago</span>
                          <span>Board 80% filled</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-muted-foreground">1d ago</span>
                          <span>Payout processed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Performance Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Monthly Revenue Goal</span>
                            <span>$12K / $15K</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Player Growth Goal</span>
                            <span>247 / 300</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Board Fill Rate</span>
                            <span>94% / 90%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Boards Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center">
                      <CardTitle>Active Boards</CardTitle>
                      <InfoTooltip
                        title="Blue-Point Performance Meter"
                        description="The Blue-Point meter tracks your board's engagement and completion rates. Higher scores indicate better player retention and satisfaction, leading to increased rewards and community growth opportunities."
                        playbookLink="/docs/cbl-playbook#blue-point-optimization"
                      />
                    </div>
                    <Button onClick={() => setActiveTab('boards')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Board
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeBoards.map((board) => (
                        <div
                          key={board.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{board.name}</h4>
                              <Badge
                                variant={
                                  board.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {board.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>
                                {board.players}/{board.maxPlayers} players
                              </span>
                              <span>${board.entryFee} entry</span>
                              <span>
                                ${board.prizePool.toLocaleString()} prize pool
                              </span>
                            </div>
                            <Progress
                              value={(board.players / board.maxPlayers) * 100}
                              className="w-48"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Active Games Tab (Player View) */}
          {isPlayerView && (
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
                                <Badge
                                  variant="default"
                                  className="bg-green-600"
                                >
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
                            Potential Payouts
                          </h4>
                          <div className="space-y-2">
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
                              <span className="font-medium">Final Score:</span>
                              <span className="font-bold text-lg">
                                ${position.potentialPayouts.final}
                              </span>
                            </div>
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
          )}

          {/* Game History Tab (Player View) */}
          {isPlayerView && (
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
          )}

          {/* Boards Management Tab - CBL View Only */}
          {!isPlayerView && (
            <TabsContent value="boards" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Board Management</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Board
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {activeBoards.map((board) => (
                  <Card key={board.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center">
                            <div>{board.name}</div>
                            <Badge
                              variant={
                                board.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="ml-2"
                            >
                              {board.status}
                            </Badge>
                          </CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {board.homeTeam} vs {board.awayTeam} •{' '}
                            {board.gameDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Participation</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Players:</span>
                              <span className="font-medium">
                                {board.players}/{board.maxPlayers}
                              </span>
                            </div>
                            <Progress value={board.fillRate} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {board.fillRate}% filled
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Financials</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Entry Fee:</span>
                              <span className="font-medium">
                                ${board.entryFee}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Prize Pool:</span>
                              <span className="font-medium">
                                ${board.prizePool}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Your Revenue:</span>
                              <span className="font-medium text-green-600">
                                ${board.revenue * 0.1}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Timeline</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Created:</span>
                              <span>
                                {board.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Game Date:</span>
                              <span>{board.gameDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className="capitalize">{board.status}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Actions</h4>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Players
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Players Management Tab - CBL View Only */}
          {!isPlayerView && (
            <TabsContent value="players" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Player Management</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Players
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Games</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Won</TableHead>
                        <TableHead>Net</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playersList.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {player.username.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {player.username}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Joined {player.joinDate.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {player.walletAddress.slice(0, 8)}...
                            {player.walletAddress.slice(-4)}
                          </TableCell>
                          <TableCell>{player.gamesPlayed}</TableCell>
                          <TableCell>${player.totalSpent}</TableCell>
                          <TableCell className="text-green-600">
                            ${player.totalWon}
                          </TableCell>
                          <TableCell
                            className={
                              player.totalWon - player.totalSpent >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {player.totalWon - player.totalSpent >= 0
                              ? '+'
                              : ''}
                            ${player.totalWon - player.totalSpent}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                player.tier === 'vip' ? 'default' : 'secondary'
                              }
                            >
                              {player.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                player.status === 'active'
                                  ? 'default'
                                  : player.status === 'inactive'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {player.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {isPlayerView ? (
              // Player Analytics View
              <>
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
              </>
            ) : (
              // CBL Analytics View
              <>
                <h2 className="text-2xl font-bold">Community Analytics</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {financialSummary.monthlyTrend.map((month, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span>{month.month}</span>
                            <div className="text-right">
                              <div className="font-medium">
                                ${month.revenue}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {month.boards} boards
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Tiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>$20 Entry</span>
                          <span className="font-medium">$4,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>$50 Entry</span>
                          <span className="font-medium">$3,150</span>
                        </div>
                        <div className="flex justify-between">
                          <span>$10 Entry</span>
                          <span className="font-medium">$2,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>$5 Entry</span>
                          <span className="font-medium">$1,200</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Player Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Players in Active Games</span>
                          <span className="font-medium">89</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekly Active Players</span>
                          <span className="font-medium">156</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Active Players</span>
                          <span className="font-medium">247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Games/Player</span>
                          <span className="font-medium">3.2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Communications Tab - CBL View Only */}
          {!isPlayerView && (
            <TabsContent value="communications" className="space-y-6">
              <h2 className="text-2xl font-bold">Community Communications</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Announcement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Enter announcement subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="audience">Send to</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Players</SelectItem>
                          <SelectItem value="active">
                            Active Players Only
                          </SelectItem>
                          <SelectItem value="vip">VIP Players Only</SelectItem>
                          <SelectItem value="board">
                            Specific Board Players
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Announcement
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Communications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-3">
                        <div className="font-medium">
                          Weekly Newsletter Sent
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2 days ago • 247 recipients
                        </div>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <div className="font-medium">
                          Board Full Notification
                        </div>
                        <div className="text-sm text-muted-foreground">
                          5 days ago • 89 recipients
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-3">
                        <div className="font-medium">Payout Confirmation</div>
                        <div className="text-sm text-muted-foreground">
                          1 week ago • 12 recipients
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {isPlayerView ? (
              // Player Settings View
              <>
                <h2 className="text-2xl font-bold">Player Settings</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Game start alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Score updates</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Winning notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Weekly summaries</span>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="block text-sm font-medium mb-2">
                          Default board tier
                        </Label>
                        <Select defaultValue="20">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">$10 Entry</SelectItem>
                            <SelectItem value="20">$20 Entry</SelectItem>
                            <SelectItem value="50">$50 Entry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="block text-sm font-medium mb-2">
                          Auto-buy limit per game
                        </Label>
                        <Select defaultValue="3">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 square</SelectItem>
                            <SelectItem value="3">3 squares</SelectItem>
                            <SelectItem value="5">5 squares</SelectItem>
                            <SelectItem value="unlimited">No limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              // CBL Settings View
              <>
                <h2 className="text-2xl font-bold">CBL Settings</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="community-name">Community Name</Label>
                        <Input
                          id="community-name"
                          defaultValue="Elite Football Squares"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-players">
                          Max Players per Board
                        </Label>
                        <Select defaultValue="100">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">50 Players</SelectItem>
                            <SelectItem value="100">100 Players</SelectItem>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="auto-create">Auto-create boards</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-create" defaultChecked />
                          <span className="text-sm">
                            Automatically create boards for upcoming games
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Reward Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="reward-rate">CBL Reward Rate</Label>
                        <Select defaultValue="10">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5% of revenue</SelectItem>
                            <SelectItem value="10">10% of revenue</SelectItem>
                            <SelectItem value="15">15% of revenue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="payout-schedule">Payout Schedule</Label>
                        <Select defaultValue="weekly">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="auto-payout">Auto-payout</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-payout" defaultChecked />
                          <span className="text-sm">
                            Automatically process payouts
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withAuth(CBLDashboard, 'CBL_ROLE');
