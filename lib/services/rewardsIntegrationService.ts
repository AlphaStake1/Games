/**
 * Rewards Integration Service
 * Integrates transfer system with existing Blue/Orange points rewards
 * Ensures transfer players don't get bonus points but CBLs still get commissions
 */

import ReferralService from './referralService';
import CommunityTransferService from './communityTransferService';
import {
  Player,
  ReferralReward,
  PlayerActivity,
  BonusProcessingResult,
} from '@/lib/types/player';

export interface PointsRewardRequest {
  playerId: string;
  activityType:
    | 'board_purchase'
    | 'nft_mint'
    | 'referral_signup'
    | 'game_win'
    | 'daily_login';
  amount?: number;
  metadata?: Record<string, any>;
  bluePoints?: number; // Existing blue points system
  orangePoints?: number; // Existing orange points system
}

export interface PointsRewardResult {
  success: boolean;
  playerPointsAwarded: number;
  cblCommissionAwarded: number;
  bluePointsAwarded: number;
  orangePointsAwarded: number;
  transferPlayerStatus: boolean;
  rewardReason: string;
  rewardIds: string[];
  error?: string;
}

export class RewardsIntegrationService {
  private referralService: ReferralService;
  private transferService: CommunityTransferService;
  private database: any;

  constructor(
    referralService: ReferralService,
    transferService: CommunityTransferService,
    database: any,
  ) {
    this.referralService = referralService;
    this.transferService = transferService;
    this.database = database;
  }

