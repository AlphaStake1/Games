/**
 * Coach B Response Templates and Handlers
 * Includes community transfer support responses
 */

import { CoachBResponse } from '@/lib/types/player';

export interface CommunityComplaint {
  playerId: string;
  playerWallet: string;
  currentCBL?: string;
  complaintType:
    | 'communication'
    | 'support'
    | 'culture'
    | 'unfair_treatment'
    | 'inactive_leader'
    | 'other';
  complaintText: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface CoachBResponseOptions {
  includeTransferOption: boolean;
  playerName?: string;
  currentCBL?: string;
  complaintType?: string;
  severity?: string;
}

export class CoachBResponseService {
  private baseUrl: string;
  private secretPagePath: string = '/community-transfers/secret';

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ||
      'https://your-domain.com',
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Generate Coach B response for community complaints
   */
  generateCommunityComplaintResponse(
    complaint: CommunityComplaint,
    options: CoachBResponseOptions = { includeTransferOption: false },
  ): CoachBResponse {
    const playerName = options.playerName || 'Player';
    const secretPageUrl = `${this.baseUrl}${this.secretPagePath}`;

    // Different responses based on complaint type and severity
    let mainResponse = '';
    let transferOfferText = '';

    // Base supportive response
    switch (complaint.complaintType) {
      case 'communication':
        mainResponse = `Hey ${playerName}! I hear you on the communication front - clear, timely communication is crucial for any winning team! 📢\n\nAs your coach, I want to make sure every player feels heard and supported. Communication breakdowns can really hurt team morale, and that's not what we're about here.`;
        break;

      case 'support':
        mainResponse = `${playerName}, I'm sorry to hear you're not getting the support you need! 🤝 Every player on our roster deserves proper backup and guidance.\n\nA good community should have your back, especially when you're learning the ropes or facing challenges. That's fundamental team building 101.`;
        break;

      case 'culture':
        mainResponse = `I understand your concerns about the community culture, ${playerName}. 🏈 Team culture is everything - it can make or break the entire experience for everyone involved.\n\nA healthy community should be welcoming, respectful, and focused on helping everyone succeed together. When that's not happening, it affects the whole team dynamic.`;
        break;

      case 'unfair_treatment':
        mainResponse = `${playerName}, unfair treatment has no place on any team I coach! ⚖️ Every player deserves to be treated with respect and given equal opportunities.\n\nI take these concerns seriously because fairness and integrity are core values that make this game fun for everyone.`;
        break;

      case 'inactive_leader':
        mainResponse = `Hey ${playerName}, leadership issues can really impact team performance! 📉 An inactive or unresponsive leader leaves the whole community hanging.\n\nStrong leadership is what separates good communities from great ones. Players need guidance, support, and active engagement from their CBL.`;
        break;

      default:
        mainResponse = `Thanks for reaching out, ${playerName}! I appreciate you taking the time to share your concerns with me. 🏈\n\nAs your coach, I want to make sure every player has the best possible experience. When something's not working right, we need to address it head-on.`;
    }

    // Add transfer option if requested
    if (options.includeTransferOption) {
      transferOfferText = `\n\n**Here's what I can do to help:**\n\nI've been working on something special for players in situations like yours. I've got connections with several outstanding CBL communities that might be a much better fit for your playing style and needs.\n\nIf you're interested, I can give you **exclusive access** to profiles of other communities - you can see their culture, leadership style, member perks, and what makes each one unique. No pressure, but the option is there if you want to explore it.\n\n🔗 **[Check out your community options here](${secretPageUrl})**\n\n*This link is only shared with players I personally recommend for transfers. It's not public, so consider it a special coaching opportunity!*`;
    }

    // Conclusion
    const conclusion = `\n\nRemember, ${playerName} - you're part of this team, and I want you to succeed! Whether that means working through current challenges or finding a community that's a better fit, I'm here to help you make the right play.\n\nFeel free to reach out anytime. That's what coaches are for! 💪🏈`;

    const fullMessage = mainResponse + transferOfferText + conclusion;

    return {
      type: 'community_transfer_offer',
      message: fullMessage,
      secretPageUrl,
      playerId: complaint.playerId,
      timestamp: new Date(),
      metadata: {
        playerCurrentCBL: complaint.currentCBL,
        playerComplaintReason: complaint.complaintType,
        complaintSeverity: complaint.severity,
        transferOptionOffered: options.includeTransferOption,
      },
    };
  }

