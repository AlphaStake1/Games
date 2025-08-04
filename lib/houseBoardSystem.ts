import { BoardTier, PayoutStructure } from '@/lib/boardTypes';

/**
 * HOUSE BOARD SYSTEM - Dead Square Economics
 *
 * House boards operate with a fundamentally different economic model:
 *
 * 1. GUARANTEED LOSS MODEL: House is guaranteed to lose their full rake (8% for VIP tiers)
 *    if no dead squares hit during the game.
 *
 * 2. RECOVERY OPPORTUNITY: If a dead square hits, House recovers significantly more than
 *    their guaranteed loss by claiming that quarter's payout + not paying VIP bonus.
 *
 * 3. VIP ECONOMICS EXAMPLE ($100 tier):
 *    - Total Revenue: $10,000 (100 squares × $100)
 *    - House Rake: $800 (8%)
 *    - VIP Bonus Cost: $500 (5% of $10,000)
 *    - Net House Margin: $300 (3%)
 *    - Player Pool: $9,200 (guaranteed payouts)
 *    - Required Fill: 97% (only 3 empty squares max to preserve margin)
 *
 * 4. RECOVERY EXAMPLES (3 dead squares):
 *    - Q1/Q3 hit: Recover $1,380 + $69 VIP bonus = $1,449 vs $300 loss = +$1,149 profit
 *    - Q2 hit: Recover $2,300 + $115 VIP bonus = $2,415 vs $300 loss = +$2,115 profit
 *    - Q4 hit: Recover $4,140 + $207 VIP bonus = $4,347 vs $300 loss = +$4,047 profit
 *
 * 5. PROBABILITY: 3% chance per quarter (3 dead squares / 100 total squares)
 */

export interface HouseBoardConfiguration {
  boardId: string;
  boardType: 'house';
  tier: BoardTier;
  houseRakePercentage: number; // 8% for VIP tiers
  maxDeadSquares: number; // 3 for 97% fill on VIP boards
  guaranteedPayouts: boolean; // Always true for House boards
  houseNftStyle: HouseNftStyle;
  vipBonusRate: number; // 5% extra for VIP players
}

export interface HouseNftStyle {
  indicatorType: 'circle' | 'border' | 'badge';
  indicatorColor: string; // '#FF6B35' (orange)
  indicatorSize: 'small' | 'medium' | 'large';
  opacity: number; // 0.8 for subtle but visible
}

export interface HouseDeadSquareResult {
  boardId: string;
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  isOvertime: boolean;
  deadSquareCount: number;
  deadSquareHit: boolean;
  winningSquareIndex?: number;
  houseWinnings: number;
  playerWinnings: number;
  houseBreakEven: boolean;
  backfilledSquares: number[];
  houseProfitLoss: number;
  agentMessage: string;
  timestamp: number;
}

export interface HouseBoardOutcome {
  success: boolean;
  result?: HouseDeadSquareResult;
  error?: string;
}

export class HouseBoardSystem {
  private static readonly DEFAULT_HOUSE_RAKE = 0.08; // 8% for VIP tiers
  private static readonly VIP_BONUS_RATE = 0.05; // 5% VIP bonus
  private static readonly MAX_DEAD_SQUARES = 3; // For 97% fill on VIP boards
  private static readonly HOUSE_NFT_IDENTIFIER = 'HOUSE_NFT';

  private static readonly DEFAULT_HOUSE_NFT_STYLE: HouseNftStyle = {
    indicatorType: 'circle',
    indicatorColor: '#FF6B35', // Orange
    indicatorSize: 'medium',
    opacity: 0.8,
  };

  static createHouseBoardConfig(
    boardId: string,
    tier: BoardTier,
    customNftStyle?: Partial<HouseNftStyle>,
  ): HouseBoardConfiguration {
    return {
      boardId,
      boardType: 'house',
      tier,
      houseRakePercentage: this.DEFAULT_HOUSE_RAKE,
      maxDeadSquares: this.MAX_DEAD_SQUARES,
      guaranteedPayouts: true,
      vipBonusRate: this.VIP_BONUS_RATE,
      houseNftStyle: {
        ...this.DEFAULT_HOUSE_NFT_STYLE,
        ...customNftStyle,
      },
    };
  }

