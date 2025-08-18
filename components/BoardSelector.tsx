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
  Wifi,
  WifiOff,
  RefreshCw,
} from '@/lib/icons';
import { useTeamGames } from '@/hooks/useGameData';
import { useGameBoards } from '@/hooks/useBoardData';
import { BoardAvailabilityResponse, BoardState } from '@/lib/api/types';
import { BoardUtils } from '@/lib/api/boardService';

interface BoardSelectorProps {
  userTeam: NFLTeam;
  isVIP: boolean;
  onBoardSelect: (board: BoardConfiguration) => void;
  onVIPUpgrade: () => void;
  selectedBoards?: string[];
  className?: string;
}

// Real NFL schedule data fetched via API
// This replaces the previous mock data generation

const BoardSelector: React.FC<BoardSelectorProps> = ({
  userTeam,
  isVIP,
  onBoardSelect,
  onVIPUpgrade,
  selectedBoards = [],
  className = '',
}) => {
  const [selectedGame, setSelectedGame] = useState<GameSchedule | null>(null);

  // Use real NFL schedule data
  const {
    games: availableGames,
    loading: gamesLoading,
    error: gamesError,
    refreshGames,
    isConnected,
    currentWeek,
  } = useTeamGames(userTeam, { upcomingOnly: false }); // Get all games, not just upcoming

  // Debug logging
  console.log('BoardSelector: Team games data:', {
    userTeam: userTeam?.abbreviation,
    userTeamId: userTeam?.id,
    gamesLoading,
    availableGamesCount: availableGames?.length || 0,
    gamesError,
    currentWeek,
    isConnected,
  });

  // Force immediate display for demo/testing
  useEffect(() => {
    if (!gamesLoading && availableGames.length === 0 && !gamesError) {
      console.log('BoardSelector: No games loaded, forcing refresh...');
      refreshGames();
    }
  }, [gamesLoading, availableGames.length, gamesError, refreshGames]);

  // Get board data for the selected game
  const {
    boards: gameBoards,
    loading: boardsLoading,
    error: boardsError,
    refetch: refreshBoards,
  } = useGameBoards(selectedGame?.gameId);

  // Set default selected game when games load
  useEffect(() => {
    if (availableGames.length > 0 && !selectedGame) {
      const firstUpcomingGame = availableGames.find(
        (game) => game.week >= currentWeek,
      );
      if (firstUpcomingGame) {
        setSelectedGame(firstUpcomingGame);
      } else if (availableGames.length > 0) {
        setSelectedGame(availableGames[availableGames.length - 1]); // Fallback to the last game of the season
      }
    }
  }, [availableGames, selectedGame, currentWeek]);

  const availableTiers = getAvailableTiers(isVIP);

  // Helper function to calculate Blue Points earned based on price tier
  const calculateBluePoints = (pricePerSquare: number): number => {
    if (pricePerSquare >= 1 && pricePerSquare <= 5) return 150;
    if (pricePerSquare >= 6 && pricePerSquare <= 10) return 200;
    if (pricePerSquare >= 11 && pricePerSquare <= 20) return 400;
    if (pricePerSquare >= 21 && pricePerSquare <= 50) return 600;
    if (pricePerSquare >= 51 && pricePerSquare <= 100) return 1000;
    if (pricePerSquare >= 101 && pricePerSquare <= 250) return 1500;
    if (pricePerSquare >= 251) return 2000;
    return 100; // Free boards
  };

  // Helper function to calculate time until kickoff
  const getTimeUntilKickoff = (
    gameDate: Date,
  ): { hours: number; minutes: number; isLocked: boolean } => {
    const now = new Date();
    const kickoffTime = new Date(gameDate);
    const diffMs = kickoffTime.getTime() - now.getTime();

    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, isLocked: true };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const isLocked = hours < 1; // Lock 1 hour before kickoff

    return { hours, minutes, isLocked };
  };

  // Helper function to get board availability for a specific tier
  const getBoardAvailabilityForTier = (
    tierId: string,
  ): BoardAvailabilityResponse | null => {
    return gameBoards?.find((board) => board.tierId === tierId) || null;
  };

  // Helper function to create board configuration from API data
  const createBoardConfiguration = (
    tier: BoardTier,
    game: GameSchedule,
    availability: BoardAvailabilityResponse,
  ): BoardConfiguration => {
    return {
      boardId: availability.boardId,
      gameId: availability.gameId,
      tier,
      game,
      maxSquaresPerUser: availability.maxSquaresPerUser,
      availableSquares: availability.availableSquares,
      totalSquaresSold: availability.totalSquaresSold,
      isActive: BoardUtils.canPurchaseSquares(availability),
      createdAt: new Date(availability.createdAt),
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
    const availability = getBoardAvailabilityForTier(tier.id);

    // Don't render if no availability data yet (still loading or doesn't exist)
    if (!availability) {
      return (
        <Card className="relative opacity-60">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{tier.displayName}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {boardsLoading
                    ? 'Loading board data...'
                    : 'Board not available'}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      );
    }

    const board = createBoardConfiguration(tier, game, availability);
    const fillPercentage = availability.fillPercentage;
    const isSelected = selectedBoards.includes(board.boardId);
    const isVIPTier = tier.isVIPOnly;
    const canSelect = !isVIPTier || isVIP;
    const isNearCancellation =
      BoardUtils.isNearCancellationThreshold(availability);
    const statusMessage = BoardUtils.getBoardStatusMessage(availability);

    const calculateMaxWin = (tier: BoardTier) => {
      const { payouts } = tier;
      const regularGameTotal =
        payouts.q1Regular +
        payouts.q2Regular +
        payouts.q3Regular +
        payouts.q4Regular;
      // Overtime Split should be 50% of Q4 value
      const overtimeSplit = payouts.q4Regular * 0.5;
      const expiredOvertime = payouts.finalOvertime ?? 0;
      return {
        regularGameTotal,
        overtimeSplit,
        expiredOvertime,
      };
    };

    const rake = tier.isVIPOnly ? 0.08 : 0.05;
    const totalWinnings = tier.pricePerSquare * 100 * (1 - rake);

    return (
      <Card
        className={`relative transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
        } ${!canSelect ? 'opacity-60' : ''} ${
          isNearCancellation
            ? 'ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-950'
            : ''
        } ${
          availability.boardState === BoardState.CANCELLED
            ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-950'
            : ''
        }`}
      >
        {/* Status Badges */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          {isVIPTier && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              VIP
            </Badge>
          )}
          {isNearCancellation &&
            availability.boardState !== BoardState.CANCELLED && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Risk
              </Badge>
            )}
          {availability.boardState === BoardState.CANCELLED && (
            <Badge variant="destructive">Cancelled</Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-2xl font-bold">
                  ${tier.pricePerSquare}/sq
                </CardTitle>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalWinnings)}
              </p>
              <p className="text-xs text-gray-500">total winnings</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Kickoff Countdown */}
          {(() => {
            const kickoffTime = getTimeUntilKickoff(game.gameDate);
            if (!kickoffTime.isLocked && kickoffTime.hours > 0) {
              return (
                <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-yellow-700 dark:text-yellow-300">
                      <Clock className="w-4 h-4" />
                      Kickoff in:
                    </span>
                    <span className="font-bold text-yellow-800 dark:text-yellow-200">
                      {kickoffTime.hours}h {kickoffTime.minutes}m
                    </span>
                  </div>
                </div>
              );
            } else if (kickoffTime.isLocked) {
              return (
                <div className="bg-red-50 dark:bg-red-950 rounded-lg p-2 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-1 text-sm text-red-700 dark:text-red-300">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">
                      Board locked - Game started
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })()}

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
            <div className="flex justify-end items-center mt-1">
              <p className="text-xs font-medium">
                {fillPercentage.toFixed(1)}% filled
              </p>
            </div>

            {/* Cancellation threshold warning */}
            {isNearCancellation &&
              availability.boardState !== BoardState.CANCELLED && (
                <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900 rounded text-xs">
                  <div className="flex items-center gap-1 text-orange-700 dark:text-orange-300">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="font-medium">Cancellation Risk</span>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 mt-1">
                    Board needs {availability.cancellationThreshold}% filled to
                    avoid cancellation. Currently at {fillPercentage.toFixed(1)}
                    %.
                  </p>
                </div>
              )}

            {/* Board status message */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {statusMessage}
            </p>
          </div>

          {/* Blue Points Information */}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-blue-800 dark:text-blue-200">
              <Star className="w-4 h-4" />
              Blue Points Earned:
            </h4>
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {calculateBluePoints(tier.pricePerSquare).toLocaleString()}{' '}
                points
              </span>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                per square purchased
              </p>
            </div>
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
                  <span>Overtime Split:</span>
                  <div className="text-right">
                    <div className="font-medium">50% with 4th Q</div>
                    <div className="text-green-600 font-bold">
                      {formatCurrency(calculateMaxWin(tier).overtimeSplit)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-1">
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
            ) : availability.boardState === BoardState.CANCELLED ? (
              <Button variant="outline" className="w-full" disabled>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Board Cancelled
              </Button>
            ) : availability.boardState === BoardState.LOCKED ||
              board.availableSquares === 0 ? (
              <Button variant="outline" className="w-full" disabled>
                <Lock className="w-4 h-4 mr-2" />
                Board Full
              </Button>
            ) : !board.isActive ? (
              <Button variant="outline" className="w-full" disabled>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Board Full
              </Button>
            ) : (
              <Button
                onClick={() => onBoardSelect(board)}
                className={`w-full ${
                  isNearCancellation
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Unlock className="w-4 h-4 mr-2" />
                {isNearCancellation ? 'Select Now!' : 'Select Board'}
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

        <div className="flex items-center justify-center gap-4">
          {isVIP && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
              <Crown className="w-4 h-4 mr-1" />
              VIP Member
            </Badge>
          )}

          {/* Real-time connection status */}
          <Badge
            variant={isConnected ? 'default' : 'secondary'}
            className="text-xs"
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Live Updates
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refreshGames();
              if (selectedGame) refreshBoards();
            }}
            disabled={gamesLoading || boardsLoading}
            className="text-xs"
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${gamesLoading || boardsLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {(gamesError || boardsError) && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Error Loading Data</span>
            </div>
            {gamesError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Games: {gamesError}
              </p>
            )}
            {boardsError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Boards: {boardsError}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Game Week Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Game Week
            {gamesLoading && (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gamesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : availableGames.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                No upcoming games found for {userTeam.city} {userTeam.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Check back later or try refreshing
              </p>
            </div>
          ) : (
            (() => {
              // Group games by week
              const gamesByWeek = availableGames.reduce(
                (acc, game) => {
                  if (!acc[game.week]) {
                    acc[game.week] = [];
                  }
                  acc[game.week].push(game);
                  return acc;
                },
                {} as Record<number, typeof availableGames>,
              );

              const allWeeks = Object.keys(gamesByWeek)
                .map(Number)
                .sort((a, b) => a - b);

              const currentWeekIndex = allWeeks.findIndex(
                (week) => week >= currentWeek,
              );

              const weeks =
                currentWeekIndex !== -1
                  ? allWeeks.slice(currentWeekIndex, currentWeekIndex + 4)
                  : allWeeks.slice(-4); // Fallback to last 4 weeks if no upcoming

              const weekLabels = [
                'Current Week',
                'Next Week',
                '2 Weeks Out',
                '3 Weeks Out',
              ];

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {weeks.map((week, index) => (
                    <div key={week} className="space-y-2">
                      <h4 className="font-bold text-center p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        {weekLabels[index] || `Week ${week}`}
                      </h4>
                      <div className="space-y-2">
                        {gamesByWeek[week].map((game) => (
                          <Button
                            key={game.gameId}
                            variant={
                              selectedGame?.gameId === game.gameId
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => setSelectedGame(game)}
                            className="w-full h-auto p-3 flex flex-col items-center text-xs"
                          >
                            <div className="font-bold mb-1">
                              {game.homeTeam.id === userTeam.id ? 'vs' : '@'}{' '}
                              {game.homeTeam.id === userTeam.id
                                ? game.awayTeam.abbreviation
                                : game.homeTeam.abbreviation}
                            </div>
                            <div className="text-xs text-gray-500">
                              {game.gameDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="text-xs text-gray-400">
                              {game.gameDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>

      {/* Board Tiers */}
      {selectedGame && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Available Board Tiers</h3>
            <div className="flex items-center gap-2">
              {boardsLoading && (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              )}
              <Badge variant="outline">
                {gameBoards ? gameBoards.length : availableTiers.length} of{' '}
                {BOARD_TIERS.length} tiers available
              </Badge>
            </div>
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
                        squares, premium boards, and all teams access.
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
          {boardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BOARD_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : gameBoards && gameBoards.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No Boards Available Yet
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Boards for this game haven't been created yet. Check back later!
              </p>
              <Button onClick={refreshBoards} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BOARD_TIERS.map((tier) => (
                <BoardTierCard key={tier.id} tier={tier} game={selectedGame} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardSelector;
