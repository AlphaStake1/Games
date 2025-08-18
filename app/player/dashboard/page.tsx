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
  Search,
  Zap,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import BoardSelector from '@/components/BoardSelector';
import EnhancedBoardGrid from '@/components/EnhancedBoardGrid';
import PricingPanel from '@/components/PricingPanel';
import ConfirmPurchaseModal from '@/components/ConfirmPurchaseModal';
import { usePurchasePass } from '@/hooks/usePurchasePass';
import { useUserPreferences } from '@/lib/userPreferences';
import { BoardConfiguration, SquareSelection } from '@/lib/boardTypes';

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
  investment: number;
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
  const [viewMode, setViewMode] = useState<'beginner' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BoardConfiguration | null>(
    null,
  );
  const [activeSelections, setActiveSelections] = useState<SquareSelection[]>(
    [],
  );

  const { preferences, isLoading: prefsLoading } = useUserPreferences(
    'demo-wallet-address',
  );

  // Handle tab switching when dashboard period changes
  useEffect(() => {
    // If user is on find-games tab and switches to seasonal, redirect to overview
    if (activeTab === 'find-games' && dashboardPeriod === 'seasonal') {
      setActiveTab('overview');
    }
  }, [dashboardPeriod, activeTab]);
  const {
    isModalOpen,
    isProcessing,
    currentQuote,
    walletConnected,
    openModal,
    closeModal,
    connectWallet,
    confirmPurchase,
  } = usePurchasePass();

  const handleSquareSelectionChange = (selection: SquareSelection) => {
    setActiveSelections((prev) => {
      const filtered = prev.filter((s) => s.boardId !== selection.boardId);
      if (selection.squareIndices.length > 0) {
        return [...filtered, selection];
      }
      return filtered;
    });
  };

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
      investment: 20,
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
      investment: 10,
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
      investment: 5,
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
            {/* Beginner/Advanced Toggle */}
            <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-200 dark:bg-slate-700">
              <button
                onClick={() => setViewMode('beginner')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'beginner'
                    ? 'bg-white dark:bg-slate-800 shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <ToggleLeft className="h-4 w-4 inline mr-1" />
                Beginner
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'advanced'
                    ? 'bg-white dark:bg-slate-800 shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <ToggleRight className="h-4 w-4 inline mr-1" />
                Advanced
              </button>
            </div>
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
          <TabsList
            className={`grid w-full h-14 ${dashboardPeriod === 'seasonal' ? 'grid-cols-5' : 'grid-cols-6'}`}
          >
            <TabsTrigger value="overview">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="active">
              <Activity className="h-4 w-4 mr-2" />
              Active Games
            </TabsTrigger>
            {dashboardPeriod === 'weekly' && (
              <TabsTrigger value="find-games">
                <Search className="h-4 w-4 mr-2" />
                Find Games
              </TabsTrigger>
            )}
            <TabsTrigger value="history">
              <Calendar className="h-4 w-4 mr-2" />
              Game History
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Beginner Mode - Simple View */}
            {viewMode === 'beginner' && (
              <div className="space-y-6">
                {/* Welcome Message for Beginners */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-4 border-black dark:border-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                        Welcome to NFL Squares!
                      </h3>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      Here's your simple overview. Ready to join some games and
                      start winning?
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setActiveTab('find-games')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Find Games
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setViewMode('advanced')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        See More Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Simple Key Stats - Only Essential Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Winnings - Most Important */}
                  <Card className="bg-green-50 dark:bg-green-950/20 border-4 border-black dark:border-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            Total Winnings
                          </p>
                          <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                            ${playerStats.totalWinnings.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                          <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Games */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Active Games
                          </p>
                          <p className="text-3xl font-bold">
                            {activePositions.length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            games you're playing
                          </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Next Steps for Beginners */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => setActiveTab('find-games')}
                      >
                        <Search className="h-6 w-6 text-blue-500" />
                        <span className="font-medium">Join New Games</span>
                        <span className="text-xs text-muted-foreground">
                          Find boards to play
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => setActiveTab('active')}
                      >
                        <Activity className="h-6 w-6 text-green-500" />
                        <span className="font-medium">My Games</span>
                        <span className="text-xs text-muted-foreground">
                          See current positions
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => setActiveTab('history')}
                      >
                        <Calendar className="h-6 w-6 text-purple-500" />
                        <span className="font-medium">Past Games</span>
                        <span className="text-xs text-muted-foreground">
                          View your history
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Advanced Mode - Detailed View */}
            {viewMode === 'advanced' && (
              <div className="space-y-6">
                {/* Advanced Mode Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Advanced Dashboard</h2>
                    <p className="text-muted-foreground">
                      Complete performance analytics and detailed statistics
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode('beginner')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Simple View
                  </Button>
                </div>

                {/* Comprehensive Key Stats */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 ${
                    dashboardPeriod === 'weekly'
                      ? 'lg:grid-cols-4'
                      : 'lg:grid-cols-3'
                  } gap-6`}
                >
                  {/* Green Points Card - Featured First for Seasonal Players */}
                  {dashboardPeriod === 'seasonal' && (
                    <Card className="col-span-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-4 border-black dark:border-white">
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

                {/* Featured Boards for Weekly vs Half-Season Promo for Seasonal */}
                {dashboardPeriod === 'weekly' ? (
                  <Card className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                        Featured Boards (Quick Join)
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Hot games starting soon. Jump right in!
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Example Featured Board Cards - these would be dynamic */}
                        <div className="border rounded-lg p-4 space-y-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                          <div className="font-bold">Eagles vs Cowboys</div>
                          <div className="text-sm text-muted-foreground">
                            $20 Tier
                          </div>
                          <Progress value={87} />
                          <div className="text-xs text-muted-foreground">
                            87/100 Filled
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => setActiveTab('find-games')}
                          >
                            Join Now
                          </Button>
                        </div>
                        <div className="border rounded-lg p-4 space-y-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                          <div className="font-bold">Chiefs vs Bills</div>
                          <div className="text-sm text-muted-foreground">
                            $50 Tier
                          </div>
                          <Progress value={42} />
                          <div className="text-xs text-muted-foreground">
                            42/100 Filled
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setActiveTab('find-games')}
                          >
                            Join Now
                          </Button>
                        </div>
                        <div className="border rounded-lg p-4 space-y-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                          <div className="font-bold">49ers vs Rams</div>
                          <div className="text-sm text-muted-foreground">
                            $10 Tier
                          </div>
                          <Progress value={95} />
                          <div className="text-xs text-muted-foreground">
                            95/100 Filled
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => setActiveTab('find-games')}
                          >
                            Join Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Half-Season Opportunities Promo for Seasonal Players */
                  <Card className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-300 dark:border-orange-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Star className="h-5 w-5 mr-2 text-orange-600" />
                        🏆 Second Half Season Opportunities
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Double down on your success! Playoffs are worth 2-5x
                        points.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Upsell to higher tiers based on current tier */}
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 space-y-3 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors">
                          <div className="font-bold text-blue-800 dark:text-blue-300">
                            Southern Conference
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            Upgrade to $100 Tier 2
                          </div>
                          <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
                            ~$2,800 Final Prize
                          </div>
                          <div className="text-xs text-muted-foreground">
                            43/100 spots available
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => openModal('southern')}
                          >
                            Upgrade Now
                          </Button>
                        </div>
                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 space-y-3 bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors">
                          <div className="font-bold text-purple-800 dark:text-purple-300">
                            Northern Conference
                          </div>
                          <div className="text-sm text-purple-600 dark:text-purple-400">
                            Upgrade to $250 Tier 3
                          </div>
                          <div className="text-lg font-bold text-purple-800 dark:text-purple-300">
                            ~$7,000 Final Prize
                          </div>
                          <div className="text-xs text-muted-foreground">
                            28/100 spots available
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => openModal('northern')}
                          >
                            Upgrade Now
                          </Button>
                        </div>
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 space-y-3 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors">
                          <div className="font-bold text-orange-800 dark:text-orange-300">
                            Western Conference
                          </div>
                          <div className="text-sm text-orange-600 dark:text-orange-400">
                            Upgrade to $500 Tier 4
                          </div>
                          <div className="text-lg font-bold text-orange-800 dark:text-orange-300">
                            ~$14,000 Final Prize
                          </div>
                          <div className="text-xs text-muted-foreground">
                            15/100 spots available
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => openModal('western')}
                          >
                            Upgrade Now
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                          🔥 Limited Time: Second Half Strategy
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">
                          Playoff games are worth 2x points, Championship games
                          3x, and Super Bowl 5x points! Add a higher-tier season
                          pass now to maximize your playoff potential.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Active Positions Summary - Different for Weekly vs Seasonal */}
                {dashboardPeriod === 'weekly' ? (
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
                                    [{position.numbers[0]},{' '}
                                    {position.numbers[1]}]
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
                                      : 'default'
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
                ) : (
                  /* Seasonal - Show Historical Points Accumulated */
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="h-5 w-5 mr-2" />
                        Season Performance History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Recent completed games with points earned */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                            <div className="space-y-1">
                              <div className="font-medium">
                                Eagles vs Cowboys - Week 15
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Square #23 • [3, 7] • Q2 Winner
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                +135 pts
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Final quarter
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium">
                                Chiefs vs Bills - Week 15
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Square #67 • [0, 4] • No wins
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-500">
                                +0 pts
                              </div>
                              <div className="text-xs text-muted-foreground">
                                No scoring quarters
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <div className="space-y-1">
                              <div className="font-medium">
                                Packers vs Lions - Week 14
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Square #89 • [8, 9] • Q1, Q3 Winner
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-blue-600">
                                +75 pts
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Two quarters
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setActiveTab('history')}
                        >
                          View Complete Season History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Performance Trends - Advanced View Only */}
                {viewMode === 'advanced' && (
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

                    {/* Different content for Weekly vs Seasonal */}
                    {dashboardPeriod === 'weekly' ? (
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
                    ) : (
                      /* Season Progress & Leaderboard for Seasonal Players */
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Trophy className="h-5 w-5 mr-2" />
                            Season Progress & Ranking
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Season Progress */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Season Progress
                                </span>
                                <span className="font-medium">
                                  Week 15 of 18
                                </span>
                              </div>
                              <Progress value={83} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                3 weeks + playoffs remaining
                              </div>
                            </div>

                            {/* Current Ranking */}
                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  Current Ranking
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  #27 of 100
                                </Badge>
                              </div>
                              {/* Conference Selector - for multi-conference players */}
                              <div className="mb-3">
                                <select className="text-xs bg-transparent border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-muted-foreground w-full">
                                  <option value="eastern">
                                    Eastern Conference - Top 27%
                                  </option>
                                  <option value="southern">
                                    Southern Conference - Not joined
                                  </option>
                                  <option value="northern">
                                    Northern Conference - Not joined
                                  </option>
                                </select>
                              </div>

                              {/* Leaderboard context */}
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    #1 Leader:
                                  </span>
                                  <span className="font-medium">2,845 pts</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Your Score:
                                  </span>
                                  <span className="font-medium text-green-600">
                                    1,247 pts
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Gap from #100:
                                  </span>
                                  <span className="font-medium text-gray-600">
                                    +189 pts
                                  </span>
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-3"
                                onClick={() => setActiveTab('history')}
                              >
                                View Season History
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Find Games Tab */}
          <TabsContent value="find-games" className="space-y-6">
            {selectedBoard ? (
              <div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedBoard(null)}
                  className="mb-4"
                >
                  Back to Board Selection
                </Button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <EnhancedBoardGrid
                      board={selectedBoard}
                      userWalletAddress={'demo-wallet-address'}
                      isVIP={preferences?.isVIP || false}
                      onSquareSelectionChange={handleSquareSelectionChange}
                      currentSelection={activeSelections.find(
                        (s) => s.boardId === selectedBoard.boardId,
                      )}
                      boardType={
                        dashboardPeriod === 'seasonal'
                          ? 'season'
                          : preferences?.isVIP
                            ? 'vip'
                            : 'geographic'
                      }
                      userTeam={
                        preferences?.favoriteTeam || {
                          id: 'dal',
                          name: 'Cowboys',
                          city: 'Dallas',
                          abbreviation: 'DAL',
                          primaryColor: '#003594',
                          secondaryColor: '#869397',
                        }
                      }
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <PricingPanel
                      selections={activeSelections}
                      onPurchaseConfirm={() => {}}
                      onClearSelections={() => setActiveSelections([])}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">Find New Games</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
                  <div className="lg:col-span-3">
                    <BoardSelector
                      userTeam={
                        preferences?.favoriteTeam || {
                          id: 'dal',
                          name: 'Cowboys',
                          city: 'Dallas',
                          abbreviation: 'DAL',
                          conference: 'NFC',
                          division: 'East',
                          primaryColor: '#041E42',
                          secondaryColor: '#869397',
                          logoUrl: '/assets/teams/dal.png',
                        }
                      }
                      isVIP={preferences?.isVIP || false}
                      onBoardSelect={(board) => setSelectedBoard(board)}
                      onVIPUpgrade={() => {}}
                      selectedBoards={preferences?.selectedBoards || []}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <PricingPanel
                      selections={activeSelections}
                      onPurchaseConfirm={() => {}}
                      onClearSelections={() => setActiveSelections([])}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Active Games Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Beginner Mode - Simple Active Games */}
            {viewMode === 'beginner' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">My Active Games</h2>
                  <p className="text-muted-foreground">
                    Track your current positions and potential winnings
                  </p>
                </div>

                <div className="grid gap-4">
                  {activePositions.map((position, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">
                            {position.gameInfo}
                          </h3>
                          <p className="text-muted-foreground">
                            Square #{position.squarePosition}
                          </p>
                          {position.numbers ? (
                            <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block mt-1">
                              [{position.numbers[0]}, {position.numbers[1]}]
                            </p>
                          ) : (
                            <p className="text-yellow-600 text-sm">
                              Numbers will be drawn soon
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${position.potentialPayouts.final.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            potential final payout
                          </p>
                          <Badge
                            variant={
                              position.gameStatus === 'pre-game' ||
                              position.gameStatus === 'final' ||
                              position.gameStatus === 'overtime'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {position.gameStatus}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {activePositions.length === 0 && (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground mb-4">
                      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No active games yet</p>
                    </div>
                    <Button onClick={() => setActiveTab('find-games')}>
                      Find Games to Join
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Advanced Mode - Detailed Active Games */}
            {viewMode === 'advanced' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Active Positions Portfolio
                    </h2>
                    <p className="text-muted-foreground">
                      Comprehensive view of all active positions with analytics
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Watch Live
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Advanced Portfolio Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {activePositions.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total Positions
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {activePositions
                          .reduce(
                            (sum, pos) => sum + pos.potentialPayouts.final,
                            0,
                          )
                          .toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Max Potential
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        $
                        {activePositions
                          .reduce((sum, pos) => sum + pos.investment, 0)
                          .toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total Invested
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {(
                          (activePositions.reduce(
                            (sum, pos) => sum + pos.potentialPayouts.final,
                            0,
                          ) /
                            activePositions.reduce(
                              (sum, pos) => sum + pos.investment,
                              0,
                            ) -
                            1) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Potential ROI
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Advanced Positions Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Position Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Game</TableHead>
                          <TableHead>Square</TableHead>
                          <TableHead>Numbers</TableHead>
                          <TableHead>Investment</TableHead>
                          <TableHead>Q1</TableHead>
                          <TableHead>Q2</TableHead>
                          <TableHead>Q3</TableHead>
                          <TableHead>Final</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>ROI%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activePositions.map((position, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {position.gameInfo}
                            </TableCell>
                            <TableCell>#{position.squarePosition}</TableCell>
                            <TableCell>
                              {position.numbers ? (
                                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  [{position.numbers[0]}, {position.numbers[1]}]
                                </span>
                              ) : (
                                <span className="text-yellow-600">Pending</span>
                              )}
                            </TableCell>
                            <TableCell>${position.investment}</TableCell>
                            <TableCell className="text-green-600">
                              ${position.potentialPayouts.q1}
                            </TableCell>
                            <TableCell className="text-green-600">
                              ${position.potentialPayouts.q2}
                            </TableCell>
                            <TableCell className="text-green-600">
                              ${position.potentialPayouts.q3}
                            </TableCell>
                            <TableCell className="text-green-600 font-bold">
                              ${position.potentialPayouts.final}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  position.gameStatus === 'pre-game' ||
                                  position.gameStatus === 'final' ||
                                  position.gameStatus === 'overtime'
                                    ? 'secondary'
                                    : 'default'
                                }
                              >
                                {position.gameStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-blue-600 font-medium">
                              {(
                                (position.potentialPayouts.final /
                                  position.investment -
                                  1) *
                                100
                              ).toFixed(1)}
                              %
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Risk Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {
                            activePositions.filter((p) => p.investment > 50)
                              .length
                          }
                        </div>
                        <p className="text-sm text-muted-foreground">
                          High Value Positions
                        </p>
                        <p className="text-xs text-muted-foreground">
                          $50+ investment
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {
                            new Set(
                              activePositions.map(
                                (p) => p.gameInfo.split(' ')[0],
                              ),
                            ).size
                          }
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Teams Diversification
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Unique teams played
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {
                            activePositions.filter(
                              (p) =>
                                !['pre-game', 'final', 'overtime'].includes(
                                  p.gameStatus,
                                ),
                            ).length
                          }
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Live Games
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Currently in progress
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Game History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Beginner Mode - Simple History */}
            {viewMode === 'beginner' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">My Game History</h2>
                  <p className="text-muted-foreground">
                    See your past games and winnings
                  </p>
                </div>

                <div className="space-y-4">
                  {gameHistory.slice(0, 5).map((game, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{`${game.awayTeam} @ ${game.homeTeam}`}</h3>
                          <p className="text-muted-foreground text-sm">
                            {new Date(game.gameDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${game.winnings > 0 ? 'text-green-600' : 'text-gray-500'}`}
                          >
                            {game.winnings > 0
                              ? `+$${game.winnings}`
                              : 'No Win'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {game.winnings > 0
                              ? 'Winner!'
                              : 'Better luck next time'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {gameHistory.length === 0 && (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground mb-4">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No completed games yet</p>
                    </div>
                    <Button onClick={() => setActiveTab('find-games')}>
                      Play Your First Game
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Advanced Mode - Detailed History */}
            {viewMode === 'advanced' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Game History & Analytics
                    </h2>
                    <p className="text-muted-foreground">
                      Complete gaming history with performance metrics
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                {/* Advanced History Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {gameHistory.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total Games
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {gameHistory
                          .reduce((sum, game) => sum + game.winnings, 0)
                          .toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total Winnings
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {gameHistory.filter((game) => game.winnings > 0).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Games Won</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {gameHistory.length > 0
                          ? (
                              (gameHistory.filter((game) => game.winnings > 0)
                                .length /
                                gameHistory.length) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed History Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Game History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Game</TableHead>
                          <TableHead>Square</TableHead>
                          <TableHead>Numbers</TableHead>
                          <TableHead>Investment</TableHead>
                          <TableHead>Q1</TableHead>
                          <TableHead>Q2</TableHead>
                          <TableHead>Q3</TableHead>
                          <TableHead>Final</TableHead>
                          <TableHead>Total Won</TableHead>
                          <TableHead>ROI</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gameHistory.flatMap((game) =>
                          game.mySquares.map((square, index) => (
                            <TableRow key={`${game.gameId}-${square.position}`}>
                              <TableCell>
                                {new Date(game.gameDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">
                                {`${game.awayTeam} @ ${game.homeTeam}`}
                              </TableCell>
                              <TableCell>#{square.position}</TableCell>
                              <TableCell>
                                {square.numbers ? (
                                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    [{square.numbers[0]}, {square.numbers[1]}]
                                  </span>
                                ) : (
                                  'N/A'
                                )}
                              </TableCell>
                              <TableCell>
                                ${game.totalSpent / game.squaresPurchased}
                              </TableCell>
                              <TableCell className={'text-gray-500'}>
                                $0
                              </TableCell>
                              <TableCell className={'text-gray-500'}>
                                $0
                              </TableCell>
                              <TableCell className={'text-gray-500'}>
                                $0
                              </TableCell>
                              <TableCell
                                className={
                                  game.winnings > 0
                                    ? 'text-green-600 font-bold'
                                    : 'text-gray-500'
                                }
                              >
                                ${game.winnings}
                              </TableCell>
                              <TableCell
                                className={
                                  game.winnings > 0
                                    ? 'text-green-600 font-bold'
                                    : 'text-red-600'
                                }
                              >
                                ${game.winnings}
                              </TableCell>
                              <TableCell
                                className={
                                  game.winnings >
                                  game.totalSpent / game.squaresPurchased
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                              >
                                {(
                                  (game.winnings /
                                    (game.totalSpent / game.squaresPurchased) -
                                    1) *
                                  100
                                ).toFixed(1)}
                                %
                              </TableCell>
                            </TableRow>
                          )),
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Performance Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quarter Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Q1 Wins:</span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Q2 Wins:</span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Q3 Wins:</span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Final Wins:</span>
                          <span className="font-bold">
                            {gameHistory.filter((g) => g.winnings > 0).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Betting Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Avg Investment:</span>
                          <span className="font-bold">
                            $
                            {(
                              gameHistory.reduce(
                                (sum, g) => sum + g.totalSpent,
                                0,
                              ) / (gameHistory.length || 1)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Highest Investment:</span>
                          <span className="font-bold">
                            $
                            {Math.max(
                              0,
                              ...gameHistory.map((g) => g.totalSpent),
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Best Single Win:</span>
                          <span className="font-bold text-green-600">
                            $
                            {Math.max(0, ...gameHistory.map((g) => g.winnings))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Favorite Numbers:</span>
                          <span className="font-mono text-sm">
                            Most common: [3, 7]
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab - Different for Weekly vs Seasonal */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Content Based on Dashboard Period */}
            {dashboardPeriod === 'weekly' ? (
              /* Weekly Analytics */
              <>
                {/* Beginner Mode - Simple Weekly Analytics */}
                {viewMode === 'beginner' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">
                        Your Weekly Performance
                      </h2>
                      <p className="text-muted-foreground">
                        Simple stats to track your progress
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {playerStats.winRate}%
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Your Win Rate
                        </h3>
                        <p className="text-muted-foreground">
                          {playerStats.winRate > 25
                            ? "Great job! You're doing well!"
                            : 'Keep playing to improve your odds!'}
                        </p>
                      </Card>

                      <Card className="p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          ${playerStats.totalWinnings.toLocaleString()}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Total Won
                        </h3>
                        <p className="text-muted-foreground">
                          {playerStats.totalWinnings > 0
                            ? 'Congratulations on your wins!'
                            : 'Your first win is coming soon!'}
                        </p>
                      </Card>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Seasonal Analytics */
              <>
                {/* Beginner Mode - Simple Seasonal Analytics */}
                {viewMode === 'beginner' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">
                        Your Season Performance
                      </h2>
                      <p className="text-muted-foreground">
                        Track your progress through the season
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {playerStats.greenPoints.toLocaleString('en-US', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Green Points
                        </h3>
                        <p className="text-muted-foreground">
                          Your main seasonal ranking metric
                        </p>
                      </Card>

                      <Card className="p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          #27
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Conference Rank
                        </h3>
                        <p className="text-muted-foreground">
                          Out of 100 in Eastern Conference
                        </p>
                      </Card>
                    </div>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Season Strategy Tips
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>
                            Focus on Green Points - they determine your final
                            ranking
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>
                            Playoff games are worth 2-5x points - save energy
                            for the end
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>
                            Every game counts - you get one square per game
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}

            {/* Advanced Mode - Comprehensive Analytics - Weekly Only */}
            {dashboardPeriod === 'weekly' && viewMode === 'advanced' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Advanced Analytics Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                      Deep insights into your gaming performance
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {playerStats.winRate}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Overall Win Rate
                      </p>
                      <div className="mt-2">
                        <Progress value={playerStats.winRate} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        $
                        {(
                          playerStats.totalWinnings /
                          Math.max(playerStats.totalGamesPlayed, 1)
                        ).toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Avg Win Per Game
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {playerStats.currentStreak.count}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Current {playerStats.currentStreak.type} Streak
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-orange-600">
                        {(
                          (playerStats.totalWinnings /
                            Math.max(playerStats.totalSpent, 1) -
                            1) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">Total ROI</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trendData.map((month, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">{month.date}</div>
                              <div className="text-sm text-muted-foreground">
                                {month.gamesPlayed} games
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`font-bold ${month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
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
                      <CardTitle>Number Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Lucky Numbers</span>
                            <span className="text-sm font-medium">
                              Win Rate
                            </span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { numbers: '[0, 0]', winRate: 45, frequency: 12 },
                              { numbers: '[3, 7]', winRate: 38, frequency: 8 },
                              { numbers: '[7, 3]', winRate: 31, frequency: 6 },
                              { numbers: '[0, 7]', winRate: 29, frequency: 9 },
                            ].map((stat, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="font-mono text-sm">
                                  {stat.numbers}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={stat.winRate}
                                    className="w-16 h-2"
                                  />
                                  <span className="text-sm w-8">
                                    {stat.winRate}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Breakdowns */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Price Tier Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { tier: '$1-5', games: 15, winRate: 33, avgWin: 45 },
                          { tier: '$6-10', games: 22, winRate: 27, avgWin: 89 },
                          {
                            tier: '$11-20',
                            games: 8,
                            winRate: 38,
                            avgWin: 156,
                          },
                          { tier: '$21+', games: 5, winRate: 20, avgWin: 245 },
                        ].map((tier, index) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{tier.tier}</span>
                              <span className="text-sm text-muted-foreground">
                                {tier.games} games
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Win Rate: {tier.winRate}%</span>
                              <span>Avg Win: ${tier.avgWin}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Team Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {playerStats.favoriteTeams
                          .slice(0, 4)
                          .map((team, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {team.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{team}</span>
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-medium text-green-600">
                                  65% Win
                                </div>
                                <div className="text-muted-foreground">
                                  12 games
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quarter Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { quarter: 'Q1', winRate: 22, avgPayout: 89 },
                          { quarter: 'Q2', winRate: 19, avgPayout: 134 },
                          { quarter: 'Q3', winRate: 25, avgPayout: 156 },
                          { quarter: 'Final', winRate: 18, avgPayout: 445 },
                        ].map((q, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">{q.quarter}</span>
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                {q.winRate}% Win
                              </div>
                              <div className="text-muted-foreground">
                                ${q.avgPayout} avg
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Beginner Mode - Simple Settings */}
            {viewMode === 'beginner' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <p className="text-muted-foreground">
                    Basic preferences and account settings
                  </p>
                </div>

                <div className="grid gap-6 max-w-2xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Game Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Favorite Team
                        </label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Dallas Cowboys</option>
                          <option>Green Bay Packers</option>
                          <option>New England Patriots</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email Notifications
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              defaultChecked
                            />
                            Game results
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              defaultChecked
                            />
                            New games available
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Advanced Mode - Comprehensive Settings */}
            {viewMode === 'advanced' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Advanced Settings</h2>
                    <p className="text-muted-foreground">
                      Complete control over your gaming experience
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account & Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            defaultValue="Player123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-md"
                            defaultValue="player@example.com"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Game Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Primary Team
                          </label>
                          <select className="w-full px-3 py-2 border rounded-md">
                            <option>Dallas Cowboys</option>
                            <option>Green Bay Packers</option>
                            <option>New England Patriots</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Secondary Team
                          </label>
                          <select className="w-full px-3 py-2 border rounded-md">
                            <option>None selected</option>
                            <option>Pittsburgh Steelers</option>
                            <option>San Francisco 49ers</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Auto-Join Preferences
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Auto-join favorite team games
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Auto-join when boards reach 90% capacity
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Betting Limits & Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Daily Spending Limit
                          </label>
                          <select className="w-full px-3 py-2 border rounded-md">
                            <option>$50</option>
                            <option>$100</option>
                            <option>$250</option>
                            <option>$500</option>
                            <option>No limit</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Weekly Spending Limit
                          </label>
                          <select className="w-full px-3 py-2 border rounded-md">
                            <option>$200</option>
                            <option>$500</option>
                            <option>$1,000</option>
                            <option>No limit</option>
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
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications & Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">
                            Email Notifications
                          </h4>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                defaultChecked
                              />
                              Game results and winnings
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                defaultChecked
                              />
                              New games available
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Weekly performance summary
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Promotions and bonuses
                            </label>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">
                            Push Notifications
                          </h4>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                defaultChecked
                              />
                              Live game scores
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Quarter-end results
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Boards filling up fast
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked
                          />
                          Show my username on leaderboards
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Allow other players to see my game history
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked
                          />
                          Enable two-factor authentication
                        </label>
                      </div>
                      <div className="pt-4 border-t">
                        <Button variant="outline" className="mr-3">
                          Change Password
                        </Button>
                        <Button variant="outline">Download My Data</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default withAuth(PlayerDashboard, 'PLAYER_ROLE');
