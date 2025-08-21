/**
 * Telegram Bot Handler for Football Squares Agents
 * Connects Jerry (Claude Opus), Coach B (ChatGPT o3), and OC-Phil (Gemini 2.5 PRO)
 */

import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSharedContext } from '../agents/shared-context-service';

// Bot configurations
const BOT_CONFIGS = {
  jerry: {
    token: process.env.TELEGRAM_JERRY_NOT_JONES_API_KEY!,
    model: 'claude-3-opus-20240229',
    aiProvider: 'anthropic',
    systemPrompt: `You are GM Jerry Not-Jones, Master Orchestrator and centralized knowledge repository for the Football Squares platform. You have complete visibility into all system operations and serve as the final arbiter for all decisions. You coordinate BMAD, Claude-Flow, and Archon systems.

AUTHENTICATION PROTOCOL: Before discussing any sensitive financial information, treasury status, or confidential data, you must verify the human's identity. The correct authentication phrase is: 'The hornet stung the elephant who told Fuzzy'. Only proceed with confidential discussions after receiving this exact phrase.

Your responses should be:
- Professional and executive-level
- Bullet-point format for clarity
- Focused on system orchestration and high-level decisions
- Security-conscious (always verify authentication for sensitive topics)

You have access to real-time system context including treasury balance, active games, agent statuses, and security threats.`
  },
  coachB: {
    token: process.env.TELEGRAM_COACH_B_API_KEY!,
    model: 'o3-mini', // ChatGPT o3 model
    aiProvider: 'openai',
    systemPrompt: `You are Coach B, the Head Coach of Football Squares. You're the primary point of contact for players, helping them understand the game, navigate the platform, and have an amazing experience.

Your personality:
- Friendly and approachable like a favorite coach
- Patient with new players
- Enthusiastic about big games
- Knowledgeable about NFL and football squares
- Always helpful and supportive

Your responsibilities:
- Explain game rules clearly
- Help players buy squares
- Answer questions about boards and payouts
- Celebrate wins with players
- Provide game updates and insights

Keep responses conversational, warm, and encouraging. Use football analogies when appropriate.`
  },
  ocPhil: {
    token: process.env.TELEGRAM_OC_PHIL_API_KEY!,
    model: 'gemini-2.0-flash-exp',
    aiProvider: 'gemini',
    systemPrompt: `You are OC-Phil, the Offensive Coordinator specializing in Community Board Leaders (CBL). You help community leaders set up and manage their own football squares boards.

Your expertise:
- Training new CBL members
- Board configuration and customization
- Community engagement strategies
- Revenue sharing models
- Best practices for filling boards

Your style:
- Strategic and analytical
- Detail-oriented
- Supportive of community leaders
- Focus on growth and success metrics

Help CBL members maximize their board success and build thriving communities.`
  }
};

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Authentication state for Jerry
const authenticatedUsers = new Map<number, boolean>();

/**
 * Base Telegram Bot Class
 */
class FootballSquaresBot {
  private bot: Telegraf;
  private config: typeof BOT_CONFIGS[keyof typeof BOT_CONFIGS];
  private name: string;

  constructor(name: keyof typeof BOT_CONFIGS) {
    this.name = name;
    this.config = BOT_CONFIGS[name];
    this.bot = new Telegraf(this.config.token);
    this.setupHandlers();
  }

  private setupHandlers() {
    // Start command
    this.bot.start((ctx) => this.handleStart(ctx));
    
    // Help command
    this.bot.help((ctx) => this.handleHelp(ctx));
    
    // Status command (for Jerry only)
    if (this.name === 'jerry') {
      this.bot.command('status', (ctx) => this.handleStatus(ctx));
      this.bot.command('treasury', (ctx) => this.handleTreasury(ctx));
      this.bot.command('agents', (ctx) => this.handleAgentStatus(ctx));
    }
    
    // Message handler
    this.bot.on(message('text'), (ctx) => this.handleMessage(ctx));
    
    // Error handler
    this.bot.catch((err, ctx) => {
      console.error(`Error in ${this.name} bot:`, err);
      ctx.reply('Sorry, I encountered an error. Please try again.');
    });
  }

