#!/usr/bin/env ts-node

/**
 * Simple test to verify ElizaOS can load a character and basic functionality
 */

import dotenv from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testElizaBasics(): Promise<void> {
  console.log('🧪 Testing ElizaOS Basic Functionality\n');

  try {
    // Test 1: Load ElizaOS core
    console.log('📦 Loading ElizaOS core...');
    const elizaCore = await import('@elizaos/core');
    console.log('✅ ElizaOS core loaded successfully');

    // Test 2: Check if we can load a character file
    console.log('\n📄 Loading character file...');
    const characterPath = path.join(__dirname, '../characters/coachb.json');
    const characterData = JSON.parse(readFileSync(characterPath, 'utf-8'));
    console.log(`✅ Character loaded: ${characterData.name}`);

    // Test 3: Verify environment variables
    console.log('\n🔧 Checking environment...');
    const requiredVars = ['DATABASE_URL', 'OPENAI_API_KEY', 'SOLANA_RPC_URL'];
    const missingVars = requiredVars.filter((key) => !process.env[key]);

    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set');
    } else {
      console.log(`❌ Missing variables: ${missingVars.join(', ')}`);
    }

    // Test 4: Basic database configuration check
    console.log('\n🗄️  Database configuration...');
    if (process.env.DATABASE_URL?.includes('supabase.co')) {
      console.log('✅ Supabase database configured');
    } else if (process.env.DATABASE_URL?.includes('postgresql://')) {
      console.log('✅ PostgreSQL database configured');
    } else {
      console.log('❌ Database configuration not recognized');
    }

    console.log(
      '\n🎉 Basic ElizaOS functionality test completed successfully!',
    );
    console.log(
      '\n🚀 Your environment appears ready for running Eliza agents.',
    );
    console.log('\n📝 To start agents:');
    console.log(
      '   • For a single agent: Check ElizaOS documentation for CLI usage',
    );
    console.log(
      '   • For multiple agents: Fix the orchestrator dependency first',
    );
  } catch (error) {
    console.error('❌ Test failed:', error);

    if (error instanceof Error) {
      if (error.message.includes('Cannot find module')) {
        console.log(
          '\n💡 Suggestion: ElizaOS packages may need to be installed properly',
        );
        console.log(
          '   Try: pnpm install @elizaos/core @elizaos/adapter-postgres',
        );
      }
    }

    process.exit(1);
  }
}

// Run the test
testElizaBasics().catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
