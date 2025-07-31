/**
 * Enhanced Referral Service
 * Handles referral code stamping, bonus distributions, and transfer player logic
 */

import {
  Player,
  ReferralReward,
  BonusEligibility,
  RewardContext,
  PlayerActivity,
} from '@/lib/types/player';

export interface ReferralStampRequest {
  playerId: string;
  newReferralCode: string;
  isTransfer: boolean;
  transferReason?: string;
  walletSignature?: string;
}

export interface ReferralStampResponse {
  success: boolean;
  message: string;
  oldReferralCode?: string;
  newReferralCode?: string;
  preservedOriginalCode?: string;
  error?: string;
}

export interface BonusProcessingResult {
  playerBonusAwarded: boolean;
  cblBonusAwarded: boolean;
  bonusAmount: number;
  commissionAmount: number;
  reason: string;
  rewardIds: string[];
}

export class ReferralService {
  private database: any;
  private notificationService: any;

  constructor(database: any, notificationService: any) {
    this.database = database;
    this.notificationService = notificationService;
  }

  /**
   * Stamp a player with a new referral code (for transfers)
   */
  async stampPlayerWithReferralCode(
    request: ReferralStampRequest,
  ): Promise<ReferralStampResponse> {
    try {
      const player = await this.database.getPlayer(request.playerId);
      if (!player) {
        return {
          success: false,
          message: 'Player not found',
          error: 'PLAYER_NOT_FOUND',
        };
      }

      const oldReferralCode = player.referralCode;
      const originalReferralCode =
        player.originalReferralCode || player.referralCode;

      // Begin transaction
      await this.database.beginTransaction();

      try {
        // Update player with new referral code
        const updateData: Partial<Player> = {
          referralCode: request.newReferralCode,
          // Preserve original referral code for new players
          originalReferralCode:
            player.originalReferralCode || player.referralCode,
          transferPlayer: request.isTransfer || player.transferPlayer,
          updatedAt: new Date(),
        };

        await this.database.updatePlayer(request.playerId, updateData);

        // Log the referral code change
        const activity: PlayerActivity = {
          id: this.generateActivityId(),
          playerId: request.playerId,
          activityType: request.isTransfer
            ? 'community_transfer'
            : 'referral_signup',
          description: `Referral code updated from ${oldReferralCode} to ${request.newReferralCode}`,
          metadata: {
            oldReferralCode,
            newReferralCode: request.newReferralCode,
            originalReferralCode,
            isTransfer: request.isTransfer,
            transferReason: request.transferReason,
            walletSignature: request.walletSignature,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date(),
        };

        await this.database.logPlayerActivity(activity);

        await this.database.commitTransaction();

        // Send notifications
        await this.notifyReferralCodeChange(
          player,
          oldReferralCode,
          request.newReferralCode,
        );

        return {
          success: true,
          message: request.isTransfer
            ? `Successfully transferred to new community with referral code ${request.newReferralCode}`
            : `Referral code updated to ${request.newReferralCode}`,
          oldReferralCode,
          newReferralCode: request.newReferralCode,
          preservedOriginalCode: originalReferralCode,
        };
      } catch (error) {
        await this.database.rollbackTransaction();
        throw error;
      }
    } catch (error) {
      console.error('Error stamping player with referral code:', error);
      return {
        success: false,
        message: 'Failed to update referral code',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Process bonus points and commissions based on player transfer status
   */
  async processBonusDistribution(
    playerId: string,
    activityType:
      | 'referral_signup'
      | 'nft_mint'
      | 'board_purchase'
      | 'activity_bonus',
    amount?: number,
    metadata?: Record<string, any>,
  ): Promise<BonusProcessingResult> {
    try {
      const player = await this.database.getPlayer(playerId);
      if (!player) {
        throw new Error('Player not found');
      }

      // Create reward context
      const context: RewardContext = {
        isNewPlayer: !player.transferPlayer && player.transferCount === 0,
        isTransferPlayer: player.transferPlayer,
        referringCBL: player.currentCBLId,
        activityType,
        amount,
      };

      // Determine bonus eligibility
      const bonusEligibility = this.determineBonusEligibility(context);

      let playerBonusAwarded = false;
      let cblBonusAwarded = false;
      let bonusAmount = 0;
      let commissionAmount = 0;
      const rewardIds: string[] = [];

      // Process player bonus (only for new players, not transfers)
      if (bonusEligibility.playerBonus) {
        const playerRewardResult = await this.awardPlayerBonus(
          player,
          context,
          metadata,
        );

        if (playerRewardResult.success) {
          playerBonusAwarded = true;
          bonusAmount = playerRewardResult.amount;
          rewardIds.push(playerRewardResult.rewardId);
        }
      }

      // Process CBL commission/bonus (applies to both new and transferred players)
      if (bonusEligibility.cblBonus) {
        const cblRewardResult = await this.awardCBLCommission(
          player,
          context,
          metadata,
        );

        if (cblRewardResult.success) {
          cblBonusAwarded = true;
          commissionAmount = cblRewardResult.amount;
          rewardIds.push(cblRewardResult.rewardId);
        }
      }

      return {
        playerBonusAwarded,
        cblBonusAwarded,
        bonusAmount,
        commissionAmount,
        reason: bonusEligibility.reason,
        rewardIds,
      };
    } catch (error) {
      console.error('Error processing bonus distribution:', error);
      return {
        playerBonusAwarded: false,
        cblBonusAwarded: false,
        bonusAmount: 0,
        commissionAmount: 0,
        reason: `Error processing bonuses: ${error}`,
        rewardIds: [],
      };
    }
  }

  /**
   * Determine bonus eligibility based on player status and activity
   */
  private determineBonusEligibility(context: RewardContext): BonusEligibility {
    const { isNewPlayer, isTransferPlayer, activityType } = context;

    // New player referral signup
    if (
      activityType === 'referral_signup' &&
      isNewPlayer &&
      !isTransferPlayer
    ) {
      return {
        playerBonus: true,
        cblBonus: true,
        reason:
          'New player signup - full bonuses awarded to both player and CBL',
      };
    }

    // Transfer player referral (someone uses transferred player's code)
    if (activityType === 'referral_signup' && isTransferPlayer) {
      return {
        playerBonus: false, // No bonus points for transferred player
        cblBonus: true, // CBL still gets benefits
        reason:
          'Referral by transfer player - CBL gets benefits, no bonus points for referring player',
      };
    }

    // NFT minting (always gives CBL commission)
    if (activityType === 'nft_mint') {
      return {
        playerBonus: false, // No player bonus for NFT minting
        cblBonus: true, // CBL always gets 30% commission
        reason: `NFT mint commission - 30% to CBL (transfer player: ${isTransferPlayer})`,
      };
    }

    // Board purchases
    if (activityType === 'board_purchase') {
      if (isNewPlayer && !isTransferPlayer) {
        return {
          playerBonus: true, // New players might get activity bonuses
          cblBonus: true, // CBL gets activity rewards
          reason: 'New player board purchase - activity bonuses awarded',
        };
      } else if (isTransferPlayer) {
        return {
          playerBonus: false, // No bonus for transferred players
          cblBonus: true, // CBL still gets rewards for player activity
          reason: 'Transfer player board purchase - CBL rewards only',
        };
      }
    }

    // Default: no bonuses
    return {
      playerBonus: false,
      cblBonus: false,
      reason: 'Standard activity - no special bonuses applicable',
    };
  }

  /**
   * Award bonus points to a player
   */
  private async awardPlayerBonus(
    player: Player,
    context: RewardContext,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; amount: number; rewardId: string }> {
    try {
      // Determine bonus amount based on activity type
      let bonusAmount = 0;
      let rewardType: ReferralReward['rewardType'] = 'activity_bonus';

      switch (context.activityType) {
        case 'referral_signup':
          bonusAmount = 500; // Standard referral bonus
          rewardType = 'signup_bonus';
          break;
        case 'board_purchase':
          bonusAmount = 50; // Activity bonus
          rewardType = 'activity_bonus';
          break;
        default:
          bonusAmount = 25; // Default activity bonus
          rewardType = 'activity_bonus';
      }

      const rewardId = this.generateRewardId();
      const reward: ReferralReward = {
        id: rewardId,
        playerId: player.id,
        referredPlayerId: player.id,
        cblId: player.currentCBLId,
        rewardType,
        amount: bonusAmount,
        currency: 'points',
        isTransferPlayer: player.transferPlayer,
        status: 'pending',
        metadata: {
          activityType: context.activityType,
          originalAmount: context.amount,
          bonusReason: 'Player activity bonus',
          ...metadata,
        },
        createdAt: new Date(),
      };

      await this.database.createReferralReward(reward);

      // Update player points balance
      await this.database.updatePlayerPoints(player.id, bonusAmount);

      return {
        success: true,
        amount: bonusAmount,
        rewardId,
      };
    } catch (error) {
      console.error('Error awarding player bonus:', error);
      return {
        success: false,
        amount: 0,
        rewardId: '',
      };
    }
  }

  /**
   * Award commission/rewards to CBL
   */
  private async awardCBLCommission(
    player: Player,
    context: RewardContext,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; amount: number; rewardId: string }> {
    try {
      let commissionAmount = 0;
      let rewardType: ReferralReward['rewardType'] = 'activity_bonus';
      let currency: 'points' | 'usd' = 'points';

      switch (context.activityType) {
        case 'nft_mint':
          // 30% commission on NFT minting
          commissionAmount = (context.amount || 0) * 0.3;
          rewardType = 'nft_commission';
          currency = 'usd';
          break;
        case 'referral_signup':
          // CBL gets points for successful referrals
          commissionAmount = 250;
          rewardType = 'signup_bonus';
          currency = 'points';
          break;
        case 'board_purchase':
          // Small commission on board purchases
          commissionAmount = (context.amount || 0) * 0.05;
          rewardType = 'activity_bonus';
          currency = 'usd';
          break;
        default:
          // Default CBL activity reward
          commissionAmount = 10;
          rewardType = 'activity_bonus';
          currency = 'points';
      }

      const rewardId = this.generateRewardId();
      const reward: ReferralReward = {
        id: rewardId,
        playerId: player.id,
        referredPlayerId: player.id,
        cblId: player.currentCBLId,
        rewardType,
        amount: commissionAmount,
        currency,
        isTransferPlayer: player.transferPlayer,
        status: 'pending',
        metadata: {
          activityType: context.activityType,
          originalAmount: context.amount,
          commissionRate: context.activityType === 'nft_mint' ? 0.3 : undefined,
          rewardReason: 'CBL commission/reward',
          ...metadata,
        },
        createdAt: new Date(),
      };

      await this.database.createReferralReward(reward);

      return {
        success: true,
        amount: commissionAmount,
        rewardId,
      };
    } catch (error) {
      console.error('Error awarding CBL commission:', error);
      return {
        success: false,
        amount: 0,
        rewardId: '',
      };
    }
  }

  /**
   * Get player's referral history and status
   */
  async getPlayerReferralStatus(playerId: string) {
    try {
      const player = await this.database.getPlayer(playerId);
      if (!player) {
        throw new Error('Player not found');
      }

      const referralHistory =
        await this.database.getPlayerReferralHistory(playerId);
      const rewardsSummary =
        await this.database.getPlayerRewardsSummary(playerId);

      return {
        currentReferralCode: player.referralCode,
        originalReferralCode: player.originalReferralCode,
        isTransferPlayer: player.transferPlayer,
        transferCount: player.transferCount,
        lastTransferDate: player.lastTransferDate,
        currentCBL: player.currentCBLId,
        previousCBLs: player.previousCBLIds,
        referralHistory,
        rewardsSummary,
      };
    } catch (error) {
      console.error('Error getting player referral status:', error);
      throw error;
    }
  }

  /**
   * Validate referral code and get CBL info
   */
  async validateReferralCode(referralCode: string) {
    try {
      const cbl = await this.database.getCBLByReferralCode(referralCode);
      if (!cbl) {
        return {
          valid: false,
          error: 'Invalid referral code',
        };
      }

      if (!cbl.isActive) {
        return {
          valid: false,
          error: 'CBL is currently inactive',
        };
      }

      return {
        valid: true,
        cbl: {
          id: cbl.id,
          name: cbl.name,
          handle: cbl.handle,
          description: cbl.description,
          memberCount: cbl.memberCount,
          maxMembers: cbl.maxMembers,
        },
      };
    } catch (error) {
      console.error('Error validating referral code:', error);
      return {
        valid: false,
        error: 'Error validating referral code',
      };
    }
  }

  /**
   * Send notification about referral code change
   */
  private async notifyReferralCodeChange(
    player: Player,
    oldCode: string,
    newCode: string,
  ): Promise<void> {
    try {
      if (this.notificationService) {
        await this.notificationService.sendNotification({
          type: 'referral_code_change',
          playerId: player.id,
          data: {
            playerWallet: player.walletAddress,
            oldReferralCode: oldCode,
            newReferralCode: newCode,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error('Error sending referral code change notification:', error);
    }
  }

  // Utility methods
  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRewardId(): string {
    return `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default ReferralService;
