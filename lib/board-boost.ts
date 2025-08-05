import { PublicKey } from '@solana/web3.js';

/**
 * Board Boost System - Discovery & Ranking Algorithm
 *
 * This module implements the smart ranking algorithm that powers
 * the board discovery feed, taking into account boost status,
 * community engagement, CBL reputation, and urgency factors.
 */

export interface BoardBoostConfig {
  weights: {
    boost: number; // Economic signal strength (0.4)
    fillRate: number; // Community engagement (0.3)
    reputation: number; // CBL track record (0.2)
    urgency: number; // Time pressure (0.1)
  };
  tiers: {
    featured: { minScore: number; maxSlots: number };
    promoted: { minScore: number; maxSlots: number };
    standard: { minScore: number; maxSlots: number };
  };
  boostPricing: {
    1: number; // 1 day: 0.05 SOL
    3: number; // 3 days: 0.12 SOL
    7: number; // 7 days: 0.25 SOL
  };
}

export const BOOST_CONFIG: BoardBoostConfig = {
  weights: {
    boost: 0.4, // Economic signal strength
    fillRate: 0.3, // Community engagement
    reputation: 0.2, // CBL track record
    urgency: 0.1, // Time pressure
  },
  tiers: {
    featured: { minScore: 0.8, maxSlots: 5 },
    promoted: { minScore: 0.5, maxSlots: 10 },
    standard: { minScore: 0.0, maxSlots: 100 },
  },
  boostPricing: {
    1: 0.05, // 0.05 SOL for 1 day
    3: 0.12, // 0.12 SOL for 3 days
    7: 0.25, // 0.25 SOL for 7 days
  },
} as const;

export interface EnhancedBoard {
  // Core board data
  publicKey: PublicKey;
  gameId: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  gameDate: Date;
  entryFee: number;
  maxPlayers: number;
  currentPlayers: number;

  // Boost data
  boostAmount: number;
  boostExpiresAt: Date | null;
  boostDuration: number; // in days

  // CBL data
  cblAddress: PublicKey;
  cblUsername: string;
  cblReputation: number; // 0-1000 scale
  cblTier: 'first-stream' | 'drive-maker' | 'franchise';

  // Engagement metrics
  fillRate: number; // 0-100
  averageFillTime: number; // hours to reach 90% fill
  playerRetentionRate: number; // % of returning players

  // Discovery metadata
  tags: string[];
  isRivalryGame: boolean;
  isPrimetime: boolean;
  isVipOnly: boolean;
  createdAt: Date;
}

export interface BoardScore {
  board: EnhancedBoard;
  totalScore: number;
  scoreBreakdown: {
    boostScore: number;
    fillRateScore: number;
    reputationScore: number;
    urgencyScore: number;
  };
  tier: 'featured' | 'promoted' | 'standard';
  rank: number;
}

/**
 * Calculate the discovery score for a board based on multiple factors
 */
