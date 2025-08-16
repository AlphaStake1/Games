'use client';

import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth';
import { BoardBoostModal } from '@/components/BoardBoostModal';
import { useBoardBoost } from '@/lib/services/boardBoostService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Gamepad2,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Star,
  Trophy,
  Zap,
  Play,
  Plus,
  Filter,
  Search,
} from 'lucide-react';

// NFL Teams Data for 2025 Season
const NFL_TEAMS = {
  AFC: {
    North: [
      {
        id: 'BAL',
        name: 'Baltimore Ravens',
        city: 'Baltimore',
        primaryColor: '#241773',
      },
      {
        id: 'CIN',
        name: 'Cincinnati Bengals',
        city: 'Cincinnati',
        primaryColor: '#FB4F14',
      },
      {
        id: 'CLE',
        name: 'Cleveland Browns',
        city: 'Cleveland',
        primaryColor: '#311D00',
      },
      {
        id: 'PIT',
        name: 'Pittsburgh Steelers',
        city: 'Pittsburgh',
        primaryColor: '#FFB612',
      },
    ],
    South: [
      {
        id: 'HOU',
        name: 'Houston Texans',
        city: 'Houston',
        primaryColor: '#03202F',
      },
      {
        id: 'IND',
        name: 'Indianapolis Colts',
        city: 'Indianapolis',
        primaryColor: '#002C5F',
      },
      {
        id: 'JAX',
        name: 'Jacksonville Jaguars',
        city: 'Jacksonville',
        primaryColor: '#006778',
      },
      {
        id: 'TEN',
        name: 'Tennessee Titans',
        city: 'Tennessee',
        primaryColor: '#0C2340',
      },
    ],
    East: [
      {
        id: 'BUF',
        name: 'Buffalo Bills',
        city: 'Buffalo',
        primaryColor: '#00338D',
      },
      {
        id: 'MIA',
        name: 'Miami Dolphins',
        city: 'Miami',
        primaryColor: '#008E97',
      },
      {
        id: 'NE',
        name: 'New England Patriots',
        city: 'New England',
        primaryColor: '#002244',
      },
      {
        id: 'NYJ',
        name: 'New York Jets',
        city: 'New York',
        primaryColor: '#125740',
      },
    ],
    West: [
      {
        id: 'DEN',
        name: 'Denver Broncos',
        city: 'Denver',
        primaryColor: '#FB4F14',
      },
      {
        id: 'KC',
        name: 'Kansas City Chiefs',
        city: 'Kansas City',
        primaryColor: '#E31837',
      },
      {
        id: 'LV',
        name: 'Las Vegas Raiders',
        city: 'Las Vegas',
        primaryColor: '#000000',
      },
      {
        id: 'LAC',
        name: 'Los Angeles Chargers',
        city: 'Los Angeles',
        primaryColor: '#0080C6',
      },
    ],
  },
  NFC: {
    North: [
      {
        id: 'CHI',
        name: 'Chicago Bears',
        city: 'Chicago',
        primaryColor: '#0B162A',
      },
      {
        id: 'DET',
        name: 'Detroit Lions',
        city: 'Detroit',
        primaryColor: '#0076B6',
      },
      {
        id: 'GB',
        name: 'Green Bay Packers',
        city: 'Green Bay',
        primaryColor: '#203731',
      },
      {
        id: 'MIN',
        name: 'Minnesota Vikings',
        city: 'Minnesota',
        primaryColor: '#4F2683',
      },
    ],
    South: [
      {
        id: 'ATL',
        name: 'Atlanta Falcons',
        city: 'Atlanta',
        primaryColor: '#A71930',
      },
      {
        id: 'CAR',
        name: 'Carolina Panthers',
        city: 'Carolina',
        primaryColor: '#0085CA',
      },
      {
        id: 'NO',
        name: 'New Orleans Saints',
        city: 'New Orleans',
        primaryColor: '#D3BC8D',
      },
      {
        id: 'TB',
        name: 'Tampa Bay Buccaneers',
        city: 'Tampa Bay',
        primaryColor: '#D50A0A',
      },
    ],
    East: [
      {
        id: 'DAL',
        name: 'Dallas Cowboys',
        city: 'Dallas',
        primaryColor: '#003594',
      },
      {
        id: 'NYG',
        name: 'New York Giants',
        city: 'New York',
        primaryColor: '#0B2265',
      },
      {
        id: 'PHI',
        name: 'Philadelphia Eagles',
        city: 'Philadelphia',
        primaryColor: '#004C54',
      },
      {
        id: 'WAS',
        name: 'Washington Commanders',
        city: 'Washington',
        primaryColor: '#5A1414',
      },
    ],
    West: [
      {
        id: 'ARI',
        name: 'Arizona Cardinals',
        city: 'Arizona',
        primaryColor: '#97233F',
      },
      {
        id: 'LAR',
        name: 'Los Angeles Rams',
        city: 'Los Angeles',
        primaryColor: '#003594',
      },
      {
        id: 'SF',
        name: 'San Francisco 49ers',
        city: 'San Francisco',
        primaryColor: '#AA0000',
      },
      {
        id: 'SEA',
        name: 'Seattle Seahawks',
        city: 'Seattle',
        primaryColor: '#002244',
      },
    ],
  },
};

