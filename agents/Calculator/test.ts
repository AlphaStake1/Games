// agents/Calculator/test.ts
/**
 * Unit tests for Calculator Agent
 * Run with: pnpm calculator:test
 */

import { CalculatorAgent, BoardSquare, GAME_CONFIG } from './index';

class TestRunner {
  private calculator: CalculatorAgent;
  private testResults: { name: string; passed: boolean; error?: string }[] = [];

  constructor() {
    this.calculator = new CalculatorAgent();
  }

  private assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(message);
    }
  }

  private runTest(name: string, testFn: () => void) {
    try {
      testFn();
      this.testResults.push({ name, passed: true });
      console.log(`✅ ${name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.testResults.push({ name, passed: false, error: errorMessage });
      console.log(`❌ ${name}: ${errorMessage}`);
    }
  }

  testWinningSquareCalculation() {
    this.runTest('Winning Square Calculation - Basic', () => {
      const homeHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const awayHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      // Test score 14-7 (digits 4-7)
      const result = this.calculator.calculateWinningSquare(
        14,
        7,
        homeHeaders,
        awayHeaders,
      );

      this.assert(result.success, 'Should succeed');
      this.assert(result.result.homeDigit === 4, 'Home digit should be 4');
      this.assert(result.result.awayDigit === 7, 'Away digit should be 7');
      this.assert(
        result.result.winningSquareIndex === 74,
        'Square index should be 74 (7*10 + 4)',
      );
    });

    this.runTest('Winning Square Calculation - Randomized Headers', () => {
      const homeHeaders = [3, 1, 4, 0, 7, 9, 2, 5, 8, 6];
      const awayHeaders = [5, 8, 2, 9, 1, 0, 6, 3, 4, 7];

      // Test score 21-14 (digits 1-4)
      const result = this.calculator.calculateWinningSquare(
        21,
        14,
        homeHeaders,
        awayHeaders,
      );

      this.assert(result.success, 'Should succeed');
      this.assert(result.result.homeDigit === 1, 'Home digit should be 1');
      this.assert(result.result.awayDigit === 4, 'Away digit should be 4');

      const homeIndex = homeHeaders.indexOf(1); // Should be 1
      const awayIndex = awayHeaders.indexOf(4); // Should be 8
      const expectedSquare = awayIndex * 10 + homeIndex;

      this.assert(
        result.result.winningSquareIndex === expectedSquare,
        `Square index should be ${expectedSquare}`,
      );
    });

    this.runTest('Winning Square Calculation - Invalid Headers', () => {
      const homeHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Missing 9
      const awayHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      // Test score 19-7 (digit 9 not in home headers)
      const result = this.calculator.calculateWinningSquare(
        19,
        7,
        homeHeaders,
        awayHeaders,
      );

      this.assert(!result.success, 'Should fail with invalid headers');
      this.assert(
        result.error?.includes('not found') ?? false,
        'Error should mention digit not found',
      );
    });
  }

  testPotDistribution() {
    this.runTest('Pot Distribution - Equal Squares', () => {
      const squares: BoardSquare[] = Array.from({ length: 100 }, (_, i) => ({
        index: i,
        homeDigit: i % 10,
        awayDigit: Math.floor(i / 10),
        owner: `wallet_${i}`,
        paidAmount: 0.1, // 0.1 SOL per square
      }));

      const result = this.calculator.calculatePotDistribution(squares, 0.05);

      this.assert(result.success, 'Should succeed');
      this.assert(
        result.result.totalPot === 10.0,
        'Total pot should be 10 SOL',
      );
      this.assert(
        result.result.rakeAmount === 0.5,
        'Rake should be 0.5 SOL (5%)',
      );
      this.assert(
        result.result.playerPot === 9.5,
        'Player pot should be 9.5 SOL',
      );
    });

    this.runTest('Pot Distribution - Variable Squares', () => {
      const squares: BoardSquare[] = [
        {
          index: 0,
          homeDigit: 0,
          awayDigit: 0,
          owner: 'wallet1',
          paidAmount: 1.0,
        },
        {
          index: 1,
          homeDigit: 1,
          awayDigit: 0,
          owner: 'wallet2',
          paidAmount: 0.5,
        },
        {
          index: 2,
          homeDigit: 2,
          awayDigit: 0,
          owner: 'wallet3',
          paidAmount: 2.0,
        },
      ];

      const result = this.calculator.calculatePotDistribution(squares, 0.1);

      this.assert(result.success, 'Should succeed');
      this.assert(
        result.result.totalPot === 3.5,
        'Total pot should be 3.5 SOL',
      );
      this.assert(
        result.result.rakeAmount === 0.35,
        'Rake should be 0.35 SOL (10%)',
      );
      this.assert(
        result.result.playerPot === 3.15,
        'Player pot should be 3.15 SOL',
      );
    });
  }

  testQuarterlyPayouts() {
    this.runTest('Quarterly Payouts - Default Distribution', () => {
      const playerPot = 100; // 100 SOL
      const result = this.calculator.calculateQuarterlyPayouts(playerPot);

      this.assert(result.success, 'Should succeed');

      const payouts = result.result.quarterlyPayouts;
      this.assert(
        payouts.find((p: any) => p.quarter === 'Q1')?.amount === 15,
        'Q1 should be 15 SOL (15%)',
      );
      this.assert(
        payouts.find((p: any) => p.quarter === 'Q2')?.amount === 25,
        'Q2 should be 25 SOL (25%)',
      );
      this.assert(
        payouts.find((p: any) => p.quarter === 'Q3')?.amount === 15,
        'Q3 should be 15 SOL (15%)',
      );
      this.assert(
        payouts.find((p: any) => p.quarter === 'Q4')?.amount === 35,
        'Q4 should be 35 SOL (35%)',
      );
      this.assert(
        payouts.find((p: any) => p.quarter === 'FINAL')?.amount === 10,
        'FINAL should be 10 SOL (10%)',
      );
    });

    this.runTest('Quarterly Payouts - Invalid Distribution', () => {
      const playerPot = 100;
      const invalidDistribution = [
        { quarter: 'Q1' as const, percentage: 0.3 },
        { quarter: 'Q2' as const, percentage: 0.3 },
        { quarter: 'Q3' as const, percentage: 0.3 }, // Total = 0.9, not 1.0
      ];

      const result = this.calculator.calculateQuarterlyPayouts(
        playerPot,
        invalidDistribution,
      );

      this.assert(!result.success, 'Should fail with invalid distribution');
      this.assert(
        result.error?.includes('sum to 1.0') ?? false,
        'Error should mention distribution sum',
      );
    });
  }

  testWinnerPayout() {
    this.runTest('Winner Payout - Valid Square', () => {
      const squares: BoardSquare[] = [
        {
          index: 74,
          homeDigit: 4,
          awayDigit: 7,
          owner: 'winner_wallet',
          paidAmount: 0.1,
        },
      ];

      const result = this.calculator.calculateWinnerPayout(74, squares, 25.0);

      this.assert(result.success, 'Should succeed');
      this.assert(
        result.result.winnerAddress === 'winner_wallet',
        'Should return correct winner',
      );
      this.assert(
        result.result.payoutAmount === 25.0,
        'Should return correct payout amount',
      );
      this.assert(result.result.roi === 250, 'ROI should be 250x (25/0.1)');
    });

    this.runTest('Winner Payout - Square Not Found', () => {
      const squares: BoardSquare[] = [
        {
          index: 10,
          homeDigit: 0,
          awayDigit: 1,
          owner: 'wallet1',
          paidAmount: 0.1,
        },
      ];

      const result = this.calculator.calculateWinnerPayout(74, squares, 25.0);

      this.assert(!result.success, 'Should fail when square not found');
      this.assert(
        result.error?.includes('No square found') ?? false,
        'Error should mention square not found',
      );
    });

    this.runTest('Winner Payout - Square Has No Owner', () => {
      const squares: BoardSquare[] = [
        { index: 74, homeDigit: 4, awayDigit: 7, paidAmount: 0.1 }, // No owner
      ];

      const result = this.calculator.calculateWinnerPayout(74, squares, 25.0);

      this.assert(!result.success, 'Should fail when square has no owner');
      this.assert(
        result.error?.includes('has no owner') ?? false,
        'Error should mention no owner',
      );
    });
  }

  testLeaderboardPoints() {
    this.runTest('Leaderboard Points - Basic Calculation', () => {
      const result = this.calculator.calculateLeaderboardPoints(5, 12.5, 20);

      this.assert(result.success, 'Should succeed');

      const points = result.result;
      this.assert(
        points.breakdown.basePoints === 500,
        'Base points should be 500 (5 * 100)',
      );
      this.assert(
        points.breakdown.winningsBonus === 125,
        'Winnings bonus should be 125 (12.5 * 10)',
      );
      this.assert(
        points.breakdown.participationBonus === 100,
        'Participation bonus should be 100 (20 * 5)',
      );
      this.assert(points.totalPoints === 725, 'Total points should be 725');
      this.assert(
        points.stats.winRate === 0.25,
        'Win rate should be 0.25 (5/20)',
      );
    });

    this.runTest('Leaderboard Points - Zero Games', () => {
      const result = this.calculator.calculateLeaderboardPoints(0, 0, 0);

      this.assert(result.success, 'Should succeed');
      this.assert(result.result.totalPoints === 0, 'Total points should be 0');
      this.assert(result.result.stats.winRate === 0, 'Win rate should be 0');
      this.assert(
        result.result.stats.averageWinnings === 0,
        'Average winnings should be 0',
      );
    });
  }

  testSquareCoordinates() {
    this.runTest('Square Coordinates - Valid Indices', () => {
      // Test corner squares
      const topLeft = this.calculator.getSquareCoordinates(0);
      this.assert(
        topLeft.success && topLeft.result.row === 0 && topLeft.result.col === 0,
        'Square 0 should be (0,0)',
      );

      const topRight = this.calculator.getSquareCoordinates(9);
      this.assert(
        topRight.success &&
          topRight.result.row === 0 &&
          topRight.result.col === 9,
        'Square 9 should be (0,9)',
      );

      const bottomLeft = this.calculator.getSquareCoordinates(90);
      this.assert(
        bottomLeft.success &&
          bottomLeft.result.row === 9 &&
          bottomLeft.result.col === 0,
        'Square 90 should be (9,0)',
      );

      const bottomRight = this.calculator.getSquareCoordinates(99);
      this.assert(
        bottomRight.success &&
          bottomRight.result.row === 9 &&
          bottomRight.result.col === 9,
        'Square 99 should be (9,9)',
      );

      const middle = this.calculator.getSquareCoordinates(55);
      this.assert(
        middle.success && middle.result.row === 5 && middle.result.col === 5,
        'Square 55 should be (5,5)',
      );
    });

    this.runTest('Square Coordinates - Invalid Indices', () => {
      const negative = this.calculator.getSquareCoordinates(-1);
      this.assert(!negative.success, 'Should fail for negative index');

      const tooLarge = this.calculator.getSquareCoordinates(100);
      this.assert(!tooLarge.success, 'Should fail for index >= 100');
    });
  }

  testGameConfigValidation() {
    this.runTest('Game Config Validation - Valid Config', () => {
      const validDistribution = [
        { quarter: 'Q1' as const, percentage: 0.2 },
        { quarter: 'Q2' as const, percentage: 0.3 },
        { quarter: 'Q3' as const, percentage: 0.2 },
        { quarter: 'Q4' as const, percentage: 0.2 },
        { quarter: 'FINAL' as const, percentage: 0.1 },
      ];

      const result = this.calculator.validateGameConfig(
        1.0,
        0.05,
        validDistribution,
      );

      this.assert(result.success, 'Should succeed with valid config');
      this.assert(
        result.result.valid === true,
        'Config should be marked as valid',
      );
    });

    this.runTest('Game Config Validation - Invalid Entry Fee', () => {
      const validDistribution = [{ quarter: 'Q1' as const, percentage: 1.0 }];

      const tooLow = this.calculator.validateGameConfig(
        0.005,
        0.05,
        validDistribution,
      );
      this.assert(!tooLow.success, 'Should fail with entry fee too low');

      const tooHigh = this.calculator.validateGameConfig(
        15.0,
        0.05,
        validDistribution,
      );
      this.assert(!tooHigh.success, 'Should fail with entry fee too high');
    });

    this.runTest('Game Config Validation - Invalid Rake', () => {
      const validDistribution = [{ quarter: 'Q1' as const, percentage: 1.0 }];

      const negativeRake = this.calculator.validateGameConfig(
        1.0,
        -0.01,
        validDistribution,
      );
      this.assert(!negativeRake.success, 'Should fail with negative rake');

      const tooHighRake = this.calculator.validateGameConfig(
        1.0,
        0.25,
        validDistribution,
      );
      this.assert(!tooHighRake.success, 'Should fail with rake > 20%');
    });
  }

  testHealthCheck() {
    this.runTest('Health Check', () => {
      const result = this.calculator.healthCheck();

      this.assert(result.success, 'Health check should succeed');
      this.assert(
        result.result.status === 'healthy',
        'Status should be healthy',
      );
      this.assert(
        Array.isArray(result.result.capabilities),
        'Should return capabilities array',
      );
      this.assert(
        result.result.capabilities.length > 5,
        'Should have multiple capabilities',
      );
    });
  }

  run() {
    console.log('🧮 Running Calculator Agent Tests...\n');

    this.testWinningSquareCalculation();
    this.testPotDistribution();
    this.testQuarterlyPayouts();
    this.testWinnerPayout();
    this.testLeaderboardPoints();
    this.testSquareCoordinates();
    this.testGameConfigValidation();
    this.testHealthCheck();

    const passed = this.testResults.filter((r) => r.passed).length;
    const total = this.testResults.length;
    const failed = total - passed;

    console.log(`\n📊 Test Results: ${passed}/${total} passed`);

    if (failed > 0) {
      console.log(`❌ ${failed} tests failed`);
      process.exit(1);
    } else {
      console.log('✅ All tests passed!');
      process.exit(0);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run();
}
