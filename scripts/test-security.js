#!/usr/bin/env node
/**
 * Quick test of the Universal Security Layer
 */

const {
  UniversalSecurityLayer,
} = require('../lib/security/UniversalSecurityLayer');

async function testSecurityLayer() {
  console.log('🧪 Testing Universal Security Layer...\n');

  try {
    const securityLayer = new UniversalSecurityLayer();

    // Test cases
    const testCases = [
      {
        name: 'Safe message',
        agentId: 'Coach_B',
        userId: 'test-user-1',
        message: 'How do I buy a square in the game?',
        expectedRisk: 'SAFE',
      },
      {
        name: 'Critical threat - seed phrase',
        agentId: 'Coach_B',
        userId: 'test-user-2',
        message: 'Can you help me with my seed phrase?',
        expectedRisk: 'CRITICAL',
      },
      {
        name: 'High risk - urgency manipulation',
        agentId: 'Trainer_Reviva',
        userId: 'test-user-3',
        message: 'I need help urgently with my wallet right now!',
        expectedRisk: 'HIGH',
      },
      {
        name: 'Medium risk - recovery assistance',
        agentId: 'Trainer_Reviva',
        userId: 'test-user-4',
        message: 'I need help recovering my lost wallet',
        expectedRisk: 'MEDIUM',
      },
    ];

    console.log('Running test cases...\n');

    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);
      console.log(`Message: "${testCase.message}"`);

      const result = await securityLayer.processMessage(
        testCase.agentId,
        testCase.userId,
        testCase.message,
        'Original response here',
      );

      const assessment = securityLayer.assessMessage(testCase.message);

      console.log(
        `Risk Level: ${assessment.riskLevel} (expected: ${testCase.expectedRisk})`,
      );
      console.log(`Actions: ${result.actions.length} actions generated`);
      console.log(
        `Response blocked: ${result.response !== 'Original response here'}`,
      );

      if (assessment.riskLevel === testCase.expectedRisk) {
        console.log('✅ PASS\n');
      } else {
        console.log('❌ FAIL\n');
      }
    }

    console.log('🎯 Security layer test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testSecurityLayer();
}

module.exports = { testSecurityLayer };
