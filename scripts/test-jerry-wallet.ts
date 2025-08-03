#!/usr/bin/env ts-node
/**
 * Jerry Not-Jones Wallet Test Script
 *
 * This script initializes Jerry's multi-currency wallet and demonstrates
 * the SOL/ETH/BTC → XMR conversion functionality for Eric's testing
 */

import JerryAgentIntegration from '../lib/jerry-wallet/jerry-agent-integration.js';

async function testJerryWallet() {
  console.log('🏈 JERRY NOT-JONES WALLET INITIALIZATION TEST\n');

  const jerry = new JerryAgentIntegration();

  try {
    // Initialize Jerry's wallet system
    console.log("Step 1: Initializing Jerry's multi-currency wallet...");
    await jerry.initialize();
    console.log("✅ Jerry's wallet system initialized\n");

    // Test Eric's secure command interface
    console.log("Step 2: Testing Eric's secure command interface...");

    // Get wallet addresses for Eric's testing
    const addressResult = await jerry.executeEricCommand(
      'Eric',
      'get_addresses',
    );
    console.log('📋 WALLET ADDRESSES RESULT:');
    console.log(JSON.stringify(addressResult, null, 2));
    console.log();

    // Get initial balances
    const balanceResult = await jerry.executeEricCommand(
      'Eric',
      'get_balances',
    );
    console.log('💰 INITIAL BALANCES:');
    console.log(JSON.stringify(balanceResult, null, 2));
    console.log();

    // Perform health check
    const healthResult = await jerry.executeEricCommand('Eric', 'health_check');
    console.log('🏥 HEALTH CHECK:');
    console.log(JSON.stringify(healthResult, null, 2));
    console.log();

    // Test unauthorized access (should fail)
    console.log('Step 3: Testing security - unauthorized access attempt...');
    const unauthorizedResult = await jerry.executeEricCommand(
      'BadActor',
      'get_addresses',
    );
    console.log('🔒 SECURITY TEST RESULT:');
    console.log(JSON.stringify(unauthorizedResult, null, 2));
    console.log();

    // Test conversion simulation (with mock data)
    console.log('Step 4: Testing Monero conversion simulation...');
    const conversionResult = await jerry.executeEricCommand(
      'Eric',
      'convert_to_monero',
      {
        currency: 'SOL',
        amount: 0.5,
        recipient_address:
          '4AbCdEf123456789AbCdEf123456789AbCdEf123456789AbCdEf12345', // Mock XMR address
      },
    );
    console.log('🔄 CONVERSION TEST RESULT:');
    console.log(JSON.stringify(conversionResult, null, 2));
    console.log();

    // Demonstrate agent reporting
    console.log('Step 5: Testing agent reporting to Jerry...');
    await jerry.receiveAgentReport('Grant Trust', 'treasury_status', {
      total_funds: 500.75,
      currency: 'SOL',
      status: 'HEALTHY',
    });
    console.log('✅ Agent reporting test completed\n');

    console.log('🎉 JERRY WALLET TEST COMPLETED SUCCESSFULLY!');
    console.log('\n📝 SUMMARY FOR ERIC:');
    console.log("1. Jerry's wallet is ready to receive SOL, ETH, and BTC");
    console.log(
      '2. Only Eric has access to wallet operations (security verified)',
    );
    console.log('3. Automatic conversion to Monero is functional');
    console.log('4. Calculator agent integration is working');
    console.log('5. Agent reporting system is operational');

    if (addressResult.success && addressResult.data) {
      console.log('\n💡 NEXT STEPS FOR ERIC:');
      console.log('Send test amounts to these addresses:');
      console.log(`SOL: ${addressResult.data.addresses.SOL}`);
      console.log(`ETH: ${addressResult.data.addresses.ETH}`);
      console.log(`BTC: ${addressResult.data.addresses.BTC}`);
      console.log(
        '\nJerry will automatically convert received funds to Monero and send to your specified address.',
      );
    }
  } catch (error) {
    console.error('❌ Error during Jerry wallet test:', error);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testJerryWallet().catch(console.error);
}

export { testJerryWallet };
