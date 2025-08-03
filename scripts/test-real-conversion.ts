#!/usr/bin/env ts-node
/**
 * Jerry Real Conversion Test - 0.04 SOL → XMR
 *
 * Tests the real ChangeNow integration with Eric's 0.05 SOL balance
 * Converts 0.04 SOL to XMR, leaving 0.01 SOL dust in Jerry's wallet
 */

import JerryAgentIntegration from '../lib/jerry-wallet/jerry-agent-integration.js';

async function testRealConversion() {
  console.log('🔄 JERRY REAL CONVERSION TEST - 0.04 SOL → XMR\n');
  console.log("Testing with Eric's actual SOL balance...\n");

  const jerry = new JerryAgentIntegration();

  try {
    // Initialize Jerry's wallet system
    console.log("Step 1: Initializing Jerry's wallet system...");
    await jerry.initialize();
    console.log('✅ Jerry wallet system ready\n');

    // Check current SOL balance
    console.log('Step 2: Checking current balances...');
    const balanceResult = await jerry.executeEricCommand(
      'Eric',
      'get_balances',
    );
    console.log('💰 CURRENT BALANCES:');
    console.log(JSON.stringify(balanceResult, null, 2));
    console.log();

    // Get wallet addresses to show Eric where the SOL is
    const addressResult = await jerry.executeEricCommand(
      'Eric',
      'get_addresses',
    );
    if (addressResult.success && addressResult.data) {
      console.log("📍 JERRY'S SOL ADDRESS:");
      console.log(addressResult.data.addresses.SOL);
      console.log('(This is where Eric sent 0.05 SOL)\n');
    }

    // Test the real conversion: 0.04 SOL → XMR
    console.log('Step 3: Executing REAL conversion - 0.04 SOL → XMR...');
    console.log(
      "🎯 Target: Convert 0.04 SOL, leave 0.01 SOL dust in Jerry's wallet",
    );
    console.log('🏦 Exchange: ChangeNow API');
    console.log("📤 Destination: Eric's XMR address");
    console.log('⏳ Processing...\n');

    const conversionResult = await jerry.executeEricCommand(
      'Eric',
      'convert_to_monero',
      {
        currency: 'SOL',
        amount: 0.04, // Convert 0.04 SOL, leave 0.01 as dust
        recipient_address:
          '82xoX3dQMsJeLhaPtbY9TJUGDDiSQ4b3pcCoYtcy5LLnQ1d2ErFSZE3aY7SBctsKjP1eYoZB5RogKKX9MaL6KjwLFU8MFYK',
      },
    );

    console.log('🔄 CONVERSION RESULT:');
    console.log(JSON.stringify(conversionResult, null, 2));
    console.log();

    if (conversionResult.success) {
      console.log('✅ REAL CONVERSION TEST SUCCESSFUL!');
      console.log('📋 SUMMARY:');
      console.log(`• Original: 0.04 SOL`);
      console.log(
        `• Converted to: ${conversionResult.data?.converted_currency || 'XMR'}`,
      );
      console.log(`• Recipient: Eric's XMR wallet`);
      console.log(
        `• Exchange ID: ${conversionResult.data?.transaction_hash || 'N/A'}`,
      );
      console.log(`• Status: ${conversionResult.data?.status || 'COMPLETED'}`);
      console.log();
      console.log('💰 DUST REMAINING:');
      console.log("• ~0.01 SOL should remain in Jerry's wallet");
      console.log('• Jerry maintains small balance for future operations');
    } else {
      console.log('❌ CONVERSION FAILED:');
      console.log(`Error: ${conversionResult.message}`);
      if (conversionResult.data?.error_details) {
        console.log(`Details: ${conversionResult.data.error_details}`);
      }
    }

    // Final balance check
    console.log('\nStep 4: Checking final balances...');
    const finalBalanceResult = await jerry.executeEricCommand(
      'Eric',
      'get_balances',
    );
    console.log('💰 FINAL BALANCES:');
    console.log(JSON.stringify(finalBalanceResult, null, 2));

    console.log('\n🎉 REAL CONVERSION TEST COMPLETED!');
    console.log('\n📝 NEXT STEPS:');
    console.log("• Check Eric's XMR wallet for incoming transaction");
    console.log('• Monitor ChangeNow exchange status if exchange ID provided');
    console.log('• Verify Jerry retained dust balance for future operations');
  } catch (error) {
    console.error('❌ Error during real conversion test:', error);

    // Still show wallet status for debugging
    try {
      const debugResult = await jerry.executeEricCommand(
        'Eric',
        'wallet_status',
      );
      console.log('\n🔍 DEBUG - WALLET STATUS:');
      console.log(JSON.stringify(debugResult, null, 2));
    } catch (debugError) {
      console.error('Could not get debug info:', debugError);
    }

    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testRealConversion().catch(console.error);
}

export { testRealConversion };
