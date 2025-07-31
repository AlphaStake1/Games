import { Connection, PublicKey } from '@solana/web3.js';
import { OCPhilBot } from './bot';
import { TELEGRAM_CONFIG } from './config';
import { BoardEvent } from './types';

export class SolanaEventListener {
  private connection: Connection;
  private bot: OCPhilBot;
  private subscriptions: Map<string, number> = new Map();

  constructor(rpcEndpoint: string) {
    this.connection = new Connection(rpcEndpoint, 'confirmed');
    this.bot = new OCPhilBot(TELEGRAM_CONFIG.BOT_TOKEN);
  }

  async startListening(programId: string) {
    console.log('Starting Solana event listeners for program:', programId);

    // Listen for logs from the squares program
    const subscription = this.connection.onLogs(
      new PublicKey(programId),
      (logs, context) => {
        this.handleProgramLogs(logs, context);
      },
      'confirmed',
    );

    this.subscriptions.set('program_logs', subscription);

    // Set up bot commands
    await this.setupBotCommands();
  }

  private async setupBotCommands() {
    try {
      await this.bot.setMyCommands([
        { command: 'start', description: 'Welcome message and setup' },
        { command: 'help', description: 'Show all available commands' },
        { command: 'stats', description: 'View your current stats' },
        { command: 'boards', description: 'View active boards' },
        { command: 'tips', description: 'Get strategy tips' },
        { command: 'celebrate', description: 'Celebrate a win!' },
      ]);
      console.log('Bot commands set successfully');
    } catch (error) {
      console.error('Error setting bot commands:', error);
    }
  }

  private async handleProgramLogs(logs: any, context: any) {
    try {
      // Extract event data from logs
      const eventData = this.parseEventLogs(logs.logs);

      if (eventData) {
        await this.processEvent(eventData);
      }
    } catch (error) {
      console.error('Error handling program logs:', error);
    }
  }

  private parseEventLogs(logs: string[]): BoardEvent | null {
    // Parse Anchor program logs to extract events
    for (const log of logs) {
      try {
        // Look for specific event patterns in logs
        if (log.includes('BoardCreated')) {
          return this.parseBoardCreatedEvent(log);
        } else if (log.includes('BoardFilled')) {
          return this.parseBoardFilledEvent(log);
        } else if (log.includes('SquarePurchased')) {
          return this.parseSquarePurchasedEvent(log);
        } else if (log.includes('GameCompleted')) {
          return this.parseGameCompletedEvent(log);
        }
      } catch (error) {
        console.error('Error parsing log:', log, error);
      }
    }

    return null;
  }

  private parseBoardCreatedEvent(log: string): BoardEvent {
    // Extract board creation details from log
    // This would parse actual Anchor event data
    const boardId = this.extractFromLog(log, 'boardId');
    const cblUserId = this.extractFromLog(log, 'cblUserId');
    const cblUsername = this.extractFromLog(log, 'cblUsername');
    const gameInfo = this.extractFromLog(log, 'gameInfo');

    return {
      type: 'board_created',
      boardId: boardId || 'unknown',
      cblUserId: cblUserId || 'unknown',
      cblUsername: cblUsername || 'CBL',
      gameInfo,
      timestamp: new Date(),
      metadata: { log },
    };
  }

  private parseBoardFilledEvent(log: string): BoardEvent {
    const boardId = this.extractFromLog(log, 'boardId');
    const cblUserId = this.extractFromLog(log, 'cblUserId');
    const cblUsername = this.extractFromLog(log, 'cblUsername');
    const prizeAmount = this.extractFromLog(log, 'prizeAmount');

    return {
      type: 'board_filled',
      boardId: boardId || 'unknown',
      cblUserId: cblUserId || 'unknown',
      cblUsername: cblUsername || 'CBL',
      prizeAmount: prizeAmount || '0',
      timestamp: new Date(),
      metadata: { log },
    };
  }

  private parseSquarePurchasedEvent(log: string): BoardEvent {
    const boardId = this.extractFromLog(log, 'boardId');
    const cblUserId = this.extractFromLog(log, 'cblUserId');
    const cblUsername = this.extractFromLog(log, 'cblUsername');

    return {
      type: 'square_purchased',
      boardId: boardId || 'unknown',
      cblUserId: cblUserId || 'unknown',
      cblUsername: cblUsername || 'CBL',
      timestamp: new Date(),
      metadata: { log },
    };
  }

  private parseGameCompletedEvent(log: string): BoardEvent {
    const boardId = this.extractFromLog(log, 'boardId');
    const cblUserId = this.extractFromLog(log, 'cblUserId');
    const cblUsername = this.extractFromLog(log, 'cblUsername');
    const prizeAmount = this.extractFromLog(log, 'prizeAmount');

    return {
      type: 'game_completed',
      boardId: boardId || 'unknown',
      cblUserId: cblUserId || 'unknown',
      cblUsername: cblUsername || 'CBL',
      prizeAmount: prizeAmount || '0',
      timestamp: new Date(),
      metadata: { log },
    };
  }

