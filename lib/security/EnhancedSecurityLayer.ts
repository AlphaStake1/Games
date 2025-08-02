/**
 * Enhanced Security Layer - Combines threat pattern detection with bot detection
 * Implements comprehensive security policy enforcement
 */

import {
  UniversalSecurityLayer,
  SecurityAction,
} from './UniversalSecurityLayer';
import {
  BotDetectionEngine,
  BotAssessment,
  InteractionHistory,
  BotDetectionMetadata,
  createBotDetectionEngine,
} from './BotDetectionEngine';

export interface EnhancedSecurityAction extends SecurityAction {
  botAssessment?: BotAssessment;
  enforcementLevel?:
    | 'monitor'
    | 'challenge'
    | 'restrict'
    | 'quarantine'
    | 'ban';
  verificationRequired?: string[];
  appealInstructions?: string;
}

export interface SecurityEnforcementResult {
  response: string;
  actions: EnhancedSecurityAction[];
  blockPurchases: boolean;
  requireVerification: boolean;
  escalationLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface UserSecurityProfile {
  userId: string;
  trustScore: number; // 0-100 scale
  botProbability: number; // 0-1 scale
  verificationStatus: 'unverified' | 'partial' | 'verified' | 'flagged';
  enforcementHistory: EnhancementAction[];
  lastAssessment: Date;
  interactionCount: number;
  flags: string[];
}

export interface EnhancementAction {
  timestamp: Date;
  action: string;
  reason: string;
  severity: string;
  resolved: boolean;
  appealStatus?: 'none' | 'pending' | 'approved' | 'denied';
}

export class EnhancedSecurityLayer extends UniversalSecurityLayer {
  private botDetector: BotDetectionEngine;
  private userProfiles: Map<string, UserSecurityProfile> = new Map();
  private interactionHistory: Map<string, InteractionHistory[]> = new Map();

  constructor() {
    super();
    this.botDetector = createBotDetectionEngine();
  }

  /**
   * Enhanced message processing with bot detection
   */
  async processMessage(
    agentId: string,
    userId: string,
    message: string,
    proposedResponse: string,
    metadata?: BotDetectionMetadata,
  ): Promise<SecurityEnforcementResult> {
    // 1. Record interaction for bot analysis
    await this.recordInteraction({
      userId,
      timestamp: Date.now(),
      message,
      responseTime: metadata?.responseTime || 0,
      platform: metadata?.platform || 'web',
      agentId,
      metadata,
    });

    // 2. Run existing threat pattern detection
    const threatResult = await super.processMessage(
      agentId,
      userId,
      message,
      proposedResponse,
    );

    // 3. Run bot detection analysis
    const userHistory = this.getUserHistory(userId);
    const botAssessment = await this.botDetector.assessBotProbability(
      userId,
      userHistory,
      metadata,
    );

    // 4. Update user security profile
    await this.updateUserProfile(userId, botAssessment);

    // 5. Determine combined enforcement action
    const enforcementResult = this.determineEnforcement(
      agentId,
      userId,
      threatResult,
      botAssessment,
      proposedResponse,
    );

    // 6. Log combined security event
    await this.logEnhancedSecurityEvent({
      userId,
      agentId,
      threatResult,
      botAssessment,
      enforcementResult,
      timestamp: Date.now(),
    });

    return enforcementResult;
  }

  /**
   * Determine appropriate enforcement action based on threat + bot analysis
   */
  private determineEnforcement(
    agentId: string,
    userId: string,
    threatResult: { response: string; actions: SecurityAction[] },
    botAssessment: BotAssessment,
    originalResponse: string,
  ): SecurityEnforcementResult {
    const userProfile = this.getUserProfile(userId);
    let blockPurchases = false;
    let requireVerification = false;
    let escalationLevel: 'none' | 'low' | 'medium' | 'high' | 'critical' =
      'none';

    // Determine if purchases should be blocked
    blockPurchases = this.shouldBlockPurchases(
      threatResult,
      botAssessment,
      userProfile,
    );

    // Determine if verification is required
    requireVerification = this.shouldRequireVerification(
      threatResult,
      botAssessment,
      userProfile,
    );

    // Determine escalation level
    escalationLevel = this.calculateEscalationLevel(
      threatResult,
      botAssessment,
      userProfile,
    );

    // Generate enhanced actions
    const enhancedActions = this.generateEnhancedActions(
      threatResult.actions,
      botAssessment,
      userProfile,
      agentId,
    );

    // Generate appropriate response
    const response = this.generateEnhancedResponse(
      agentId,
      threatResult,
      botAssessment,
      originalResponse,
    );

    return {
      response,
      actions: enhancedActions,
      blockPurchases,
      requireVerification,
      escalationLevel,
    };
  }

