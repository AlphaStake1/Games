/**
 * BOARD RULES - Single Source of Truth
 *
 * This file contains ALL board configuration rules and constraints.
 * ElizaOS agents MUST reference these constants instead of hardcoding values.
 *
 * CRITICAL: Never hardcode these values elsewhere - always import from this file.
 */

export const BOARD_RULES = {
  /**
   * HOUSE BOARDS - House guarantees full payouts regardless of fill level
   */
  HOUSE_BOARDS: {
    /**
     * NON-VIP HOUSE BOARDS
     * - House has 5% margin (5% rake, no VIP bonus cost)
     * - Can afford 5 empty squares maximum
     */
    NON_VIP: {
      MIN_FILL_PERCENTAGE: 95, // 95% minimum fill (95 squares sold)
      MAX_DEAD_SQUARES: 5, // 5 empty squares maximum
      RAKE_PERCENTAGE: 0.05, // 5% house rake
      VIP_BONUS_COST: 0, // No VIP bonus to pay
      NET_MARGIN_PERCENTAGE: 0.05, // 5% net margin
      GUARANTEES_FULL_PAYOUTS: true,
    },

    /**
     * VIP HOUSE BOARDS
     * - House has 3% margin (8% rake - 5% VIP bonus cost)
     * - Can only afford 3 empty squares maximum
     */
    VIP: {
      MIN_FILL_PERCENTAGE: 97, // 97% minimum fill (97 squares sold)
      MAX_DEAD_SQUARES: 3, // 3 empty squares maximum
      RAKE_PERCENTAGE: 0.08, // 8% house rake
      VIP_BONUS_COST: 0.05, // 5% VIP bonus cost
      NET_MARGIN_PERCENTAGE: 0.03, // 3% net margin (8% - 5%)
      GUARANTEES_FULL_PAYOUTS: true,
    },
  },

  /**
   * COMMUNITY BOARDS - Payouts based on actual funds raised
   */
  COMMUNITY_BOARDS: {
    MIN_FILL_PERCENTAGE: 95, // 95% minimum fill for all community boards
    TOTAL_RAKE_PERCENTAGE: 0.05, // 5% total rake on funds raised

    /**
     * RAKE DISTRIBUTION (of the 5% total rake)
     */
    RAKE_SPLIT: {
      CBL_PERCENTAGE: 0.03, // CBL gets 3% of total pool (60% of rake)
      HOUSE_PERCENTAGE: 0.02, // House gets 2% of total pool (40% of rake)
    },

    /**
     * QUARTER PAYOUT DISTRIBUTION (of player pool after rake)
     */
    QUARTER_SPLITS: {
      Q1: 0.15, // 15% of player pool
      Q2: 0.25, // 25% of player pool
      Q3: 0.15, // 15% of player pool
      Q4: 0.45, // 45% of player pool
    },

    GUARANTEES_FULL_PAYOUTS: false, // Payouts vary based on actual funds
  },

  /**
   * DEAD SQUARE REDISTRIBUTION RULES
   */
  DEAD_SQUARE_REDISTRIBUTION: {
    /**
     * COMMUNITY BOARD REDISTRIBUTION
     * When dead squares hit on community boards
     */
    COMMUNITY: {
      HOUSE_OVERHEAD_RATE: 0.1, // 10% house processing fee
      CBL_MANAGEMENT_RATE: 0.05, // 5% CBL management fee
      PLAYER_SHARE_RATE: 0.85, // 85% goes to players
      MIN_REDISTRIBUTION_THRESHOLD: 1, // $1 minimum per winner
    },

    /**
     * HOUSE BOARD DEAD SQUARE RULES
     * When dead squares hit on house boards
     */
    HOUSE: {
      HOUSE_CLAIMS_FULL_QUARTER: true, // House wins entire quarter payout
      BACKFILL_WITH_HOUSE_NFTS: true, // Fill remaining squares with House NFTs
      HOUSE_NFT_INDICATOR_COLOR: '#FF6B35', // Orange circle indicator
    },
  },
} as const;

/**
 * VALIDATION HELPERS
 * Use these to validate board configurations
 */
export const BoardRuleValidation = {
  /**
   * Check if a House board configuration is valid
   */
  isValidHouseBoardFill(squaresSold: number, isVIP: boolean): boolean {
    const rules = isVIP
      ? BOARD_RULES.HOUSE_BOARDS.VIP
      : BOARD_RULES.HOUSE_BOARDS.NON_VIP;
    const fillPercentage = squaresSold / 100;
    return fillPercentage >= rules.MIN_FILL_PERCENTAGE / 100;
  },

  /**
   * Check if a Community board configuration is valid
   */
  isValidCommunityBoardFill(squaresSold: number): boolean {
    const fillPercentage = squaresSold / 100;
    return (
      fillPercentage >= BOARD_RULES.COMMUNITY_BOARDS.MIN_FILL_PERCENTAGE / 100
    );
  },

  /**
   * Get maximum allowed dead squares for House boards
   */
  getMaxDeadSquares(isVIP: boolean): number {
    return isVIP
      ? BOARD_RULES.HOUSE_BOARDS.VIP.MAX_DEAD_SQUARES
      : BOARD_RULES.HOUSE_BOARDS.NON_VIP.MAX_DEAD_SQUARES;
  },

  /**
   * Calculate House board net margin
   */
  calculateHouseNetMargin(totalRevenue: number, isVIP: boolean): number {
    const rules = isVIP
      ? BOARD_RULES.HOUSE_BOARDS.VIP
      : BOARD_RULES.HOUSE_BOARDS.NON_VIP;
    return totalRevenue * rules.NET_MARGIN_PERCENTAGE;
  },
};

/**
 * AGENT QUICK REFERENCE EXAMPLES
 *
 * // Check VIP house board fill requirement
 * if (squaresSold < BOARD_RULES.HOUSE_BOARDS.VIP.MIN_FILL_PERCENTAGE) {
 *   throw new Error('VIP House boards require 97% fill minimum');
 * }
 *
 * // Calculate community board rake
 * const cblShare = fundsRaised * BOARD_RULES.COMMUNITY_BOARDS.RAKE_SPLIT.CBL_PERCENTAGE;
 *
 * // Get Q4 payout percentage
 * const q4Payout = playerPool * BOARD_RULES.COMMUNITY_BOARDS.QUARTER_SPLITS.Q4;
 */
