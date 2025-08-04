import { BoardTier, PayoutStructure } from '@/lib/boardTypes';

/**
 * COMMUNITY BOARD SYSTEM - Dead Square Economics
 *
 * Community boards operate with dynamic payouts based on actual funds raised:
 *
 * 1. RAKE STRUCTURE: Always 5% of total funds raised
 *    - CBL gets: 3% of total pool
 *    - House gets: 2% of total pool
 *
 * 2. PAYOUT CALCULATION: Based on remaining player pool after rake
 *    - Q1: 15% of player pool
 *    - Q2: 25% of player pool
 *    - Q3: 15% of player pool
 *    - Q4: 45% of player pool
 *
 * 3. EXAMPLE ($100 tier, 95% fill):
 *    - Funds Raised: 95 × $100 = $9,500
 *    - Rake (5%): $475 (CBL: $285, House: $190)
 *    - Player Pool: $9,025
 *    - Q1: $1,353.75, Q2: $2,256.25, Q3: $1,353.75, Q4: $4,061.25
 *
 * 4. DEAD SQUARE REDISTRIBUTION: 10% House, 5% CBL, 85% to players
 */

export interface CommunityBoardConfiguration {
  boardId: string;
  boardType: 'community';
  tier: BoardTier;
  squaresSold: number;
  fundsRaised: number;
  communityRakeRate: number; // 5% for all community boards
  cblRakeShare: number; // 3% of total pool (60% of rake)
  houseRakeShare: number; // 2% of total pool (40% of rake)
  playerPool: number; // fundsRaised - totalRake
  quarterPayouts: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
}

export interface DeadSquareRedistribution {
  boardId: string;
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  isOvertime: boolean;
  deadSquareCount: number;
  deadSquareFunds: number;
  quarterWinners: string[];
  perWinnerBonus: number;
  houseOverheadFee: number;
  cblManagementFee: number;
  totalRedistributed: number;
  redistributionDetails: RedistributionDetails;
  timestamp: number;
}

export interface RedistributionDetails {
  originalPayout: number;
  deadSquareValue: number;
  houseOverheadRate: number;
  cblManagementRate: number;
  netRedistribution: number;
  perWinnerAmount: number;
  remainderToHouse: number;
}

export interface RedistributionResult {
  success: boolean;
  redistribution?: DeadSquareRedistribution;
  agentMessage: string;
  error?: string;
}

export class DeadSquareRedistributionService {
  private static readonly HOUSE_OVERHEAD_RATE = 0.1; // 10% house fee
  private static readonly CBL_MANAGEMENT_RATE = 0.05; // 5% CBL fee
  private static readonly MIN_REDISTRIBUTION_THRESHOLD = 1; // $1 minimum

  // Community Board constants
  private static readonly COMMUNITY_RAKE_RATE = 0.05; // 5% total rake
  private static readonly CBL_RAKE_SHARE = 0.03; // 3% of total pool (60% of rake)
  private static readonly HOUSE_RAKE_SHARE = 0.02; // 2% of total pool (40% of rake)

  static createCommunityBoardConfig(
    boardId: string,
    tier: BoardTier,
    squaresSold: number,
  ): CommunityBoardConfiguration {
    const fundsRaised = squaresSold * tier.pricePerSquare;
    const totalRake = fundsRaised * this.COMMUNITY_RAKE_RATE;
    const cblRakeAmount = fundsRaised * this.CBL_RAKE_SHARE;
    const houseRakeAmount = fundsRaised * this.HOUSE_RAKE_SHARE;
    const playerPool = fundsRaised - totalRake;

    return {
      boardId,
      boardType: 'community',
      tier,
      squaresSold,
      fundsRaised,
      communityRakeRate: this.COMMUNITY_RAKE_RATE,
      cblRakeShare: cblRakeAmount,
      houseRakeShare: houseRakeAmount,
      playerPool,
      quarterPayouts: {
        q1: playerPool * 0.15, // 15%
        q2: playerPool * 0.25, // 25%
        q3: playerPool * 0.15, // 15%
        q4: playerPool * 0.45, // 45%
      },
    };
  }

