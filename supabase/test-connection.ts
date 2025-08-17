#!/usr/bin/env ts-node

/**
 * Test script to verify Supabase setup for Football Squares
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

async function testSupabaseSetup() {
  console.log('🧪 Testing Supabase Football Squares Setup\n');

  // Check for required environment variables
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.DATABASE_URL?.match(/https:\/\/[^.]+\.supabase\.co/)?.[0];
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL not found in environment');
    console.log(
      '   Add to .env: SUPABASE_URL=https://[your-project].supabase.co',
    );
    process.exit(1);
  }

  if (!supabaseAnonKey) {
    console.error('❌ SUPABASE_ANON_KEY not found in environment');
    console.log('   Get from: Supabase Dashboard > Settings > API > anon key');
    process.exit(1);
  }

  console.log('✅ Environment variables configured');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Test 1: Check if we can connect
    console.log('\n📊 Test 1: Connection Test');
    const { data: test, error: testError } = await supabase
      .from('boards')
      .select('count')
      .limit(1);

    if (testError) {
      if (
        testError.message.includes('relation "public.boards" does not exist')
      ) {
        console.log('❌ Tables not created yet');
        console.log(
          '   Run the migration scripts in Supabase SQL Editor first!',
        );
      } else {
        console.log('❌ Connection failed:', testError.message);
      }
    } else {
      console.log('✅ Successfully connected to Supabase');
    }

    // Test 2: Check public views
    console.log('\n📊 Test 2: Public Views');
    const { data: boards, error: boardsError } = await supabase
      .from('boards')
      .select('*')
      .limit(5);

    if (boardsError) {
      console.log('❌ Cannot access boards view:', boardsError.message);
    } else {
      console.log(
        `✅ Boards view accessible (${boards?.length || 0} boards found)`,
      );
    }

    // Test 3: Check leaderboard
    console.log('\n📊 Test 3: Leaderboard View');
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(5);

    if (leaderboardError) {
      console.log('❌ Cannot access leaderboard:', leaderboardError.message);
    } else {
      console.log(
        `✅ Leaderboard accessible (${leaderboard?.length || 0} entries)`,
      );
    }

    // Test 4: Check if agents table exists (through RPC if we create one)
    console.log('\n📊 Test 4: Agent Configuration');
    // Note: We can't directly query fsq_private schema from client
    // This would need an RPC function to check
    console.log('⚠️  Agent table check requires service role key');
    console.log('   Verify in Supabase Dashboard > Table Editor');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 DEPLOYMENT STATUS');
    console.log('='.repeat(50));

    if (!boardsError) {
      console.log('✅ Supabase is configured and ready!');
      console.log('\n🎯 Next Steps:');
      console.log('1. Configure SSL in Dashboard > Settings > Database');
      console.log('2. Set up network restrictions for production');
      console.log('3. Enable Point-in-Time Recovery backups');
      console.log('4. Test creating a board with Coach B agent');
    } else {
      console.log('⚠️  Supabase needs configuration');
      console.log('\n📝 Required Actions:');
      console.log('1. Run migration scripts in SQL Editor');
      console.log('2. Verify RLS policies are created');
      console.log('3. Check public views are accessible');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSupabaseSetup().catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