// Mock 2025 NFL Schedule (Week 1-4 sample)
const NFL_SCHEDULE_2025 = [
  // Week 1 - September 4-8, 2025
  {
    week: 1,
    games: [
      {
        id: 'nfl_2025_w1_1',
        homeTeam: 'KC',
        awayTeam: 'BAL',
        date: '2025-09-04',
        time: '20:20',
        day: 'Thursday',
        tv: 'NBC',
        isPrimetime: true,
      },
      {
        id: 'nfl_2025_w1_2',
        homeTeam: 'BUF',
        awayTeam: 'NYJ',
        date: '2025-09-07',
        time: '13:00',
        day: 'Sunday',
        tv: 'CBS',
      },
      {
        id: 'nfl_2025_w1_3',
        homeTeam: 'DAL',
        awayTeam: 'CLE',
        date: '2025-09-07',
        time: '13:00',
        day: 'Sunday',
        tv: 'FOX',
      },
      {
        id: 'nfl_2025_w1_4',
        homeTeam: 'SF',
        awayTeam: 'MIN',
        date: '2025-09-07',
        time: '13:00',
        day: 'Sunday',
        tv: 'FOX',
      },
      {
        id: 'nfl_2025_w1_5',
        homeTeam: 'GB',
        awayTeam: 'CHI',
        date: '2025-09-07',
        time: '13:00',
        day: 'Sunday',
        tv: 'CBS',
      },
      {
        id: 'nfl_2025_w1_6',
        homeTeam: 'LAR',
        awayTeam: 'ARI',
        date: '2025-09-07',
        time: '16:25',
        day: 'Sunday',
        tv: 'FOX',
        isAfternoonLate: true,
      },
      {
        id: 'nfl_2025_w1_7',
        homeTeam: 'DEN',
        awayTeam: 'LV',
        date: '2025-09-07',
        time: '20:20',
        day: 'Sunday',
        tv: 'NBC',
        isPrimetime: true,
      },
      {
        id: 'nfl_2025_w1_8',
        homeTeam: 'PHI',
        awayTeam: 'WAS',
        date: '2025-09-08',
        time: '20:15',
        day: 'Monday',
        tv: 'ESPN',
        isPrimetime: true,
      },
    ],
  },
  // Week 2 - September 11-15, 2025
  {
    week: 2,
    games: [
      {
        id: 'nfl_2025_w2_1',
        homeTeam: 'LAC',
        awayTeam: 'TEN',
        date: '2025-09-11',
        time: '20:15',
        day: 'Thursday',
        tv: 'Prime Video',
        isPrimetime: true,
      },
      {
        id: 'nfl_2025_w2_2',
        homeTeam: 'NE',
        awayTeam: 'MIA',
        date: '2025-09-14',
        time: '13:00',
        day: 'Sunday',
        tv: 'CBS',
      },
      {
        id: 'nfl_2025_w2_3',
        homeTeam: 'HOU',
        awayTeam: 'IND',
        date: '2025-09-14',
        time: '13:00',
        day: 'Sunday',
        tv: 'CBS',
      },
      {
        id: 'nfl_2025_w2_4',
        homeTeam: 'TB',
        awayTeam: 'NO',
        date: '2025-09-14',
        time: '13:00',
        day: 'Sunday',
        tv: 'FOX',
      },
      {
        id: 'nfl_2025_w2_5',
        homeTeam: 'SEA',
        awayTeam: 'DET',
        date: '2025-09-14',
        time: '16:05',
        day: 'Sunday',
        tv: 'FOX',
        isAfternoonLate: true,
      },
      {
        id: 'nfl_2025_w2_6',
        homeTeam: 'CIN',
        awayTeam: 'PIT',
        date: '2025-09-14',
        time: '20:20',
        day: 'Sunday',
        tv: 'NBC',
        isPrimetime: true,
        isRivalry: true,
      },
      {
        id: 'nfl_2025_w2_7',
        homeTeam: 'ATL',
        awayTeam: 'CAR',
        date: '2025-09-15',
        time: '20:15',
        day: 'Monday',
        tv: 'ESPN',
        isPrimetime: true,
      },
    ],
  },
];

