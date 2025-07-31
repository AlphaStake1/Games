// CBL Reward Service
// Orchestrates milestone tracking, bot creation, and tip integration

import {
  CBLMilestoneTracker,
  CBLProgress,
  CBLMilestone,
} from './milestoneTracker';
import { CBLBotCloner, BotCreationRequest } from './botCloner';
import { OCPhilTipsService, TipResource } from './ocPhilTipsIntegration';

export interface CBLRewardTrigger {
  cblId: string;
  milestone: CBLMilestone;
  progress: CBLProgress;
  timestamp: Date;
}

export interface CBLRewardResult {
  success: boolean;
  rewards: {
    customBot?: {
      created: boolean;
      botUsername?: string;
      error?: string;
    };
    advancedAnalytics?: {
      enabled: boolean;
    };
    prioritySupport?: {
      enabled: boolean;
    };
    personalizedTips?: {
      enabled: boolean;
      tipCount: number;
    };
  };
  message: string;
}

export class CBLRewardService {
  private milestoneTracker: CBLMilestoneTracker;
  private botCloner: CBLBotCloner;

  constructor(
    telegramBotToken: string,
    solanaRpcUrl: string,
    programId: string,
    botFatherToken: string,
    webhookBaseUrl: string,
    database: any,
  ) {
    this.milestoneTracker = new CBLMilestoneTracker(
      telegramBotToken,
      solanaRpcUrl,
      programId,
    );

    this.botCloner = new CBLBotCloner(
      botFatherToken,
      webhookBaseUrl,
      telegramBotToken,
      database,
    );
  }