  /**
   * Policy enforcement: Should purchases be blocked?
   */
  private shouldBlockPurchases(
    threatResult: { response: string; actions: SecurityAction[] },
    botAssessment: BotAssessment,
    userProfile: UserSecurityProfile,
  ): boolean {
    // Block for critical threats (existing logic)
    const hasCriticalThreat = threatResult.actions.some(
      (action) =>
        action.severity === 'emergency' || action.type === 'quarantine_user',
    );

    // Block for bot detection (policy enforcement)
    const isSuspectedBot = botAssessment.confidence >= 0.5; // Moderate confidence threshold

    // Block for unverified high-risk users
    const isHighRiskUnverified =
      userProfile.trustScore < 30 &&
      userProfile.verificationStatus === 'unverified';

    // Block for flagged users
    const isFlagged = userProfile.verificationStatus === 'flagged';

    return (
      hasCriticalThreat || isSuspectedBot || isHighRiskUnverified || isFlagged
    );
  }

  /**
   * Policy enforcement: Should verification be required?
   */
  private shouldRequireVerification(
    threatResult: { response: string; actions: SecurityAction[] },
    botAssessment: BotAssessment,
    userProfile: UserSecurityProfile,
  ): boolean {
    // Require for medium-high bot confidence
    const moderateBotRisk = botAssessment.confidence >= 0.3;

    // Require for users with low trust scores
    const lowTrustScore = userProfile.trustScore < 50;

    // Require for users with suspicious patterns
    const hasSuspiciousActivity = threatResult.actions.some(
      (action) =>
        action.severity === 'high' || action.type === 'elevated_monitoring',
    );

    // Require for users with multiple flags
    const multipleFlags = userProfile.flags.length >= 2;

    return (
      moderateBotRisk || lowTrustScore || hasSuspiciousActivity || multipleFlags
    );
  }

  /**
   * Calculate overall escalation level
   */
  private calculateEscalationLevel(
    threatResult: { response: string; actions: SecurityAction[] },
    botAssessment: BotAssessment,
    userProfile: UserSecurityProfile,
  ): 'none' | 'low' | 'medium' | 'high' | 'critical' {
    // Critical: Definite bot or critical threat
    if (
      botAssessment.confidence >= 0.9 ||
      threatResult.actions.some((a) => a.severity === 'emergency')
    ) {
      return 'critical';
    }

    // High: Likely bot or high threat
    if (
      botAssessment.confidence >= 0.7 ||
      threatResult.actions.some((a) => a.severity === 'high')
    ) {
      return 'high';
    }

    // Medium: Possible bot or medium threat
    if (
      botAssessment.confidence >= 0.5 ||
      threatResult.actions.some((a) => a.severity === 'medium')
    ) {
      return 'medium';
    }

    // Low: Low bot probability but some indicators
    if (botAssessment.confidence >= 0.3 || userProfile.trustScore < 70) {
      return 'low';
    }

    return 'none';
  }

  /**
   * Generate enhanced security actions with bot enforcement
   */
  private generateEnhancedActions(
    threatActions: SecurityAction[],
    botAssessment: BotAssessment,
    userProfile: UserSecurityProfile,
    agentId: string,
  ): EnhancedSecurityAction[] {
    const enhancedActions: EnhancedSecurityAction[] = [];

    // Include all existing threat actions
    enhancedActions.push(
      ...threatActions.map((action) => ({
        ...action,
        botAssessment,
        enforcementLevel: botAssessment.recommendation.type,
        verificationRequired: botAssessment.recommendation.requirements,
        appealInstructions: this.getAppealInstructions(botAssessment.riskLevel),
      })),
    );

    // Add bot-specific actions
    if (botAssessment.isBot) {
      enhancedActions.push({
        type: 'quarantine_user',
        userId: userProfile.userId,
        severity:
          botAssessment.riskLevel === 'CONFIRMED' ? 'emergency' : 'high',
        reason: `Bot detected: ${botAssessment.reasoning}`,
        timestamp: Date.now(),
        agentId,
        botAssessment,
        enforcementLevel: botAssessment.recommendation.type,
        verificationRequired: botAssessment.recommendation.requirements,
        appealInstructions: this.getAppealInstructions(botAssessment.riskLevel),
      });
    }

    // Add purchase blocking action if needed
    if (
      this.shouldBlockPurchases(
        { response: '', actions: threatActions },
        botAssessment,
        userProfile,
      )
    ) {
      enhancedActions.push({
        type: 'block_response',
        userId: userProfile.userId,
        severity: 'high',
        reason: 'Purchase privileges suspended due to security concerns',
        timestamp: Date.now(),
        agentId,
        botAssessment,
        enforcementLevel: 'restrict',
        verificationRequired: ['human_verification'],
        appealInstructions: this.getAppealInstructions('HIGH'),
      });
    }

    return enhancedActions;
  }

