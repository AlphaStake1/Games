import { DeadSquareRedistributionService } from '../lib/deadSquareRedistribution.js';
import { BOARD_TIERS } from '../lib/boardTypes.js';

function runCommunityBoardTests() {
  console.log('🏘️ Testing Community Board System\n');

  const tier100 = BOARD_TIERS[4]; // $100 tier

  console.log('📊 TEST 1: Community Board - 95% Fill (95 squares sold)');
  const communityBoard95 =
    DeadSquareRedistributionService.createCommunityBoardConfig(
      'community-board-95',
      tier100,
      95,
    );

  console.log(`💰 Funds Raised: $${communityBoard95.fundsRaised}`);
  console.log(
    `🏦 Total Rake (5%): $${communityBoard95.cblRakeShare + communityBoard95.houseRakeShare}`,
  );
  console.log(`👥 CBL Share (3%): $${communityBoard95.cblRakeShare}`);
  console.log(`🏠 House Share (2%): $${communityBoard95.houseRakeShare}`);
  console.log(`🎯 Player Pool: $${communityBoard95.playerPool}`);
  console.log('📈 Quarter Payouts:');
  console.log(`  Q1 (15%): $${communityBoard95.quarterPayouts.q1}`);
  console.log(`  Q2 (25%): $${communityBoard95.quarterPayouts.q2}`);
  console.log(`  Q3 (15%): $${communityBoard95.quarterPayouts.q3}`);
  console.log(`  Q4 (45%): $${communityBoard95.quarterPayouts.q4}\n`);

  console.log('🎯 TEST 2: Dead Square Redistribution (Q2, 95% fill)');
  console.log('Scenario: 3 dead squares hit, 1 winner');
  const redistribution =
    DeadSquareRedistributionService.calculateCommunityRedistribution(
      communityBoard95,
      'q2',
      false,
      3,
      ['0xwinner123'],
    );

  if (redistribution.success && redistribution.redistribution) {
    console.log(
      `✅ Success! Winner gets +$${redistribution.redistribution.perWinnerBonus} bonus`,
    );
    console.log(
      `📈 Original Q2 payout: $${communityBoard95.quarterPayouts.q2}`,
    );
    console.log(
      `🎁 New total payout: $${communityBoard95.quarterPayouts.q2 + redistribution.redistribution.perWinnerBonus}`,
    );
    console.log(
      `💰 Dead square value: $${redistribution.redistribution.deadSquareFunds}`,
    );
    console.log(
      `🏠 House overhead (10%): $${redistribution.redistribution.houseOverheadFee}`,
    );
    console.log(
      `👥 CBL management (5%): $${redistribution.redistribution.cblManagementFee}\n`,
    );
  } else {
    console.log(`❌ Test 2 failed: ${redistribution.error}\n`);
  }

  console.log('📊 TEST 3: Compare Different Fill Levels');

  // Test different fill levels
  const fillLevels = [90, 95, 98, 100];
  fillLevels.forEach((fillLevel) => {
    const board = DeadSquareRedistributionService.createCommunityBoardConfig(
      `community-board-${fillLevel}`,
      tier100,
      fillLevel,
    );

    console.log(`${fillLevel}% Fill (${fillLevel} squares):`);
    console.log(
      `  Funds: $${board.fundsRaised}, Player Pool: $${board.playerPool}, Q4: $${board.quarterPayouts.q4.toFixed(2)}`,
    );
  });

  console.log('\n📊 TEST 4: Agent Message Example');
  if (redistribution.success) {
    console.log(redistribution.agentMessage);
  }

  console.log('\n🔍 TEST 5: Comparison with Legacy Method (100% fill)');
  const legacyResult = DeadSquareRedistributionService.calculateRedistribution(
    'legacy-board',
    tier100,
    'q2',
    false,
    3,
    ['0xwinner123'],
  );

  const fullBoard = DeadSquareRedistributionService.createCommunityBoardConfig(
    'full-board',
    tier100,
    100,
  );

  const newResult =
    DeadSquareRedistributionService.calculateCommunityRedistribution(
      fullBoard,
      'q2',
      false,
      3,
      ['0xwinner123'],
    );

  console.log('Legacy Method (using fixed tier payouts):');
  if (legacyResult.success && legacyResult.redistribution) {
    console.log(
      `  Winner bonus: $${legacyResult.redistribution.perWinnerBonus}`,
    );
  }

  console.log('New Method (using actual funds raised):');
  if (newResult.success && newResult.redistribution) {
    console.log(`  Winner bonus: $${newResult.redistribution.perWinnerBonus}`);
  }

  console.log('\n✅ All Community Board tests completed!');
}

if (require.main === module) {
  runCommunityBoardTests();
}
