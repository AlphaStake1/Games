// CBL Bot Cloning System
// Creates custom bots for milestone rewards with OC Phil's commands

export interface BotCreationRequest {
  cblId: string;
  walletAddress: string;
  botName: string;
  botUsername: string;
  description?: string;
  platformHandle?: string;
  telegramChatId?: string;
  personality?: BotPersonality; // Optional custom personality
}

// Import personality types
import { BotPersonality } from './botPersonality';

export interface BotCreationResponse {
  success: boolean;
  botToken?: string;
  botId?: string;
  botUsername?: string;
  inviteLink?: string;
  error?: string;
}

export interface BotCommand {
  command: string;
  description: string;
  handler: string;
  category: 'game' | 'strategy' | 'stats' | 'social' | 'admin';
  requiresAuth?: boolean;
}

export interface CBLBotConfig {
  cblId: string;
  botToken: string;
  botUsername: string;
  chatId: string;
  isActive: boolean;
  createdAt: Date;
  commands: BotCommand[];
  branding: {
    name: string;
    avatar?: string;
    welcomeMessage: string;
    primaryColor: string;
    accentColor: string;
  };
  features: {
    advancedAnalytics: boolean;
    customCommands: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
  };
}

// OC Phil's base command set to clone
export const OC_PHIL_COMMANDS: BotCommand[] = [
  {
    command: 'start',
    description: 'Welcome new users and show available commands',
    handler: 'handleStart',
    category: 'social',
  },
  {
    command: 'help',
    description: 'Show all available commands and how to use them',
    handler: 'handleHelp',
    category: 'social',
  },
  {
    command: 'board',
    description: 'Create a new squares board for upcoming games',
    handler: 'handleCreateBoard',
    category: 'game',
  },
  {
    command: 'myboards',
    description: 'View your active and completed boards',
    handler: 'handleMyBoards',
    category: 'game',
  },
  {
    command: 'join',
    description: 'Join an existing squares board',
    handler: 'handleJoinBoard',
    category: 'game',
  },
  {
    command: 'stats',
    description: 'View your performance statistics',
    handler: 'handleStats',
    category: 'stats',
  },
  {
    command: 'leaderboard',
    description: 'See top performers in your community',
    handler: 'handleLeaderboard',
    category: 'stats',
  },
  {
    command: 'tips',
    description: 'Get strategic advice based on your progress',
    handler: 'handleTips',
    category: 'strategy',
  },
  {
    command: 'strategy',
    description: 'Advanced board strategy and pricing guidance',
    handler: 'handleStrategy',
    category: 'strategy',
  },
  {
    command: 'notify',
    description: 'Set up game and board notifications',
    handler: 'handleNotifications',
    category: 'social',
  },
  {
    command: 'schedule',
    description: 'View upcoming NFL games and board opportunities',
    handler: 'handleSchedule',
    category: 'game',
  },
  {
    command: 'celebrate',
    description: 'Share wins and achievements with the community',
    handler: 'handleCelebrate',
    category: 'social',
  },
  {
    command: 'pricing',
    description: 'Get optimal pricing recommendations for your boards',
    handler: 'handlePricing',
    category: 'strategy',
  },
  {
    command: 'analytics',
    description: 'View detailed performance analytics (Franchise tier)',
    handler: 'handleAnalytics',
    category: 'stats',
    requiresAuth: true,
  },
  {
    command: 'admin',
    description: 'Admin commands for CBL management',
    handler: 'handleAdmin',
    category: 'admin',
    requiresAuth: true,
  },
];

export class CBLBotCloner {
  private botFatherToken: string;
  private webhookBaseUrl: string;
  private database: any; // Database connection
  private ocPhilToken: string;

  constructor(
    botFatherToken: string,
    webhookBaseUrl: string,
    ocPhilToken: string,
    database: any,
  ) {
    this.botFatherToken = botFatherToken;
    this.webhookBaseUrl = webhookBaseUrl;
    this.ocPhilToken = ocPhilToken;
    this.database = database;
  }

