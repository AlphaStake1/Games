/**
 * Community Transfer Service
 * Handles player transfers between CBL communities with wallet signature confirmation
 */

import {
  Player,
  CommunityTransferRequest,
  CBLProfile,
  TransferEligibility,
  TransferResponse,
  ReferralReward,
  PlayerActivity,
  RewardContext,
  RewardDecision,
  BonusEligibility,
} from '@/lib/types/player';

export class CommunityTransferService {
  private database: any; // Your database connection
  private walletService: any; // Wallet signature service

  constructor(database: any, walletService: any) {
    this.database = database;
    this.walletService = walletService;
  }

  /**
   * Check if a player is eligible for community transfer
   */
  async checkTransferEligibility(
    playerId: string,
  ): Promise<TransferEligibility> {
    try {
      const player = await this.database.getPlayer(playerId);
      if (!player) {
        return {
          eligible: false,
          reason: 'Player not found',
        };
      }

      // VIP players can transfer freely
      if (player.vipStatus) {
        return {
          eligible: true,
          reason: 'VIP status allows unlimited transfers',
        };
      }

      // Check cooldown period (e.g., 30 days between transfers)
      const cooldownPeriod = 30 * 24 * 60; // 30 days in minutes
      if (player.lastTransferDate) {
        const minutesSinceLastTransfer =
          (Date.now() - player.lastTransferDate.getTime()) / (1000 * 60);

        if (minutesSinceLastTransfer < cooldownPeriod) {
          return {
            eligible: false,
            reason: 'Transfer cooldown period active',
            cooldownRemaining: cooldownPeriod - minutesSinceLastTransfer,
          };
        }
      }

      // Check monthly transfer limit (e.g., max 2 transfers per month)
      const monthlyLimit = 2;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const transfersThisMonth = await this.database.getTransferCount(
        playerId,
        currentYear,
        currentMonth,
      );

      if (transfersThisMonth >= monthlyLimit) {
        return {
          eligible: false,
          reason: 'Monthly transfer limit reached',
          transfersRemaining: 0,
        };
      }

      return {
        eligible: true,
        reason: 'Player eligible for transfer',
        transfersRemaining: monthlyLimit - transfersThisMonth,
      };
    } catch (error) {
      console.error('Error checking transfer eligibility:', error);
      return {
        eligible: false,
        reason: 'Error checking eligibility',
      };
    }
  }

  /**
   * Get available CBL communities for transfer
   */
  async getAvailableCBLs(currentCBLId?: string): Promise<CBLProfile[]> {
    try {
      const allCBLs = await this.database.getCBLProfiles();

      // Filter out current CBL and inactive CBLs
      return allCBLs.filter(
        (cbl: CBLProfile) =>
          cbl.id !== currentCBLId &&
          cbl.isActive &&
          cbl.allowTransfers &&
          (!cbl.maxMembers || cbl.memberCount < cbl.maxMembers),
      );
    } catch (error) {
      console.error('Error fetching available CBLs:', error);
      return [];
    }
  }

