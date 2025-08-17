#!/usr/bin/env ts-node

/**
 * Test script to verify environment configuration for ElizaOS
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

const results: TestResult[] = [];

function test(
  name: string,
  condition: boolean,
  passMsg: string,
  failMsg: string,
): void {
  results.push({
    name,
    status: condition ? 'pass' : 'fail',
    message: condition ? passMsg : failMsg,
  });
}

function warn(name: string, message: string): void {
  results.push({
    name,
    status: 'warn',
    message,
  });
}

async function testDatabaseConnection(): Promise<boolean> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return false;

  try {
    // Simple connection test using node-postgres
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: dbUrl,
      ssl: dbUrl.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : false,
    });

    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

async function runTests(): Promise<void> {
  console.log('🧪 Testing ElizaOS Environment Configuration\n');

  // Required variables
  test(
    'DATABASE_URL',
    !!process.env.DATABASE_URL,
    '✅ Database URL configured',
    '❌ DATABASE_URL is required',
  );

  test(
    'OPENAI_API_KEY',
    !!process.env.OPENAI_API_KEY,
    '✅ OpenAI API key configured',
    '❌ OPENAI_API_KEY is required',
  );

  test(
    'SOLANA_RPC_URL',
    !!process.env.SOLANA_RPC_URL,
    '✅ Solana RPC URL configured',
    '❌ SOLANA_RPC_URL is required',
  );

  // Platform tokens (at least one needed)
  const platforms = [
    { key: 'DISCORD_BOT_TOKEN', name: 'Discord' },
    { key: 'TELEGRAM_BOT_TOKEN', name: 'Telegram' },
    { key: 'TWITTER_API_KEY', name: 'Twitter' },
  ];

  const configuredPlatforms = platforms.filter((p) => process.env[p.key]);

  if (configuredPlatforms.length > 0) {
    results.push({
      name: 'Platform Tokens',
      status: 'pass',
      message: `✅ Configured: ${configuredPlatforms.map((p) => p.name).join(', ')}`,
    });
  } else {
    warn(
      'Platform Tokens',
      '⚠️  No platform tokens configured - agents will run in internal mode only',
    );
  }

  // Test database connection
  if (process.env.DATABASE_URL) {
    console.log('🔌 Testing database connection...');
    const dbConnected = await testDatabaseConnection();
    test(
      'Database Connection',
      dbConnected,
      '✅ Successfully connected to database',
      '❌ Failed to connect to database',
    );
  }

  // Check for old variables that need updating
  if (process.env.RPC_ENDPOINT && !process.env.SOLANA_RPC_URL) {
    warn(
      'Configuration',
      '⚠️  Found RPC_ENDPOINT - should be renamed to SOLANA_RPC_URL',
    );
  }

  if (process.env.SupaBase_DB && !process.env.DATABASE_URL) {
    warn(
      'Configuration',
      '⚠️  Found SupaBase_DB - should be renamed to DATABASE_URL',
    );
  }

  // Display results
  console.log('\n📋 Test Results:');
  console.log('═'.repeat(50));

  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const warnings = results.filter((r) => r.status === 'warn').length;

  results.forEach((result) => {
    const icon =
      result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${result.name}: ${result.message}`);
  });

  console.log('═'.repeat(50));
  console.log(
    `📊 Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`,
  );

  if (failed === 0) {
    console.log('\n🎉 Environment looks good! Ready to start ElizaOS.');

    if (warnings > 0) {
      console.log(
        '\n💡 Consider addressing the warnings above for optimal setup.',
      );
    }

    console.log('\n🚀 Next steps:');
    console.log('   1. Run: pnpm ts-node scripts/start-eliza-system.ts');
    console.log('   2. Or: ./scripts/start-multi-agents.sh');
  } else {
    console.log('\n🔧 Please fix the failed tests before starting ElizaOS.');
    console.log('\n📝 Quick fixes needed in your .env file:');

    if (!process.env.DATABASE_URL && process.env.SupaBase_DB) {
      console.log(`   DATABASE_URL=${process.env.SupaBase_DB}`);
    }

    if (!process.env.SOLANA_RPC_URL && process.env.RPC_ENDPOINT) {
      console.log(`   SOLANA_RPC_URL=${process.env.RPC_ENDPOINT}`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