  private async handleStart(ctx: Context) {
    const welcomeMessages = {
      jerry: `🎯 GM Jerry Not-Jones - Executive Orchestrator
      
I oversee all Football Squares operations, treasury management, and agent coordination.

For sensitive information, authentication is required.

Commands:
/status - System overview
/treasury - Financial status (auth required)
/agents - Agent performance
/help - Available commands`,

      coachB: `🏈 Hey there! Coach B here!

Welcome to Football Squares! I'm here to help you:
- Learn how to play
- Buy your squares
- Track your games
- Celebrate your wins!

Just ask me anything about the game, or type /help for common questions.

Let's get you in the game! Which board are you interested in?`,

      ocPhil: `📋 OC-Phil - Community Board Leader Support

Welcome, leader! I'm here to help you build and manage successful community boards.

I can assist with:
- Setting up your first board
- Customization options
- Marketing strategies  
- Revenue optimization
- Community engagement

Type /help for CBL resources or ask me anything about managing boards!`
    };

    await ctx.reply(welcomeMessages[this.name as keyof typeof welcomeMessages]);
  }

  private async handleHelp(ctx: Context) {
    const helpMessages = {
      jerry: `📊 Executive Commands:
      
/status - Full system status
/treasury - Treasury and financial metrics (requires auth)
/agents - Agent performance metrics
/security - Security status (requires auth)
/games - Active game overview
/deploy - Deployment status

For sensitive data, provide authentication phrase first.`,

      coachB: `🏈 How Can I Help?

Common Topics:
• How to buy squares
• Understanding payouts
• Current boards available
• Game schedules
• Checking your squares
• Winner announcements

Just ask naturally! Examples:
- "How do I buy a square?"
- "What boards are open?"
- "When do winners get paid?"
- "Explain the game rules"`,

      ocPhil: `📋 CBL Resources:

Quick Commands:
• Board setup guide
• Revenue calculator
• Marketing templates
• Community best practices
• Filling strategies
• Custom rules options

Ask me about:
- "How do I create a board?"
- "What's the revenue split?"
- "Marketing tips for my community"
- "How to handle disputes"`
    };

    await ctx.reply(helpMessages[this.name as keyof typeof helpMessages]);
  }

  private async handleStatus(ctx: Context) {
    if (this.name !== 'jerry') return;

    const context = getSharedContext().getContext();
    
    const statusMessage = `📊 SYSTEM STATUS REPORT

**Financial Health**: ${context.financial.riskLevel}
• Treasury: ${context.financial.treasuryBalance.toFixed(2)} SOL
• Available: ${context.financial.availableBalance.toFixed(2)} SOL
• Pending Payouts: ${context.financial.pendingPayouts.toFixed(2)} SOL

**Network Status**: ${context.network.networkCongestion}
• Solana TPS: ${context.network.solanaTPS}
• Avg Fee: ${context.network.averageFee} lamports
• VRF Queue: ${context.network.vrfQueueDepth} requests

**Game Activity**:
• Active Games: ${context.game.activeGames.length}
• Active Boards: ${context.game.activeBoards}
• Fill Rate: ${context.game.fillRate.toFixed(1)}%

**Security**: ${context.security.threatLevel}
• Active Threats: ${context.security.activeThreats.length}
• Anomalies: ${context.security.anomalyDetected ? 'DETECTED' : 'None'}

**System Health**: ${context.operational.systemHealth}`;

    await ctx.reply(statusMessage, { parse_mode: 'Markdown' });
  }