  /**
   * Create a new custom bot for a CBL milestone reward
   */
  async createCustomBot(
    request: BotCreationRequest,
  ): Promise<BotCreationResponse> {
    try {
      console.log(`Creating custom bot for CBL: ${request.cblId}`);

      // Step 1: Create bot via BotFather API
      const botCreation = await this.createBotViaBotFather(
        request.botName,
        request.botUsername,
        request.description,
      );

      if (!botCreation.success) {
        return {
          success: false,
          error: `Failed to create bot: ${botCreation.error}`,
        };
      }

      // Step 2: Configure bot webhook
      await this.setupBotWebhook(botCreation.botToken!, request.cblId);

      // Step 3: Clone OC Phil's commands
      await this.cloneCommands(botCreation.botToken!, request.cblId);

      // Step 4: Set up bot branding and configuration
      const botConfig = await this.setupBotBranding(
        botCreation.botToken!,
        request,
      );

      // Step 5: Join CBL's Telegram group if provided
      let inviteLink: string | undefined;
      if (request.telegramChatId) {
        inviteLink = await this.joinTelegramGroup(
          botCreation.botToken!,
          request.telegramChatId,
        );
      }

      // Step 6: Store bot configuration in database
      await this.storeBotConfig({
        cblId: request.cblId,
        botToken: botCreation.botToken!,
        botUsername: botCreation.botUsername!,
        chatId: request.telegramChatId || '',
        isActive: true,
        createdAt: new Date(),
        commands: OC_PHIL_COMMANDS,
        branding: botConfig.branding,
        features: botConfig.features,
      });

      // Step 7: Send welcome message to CBL
      await this.sendWelcomeMessage(botCreation.botToken!, request);

      return {
        success: true,
        botToken: botCreation.botToken,
        botId: botCreation.botId,
        botUsername: botCreation.botUsername,
        inviteLink,
      };
    } catch (error) {
      console.error('Error creating custom bot:', error);
      return {
        success: false,
        error: `Unexpected error: ${error}`,
      };
    }
  }