  private extractFromLog(log: string, field: string): string | undefined {
    // Simple extraction - in practice would use proper Anchor event parsing
    const regex = new RegExp(`${field}:\\s*([^\\s,}]+)`);
    const match = log.match(regex);
    return match ? match[1] : undefined;
  }

  private async processEvent(event: BoardEvent) {
    console.log('Processing event:', event.type, event.boardId);

    try {
      switch (event.type) {
        case 'board_created':
          await this.handleBoardCreated(event);
          break;
        case 'board_filled':
          await this.handleBoardFilled(event);
          break;
        case 'square_purchased':
          await this.handleSquarePurchased(event);
          break;
        case 'game_completed':
          await this.handleGameCompleted(event);
          break;
      }
    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  private async handleBoardCreated(event: BoardEvent) {
    if (
      !TELEGRAM_CONFIG.MAIN_GROUP_ID ||
      !TELEGRAM_CONFIG.ENABLE_BOARD_NOTIFICATIONS
    ) {
      return;
    }

    await this.bot.announceNewBoard(
      TELEGRAM_CONFIG.MAIN_GROUP_ID,
      event.boardId,
      event.cblUsername,
      event.gameInfo || 'Upcoming Game',
    );
  }

  private async handleBoardFilled(event: BoardEvent) {
    if (
      !TELEGRAM_CONFIG.MAIN_GROUP_ID ||
      !TELEGRAM_CONFIG.ENABLE_CELEBRATION_GIFS
    ) {
      return;
    }

    await this.bot.celebrateBoardFill(
      TELEGRAM_CONFIG.MAIN_GROUP_ID,
      event.boardId,
      event.cblUsername,
      event.prizeAmount || '0',
    );

    // Also send to announcement channel if configured
    if (TELEGRAM_CONFIG.ANNOUNCEMENT_CHANNEL_ID) {
      await this.bot.celebrateBoardFill(
        TELEGRAM_CONFIG.ANNOUNCEMENT_CHANNEL_ID,
        event.boardId,
        event.cblUsername,
        event.prizeAmount || '0',
      );
    }
  }

  private async handleSquarePurchased(event: BoardEvent) {
    // Optionally notify about square purchases
    // Could be rate-limited to avoid spam
    console.log('Square purchased for board:', event.boardId);
  }

  private async handleGameCompleted(event: BoardEvent) {
    if (!TELEGRAM_CONFIG.MAIN_GROUP_ID) {
      return;
    }

    // Send game completion notification
    const message =
      `🏁 <b>Game Complete!</b>\n\n` +
      `Board #${event.boardId} has finished!\n` +
      `🏆 CBL: @${event.cblUsername}\n` +
      `💰 Final Prize Pool: ${event.prizeAmount} SOL\n\n` +
      `Thanks for playing! Next board starting soon! 🚀`;

    await this.bot.sendMessage(TELEGRAM_CONFIG.MAIN_GROUP_ID, message, {
      parse_mode: 'HTML',
    });
  }

  async stopListening() {
    console.log('Stopping Solana event listeners');

    for (const [name, subscription] of Array.from(
      this.subscriptions.entries(),
    )) {
      try {
        await this.connection.removeOnLogsListener(subscription);
        console.log(`Removed listener: ${name}`);
      } catch (error) {
        console.error(`Error removing listener ${name}:`, error);
      }
    }

    this.subscriptions.clear();
  }

  // Weekly digest functionality
  async sendWeeklyDigests() {
    if (!TELEGRAM_CONFIG.ENABLE_WEEKLY_DIGEST) {
      return;
    }

    console.log('Sending weekly digests to CBLs');

    // This would integrate with your user database to get CBL stats
    const cblUsers = await this.getCBLUsers();

    for (const user of cblUsers) {
      try {
        if (user.telegramChatId) {
          await this.bot.sendWeeklyDigest(
            user.telegramChatId,
            user.username,
            user.weeklyStats,
          );
        }
      } catch (error) {
        console.error(`Error sending digest to ${user.username}:`, error);
      }
    }
  }

  private async getCBLUsers(): Promise<any[]> {
    // Mock data - integrate with your actual user database
    return [
      {
        id: 'user1',
        username: 'SquaresMaster',
        telegramChatId: '123456789',
        weeklyStats: {
          boardsCreated: 5,
          boardsFilled: 4,
          totalRevenue: '450.0',
          bluePoints: 125,
          orangePoints: 78,
        },
      },
    ];
  }
}

// Utility function to start the event listener
export async function startTelegramEventListeners() {
  const rpcEndpoint =
    process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
  const programId = process.env.SQUARES_PROGRAM_ID || 'YourProgramIdHere';

  const listener = new SolanaEventListener(rpcEndpoint);
  await listener.startListening(programId);

  // Set up weekly digest cron job
  if (TELEGRAM_CONFIG.ENABLE_WEEKLY_DIGEST) {
    // Send weekly digests every Sunday at 10 AM
    setInterval(
      async () => {
        const now = new Date();
        if (now.getDay() === 0 && now.getHours() === 10) {
          // Sunday at 10 AM
          await listener.sendWeeklyDigests();
        }
      },
      60 * 60 * 1000,
    ); // Check every hour
  }

  return listener;
}