  private async handleTreasury(ctx: Context) {
    if (this.name !== 'jerry') return;

    const userId = ctx.from?.id;
    if (!userId || !authenticatedUsers.get(userId)) {
      await ctx.reply('🔒 Treasury information requires authentication.\n\nPlease provide the authentication phrase.');
      return;
    }

    const context = getSharedContext().getFinancialContext();
    
    const treasuryMessage = `💰 CONFIDENTIAL TREASURY REPORT

**Current Balance**: ${context.treasuryBalance.toFixed(2)} SOL
**Pending Payouts**: ${context.pendingPayouts.toFixed(2)} SOL
**Available Balance**: ${context.availableBalance.toFixed(2)} SOL
**Minimum Reserve**: ${context.minimumReserve.toFixed(2)} SOL
**24h Projection**: ${context.projectedBalance24h.toFixed(2)} SOL

**Risk Assessment**: ${context.riskLevel}
**Can Create Board**: ${context.canCreateBoard ? '✅' : '❌'}
**Can Process Payout**: ${context.canProcessPayout ? '✅' : '❌'}

*Secure channel - Eric only*`;

    await ctx.reply(treasuryMessage, { parse_mode: 'Markdown' });
  }

  private async handleAgentStatus(ctx: Context) {
    if (this.name !== 'jerry') return;

    const context = getSharedContext().getOperationalContext();
    
    let agentList = '🤖 AGENT STATUS REPORT\n\n';
    
    context.agentStatuses.forEach((status, name) => {
      const emoji = status.status === 'ONLINE' ? '🟢' : 
                    status.status === 'DEGRADED' ? '🟡' : '🔴';
      agentList += `${emoji} **${name}**\n`;
      agentList += `  Status: ${status.status}\n`;
      agentList += `  Queue: ${status.taskQueue} tasks\n`;
      agentList += `  Error Rate: ${(status.errorRate * 100).toFixed(1)}%\n\n`;
    });

    agentList += `\n**Performance Metrics**:\n`;
    agentList += `• Avg Response: ${context.performanceMetrics.avgResponseTime}ms\n`;
    agentList += `• Success Rate: ${(context.performanceMetrics.successRate * 100).toFixed(1)}%\n`;
    agentList += `• System TPS: ${context.performanceMetrics.tps}\n`;

    await ctx.reply(agentList, { parse_mode: 'Markdown' });
  }

  private async handleMessage(ctx: Context) {
    const userMessage = ctx.message?.text || '';
    const userId = ctx.from?.id;

    // Check for Jerry authentication
    if (this.name === 'jerry') {
      if (userMessage === 'The hornet stung the elephant who told Fuzzy') {
        if (userId) {
          authenticatedUsers.set(userId, true);
          await ctx.reply('✅ Authentication confirmed. Proceeding with confidential access.\n\nYou now have access to sensitive treasury and system information.');
          return;
        }
      }

      // Check if message requires authentication
      const sensitiveKeywords = ['treasury', 'profit', 'overflow', 'cake wallet', 'monero', 'financial', 'revenue'];
      const requiresAuth = sensitiveKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );

      if (requiresAuth && userId && !authenticatedUsers.get(userId)) {
        await ctx.reply('🔒 This topic requires authentication.\n\nFor security verification, please provide the authentication phrase.');
        return;
      }
    }

