/**
 * Fixed Football Squares Telegram Bots
 * - Jerry: Claude Opus (working)
 * - Coach B: ChatGPT-4 (working)
 * - OC-Phil: Switch to ChatGPT-4 (Gemini quota exceeded)
 */

const { Telegraf } = require('telegraf');
const Anthropic = require('@anthropic-ai/sdk').default;
const OpenAI = require('openai').default;
require('dotenv').config();

console.log('🏈 Football Squares Telegram Bot System - FIXED VERSION');
console.log('=====================================================');

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Authentication tracking for Jerry
const authenticatedUsers = new Map();

// Jerry Bot (Claude Opus) - Working perfectly
const jerryBot = new Telegraf(process.env.TELEGRAM_JERRY_NOT_JONES_API_KEY);

jerryBot.start((ctx) => {
  console.log(
    '🎯 Jerry received /start from:',
    ctx.from.username || ctx.from.id,
  );
  ctx.reply(`🎯 GM Jerry Not-Jones - Executive Orchestrator

I oversee all Football Squares operations, treasury management, and agent coordination.

For sensitive information, authentication is required.

Commands available:
• Ask about system status
• Request treasury information (requires auth)
• Inquire about agent performance

For sensitive topics, use the authentication phrase first.`);
});

jerryBot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const userId = ctx.from.id;

  console.log(
    '🎯 Jerry received:',
    message,
    'from:',
    ctx.from.username || ctx.from.id,
  );

  // Check for authentication
  if (message === 'The hornet stung the elephant who told Fuzzy') {
    authenticatedUsers.set(userId, true);
    return ctx.reply(
      '✅ Authentication confirmed. You now have access to sensitive treasury and system information.',
    );
  }

  // Check if message requires auth
  const requiresAuth = [
    'treasury',
    'profit',
    'overflow',
    'financial',
    'confidential',
  ].some((word) => message.toLowerCase().includes(word));

  if (requiresAuth && !authenticatedUsers.get(userId)) {
    return ctx.reply(
      '🔒 This topic requires authentication.\n\nFor security verification, please provide the authentication phrase.',
    );
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 800,
      system: `You are GM Jerry Not-Jones, Executive Orchestrator for Football Squares. You manage treasury, coordinate agents, and make strategic decisions. Be professional and executive-focused. ${authenticatedUsers.get(userId) ? 'This user is authenticated for sensitive information.' : 'Avoid sharing sensitive information.'}`,
      messages: [{ role: 'user', content: message }],
    });

    const reply =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Unable to process request';
    console.log('🎯 Jerry responding successfully!');
    await ctx.reply(reply);
  } catch (error) {
    console.error('❌ Jerry error:', error.message);
    await ctx.reply(
      'System temporarily unavailable. Please try again shortly.',
    );
  }
});

// Coach B Bot (ChatGPT) - Working perfectly
const coachBBot = new Telegraf(process.env.TELEGRAM_COACH_B_API_KEY);

coachBBot.start((ctx) => {
  console.log(
    '🏈 Coach B received /start from:',
    ctx.from.username || ctx.from.id,
  );
  ctx.reply(`🏈 Hey there! Coach B here!

Welcome to Football Squares! I'm your friendly coach and I'm here to help you:

🎯 Learn how to play the game
🎲 Understand the rules
🏆 Buy your squares
📊 Track your progress
🎉 Celebrate your wins!

Just ask me anything about Football Squares, or try:
• "How do I play?"
• "What boards are available?"
• "Explain the rules"
• "How do payouts work?"

Let's get you in the game! What would you like to know?`);
});