export function calculateBoardScore(board: EnhancedBoard): BoardScore {
  const now = Date.now();

  // 1. Boost Score (0-1)
  let boostScore = 0;
  if (board.boostExpiresAt && board.boostExpiresAt.getTime() > now) {
    // Base score from boost amount (normalized to max expected boost of 0.25 SOL)
    const normalizedBoost = Math.min(board.boostAmount / 250_000_000, 1.0);

    // Time decay factor - boost effectiveness decreases as expiration approaches
    const timeRemaining = board.boostExpiresAt.getTime() - now;
    const totalBoostTime = board.boostDuration * 24 * 60 * 60 * 1000; // days to ms
    const timeDecay = Math.max(timeRemaining / totalBoostTime, 0.3); // min 30% effectiveness

    boostScore = normalizedBoost * timeDecay;
  }

  // 2. Fill Rate Score (0-1)
  const fillRateScore = board.fillRate / 100;

  // 3. Reputation Score (0-1)
  let reputationScore = Math.min(board.cblReputation / 1000, 1.0);

  // Bonus for higher tier CBLs
  if (board.cblTier === 'franchise') {
    reputationScore = Math.min(reputationScore * 1.2, 1.0);
  } else if (board.cblTier === 'drive-maker') {
    reputationScore = Math.min(reputationScore * 1.1, 1.0);
  }

  // 4. Urgency Score (0-1)
  let urgencyScore = 0;
  const hoursUntilGame = (board.gameDate.getTime() - now) / (1000 * 60 * 60);

  if (hoursUntilGame > 0) {
    if (hoursUntilGame <= 24) {
      urgencyScore = 0.9; // Very urgent - game within 24 hours
    } else if (hoursUntilGame <= 48) {
      urgencyScore = 0.7; // Urgent - game within 48 hours
    } else if (hoursUntilGame <= 72) {
      urgencyScore = 0.5; // Moderate urgency
    } else if (hoursUntilGame <= 168) {
      urgencyScore = 0.3; // Low urgency - game within a week
    } else {
      urgencyScore = 0.1; // Very low urgency
    }

    // Boost urgency if board is not filling fast enough
    if (board.fillRate < 50 && hoursUntilGame < 72) {
      urgencyScore = Math.min(urgencyScore * 1.3, 1.0);
    }
  }

  // Special modifiers
  if (board.isRivalryGame) {
    urgencyScore = Math.min(urgencyScore * 1.2, 1.0);
    reputationScore = Math.min(reputationScore * 1.1, 1.0);
  }

  if (board.isPrimetime) {
    urgencyScore = Math.min(urgencyScore * 1.15, 1.0);
  }

  // Calculate weighted total score
  const totalScore =
    boostScore * BOOST_CONFIG.weights.boost +
    fillRateScore * BOOST_CONFIG.weights.fillRate +
    reputationScore * BOOST_CONFIG.weights.reputation +
    urgencyScore * BOOST_CONFIG.weights.urgency;

  // Determine tier
  let tier: 'featured' | 'promoted' | 'standard' = 'standard';
  if (totalScore >= BOOST_CONFIG.tiers.featured.minScore) {
    tier = 'featured';
  } else if (totalScore >= BOOST_CONFIG.tiers.promoted.minScore) {
    tier = 'promoted';
  }

  return {
    board,
    totalScore,
    scoreBreakdown: {
      boostScore,
      fillRateScore,
      reputationScore,
      urgencyScore,
    },
    tier,
    rank: 0, // Will be set after sorting
  };
}

/**
 * Rank boards for discovery feed display
 */
export function rankBoards(boards: EnhancedBoard[]): BoardScore[] {
  // Calculate scores for all boards
  const scoredBoards = boards.map((board) => calculateBoardScore(board));

  // Sort by total score (highest first)
  scoredBoards.sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks
  scoredBoards.forEach((board, index) => {
    board.rank = index + 1;
  });

  // Apply tier limits
  const tieredBoards: BoardScore[] = [];
  const tierCounts = {
    featured: 0,
    promoted: 0,
    standard: 0,
  };

  for (const board of scoredBoards) {
    const maxSlots = BOOST_CONFIG.tiers[board.tier].maxSlots;

    if (tierCounts[board.tier] < maxSlots) {
      tieredBoards.push(board);
      tierCounts[board.tier]++;
    } else {
      // Downgrade to next tier if current tier is full
      if (
        board.tier === 'featured' &&
        tierCounts.promoted < BOOST_CONFIG.tiers.promoted.maxSlots
      ) {
        board.tier = 'promoted';
        tieredBoards.push(board);
        tierCounts.promoted++;
      } else if (
        (board.tier === 'featured' || board.tier === 'promoted') &&
        tierCounts.standard < BOOST_CONFIG.tiers.standard.maxSlots
      ) {
        board.tier = 'standard';
        tieredBoards.push(board);
        tierCounts.standard++;
      }
    }
  }

  return tieredBoards;
}

/**
 * Filter boards based on user preferences and context
 */
export interface BoardFilters {
  minEntryFee?: number;
  maxEntryFee?: number;
  teams?: string[];
  hideFullBoards?: boolean;
  vipOnly?: boolean;
  boostedOnly?: boolean;
  cblTiers?: Array<'first-stream' | 'drive-maker' | 'franchise'>;
  tags?: string[];
}