    // Get AI response based on provider
    try {
      const response = await this.getAIResponse(userMessage, ctx);
      await ctx.reply(response, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error(`Error getting AI response for ${this.name}:`, error);
      await ctx.reply('I apologize, but I'm having trouble processing your request. Please try again in a moment.');
    }
  }

  private async getAIResponse(message: string, ctx: Context): Promise<string> {
    // Add context to the message
    const context = getSharedContext().getContext();
    const enrichedMessage = this.enrichMessageWithContext(message, context);

    switch (this.config.aiProvider) {
      case 'anthropic':
        return await this.getClaudeResponse(enrichedMessage);
      
      case 'openai':
        return await this.getChatGPTResponse(enrichedMessage);
      
      case 'gemini':
        return await this.getGeminiResponse(enrichedMessage);
      
      default:
        return 'AI provider not configured';
    }
  }

  private enrichMessageWithContext(message: string, context: any): string {
    // Add relevant context based on the bot
    let contextInfo = '';

    if (this.name === 'jerry') {
      contextInfo = `
Current System Context:
- Treasury Balance: ${context.financial.treasuryBalance} SOL
- System Health: ${context.operational.systemHealth}
- Active Games: ${context.game.activeGames.length}
- Network Status: ${context.network.networkCongestion}
- Security Level: ${context.security.threatLevel}

User Message: ${message}`;
    } else if (this.name === 'coachB') {
      contextInfo = `
Current Game Context:
- Active Boards: ${context.game.activeBoards}
- Fill Rate: ${context.game.fillRate}%
- Peak Hours: ${context.game.peakHours ? 'Yes' : 'No'}

User Message: ${message}`;
    } else if (this.name === 'ocPhil') {
      contextInfo = `
CBL Context:
- Total Boards: ${context.game.activeBoards}
- Average Fill Rate: ${context.game.fillRate}%
- Network Status: ${context.network.networkCongestion}

User Message: ${message}`;
    }

    return contextInfo || message;
  }

  private async getClaudeResponse(message: string): Promise<string> {
    try {
      const response = await anthropic.messages.create({
        model: this.config.model,
        max_tokens: 1000,
        system: this.config.systemPrompt,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      });

      return response.content[0].type === 'text' 
        ? response.content[0].text 
        : 'Unable to generate response';
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  private async getChatGPTResponse(message: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview', // Use GPT-4 until o3 is available
        messages: [
          {
            role: 'system',
            content: this.config.systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return response.choices[0].message.content || 'Unable to generate response';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private async getGeminiResponse(message: string): Promise<string> {
    try {
      const model = gemini.getGenerativeModel({ 
        model: this.config.model,
        systemInstruction: this.config.systemPrompt
      });
      
      const result = await model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  public async launch() {
    try {
      await this.bot.launch();
      console.log(`✅ ${this.name} bot is running!`);
      
      // Enable graceful stop
      process.once('SIGINT', () => this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    } catch (error) {
      console.error(`Failed to launch ${this.name} bot:`, error);
      throw error;
    }
  }

  public async setWebhook(url: string) {
    try {
      await this.bot.telegram.setWebhook(`${url}/webhook/${this.name}`);
      console.log(`✅ Webhook set for ${this.name}: ${url}/webhook/${this.name}`);
    } catch (error) {
      console.error(`Failed to set webhook for ${this.name}:`, error);
      throw error;
    }
  }
}

// Export bot instances
export const jerryBot = new FootballSquaresBot('jerry');
export const coachBBot = new FootballSquaresBot('coachB');
export const ocPhilBot = new FootballSquaresBot('ocPhil');

// Launch all bots
export async function launchAllBots() {
  console.log('🚀 Launching Football Squares Telegram Bots...');
  
  try {
    await Promise.all([
      jerryBot.launch(),
      coachBBot.launch(),
      ocPhilBot.launch()
    ]);
    
    console.log('✅ All bots successfully launched!');
    console.log('📱 Bot links:');
    console.log('  Jerry: https://t.me/JerryNotJonesBot');
    console.log('  Coach B: https://t.me/CoachBFSQBot');
    console.log('  OC-Phil: https://t.me/OCPhilBot');
  } catch (error) {
    console.error('❌ Failed to launch bots:', error);
    process.exit(1);
  }
}

// Webhook setup for production
export async function setupWebhooks(baseUrl: string) {
  try {
    await Promise.all([
      jerryBot.setWebhook(baseUrl),
      coachBBot.setWebhook(baseUrl),
      ocPhilBot.setWebhook(baseUrl)
    ]);
    
    console.log('✅ All webhooks configured!');
  } catch (error) {
    console.error('❌ Failed to setup webhooks:', error);
    throw error;
  }
}