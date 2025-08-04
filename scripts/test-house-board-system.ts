import { HouseBoardSystem } from '../lib/houseBoardSystem.js';
import { BOARD_TIERS } from '../lib/boardTypes.js';

function runHouseBoardTests() {
  console.log('🏠 Testing House Board System\n');

  const tier100 = BOARD_TIERS[4]; // $100 tier for substantial payouts

  console.log('🏗️  Creating House Board Configuration');
  const houseBoardConfig = HouseBoardSystem.createHouseBoardConfig(
    'house-board-456',
    tier100,
  );
  console.log(`✅ House Board created for ${tier100.displayName}`);
  console.log(
    `🎨 NFT Style: ${houseBoardConfig.houseNftStyle.indicatorColor} ${houseBoardConfig.houseNftStyle.indicatorType}\n`,
  );

  // Mock board with 3 dead squares (97% fill - VIP requirement)
  const boardSquares: { [key: string]: string | null } = {};
  for (let i = 0; i < 100; i++) {
    boardSquares[i.toString()] = i < 97 ? `0xplayer${i}` : null; // 97 filled, 3 empty
  }
  const deadSquareIndices = [97, 98, 99]; // The 3 empty squares

  console.log('📊 TEST 1: House Board - Dead Square MISS');
  console.log(
    'Scenario: Q1 ends 17-14, dead squares are [97,98,99], winning square is 74',
  );
  const test1 = HouseBoardSystem.processHouseBoardQuarter(
    houseBoardConfig,
    'q1',
    false,
    17, // Home score
    14, // Away score (winning square = 74, not in dead squares)
    { ...boardSquares },
    deadSquareIndices,
  );

  if (test1.success && test1.result) {
    console.log(`✅ No dead square hit! Player wins normally.`);
    console.log(`💰 Player winnings: $${test1.result.playerWinnings}`);
    console.log(`🏠 House winnings: $${test1.result.houseWinnings}`);
    console.log(`📊 House break-even: ${test1.result.houseBreakEven}`);
    console.log(`🎯 Dead squares remain: ${test1.result.deadSquareCount}\n`);
  } else {
    console.log(`❌ Test 1 failed: ${test1.error}\n`);
  }

  console.log('📊 TEST 2: House Board - Dead Square HIT!');
  console.log(
    'Scenario: Q2 ends 23-27, dead squares are [97,98,99], winning square is 37... wait, that is not dead',
  );
  console.log('Let me try: Q2 ends 19-27, winning square is 97 (dead square!)');
  const test2 = HouseBoardSystem.processHouseBoardQuarter(
    houseBoardConfig,
    'q2',
    false,
    19, // Home score
    27, // Away score (winning square = 97, which IS in dead squares!)
    { ...boardSquares },
    deadSquareIndices,
  );

  if (test2.success && test2.result) {
    console.log(`🎯 DEAD SQUARE HIT! House wins the quarter!`);
    console.log(`💰 Player winnings: $${test2.result.playerWinnings}`);
    console.log(`🏠 House winnings: $${test2.result.houseWinnings}`);
    console.log(`📊 House break-even: ${test2.result.houseBreakEven}`);
    console.log(
      `🔶 Backfilled squares: [${test2.result.backfilledSquares.join(', ')}]`,
    );
    console.log(`📈 House profit/loss: $${test2.result.houseProfitLoss}\n`);
  } else {
    console.log(`❌ Test 2 failed: ${test2.error}\n`);
  }

  console.log('📊 TEST 3: Q4 Big Payout Dead Square Hit');
  console.log('Scenario: Q4 ends 29-29, winning square is 99 (dead square!)');
  console.log('Dead squares are now [97,98,99] for VIP boards (97% fill)');
  const test3 = HouseBoardSystem.processHouseBoardQuarter(
    houseBoardConfig,
    'q4',
    false,
    29, // Home score
    29, // Away score (winning square = 99, which IS dead!)
    { ...boardSquares },
    deadSquareIndices,
  );

  if (test3.success && test3.result) {
    console.log(`🎯 Q4 DEAD SQUARE HIT! Massive House win!`);
    console.log(`💰 Player winnings: $${test3.result.playerWinnings}`);
    console.log(
      `🏠 House winnings: $${test3.result.houseWinnings} (Q4 big payout!)`,
    );
    console.log(
      `🔶 Backfilled squares: [${test3.result.backfilledSquares.join(', ')}]\n`,
    );
  } else {
    console.log(`❌ Test 3 failed: ${test3.error}\n`);
  }

  console.log('📊 House Board Risk Analysis (VIP - 3 dead squares):');
  const riskAnalysis = HouseBoardSystem.simulateHouseBoardScenarios(tier100, 3);
  riskAnalysis.forEach((scenario) => {
    console.log(
      `${scenario.scenario}: Risk $${scenario.houseRisk} for ${scenario.probabilityOfHouseWin}% chance to win $${scenario.housePotentialWin}`,
    );
  });

  console.log('\n🎨 CSS Styles for House NFTs:');
  console.log(
    HouseBoardSystem.getHouseNftCssStyles(houseBoardConfig.houseNftStyle),
  );

  console.log('\n🎯 Agent Message Examples:');
  if (test1.success && test1.result) {
    console.log('--- HOUSE MISS ---');
    console.log(test1.result.agentMessage);
  }
  if (test2.success && test2.result) {
    console.log('\n--- HOUSE WIN ---');
    console.log(test2.result.agentMessage);
  }

  console.log('\n✅ All House Board tests completed!');
}

if (require.main === module) {
  runHouseBoardTests();
}