  /**
   * Create bot using BotFather HTTP API
   */
  private async createBotViaBotFather(
    name: string,
    username: string,
    description?: string,
  ): Promise<{
    success: boolean;
    botToken?: string;
    botId?: string;
    botUsername?: string;
    error?: string;
  }> {
    try {
      // First, send /newbot command to BotFather
      const newBotResponse = await fetch(
        `https://api.telegram.org/bot${this.botFatherToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '@BotFather',
            text: '/newbot',
          }),
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

      // Send bot name
      await fetch(
        `https://api.telegram.org/bot${this.botFatherToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '@BotFather',
            text: name,
          }),
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

      // Send bot username
      const usernameResponse = await fetch(
        `https://api.telegram.org/bot${this.botFatherToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '@BotFather',
            text: username,
          }),
        },
      );

      // Extract bot token from BotFather's response
      // In practice, you'd parse the actual response to get the token
      // For now, simulating the token format
      const botToken = `${Date.now()}:${this.generateRandomToken()}`;
      const botId = Date.now().toString();

      return {
        success: true,
        botToken,
        botId,
        botUsername: username,
      };
    } catch (error) {
      return {
        success: false,
        error: `BotFather API error: ${error}`,
      };
    }
  }

  /**
   * Set up webhook for the new bot
   */
  private async setupBotWebhook(
    botToken: string,
    cblId: string,
  ): Promise<void> {
    const webhookUrl = `${this.webhookBaseUrl}/webhook/cbl-bot/${cblId}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query', 'inline_query'],
        }),
      },
    );

    const result = await response.json();
    if (!result.ok) {
      throw new Error(`Failed to set webhook: ${result.description}`);
    }
  }

  /**
   * Clone OC Phil's commands to the new bot
   */
  private async cloneCommands(botToken: string, cblId: string): Promise<void> {
    // Format commands for Telegram Bot API
    const telegramCommands = OC_PHIL_COMMANDS.map((cmd) => ({
      command: cmd.command,
      description: cmd.description,
    }));

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setMyCommands`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commands: telegramCommands,
        }),
      },
    );

    const result = await response.json();
    if (!result.ok) {
      throw new Error(`Failed to set commands: ${result.description}`);
    }

    console.log(`Cloned ${telegramCommands.length} commands for CBL: ${cblId}`);
  }

  /**
   * Set up bot branding and configuration
   */
  private async setupBotBranding(
    botToken: string,
    request: BotCreationRequest,
  ): Promise<{
    branding: CBLBotConfig['branding'];
    features: CBLBotConfig['features'];
  }> {
    // Use custom personality if provided, otherwise default
    const personality = request.personality;
    const description =
      personality?.description ||
      request.description ||
      `Your personal squares coach for ${request.platformHandle || 'your community'}! 🏈 Powered by OC Phil AI`;

    const shortDescription = personality
      ? `${personality.name} - ${personality.voiceTone.primary.charAt(0).toUpperCase() + personality.voiceTone.primary.slice(1)} 🏈`
      : `${request.botName} - Your Squares Coach 🏈`;

    // Set bot description
    await fetch(`https://api.telegram.org/bot${botToken}/setMyDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
      }),
    });

    // Set bot short description
    await fetch(
      `https://api.telegram.org/bot${botToken}/setMyShortDescription`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          short_description: shortDescription,
        }),
      },
    );

    return {
      branding: {
        name: personality?.name || request.botName,
        welcomeMessage:
          personality?.welcomeMessage ||
          `🏈 Welcome to ${request.botName}!\n\nI'm your personal squares coach, powered by OC Phil's proven strategies. Let me help you dominate your community boards!\n\nUse /help to see all available commands.`,
        primaryColor: personality?.branding.primaryColor || '#255c7e', // Brand blue
        accentColor: personality?.branding.accentColor || '#ed5925', // Brand orange
      },
      features: {
        advancedAnalytics: true, // Milestone reward
        customCommands: true, // Milestone reward
        prioritySupport: true, // Milestone reward
        whiteLabel: false, // Future feature
      },
    };
  }

  /**
   * Join CBL's Telegram group with the new bot
   */
  private async joinTelegramGroup(
    botToken: string,
    chatId: string,
  ): Promise<string | undefined> {
    try {
      // Get chat info
      const chatResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getChat?chat_id=${chatId}`,
      );
      const chatResult = await chatResponse.json();

      if (!chatResult.ok) {
        console.warn(`Failed to get chat info: ${chatResult.description}`);
        return undefined;
      }

      // Export invite link (if bot has admin rights)
      const inviteResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/exportChatInviteLink?chat_id=${chatId}`,
      );
      const inviteResult = await inviteResponse.json();

      if (inviteResult.ok) {
        return inviteResult.result;
      } else {
        console.warn(
          `Failed to export invite link: ${inviteResult.description}`,
        );
        return undefined;
      }
    } catch (error) {
      console.error('Error joining Telegram group:', error);
      return undefined;
    }
  }

  /**
   * Store bot configuration in database
   */
  private async storeBotConfig(config: CBLBotConfig): Promise<void> {
    // This would integrate with your actual database
    // For now, logging the configuration
    console.log('Storing bot configuration:', {
      cblId: config.cblId,
      botUsername: config.botUsername,
      commandCount: config.commands.length,
      features: config.features,
    });

    // Example SQL insert (adapt to your database schema):
    /*
    await this.database.query(`
      INSERT INTO cbl_bots (
        cbl_id, bot_token, bot_username, chat_id, is_active,
        created_at, commands, branding, features
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      config.cblId,
      config.botToken,
      config.botUsername,
      config.chatId,
      config.isActive,
      config.createdAt,
      JSON.stringify(config.commands),
      JSON.stringify(config.branding),
      JSON.stringify(config.features)
    ]);
    */
  }

  /**
   * Send welcome message to CBL
   */
  private async sendWelcomeMessage(
    botToken: string,
    request: BotCreationRequest,
  ): Promise<void> {
    if (!request.telegramChatId) return;

    const welcomeMessage = `🎉 **Congratulations!** 🎉

Your custom squares coach "${request.botName}" is now active!

🏆 **Milestone Achievement Unlocked:**
✅ Custom Bot Companion
✅ Advanced Analytics Access
✅ Priority Support Line
✅ Personalized Strategy Tips

Your bot has all of OC Phil's proven commands plus exclusive features for Franchise-tier leaders.

Type /help to explore your new coaching superpowers! 🚀

*${request.botName} is powered by OC Phil AI - your success is our mission.*`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: request.telegramChatId,
          text: welcomeMessage,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Failed to send welcome message:', error);
    }
  }

  /**
   * Update existing bot configuration
   */
  async updateBotConfig(
    cblId: string,
    updates: Partial<CBLBotConfig>,
  ): Promise<boolean> {
    try {
      // Update database record
      console.log(`Updating bot config for CBL: ${cblId}`, updates);

      // Update commands if provided
      if (updates.commands) {
        const config = await this.getBotConfig(cblId);
        if (config) {
          await this.cloneCommands(config.botToken, cblId);
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating bot config:', error);
      return false;
    }
  }

  /**
   * Get bot configuration for a CBL
   */
  async getBotConfig(cblId: string): Promise<CBLBotConfig | null> {
    // This would query your actual database
    // For now, returning null
    console.log(`Getting bot config for CBL: ${cblId}`);
    return null;
  }

  /**
   * Deactivate a CBL's custom bot
   */
  async deactivateBot(cblId: string): Promise<boolean> {
    try {
      const config = await this.getBotConfig(cblId);
      if (!config) {
        return false;
      }

      // Remove webhook
      await fetch(
        `https://api.telegram.org/bot${config.botToken}/deleteWebhook`,
      );

      // Update database
      console.log(`Deactivating bot for CBL: ${cblId}`);

      return true;
    } catch (error) {
      console.error('Error deactivating bot:', error);
      return false;
    }
  }

  /**
   * Generate random token for demo purposes
   */
  private generateRandomToken(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 35; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Bulk create bots for multiple CBLs (admin function)
   */
  async bulkCreateBots(
    requests: BotCreationRequest[],
  ): Promise<BotCreationResponse[]> {
    const results: BotCreationResponse[] = [];

    for (const request of requests) {
      try {
        const result = await this.createCustomBot(request);
        results.push(result);

        // Rate limiting - wait between bot creations
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          success: false,
          error: `Failed to create bot for ${request.cblId}: ${error}`,
        });
      }
    }

    return results;
  }
}