  /**
   * Generate enhanced response considering both threats and bots
   */
  private generateEnhancedResponse(
    agentId: string,
    threatResult: { response: string; actions: SecurityAction[] },
    botAssessment: BotAssessment,
    originalResponse: string,
  ): string {
    // If bot is confirmed, use bot-specific response
    if (botAssessment.confidence >= 0.9) {
      return this.getBotBlockedResponse(agentId, botAssessment);
    }

    // If critical threat detected, use threat response
    if (threatResult.actions.some((a) => a.severity === 'emergency')) {
      return threatResult.response;
    }

    // If high bot probability, use bot warning
    if (botAssessment.confidence >= 0.7) {
      return this.getBotSuspicionResponse(agentId, botAssessment);
    }

    // If moderate bot probability, add verification notice
    if (botAssessment.confidence >= 0.5) {
      return this.addVerificationNotice(
        threatResult.response || originalResponse,
        agentId,
      );
    }

    // Use existing threat response or original
    return threatResult.response || originalResponse;
  }

  /**
   * Bot-specific response messages
   */
  private getBotBlockedResponse(
    agentId: string,
    botAssessment: BotAssessment,
  ): string {
    const responses = {
      Coach_B: `🤖 I've detected automated behavior patterns. For fair gameplay, only human players can purchase squares. If you're human, please complete verification at /verify or contact our support team.`,

      Trainer_Reviva: `🔍 Your interaction patterns suggest automation (confidence: ${Math.round(botAssessment.confidence * 100)}%). For security, I need to verify you're human before assisting with wallet operations. Please visit /verify to begin the verification process.`,

      Morgan_Reese: `🏢 I notice automated interaction patterns in our conversation. For business security, all partnership discussions require human verification. Please complete the verification process to continue our discussion.`,

      Dean: `[BOT DETECTED] Confidence: ${Math.round(botAssessment.confidence * 100)}%. Automated interaction blocked. User quarantined pending manual review. Indicators: ${botAssessment.indicators.slice(0, 3).join(', ')}.`,

      OC_Phil: `🏈 Hey there! I'm detecting some automated patterns in your messages. CBL management requires human verification to ensure authentic community building. Please verify your account to continue!`,

      Coach_Right: `🚫 Automated behavior detected. Our community is for human players only. If you're human, please complete verification. If you're a bot, please respect our community guidelines and discontinue automated interactions.`,
    };

    return (
      responses[agentId] ||
      '🚫 Automated interactions are not permitted for this service. Please complete human verification if you believe this is an error.'
    );
  }

  /**
   * Bot suspicion response (high confidence but not confirmed)
   */
  private getBotSuspicionResponse(
    agentId: string,
    botAssessment: BotAssessment,
  ): string {
    const responses = {
      Coach_B: `🛡️ I need to verify you're human for security purposes. Please answer: What's your favorite NFL team and why? (This helps us ensure real fans are playing!)`,

      Trainer_Reviva: `🔐 For account security, I need to verify you're human. Can you tell me what specific wallet issue you're experiencing in your own words?`,

      Morgan_Reese: `🤝 To proceed with partnership discussions, I need to verify we're speaking with a real person. What specific business outcomes are you hoping to achieve with Football Squares?`,

      Dean: `[ELEVATED MONITORING] Bot probability: ${Math.round(botAssessment.confidence * 100)}%. User requires verification before proceeding.`,

      OC_Phil: `🏈 Quick verification - tell me about your favorite football memory or why you want to start a CBL. Just want to make sure I'm talking to a real football fan!`,

      Coach_Right: `⚡ Quick human check - what's one thing you love about football? Just making sure our community stays authentic!`,
    };

    return (
      responses[agentId] ||
      "🔍 Please help us verify you're human by providing a detailed, personal response about why you're interested in Football Squares."
    );
  }

