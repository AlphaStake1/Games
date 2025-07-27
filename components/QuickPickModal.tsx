'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  BOARD_TIERS,
  BoardTier,
  GameSchedule,
  BoardConfiguration,
  getAvailableTiers,
} from '@/lib/boardTypes';
import { NFLTeam } from '@/lib/nflTeams';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Sparkles,
  Users,
  TrendingUp,
  Crown,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  Zap,
  DollarSign,
  Calendar,
  ArrowRight,
  RefreshCw,
  CheckCircle,
} from '@/lib/icons';

interface QuickPickModalProps {
  userTeam: NFLTeam;
  isVIP: boolean;
  availableGames: GameSchedule[];
  onBoardSelect: (board: BoardConfiguration) => void;
  onVIPUpgrade: () => void;
  children: React.ReactNode;
  className?: string;
}

interface BudgetRange {
  id: string;
  label: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface RecommendationCriteria {
  budgetRangeId: string;
  preferredGame?: GameSchedule;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

// Budget range options for user selection
const BUDGET_RANGES: BudgetRange[] = [
  {
    id: 'casual',
    label: 'Casual Player',
    description: 'Perfect for beginners',
    minPrice: 5,
    maxPrice: 20,
    icon: Star,
  },
  {
    id: 'moderate',
    label: 'Regular Player',
    description: 'Mid-tier action',
    minPrice: 20,
    maxPrice: 100,
    icon: Target,
  },
  {
    id: 'serious',
    label: 'High Roller',
    description: 'Premium boards only',
    minPrice: 100,
    maxPrice: 1000,
    icon: Crown,
  },
];

// Mock data for board popularity - in production this would come from analytics
const generateBoardPopularity = (
  tier: BoardTier,
  game: GameSchedule,
): number => {
  // Simulate popularity based on tier and game features
  let basePopularity = 50;

  // Popular tiers get higher base score
  if (tier.pricePerSquare <= 20) basePopularity += 30;
  if (tier.pricePerSquare >= 100) basePopularity += 20;

  // Add some randomness for realism
  return Math.min(95, basePopularity + Math.floor(Math.random() * 25));
};

// Generate mock board data with availability
const generateMockBoardData = (tier: BoardTier, game: GameSchedule) => {
  const popularity = generateBoardPopularity(tier, game);
  const soldSquares =
    Math.floor((popularity / 100) * 85) + Math.floor(Math.random() * 10);

  return {
    boardId: `${game.gameId}-${tier.id}`,
    gameId: game.gameId,
    tier,
    game,
    maxSquaresPerUser: 5, // Will be updated based on VIP status
    availableSquares: 100 - soldSquares,
    totalSquaresSold: soldSquares,
    isActive: soldSquares < 100,
    createdAt: new Date(),
    gameStartTime: game.gameDate,
    popularity,
  };
};

const QuickPickModal: React.FC<QuickPickModalProps> = ({
  userTeam,
  isVIP,
  availableGames,
  onBoardSelect,
  onVIPUpgrade,
  children,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'criteria' | 'recommendations' | 'success'>(
    'criteria',
  );
  const [showAllTiers, setShowAllTiers] = useState(false);
  const [criteria, setCriteria] = useState<RecommendationCriteria>({
    budgetRangeId: 'casual',
    preferredGame: availableGames[0],
    riskTolerance: 'moderate',
  });
  const [selectedBoard, setSelectedBoard] = useState<BoardConfiguration | null>(
    null,
  );

  // Reset modal state when opening
  useEffect(() => {
    if (open) {
      setStep('criteria');
      setShowAllTiers(false);
      setSelectedBoard(null);
      setCriteria({
        budgetRangeId: 'casual',
        preferredGame: availableGames[0],
        riskTolerance: 'moderate',
      });
    }
  }, [open, availableGames]);

  // Get available tiers based on VIP status
  const availableTiers = useMemo(() => getAvailableTiers(isVIP), [isVIP]);

  // Generate board recommendations based on criteria
  const recommendations = useMemo(() => {
    if (!criteria.preferredGame) return [];

    const selectedBudget = BUDGET_RANGES.find(
      (b) => b.id === criteria.budgetRangeId,
    );
    if (!selectedBudget) return [];

    // Filter tiers by budget and VIP access
    const validTiers = availableTiers.filter(
      (tier) =>
        tier.pricePerSquare >= selectedBudget.minPrice &&
        tier.pricePerSquare <= selectedBudget.maxPrice,
    );

    // Generate board data for valid tiers
    const boards = validTiers.map((tier) => ({
      ...generateMockBoardData(tier, criteria.preferredGame!),
      maxSquaresPerUser: isVIP ? 10 : 5,
    }));

    // Sort by recommendation score (popularity + tier preferences)
    const scoredBoards = boards.map((board) => {
      let score = board.popularity;

      // Boost score based on risk tolerance
      if (
        criteria.riskTolerance === 'conservative' &&
        board.tier.pricePerSquare <= 20
      ) {
        score += 20;
      } else if (
        criteria.riskTolerance === 'aggressive' &&
        board.tier.pricePerSquare >= 100
      ) {
        score += 20;
      } else if (
        criteria.riskTolerance === 'moderate' &&
        board.tier.pricePerSquare >= 20 &&
        board.tier.pricePerSquare <= 100
      ) {
        score += 15;
      }

      return { ...board, recommendationScore: score };
    });

    return scoredBoards.sort(
      (a, b) => b.recommendationScore - a.recommendationScore,
    );
  }, [criteria, availableTiers, isVIP]);

  // Get tiers to display (progressive disclosure)
  const tiersToShow = useMemo(() => {
    if (showAllTiers) return recommendations;
    return recommendations.slice(0, 2);
  }, [recommendations, showAllTiers]);

  const handleBudgetChange = (budgetId: string) => {
    setCriteria((prev) => ({ ...prev, budgetRangeId: budgetId }));
  };

  const handleGameChange = (gameId: string) => {
    const game = availableGames.find((g) => g.gameId === gameId);
    if (game) {
      setCriteria((prev) => ({ ...prev, preferredGame: game }));
    }
  };

  const handleRiskChange = (
    risk: 'conservative' | 'moderate' | 'aggressive',
  ) => {
    setCriteria((prev) => ({ ...prev, riskTolerance: risk }));
  };

  const handleGetRecommendations = () => {
    setStep('recommendations');
  };

  const handleBoardSelection = (board: BoardConfiguration) => {
    setSelectedBoard(board);
    onBoardSelect(board);
    setStep('success');
  };

  const handleStartOver = () => {
    setStep('criteria');
    setSelectedBoard(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Render budget selection step
  const renderCriteriaStep = () => (
    <div className="space-y-6">
      {/* Team Display */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: userTeam.primaryColor }}
          >
            {userTeam.abbreviation}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {userTeam.city} {userTeam.name}
            </h3>
            <p className="text-sm text-muted-foreground">Your favorite team</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Budget Selection */}
      <div className="space-y-4">
        <h4 className="text-md font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Choose your budget range
        </h4>
        <RadioGroup
          value={criteria.budgetRangeId}
          onValueChange={handleBudgetChange}
        >
          <div className="grid gap-3">
            {BUDGET_RANGES.map((budget) => (
              <div key={budget.id} className="flex items-center space-x-3">
                <RadioGroupItem value={budget.id} id={budget.id} />
                <Label
                  htmlFor={budget.id}
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <budget.icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{budget.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(budget.minPrice)} -{' '}
                      {formatCurrency(budget.maxPrice)} • {budget.description}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Game Selection */}
      <div className="space-y-4">
        <h4 className="text-md font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Which game interests you most?
        </h4>
        <RadioGroup
          value={criteria.preferredGame?.gameId || ''}
          onValueChange={handleGameChange}
        >
          <div className="grid gap-3">
            {availableGames.slice(0, 3).map((game) => (
              <div key={game.gameId} className="flex items-center space-x-3">
                <RadioGroupItem value={game.gameId} id={game.gameId} />
                <Label
                  htmlFor={game.gameId}
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      Week {game.week}: {game.homeTeam.abbreviation} vs{' '}
                      {game.awayTeam.abbreviation}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {game.gameDate.toLocaleDateString()} at{' '}
                      {game.gameDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {(game.homeTeam.id === userTeam.id ||
                    game.awayTeam.id === userTeam.id) && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Your Team
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Risk Tolerance */}
      <div className="space-y-4">
        <h4 className="text-md font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Playing style preference
        </h4>
        <RadioGroup
          value={criteria.riskTolerance}
          onValueChange={(value) =>
            handleRiskChange(value as typeof criteria.riskTolerance)
          }
        >
          <div className="grid gap-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="conservative" id="conservative" />
              <Label
                htmlFor="conservative"
                className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
              >
                <div className="font-medium">Conservative</div>
                <div className="text-sm text-muted-foreground">
                  Lower entry fees, consistent smaller wins
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label
                htmlFor="moderate"
                className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
              >
                <div className="font-medium">Moderate</div>
                <div className="text-sm text-muted-foreground">
                  Balanced risk and reward, popular tiers
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="aggressive" id="aggressive" />
              <Label
                htmlFor="aggressive"
                className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
              >
                <div className="font-medium">High Stakes</div>
                <div className="text-sm text-muted-foreground">
                  Premium boards, maximum potential payouts
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Action Button */}
      <Button onClick={handleGetRecommendations} className="w-full" size="lg">
        <Sparkles className="w-4 h-4 mr-2" />
        Get My Recommendations
      </Button>
    </div>
  );

  // Render recommendations step
  const renderRecommendationsStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Perfect Boards for You</h3>
        <p className="text-sm text-muted-foreground">
          Based on your preferences for{' '}
          {criteria.preferredGame?.homeTeam.abbreviation} vs{' '}
          {criteria.preferredGame?.awayTeam.abbreviation}
        </p>
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <Card className="text-center p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">No boards match your criteria</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your budget range or{' '}
                {!isVIP && 'consider upgrading to VIP for'}
                {!isVIP && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={onVIPUpgrade}
                  >
                    upgrade to VIP for premium boards
                  </Button>
                )}
              </p>
            </div>
            <Button variant="outline" onClick={handleStartOver}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Adjust Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Recommended Boards */}
      {recommendations.length > 0 && (
        <>
          <div className="grid gap-4">
            {tiersToShow.map((board, index) => (
              <RecommendationCard
                key={board.boardId}
                board={board}
                isTopPick={index === 0}
                onSelect={() => handleBoardSelection(board)}
              />
            ))}
          </div>

          {/* Progressive Disclosure */}
          {recommendations.length > 2 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllTiers(!showAllTiers)}
                className="w-full"
              >
                {showAllTiers ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Fewer Options
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show {recommendations.length - 2} More Options
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={handleStartOver}
            className="w-full"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Change Preferences
          </Button>
        </>
      )}
    </div>
  );

  // Render success step
  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Board Selected!</h3>
        <p className="text-sm text-muted-foreground">
          You've selected the {selectedBoard?.tier.displayName} board for{' '}
          {selectedBoard?.game.homeTeam.abbreviation} vs{' '}
          {selectedBoard?.game.awayTeam.abbreviation}
        </p>
      </div>

      {selectedBoard && (
        <Card className="text-left">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Entry Price:
                </span>
                <span className="font-medium">
                  {formatCurrency(selectedBoard.tier.pricePerSquare)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Pot:
                </span>
                <span className="font-medium">
                  {formatCurrency(selectedBoard.tier.totalPot)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Q4 Winner Gets:
                </span>
                <span className="font-bold text-green-600">
                  {formatCurrency(selectedBoard.tier.payouts.q4Regular)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Available Squares:
                </span>
                <span className="font-medium">
                  {selectedBoard.availableSquares}/100
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <Button onClick={handleClose} className="w-full" size="lg">
          Continue to Square Selection
        </Button>
        <Button variant="outline" onClick={handleStartOver} className="w-full">
          Pick a Different Board
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Quick Pick Assistant
          </DialogTitle>
          <DialogDescription>
            {step === 'criteria' &&
              'Tell us your preferences and we&apos;ll recommend the perfect board'}
            {step === 'recommendations' &&
              'Here are the best boards matching your preferences'}
            {step === 'success' && 'Your board selection is complete'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === 'criteria' && renderCriteriaStep()}
          {step === 'recommendations' && renderRecommendationsStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Recommendation Card Component
interface RecommendationCardProps {
  board: BoardConfiguration & {
    popularity: number;
    recommendationScore: number;
  };
  isTopPick: boolean;
  onSelect: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  board,
  isTopPick,
  onSelect,
}) => {
  const fillPercentage = (board.totalSquaresSold / 100) * 100;

  return (
    <Card
      className={cn(
        'relative transition-all duration-200 hover:shadow-md cursor-pointer',
        isTopPick && 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950',
      )}
      onClick={onSelect}
    >
      {/* Top Pick Badge */}
      {isTopPick && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Top Pick
          </Badge>
        </div>
      )}

      {/* VIP Badge */}
      {board.tier.isVIPOnly && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
            <Crown className="w-3 h-3 mr-1" />
            VIP
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{board.tier.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {board.tier.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(board.tier.pricePerSquare)}
            </p>
            <p className="text-xs text-muted-foreground">per square</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Popularity & Availability */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Popularity:
            </span>
            <span className="font-medium">{board.popularity}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Available Squares:</span>
            <span className="font-medium">{board.availableSquares}/100</span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        {/* Key Payouts */}
        <div className="bg-muted rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Potential Winnings:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Q2:</span>
              <span className="font-medium">
                {formatCurrency(board.tier.payouts.q2Regular)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Q4:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(board.tier.payouts.q4Regular)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className={cn(
            'w-full',
            isTopPick
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-primary hover:bg-primary/90',
          )}
        >
          <Target className="w-4 h-4 mr-2" />
          Select This Board
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickPickModal;
