'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  BOARD_TIERS,
  BoardTier,
  GameSchedule,
  BoardConfiguration,
  getAvailableTiers,
} from '@/lib/boardTypes';
import { NFLTeam } from '@/lib/nflTeams';
import { formatCurrency } from '@/lib/utils';
import {
  Crown,
  Users,
  Clock,
  TrendingUp,
  Lock,
  Unlock,
  Star,
  AlertTriangle,
} from 'lucide-react';

interface BoardSelectorProps {
  userTeam: NFLTeam;
  isVIP: boolean;
  onBoardSelect: (board: BoardConfiguration) => void;
  onVIPUpgrade: () => void;
  selectedBoards?: string[];
  className?: string;
}

// Mock data for demonstration - in real app this would come from API
const generateMockGames = (userTeam: NFLTeam): GameSchedule[] => {
  const currentWeek = 1;
  const games: GameSchedule[] = [];

  // Generate 4 upcoming games for the user's team
  for (let i = 0; i < 4; i++) {
    games.push({
      gameId: `game-${userTeam.id}-${currentWeek + i}`,
      week: currentWeek + i,
      homeTeam:
        i % 2 === 0
          ? userTeam
          : {
              id: 'opp',
              name: 'Opponent',
              city: 'Away',
              abbreviation: 'OPP',
              conference: userTeam.conference === 'AFC' ? 'NFC' : 'AFC',
              division: 'North',
              primaryColor: '#666666',
              secondaryColor: '#999999',
              logoUrl: '/assets/teams/default.png',
            },
      awayTeam:
        i % 2 === 1
          ? userTeam
          : {
              id: 'opp',
              name: 'Opponent',
              city: 'Away',
              abbreviation: 'OPP',
              conference: userTeam.conference === 'AFC' ? 'NFC' : 'AFC',
              division: 'North',
              primaryColor: '#666666',
              secondaryColor: '#999999',
              logoUrl: '/assets/teams/default.png',
            },
      gameDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
      isPlayoffs: false,
      gameType: 'regular',
    });
  }

  return games;
};