export function filterBoards(
  boards: EnhancedBoard[],
  filters: BoardFilters,
): EnhancedBoard[] {
  return boards.filter((board) => {
    // Entry fee filters
    if (filters.minEntryFee && board.entryFee < filters.minEntryFee)
      return false;
    if (filters.maxEntryFee && board.entryFee > filters.maxEntryFee)
      return false;

    // Team filters
    if (filters.teams && filters.teams.length > 0) {
      const hasTeam =
        filters.teams.includes(board.homeTeam) ||
        filters.teams.includes(board.awayTeam);
      if (!hasTeam) return false;
    }

    // Full board filter
    if (filters.hideFullBoards && board.fillRate >= 100) return false;

    // VIP filter
    if (filters.vipOnly !== undefined && board.isVipOnly !== filters.vipOnly)
      return false;

    // Boost filter
    if (filters.boostedOnly) {
      const isBoosted =
        board.boostExpiresAt && board.boostExpiresAt.getTime() > Date.now();
      if (!isBoosted) return false;
    }

    // CBL tier filter
    if (filters.cblTiers && filters.cblTiers.length > 0) {
      if (!filters.cblTiers.includes(board.cblTier)) return false;
    }

    // Tag filters
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        board.tags.includes(tag),
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

/**
 * Get discovery feed recommendations based on user history
 */
export interface UserPreferences {
  favoriteTeams: string[];
  averageEntryFee: number;
  preferredGameTypes: string[];
  isVip: boolean;
}

export function getPersonalizedBoards(
  boards: BoardScore[],
  userPrefs: UserPreferences,
): BoardScore[] {
  // Apply personalization scoring adjustments
  const personalizedBoards = boards.map((boardScore) => {
    let personalBonus = 0;
    const board = boardScore.board;

    // Favorite team bonus
    if (
      userPrefs.favoriteTeams.includes(board.homeTeam) ||
      userPrefs.favoriteTeams.includes(board.awayTeam)
    ) {
      personalBonus += 0.15;
    }

    // Entry fee preference (prefer boards near user's average)
    const feeDistance = Math.abs(board.entryFee - userPrefs.averageEntryFee);
    const feeSimilarity = 1 - feeDistance / userPrefs.averageEntryFee;
    if (feeSimilarity > 0.7) {
      personalBonus += 0.1;
    }

    // VIP bonus for VIP-only boards
    if (userPrefs.isVip && board.isVipOnly) {
      personalBonus += 0.05;
    }

    // Apply personal bonus (capped at +25% boost)
    const adjustedScore = Math.min(
      boardScore.totalScore * (1 + personalBonus),
      1.0,
    );

    return {
      ...boardScore,
      totalScore: adjustedScore,
    };
  });

  // Re-sort based on personalized scores
  personalizedBoards.sort((a, b) => b.totalScore - a.totalScore);

  return personalizedBoards;
}

/**
 * Analytics helper - track boost performance
 */
export interface BoostAnalytics {
  boardId: string;
  boostStarted: Date;
  boostDuration: number;
  boostCost: number;
  fillRateBefore: number;
  fillRateAfter: number;
  playersGained: number;
  revenueGenerated: number;
  impressions: number;
  clickThroughRate: number;
}

export function calculateBoostROI(analytics: BoostAnalytics): {
  roi: number;
  costPerPlayer: number;
  fillRateIncrease: number;
  effectiveness: 'excellent' | 'good' | 'fair' | 'poor';
} {
  const fillRateIncrease = analytics.fillRateAfter - analytics.fillRateBefore;
  const costPerPlayer =
    analytics.playersGained > 0
      ? analytics.boostCost / analytics.playersGained
      : Infinity;

  // ROI = (Revenue - Cost) / Cost * 100
  const roi =
    ((analytics.revenueGenerated - analytics.boostCost) / analytics.boostCost) *
    100;

  // Determine effectiveness rating
  let effectiveness: 'excellent' | 'good' | 'fair' | 'poor';
  if (roi >= 200 && fillRateIncrease >= 30) {
    effectiveness = 'excellent';
  } else if (roi >= 100 && fillRateIncrease >= 20) {
    effectiveness = 'good';
  } else if (roi >= 50 && fillRateIncrease >= 10) {
    effectiveness = 'fair';
  } else {
    effectiveness = 'poor';
  }

  return {
    roi,
    costPerPlayer,
    fillRateIncrease,
    effectiveness,
  };
}