  static calculateCommunityRedistribution(
    communityBoard: CommunityBoardConfiguration,
    quarter: 'q1' | 'q2' | 'q3' | 'q4',
    isOvertime: boolean,
    deadSquareCount: number,
    quarterWinners: string[],
  ): RedistributionResult {
    try {
      if (deadSquareCount === 0 || quarterWinners.length === 0) {
        return {
          success: false,
          error: 'No dead squares or winners to redistribute',
          agentMessage:
            'No redistribution needed - no dead squares hit in this quarter.',
        };
      }

      const deadSquareFunds =
        deadSquareCount * communityBoard.tier.pricePerSquare;
      const originalPayout = communityBoard.quarterPayouts[quarter];

      const houseOverheadFee =
        Math.round(deadSquareFunds * this.HOUSE_OVERHEAD_RATE * 100) / 100;
      const cblManagementFee =
        Math.round(deadSquareFunds * this.CBL_MANAGEMENT_RATE * 100) / 100;

      const netRedistribution =
        deadSquareFunds - houseOverheadFee - cblManagementFee;
      const perWinnerAmount =
        Math.floor((netRedistribution / quarterWinners.length) * 100) / 100;
      const remainderToHouse =
        Math.round(
          (netRedistribution - perWinnerAmount * quarterWinners.length) * 100,
        ) / 100;

      const totalRedistributed =
        perWinnerAmount * quarterWinners.length + remainderToHouse;

      if (perWinnerAmount < this.MIN_REDISTRIBUTION_THRESHOLD) {
        return {
          success: false,
          error: 'Redistribution amount too small',
          agentMessage: `Dead square funds ($${deadSquareFunds}) too small to redistribute meaningfully. Adding to next quarter pool.`,
        };
      }

      const redistributionDetails: RedistributionDetails = {
        originalPayout,
        deadSquareValue: deadSquareFunds,
        houseOverheadRate: this.HOUSE_OVERHEAD_RATE,
        cblManagementRate: this.CBL_MANAGEMENT_RATE,
        netRedistribution,
        perWinnerAmount,
        remainderToHouse,
      };

      const redistribution: DeadSquareRedistribution = {
        boardId: communityBoard.boardId,
        quarter,
        isOvertime,
        deadSquareCount,
        deadSquareFunds,
        quarterWinners,
        perWinnerBonus: perWinnerAmount,
        houseOverheadFee,
        cblManagementFee,
        totalRedistributed,
        redistributionDetails,
        timestamp: Date.now(),
      };

      const agentMessage = this.generateAgentMessage(redistribution);

      return {
        success: true,
        redistribution,
        agentMessage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        agentMessage:
          'Error calculating dead square redistribution. Please contact support.',
      };
    }
  }

  private static getQuarterPayout(
    payouts: PayoutStructure,
    quarter: string,
    isOvertime: boolean,
  ): number {
    const key = isOvertime ? `${quarter}Overtime` : `${quarter}Regular`;
    return (payouts as any)[key] || 0;
  }

  private static generateAgentMessage(
    redistribution: DeadSquareRedistribution,
  ): string {
    const quarterDisplay = redistribution.isOvertime
      ? `${redistribution.quarter.toUpperCase()} Overtime`
      : redistribution.quarter.toUpperCase();

    return (
      `🎯 ${quarterDisplay} DEAD SQUARE REDISTRIBUTION\n\n` +
      `${redistribution.deadSquareCount} dead squares hit this quarter!\n` +
      `Redistributing $${redistribution.deadSquareFunds} among ${redistribution.quarterWinners.length} winners.\n\n` +
      `💰 BONUS: +$${redistribution.perWinnerBonus} each winner\n` +
      `📊 Breakdown:\n` +
      `• Dead Square Value: $${redistribution.deadSquareFunds}\n` +
      `• House Processing (10%): $${redistribution.houseOverheadFee}\n` +
      `• CBL Management (5%): $${redistribution.cblManagementFee}\n` +
      `• Player Distribution: $${(redistribution.perWinnerBonus * redistribution.quarterWinners.length).toFixed(2)}\n\n` +
      `Winners receive their regular payout PLUS the bonus! 🚀`
    );
  }

