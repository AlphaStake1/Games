/**
 * Test script for Telegram bots
 * Verifies bot tokens and sends test messages
 */

import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

// Load environment variables
dotenv.config({ path: '../.env' });

interface BotTest {
  name: string;
  token: string | undefined;
  username?: string;
}

const bots: BotTest[] = [
  {
    name: 'Jerry Not-Jones',
    token: process.env.TELEGRAM_JERRY_NOT_JONES_API_KEY,
    username: 'JerryNotJonesBot',
  },
  {
    name: 'Coach B',
    token: process.env.TELEGRAM_COACH_B_API_KEY,
    username: 'CoachBFSQBot',
  },
  {
    name: 'OC-Phil',
    token: process.env.TELEGRAM_OC_PHIL_API_KEY,
    username: 'OCPhilBot',
  },
];

async function testBot(bot: BotTest) {
  console.log(`\n📱 Testing ${bot.name}...`);

  if (!bot.token) {
    console.error(`  ❌ No token found for ${bot.name}`);
    return false;
  }

  try {
    const telegraf = new Telegraf(bot.token);

    // Get bot info
    const botInfo = await telegraf.telegram.getMe();
    console.log(`  ✅ Bot connected: @${botInfo.username}`);
    console.log(`     Name: ${botInfo.first_name}`);
    console.log(`     Can join groups: ${botInfo.can_join_groups}`);
    console.log(
      `     Can read messages: ${botInfo.can_read_all_group_messages}`,
    );

    // Check if username matches expected
    if (bot.username && botInfo.username !== bot.username) {
      console.warn(
        `  ⚠️  Username mismatch! Expected @${bot.username}, got @${botInfo.username}`,
      );
    }

    // Get webhook info
    const webhookInfo = await telegraf.telegram.getWebhookInfo();
    if (webhookInfo.url) {
      console.log(`  📡 Webhook URL: ${webhookInfo.url}`);
      console.log(`     Pending updates: ${webhookInfo.pending_update_count}`);
      if (webhookInfo.last_error_message) {
        console.error(`  ⚠️  Last error: ${webhookInfo.last_error_message}`);
      }
    } else {
      console.log(`  📨 Using long polling (no webhook set)`);
    }

    return true;
  } catch (error: any) {
    console.error(`  ❌ Failed to connect: ${error.message}`);
    if (error.response?.description) {
      console.error(`     API Error: ${error.response.description}`);
    }
    return false;
  }
}

async function testAIConnections() {
  console.log('\n🤖 Testing AI API Connections...');

  const apis = [
    {
      name: 'Claude (Anthropic)',
      hasKey: !!process.env.ANTHROPIC_API_KEY,
      keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10),
    },
    {
      name: 'ChatGPT (OpenAI)',
      hasKey: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10),
    },
    {
      name: 'Gemini (Google)',
      hasKey: !!process.env.GOOGLE_AI_API_KEY,
      keyPrefix: process.env.GOOGLE_AI_API_KEY?.substring(0, 10),
    },
  ];

  apis.forEach((api) => {
    if (api.hasKey) {
      console.log(`  ✅ ${api.name}: Key present (${api.keyPrefix}...)`);
    } else {
      console.log(`  ❌ ${api.name}: No API key found`);
    }
  });
}

async function main() {
  console.log('🏈 Football Squares Telegram Bot Test Suite');
  console.log('===========================================');

  // Test each bot
  let successCount = 0;
  for (const bot of bots) {
    const success = await testBot(bot);
    if (success) successCount++;
  }

  // Test AI connections
  await testAIConnections();

  // Summary
  console.log('\n📊 Test Summary');
  console.log('===============');
  console.log(`  Bots tested: ${bots.length}`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Failed: ${bots.length - successCount}`);

  if (successCount === bots.length) {
    console.log('\n✅ All bots are properly configured!');
    console.log('\n🚀 To start the bots, run: npm start');
  } else {
    console.log('\n⚠️  Some bots are not properly configured.');
    console.log('Please check your bot tokens in the .env file.');
  }

  // Bot setup instructions
  console.log('\n📝 Bot Setup Instructions:');
  console.log('==========================');
  console.log('1. Create bots with @BotFather on Telegram');
  console.log('2. Get the bot tokens and add to .env file');
  console.log('3. Set bot commands with @BotFather:');
  console.log('   Jerry: /status /treasury /agents /help');
  console.log('   Coach B: /help /boards /mygames');
  console.log('   OC-Phil: /help /create /revenue');
  console.log('4. Configure bot profile pictures and descriptions');
  console.log('5. Run npm start to launch all bots');
}

main().catch(console.error);