  static processHouseBoardQuarter(
    houseBoardConfig: HouseBoardConfiguration,
    quarter: 'q1' | 'q2' | 'q3' | 'q4',
    isOvertime: boolean,
    homeScore: number,
    awayScore: number,
    boardSquares: { [squareIndex: string]: string | null },
    deadSquareIndices: number[],
  ): HouseBoardOutcome {
    try {
      const homeLastDigit = homeScore % 10;
      const awayLastDigit = awayScore % 10;
      const winningSquareIndex = homeLastDigit * 10 + awayLastDigit;

      const quarterPayout = this.getQuarterPayout(
        houseBoardConfig.tier.payouts,
        quarter,
        isOvertime,
      );

      const deadSquareHit = deadSquareIndices.includes(winningSquareIndex);
      const deadSquareCount = deadSquareIndices.length;

      let houseWinnings = 0;
      let playerWinnings = quarterPayout;
      let houseProfitLoss = -quarterPayout; // House pays full winnings by default
      let backfilledSquares: number[] = [];

      if (deadSquareHit) {
        houseWinnings = quarterPayout;
        playerWinnings = 0;
        houseProfitLoss = quarterPayout - quarterPayout; // House wins the quarter, breaks even on guarantee

        backfilledSquares = deadSquareIndices.filter(
          (idx) => idx !== winningSquareIndex,
        );

        backfilledSquares.forEach((squareIdx) => {
          boardSquares[squareIdx.toString()] = this.HOUSE_NFT_IDENTIFIER;
        });
      }

      const houseBreakEven = !deadSquareHit;

      const result: HouseDeadSquareResult = {
        boardId: houseBoardConfig.boardId,
        quarter,
        isOvertime,
        deadSquareCount,
        deadSquareHit,
        winningSquareIndex: deadSquareHit ? winningSquareIndex : undefined,
        houseWinnings,
        playerWinnings,
        houseBreakEven,
        backfilledSquares,
        houseProfitLoss,
        agentMessage: this.generateHouseAgentMessage({
          boardId: houseBoardConfig.boardId,
          quarter,
          isOvertime,
          deadSquareCount,
          deadSquareHit,
          winningSquareIndex: deadSquareHit ? winningSquareIndex : undefined,
          houseWinnings,
          playerWinnings,
          houseBreakEven,
          backfilledSquares,
          houseProfitLoss,
          agentMessage: '',
          timestamp: Date.now(),
        }),
        timestamp: Date.now(),
      };

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error in House board processing',
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

  private static generateHouseAgentMessage(
    result: HouseDeadSquareResult,
  ): string {
    const quarterDisplay = result.isOvertime
      ? `${result.quarter.toUpperCase()} Overtime`
      : result.quarter.toUpperCase();

    if (result.deadSquareHit) {
      return (
        `🏠 ${quarterDisplay} HOUSE BOARD WIN!\n\n` +
        `🎯 Dead square ${result.winningSquareIndex} hit!\n` +
        `🏆 House wins the entire ${quarterDisplay} payout: $${result.houseWinnings}\n\n` +
        `🔶 House NFTs now fill ${result.backfilledSquares.length} remaining empty squares\n` +
        `📊 Board Status: House claimed this quarter\n\n` +
        `Players: This was the House's risk/reward for guaranteeing full payouts! 🎲`
      );
    } else {
      return (
        `💰 ${quarterDisplay} HOUSE BOARD PAYOUT\n\n` +
        `✅ Player wins! No dead squares hit this quarter.\n` +
        `💸 House pays full winnings: $${result.playerWinnings}\n` +
        `📊 House Status: Break-even (as expected)\n\n` +
        `🎯 ${result.deadSquareCount} dead squares remain in play for future quarters.`
      );
    }
  }

  static simulateHouseBoardScenarios(
    tier: BoardTier,
    deadSquareCount: number = 3,
  ): {
    scenario: string;
    quarterPayout: number;
    houseRisk: number;
    housePotentialWin: number;
    probabilityOfHouseWin: number;
  }[] {
    const scenarios = [
      { quarter: 'q1', key: 'q1Regular' },
      { quarter: 'q2', key: 'q2Regular' },
      { quarter: 'q3', key: 'q3Regular' },
      { quarter: 'q4', key: 'q4Regular' },
    ];

    return scenarios.map(({ quarter, key }) => {
      const payout = (tier.payouts as any)[key];
      const probabilityOfHouseWin = deadSquareCount / 100; // 5% chance if 5 dead squares

      return {
        scenario: quarter.toUpperCase(),
        quarterPayout: payout,
        houseRisk: payout, // House risks paying this amount
        housePotentialWin: payout, // House could win this amount
        probabilityOfHouseWin: probabilityOfHouseWin * 100, // As percentage
      };
    });
  }

  static getHouseNftCssStyles(houseNftStyle: HouseNftStyle): string {
    const { indicatorType, indicatorColor, indicatorSize, opacity } =
      houseNftStyle;

    const sizeMap = {
      small: '2px',
      medium: '3px',
      large: '4px',
    };

    switch (indicatorType) {
      case 'circle':
        return `
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: -${sizeMap[indicatorSize]};
            right: -${sizeMap[indicatorSize]};
            bottom: -${sizeMap[indicatorSize]};
            left: -${sizeMap[indicatorSize]};
            border: ${sizeMap[indicatorSize]} solid ${indicatorColor};
            border-radius: 50%;
            opacity: ${opacity};
            pointer-events: none;
          }
        `;
      case 'border':
        return `
          border: ${sizeMap[indicatorSize]} solid ${indicatorColor} !important;
          opacity: ${opacity};
        `;
      case 'badge':
        return `
          position: relative;
          &::before {
            content: '🏠';
            position: absolute;
            top: -8px;
            right: -8px;
            background: ${indicatorColor};
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: ${opacity};
            z-index: 1;
          }
        `;
      default:
        return '';
    }
  }

  static isHouseNft(walletAddress: string): boolean {
    return walletAddress === this.HOUSE_NFT_IDENTIFIER;
  }

  static getHouseBoardStats(results: HouseDeadSquareResult[]): {
    totalQuarters: number;
    houseWins: number;
    houseWinRate: number;
    totalHousePayout: number;
    totalHouseWinnings: number;
    netHousePosition: number;
  } {
    const totalQuarters = results.length;
    const houseWins = results.filter((r) => r.deadSquareHit).length;
    const totalHousePayout = results.reduce(
      (sum, r) => sum + r.playerWinnings,
      0,
    );
    const totalHouseWinnings = results.reduce(
      (sum, r) => sum + r.houseWinnings,
      0,
    );

    return {
      totalQuarters,
      houseWins,
      houseWinRate: (houseWins / totalQuarters) * 100,
      totalHousePayout,
      totalHouseWinnings,
      netHousePosition: totalHouseWinnings - totalHousePayout,
    };
  }
}