  // Legacy method for backwards compatibility
  static calculateRedistribution(
    boardId: string,
    tier: BoardTier,
    quarter: 'q1' | 'q2' | 'q3' | 'q4',
    isOvertime: boolean,
    deadSquareCount: number,
    quarterWinners: string[],
  ): RedistributionResult {
    // Create a mock community board with 100% fill for legacy compatibility
    const communityBoard = this.createCommunityBoardConfig(boardId, tier, 100);
    return this.calculateCommunityRedistribution(
      communityBoard,
      quarter,
      isOvertime,
      deadSquareCount,
      quarterWinners,
    );
  }

  static simulateRedistribution(
    tier: BoardTier,
    deadSquareCount: number,
    winnerCount: number,
  ): {
    deadSquareFunds: number;
    perWinnerBonus: number;
    houseTotal: number;
    cblTotal: number;
    netToPlayers: number;
  } {
    const deadSquareFunds = deadSquareCount * tier.pricePerSquare;
    const houseTotal =
      Math.round(deadSquareFunds * this.HOUSE_OVERHEAD_RATE * 100) / 100;
    const cblTotal =
      Math.round(deadSquareFunds * this.CBL_MANAGEMENT_RATE * 100) / 100;
    const netRedistribution = deadSquareFunds - houseTotal - cblTotal;
    const perWinnerBonus =
      Math.floor((netRedistribution / winnerCount) * 100) / 100;
    const netToPlayers = perWinnerBonus * winnerCount;

    return {
      deadSquareFunds,
      perWinnerBonus,
      houseTotal,
      cblTotal,
      netToPlayers,
    };
  }
}

export interface QuarterResult {
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  isOvertime: boolean;
  homeScore: number;
  awayScore: number;
  winners: string[];
  winningNumbers: { home: number; away: number };
  deadSquaresHit: number[];
  redistributionApplied?: DeadSquareRedistribution;
}

export class BoardResultProcessor {
  static processQuarterResult(
    boardId: string,
    tier: BoardTier,
    quarterResult: QuarterResult,
    boardSquares: { [squareIndex: string]: string | null },
  ): QuarterResult {
    const { homeScore, awayScore, quarter, isOvertime } = quarterResult;

    const homeLastDigit = homeScore % 10;
    const awayLastDigit = awayScore % 10;

    const winningSquareIndex = homeLastDigit * 10 + awayLastDigit;
    const winningWallet = boardSquares[winningSquareIndex.toString()];

    const winners = winningWallet ? [winningWallet] : [];

    const deadSquares = Object.entries(boardSquares)
      .filter(([_, wallet]) => wallet === null)
      .map(([index, _]) => parseInt(index));

    const deadSquaresHit = deadSquares.filter(
      (square) => square === winningSquareIndex,
    );

    let redistributionApplied: DeadSquareRedistribution | undefined;

    if (deadSquaresHit.length > 0 && winners.length > 0) {
      const redistributionResult =
        DeadSquareRedistributionService.calculateRedistribution(
          boardId,
          tier,
          quarter,
          isOvertime,
          deadSquaresHit.length,
          winners,
        );

      if (redistributionResult.success) {
        redistributionApplied = redistributionResult.redistribution;
      }
    }

    return {
      ...quarterResult,
      winners,
      winningNumbers: { home: homeLastDigit, away: awayLastDigit },
      deadSquaresHit,
      redistributionApplied,
    };
  }
}
