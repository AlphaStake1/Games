// CBL Milestone Tracking System
// Integrates community size via Telegram API and board performance via Solana PDA

import { Connection, PublicKey } from '@solana/web3.js';

export interface CBLMilestone {
  id: string;
  name: string;
  description: string;
  requirements: MilestoneRequirements;
  rewards: MilestoneRewards;
  category: 'followers' | 'revenue' | 'boards' | 'fill_rate';
}

export interface MilestoneRequirements {
  followers?: number;
  monthlyRevenue?: number;
  monthlyBoards?: number;
  fillRate?: number; // Percentage
  timeframe?: 'monthly' | 'quarterly' | 'all_time';
}

export interface MilestoneRewards {
  customBot?: boolean;
  advancedAnalytics?: boolean;
  prioritySupport?: boolean;
  whiteLabel?: boolean;
  revenueShare?: number; // Percentage
  badge?: string;
  tier?: 'First Stream' | 'Drive Maker' | 'Franchise';
}

export interface CBLProgress {
  cblId: string;
  walletAddress: string;
  platform:
    | 'telegram'
    | 'discord'
    | 'twitter'
    | 'facebook'
    | 'instagram'
    | 'existing';
  platformHandle?: string;
  telegramChatId?: string;

  // Current metrics
  currentFollowers: number;
  monthlyRevenue: number;
  monthlyBoards: number;
  fillRate: number;

  // Historical tracking
  followerHistory: Array<{ date: string; count: number }>;
  revenueHistory: Array<{ date: string; amount: number }>;
  boardHistory: Array<{ date: string; count: number; fillRate: number }>;

  // Milestone progress
  completedMilestones: string[];
  nextMilestone?: CBLMilestone;
  progressToNext: number; // 0-100 percentage

  lastUpdated: Date;
}

export interface TelegramMetrics {
  chatId: string;
  memberCount: number;
  activeMembers?: number;
  messageCount?: number;
  engagementRate?: number;
}

export interface SolanaMetrics {
  boardsPDA: string;
  totalBoards: number;
  completedBoards: number;
  averageFillRate: number;
  totalRevenue: number;
  lastMonthBoards: number;
  lastMonthRevenue: number;
}

// Predefined milestones for CBL progression
export const CBL_MILESTONES: CBLMilestone[] = [
  {
    id: 'community_builder',
    name: 'Community Builder',
    description: 'Build a dedicated community of 500+ followers',
    requirements: {
      followers: 500,
      timeframe: 'all_time',
    },
    rewards: {
      customBot: true,
      advancedAnalytics: true,
      badge: 'Community Builder',
    },
    category: 'followers',
  },
  {
    id: 'board_master',
    name: 'Board Master',
    description: 'Create 25+ boards per month consistently',
    requirements: {
      monthlyBoards: 25,
      timeframe: 'monthly',
    },
    rewards: {
      customBot: true,
      prioritySupport: true,
      badge: 'Board Master',
    },
    category: 'boards',
  },
  {
    id: 'revenue_champion',
    name: 'Revenue Champion',
    description: 'Generate $10,000+ in monthly revenue',
    requirements: {
      monthlyRevenue: 10000,
      timeframe: 'monthly',
    },
    rewards: {
      customBot: true,
      whiteLabel: true,
      revenueShare: 5,
      badge: 'Revenue Champion',
    },
    category: 'revenue',
  },
  {
    id: 'fill_rate_expert',
    name: 'Fill Rate Expert',
    description: 'Maintain 90%+ average fill rate',
    requirements: {
      fillRate: 90,
      timeframe: 'monthly',
    },
    rewards: {
      customBot: true,
      advancedAnalytics: true,
      badge: 'Fill Rate Expert',
    },
    category: 'fill_rate',
  },
];

export class CBLMilestoneTracker {
  private telegramBotToken: string;
  private solanaConnection: Connection;
  private programId: PublicKey;

  constructor(
    telegramBotToken: string,
    solanaRpcUrl: string,
    programId: string,
  ) {
    this.telegramBotToken = telegramBotToken;
    this.solanaConnection = new Connection(solanaRpcUrl, 'confirmed');
    this.programId = new PublicKey(programId);
  }