  /**
   * Add verification notice to response
   */
  private addVerificationNotice(response: string, agentId: string): string {
    const notices = {
      Coach_B:
        '\n\n🔒 **Security Notice**: For enhanced security, you may be asked to verify your account before purchasing squares.',
      Trainer_Reviva:
        '\n\n🛡️ **Security Notice**: Additional verification may be required for wallet-related operations.',
      Morgan_Reese:
        '\n\n🔐 **Security Notice**: Business discussions may require identity verification.',
      default:
        '\n\n🔒 **Security Notice**: You may be asked to complete verification for certain actions.',
    };

    const notice = notices[agentId] || notices.default;
    return response + notice;
  }

  /**
   * Get appeal instructions based on risk level
   */
  private getAppealInstructions(riskLevel: string): string {
    const instructions = {
      LOW: 'If you believe this is an error, please contact support with details about your issue.',
      MODERATE:
        'To appeal this decision, please complete human verification at /verify or contact support.',
      HIGH: 'To appeal, please provide identification and complete video verification with our support team.',
      CONFIRMED:
        'This decision requires manual review. Please contact support with evidence of human identity.',
    };

    return instructions[riskLevel] || instructions.MODERATE;
  }

  /**
   * User profile management
   */
  private getUserProfile(userId: string): UserSecurityProfile {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        trustScore: 50, // Start neutral
        botProbability: 0,
        verificationStatus: 'unverified',
        enforcementHistory: [],
        lastAssessment: new Date(),
        interactionCount: 0,
        flags: [],
      });
    }

    return this.userProfiles.get(userId)!;
  }

  /**
   * Update user profile based on assessments
   */
  private async updateUserProfile(
    userId: string,
    botAssessment: BotAssessment,
  ): Promise<void> {
    const profile = this.getUserProfile(userId);

    // Update bot probability
    profile.botProbability = botAssessment.confidence;

    // Update trust score (inverse of bot probability + other factors)
    profile.trustScore = Math.max(
      0,
      Math.min(
        100,
        (1 - botAssessment.confidence) * 80 +
          (profile.interactionCount > 10 ? 20 : 0), // Bonus for interaction history
      ),
    );

    // Update verification status based on bot assessment
    if (botAssessment.confidence >= 0.9) {
      profile.verificationStatus = 'flagged';
    } else if (botAssessment.confidence >= 0.5) {
      profile.verificationStatus =
        profile.verificationStatus === 'verified' ? 'verified' : 'partial';
    }

    // Add flags for specific indicators
    for (const indicator of botAssessment.indicators) {
      if (!profile.flags.includes(indicator)) {
        profile.flags.push(indicator);
      }
    }

    // Update counters
    profile.interactionCount++;
    profile.lastAssessment = new Date();

    // Store updated profile
    this.userProfiles.set(userId, profile);
  }

  /**
   * Interaction history management
   */
  private async recordInteraction(
    interaction: InteractionHistory,
  ): Promise<void> {
    const history = this.getUserHistory(interaction.userId);
    history.push(interaction);

    // Keep only last 50 interactions for performance
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }

    this.interactionHistory.set(interaction.userId, history);
  }

  private getUserHistory(userId: string): InteractionHistory[] {
    if (!this.interactionHistory.has(userId)) {
      this.interactionHistory.set(userId, []);
    }
    return this.interactionHistory.get(userId)!;
  }

  /**
   * Enhanced logging
   */
  private async logEnhancedSecurityEvent(event: any): Promise<void> {
    console.log('[ENHANCED SECURITY EVENT]', {
      timestamp: new Date().toISOString(),
      userId: event.userId,
      agentId: event.agentId,
      threatActions: event.threatResult.actions.length,
      botConfidence: Math.round(event.botAssessment.confidence * 100),
      botRiskLevel: event.botAssessment.riskLevel,
      escalationLevel: event.enforcementResult.escalationLevel,
      purchasesBlocked: event.enforcementResult.blockPurchases,
      verificationRequired: event.enforcementResult.requireVerification,
    });
  }
}

/**
 * Factory function to create enhanced security layer
 */
export function createEnhancedSecurityLayer(): EnhancedSecurityLayer {
  return new EnhancedSecurityLayer();
}
