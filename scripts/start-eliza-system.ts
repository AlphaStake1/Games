// scripts/start-eliza-system.ts
/**
 * Main entry point for starting the ElizaOS Football Squares Character System
 *
 * Usage:
 * - npm run eliza:start (production)
 * - npm run eliza:dev (development with hot reload)
 * - npm run eliza:test (test mode)
 */

import dotenv from 'dotenv';
import path from 'path';
import ElizaOrchestrator, {
  ElizaOrchestratorConfig,
} from '../lib/eliza-orchestrator';

// Load environment variables
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../eliza-config/.env') });

/**
 * Create orchestrator configuration from environment
 */
function createOrchestratorConfig(): ElizaOrchestratorConfig {
  const config: ElizaOrchestratorConfig = {
    charactersDir: path.join(__dirname, '../characters'),

    memoryConfig: {
      provider: 'postgresql',
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://eliza:eliza_password@localhost:5432/eliza_football_squares',
      scopes: {
        PUBLIC_GAME: {
          description: 'Public game state and leaderboards',
          retention: '30 days',
          accessible: [
            'Coach_B',
            'Coach_Right',
            'Patel_Neil',
            'Morgan_Reese',
            'OC_Phil',
          ],
        },
        BOARD_STATE: {
          description: 'Current board configurations and square assignments',
          retention: '7 days',
          accessible: ['Trainer_Reviva', 'Commissioner_Jerry'],
        },
        USER_CHAT: {
          description: 'User support conversations and history',
          retention: '90 days',
          accessible: ['Trainer_Reviva', 'Coach_B', 'Coach_Right'],
        },
        TX_FINANCE: {
          description: 'Transaction history and financial records',
          retention: '7 years',
          accessible: ['Jordan_Banks', 'Commissioner_Jerry'],
        },
        SYS_INTERNAL: {
          description: 'System logs and internal operations',
          retention: '30 days',
          accessible: [
            'Dean_Security',
            'Commissioner_Jerry',
            'Morgan_Reese',
            'Patel_Neil',
          ],
        },
      },
    },

    platforms: {},

    fryConfig: {
      solanaRPC:
        process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      monitoringIntervalMs: parseInt(
        process.env.FRY_MONITORING_INTERVAL_MS || '30000',
      ),
      alertThresholds: {
        responseTime: parseInt(
          process.env.FRY_ALERT_RESPONSE_TIME_MS || '2000',
        ),
        errorRate: parseFloat(process.env.FRY_ALERT_ERROR_RATE || '0.05'),
        uptimeMinimum: parseFloat(
          process.env.FRY_ALERT_UPTIME_MINIMUM || '99.5',
        ),
      },
    },

    enableHotReload:
      process.env.NODE_ENV === 'development' ||
      process.env.ELIZA_HOT_RELOAD === 'true',
  };

  // Configure Discord if credentials provided
  if (process.env.DISCORD_BOT_TOKEN) {
    config.platforms.discord = {
      token: process.env.DISCORD_BOT_TOKEN,
      channels: {
        general: process.env.DISCORD_GENERAL_CHANNEL || 'general',
        support: process.env.DISCORD_SUPPORT_CHANNEL || 'support',
        announcements:
          process.env.DISCORD_ANNOUNCEMENTS_CHANNEL || 'announcements',
        alerts: process.env.DISCORD_ALERTS_CHANNEL || 'alerts',
      },
    };
  }

  // Configure Telegram if credentials provided
  if (process.env.TELEGRAM_BOT_TOKEN) {
    config.platforms.telegram = {
      token: process.env.TELEGRAM_BOT_TOKEN,
    };
  }

  // Configure Twitter if credentials provided
  if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
    config.platforms.twitter = {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
    };
  }

  return config;
}

/**
 * Validate required environment variables
 */
function validateEnvironment(): boolean {
  const required = ['DATABASE_URL', 'OPENAI_API_KEY', 'SOLANA_RPC_URL'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file configuration.');
    return false;
  }

  // Check for at least one platform
  const platforms = [
    'DISCORD_BOT_TOKEN',
    'TELEGRAM_BOT_TOKEN',
    'TWITTER_API_KEY',
  ];
  const availablePlatforms = platforms.filter((key) => process.env[key]);

  if (availablePlatforms.length === 0) {
    console.warn(
      '⚠️ No platform tokens configured. Characters will only run in internal mode.',
    );
  }

  return true;
}

/**
 * Setup graceful shutdown
 */
function setupGracefulShutdown(orchestrator: ElizaOrchestrator): void {
  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`\n📡 Received ${signal}, shutting down gracefully...`);

      try {
        await orchestrator.stop();
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    });
  });
}

/**
 * Setup error handling
 */
function setupErrorHandling(): void {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });
}

/**
 * Display startup banner
 */
function displayBanner(): void {
  console.log('');
  console.log('🏈 ═══════════════════════════════════════════════════════════');
  console.log('   ElizaOS Football Squares Character System');
  console.log('   Powered by Claude AI & Fry Infrastructure');
  console.log('═══════════════════════════════════════════════════════════ 🤖');
  console.log('');
}

/**
 * Main startup function
 */
