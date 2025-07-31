// agents/Calculator/index.ts
/**
 * Calculator Agent - Deterministic TypeScript Service
 *
 * Pure deterministic service for all Football Squares mathematical operations.
 * No LLM - just TypeScript with unit tests for auditability.
 *
 * Called via RPC by other agents for:
 * - Green-points math
 * - Rake distribution
 * - Seasonal leaderboard splits
 * - Payout calculations
 */

import { EventEmitter } from 'events';
import { MEMORY_SCOPES, MemoryScope } from '../../lib/memory/scopes';

// Game configuration constants
export const GAME_CONFIG = {
  BOARD_SIZE: 10,
  TOTAL_SQUARES: 100,
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4', 'FINAL'] as const,
  DEFAULT_RAKE_PERCENTAGE: 0.05, // 5% house rake
  MIN_ENTRY_FEE: 0.01, // Minimum 0.01 SOL
  MAX_ENTRY_FEE: 10.0, // Maximum 10 SOL
} as const;

export type Quarter = (typeof GAME_CONFIG.QUARTERS)[number];

export interface BoardSquare {
  index: number;
  homeDigit: number;
  awayDigit: number;
  owner?: string; // wallet address
  paidAmount: number;
}

export interface GameScore {
  home: number;
  away: number;
  quarter: Quarter;
}

export interface PayoutDistribution {
  quarter: Quarter;
  percentage: number;
}

export interface CalculationResult {
  success: boolean;
  result?: any;
  error?: string;
  metadata: {
    calculationType: string;
    timestamp: Date;
    boardId?: string;
  };
}

export class CalculatorAgent extends EventEmitter {
  private readonly defaultPayoutDistribution: PayoutDistribution[] = [
    { quarter: 'Q1', percentage: 0.15 }, // 15% for Q1
    { quarter: 'Q2', percentage: 0.25 }, // 25% for Q2
    { quarter: 'Q3', percentage: 0.15 }, // 15% for Q3
    { quarter: 'Q4', percentage: 0.35 }, // 35% for Q4 (includes final)
    { quarter: 'FINAL', percentage: 0.1 }, // 10% bonus for final score
  ];

  constructor() {
    super();
    console.log('Calculator Agent initialized - deterministic math service');
  }