// Drive Maker CBL mock data
const DRIVE_MAKER_CBL = {
  tier: 'drive-maker',
  activeBoards: 12,
  totalRevenue: 3450,
  primaryTeam: 'KC', // Kansas City Chiefs (always present)

  // Drive Maker Choice: EITHER additional teams OR primetime slots
  strategyChoice: 'teams', // 'teams' or 'primetime'

  // If strategy is 'teams': 2 additional teams beyond home team
  secondaryTeams: ['DEN', 'LV'], // Denver Broncos, Las Vegas Raiders

  // If strategy is 'primetime': 2 of 3 primetime slots
  primetimeSlots: ['SNF', 'MNF'], // Sunday Night Football, Monday Night Football
  // Available: TNF (Thursday), SNF (Sunday), MNF (Monday)

  gameTypes: ['forwards-only', 'f-and-b'], // Available game types
  boardStrategy: 'single', // Single tier pricing
};

const CreateBoardPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [gameConfigs, setGameConfigs] = useState<{ [gameId: string]: any }>({});
  const [activeTab, setActiveTab] = useState('select-games');
  const [showPricingWarning, setShowPricingWarning] = useState<{
    gameId: string;
    price: number;
  } | null>(null);
  const [wildcardGameId, setWildcardGameId] = useState<string>('');
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedBoardForBoost, setSelectedBoardForBoost] = useState<any>(null);
  const { boostBoard, getBoardBoostInfo, isReady } = useBoardBoost();

  // Initialize game configs for selected games
  useEffect(() => {
    const newConfigs = { ...gameConfigs };
    selectedGames.forEach((gameId) => {
      if (!newConfigs[gameId]) {
        newConfigs[gameId] = {
          pricing: '10',
          gameType: 'forwards-only',
          releaseDate: 3,
          customRules: '',
          promotionMessage: '',
        };
      }
    });
    setGameConfigs(newConfigs);
  }, [selectedGames]);

  const getTeamInfo = (teamId: string) => {
    for (const conference of Object.values(NFL_TEAMS)) {
      for (const division of Object.values(conference)) {
        const team = division.find((t) => t.id === teamId);
        if (team) return team;
      }
    }
    return null;
  };

  const getAvailableWildcardGames = () => {
    const allGames =
      NFL_SCHEDULE_2025.find((w) => w.week === selectedWeek)?.games || [];
    const coreGames = getCoreGames();

    // Exclude core games to get wildcard options
    const wildcardOptions = allGames.filter(
      (game) => !coreGames.some((coreGame) => coreGame.id === game.id),
    );

    // Prioritize wildcard games by attractiveness
    return wildcardOptions.sort((a, b) => {
      // 1. Primetime games first
      if (a.isPrimetime && !b.isPrimetime) return -1;
      if (!a.isPrimetime && b.isPrimetime) return 1;

      // 2. Rivalry games second
      if (a.isRivalry && !b.isRivalry) return -1;
      if (!a.isRivalry && b.isRivalry) return 1;

      // 3. Popular teams (Cowboys, Steelers, Patriots, etc.)
      const popularTeams = ['DAL', 'PIT', 'NE', 'GB', 'SF', 'NYG'];
      const aHasPopular =
        popularTeams.includes(a.homeTeam) || popularTeams.includes(a.awayTeam);
      const bHasPopular =
        popularTeams.includes(b.homeTeam) || popularTeams.includes(b.awayTeam);

      if (aHasPopular && !bHasPopular) return -1;
      if (!aHasPopular && bHasPopular) return 1;

      return 0;
    });
  };

  const getCoreGames = () => {
    const allGames =
      NFL_SCHEDULE_2025.find((w) => w.week === selectedWeek)?.games || [];

    // Get primary team games
    const primaryGames = allGames.filter(
      (game) =>
        game.homeTeam === DRIVE_MAKER_CBL.primaryTeam ||
        game.awayTeam === DRIVE_MAKER_CBL.primaryTeam,
    );

    // Get secondary team games (for Teams strategy)
    let secondaryGames: any[] = [];
    if (DRIVE_MAKER_CBL.strategyChoice === 'teams') {
      secondaryGames = allGames.filter(
        (game) =>
          (DRIVE_MAKER_CBL.secondaryTeams.includes(game.homeTeam) ||
            DRIVE_MAKER_CBL.secondaryTeams.includes(game.awayTeam)) &&
          // Exclude if already counted as primary game
          !(
            game.homeTeam === DRIVE_MAKER_CBL.primaryTeam ||
            game.awayTeam === DRIVE_MAKER_CBL.primaryTeam
          ),
      );
    } else if (DRIVE_MAKER_CBL.strategyChoice === 'primetime') {
      // Primetime strategy: get selected primetime slots
      secondaryGames = allGames.filter((game) => {
        if (
          game.isPrimetime &&
          !(
            game.homeTeam === DRIVE_MAKER_CBL.primaryTeam ||
            game.awayTeam === DRIVE_MAKER_CBL.primaryTeam
          )
        ) {
          const gameSlot =
            game.day === 'Thursday'
              ? 'TNF'
              : game.day === 'Sunday' && game.time === '20:20'
                ? 'SNF'
                : game.day === 'Monday'
                  ? 'MNF'
                  : null;
          return gameSlot && DRIVE_MAKER_CBL.primetimeSlots.includes(gameSlot);
        }
        return false;
      });
    }

    return [...primaryGames, ...secondaryGames];
  };

  const needsWildcardGame = () => {
    const coreGames = getCoreGames();
    return coreGames.length < 3;
  };

  const getCurrentWeekGames = () => {
    const coreGames = getCoreGames();

    // If we have less than 3 core games, include selected wildcard
    if (needsWildcardGame() && wildcardGameId) {
      const allGames =
        NFL_SCHEDULE_2025.find((w) => w.week === selectedWeek)?.games || [];
      const wildcardGame = allGames.find((game) => game.id === wildcardGameId);
      if (wildcardGame) {
        return [...coreGames, wildcardGame];
      }
    }

    return coreGames;
  };

  const toggleGameSelection = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId],
    );
  };

  const getGameRecommendation = (game: any) => {
    const homeTeam = getTeamInfo(game.homeTeam);
    const awayTeam = getTeamInfo(game.awayTeam);

    // Drive Maker CBL logic - Primary team always recommended
    if (
      game.homeTeam === DRIVE_MAKER_CBL.primaryTeam ||
      game.awayTeam === DRIVE_MAKER_CBL.primaryTeam
    ) {
      return { type: 'primary', reason: 'Your primary team (Chiefs)' };
    }

    // Strategy-specific recommendations
    if (DRIVE_MAKER_CBL.strategyChoice === 'teams') {
      // Teams strategy: recommend secondary teams
      if (
        DRIVE_MAKER_CBL.secondaryTeams.includes(game.homeTeam) ||
        DRIVE_MAKER_CBL.secondaryTeams.includes(game.awayTeam)
      ) {
        return {
          type: 'secondary',
          reason: 'Your secondary team (Broncos/Raiders)',
        };
      }
    } else if (DRIVE_MAKER_CBL.strategyChoice === 'primetime') {
      // Primetime strategy: recommend selected primetime slots
      if (game.isPrimetime) {
        const gameSlot =
          game.day === 'Thursday'
            ? 'TNF'
            : game.day === 'Sunday' && game.time === '20:20'
              ? 'SNF'
              : game.day === 'Monday'
                ? 'MNF'
                : null;

        if (gameSlot && DRIVE_MAKER_CBL.primetimeSlots.includes(gameSlot)) {
          return { type: 'primetime', reason: `Your ${gameSlot} slot` };
        }
      }
    }

    // Special case: If primary team plays in a primetime slot
    if (
      game.isPrimetime &&
      (game.homeTeam === DRIVE_MAKER_CBL.primaryTeam ||
        game.awayTeam === DRIVE_MAKER_CBL.primaryTeam)
    ) {
      return {
        type: 'primary-primetime',
        reason: 'Chiefs in primetime - premium opportunity!',
      };
    }

    // Check if this is a wildcard game
    if (game.id === wildcardGameId) {
      if (game.isPrimetime) {
        return {
          type: 'wildcard-prime',
          reason: 'Your wildcard - primetime game!',
        };
      }
      if (game.isRivalry) {
        return {
          type: 'wildcard-rivalry',
          reason: 'Your wildcard - rivalry game!',
        };
      }
      return { type: 'wildcard', reason: 'Your wildcard choice' };
    }

    if (game.isRivalry) {
      return { type: 'rivalry', reason: 'Rivalry game - passionate fans' };
    }

    return { type: 'standard', reason: 'Standard game' };
  };

  const handlePricingChange = (gameId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;

    // Update the config
    setGameConfigs((prev) => ({
      ...prev,
      [gameId]: { ...prev[gameId], pricing: value },
    }));

    // Show warning for high prices
    if (numericValue >= 200) {
      setShowPricingWarning({ gameId, price: numericValue });
    }
  };

  const getPricingFieldStyle = (price: string) => {
    const numericPrice = parseFloat(price) || 0;
    if (numericPrice >= 50) {
      return 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/20';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/cbl/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Boards
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-green-100 text-green-800">
                  <Target className="h-3 w-3 mr-1" />
                  Drive Maker CBL
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedGames.length} games selected
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">2025 NFL Season</p>
            <p className="font-semibold">Revenue Target: $5,000</p>
          </div>
        </div>

        {/* Drive Maker Strategy Alert */}
        <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription className="dark:text-green-100">
            <strong>Drive Maker Strategy (Teams Choice):</strong> You&apos;ve
            chosen to host 3 teams - your primary team (Chiefs) plus 2
            additional teams (Broncos, Raiders). Players will see 3 team banners
            in your Community Sports Lounge. Focus on 8-15 boards per week to
            maximize your $5,000 revenue goal.
          </AlertDescription>
        </Alert>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 h-14">
            <TabsTrigger value="select-games">Select Games</TabsTrigger>
            <TabsTrigger value="configure-boards">Configure Boards</TabsTrigger>
            <TabsTrigger value="review-publish">Review & Publish</TabsTrigger>
            <TabsTrigger value="schedule-future">Schedule Future</TabsTrigger>
          </TabsList>

          {/* Tab 1: Select Games */}
          <TabsContent value="select-games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Week Selector */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((week) => (
                      <Button
                        key={week}
                        variant={selectedWeek === week ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => setSelectedWeek(week)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Week {week}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Games List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Week {selectedWeek} Games</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {needsWildcardGame()
                      ? `Your core games plus wildcard selection. Choose a 3rd game to complete your weekly board strategy.`
                      : `Games available for your Drive Maker strategy. Only your primary team (Chiefs) and secondary teams (Broncos, Raiders) games are shown.`}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Wildcard Game Selector */}
                  {needsWildcardGame() && (
                    <div className="mb-6 p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Plus className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                            Choose Your Wildcard Game
                          </h4>
                          <p className="text-sm text-orange-600 dark:text-orange-300">
                            Select a 3rd game to complete your weekly board
                            strategy
                          </p>
                        </div>
                      </div>

                      <Select
                        value={wildcardGameId}
                        onValueChange={setWildcardGameId}
                      >
                        <SelectTrigger className="border-orange-300">
                          <SelectValue placeholder="Select your wildcard game..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableWildcardGames().map((game) => {
                            const homeTeam = getTeamInfo(game.homeTeam);
                            const awayTeam = getTeamInfo(game.awayTeam);
                            return (
                              <SelectItem key={game.id} value={game.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>
                                    {awayTeam?.city} @ {homeTeam?.city}
                                  </span>
                                  <div className="flex items-center space-x-1 ml-2">
                                    {game.isPrimetime && (
                                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                                        Prime
                                      </Badge>
                                    )}
                                    {game.isRivalry && (
                                      <Badge className="bg-red-100 text-red-800 text-xs">
                                        Rivalry
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-3">
                    {getCurrentWeekGames().map((game) => {
                      const homeTeam = getTeamInfo(game.homeTeam);
                      const awayTeam = getTeamInfo(game.awayTeam);
                      const recommendation = getGameRecommendation(game);
                      const isSelected = selectedGames.includes(game.id);

                      return (
                        <div
                          key={game.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${
                            recommendation.type === 'primary' ||
                            recommendation.type === 'primary-primetime'
                              ? 'ring-2 ring-green-200'
                              : recommendation.type === 'primetime'
                                ? 'ring-2 ring-purple-200'
                                : recommendation.type === 'secondary'
                                  ? 'ring-2 ring-blue-200'
                                  : recommendation.type?.startsWith('wildcard')
                                    ? 'ring-2 ring-orange-200'
                                    : ''
                          }`}
                          onClick={() => toggleGameSelection(game.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Checkbox checked={isSelected} />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">
                                    {awayTeam?.city} @ {homeTeam?.city}
                                  </span>
                                  {game.isPrimetime && (
                                    <Badge className="bg-purple-100 text-purple-800">
                                      <Star className="h-3 w-3 mr-1" />
                                      Primetime
                                    </Badge>
                                  )}
                                  {game.isRivalry && (
                                    <Badge className="bg-red-100 text-red-800">
                                      <Trophy className="h-3 w-3 mr-1" />
                                      Rivalry
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {game.day}, {game.date} at {game.time} •{' '}
                                  {game.tv}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  recommendation.type === 'primary'
                                    ? 'bg-green-100 text-green-800'
                                    : recommendation.type ===
                                        'primary-primetime'
                                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                      : recommendation.type === 'primetime'
                                        ? 'bg-purple-100 text-purple-800'
                                        : recommendation.type === 'secondary'
                                          ? 'bg-blue-100 text-blue-800'
                                          : recommendation.type?.startsWith(
                                                'wildcard',
                                              )
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {recommendation.reason}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedGames.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        onClick={() => setActiveTab('configure-boards')}
                        className="w-full"
                      >
                        Configure {selectedGames.length} Board
                        {selectedGames.length > 1 ? 's' : ''}
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 2: Configure Boards */}
          <TabsContent value="configure-boards" className="space-y-6">
            {selectedGames.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Games Selected
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Please select games first to configure your boards.
                  </p>
                  <Button onClick={() => setActiveTab('select-games')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Select Games
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {selectedGames.map((gameId) => {
                  const game = getCurrentWeekGames().find(
                    (g) => g.id === gameId,
                  );
                  if (!game) return null;

                  const homeTeam = getTeamInfo(game.homeTeam);
                  const awayTeam = getTeamInfo(game.awayTeam);
                  const config = gameConfigs[gameId] || {};

                  return (
                    <Card key={gameId}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>
                            {awayTeam?.city} @ {homeTeam?.city}
                          </span>
                          <Badge>
                            {game.day}, {game.date}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Pricing */}
                          <div>
                            <Label>Board Price per Square</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <Input
                                type="number"
                                min="1"
                                max="999"
                                step="1"
                                value={config.pricing}
                                onChange={(e) =>
                                  handlePricingChange(gameId, e.target.value)
                                }
                                className={`pl-6 ${getPricingFieldStyle(config.pricing)}`}
                                placeholder="10"
                              />
                            </div>
                            <div className="text-xs mt-1">
                              {parseFloat(config.pricing) >= 50 ? (
                                <span className="text-orange-600 font-medium">
                                  Premium board (8% rake) • ${config.pricing}{' '}
                                  per square
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Regular board (5% rake) • ${config.pricing}{' '}
                                  per square
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Game Type */}
                          <div>
                            <Label>Game Type</Label>
                            <Select
                              value={config.gameType}
                              onValueChange={(value) =>
                                setGameConfigs((prev) => ({
                                  ...prev,
                                  [gameId]: {
                                    ...prev[gameId],
                                    gameType: value,
                                  },
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="forwards-only">
                                  Forwards Only
                                </SelectItem>
                                <SelectItem value="f-and-b">
                                  Forwards & Backwards
                                </SelectItem>
                                <SelectItem value="f-b-5f">
                                  F & B + 5th Forward
                                </SelectItem>
                                <SelectItem value="f-b-5b">
                                  F & B + 5th Backward
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Release Timing */}
                          <div>
                            <Label>Release Date</Label>
                            <Select
                              value={config.releaseDate?.toString()}
                              onValueChange={(value) =>
                                setGameConfigs((prev) => ({
                                  ...prev,
                                  [gameId]: {
                                    ...prev[gameId],
                                    releaseDate: parseInt(value),
                                  },
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 day before</SelectItem>
                                <SelectItem value="2">2 days before</SelectItem>
                                <SelectItem value="3">3 days before</SelectItem>
                                <SelectItem value="5">5 days before</SelectItem>
                                <SelectItem value="7">1 week before</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Board Boost */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBoardForBoost({
                                  id: gameId,
                                  name: `${awayTeam?.city} @ ${homeTeam?.city}`,
                                  gameInfo: `${game.day}, ${game.date} at ${game.time}`,
                                  entryFee: parseInt(config.pricing || '10'),
                                  currentFillRate: 0,
                                  playersCount: 0,
                                  maxPlayers: 100,
                                  gameDate: new Date(game.date),
                                  isVipOnly:
                                    parseInt(config.pricing || '10') >= 50,
                                });
                                setIsBoostModalOpen(true);
                              }}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Boost Board
                            </Button>
                          </div>
                        </div>

                        {/* Promotion Message */}
                        <div className="mt-4">
                          <Label>Custom Promotion Message (Optional)</Label>
                          <Textarea
                            placeholder="Add a custom message to promote this board..."
                            value={config.promotionMessage || ''}
                            onChange={(e) =>
                              setGameConfigs((prev) => ({
                                ...prev,
                                [gameId]: {
                                  ...prev[gameId],
                                  promotionMessage: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('select-games')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Games
                  </Button>
                  <Button onClick={() => setActiveTab('review-publish')}>
                    Review & Publish
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Review & Publish */}
          <TabsContent value="review-publish" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Board Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedGames.map((gameId) => {
                      const game = getCurrentWeekGames().find(
                        (g) => g.id === gameId,
                      );
                      const config = gameConfigs[gameId] || {};
                      const homeTeam = getTeamInfo(game?.homeTeam || '');
                      const awayTeam = getTeamInfo(game?.awayTeam || '');

                      return (
                        <div
                          key={gameId}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="font-semibold">
                              {awayTeam?.city} @ {homeTeam?.city}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${config.pricing}/square •{' '}
                              {config.gameType?.replace('-', ' & ')} • Release{' '}
                              {config.releaseDate} days before
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              $
                              {(
                                parseInt(config.pricing || '10') *
                                100 *
                                (parseFloat(config.pricing) >= 50 ? 0.05 : 0.03)
                              ).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              MAX Revenue (100% fill)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Projection */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Boards:</span>
                      <span className="font-semibold">
                        {selectedGames.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>min Revenue (95% fill):</span>
                      <span className="font-semibold text-green-600">
                        $
                        {selectedGames
                          .reduce((total, gameId) => {
                            const config = gameConfigs[gameId] || {};
                            const pricing = parseInt(config.pricing || '10');
                            const cblRate = pricing >= 50 ? 0.05 : 0.03;
                            return total + pricing * 95 * cblRate; // 95 squares sold
                          }, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span>MAX Revenue:</span>
                      <span className="font-bold text-green-600">
                        $
                        {selectedGames
                          .reduce((total, gameId) => {
                            const config = gameConfigs[gameId] || {};
                            const pricing = parseInt(config.pricing || '10');
                            const cblRate = pricing >= 50 ? 0.05 : 0.03;
                            return total + pricing * 100 * cblRate;
                          }, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Maximum potential at 100% fill rate
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab('configure-boards')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configure
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Publish {selectedGames.length} Board
                {selectedGames.length > 1 ? 's' : ''}
              </Button>
            </div>
          </TabsContent>

          {/* Tab 4: Schedule Future */}
          <TabsContent value="schedule-future" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Future Boards</CardTitle>
                <p className="text-muted-foreground">
                  Set up automatic board creation for upcoming weeks based on
                  your Drive Maker strategy.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Team Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Team Selection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Auto-create for Primary Team (Chiefs)</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch id="auto-primary" />
                          <Label htmlFor="auto-primary">
                            Enable for all Chiefs games
                          </Label>
                        </div>
                      </div>
                      <div>
                        <Label>Auto-create for Secondary Teams</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch id="auto-secondary" />
                          <Label htmlFor="auto-secondary">
                            Enable for Broncos & Raiders
                          </Label>
                        </div>
                      </div>
                      <div>
                        <Label>Auto-create for Primetime</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch id="auto-primetime" />
                          <Label htmlFor="auto-primetime">
                            Enable for TNF & SNF
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Board Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Default Board Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Default Pricing</Label>
                        <Select defaultValue="25">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">$5 per square</SelectItem>
                            <SelectItem value="10">$10 per square</SelectItem>
                            <SelectItem value="25">$25 per square</SelectItem>
                            <SelectItem value="50">$50 per square</SelectItem>
                            <SelectItem value="75">$75 per square</SelectItem>
                            <SelectItem value="100">$100 per square</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Default Game Type</Label>
                        <Select defaultValue="forwards-only">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forwards-only">
                              Forwards Only
                            </SelectItem>
                            <SelectItem value="f-and-b">
                              Forwards & Backwards
                            </SelectItem>
                            <SelectItem value="f-b-5f">
                              F & B + 5th Forward
                            </SelectItem>
                            <SelectItem value="f-b-5b">
                              F & B + 5th Backward
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Release Timing</Label>
                        <Select defaultValue="3">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day before game</SelectItem>
                            <SelectItem value="2">
                              2 days before game
                            </SelectItem>
                            <SelectItem value="3">
                              3 days before game
                            </SelectItem>
                            <SelectItem value="5">
                              5 days before game
                            </SelectItem>
                            <SelectItem value="7">
                              1 week before game
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Auto Board Boost</Label>
                        <Select defaultValue="none">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No auto-boost</SelectItem>
                            <SelectItem value="1">
                              1 day boost (0.05 SOL)
                            </SelectItem>
                            <SelectItem value="3">
                              3 day boost (0.12 SOL)
                            </SelectItem>
                            <SelectItem value="7">
                              7 day boost (0.25 SOL)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Timing Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Release Timing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Time to Send Out</Label>
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
                        <p className="text-xs text-muted-foreground mt-1">
                          When boards go live each release day
                        </p>
                      </div>
                      <div>
                        <Label>Preferred Release Day</Label>
                        <Select defaultValue="none">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              None - Use default timing
                            </SelectItem>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Override release timing when possible
                        </p>
                      </div>
                      <div>
                        <Label>Weekend Strategy</Label>
                        <Select defaultValue="none">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="thursday">
                              Thursday evening
                            </SelectItem>
                            <SelectItem value="friday">
                              Friday morning
                            </SelectItem>
                            <SelectItem value="saturday">
                              Saturday morning
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Special timing for weekend games
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Advanced Options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Advanced Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Promotion Strategy</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="auto-boost-primetime" />
                            <Label
                              htmlFor="auto-boost-primetime"
                              className="text-sm"
                            >
                              Auto-boost primetime games (3-day)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="auto-boost-rivalry" />
                            <Label
                              htmlFor="auto-boost-rivalry"
                              className="text-sm"
                            >
                              Auto-boost rivalry games (1-day)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="auto-boost-weekend" />
                            <Label
                              htmlFor="auto-boost-weekend"
                              className="text-sm"
                            >
                              Auto-boost weekend games (1-day)
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Notification Settings</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="notify-creation" />
                            <Label
                              htmlFor="notify-creation"
                              className="text-sm"
                            >
                              Notify when boards are created
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="notify-24h" />
                            <Label htmlFor="notify-24h" className="text-sm">
                              24-hour reminders before release
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="notify-fill-rate" />
                            <Label
                              htmlFor="notify-fill-rate"
                              className="text-sm"
                            >
                              Alert when boards hit 50% fill
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Default Promotion Message */}
                  <div>
                    <Label>Default Promotion Message (Optional)</Label>
                    <Textarea
                      placeholder="Enter a default message that will be added to all auto-created boards..."
                      className="mt-2"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This message will be added to all automatically created
                      boards. You can override it for individual games.
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      <span>
                        Settings will apply to all future automated board
                        creation
                      </span>
                    </div>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Save Automation Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                  selectedBoardForBoost.id.split('_').pop() || '1',
                ),
              });
            }}
          />
        )}

        {/* OC-Phil High Pricing Warning Modal */}
        {showPricingWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/Assets/Coach B with football and thumbs up.png"
                  alt="OC-Phil"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">OC-Phil Alert!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your pricing advisor
                  </p>
                </div>
              </div>

              <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="dark:text-orange-100">
                  <strong>Hey there!</strong> You're setting each square to cost{' '}
                  <strong>${showPricingWarning.price}</strong>. That means your
                  board could generate up to{' '}
                  <strong>
                    ${(showPricingWarning.price * 100).toLocaleString()}
                  </strong>{' '}
                  total. Just making sure this is intentional - that's a
                  premium-priced board!
                </AlertDescription>
              </Alert>

              <div className="text-sm text-muted-foreground mb-4">
                <p>
                  • Total board value:{' '}
                  <strong>
                    ${(showPricingWarning.price * 100).toLocaleString()}
                  </strong>
                </p>
                <p>
                  • Your revenue (95% fill, 5% CBL rake):{' '}
                  <strong>
                    $
                    {(
                      showPricingWarning.price *
                      100 *
                      0.95 *
                      0.05
                    ).toLocaleString()}
                  </strong>
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPricingWarning(null)}
                  className="flex-1"
                >
                  Yes, I'm sure
                </Button>
                <Button
                  onClick={() => {
                    handlePricingChange(showPricingWarning.gameId, '10');
                    setShowPricingWarning(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Reset to $10
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(CreateBoardPage, 'CBL_ROLE');
