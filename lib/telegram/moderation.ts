import { OCPhilBot } from './bot';
import { TELEGRAM_CONFIG } from './config';
import { TelegramMessage, TelegramUser } from './types';

interface ModerationRule {
  id: string;
  name: string;
  enabled: boolean;
  severity: 'warning' | 'mute' | 'kick' | 'ban';
  pattern?: RegExp;
  keywords?: string[];
  action: (message: TelegramMessage, bot: OCPhilBot) => Promise<void>;
}

interface UserViolation {
  userId: number;
  username?: string;
  violations: {
    ruleId: string;
    timestamp: Date;
    severity: string;
    resolved: boolean;
  }[];
  totalScore: number;
  status: 'clean' | 'warned' | 'restricted' | 'banned';
}

export class TelegramModerationSystem {
  private bot: OCPhilBot;
  private violations: Map<number, UserViolation> = new Map();
  private rules: ModerationRule[] = [];

  constructor(bot: OCPhilBot) {
    this.bot = bot;
    this.initializeRules();
    this.loadViolationHistory();
  }

  private initializeRules() {
    this.rules = [
      {
        id: 'spam_links',
        name: 'Spam Links',
        enabled: true,
        severity: 'warning',
        pattern: /(https?:\/\/[^\s]+)/gi,
        action: this.handleSpamLinks.bind(this),
      },
      {
        id: 'excessive_caps',
        name: 'Excessive Capitals',
        enabled: true,
        severity: 'warning',
        pattern: /[A-Z]{10,}/g,
        action: this.handleExcessiveCaps.bind(this),
      },
      {
        id: 'scam_keywords',
        name: 'Scam Keywords',
        enabled: true,
        severity: 'ban',
        keywords: [
          'free money',
          'guaranteed win',
          'double your crypto',
          'send me your wallet',
        ],
        action: this.handleScamKeywords.bind(this),
      },
      {
        id: 'offensive_language',
        name: 'Offensive Language',
        enabled: true,
        severity: 'warning',
        keywords: ['offensive_word1', 'offensive_word2'], // Replace with actual filter words
        action: this.handleOffensiveLanguage.bind(this),
      },
      {
        id: 'flood_protection',
        name: 'Message Flooding',
        enabled: true,
        severity: 'mute',
        action: this.handleFlooding.bind(this),
      },
    ];
  }