  /**
   * Check for new milestones and trigger rewards
   */
  async checkAndRewardMilestones(cblId: string): Promise<CBLRewardResult[]> {
    try {
      const newMilestones =
        await this.milestoneTracker.checkForNewMilestones(cblId);
      const results: CBLRewardResult[] = [];

      for (const milestone of newMilestones) {
        const progress = await this.milestoneTracker.getCBLProgress(cblId);
        if (!progress) continue;

        const trigger: CBLRewardTrigger = {
          cblId,
          milestone,
          progress,
          timestamp: new Date(),
        };

        const result = await this.processMilestoneReward(trigger);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error checking and rewarding milestones:', error);
      return [
        {
          success: false,
          rewards: {},
          message: `Error processing milestones: ${error}`,
        },
      ];
    }
  }

  /**
   * Process a single milestone reward
   */
  async processMilestoneReward(
    trigger: CBLRewardTrigger,
  ): Promise<CBLRewardResult> {
    const { cblId, milestone, progress } = trigger;
    const result: CBLRewardResult = {
      success: true,
      rewards: {},
      message: `🎉 Milestone "${milestone.name}" achieved!`,
    };

    try {
      // Process custom bot reward
      if (milestone.rewards.customBot) {
        result.rewards.customBot = await this.createMilestoneBot(
          cblId,
          progress,
        );
      }

      // Process advanced analytics reward
      if (milestone.rewards.advancedAnalytics) {
        result.rewards.advancedAnalytics =
          await this.enableAdvancedAnalytics(cblId);
      }

      // Process priority support reward
      if (milestone.rewards.prioritySupport) {
        result.rewards.prioritySupport =
          await this.enablePrioritySupport(cblId);
      }

      // Generate personalized tips based on new milestone
      result.rewards.personalizedTips = await this.generatePersonalizedTips(
        progress,
        milestone,
      );

      // Send celebration message to CBL's community
      await this.sendMilestoneCelebration(trigger);

      return result;
    } catch (error) {
      console.error('Error processing milestone reward:', error);
      return {
        success: false,
        rewards: {},
        message: `Failed to process milestone reward: ${error}`,
      };
    }
  }

  /**
   * Create custom bot for milestone achievement
   */
  private async createMilestoneBot(
    cblId: string,
    progress: CBLProgress,
  ): Promise<CBLRewardResult['rewards']['customBot']> {
    try {
      const { generateBotUsername, generateBotName, validateBotRequest } =
        await import('./botCloner');

      const botUsername = generateBotUsername(cblId, progress.platformHandle);
      const botNames = generateBotName(progress.platformHandle);

      const botRequest: BotCreationRequest = {
        cblId,
        walletAddress: progress.walletAddress,
        botName: botNames[0],
        botUsername,
        description: `Your personal squares coach for ${progress.platformHandle || 'your community'}! 🏈 Milestone reward activated.`,
        platformHandle: progress.platformHandle,
        telegramChatId: progress.telegramChatId,
      };

      // Validate request
      const validation = validateBotRequest(botRequest);
      if (!validation.valid) {
        return {
          created: false,
          error: validation.errors.join(', '),
        };
      }

      const result = await this.botCloner.createCustomBot(botRequest);

      return {
        created: result.success,
        botUsername: result.botUsername,
        error: result.error,
      };
    } catch (error) {
      return {
        created: false,
        error: `Bot creation failed: ${error}`,
      };
    }
  }

  /**
   * Enable advanced analytics features
   */
  private async enableAdvancedAnalytics(
    cblId: string,
  ): Promise<{ enabled: boolean }> {
    try {
      // This would integrate with your analytics service
      console.log(`🔍 Enabling advanced analytics for CBL: ${cblId}`);

      // Example: Update user permissions in database
      // await this.database.updateUserFeatures(cblId, { advancedAnalytics: true });

      return { enabled: true };
    } catch (error) {
      console.error('Failed to enable advanced analytics:', error);
      return { enabled: false };
    }
  }

  /**
   * Enable priority support features
   */
  private async enablePrioritySupport(
    cblId: string,
  ): Promise<{ enabled: boolean }> {
    try {
      console.log(`🎧 Enabling priority support for CBL: ${cblId}`);

      // Example: Add to priority support queue
      // await this.database.updateUserFeatures(cblId, { prioritySupport: true });

      return { enabled: true };
    } catch (error) {
      console.error('Failed to enable priority support:', error);
      return { enabled: false };
    }
  }

  /**
   * Generate personalized tips based on milestone achievement
   */
  private async generatePersonalizedTips(
    progress: CBLProgress,
    milestone: CBLMilestone,
  ): Promise<{ enabled: boolean; tipCount: number }> {
    try {
      // Get platform-specific tips
      const platformTips = OCPhilTipsService.getTipsByPlatform(
        progress.platform,
      );

      // Get progress-based recommendations
      const recommendedTips = OCPhilTipsService.getRecommendedTips(
        progress.platform,
        progress.currentFollowers,
        progress.monthlyBoards,
        progress.fillRate,
      );

      // Get milestone-specific tips
      const milestoneTips = this.getMilestoneSpecificTips(milestone, progress);

      // Combine and deduplicate
      const allTips = [...recommendedTips, ...milestoneTips];
      const uniqueTips = allTips.filter(
        (tip, index, self) => index === self.findIndex((t) => t.id === tip.id),
      );

      console.log(
        `📚 Generated ${uniqueTips.length} personalized tips for CBL: ${progress.cblId}`,
      );

      return {
        enabled: true,
        tipCount: uniqueTips.length,
      };
    } catch (error) {
      console.error('Failed to generate personalized tips:', error);
      return { enabled: false, tipCount: 0 };
    }
  }

  /**
   * Get tips specific to milestone achievement
   */
  private getMilestoneSpecificTips(
    milestone: CBLMilestone,
    progress: CBLProgress,
  ): TipResource[] {
    const tips: TipResource[] = [];

    switch (milestone.category) {
      case 'followers':
        tips.push(
          ...OCPhilTipsService.getTipsByPlatform(progress.platform, 'growth'),
        );
        break;
      case 'revenue':
        tips.push(
          ...OCPhilTipsService.getTipsByPlatform('general', 'monetization'),
        );
        break;
      case 'boards':
        tips.push(...OCPhilTipsService.getTipsByPlatform('general', 'content'));
        break;
      case 'fill_rate':
        // Add specific pricing and strategy tips
        const pricingTip = OCPhilTipsService.searchTips('pricing')[0];
        if (pricingTip) tips.push(pricingTip);
        break;
    }

    return tips;
  }

  /**
   * Send milestone celebration to CBL's community
   */
  private async sendMilestoneCelebration(
    trigger: CBLRewardTrigger,
  ): Promise<void> {
    const { cblId, milestone, progress } = trigger;

    try {
      if (!progress.telegramChatId) {
        console.log('No Telegram chat ID available for celebration message');
        return;
      }

      const celebrationMessage = this.formatCelebrationMessage(
        milestone,
        progress,
      );

      // Send via OC Phil bot initially, custom bot will take over after creation
      const botToken = process.env.OC_PHIL_BOT_TOKEN;
      if (!botToken) {
        console.warn('No OC Phil bot token available for celebration');
        return;
      }

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: progress.telegramChatId,
          text: celebrationMessage,
          parse_mode: 'Markdown',
        }),
      });

      console.log(`🎉 Sent milestone celebration to CBL ${cblId}`);
    } catch (error) {
      console.error('Failed to send milestone celebration:', error);
    }
  }

  /**
   * Format milestone celebration message
   */
  private formatCelebrationMessage(
    milestone: CBLMilestone,
    progress: CBLProgress,
  ): string {
    const platformEmoji = this.getPlatformEmoji(progress.platform);
    const milestoneEmoji = this.getMilestoneEmoji(milestone.category);

    let message = `${milestoneEmoji} **MILESTONE ACHIEVED!** ${milestoneEmoji}\n\n`;
    message += `🏆 **${milestone.name}**\n`;
    message += `${milestone.description}\n\n`;

    message += `${platformEmoji} **Your Progress:**\n`;
    message += `• Platform: ${progress.platform.charAt(0).toUpperCase() + progress.platform.slice(1)}\n`;
    if (progress.platformHandle) {
      message += `• Handle: @${progress.platformHandle}\n`;
    }
    message += `• Followers: ${progress.currentFollowers.toLocaleString()}\n`;
    message += `• Monthly Boards: ${progress.monthlyBoards}\n`;
    message += `• Fill Rate: ${progress.fillRate.toFixed(1)}%\n`;
    message += `• Monthly Revenue: $${progress.monthlyRevenue.toLocaleString()}\n\n`;

    message += `🎁 **Rewards Unlocked:**\n`;
    if (milestone.rewards.customBot) {
      message += `🤖 Personal coaching bot\n`;
    }
    if (milestone.rewards.advancedAnalytics) {
      message += `📊 Advanced analytics dashboard\n`;
    }
    if (milestone.rewards.prioritySupport) {
      message += `🎧 Priority support access\n`;
    }
    if (milestone.rewards.whiteLabel) {
      message += `🏷️ White-label features\n`;
    }
    if (milestone.rewards.revenueShare) {
      message += `💰 ${milestone.rewards.revenueShare}% revenue share boost\n`;
    }

    message += `\n🚀 Keep building your empire! Your community is lucky to have you.\n\n`;
    message += `*Want to see what's next? Use /tips for personalized growth strategies!*`;

    return message;
  }

  /**
   * Get platform emoji
   */
  private getPlatformEmoji(platform: string): string {
    const emojis: Record<string, string> = {
      telegram: '💬',
      discord: '🎮',
      twitter: '🐦',
      facebook: '📘',
      instagram: '📸',
      existing: '🏘️',
    };
    return emojis[platform] || '🌐';
  }

  /**
   * Get milestone category emoji
   */
  private getMilestoneEmoji(category: string): string {
    const emojis: Record<string, string> = {
      followers: '👥',
      revenue: '💰',
      boards: '🎯',
      fill_rate: '📊',
    };
    return emojis[category] || '🏆';
  }

  /**
   * Get CBL's current progress
   */
  async getCBLProgress(cblId: string): Promise<CBLProgress | null> {
    return this.milestoneTracker.getCBLProgress(cblId);
  }

  /**
   * Update CBL progress manually (for testing or admin purposes)
   */
  async updateCBLProgress(
    cblId: string,
    walletAddress: string,
    platform: string,
    platformHandle?: string,
    telegramChatId?: string,
  ): Promise<CBLProgress> {
    return this.milestoneTracker.updateCBLProgress(
      cblId,
      walletAddress,
      platform,
      platformHandle,
      telegramChatId,
    );
  }

  /**
   * Manually trigger milestone check (for admin or scheduled jobs)
   */
  async triggerMilestoneCheck(cblId: string): Promise<CBLRewardResult[]> {
    return this.checkAndRewardMilestones(cblId);
  }

  /**
   * Get available tips for a CBL
   */
  async getCBLTips(cblId: string): Promise<TipResource[]> {
    const progress = await this.milestoneTracker.getCBLProgress(cblId);
    if (!progress) return [];

    return OCPhilTipsService.getRecommendedTips(
      progress.platform,
      progress.currentFollowers,
      progress.monthlyBoards,
      progress.fillRate,
    );
  }

  /**
   * Search tips by keyword for a CBL
   */
  searchTips(query: string): TipResource[] {
    return OCPhilTipsService.searchTips(query);
  }
}

// Service is already exported with the class declaration above