  /**
   * Generate supportive response without transfer option
   */
  generateSupportiveResponse(
    playerId: string,
    playerName?: string,
    situation?: string,
  ): CoachBResponse {
    const name = playerName || 'Player';
    const secretPageUrl = `${this.baseUrl}${this.secretPagePath}`;

    const supportiveResponses = [
      `Hey ${name}! Thanks for reaching out - that's what good teammates do! 🏈\n\nI'm here to help you work through whatever's going on. Sometimes a fresh perspective or a different approach can make all the difference.\n\nWhat's the main challenge you're facing? Let's break it down and come up with a game plan together! 💪`,

      `${name}, I appreciate you coming to me with this! 🤝\n\nAs your coach, I want to make sure you're getting the most out of your experience here. Whether it's strategy, community dynamics, or just needing someone to listen - I've got your back.\n\nTell me more about what's going on, and let's figure out the best way forward!`,

      `Good to hear from you, ${name}! 📢\n\nI always tell my players - communication is key to winning! Whether you're celebrating victories or working through challenges, keeping the lines open is what makes champions.\n\nWhat's on your mind? Let's tackle this together and get you back to peak performance! 🏆`,
    ];

    const randomResponse =
      supportiveResponses[
        Math.floor(Math.random() * supportiveResponses.length)
      ];

    return {
      type: 'community_transfer_offer',
      message: randomResponse,
      secretPageUrl,
      playerId,
      timestamp: new Date(),
      metadata: {
        responseType: 'supportive',
        situation: situation || 'general_support',
      },
    };
  }

  /**
   * Determine if transfer option should be offered
   */
  shouldOfferTransferOption(complaint: CommunityComplaint): boolean {
    // Offer transfer for more serious complaints
    const transferWorthyTypes = [
      'unfair_treatment',
      'culture',
      'inactive_leader',
    ];
    const highSeverity = complaint.severity === 'high';
    const mediumSeverityWithRightType =
      complaint.severity === 'medium' &&
      transferWorthyTypes.includes(complaint.complaintType);

    return highSeverity || mediumSeverityWithRightType;
  }

  /**
   * Process community complaint and generate appropriate response
   */
  async processCommunityComplaint(
    complaint: CommunityComplaint,
    database: any,
  ): Promise<CoachBResponse> {
    try {
      // Check if player exists and get additional context
      const player = await database.getPlayer(complaint.playerId);
      const playerName = player?.username || 'Player';
      const currentCBL = player?.currentCBLId;

      // Determine if transfer option should be offered
      const includeTransferOption = this.shouldOfferTransferOption(complaint);

      // Generate response
      const response = this.generateCommunityComplaintResponse(complaint, {
        includeTransferOption,
        playerName,
        currentCBL,
        complaintType: complaint.complaintType,
        severity: complaint.severity,
      });

      // Log the interaction
      await database.logCoachBInteraction({
        playerId: complaint.playerId,
        interactionType: 'community_complaint',
        complaintType: complaint.complaintType,
        severity: complaint.severity,
        transferOptionOffered: includeTransferOption,
        responseGenerated: true,
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      console.error('Error processing community complaint:', error);

      // Fallback response
      return {
        type: 'community_transfer_offer',
        message: `Hey there! Thanks for reaching out. I'm having a quick technical timeout, but I want to help you with your community concerns!\n\nPlease try reaching out again in a few minutes, or contact our support team directly. Your experience matters to us! 🏈💪`,
        secretPageUrl: `${this.baseUrl}${this.secretPagePath}`,
        playerId: complaint.playerId,
        timestamp: new Date(),
        metadata: {
          error: true,
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Get secret page URL for direct sharing
   */
  getSecretPageUrl(): string {
    return `${this.baseUrl}${this.secretPagePath}`;
  }

  /**
   * Validate secret page access (optional security layer)
   */
  async validateSecretPageAccess(
    playerId: string,
    database: any,
  ): Promise<{ authorized: boolean; reason?: string }> {
    try {
      // Check if player has been offered transfer option recently
      const recentInteractions = await database.getRecentCoachBInteractions(
        playerId,
        24 * 60 * 60 * 1000, // 24 hours
      );

      const hasTransferOffer = recentInteractions.some(
        (interaction: any) => interaction.transferOptionOffered === true,
      );

      if (hasTransferOffer) {
        return { authorized: true };
      }

      // Check if player is eligible for transfer
      const player = await database.getPlayer(playerId);
      if (!player?.transferPlayer && !player?.vipStatus) {
        // Non-transfer, non-VIP players might be eligible
        return {
          authorized: true,
          reason: 'Player eligible for community transfer consideration',
        };
      }

      return {
        authorized: false,
        reason: 'No recent transfer offer or special eligibility',
      };
    } catch (error) {
      console.error('Error validating secret page access:', error);
      return {
        authorized: false,
        reason: 'Unable to validate access',
      };
    }
  }
}

export default CoachBResponseService;