const BoardSelector: React.FC<BoardSelectorProps> = ({
  userTeam,
  isVIP,
  onBoardSelect,
  onVIPUpgrade,
  selectedBoards = [],
  className = '',
}) => {
  const [selectedGame, setSelectedGame] = useState<GameSchedule | null>(null);
  const [availableGames, setAvailableGames] = useState<GameSchedule[]>([]);

  useEffect(() => {
    const games = generateMockGames(userTeam);
    setAvailableGames(games);
    if (games.length > 0) {
      setSelectedGame(games[0]); // Default to current week
    }
  }, [userTeam]);

  const availableTiers = getAvailableTiers(isVIP);

  // Mock board availability data
  const getBoardAvailability = (tier: BoardTier, game: GameSchedule) => {
    const soldSquares = Math.floor(Math.random() * 85) + 5; // Random between 5-90
    return {
      totalSquaresSold: soldSquares,
      availableSquares: 100 - soldSquares,
      isActive: soldSquares < 100,
    };
  };

  const createBoardConfiguration = (
    tier: BoardTier,
    game: GameSchedule,
  ): BoardConfiguration => {
    const availability = getBoardAvailability(tier, game);
    return {
      boardId: `${game.gameId}-${tier.id}`,
      gameId: game.gameId,
      tier,
      game,
      maxSquaresPerUser: isVIP ? 100 : 5,
      availableSquares: availability.availableSquares,
      totalSquaresSold: availability.totalSquaresSold,
      isActive: availability.isActive,
      createdAt: new Date(),
      gameStartTime: game.gameDate,
    };
  };

  const BoardTierCard = ({
    tier,
    game,
  }: {
    tier: BoardTier;
    game: GameSchedule;
  }) => {
    const board = createBoardConfiguration(tier, game);
    const fillPercentage = (board.totalSquaresSold / 100) * 100;
    const isSelected = selectedBoards.includes(board.boardId);
    const isVIPTier = tier.isVIPOnly;
    const canSelect = !isVIPTier || isVIP;

    const calculateMaxWin = (tier: BoardTier) => {
      const { payouts } = tier;
      const regularGameTotal =
        payouts.q1Regular +
        payouts.q2Regular +
        payouts.q3Regular +
        payouts.q4Regular;
      const overtimeSplit =
        (payouts.q1Overtime ?? 0) +
        (payouts.q2Overtime ?? 0) +
        (payouts.q3Overtime ?? 0) +
        (payouts.q4Overtime ?? 0);
      const expiredOvertime = payouts.finalOvertime ?? 0;
      return {
        regularGameTotal,
        overtimeSplit,
        expiredOvertime,
      };
    };

    return (
      <Card
        className={`relative transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
        } ${!canSelect ? 'opacity-60' : ''}`}
      >
        {/* VIP Badge */}
        {isVIPTier && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
              <Crown className="w-3 h-3 mr-1" />
              VIP
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{tier.displayName}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {tier.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(tier.pricePerSquare)}
              </p>
              <p className="text-xs text-gray-500">per square</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Board Availability */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Squares Sold:
              </span>
              <span className="font-medium">{board.totalSquaresSold}/100</span>
            </div>
            <Progress value={fillPercentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {board.availableSquares} squares remaining
            </p>
          </div>

          {/* Payout Information */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Potential Winnings:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Q1:</span>
                <span className="font-medium">
                  {formatCurrency(tier.payouts.q1Regular)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Q2:</span>
                <span className="font-medium">
                  {formatCurrency(tier.payouts.q2Regular)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Q3:</span>
                <span className="font-medium">
                  {formatCurrency(tier.payouts.q3Regular)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Q4:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(tier.payouts.q4Regular)}
                </span>
              </div>
            </div>
            {tier.payouts.finalOvertime && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xs">
                  <span>Overtime (Split):</span>
                  <span className="font-medium">
                    {formatCurrency(calculateMaxWin(tier).overtimeSplit)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Overtime (Expired):</span>
                  <span className="font-medium">
                    {formatCurrency(calculateMaxWin(tier).expiredOvertime ?? 0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {!canSelect ? (
              <Button
                onClick={onVIPUpgrade}
                variant="outline"
                className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to VIP
              </Button>
            ) : isSelected ? (
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600"
                disabled
              >
                <Star className="w-4 h-4 mr-2" />
                Board Selected
              </Button>
            ) : !board.isActive ? (
              <Button variant="outline" className="w-full" disabled>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Board Full
              </Button>
            ) : (
              <Button
                onClick={() => onBoardSelect(board)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Select Board
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Team Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: userTeam.primaryColor }}
          >
            {userTeam.abbreviation}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {userTeam.city} {userTeam.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Your Home Team</p>
          </div>
        </div>

        {isVIP && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
            <Crown className="w-4 h-4 mr-1" />
            VIP Member
          </Badge>
        )}
      </div>

      {/* Game Week Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Game Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableGames.map((game) => (
              <Button
                key={game.gameId}
                variant={
                  selectedGame?.gameId === game.gameId ? 'default' : 'outline'
                }
                onClick={() => setSelectedGame(game)}
                className="h-auto p-4 flex flex-col items-center"
              >
                <span className="font-bold">Week {game.week}</span>
                <span className="text-xs">
                  {game.homeTeam.abbreviation} vs {game.awayTeam.abbreviation}
                </span>
                <span className="text-xs text-gray-500">
                  {game.gameDate.toLocaleDateString()}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Board Tiers */}
      {selectedGame && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Available Board Tiers</h3>
            <Badge variant="outline">
              {availableTiers.length} of {BOARD_TIERS.length} tiers available
            </Badge>
          </div>

          {/* VIP Upgrade Prompt for Non-VIP Users */}
          {!isVIP && (
            <Card className="mb-6 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200">
                        Unlock Premium Boards
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Upgrade to VIP for a 5% bonus on all winnings, unlimited
                        squares, $250-$1000 boards, and all teams access.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onVIPUpgrade}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Upgrade to VIP
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOARD_TIERS.map((tier) => (
              <BoardTierCard key={tier.id} tier={tier} game={selectedGame} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardSelector;
