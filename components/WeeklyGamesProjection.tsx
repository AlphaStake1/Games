'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Crown,
  Home,
  Plane,
  RefreshCw,
  Eye,
  DollarSign,
} from 'lucide-react';
import { NFLTeam } from '@/lib/nflTeams';
import { mockDataService } from '@/lib/api/mockDataService';
import { formatCurrency } from '@/lib/utils';

interface WeeklyGamesProjectionProps {
  userTeam: NFLTeam;
  isVIP: boolean;
  onBoardSelect?: (gameId: string, tierId: string) => void;
  className?: string;
}

interface GameProjection {
  gameId: string;
  week: number;
  opponent: NFLTeam;
  isHome: boolean;
  gameDate: Date;
  availableTiers: Array<{
    tierId: string;
    tierName: string;
    pricePerSquare: number;
    estimatedFillRate: number;
    isVipOnly: boolean;
  }>;
}

const WeeklyGamesProjection: React.FC<WeeklyGamesProjectionProps> = ({
  userTeam,
  isVIP,
  onBoardSelect,
  className = '',
}) => {
  const [projection, setProjection] = useState<{
    title: string;
    games: GameProjection[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const loadProjection = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = mockDataService.generateNext3GamesProjection(userTeam);
      setProjection(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjection();
  }, [userTeam]);

  const formatGameTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const getEstimatedPayout = (pricePerSquare: number, fillRate: number) => {
    const totalPool = pricePerSquare * 100;
    const playerPool = totalPool * 0.95; // 5% house rake
    return {
      q1: Math.floor(playerPool * 0.15),
      q2: Math.floor(playerPool * 0.25),
      q3: Math.floor(playerPool * 0.15),
      q4: Math.floor(playerPool * 0.45),
    };
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Loading Next Games...
            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <Button onClick={loadProjection} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!projection || projection.games.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6 text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No Upcoming Games
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            No upcoming games found for {userTeam.city} {userTeam.name}
          </p>
          <Button onClick={loadProjection} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {projection.title}
          </CardTitle>
          <Button onClick={loadProjection} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Projected weekly board availability for your favorite team
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projection.games.map((game, index) => (
            <Card
              key={game.gameId}
              className={`transition-all duration-200 ${
                selectedGame === game.gameId
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                  : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Week {game.week}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {game.isHome ? (
                        <Home className="w-4 h-4 text-green-600" />
                      ) : (
                        <Plane className="w-4 h-4 text-orange-600" />
                      )}
                      <span className="font-medium">
                        {game.isHome ? 'vs' : '@'} {game.opponent.city}{' '}
                        {game.opponent.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatGameTime(game.gameDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {game.gameDate > new Date()
                        ? `${Math.ceil(
                            (game.gameDate.getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24),
                          )} days away`
                        : 'Today'}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Team Matchup Visual */}
                <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                      style={{ backgroundColor: userTeam.primaryColor }}
                    >
                      {userTeam.abbreviation}
                    </div>
                    <div className="text-sm font-medium">
                      {userTeam.city} {userTeam.name}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                      style={{ backgroundColor: game.opponent.primaryColor }}
                    >
                      {game.opponent.abbreviation}
                    </div>
                    <div className="text-sm font-medium">
                      {game.opponent.city} {game.opponent.name}
                    </div>
                  </div>
                </div>

                {/* Available Tiers */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Available Board Tiers:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {game.availableTiers.map((tier) => {
                      const payouts = getEstimatedPayout(
                        tier.pricePerSquare,
                        tier.estimatedFillRate,
                      );
                      const canAccess = !tier.isVipOnly || isVIP;

                      return (
                        <div
                          key={tier.tierId}
                          className={`p-3 rounded-lg border transition-all ${
                            canAccess
                              ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 cursor-pointer'
                              : 'border-gray-100 dark:border-gray-800 opacity-60'
                          }`}
                          onClick={() => {
                            if (canAccess && onBoardSelect) {
                              onBoardSelect(game.gameId, tier.tierId);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {tier.tierName}
                              </span>
                              {tier.isVipOnly && (
                                <Crown className="w-3 h-3 text-yellow-600" />
                              )}
                            </div>
                            <div className="text-sm font-bold text-green-600">
                              {formatCurrency(tier.pricePerSquare)}
                            </div>
                          </div>

                          {/* Fill Rate Prediction */}
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Estimated Fill Rate:</span>
                              <span className="font-medium">
                                {tier.estimatedFillRate}%
                              </span>
                            </div>
                            <Progress
                              value={tier.estimatedFillRate}
                              className="h-1.5"
                            />
                          </div>

                          {/* Payout Preview */}
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Max Win (Q4):</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(payouts.q4)}
                              </span>
                            </div>
                          </div>

                          {!canAccess && (
                            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                              VIP Required
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      setSelectedGame(
                        selectedGame === game.gameId ? null : game.gameId,
                      )
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedGame === game.gameId
                      ? 'Hide Details'
                      : 'View Details'}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (onBoardSelect) {
                        // Select the best available tier for the user
                        const bestTier = game.availableTiers.find(
                          (t) => !t.isVipOnly || isVIP,
                        );
                        if (bestTier) {
                          onBoardSelect(game.gameId, bestTier.tierId);
                        }
                      }
                    }}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Select Board
                  </Button>
                </div>

                {/* Expanded Details */}
                {selectedGame === game.gameId && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Game Info:</h5>
                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                          <div>Week {game.week} - NFL Regular Season</div>
                          <div>{game.isHome ? 'Home Game' : 'Away Game'}</div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatGameTime(game.gameDate)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Tier Summary:</h5>
                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                          <div>
                            {game.availableTiers.length} tiers available
                          </div>
                          <div>
                            {
                              game.availableTiers.filter((t) => !t.isVipOnly)
                                .length
                            }{' '}
                            standard tiers
                          </div>
                          <div>
                            {
                              game.availableTiers.filter((t) => t.isVipOnly)
                                .length
                            }{' '}
                            VIP tiers
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Weekly Squares Summary
            </span>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p>
              • Each game offers multiple board tiers from $5 to $500 per square
            </p>
            <p>• Boards must reach 95% capacity to avoid cancellation</p>
            <p>
              • Winners determined by quarterly score digits (Q1: 15%, Q2: 25%,
              Q3: 15%, Q4: 45%)
            </p>
            {!isVIP && (
              <p className="mt-2 text-orange-700 dark:text-orange-300">
                • Upgrade to VIP for access to premium $100+ boards and 5% win
                bonus
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGamesProjection;
