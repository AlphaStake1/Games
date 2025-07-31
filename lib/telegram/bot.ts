import { WebhookEvent } from './types';

export class OCPhilBot {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(
    chatId: string | number,
    text: string,
    options?: {
      parse_mode?: 'HTML' | 'Markdown';
      reply_markup?: any;
    },
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendPhoto(chatId: string | number, photo: string, caption?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          photo,
          caption,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending photo:', error);
      throw error;
    }
  }

  async sendAnimation(
    chatId: string | number,
    animation: string,
    caption?: string,
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/sendAnimation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          animation,
          caption,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending animation:', error);
      throw error;
    }
  }

  async pinChatMessage(chatId: string | number, messageId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/pinChatMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error pinning message:', error);
      throw error;
    }
  }

  async setMyCommands(
    commands: Array<{ command: string; description: string }>,
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/setMyCommands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commands }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error setting commands:', error);
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      return await response.json();
    } catch (error) {
      console.error('Error getting bot info:', error);
      throw error;
    }
  }

  // Handle incoming webhook updates
  async handleUpdate(update: WebhookEvent) {
    if (update.message) {
      return this.handleMessage(update.message);
    }

    if (update.callback_query) {
      return this.handleCallbackQuery(update.callback_query);
    }
  }

  private async handleMessage(message: any) {
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    const username = message.from.username;

    // Handle commands
    if (text?.startsWith('/')) {
      return this.handleCommand(text, chatId, userId, username);
    }

    // Handle regular messages
    return this.handleRegularMessage(text, chatId, userId, username);
  }

  private async handleCommand(
    command: string,
    chatId: number,
    userId: number,
    username?: string,
  ) {
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case '/start':
        return this.sendMessage(
          chatId,
          `🏈 Welcome to the Squares Lounge, ${username || 'coach'}!\n\n` +
            `I'm OC Phil, your AI offensive coordinator! I'm here to help you dominate the game with:\n\n` +
            `🎯 Real-time board updates\n` +
            `📊 Strategy tips and insights\n` +
            `🏆 Celebration when your boards fill\n` +
            `💪 Community coaching\n\n` +
            `Use /help to see all available commands!`,
          { parse_mode: 'HTML' },
        );

      case '/help':
        return this.sendMessage(
          chatId,
          `🏈 <b>OC Phil Commands:</b>\n\n` +
            `/start - Welcome message\n` +
            `/help - Show this help menu\n` +
            `/stats - Your current stats\n` +
            `/boards - View active boards\n` +
            `/tips - Get strategy tips\n` +
            `/celebrate - Celebrate a win!\n\n` +
            `💬 Just chat with me for coaching advice!`,
          { parse_mode: 'HTML' },
        );

      case '/stats':
        // TODO: Integrate with user stats from database
        return this.sendMessage(
          chatId,
          `📊 <b>Your Squares Stats:</b>\n\n` +
            `🎯 Boards Created: Coming soon...\n` +
            `💰 Total Winnings: Coming soon...\n` +
            `🏆 Win Rate: Coming soon...\n\n` +
            `Check your dashboard for detailed analytics!`,
          { parse_mode: 'HTML' },
        );

      case '/boards':
        // TODO: Integrate with active boards data
        return this.sendMessage(
          chatId,
          `🏈 <b>Active Boards:</b>\n\n` +
            `Loading your boards...\n\n` +
            `Visit your dashboard to create and manage boards!`,
          { parse_mode: 'HTML' },
        );

      case '/tips':
        const tips = [
          '🎯 Prime scoring squares: 0-0, 0-3, 0-7, 3-0, 3-3, 3-7, 7-0, 7-3, 7-7',
          '🏈 End of quarter scoring is most predictable - focus your strategy there!',
          '💡 Diversify your square purchases across multiple boards to spread risk',
          '⚡ Create urgency - limited-time boards fill faster than open-ended ones',
          '🎉 Engage your community - social pressure drives faster board fills',
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        return this.sendMessage(
          chatId,
          `💡 <b>Coach Phil's Tip:</b>\n\n${randomTip}`,
          { parse_mode: 'HTML' },
        );

      case '/celebrate':
        const celebrations = [
          '🎉🏈 TOUCHDOWN! Nice win, coach! 🏆',
          "⚡💥 BOOM! That's how we do it! 🔥",
          '🏈🎯 BULLS-EYE! Perfect square! 💪',
          '🚀🏆 TO THE MOON! Great play! 🌙',
          '💰⚡ CHA-CHING! Winner winner! 🎰',
        ];
        const randomCelebration =
          celebrations[Math.floor(Math.random() * celebrations.length)];
        return this.sendMessage(chatId, randomCelebration);

      default:
        return this.sendMessage(
          chatId,
          `🤔 I don't recognize that command, coach!\n\nUse /help to see what I can do for you.`,
        );
    }
  }

  private async handleRegularMessage(
    text: string,
    chatId: number,
    userId: number,
    username?: string,
  ) {
    // Simple keyword-based responses for now
    const lowerText = text?.toLowerCase() || '';

    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return this.sendMessage(
        chatId,
        `Hey there, ${username || 'coach'}! 🏈 Ready to dominate the game today?`,
      );
    }

    if (lowerText.includes('help')) {
      return this.sendMessage(
        chatId,
        `I'm here to help! Use /help to see all my commands, or just ask me about squares strategy! 🎯`,
      );
    }

    if (lowerText.includes('strategy') || lowerText.includes('tips')) {
      return this.handleCommand('/tips', chatId, userId, username);
    }

    // Default response for unmatched messages
    return this.sendMessage(
      chatId,
      `🏈 That's interesting, coach! I'm still learning, but use /help to see what I can help you with right now!`,
    );
  }

  private async handleCallbackQuery(callbackQuery: any) {
    // Handle inline keyboard button presses
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // TODO: Implement callback query handling for interactive features
    return this.sendMessage(chatId, `Button pressed: ${data}`);
  }

  // Celebration methods for different events
  async celebrateBoardFill(
    chatId: string | number,
    boardId: string,
    cblUsername: string,
    prizeAmount: string,
  ) {
    const message =
      `🎉🏈 <b>BOARD FILLED!</b> 🏈🎉\n\n` +
      `Board #${boardId} just hit 100 squares!\n\n` +
      `🏆 CBL: @${cblUsername}\n` +
      `💰 Prize Pool: ${prizeAmount} SOL\n` +
      `🔥 Next game starting soon!\n\n` +
      `Great work, coach! 💪`;

    await this.sendMessage(chatId, message, { parse_mode: 'HTML' });

    // Send celebration GIF
    const celebrationGifs = [
      'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', // Football celebration
      'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // Touchdown dance
      'https://media.giphy.com/media/3oz8xQYqVWKIKigga4/giphy.gif', // Victory celebration
    ];

    const randomGif =
      celebrationGifs[Math.floor(Math.random() * celebrationGifs.length)];
    await this.sendAnimation(chatId, randomGif, `🏈 VICTORY! 🏈`);
  }

  async announceNewBoard(
    chatId: string | number,
    boardId: string,
    cblUsername: string,
    gameInfo: string,
  ) {
    const message =
      `🚨 <b>NEW BOARD ALERT!</b> 🚨\n\n` +
      `🏈 Game: ${gameInfo}\n` +
      `🎯 Board ID: #${boardId}\n` +
      `👨‍💼 CBL: @${cblUsername}\n\n` +
      `🔥 Get your squares before they're gone!\n` +
      `💎 Early birds get the best spots!`;

    return this.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }

  async sendWeeklyDigest(
    chatId: string | number,
    username: string,
    stats: {
      boardsCreated: number;
      boardsFilled: number;
      totalRevenue: string;
      bluePoints: number;
      orangePoints: number;
    },
  ) {
    const message =
      `📊 <b>Weekly Digest - ${username}</b>\n\n` +
      `🏈 This week's performance:\n\n` +
      `🎯 Boards Created: ${stats.boardsCreated}\n` +
      `✅ Boards Filled: ${stats.boardsFilled}\n` +
      `💰 Revenue: ${stats.totalRevenue} SOL\n` +
      `🔵 Blue Points: ${stats.bluePoints}\n` +
      `🟠 Orange Points: ${stats.orangePoints}\n\n` +
      `Keep up the great work, coach! 💪`;

    return this.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }
}