async function main(): Promise<void> {
  displayBanner();

  // Validate environment
  if (!validateEnvironment()) {
    process.exit(1);
  }

  // Setup error handling
  setupErrorHandling();

  // Create orchestrator configuration
  const config = createOrchestratorConfig();

  console.log('⚙️ Configuration:');
  console.log(`   Characters Directory: ${config.charactersDir}`);
  console.log(`   Memory Provider: ${config.memoryConfig.provider}`);
  console.log(
    `   Platforms: ${Object.keys(config.platforms).join(', ') || 'None'}`,
  );
  console.log(
    `   Hot Reload: ${config.enableHotReload ? 'Enabled' : 'Disabled'}`,
  );
  console.log(
    `   Fry Integration: ${config.fryConfig.solanaRPC ? 'Enabled' : 'Disabled'}`,
  );
  console.log('');

  try {
    // Create and start orchestrator
    const orchestrator = new ElizaOrchestrator(config);

    // Setup graceful shutdown
    setupGracefulShutdown(orchestrator);

    // Setup orchestrator event listeners
    orchestrator.on('started', () => {
      console.log(
        '🎉 All systems operational! Characters are now live on configured platforms.',
      );

      if (config.enableHotReload) {
        console.log(
          '🔥 Hot reload enabled - character files will be reloaded on changes',
        );
      }

      console.log('\n📱 Platform Status:');
      if (config.platforms.discord) console.log('   Discord: ✅ Connected');
      if (config.platforms.telegram) console.log('   Telegram: ✅ Connected');
      if (config.platforms.twitter) console.log('   Twitter: ✅ Connected');

      console.log('\n🤖 Character Roles:');
      console.log('   • Trainer Reviva: User Support & Technical Help');
      console.log('   • Coach B: Game Rules & Player Onboarding');
      console.log('   • Dean Security: Security & System Monitoring');
      console.log('   • Commissioner Jerry: Executive Decisions & Escalations');
      console.log('   • Coach Right: Community Management');
      console.log('   • Morgan Reese: Business Development');
      console.log('   • Patel Neil: Growth & Marketing');
      console.log('   • Jordan Banks: Financial Operations');
      console.log('   • OC Phil: CBL Training & Support');

      console.log('\n🔧 Fry Backend Services:');
      console.log('   • Infrastructure Monitoring: Active');
      console.log('   • Blockchain Diagnostics: Active');
      console.log('   • Cross-Chain Recovery: Active');
      console.log('   • Character Integration: Active');

      console.log('\n📊 Memory Scopes Configured:');
      Object.entries(config.memoryConfig.scopes).forEach(([scope, config]) => {
        console.log(`   • ${scope}: ${config.accessible.length} characters`);
      });

      console.log('\n💡 Usage Tips:');
      console.log(
        '   • Mention @character_name to direct message to specific character',
      );
      console.log(
        '   • Use "help" or "support" keywords to reach Trainer Reviva',
      );
      console.log(
        '   • Security issues automatically escalate to Dean Security',
      );
      console.log('   • Cross-chain recovery issues trigger Fry analysis');

      console.log('\n🔍 Monitoring:');
      console.log('   • System logs: Available in console output');
      console.log('   • Character activity: Real-time in console');
      console.log('   • Fry diagnostics: Automatic background monitoring');
      console.log('   • Alerts: Routed to configured Discord channels');

      console.log('\n🛑 To stop the system: Ctrl+C (graceful shutdown)');
      console.log('');
    });

    orchestrator.on('stopped', () => {
      console.log('👋 ElizaOS Character System has shut down successfully');
    });

    orchestrator.on('fryAlert', (alert) => {
      console.log(
        `🚨 Fry Alert: ${alert.characterId} - ${alert.alert.message}`,
      );
    });

    orchestrator.on('error', (error) => {
      console.error('❌ Orchestrator Error:', error);
    });

    // Start the orchestrator
    await orchestrator.start();

    // Keep the process running
    console.log('🎮 System is running... Press Ctrl+C to stop\n');

    // In production, this would handle actual platform events
    // For now, we'll simulate some activity in development mode
    if (process.env.NODE_ENV === 'development') {
      startDevelopmentSimulation(orchestrator);
    }
  } catch (error) {
    console.error('❌ Failed to start ElizaOS Character System:', error);
    process.exit(1);
  }
}

/**
 * Development mode simulation for testing
 */
function startDevelopmentSimulation(orchestrator: ElizaOrchestrator): void {
  console.log('🧪 Development mode: Starting simulation...\n');

  // Simulate some user messages every 30 seconds
  setInterval(async () => {
    const testMessages = [
      {
        platform: 'discord' as const,
        userId: 'dev_user_123',
        username: 'TestUser',
        content: 'I need help with my wallet connection',
        messageId: `msg_${Date.now()}`,
        timestamp: new Date(),
        channelId: 'support',
        mentions: [],
        attachments: [],
      },
      {
        platform: 'discord' as const,
        userId: 'dev_user_456',
        username: 'NewPlayer',
        content: 'How do I play Football Squares?',
        messageId: `msg_${Date.now() + 1}`,
        timestamp: new Date(),
        channelId: 'general',
        mentions: [],
        attachments: [],
      },
      {
        platform: 'discord' as const,
        userId: 'dev_user_789',
        username: 'ConfusedUser',
        content: 'I sent USDC from Polygon to Ethereum but it never arrived',
        messageId: `msg_${Date.now() + 2}`,
        timestamp: new Date(),
        channelId: 'support',
        mentions: [],
        attachments: [],
      },
    ];

    const randomMessage =
      testMessages[Math.floor(Math.random() * testMessages.length)];
    console.log(`🎭 Simulating message: ${randomMessage.content}`);

    try {
      await orchestrator.processMessage(randomMessage);
    } catch (error) {
      console.error('❌ Simulation error:', error);
    }
  }, 30000);
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  });
}

export default main;