  /**
   * Initiate community transfer with wallet signature
   */
  async initiateTransfer(
    playerId: string,
    targetCBLId: string,
    walletAddress: string,
  ): Promise<TransferResponse> {
    try {
      // Check eligibility
      const eligibility = await this.checkTransferEligibility(playerId);
      if (!eligibility.eligible) {
        return {
          success: false,
          message: eligibility.reason || 'Transfer not allowed',
          error: eligibility.reason,
        };
      }

      // Get player and target CBL info
      const player = await this.database.getPlayer(playerId);
      const targetCBL = await this.database.getCBL(targetCBLId);

      if (!player || !targetCBL) {
        return {
          success: false,
          message: 'Player or target community not found',
          error: 'Invalid player or CBL ID',
        };
      }

      // Create transfer message for wallet signature
      const transferMessage = this.createTransferMessage(player, targetCBL);

      // Request wallet signature
      const signature = await this.walletService.requestSignature(
        walletAddress,
        transferMessage,
      );

      if (!signature) {
        return {
          success: false,
          message: 'Wallet signature required for transfer',
          error: 'Signature rejected or failed',
        };
      }

      // Create transfer request
      const transferRequest: CommunityTransferRequest = {
        id: this.generateTransferId(),
        playerId,
        fromCBLId: player.currentCBLId,
        toCBLId: targetCBLId,
        requestedAt: new Date(),
        status: 'pending',
        walletSignature: signature,
        reason: 'Player-initiated community transfer',
      };

      // Process the transfer
      const result = await this.processTransfer(transferRequest);

      return result;
    } catch (error) {
      console.error('Error initiating transfer:', error);
      return {
        success: false,
        message: 'Transfer failed due to system error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process the community transfer
   */
  private async processTransfer(
    request: CommunityTransferRequest,
  ): Promise<TransferResponse> {
    try {
      const player = await this.database.getPlayer(request.playerId);
      const targetCBL = await this.database.getCBL(request.toCBLId);

      if (!player || !targetCBL) {
        throw new Error('Player or target CBL not found');
      }

      // Begin database transaction
      await this.database.beginTransaction();

      try {
        // Update player record
        const updatedPlayer: Partial<Player> = {
          referralCode: targetCBL.referralCode,
          currentCBLId: request.toCBLId,
          previousCBLIds: [...player.previousCBLIds, player.currentCBLId],
          transferPlayer: true, // Mark as transferred player
          lastTransferDate: new Date(),
          transferCount: player.transferCount + 1,
          updatedAt: new Date(),
        };

        await this.database.updatePlayer(request.playerId, updatedPlayer);

        // Update CBL member counts
        await this.database.updateCBLMemberCount(player.currentCBLId, -1);
        await this.database.updateCBLMemberCount(request.toCBLId, 1);

        // Update transfer request status
        await this.database.updateTransferRequest(request.id, {
          status: 'completed',
          processedAt: new Date(),
        });

        // Log player activity
        const activity: PlayerActivity = {
          id: this.generateActivityId(),
          playerId: request.playerId,
          activityType: 'community_transfer',
          description: `Transferred from ${player.currentCBLId} to ${request.toCBLId}`,
          metadata: {
            fromCBL: player.currentCBLId,
            toCBL: request.toCBLId,
            transferId: request.id,
            walletSignature: request.walletSignature,
          },
          timestamp: new Date(),
        };

        await this.database.logPlayerActivity(activity);

        // Commit transaction
        await this.database.commitTransaction();

        // Send notifications (async, don't wait)
        this.sendTransferNotifications(player, targetCBL);

        return {
          success: true,
          transferId: request.id,
          message: `Successfully joined ${targetCBL.name}!`,
          newReferralCode: targetCBL.referralCode,
        };
      } catch (error) {
        await this.database.rollbackTransaction();
        throw error;
      }
    } catch (error) {
      console.error('Error processing transfer:', error);
      return {
        success: false,
        message: 'Failed to process transfer',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create transfer message for wallet signature
   */
  private createTransferMessage(player: Player, targetCBL: CBLProfile): string {
    return `Community Transfer Request
    
Player: ${player.walletAddress}
From: ${player.currentCBLId}
To: ${targetCBL.name} (${targetCBL.id})
New Referral Code: ${targetCBL.referralCode}

By signing, you confirm:
- Future NFT commissions (30%) go to ${targetCBL.name}
- No bonus points awarded for this transfer
- Access to ${targetCBL.name}'s exclusive perks
- This action is permanent

Timestamp: ${new Date().toISOString()}`;
  }

  /**
   * Determine bonus eligibility for referral rewards
   */
  determineReferralBonusEligibility(context: RewardContext): BonusEligibility {
    // New players get full bonuses
    if (context.isNewPlayer && !context.isTransferPlayer) {
      return {
        playerBonus: true,
        cblBonus: true,
        reason: 'New player signup - full bonuses awarded',
      };
    }

    // Transferred players - only CBL gets commission, no bonus points
    if (context.isTransferPlayer) {
      if (context.activityType === 'nft_mint') {
        return {
          playerBonus: false,
          cblBonus: true, // CBL gets 30% commission
          reason: 'Transfer player NFT mint - commission only, no bonus points',
        };
      }

      return {
        playerBonus: false,
        cblBonus: false,
        reason: 'Transfer player - no bonus points awarded',
      };
    }

    // Default case
    return {
      playerBonus: false,
      cblBonus: false,
      reason: 'Standard activity - no special bonuses',
    };
  }

  /**
   * Calculate and award referral rewards
   */
  async processReferralReward(
    playerId: string,
    activityType: string,
    amount?: number,
  ): Promise<void> {
    try {
      const player = await this.database.getPlayer(playerId);
      if (!player) return;

      const context: RewardContext = {
        isNewPlayer: !player.transferPlayer && player.transferCount === 0,
        isTransferPlayer: player.transferPlayer,
        referringCBL: player.currentCBLId,
        activityType,
        amount,
      };

      const bonusEligibility = this.determineReferralBonusEligibility(context);

      // Process CBL commission (for NFT mints)
      if (bonusEligibility.cblBonus && activityType === 'nft_mint' && amount) {
        const commission = amount * 0.3; // 30% commission

        await this.database.createReferralReward({
          id: this.generateRewardId(),
          playerId,
          referredPlayerId: playerId,
          cblId: player.currentCBLId,
          rewardType: 'nft_commission',
          amount: commission,
          currency: 'usd',
          isTransferPlayer: player.transferPlayer,
          status: 'pending',
          metadata: {
            originalAmount: amount,
            commissionRate: 0.3,
            activityType,
          },
          createdAt: new Date(),
        });
      }

      // Process player bonus points (only for new players)
      if (bonusEligibility.playerBonus && activityType === 'referral_signup') {
        const bonusPoints = 500; // Standard referral bonus

        await this.database.createReferralReward({
          id: this.generateRewardId(),
          playerId,
          referredPlayerId: playerId,
          cblId: player.currentCBLId,
          rewardType: 'signup_bonus',
          amount: bonusPoints,
          currency: 'points',
          isTransferPlayer: false,
          status: 'pending',
          metadata: {
            bonusType: 'new_player_referral',
            activityType,
          },
          createdAt: new Date(),
        });
      }

      console.log(`Referral reward processed: ${bonusEligibility.reason}`);
    } catch (error) {
      console.error('Error processing referral reward:', error);
    }
  }

  /**
   * Send transfer notifications
   */
  private async sendTransferNotifications(
    player: Player,
    targetCBL: CBLProfile,
  ): Promise<void> {
    try {
      // Email notification to player
      if (player.email && player.preferences.emailNotifications) {
        await this.sendEmail(player.email, 'Community Transfer Successful', {
          playerName: player.username || 'Player',
          communityName: targetCBL.name,
          referralCode: targetCBL.referralCode,
        });
      }

      // Notification to CBL (webhook or internal notification)
      await this.notifyCBL(targetCBL.id, {
        type: 'new_member_transfer',
        playerId: player.id,
        playerWallet: player.walletAddress,
        transferDate: new Date(),
      });
    } catch (error) {
      console.error('Error sending transfer notifications:', error);
    }
  }

  // Utility methods
  private generateTransferId(): string {
    return `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRewardId(): string {
    return `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendEmail(
    to: string,
    subject: string,
    data: any,
  ): Promise<void> {
    // Implement email sending logic
    console.log(`Email sent to ${to}: ${subject}`, data);
  }

  private async notifyCBL(cblId: string, data: any): Promise<void> {
    // Implement CBL notification logic
    console.log(`CBL ${cblId} notified:`, data);
  }
}

export default CommunityTransferService;