  /**
   * Fetch community metrics from Telegram API
   */
  async getTelegramMetrics(chatId: string): Promise<TelegramMetrics> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.telegramBotToken}/getChatMemberCount?chat_id=${chatId}`,
      );

      const data = await response.json();

      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
      }

      return {
        chatId,
        memberCount: data.result,
        lastUpdated: new Date(),
      } as TelegramMetrics;
    } catch (error) {
      console.error('Error fetching Telegram metrics:', error);
      throw error;
    }
  }

  /**
   * Fetch board performance metrics from Solana PDA
   */
  async getSolanaMetrics(cblWallet: string): Promise<SolanaMetrics> {
    try {
      // Derive CBL stats PDA
      const [cblStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('cbl_stats'), new PublicKey(cblWallet).toBuffer()],
        this.programId,
      );

      // Fetch account data
      const accountInfo =
        await this.solanaConnection.getAccountInfo(cblStatsPDA);

      if (!accountInfo) {
        // Return empty metrics if no PDA exists yet
        return {
          boardsPDA: cblStatsPDA.toString(),
          totalBoards: 0,
          completedBoards: 0,
          averageFillRate: 0,
          totalRevenue: 0,
          lastMonthBoards: 0,
          lastMonthRevenue: 0,
        };
      }

      // Parse account data (this would need actual program structure)
      const data = this.parseCBLStatsData(accountInfo.data);

      return {
        boardsPDA: cblStatsPDA.toString(),
        ...data,
      };
    } catch (error) {
      console.error('Error fetching Solana metrics:', error);
      throw error;
    }
  }

  /**
   * Parse CBL stats account data from Solana
   */
  private parseCBLStatsData(data: Buffer): Omit<SolanaMetrics, 'boardsPDA'> {
    // This would implement the actual parsing based on your program's data structure
    // For now, returning mock structure
    return {
      totalBoards: 0,
      completedBoards: 0,
      averageFillRate: 0,
      totalRevenue: 0,
      lastMonthBoards: 0,
      lastMonthRevenue: 0,
    };
  }

  /**
   * Update CBL progress with latest metrics
   */
  async updateCBLProgress(
    cblId: string,
    walletAddress: string,
    platform: string,
    platformHandle?: string,
    telegramChatId?: string,
  ): Promise<CBLProgress> {
    try {
      // Fetch metrics from both sources
      const [telegramMetrics, solanaMetrics] = await Promise.all([
        telegramChatId
          ? this.getTelegramMetrics(telegramChatId)
          : Promise.resolve(null),
        this.getSolanaMetrics(walletAddress),
      ]);

      // Calculate current metrics
      const currentFollowers = telegramMetrics?.memberCount || 0;
      const monthlyRevenue = solanaMetrics.lastMonthRevenue;
      const monthlyBoards = solanaMetrics.lastMonthBoards;
      const fillRate = solanaMetrics.averageFillRate;

      // Find next milestone and calculate progress
      const { nextMilestone, progressToNext, completedMilestones } =
        this.calculateMilestoneProgress(
          currentFollowers,
          monthlyRevenue,
          monthlyBoards,
          fillRate,
        );

      // Create progress object
      const progress: CBLProgress = {
        cblId,
        walletAddress,
        platform: platform as any,
        platformHandle,
        currentFollowers,
        monthlyRevenue,
        monthlyBoards,
        fillRate,
        followerHistory: [], // Would load from database
        revenueHistory: [], // Would load from database
        boardHistory: [], // Would load from database
        completedMilestones,
        nextMilestone,
        progressToNext,
        lastUpdated: new Date(),
      };

      // Store in database (implementation needed)
      await this.storeCBLProgress(progress);

      return progress;
    } catch (error) {
      console.error('Error updating CBL progress:', error);
      throw error;
    }
  }

  /**
   * Calculate milestone progress and identify next targets
   */
  private calculateMilestoneProgress(
    followers: number,
    monthlyRevenue: number,
    monthlyBoards: number,
    fillRate: number,
  ): {
    nextMilestone?: CBLMilestone;
    progressToNext: number;
    completedMilestones: string[];
  } {
    const completed: string[] = [];
    let nextMilestone: CBLMilestone | undefined;
    let progressToNext = 0;

    // Check each milestone
    for (const milestone of CBL_MILESTONES) {
      const isCompleted = this.checkMilestoneCompletion(
        milestone,
        followers,
        monthlyRevenue,
        monthlyBoards,
        fillRate,
      );

      if (isCompleted) {
        completed.push(milestone.id);
      } else if (!nextMilestone) {
        // This is the next milestone to work towards
        nextMilestone = milestone;
        progressToNext = this.calculateProgressPercentage(
          milestone,
          followers,
          monthlyRevenue,
          monthlyBoards,
          fillRate,
        );
      }
    }

    return {
      nextMilestone,
      progressToNext,
      completedMilestones: completed,
    };
  }

  /**
   * Check if a milestone is completed
   */
  private checkMilestoneCompletion(
    milestone: CBLMilestone,
    followers: number,
    monthlyRevenue: number,
    monthlyBoards: number,
    fillRate: number,
  ): boolean {
    const req = milestone.requirements;

    if (req.followers && followers < req.followers) return false;
    if (req.monthlyRevenue && monthlyRevenue < req.monthlyRevenue) return false;
    if (req.monthlyBoards && monthlyBoards < req.monthlyBoards) return false;
    if (req.fillRate && fillRate < req.fillRate) return false;

    return true;
  }

  /**
   * Calculate progress percentage towards a milestone
   */
  private calculateProgressPercentage(
    milestone: CBLMilestone,
    followers: number,
    monthlyRevenue: number,
    monthlyBoards: number,
    fillRate: number,
  ): number {
    const req = milestone.requirements;

    // Calculate progress for the primary requirement
    switch (milestone.category) {
      case 'followers':
        return req.followers
          ? Math.min(100, (followers / req.followers) * 100)
          : 0;
      case 'revenue':
        return req.monthlyRevenue
          ? Math.min(100, (monthlyRevenue / req.monthlyRevenue) * 100)
          : 0;
      case 'boards':
        return req.monthlyBoards
          ? Math.min(100, (monthlyBoards / req.monthlyBoards) * 100)
          : 0;
      case 'fill_rate':
        return req.fillRate
          ? Math.min(100, (fillRate / req.fillRate) * 100)
          : 0;
      default:
        return 0;
    }
  }

  /**
   * Store CBL progress in database
   */
  private async storeCBLProgress(progress: CBLProgress): Promise<void> {
    // Implementation would store in your database
    // For now, just log
    console.log(
      'Storing CBL progress:',
      progress.cblId,
      progress.progressToNext,
    );
  }

  /**
   * Get CBL progress by ID
   */
  async getCBLProgress(cblId: string): Promise<CBLProgress | null> {
    // Implementation would fetch from database
    // For now, return null
    return null;
  }

  /**
   * Check if CBL has achieved any new milestones
   */
  async checkForNewMilestones(cblId: string): Promise<CBLMilestone[]> {
    const progress = await this.getCBLProgress(cblId);
    if (!progress) return [];

    // Compare current milestones with stored ones
    const newMilestones: CBLMilestone[] = [];

    // Implementation would check for newly completed milestones
    // and trigger rewards/notifications

    return newMilestones;
  }

  /**
   * Get milestone leaderboard
   */
  async getMilestoneLeaderboard(
    category?: 'followers' | 'revenue' | 'boards' | 'fill_rate',
    limit = 10,
  ): Promise<CBLProgress[]> {
    // Implementation would fetch and sort CBLs by metrics
    return [];
  }

  /**
   * Trigger milestone reward (custom bot creation, etc.)
   */
  async triggerMilestoneReward(
    cblId: string,
    milestone: CBLMilestone,
  ): Promise<void> {
    console.log(`Triggering reward for ${cblId}: ${milestone.name}`);

    if (milestone.rewards.customBot) {
      // Trigger bot cloning script
      await this.createCustomBot(cblId);
    }

    if (milestone.rewards.advancedAnalytics) {
      // Enable advanced analytics features
      await this.enableAdvancedAnalytics(cblId);
    }

    // Additional reward implementations...
  }

  /**
   * Create custom bot for milestone reward
   */
  private async createCustomBot(cblId: string): Promise<void> {
    try {
      // Import and use the bot cloning service
      const { CBLBotCloner, generateBotUsername, generateBotName } =
        await import('./botCloner');

      // Get CBL progress to determine platform and handle
      const progress = await this.getCBLProgress(cblId);
      if (!progress) {
        console.error(`No progress found for CBL: ${cblId}`);
        return;
      }

      // Generate bot configuration
      const botUsername = generateBotUsername(cblId, progress.platformHandle);
      const botNames = generateBotName(progress.platformHandle);

      const botCloner = new CBLBotCloner(
        process.env.TELEGRAM_BOT_FATHER_TOKEN || '',
        process.env.WEBHOOK_BASE_URL || 'https://api.your-domain.com',
        process.env.OC_PHIL_BOT_TOKEN || '',
        null, // Database connection not available in this context
      );

      const botRequest = {
        cblId,
        walletAddress: progress.walletAddress,
        botName: botNames[0], // Use first suggested name
        botUsername,
        description: `Your personal squares coach for ${progress.platformHandle || 'your community'}! 🏈`,
        platformHandle: progress.platformHandle,
        telegramChatId: progress.telegramChatId,
      };

      console.log(`Creating custom bot for CBL: ${cblId}`, botRequest);

      const result = await botCloner.createCustomBot(botRequest);

      if (result.success) {
        console.log(
          `✅ Custom bot created successfully for CBL ${cblId}: @${result.botUsername}`,
        );

        // Store bot creation in milestone achievements
        await this.recordMilestoneReward(cblId, 'custom_bot', {
          botUsername: result.botUsername,
          botToken: result.botToken, // Store securely
          inviteLink: result.inviteLink,
          createdAt: new Date().toISOString(),
        });
      } else {
        console.error(
          `❌ Failed to create custom bot for CBL ${cblId}:`,
          result.error,
        );
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error in createCustomBot:', error);
      // Continue with other milestone rewards even if bot creation fails
    }
  }

  /**
   * Enable advanced analytics
   */
  private async enableAdvancedAnalytics(cblId: string): Promise<void> {
    // Enable advanced dashboard features
    console.log(`Enabling advanced analytics for CBL: ${cblId}`);
  }

  /**
   * Record milestone reward achievement in database
   */
  private async recordMilestoneReward(
    cblId: string,
    rewardType: string,
    rewardData: Record<string, any>,
  ): Promise<void> {
    try {
      // This would store the reward achievement in your database
      console.log(`Recording milestone reward for CBL ${cblId}:`, {
        rewardType,
        rewardData,
        timestamp: new Date().toISOString(),
      });

      // Example database operation:
      /*
      await this.database.query(`
        INSERT INTO cbl_milestone_rewards (
          cbl_id, reward_type, reward_data, created_at
        ) VALUES ($1, $2, $3, $4)
      `, [
        cblId,
        rewardType,
        JSON.stringify(rewardData),
        new Date()
      ]);
      */
    } catch (error) {
      console.error('Error recording milestone reward:', error);
    }
  }
}

// Utility functions for milestone tracking

/**
 * Format milestone progress for display
 */
export function formatMilestoneProgress(progress: CBLProgress): string {
  if (!progress.nextMilestone) {
    return 'All milestones completed! 🎉';
  }

  const req = progress.nextMilestone.requirements;
  const category = progress.nextMilestone.category;

  switch (category) {
    case 'followers':
      return `${progress.currentFollowers.toLocaleString()} / ${req.followers?.toLocaleString()} followers`;
    case 'revenue':
      return `$${progress.monthlyRevenue.toLocaleString()} / $${req.monthlyRevenue?.toLocaleString()} monthly revenue`;
    case 'boards':
      return `${progress.monthlyBoards} / ${req.monthlyBoards} boards this month`;
    case 'fill_rate':
      return `${progress.fillRate.toFixed(1)}% / ${req.fillRate}% fill rate`;
    default:
      return `${progress.progressToNext.toFixed(0)}% complete`;
  }
}

/**
 * Get milestone icon
 */
export function getMilestoneIcon(category: string): string {
  switch (category) {
    case 'followers':
      return '👥';
    case 'revenue':
      return '💰';
    case 'boards':
      return '🎯';
    case 'fill_rate':
      return '📊';
    default:
      return '🏆';
  }
}

/**
 * Get next milestone recommendations
 */
export function getMilestoneRecommendations(progress: CBLProgress): string[] {
  if (!progress.nextMilestone) return [];

  const recommendations: string[] = [];
  const category = progress.nextMilestone.category;

  switch (category) {
    case 'followers':
      recommendations.push(
        'Share engaging content daily',
        'Collaborate with other CBLs',
        'Run community contests',
        'Cross-promote on other platforms',
      );
      break;
    case 'revenue':
      recommendations.push(
        'Increase board entry fees gradually',
        'Create premium board tiers',
        'Build community trust',
        'Optimize board timing',
      );
      break;
    case 'boards':
      recommendations.push(
        'Schedule boards for all major games',
        'Create themed boards',
        'Automate board creation',
        'Plan seasonal campaigns',
      );
      break;
    case 'fill_rate':
      recommendations.push(
        'Post boards earlier',
        'Build anticipation',
        'Price competitively',
        'Engage community actively',
      );
      break;
  }

  return recommendations;
}