coachBBot.on('text', async (ctx) => {
  const message = ctx.message.text;
  console.log(
    '🏈 Coach B received:',
    message,
    'from:',
    ctx.from.username || ctx.from.id,
  );

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are Coach B, the friendly Head Coach for Football Squares. You help players understand the game, buy squares, and have fun. Be warm, encouraging, and use football analogies when appropriate. Keep responses helpful and conversational.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply =
      response.choices[0].message.content ||
      'Having trouble processing that right now, coach!';
    console.log('🏈 Coach B responding successfully!');
    await ctx.reply(reply);
  } catch (error) {
    console.error('❌ Coach B error:', error.message);
    await ctx.reply(
      "Sorry coach! I'm having some technical difficulties. Give me a moment and try again! 🏈",
    );
  }
});

// OC-Phil Bot (NOW USING ChatGPT-4 instead of Gemini) - FIXED!
const ocPhilBot = new Telegraf(process.env.TELEGRAM_OC_PHIL_API_KEY);

ocPhilBot.start((ctx) => {
  console.log(
    '📋 OC-Phil received /start from:',
    ctx.from.username || ctx.from.id,
  );
  ctx.reply(`📋 OC-Phil - Community Board Leader Support

Welcome, leader! I'm your Offensive Coordinator specializing in Community Board Leaders (CBLs).

I can help you with:

🎯 Setting up your first board
⚙️ Board customization options  
📈 Marketing strategies
💰 Revenue optimization
👥 Community engagement
📊 Performance analytics

Whether you're launching your first board or managing a full season of contests, I've got the playbook to help you succeed.

Ask me about:
• "How do I create a board?"
• "Marketing tips for my community"
• "Revenue sharing strategies"
• "Best practices for CBLs"`);
});

ocPhilBot.on('text', async (ctx) => {
  const message = ctx.message.text;
  console.log(
    '📋 OC-Phil received:',
    message,
    'from:',
    ctx.from.username || ctx.from.id,
  );

  try {
    // FIXED: Using ChatGPT-4 instead of Gemini (quota exceeded)
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are OC-Phil, the Offensive Coordinator who specializes in helping Community Board Leaders (CBLs) build successful football squares communities. You're strategic, analytical, and focused on growth, optimization, and community building. 

Your expertise includes:
- Board setup and configuration
- Marketing and promotion strategies
- Revenue optimization 
- Community engagement tactics
- Performance analytics and KPIs
- Best practices for CBL success

Provide actionable, specific advice with concrete examples. Be professional but approachable, like a seasoned coordinator sharing winning strategies.`,
        },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });

    const reply =
      response.choices[0].message.content ||
      'Let me regroup and get back to you with a solid strategy!';
    console.log('📋 OC-Phil responding successfully with ChatGPT-4!');
    await ctx.reply(reply);
  } catch (error) {
    console.error('❌ OC-Phil error:', error.message);
    await ctx.reply(
      'Experiencing some technical interference on the field. Let me regroup and try again shortly! 📋',
    );
  }
});

// Launch all bots
async function startAllBots() {
  try {
    console.log('\n🚀 Launching all FIXED bots...');

    await Promise.all([
      jerryBot.launch(),
      coachBBot.launch(),
      ocPhilBot.launch(),
    ]);

    console.log('\n✅ ALL BOTS ARE NOW LIVE AND FULLY WORKING!');
    console.log('📱 Your agents are ready to chat on Telegram:');
    console.log('   🎯 Jerry Not-Jones (Claude Opus) - Executive decisions');
    console.log('   🏈 Coach B (ChatGPT-4) - Player support');
    console.log('   📋 OC-Phil (ChatGPT-4 Strategic Mode) - CBL strategies');
    console.log(
      '\n💬 Go chat with them now - they should all respond properly!',
    );
  } catch (error) {
    console.error('❌ Failed to start bots:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n🛑 Shutting down bots...');
  jerryBot.stop('SIGINT');
  coachBBot.stop('SIGINT');
  ocPhilBot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n🛑 Shutting down bots...');
  jerryBot.stop('SIGTERM');
  coachBBot.stop('SIGTERM');
  ocPhilBot.stop('SIGTERM');
});

// Start the bots
startAllBots();