  /**
   * Process all rewards (Blue/Orange points + referral bonuses) with transfer logic
   */
  async processUnifiedRewards(
    request: PointsRewardRequest,
  ): Promise<PointsRewardResult> {
    try {
      const player = await this.database.getPlayer(request.playerId);
      if (!player) {
        return {
          success: false,
          playerPointsAwarded: 0,
          cblCommissionAwarded: 0,
          bluePointsAwarded: 0,
          orangePointsAwarded: 0,
          transferPlayerStatus: false,
          rewardReason: 'Player not found',
          rewardIds: [],
          error: 'PLAYER_NOT_FOUND',
        };
      }

      // Process standard Blue/Orange points (these always apply)
      const standardPointsResult = await this.processStandardPoints(
        player,
        request,
      );

      // Process referral bonuses (affected by transfer status)
      const referralBonusResult =
        await this.referralService.processBonusDistribution(
          request.playerId,
          request.activityType as any,
          request.amount,
          request.metadata,
        );

      // Combine results
      const totalPlayerPoints =
        standardPointsResult.playerPoints + referralBonusResult.bonusAmount;
      const totalCBLCommission = referralBonusResult.commissionAmount;

      // Log the unified reward activity
      await this.logUnifiedRewardActivity(player, request, {
        standardPoints: standardPointsResult,
        referralBonus: referralBonusResult,
      });

      return {
        success: true,
        playerPointsAwarded: totalPlayerPoints,
        cblCommissionAwarded: totalCBLCommission,
        bluePointsAwarded: standardPointsResult.bluePoints,
        orangePointsAwarded: standardPointsResult.orangePoints,
        transferPlayerStatus: player.transferPlayer,
        rewardReason: this.buildRewardReason(
          player,
          referralBonusResult.reason,
        ),
        rewardIds: [
          ...standardPointsResult.rewardIds,
          ...referralBonusResult.rewardIds,
        ],
      };
    } catch (error) {
      console.error('Error processing unified rewards:', error);
      return {
        success: false,
        playerPointsAwarded: 0,
        cblCommissionAwarded: 0,
        bluePointsAwarded: 0,
        orangePointsAwarded: 0,
        transferPlayerStatus: false,
        rewardReason: 'Error processing rewards',
        rewardIds: [],
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Process standard Blue/Orange points (not affected by transfer status)
   */
  private async processStandardPoints(
    player: Player,
    request: PointsRewardRequest,
  ): Promise<{
    playerPoints: number;
    bluePoints: number;
    orangePoints: number;
    rewardIds: string[];
  }> {
    let bluePoints = 0;
    let orangePoints = 0;
    let playerPoints = 0;
    const rewardIds: string[] = [];

    // Calculate standard points based on activity type
    switch (request.activityType) {
      case 'board_purchase':
        // Standard points for board purchases (always awarded)
        playerPoints = 10;
        bluePoints = request.bluePoints || 5;
        orangePoints = request.orangePoints || 3;
        break;

      case 'game_win':
        // Points for game wins (always awarded)
        playerPoints = 25;
        bluePoints = request.bluePoints || 15;
        orangePoints = request.orangePoints || 10;
        break;

      case 'daily_login':
        // Daily login bonus (always awarded)
        playerPoints = 5;
        bluePoints = request.bluePoints || 2;
        orangePoints = request.orangePoints || 1;
        break;

      case 'nft_mint':
        // Standard points for NFT minting (always awarded)
        playerPoints = 50;
        bluePoints = request.bluePoints || 25;
        orangePoints = request.orangePoints || 15;
        break;

      default:
        // Default activity points
        playerPoints = request.bluePoints || request.orangePoints || 5;
        bluePoints = request.bluePoints || 0;
        orangePoints = request.orangePoints || 0;
    }

    // Award the standard points
    if (playerPoints > 0 || bluePoints > 0 || orangePoints > 0) {
      const rewardId = this.generateRewardId();
      rewardIds.push(rewardId);

      await this.database.updatePlayerPoints(player.id, {
        standardPoints: playerPoints,
        bluePoints: bluePoints,
        orangePoints: orangePoints,
      });

      // Log standard points reward
      await this.database.createPointsReward({
        id: rewardId,
        playerId: player.id,
        rewardType: 'standard_points',
        standardPoints: playerPoints,
        bluePoints: bluePoints,
        orangePoints: orangePoints,
        activityType: request.activityType,
        metadata: {
          ...request.metadata,
          rewardReason:
            'Standard activity points (not affected by transfer status)',
        },
        createdAt: new Date(),
      });
    }

    return {
      playerPoints,
      bluePoints,
      orangePoints,
      rewardIds,
    };
  }

  /**
   * Process community transfer with integrated rewards
   */
  async processTransferWithRewards(
    playerId: string,
    targetCBLId: string,
    walletAddress: string,
  ) {
    try {
      // Execute the transfer
      const transferResult = await this.transferService.initiateTransfer(
        playerId,
        targetCBLId,
        walletAddress,
      );

      if (!transferResult.success) {
        return transferResult;
      }

      // Award standard activity points for the transfer (but no bonus points)
      const transferRewardResult = await this.processUnifiedRewards({
        playerId,
        activityType: 'referral_signup', // This will be processed as transfer
        metadata: {
          transferId: transferResult.transferId,
          newReferralCode: transferResult.newReferralCode,
          activityReason: 'Community transfer completion',
        },
      });

      return {
        ...transferResult,
        rewardsProcessed: transferRewardResult.success,
        rewardsSummary: {
          playerPoints: transferRewardResult.playerPointsAwarded,
          cblCommission: transferRewardResult.cblCommissionAwarded,
          transferPlayerStatus: transferRewardResult.transferPlayerStatus,
        },
      };
    } catch (error) {
      console.error('Error processing transfer with rewards:', error);
      return {
        success: false,
        message: 'Transfer failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get comprehensive player rewards summary
   */
  async getPlayerRewardsSummary(playerId: string) {
    try {
      const player = await this.database.getPlayer(playerId);
      if (!player) {
        throw new Error('Player not found');
      }

      const [referralStatus, pointsHistory, rewardsSummary, transferHistory] =
        await Promise.all([
          this.referralService.getPlayerReferralStatus(playerId),
          this.database.getPlayerPointsHistory(playerId),
          this.database.getPlayerRewardsSummary(playerId),
          this.database.getPlayerTransferHistory(playerId),
        ]);

      return {
        player: {
          id: player.id,
          walletAddress: player.walletAddress,
          transferPlayer: player.transferPlayer,
          vipStatus: player.vipStatus,
          currentCBL: player.currentCBLId,
          joinedAt: player.joinedAt,
        },
        referralStatus,
        pointsBreakdown: {
          totalPoints: player.pointsBalance,
          standardPoints: pointsHistory.standardPoints || 0,
          bluePoints: pointsHistory.bluePoints || 0,
          orangePoints: pointsHistory.orangePoints || 0,
          bonusPoints: pointsHistory.bonusPoints || 0,
        },
        rewardsSummary: {
          totalRewardsEarned: rewardsSummary.totalAmount || 0,
          referralBonuses: rewardsSummary.referralBonuses || 0,
          cblCommissions: rewardsSummary.cblCommissions || 0,
          activityBonuses: rewardsSummary.activityBonuses || 0,
        },
        transferHistory,
        eligibility: {
          canTransfer:
            await this.transferService.checkTransferEligibility(playerId),
          bonusEligible: !player.transferPlayer,
        },
      };
    } catch (error) {
      console.error('Error getting player rewards summary:', error);
      throw error;
    }
  }

  /**
   * Override existing bonus distribution for NFT minting
   */
  async processNFTMintingRewards(
    playerId: string,
    mintPrice: number,
    nftMetadata: Record<string, any>,
  ): Promise<PointsRewardResult> {
    return this.processUnifiedRewards({
      playerId,
      activityType: 'nft_mint',
      amount: mintPrice,
      metadata: {
        ...nftMetadata,
        mintPrice,
        activityReason: 'NFT minting with transfer-aware rewards',
      },
      bluePoints: 25, // Standard blue points for NFT minting
      orangePoints: 15, // Standard orange points for NFT minting
    });
  }

  /**
   * Override existing board purchase rewards
   */
  async processBoardPurchaseRewards(
    playerId: string,
    boardPrice: number,
    boardMetadata: Record<string, any>,
  ): Promise<PointsRewardResult> {
    return this.processUnifiedRewards({
      playerId,
      activityType: 'board_purchase',
      amount: boardPrice,
      metadata: {
        ...boardMetadata,
        boardPrice,
        activityReason: 'Board purchase with transfer-aware rewards',
      },
      bluePoints: 5, // Standard blue points for board purchase
      orangePoints: 3, // Standard orange points for board purchase
    });
  }

  /**
   * Build comprehensive reward reason
   */
  private buildRewardReason(player: Player, referralReason: string): string {
    const playerType = player.transferPlayer
      ? 'Transfer Player'
      : 'Original Player';
    const vipStatus = player.vipStatus ? ' (VIP)' : '';

    return `${playerType}${vipStatus}: ${referralReason}`;
  }

  /**
   * Log unified reward activity
   */
  private async logUnifiedRewardActivity(
    player: Player,
    request: PointsRewardRequest,
    results: {
      standardPoints: any;
      referralBonus: BonusProcessingResult;
    },
  ): Promise<void> {
    const activity: PlayerActivity = {
      id: this.generateActivityId(),
      playerId: player.id,
      activityType: request.activityType as any,
      description: `Unified rewards: ${request.activityType} with transfer-aware bonuses`,
      amount: request.amount,
      metadata: {
        ...request.metadata,
        playerType: player.transferPlayer ? 'transfer' : 'original',
        vipStatus: player.vipStatus,
        currentCBL: player.currentCBLId,
        standardPointsAwarded: results.standardPoints.playerPoints,
        bluePointsAwarded: results.standardPoints.bluePoints,
        orangePointsAwarded: results.standardPoints.orangePoints,
        referralBonusAwarded: results.referralBonus.bonusAmount,
        cblCommissionAwarded: results.referralBonus.commissionAmount,
        bonusEligibilityReason: results.referralBonus.reason,
        rewardIds: [
          ...results.standardPoints.rewardIds,
          ...results.referralBonus.rewardIds,
        ],
      },
      timestamp: new Date(),
    };

    await this.database.logPlayerActivity(activity);
  }

  // Utility methods
  private generateRewardId(): string {
    return `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default RewardsIntegrationService;