  async moderateMessage(message: TelegramMessage): Promise<boolean> {
    try {
      const user = message.from;
      const text = message.text || '';

      // Check if user is already banned
      const userViolation = this.violations.get(user.id);
      if (userViolation?.status === 'banned') {
        await this.deleteMessage(message);
        return false;
      }

      // Apply moderation rules
      for (const rule of this.rules) {
        if (!rule.enabled) continue;

        let violated = false;

        // Pattern-based rules
        if (rule.pattern && rule.pattern.test(text)) {
          violated = true;
        }

        // Keyword-based rules
        if (rule.keywords) {
          const lowerText = text.toLowerCase();
          violated = rule.keywords.some((keyword) =>
            lowerText.includes(keyword.toLowerCase()),
          );
        }

        // Special case for flood protection
        if (rule.id === 'flood_protection') {
          violated = await this.checkFloodProtection(user.id);
        }

        if (violated) {
          await this.handleViolation(message, rule);

          // If message was deleted/user was banned, stop processing
          if (rule.severity === 'ban' || rule.severity === 'kick') {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error in message moderation:', error);
      return true; // Allow message on error to avoid false positives
    }
  }

  private async handleViolation(
    message: TelegramMessage,
    rule: ModerationRule,
  ) {
    const userId = message.from.id;
    const username = message.from.username;

    // Record violation
    this.recordViolation(userId, username, rule);

    // Execute rule action
    await rule.action(message, this.bot);

    // Check if escalation is needed
    await this.checkEscalation(userId);
  }

  private recordViolation(
    userId: number,
    username: string | undefined,
    rule: ModerationRule,
  ) {
    if (!this.violations.has(userId)) {
      this.violations.set(userId, {
        userId,
        username,
        violations: [],
        totalScore: 0,
        status: 'clean',
      });
    }

    const userViolation = this.violations.get(userId)!;
    userViolation.violations.push({
      ruleId: rule.id,
      timestamp: new Date(),
      severity: rule.severity,
      resolved: false,
    });

    // Update score
    const severityScores = {
      warning: 1,
      mute: 3,
      kick: 5,
      ban: 10,
    };
    userViolation.totalScore += severityScores[rule.severity];
  }

  private async checkEscalation(userId: number) {
    const userViolation = this.violations.get(userId);
    if (!userViolation) return;

    const recentViolations = userViolation.violations.filter(
      (v) => Date.now() - v.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000, // Last 7 days
    );

    // Escalation thresholds
    if (recentViolations.length >= 5 || userViolation.totalScore >= 10) {
      await this.banUser(userId, userViolation.username, 'Multiple violations');
    } else if (recentViolations.length >= 3 || userViolation.totalScore >= 5) {
      await this.restrictUser(
        userId,
        userViolation.username,
        'Repeated violations',
      );
    }
  }

  // Specific rule handlers
  private async handleSpamLinks(message: TelegramMessage, bot: OCPhilBot) {
    await this.deleteMessage(message);
    await this.sendWarning(
      message.chat.id,
      message.from.username || 'User',
      'Please avoid posting external links without permission.',
    );
  }

  private async handleExcessiveCaps(message: TelegramMessage, bot: OCPhilBot) {
    await this.sendWarning(
      message.chat.id,
      message.from.username || 'User',
      'Please avoid using excessive capital letters.',
    );
  }

  private async handleScamKeywords(message: TelegramMessage, bot: OCPhilBot) {
    await this.deleteMessage(message);
    await this.banUser(
      message.from.id,
      message.from.username,
      'Suspected scam content',
    );
  }

  private async handleOffensiveLanguage(
    message: TelegramMessage,
    bot: OCPhilBot,
  ) {
    await this.deleteMessage(message);
    await this.sendWarning(
      message.chat.id,
      message.from.username || 'User',
      'Please keep the conversation respectful and family-friendly.',
    );
  }

  private async handleFlooding(message: TelegramMessage, bot: OCPhilBot) {
    await this.restrictUser(
      message.from.id,
      message.from.username,
      'Message flooding detected - 10 minute timeout',
    );
  }

  private async checkFloodProtection(userId: number): Promise<boolean> {
    // Simple flood protection - max 5 messages per minute
    const now = Date.now();
    const timeWindow = 60 * 1000; // 1 minute
    const maxMessages = 5;

    // This would be stored in Redis or database in production
    const userMessages = this.getUserRecentMessages(userId, timeWindow);

    return userMessages.length > maxMessages;
  }

  private getUserRecentMessages(userId: number, timeWindow: number): any[] {
    // Mock implementation - would use Redis/database in production
    return [];
  }

  // Moderation actions
  private async deleteMessage(message: TelegramMessage) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/deleteMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
          }),
        },
      );

      if (!response.ok) {
        console.error('Failed to delete message:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  private async sendWarning(chatId: number, username: string, reason: string) {
    const warningMessage =
      `⚠️ <b>Moderation Warning</b>\n\n` +
      `@${username || 'User'}: ${reason}\n\n` +
      `Please follow our community guidelines to maintain a positive environment for all CBLs! 🏈`;

    await this.bot.sendMessage(chatId, warningMessage, { parse_mode: 'HTML' });
  }

  private async restrictUser(
    userId: number,
    username: string | undefined,
    reason: string,
  ) {
    try {
      // Restrict user for 10 minutes
      const until = Math.floor(Date.now() / 1000) + 10 * 60;

      if (TELEGRAM_CONFIG.MAIN_GROUP_ID) {
        const response = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/restrictChatMember`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CONFIG.MAIN_GROUP_ID,
              user_id: userId,
              permissions: {
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_polls: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false,
                can_change_info: false,
                can_invite_users: false,
                can_pin_messages: false,
              },
              until_date: until,
            }),
          },
        );

        if (response.ok) {
          const notificationMessage =
            `🔇 <b>User Restricted</b>\n\n` +
            `@${username || 'User'} has been temporarily restricted for 10 minutes.\n` +
            `Reason: ${reason}\n\n` +
            `OC Phil keeps the lounge clean! 🛡️`;

          await this.bot.sendMessage(
            TELEGRAM_CONFIG.MAIN_GROUP_ID,
            notificationMessage,
            { parse_mode: 'HTML' },
          );
        }
      }

      // Update user status
      const userViolation = this.violations.get(userId);
      if (userViolation) {
        userViolation.status = 'restricted';
      }
    } catch (error) {
      console.error('Error restricting user:', error);
    }
  }

  private async banUser(
    userId: number,
    username: string | undefined,
    reason: string,
  ) {
    try {
      if (TELEGRAM_CONFIG.MAIN_GROUP_ID) {
        const response = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/banChatMember`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CONFIG.MAIN_GROUP_ID,
              user_id: userId,
              revoke_messages: true,
            }),
          },
        );

        if (response.ok) {
          const notificationMessage =
            `🚫 <b>User Banned</b>\n\n` +
            `@${username || 'User'} has been permanently banned from the community.\n` +
            `Reason: ${reason}\n\n` +
            `OC Phil maintains a safe space for all CBLs! 🛡️`;

          await this.bot.sendMessage(
            TELEGRAM_CONFIG.MAIN_GROUP_ID,
            notificationMessage,
            { parse_mode: 'HTML' },
          );
        }
      }

      // Update user status
      const userViolation = this.violations.get(userId);
      if (userViolation) {
        userViolation.status = 'banned';
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  }

  // Admin functions
  async getViolationReport(): Promise<UserViolation[]> {
    return Array.from(this.violations.values());
  }

  async clearUserViolations(userId: number): Promise<boolean> {
    if (this.violations.has(userId)) {
      this.violations.delete(userId);
      return true;
    }
    return false;
  }

  async updateRule(
    ruleId: string,
    updates: Partial<ModerationRule>,
  ): Promise<boolean> {
    const ruleIndex = this.rules.findIndex((r) => r.id === ruleId);
    if (ruleIndex >= 0) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
      return true;
    }
    return false;
  }

  private loadViolationHistory() {
    // In production, load from database
    console.log('Loading violation history from database...');
  }

  async saveViolationHistory() {
    // In production, save to database
    console.log('Saving violation history to database...');
  }

  // Privacy controls
  async handleDataRequest(userId: number): Promise<any> {
    const userViolation = this.violations.get(userId);
    if (!userViolation) {
      return { message: 'No data found for this user' };
    }

    return {
      userId: userViolation.userId,
      username: userViolation.username,
      violations: userViolation.violations.map((v) => ({
        rule: v.ruleId,
        timestamp: v.timestamp,
        severity: v.severity,
        resolved: v.resolved,
      })),
      totalScore: userViolation.totalScore,
      status: userViolation.status,
    };
  }

  async deleteUserData(userId: number): Promise<boolean> {
    return this.clearUserViolations(userId);
  }
}