// Utility functions for bot management

/**
 * Validate bot creation request
 */
export function validateBotRequest(request: BotCreationRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!request.cblId) errors.push('CBL ID is required');
  if (!request.walletAddress) errors.push('Wallet address is required');
  if (!request.botName) errors.push('Bot name is required');
  if (!request.botUsername) errors.push('Bot username is required');

  // Validate bot username format
  if (
    request.botUsername &&
    !request.botUsername.match(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/)
  ) {
    errors.push(
      'Bot username must be 5-32 characters, start with letter, and contain only letters, numbers, and underscores',
    );
  }

  // Validate bot username doesn't end with 'bot'
  if (
    request.botUsername &&
    !request.botUsername.toLowerCase().endsWith('bot')
  ) {
    errors.push('Bot username must end with "bot"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate suggested bot username
 */
export function generateBotUsername(
  cblId: string,
  platformHandle?: string,
): string {
  const base = platformHandle || `cbl_${cblId.slice(0, 8)}`;
  const sanitized = base.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  return `${sanitized}_coach_bot`;
}

/**
 * Generate bot name suggestions
 */
export function generateBotName(platformHandle?: string): string[] {
  const base = platformHandle || 'Your Community';
  return [
    `${base} Squares Coach`,
    `${base} Game Master`,
    `${base} Victory Guide`,
    `${base} Strategy Bot`,
    `${base} Sports Coach`,
  ];
}

// Export the service for use in milestone rewards
export { CBLBotCloner };
