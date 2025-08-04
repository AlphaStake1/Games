import { DeadSquareRedistributionService } from '../lib/deadSquareRedistribution.js';
import { BOARD_TIERS } from '../lib/boardTypes.js';

function runRedistributionTests() {
  console.log('🧪 Testing Dead Square Redistribution System\n');

  const tier5 = BOARD_TIERS[0]; // $5 tier
  const tier100 = BOARD_TIERS[4]; // $100 tier

  console.log('📊 TEST 1: Basic $5 tier redistribution');
  console.log('Scenario: 5 dead squares hit, 1 winner in Q1');
  const test1 = DeadSquareRedistributionService.calculateRedistribution(
    'board-123',
    tier5,
    'q1',
    false,
    5,
    ['0x123winner'],
  );

  if (test1.success && test1.redistribution) {
    console.log(
      `✅ Success! Winner gets +$${test1.redistribution.perWinnerBonus} bonus`,
    );
    console.log(`📈 Original Q1 payout: $${tier5.payouts.q1Regular}`);
    console.log(
      `🎁 New total payout: $${tier5.payouts.q1Regular + test1.redistribution.perWinnerBonus}`,
    );
    console.log(
      `🏠 House fees: $${test1.redistribution.houseOverheadFee + test1.redistribution.cblManagementFee}\n`,
    );
  } else {
    console.log(`❌ Test 1 failed: ${test1.error}\n`);
  }

  console.log('📊 TEST 2: High-value $100 tier redistribution');
  console.log('Scenario: 3 dead squares hit, 2 winners in Q4');
  const test2 = DeadSquareRedistributionService.calculateRedistribution(
    'board-456',
    tier100,
    'q4',
    false,
    3,
    ['0x123winner1', '0x456winner2'],
  );

  if (test2.success && test2.redistribution) {
    console.log(
      `✅ Success! Each winner gets +$${test2.redistribution.perWinnerBonus} bonus`,
    );
    console.log(`📈 Original Q4 payout: $${tier100.payouts.q4Regular}`);
    console.log(
      `🎁 New total per winner: $${tier100.payouts.q4Regular + test2.redistribution.perWinnerBonus}`,
    );
    console.log(
      `💰 Total dead square value: $${test2.redistribution.deadSquareFunds}`,
    );
    console.log(
      `🏠 Total fees: $${test2.redistribution.houseOverheadFee + test2.redistribution.cblManagementFee}\n`,
    );
  } else {
    console.log(`❌ Test 2 failed: ${test2.error}\n`);
  }

  console.log('📊 TEST 3: Edge case - Small redistribution');
  console.log('Scenario: 1 dead square hit, 10 winners (tiny bonus)');
  const test3 = DeadSquareRedistributionService.calculateRedistribution(
    'board-789',
    tier5,
    'q2',
    false,
    1,
    Array.from({ length: 10 }, (_, i) => `0xwinner${i}`),
  );

  if (test3.success && test3.redistribution) {
    console.log(
      `✅ Success! Each winner gets +$${test3.redistribution.perWinnerBonus} bonus`,
    );
  } else {
    console.log(`❌ Test 3 failed as expected: ${test3.error}`);
    console.log(
      `ℹ️  This is expected behavior for very small redistributions\n`,
    );
  }

  console.log('📊 TEST 4: Simulation for different scenarios');
  console.log('Simulating various dead square counts for $100 tier:\n');

  [1, 3, 5, 10].forEach((deadCount) => {
    const sim = DeadSquareRedistributionService.simulateRedistribution(
      tier100,
      deadCount,
      1,
    );
    console.log(
      `${deadCount} dead squares → Winner bonus: $${sim.perWinnerBonus} (House: $${sim.houseTotal}, CBL: $${sim.cblTotal})`,
    );
  });

  console.log('\n🎯 Agent Message Example:');
  if (test2.success) {
    console.log(test2.agentMessage);
  }

  console.log('\n✅ All tests completed!');
}

if (require.main === module) {
  runRedistributionTests();
}
