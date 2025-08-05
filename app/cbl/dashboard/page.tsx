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
import CBLActivityNotifications from '@/components/CBLActivityNotifications';
import { BoardBoostModal } from '@/components/BoardBoostModal';
import { useBoardBoost } from '@/lib/services/boardBoostService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
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
  Home,
  Crown,
  Bot,
  MessageCircle,
  Info,
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
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedBoardForBoost, setSelectedBoardForBoost] = useState<any>(null);
  const { boostBoard, getBoardBoostInfo, isReady } = useBoardBoost();
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

  // Activity tracking mock data
  const activityStatus = {
    isActive: true,
    consecutiveMissedSundays: 0,
    lastBoardCreated: new Date('2024-12-22T10:00:00'),
    nextDeadline: new Date('2024-12-29T23:59:59'),
    gracePeriodEnds: new Date('2024-12-31T23:59:59'),
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

  // CBL Tier Detection Logic
  const getCBLTier = () => {
    const totalBoards = dashboardStatsSeasonal.activeBoards;
    const totalRevenue = dashboardStatsSeasonal.revenueGenerated;

    // Mock logic based on performance metrics
    if (totalBoards >= 50 || totalRevenue >= 10000) {
      return 'franchise';
    } else if (totalBoards >= 10 || totalRevenue >= 2000) {
      return 'drive-maker';
    } else {
      return 'first-stream';
    }
  };

  const cblTier = getCBLTier();

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
      favoriteTeams: ['Broncos', 'Chiefs', 'Raiders'],
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
      favoriteTeams: ['Broncos', 'Chiefs', 'Raiders'],
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
    favoriteTeams: ['Broncos', 'Chiefs', 'Raiders'],
    bestPerformingTier: '$20 Entry',
    currentStreak: { type: 'win', count: 2 },
    bluePoints: 717,
    greenPoints: seasonalTotalGreenPoints, // Always cumulative seasonal total
    orangePoints: 301,
  };

  const playerStatsSeasonal: PlayerStats = {
    totalGamesPlayed: 45,
    totalSquaresPurchased: 178,
    totalWinnings: 0, // No dollar tracking for seasonal
    totalSpent: 0, // No dollar tracking for seasonal
    winRate: 28.5,
    profitLoss: 0, // No dollar tracking for seasonal
    averagePositionsPerGame: 3.9,
    favoriteTeams: ['Broncos', 'Chiefs', 'Raiders'],
    bestPerformingTier: 'Full Season Player',
    currentStreak: { type: 'win', count: 3 },
    bluePoints: 717,
    greenPoints: seasonalTotalGreenPoints, // Always cumulative seasonal total
    orangePoints: 301,
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
              <div className="flex items-center space-x-4">
                {/* Prominent Create Board Button - Only visible in CBL View */}
                {!isPlayerView && (
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                    onClick={() => (window.location.href = '/cbl/create-board')}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Board
                  </Button>
                )}

                {/* Secondary Action Buttons */}
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
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList
            className={`grid w-full ${isPlayerView ? 'grid-cols-5' : 'grid-cols-5'}`}
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
                        {playerStats.bluePoints.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Total Blue Points Earned
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
                        {playerStats.orangePoints.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Total Orange Points Earned
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
                {/* Activity Notifications */}
                <CBLActivityNotifications activityStatus={activityStatus} />

                {/* Enhanced Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Boards
                      </CardTitle>
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
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardStats.greenPoints.toLocaleString('en-US', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Season total
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
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button
                    onClick={() => (window.location.href = '/cbl/create-board')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Board
                  </Button>
                </div>
              </div>

              {/* Enhanced Board Scheduling Widget */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-purple-800 dark:text-purple-200">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Future Boards
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        3 Boards Scheduled
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Global Settings */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Default Release Day
                      </Label>
                      <Select defaultValue="sunday">
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Release Time
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="time"
                          defaultValue="10:00"
                          className="text-sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          EST
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Days Before Game
                      </Label>
                      <Select defaultValue="3">
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="2">2 days</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Individual Game Controls */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-semibold">
                        Week 16 Games (Dec 29 - Jan 2)
                      </Label>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Games
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {/* Game 1 - Scheduled */}
                      <div className="p-4 border rounded-lg bg-white dark:bg-gray-900 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Switch
                              id="game-1"
                              defaultChecked
                              className="mt-1 data-[state=checked]:bg-green-600"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor="game-1"
                                className="cursor-pointer"
                              >
                                <div className="font-semibold">
                                  Chiefs @ Raiders
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Sunday, 4:25 PM EST • Rivalry Game
                                </div>
                              </Label>
                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <Label className="text-xs">Board Type</Label>
                                  <Select defaultValue="both">
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="forwards">
                                        Forwards Only
                                      </SelectItem>
                                      <SelectItem value="both">
                                        F & B
                                      </SelectItem>
                                      <SelectItem value="all">
                                        All Types
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Price Tier</Label>
                                  <Select defaultValue="20-50">
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="10">$10</SelectItem>
                                      <SelectItem value="20">$20</SelectItem>
                                      <SelectItem value="20-50">
                                        $20 + $50
                                      </SelectItem>
                                      <SelectItem value="50-100">
                                        $50 + $100
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Release</Label>
                                  <Select defaultValue="default">
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="default">
                                        Default (3d)
                                      </SelectItem>
                                      <SelectItem value="1d">
                                        1 day before
                                      </SelectItem>
                                      <SelectItem value="5d">
                                        5 days before
                                      </SelectItem>
                                      <SelectItem value="7d">
                                        1 week before
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-end">
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedBoardForBoost({
                                          id: `chiefs-raiders-${Date.now()}`,
                                          name: 'Chiefs @ Raiders',
                                          gameInfo:
                                            'Sunday, 4:25 PM EST • Rivalry Game',
                                          entryFee: 20,
                                          currentFillRate: 0,
                                          playersCount: 0,
                                          maxPlayers: 100,
                                          gameDate: new Date('2024-12-29'),
                                          isVipOnly: false,
                                        });
                                        setIsBoostModalOpen(true);
                                      }}
                                      className="h-6 px-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300"
                                    >
                                      <Zap className="h-3 w-3 mr-1" />
                                      Boost
                                    </Button>
                                    <InfoTooltip
                                      title="Board Boost"
                                      description="Pay to promote this board in the discovery feed and attract more players. Boosted boards appear at the top of search results."
                                      playbookLink="/docs/cbl-playbook#board-boost"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <Badge className="bg-green-100 text-green-800">
                              Scheduled
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Release: Dec 26
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Quick Actions</p>
                      <p className="text-xs text-muted-foreground">
                        Apply settings to multiple games at once
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Schedule All
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause All
                      </Button>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>

                  {/* Status Summary */}
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Schedule Summary</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-1">
                        <p>
                          • <strong>3 boards</strong> scheduled for auto-release
                          this week
                        </p>
                        <p>
                          • <strong>1 board</strong> has promotional boost
                          active
                        </p>
                        <p>
                          • Next release:{' '}
                          <strong>Thursday, Dec 26 at 10:00 AM EST</strong>
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
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

              {/* Telegram Integration Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Telegram Community Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">OC Phil Status</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Online & Ready</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last message: 2 minutes ago
                      </div>
                      <Button size="sm" className="w-full" asChild>
                        <a
                          href="https://t.me/OC_Phil_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chat with OC Phil
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Community Stats</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Active Members:</span>
                          <span className="font-medium">89</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Messages Today:</span>
                          <span className="font-medium">247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Board Celebrations:</span>
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Trophy className="h-4 w-4 mr-2" />
                          Announce Board Fill
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Share Board Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a href="/lounge" target="_blank">
                            Visit Lounge
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💬 <strong>Telegram Features:</strong> Real-time
                      notifications, automated celebrations, weekly digest
                      summaries, and direct coaching from OC Phil.
                    </p>
                  </div>
                </CardContent>
              </Card>

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
                          Board Fill Celebration (Telegram)
                        </div>
                        <div className="text-sm text-muted-foreground">
                          1 hour ago • 89 members + GIF
                        </div>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <div className="font-medium">
                          Weekly Newsletter Sent
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2 days ago • 247 recipients
                        </div>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <div className="font-medium">OC Phil Strategy Tip</div>
                        <div className="text-sm text-muted-foreground">
                          3 days ago • Telegram community
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

              {/* Telegram Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Telegram Automation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Notification Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            Board fill celebrations
                          </span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            New board announcements
                          </span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Message Timing</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Board announcements</Label>
                          <Select defaultValue="immediate">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">
                                Immediate
                              </SelectItem>
                              <SelectItem value="delay-5">
                                5 minutes delay
                              </SelectItem>
                              <SelectItem value="delay-15">
                                15 minutes delay
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

                {/* Tiered Auto Create Boards System */}
                <div className="space-y-6">
                  {cblTier === 'first-stream' && (
                    <Card className="border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Home className="h-5 w-5 mr-2 text-blue-600" />
                          Home Team Boards
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            First Stream CBL
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Select Your Home Team</Label>
                          <Select defaultValue="chiefs">
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your home team" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chiefs">
                                Kansas City Chiefs
                              </SelectItem>
                              <SelectItem value="bills">
                                Buffalo Bills
                              </SelectItem>
                              <SelectItem value="bengals">
                                Cincinnati Bengals
                              </SelectItem>
                              <SelectItem value="ravens">
                                Baltimore Ravens
                              </SelectItem>
                              <SelectItem value="cowboys">
                                Dallas Cowboys
                              </SelectItem>
                              <SelectItem value="eagles">
                                Philadelphia Eagles
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Create boards for all games featuring this team
                          </p>
                        </div>

                        <div>
                          <Label>Board Price Point</Label>
                          <Select defaultValue="10">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">$5 per square</SelectItem>
                              <SelectItem value="10">$10 per square</SelectItem>
                              <SelectItem value="20">$20 per square</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Game Type</Label>
                          <Select defaultValue="forwards-only">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="forwards-only">
                                Forwards Only (Q1, Q2, Q3, Q4)
                              </SelectItem>
                              <SelectItem value="f-and-b">
                                Forwards & Backwards (Q1, Q2, Q3, Q4, Rev)
                              </SelectItem>
                              <SelectItem value="f-b-5f">
                                F & B + 5th Forward (Q1, Q2, Q3, Q4, Rev, 5F)
                              </SelectItem>
                              <SelectItem value="f-b-5b">
                                F & B + 5th Backward (Q1, Q2, Q3, Q4, Rev, 5B)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Choose payout structure for your boards
                          </p>
                        </div>

                        <div>
                          <Label>Release Timing</Label>
                          <Select defaultValue="3">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                1 day before game
                              </SelectItem>
                              <SelectItem value="3">
                                3 days before game
                              </SelectItem>
                              <SelectItem value="7">
                                1 week before game
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="auto-create-home" defaultChecked />
                          <Label htmlFor="auto-create-home">
                            Enable auto-creation
                          </Label>
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>First Stream CBL:</strong> Focus on
                            mastering one team's fan base. Build consistent
                            engagement with Chiefs fans before expanding.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  )}

                  {cblTier === 'drive-maker' && (
                    <Card className="border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="h-5 w-5 mr-2 text-green-600" />
                          Multi-Team Strategy
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            Drive Maker CBL
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label>Primary Home Team</Label>
                          <Select defaultValue="broncos">
                            <SelectTrigger>
                              <SelectValue placeholder="Your main team" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="broncos">
                                Denver Broncos
                              </SelectItem>
                              <SelectItem value="chiefs">
                                Kansas City Chiefs
                              </SelectItem>
                              <SelectItem value="raiders">
                                Las Vegas Raiders
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div>
                          <Label className="text-base font-semibold">
                            Additional Teams (Choose 2)
                          </Label>
                          <Tabs defaultValue="teams" className="mt-2">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="teams">
                                Specific Teams
                              </TabsTrigger>
                              <TabsTrigger value="primetime">
                                Primetime Games
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="teams" className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label>Team 2</Label>
                                  <Select defaultValue="chiefs">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select 2nd team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="broncos">
                                        Denver Broncos
                                      </SelectItem>
                                      <SelectItem value="chiefs">
                                        Kansas City Chiefs
                                      </SelectItem>
                                      <SelectItem value="raiders">
                                        Las Vegas Raiders
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Team 3</Label>
                                  <Select defaultValue="raiders">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select 3rd team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="broncos">
                                        Denver Broncos
                                      </SelectItem>
                                      <SelectItem value="chiefs">
                                        Kansas City Chiefs
                                      </SelectItem>
                                      <SelectItem value="raiders">
                                        Las Vegas Raiders
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="primetime"
                              className="space-y-3"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="tnf" defaultChecked />
                                  <Label htmlFor="tnf">
                                    Thursday Night Football
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="snf" defaultChecked />
                                  <Label htmlFor="snf">
                                    Sunday Night Football
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="mnf" />
                                  <Label htmlFor="mnf">
                                    Monday Night Football
                                  </Label>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Select 2 primetime slots to auto-create boards
                                regardless of teams
                              </p>
                            </TabsContent>
                          </Tabs>
                        </div>

                        <Separator />

                        <div>
                          <Label>Game Type Options</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="dm-forwards-only" defaultChecked />
                              <Label htmlFor="dm-forwards-only">
                                Forwards Only (Q1, Q2, Q3, Q4)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="dm-f-and-b" defaultChecked />
                              <Label htmlFor="dm-f-and-b">
                                Forwards & Backwards (Q1, Q2, Q3, Q4, Rev)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="dm-f-b-5f" />
                              <Label htmlFor="dm-f-b-5f">
                                F & B + 5th Forward (Q1, Q2, Q3, Q4, Rev, 5F)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="dm-f-b-5b" />
                              <Label htmlFor="dm-f-b-5b">
                                F & B + 5th Backward (Q1, Q2, Q3, Q4, Rev, 5B)
                              </Label>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Select which game types to offer (can choose
                            multiple)
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <Label>Board Strategy</Label>
                          <RadioGroup defaultValue="single" className="mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="single" id="single" />
                              <Label htmlFor="single">
                                Single tier per game ($10, $20, or $50)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dual" id="dual" />
                              <Label htmlFor="dual">
                                Dual tier approach (e.g., $10 + $50)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Alert>
                          <TrendingUp className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Drive Maker CBL:</strong> You've proven you
                            can fill boards consistently. Time to diversify and
                            build multiple fan communities!
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  )}

                  {cblTier === 'franchise' && (
                    <Card className="border-purple-200">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Crown className="h-5 w-5 mr-2 text-purple-600" />
                            Complete Board Management
                            <Badge className="ml-2 bg-purple-100 text-purple-800">
                              Franchise CBL
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-purple-600"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat with OC-Phil
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* OC-Phil Recommendation Widget */}
                        <Alert className="bg-purple-50 border-purple-200">
                          <Bot className="h-4 w-4" />
                          <AlertTitle>OC-Phil's Weekly Game Plan</AlertTitle>
                          <AlertDescription className="mt-2">
                            <div className="space-y-2">
                              <p>
                                <strong>This Week's Focus:</strong> Rivalry
                                games (Chiefs vs Raiders) showing 85% higher
                                engagement
                              </p>
                              <p>
                                <strong>Recommended:</strong> Create $20 + $100
                                boards for SNF, skip Thursday's low-interest
                                matchup
                              </p>
                              <p>
                                <strong>Fill Rate Alert:</strong> Your $50
                                boards at 60% - consider promoting or switching
                                to $20
                              </p>
                            </div>
                            <Button
                              variant="link"
                              className="p-0 text-purple-600 mt-2"
                            >
                              View detailed analytics →
                            </Button>
                          </AlertDescription>
                        </Alert>

                        <Tabs defaultValue="schedule" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="schedule">
                              Game Schedule
                            </TabsTrigger>
                            <TabsTrigger value="strategy">
                              Board Strategy
                            </TabsTrigger>
                            <TabsTrigger value="automation">
                              Automation
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="schedule" className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-semibold">
                                Week 15 Games
                              </Label>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Select All
                                </Button>
                                <Button variant="outline" size="sm">
                                  Primetime Only
                                </Button>
                                <Button variant="outline" size="sm">
                                  Rivalry Games
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              <div className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center space-x-3">
                                  <Checkbox id="game1" defaultChecked />
                                  <div>
                                    <p className="font-medium">
                                      Chiefs @ Raiders
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Sunday 4:25 PM • Rivalry Game
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-100 text-green-800">
                                    OC-Phil Recommends
                                  </Badge>
                                  <Badge variant="outline">High Interest</Badge>
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center space-x-3">
                                  <Checkbox id="game2" />
                                  <div>
                                    <p className="font-medium">
                                      Titans @ Jaguars
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Thursday 8:15 PM
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className="text-yellow-600"
                                  >
                                    Low Interest
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="strategy" className="space-y-4">
                            <div>
                              <Label className="text-base font-semibold">
                                Game Type Matrix
                              </Label>
                              <div className="mt-2 p-4 border rounded-lg">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Available Game Types
                                    </Label>
                                    <div className="space-y-2 mt-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="fc-forwards-only"
                                          defaultChecked
                                        />
                                        <Label
                                          htmlFor="fc-forwards-only"
                                          className="text-sm"
                                        >
                                          Forwards Only
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="fc-f-and-b"
                                          defaultChecked
                                        />
                                        <Label
                                          htmlFor="fc-f-and-b"
                                          className="text-sm"
                                        >
                                          Forwards & Backwards
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="fc-f-b-5f"
                                          defaultChecked
                                        />
                                        <Label
                                          htmlFor="fc-f-b-5f"
                                          className="text-sm"
                                        >
                                          F & B + 5th Forward
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="fc-f-b-5b" />
                                        <Label
                                          htmlFor="fc-f-b-5b"
                                          className="text-sm"
                                        >
                                          F & B + 5th Backward
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox id="fc-custom" />
                                        <Label
                                          htmlFor="fc-custom"
                                          className="text-sm"
                                        >
                                          Custom Combinations
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Auto-Selection Rules
                                    </Label>
                                    <div className="space-y-2 mt-2">
                                      <div className="p-2 bg-gray-50 rounded text-xs">
                                        <strong>Regular Games:</strong> Forwards
                                        Only + F&B
                                      </div>
                                      <div className="p-2 bg-purple-50 rounded text-xs">
                                        <strong>Primetime:</strong> All selected
                                        types
                                      </div>
                                      <div className="p-2 bg-green-50 rounded text-xs">
                                        <strong>Rivalry Games:</strong> Full
                                        suite including 5th options
                                      </div>
                                      <div className="p-2 bg-blue-50 rounded text-xs">
                                        <strong>OC-Phil Override:</strong>{' '}
                                        Data-driven selections
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-base font-semibold">
                                Multi-Tier Strategy
                              </Label>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                  <Label>Regular Games</Label>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="reg-10" defaultChecked />
                                      <Label htmlFor="reg-10">$10 boards</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="reg-50" />
                                      <Label htmlFor="reg-50">$50 boards</Label>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label>Primetime/Rivalry Games</Label>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="prime-20" defaultChecked />
                                      <Label htmlFor="prime-20">
                                        $20 boards
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="prime-100" defaultChecked />
                                      <Label htmlFor="prime-100">
                                        $100 VIP boards
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="automation" className="space-y-4">
                            <div>
                              <Label className="text-base font-semibold">
                                Smart Automation Rules
                              </Label>
                              <div className="space-y-3 mt-2">
                                <div className="flex items-center justify-between p-3 border rounded">
                                  <div>
                                    <p className="font-medium">
                                      Auto-cancel low-fill boards
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Cancel if &lt;50% filled 2 hours before
                                      game
                                    </p>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded">
                                  <div>
                                    <p className="font-medium">
                                      OC-Phil recommendations
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Auto-implement Phil's game plan
                                      suggestions
                                    </p>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  )}

                  {/* General Settings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
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

      {/* Board Boost Modal */}
      {selectedBoardForBoost && (
        <BoardBoostModal
          isOpen={isBoostModalOpen}
          onClose={() => {
            setIsBoostModalOpen(false);
            setSelectedBoardForBoost(null);
          }}
          board={selectedBoardForBoost}
          onBoost={async (duration: number, amount: number) => {
            if (!isReady) {
              throw new Error('Wallet not connected');
            }

            await boostBoard({
              boardId: selectedBoardForBoost.id,
              durationDays: duration as 1 | 3 | 7,
              gameId: parseInt(
                selectedBoardForBoost.id.split('-').pop() || '1',
              ),
            });
          }}
        />
      )}
    </div>
  );
}

export default withAuth(CBLDashboard, 'CBL_ROLE');
