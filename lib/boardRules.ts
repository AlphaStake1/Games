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
     * STANDARD HOUSE BOARDS (<$100 per square) - Anyone can play
     * - House has 5% rake, VIP players get 5% bonus
     * - House break-even risk if all quarters won by VIPs
     */
    STANDARD: {
      PRICE_THRESHOLD: 100, // Under $100 per square
      MIN_FILL_PERCENTAGE: 95, // 95% minimum fill (95 squares sold)
      MAX_DEAD_SQUARES: 5, // 5 empty squares maximum
      RAKE_PERCENTAGE: 0.05, // 5% house rake
      VIP_BONUS_PERCENTAGE: 0.05, // 5% VIP bonus
      NET_MARGIN_PERCENTAGE: 0.05, // 5% base margin (break-even if all VIP wins)
      VIP_ACCESS_REQUIRED: false, // Anyone can play
      GUARANTEES_FULL_PAYOUTS: true,
    },

    /**
     * PREMIUM HOUSE BOARDS ($100+ per square) - VIP-only access
     * - House has 8% rake, VIP players get 5% bonus, House keeps 3%
     * - Guaranteed 3% house margin
     */
    PREMIUM: {
      PRICE_THRESHOLD: 100, // $100+ per square
      MIN_FILL_PERCENTAGE: 97, // 97% minimum fill (97 squares sold)
      MAX_DEAD_SQUARES: 3, // 3 empty squares maximum
      RAKE_PERCENTAGE: 0.08, // 8% house rake
      VIP_BONUS_PERCENTAGE: 0.05, // 5% VIP bonus
      NET_MARGIN_PERCENTAGE: 0.03, // 3% net margin (8% - 5%)
      VIP_ACCESS_REQUIRED: true, // VIP players only
      GUARANTEES_FULL_PAYOUTS: true,
    },
  },

  /**
   * COMMUNITY BOARDS - Payouts based on actual funds raised
   */
  COMMUNITY_BOARDS: {
    MIN_FILL_PERCENTAGE: 95, // 95% minimum fill for all community boards

    /**
     * NON-PREMIUM COMMUNITY BOARDS (<$50 per square)
     */
    NON_PREMIUM: {
      PRICE_THRESHOLD: 50, // Under $50 per square
      TOTAL_RAKE_PERCENTAGE: 0.05, // 5% total rake
      CBL_PERCENTAGE: 0.03, // 3% to CBL
      HOUSE_PERCENTAGE: 0.02, // 2% to House
      VIP_BONUS_PERCENTAGE: 0.03, // 3% VIP bonus (paid from House portion)
    },

    /**
     * PREMIUM MIXED COMMUNITY BOARDS ($50+ per square, VIP + non-VIP players)
     */
    PREMIUM_MIXED: {
      PRICE_THRESHOLD: 50, // $50+ per square
      TOTAL_RAKE_PERCENTAGE: 0.08, // 8% total rake
      CBL_PERCENTAGE: 0.05, // 5% to CBL
      HOUSE_PERCENTAGE: 0.03, // 3% to House
      VIP_BONUS_PERCENTAGE: 0.03, // 3% VIP bonus (paid from House portion)
    },

    /**
     * PREMIUM VIP-ONLY COMMUNITY BOARDS ($50+ per square, VIP players only)
     */
    PREMIUM_VIP_ONLY: {
      PRICE_THRESHOLD: 50, // $50+ per square
      TOTAL_RAKE_PERCENTAGE: 0.1, // 10% total rake
      CBL_PERCENTAGE: 0.05, // 5% to CBL
      HOUSE_PERCENTAGE: 0.02, // 2% to House
      VIP_BONUS_PERCENTAGE: 0.03, // 3% VIP bonus (separate from House portion)
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
  isValidHouseBoardFill(squaresSold: number, pricePerSquare: number): boolean {
    const rules =
      pricePerSquare >= BOARD_RULES.HOUSE_BOARDS.PREMIUM.PRICE_THRESHOLD
        ? BOARD_RULES.HOUSE_BOARDS.PREMIUM
        : BOARD_RULES.HOUSE_BOARDS.STANDARD;
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
  getMaxDeadSquares(pricePerSquare: number): number {
    return pricePerSquare >= BOARD_RULES.HOUSE_BOARDS.PREMIUM.PRICE_THRESHOLD
      ? BOARD_RULES.HOUSE_BOARDS.PREMIUM.MAX_DEAD_SQUARES
      : BOARD_RULES.HOUSE_BOARDS.STANDARD.MAX_DEAD_SQUARES;
  },

  /**
   * Calculate House board net margin
   */
  calculateHouseNetMargin(
    totalRevenue: number,
    pricePerSquare: number,
  ): number {
    const rules =
      pricePerSquare >= BOARD_RULES.HOUSE_BOARDS.PREMIUM.PRICE_THRESHOLD
        ? BOARD_RULES.HOUSE_BOARDS.PREMIUM
        : BOARD_RULES.HOUSE_BOARDS.STANDARD;
    return totalRevenue * rules.NET_MARGIN_PERCENTAGE;
  },

  /**
   * Get Community board rake structure based on price and VIP access
   */
  getCommunityBoardRules(pricePerSquare: number, isVipOnly: boolean) {
    if (
      pricePerSquare < BOARD_RULES.COMMUNITY_BOARDS.NON_PREMIUM.PRICE_THRESHOLD
    ) {
      return BOARD_RULES.COMMUNITY_BOARDS.NON_PREMIUM;
    }
    return isVipOnly
      ? BOARD_RULES.COMMUNITY_BOARDS.PREMIUM_VIP_ONLY
      : BOARD_RULES.COMMUNITY_BOARDS.PREMIUM_MIXED;
  },

  /**
   * Check if House board requires VIP access
   */
  requiresVipAccess(pricePerSquare: number, isHouseBoard: boolean): boolean {
    if (!isHouseBoard) return false;
    return pricePerSquare >= BOARD_RULES.HOUSE_BOARDS.PREMIUM.PRICE_THRESHOLD;
  },
};

/**
 * AGENT QUICK REFERENCE EXAMPLES
 *
 * // Check if House board requires VIP access
 * const requiresVip = BoardRuleValidation.requiresVipAccess(pricePerSquare, true);
 *
 * // Get Community board rake structure
 * const rules = BoardRuleValidation.getCommunityBoardRules(pricePerSquare, isVipOnly);
 * const cblShare = fundsRaised * rules.CBL_PERCENTAGE;
 * const houseShare = fundsRaised * rules.HOUSE_PERCENTAGE;
 *
 * // Check premium house board fill requirement
 * if (pricePerSquare >= 100 && squaresSold < BOARD_RULES.HOUSE_BOARDS.PREMIUM.MIN_FILL_PERCENTAGE) {
 *   throw new Error('Premium House boards require 97% fill minimum');
 * }
 *
 * // Get Q4 payout percentage
 * const q4Payout = playerPool * BOARD_RULES.COMMUNITY_BOARDS.QUARTER_SPLITS.Q4;
 *
 * // Calculate VIP bonus for House boards
 * const vipBonus = winAmount * BOARD_RULES.HOUSE_BOARDS.STANDARD.VIP_BONUS_PERCENTAGE;
 */