  /**
   * Calculate winning square index based on score digits
   */
  calculateWinningSquare(
    homeScore: number,
    awayScore: number,
    homeHeaders: number[],
    awayHeaders: number[],
  ): CalculationResult {
    try {
      const homeDigit = homeScore % 10;
      const awayDigit = awayScore % 10;

      const homeIndex = homeHeaders.indexOf(homeDigit);
      const awayIndex = awayHeaders.indexOf(awayDigit);

      if (homeIndex === -1 || awayIndex === -1) {
        return {
          success: false,
          error: 'Invalid header configuration or score digit not found',
          metadata: {
            calculationType: 'winning_square',
            timestamp: new Date(),
          },
        };
      }

      const winningSquareIndex = awayIndex * GAME_CONFIG.BOARD_SIZE + homeIndex;

      return {
        success: true,
        result: {
          winningSquareIndex,
          homeDigit,
          awayDigit,
          homeIndex,
          awayIndex,
        },
        metadata: {
          calculationType: 'winning_square',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Calculation error: ${error}`,
        metadata: {
          calculationType: 'winning_square',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Calculate total pot and rake distribution
   */
  calculatePotDistribution(
    squares: BoardSquare[],
    rakePercentage: number = GAME_CONFIG.DEFAULT_RAKE_PERCENTAGE,
  ): CalculationResult {
    try {
      const totalPot = squares.reduce(
        (sum, square) => sum + square.paidAmount,
        0,
      );
      const rakeAmount = totalPot * rakePercentage;
      const playerPot = totalPot - rakeAmount;

      return {
        success: true,
        result: {
          totalPot,
          rakeAmount,
          playerPot,
          rakePercentage,
          squareCount: squares.length,
          averageSquareValue: totalPot / squares.length,
        },
        metadata: {
          calculationType: 'pot_distribution',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Pot calculation error: ${error}`,
        metadata: {
          calculationType: 'pot_distribution',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Calculate quarterly payouts based on distribution percentages
   */
  calculateQuarterlyPayouts(
    playerPot: number,
    payoutDistribution: PayoutDistribution[] = this.defaultPayoutDistribution,
  ): CalculationResult {
    try {
      // Validate distribution percentages sum to 1.0
      const totalPercentage = payoutDistribution.reduce(
        (sum, dist) => sum + dist.percentage,
        0,
      );
      if (Math.abs(totalPercentage - 1.0) > 0.001) {
        return {
          success: false,
          error: `Payout distribution must sum to 1.0, got ${totalPercentage}`,
          metadata: {
            calculationType: 'quarterly_payouts',
            timestamp: new Date(),
          },
        };
      }

      const quarterlyPayouts = payoutDistribution.map((dist) => ({
        quarter: dist.quarter,
        amount: playerPot * dist.percentage,
        percentage: dist.percentage,
      }));

      return {
        success: true,
        result: {
          quarterlyPayouts,
          totalPlayerPot: playerPot,
          distribution: payoutDistribution,
        },
        metadata: {
          calculationType: 'quarterly_payouts',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Quarterly payout calculation error: ${error}`,
        metadata: {
          calculationType: 'quarterly_payouts',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Calculate winner payout for specific quarter
   */
  calculateWinnerPayout(
    winningSquareIndex: number,
    squares: BoardSquare[],
    quarterlyAmount: number,
  ): CalculationResult {
    try {
      const winningSquare = squares.find(
        (square) => square.index === winningSquareIndex,
      );

      if (!winningSquare) {
        return {
          success: false,
          error: `No square found at index ${winningSquareIndex}`,
          metadata: {
            calculationType: 'winner_payout',
            timestamp: new Date(),
          },
        };
      }

      if (!winningSquare.owner) {
        return {
          success: false,
          error: `Winning square ${winningSquareIndex} has no owner`,
          metadata: {
            calculationType: 'winner_payout',
            timestamp: new Date(),
          },
        };
      }

      return {
        success: true,
        result: {
          winnerAddress: winningSquare.owner,
          payoutAmount: quarterlyAmount,
          winningSquareIndex,
          squareValue: winningSquare.paidAmount,
          roi: quarterlyAmount / winningSquare.paidAmount, // Return on investment
        },
        metadata: {
          calculationType: 'winner_payout',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Winner payout calculation error: ${error}`,
        metadata: {
          calculationType: 'winner_payout',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Calculate seasonal leaderboard points
   */
  calculateLeaderboardPoints(
    wins: number,
    totalWinnings: number,
    gamesParticipated: number,
  ): CalculationResult {
    try {
      // Points algorithm: base points for wins + bonus for winnings + participation bonus
      const basePoints = wins * 100;
      const winningsBonus = Math.floor(totalWinnings * 10); // 10 points per SOL won
      const participationBonus = gamesParticipated * 5; // 5 points per game participated

      const totalPoints = basePoints + winningsBonus + participationBonus;
      const averageWinnings =
        gamesParticipated > 0 ? totalWinnings / gamesParticipated : 0;
      const winRate = gamesParticipated > 0 ? wins / gamesParticipated : 0;

      return {
        success: true,
        result: {
          totalPoints,
          breakdown: {
            basePoints,
            winningsBonus,
            participationBonus,
          },
          stats: {
            wins,
            totalWinnings,
            gamesParticipated,
            averageWinnings,
            winRate,
          },
        },
        metadata: {
          calculationType: 'leaderboard_points',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Leaderboard calculation error: ${error}`,
        metadata: {
          calculationType: 'leaderboard_points',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Generate board square coordinates from index
   */
  getSquareCoordinates(index: number): CalculationResult {
    try {
      if (index < 0 || index >= GAME_CONFIG.TOTAL_SQUARES) {
        return {
          success: false,
          error: `Invalid square index: ${index}. Must be 0-99`,
          metadata: {
            calculationType: 'square_coordinates',
            timestamp: new Date(),
          },
        };
      }

      const row = Math.floor(index / GAME_CONFIG.BOARD_SIZE);
      const col = index % GAME_CONFIG.BOARD_SIZE;

      return {
        success: true,
        result: {
          index,
          row,
          col,
          coordinates: `(${row}, ${col})`,
        },
        metadata: {
          calculationType: 'square_coordinates',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Coordinate calculation error: ${error}`,
        metadata: {
          calculationType: 'square_coordinates',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Validate game configuration
   */
  validateGameConfig(
    entryFee: number,
    rakePercentage: number,
    payoutDistribution: PayoutDistribution[],
  ): CalculationResult {
    try {
      const errors: string[] = [];

      // Validate entry fee
      if (
        entryFee < GAME_CONFIG.MIN_ENTRY_FEE ||
        entryFee > GAME_CONFIG.MAX_ENTRY_FEE
      ) {
        errors.push(
          `Entry fee ${entryFee} outside valid range ${GAME_CONFIG.MIN_ENTRY_FEE}-${GAME_CONFIG.MAX_ENTRY_FEE}`,
        );
      }

      // Validate rake percentage
      if (rakePercentage < 0 || rakePercentage > 0.2) {
        // Max 20% rake
        errors.push(
          `Rake percentage ${rakePercentage} outside valid range 0-0.2`,
        );
      }

      // Validate payout distribution
      const totalPct = payoutDistribution.reduce(
        (sum, dist) => sum + dist.percentage,
        0,
      );
      if (Math.abs(totalPct - 1.0) > 0.001) {
        errors.push(`Payout distribution sums to ${totalPct}, expected 1.0`);
      }

      const validQuarters = Object.values(GAME_CONFIG.QUARTERS);
      for (const dist of payoutDistribution) {
        if (!validQuarters.includes(dist.quarter)) {
          errors.push(`Invalid quarter: ${dist.quarter}`);
        }
        if (dist.percentage < 0 || dist.percentage > 1) {
          errors.push(
            `Invalid percentage for ${dist.quarter}: ${dist.percentage}`,
          );
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          error: `Validation errors: ${errors.join(', ')}`,
          metadata: {
            calculationType: 'game_config_validation',
            timestamp: new Date(),
          },
        };
      }

      return {
        success: true,
        result: {
          valid: true,
          entryFee,
          rakePercentage,
          payoutDistribution,
        },
        metadata: {
          calculationType: 'game_config_validation',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Validation error: ${error}`,
        metadata: {
          calculationType: 'game_config_validation',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Health check for Calculator service
   */
  healthCheck(): CalculationResult {
    try {
      // Run a simple calculation to verify functionality
      const testResult = this.calculateWinningSquare(
        14,
        7,
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      );

      return {
        success: testResult.success,
        result: {
          status: 'healthy',
          version: '1.0.0',
          capabilities: [
            'winning_square',
            'pot_distribution',
            'quarterly_payouts',
            'winner_payout',
            'leaderboard_points',
            'square_coordinates',
            'game_config_validation',
          ],
        },
        metadata: {
          calculationType: 'health_check',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check failed: ${error}`,
        metadata: {
          calculationType: 'health_check',
          timestamp: new Date(),
        },
      };
    }
  }
}

export default CalculatorAgent;
