// Simple Calculator Agent - Pure JS version for testing
const { EventEmitter } = require('events');

// Game configuration constants
const GAME_CONFIG = {
  BOARD_SIZE: 10,
  TOTAL_SQUARES: 100,
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4', 'FINAL'],
  DEFAULT_RAKE_PERCENTAGE: 0.05, // 5% house rake
  MIN_ENTRY_FEE: 0.01, // Minimum 0.01 SOL
  MAX_ENTRY_FEE: 10.0, // Maximum 10 SOL
};

class CalculatorAgent extends EventEmitter {
  constructor() {
    super();
    this.defaultPayoutDistribution = [
      { quarter: 'Q1', percentage: 0.15 }, // 15% for Q1
      { quarter: 'Q2', percentage: 0.25 }, // 25% for Q2
      { quarter: 'Q3', percentage: 0.15 }, // 15% for Q3
      { quarter: 'Q4', percentage: 0.35 }, // 35% for Q4 (includes final)
      { quarter: 'FINAL', percentage: 0.1 }, // 10% bonus for final score
    ];
    console.log('Calculator Agent initialized - deterministic math service');
  }

  /**
   * Calculate winning square index based on score digits
   */
  calculateWinningSquare(homeScore, awayScore, homeHeaders, awayHeaders) {
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
   * Health check for Calculator service
   */
  healthCheck() {
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

module.exports = { CalculatorAgent, GAME_CONFIG };
