/**
 * Universal Security Layer - Immediate threat protection for all agents
 * Integrates with existing ElizaOS agent architecture
 */

export interface SecurityAction {
  type:
    | 'quarantine_user'
    | 'alert_dean'
    | 'elevated_monitoring'
    | 'log_interaction'
    | 'block_response';
  userId?: string;
  severity?: 'low' | 'medium' | 'high' | 'emergency';
  reason?: string;
  timestamp: number;
  agentId: string;
}

export interface ThreatPattern {
  pattern: RegExp;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  autoBlock: boolean;
}

export interface SecurityAssessment {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  confidence: number;
  triggeredPatterns: string[];
  recommendedActions: SecurityAction[];
}

export class UniversalSecurityLayer {
  private readonly threatPatterns: ThreatPattern[] = [
    // CRITICAL - Immediate blocking patterns
    {
      pattern: /seed\s+phrase/i,
      severity: 'CRITICAL',
      description: 'Seed phrase request detected',
      autoBlock: true,
    },
    {
      pattern: /private\s+key/i,
      severity: 'CRITICAL',
      description: 'Private key request detected',
      autoBlock: true,
    },
    {
      pattern: /wallet.*password/i,
      severity: 'CRITICAL',
      description: 'Wallet password request detected',
      autoBlock: true,
    },
    {
      pattern: /send.*(?:eth|btc|sol|usdc)\b/i,
      severity: 'CRITICAL',
      description: 'Direct crypto transfer request detected',
      autoBlock: true,
    },
    {
      pattern: /free.*(?:nft|token|airdrop)/i,
      severity: 'CRITICAL',
      description: 'Free token scam pattern detected',
      autoBlock: true,
    },
    {
      pattern: /verify.*wallet.*(?:click|link)/i,
      severity: 'CRITICAL',
      description: 'Wallet verification phishing detected',
      autoBlock: true,
    },

    // HIGH - Elevated monitoring patterns
    {
      pattern: /urgent.*(?:now|immediately|quickly)/i,
      severity: 'HIGH',
      description: 'Urgency manipulation detected',
      autoBlock: false,
    },
    {
      pattern: /limited.*time.*offer/i,
      severity: 'HIGH',
      description: 'Limited time pressure tactic detected',
      autoBlock: false,
    },
    {
      pattern: /admin.*help.*wallet/i,
      severity: 'HIGH',
      description: 'Admin impersonation attempt detected',
      autoBlock: false,
    },
    {
      pattern: /bypass.*security/i,
      severity: 'HIGH',
      description: 'Security bypass request detected',
      autoBlock: false,
    },

    // MEDIUM - Suspicious but not blocking
    {
      pattern: /test.*transaction/i,
      severity: 'MEDIUM',
      description: 'Test transaction request (potential scam setup)',
      autoBlock: false,
    },
    {
      pattern: /recover.*lost.*(?:wallet|funds)/i,
      severity: 'MEDIUM',
      description: 'Recovery assistance request (needs verification)',
      autoBlock: false,
    },
    {
      pattern: /connect.*external.*wallet/i,
      severity: 'MEDIUM',
      description: 'External wallet connection request',
      autoBlock: false,
    },
  ];

  private readonly agentSecurityResponses = {
    Coach_B: {
      CRITICAL:
        "🛡️ Security Alert: I can't assist with wallet credentials or transfers. All wallet operations happen through your secure dashboard at /god-mode. Need help navigating there?",
      HIGH: '⚠️ For your safety, I need to remind you that we never ask for private information in chat. All secure operations happen through our official dashboard. How else can I help you with Football Squares?',
      MEDIUM:
        'Just a heads up - for any wallet-related help, please use our official support channels. What else can I help you with about the game?',
    },
    Trainer_Reviva: {
      CRITICAL:
        '🚨 I cannot help with private keys, seed phrases, or direct transfers. For legitimate wallet recovery, please use official wallet recovery tools and verify your identity through proper channels.',
      HIGH: '⚠️ For security reasons, I need to verify your identity before helping with wallet issues. Please provide your public wallet address (never private keys) so I can check your account status.',
      MEDIUM:
        "I notice you're asking about wallet recovery. Let me walk you through the safe, official process step by step.",
    },
    Morgan_Reese: {
      CRITICAL:
        '🔒 I cannot process requests involving payments, transfers, or credentials. All business arrangements require proper contracts and legal review through official channels.',
      HIGH: 'For partnership security, all financial discussions must go through our formal business process. Let me redirect you to our official partnership application.',
      MEDIUM:
        "To ensure both parties are protected, let's keep our discussion focused on partnership structure and mutual benefits.",
    },
    OC_Phil: {
      CRITICAL:
        '🛡️ CBL management never involves sharing wallet credentials. All community tools are accessed through your official CBL dashboard. Let me help you with legitimate community building instead!',
      HIGH: "Hey coach! For CBL security, remember we never handle individual wallet operations. Let's focus on building your community the right way.",
      MEDIUM:
        'Quick reminder - CBL tools are designed to be safe and easy. No wallet credentials needed! What community building challenge can I help with?',
    },
    Coach_Right: {
      CRITICAL:
        '🚫 This type of request violates our community guidelines and appears to be a security threat. Please review our community rules and use official channels for all wallet operations.',
      HIGH: "I need to remind everyone that sharing wallet credentials violates our community safety rules. Let's keep our discussions focused on Football Squares gameplay!",
      MEDIUM:
        'For community safety, wallet discussions should happen through official support channels. What gameplay questions can I help with?',
    },
    Dean: {
      CRITICAL:
        '[SECURITY BREACH DETECTED] Immediate quarantine initiated. Incident logged. Human security team notified.',
      HIGH: '[ELEVATED THREAT] User placed under enhanced monitoring. Security protocols engaged.',
      MEDIUM: '[SECURITY NOTE] Suspicious activity logged for review.',
    },
  };

  /**
   * Main security assessment method - integrates with existing agent message processing
   */
  async processMessage(
    agentId: string,
    userId: string,
    message: string,
    proposedResponse: string,
  ): Promise<{ response: string; actions: SecurityAction[] }> {
    try {
      // 1. Assess incoming message for threats
      const assessment = this.assessMessage(message);

      // 2. Generate security actions based on assessment
      const actions = this.generateSecurityActions(assessment, userId, agentId);

      // 3. Determine appropriate response
      const response = this.generateSecureResponse(
        assessment,
        agentId,
        proposedResponse,
      );

      // 4. Log security event
      await this.logSecurityEvent({
        userId,
        agentId,
        message: this.sanitizeForLogging(message),
        assessment,
        actions,
        timestamp: Date.now(),
      });

      return { response, actions };
    } catch (error) {
      console.error('Security layer error:', error);

      // Fail safely - allow original response with logging
      await this.logSecurityError(error, { agentId, userId });
      return {
        response: proposedResponse,
        actions: [
          {
            type: 'log_interaction',
            reason: 'security_layer_error',
            timestamp: Date.now(),
            agentId,
          },
        ],
      };
    }
  }

  /**
   * Assess message content for security threats
   */
  private assessMessage(message: string): SecurityAssessment {
    const triggeredPatterns: string[] = [];
    let highestSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' =
      'SAFE';
    let confidence = 0;

    for (const threatPattern of this.threatPatterns) {
      if (threatPattern.pattern.test(message)) {
        triggeredPatterns.push(threatPattern.description);

        // Track highest severity
        if (
          this.getSeverityWeight(threatPattern.severity) >
          this.getSeverityWeight(highestSeverity)
        ) {
          highestSeverity = threatPattern.severity;
        }

        // Increase confidence for each pattern match
        confidence += this.getPatternConfidence(threatPattern.severity);
      }
    }

    // Cap confidence at 100%
    confidence = Math.min(100, confidence);

    return {
      riskLevel: highestSeverity,
      confidence,
      triggeredPatterns,
      recommendedActions: [],
    };
  }

  /**
   * Generate appropriate security actions based on assessment
   */
  private generateSecurityActions(
    assessment: SecurityAssessment,
    userId: string,
    agentId: string,
  ): SecurityAction[] {
    const actions: SecurityAction[] = [];
    const timestamp = Date.now();

    switch (assessment.riskLevel) {
      case 'CRITICAL':
        actions.push({
          type: 'quarantine_user',
          userId,
          severity: 'emergency',
          reason: `Critical threat detected: ${assessment.triggeredPatterns.join(', ')}`,
          timestamp,
          agentId,
        });
        actions.push({
          type: 'alert_dean',
          severity: 'emergency',
          reason: 'Critical security threat requires immediate attention',
          timestamp,
          agentId,
        });
        break;

      case 'HIGH':
        actions.push({
          type: 'elevated_monitoring',
          userId,
          severity: 'high',
          reason: `High-risk patterns detected: ${assessment.triggeredPatterns.join(', ')}`,
          timestamp,
          agentId,
        });
        actions.push({
          type: 'alert_dean',
          severity: 'high',
          reason: 'High-risk user interaction requires monitoring',
          timestamp,
          agentId,
        });
        break;

      case 'MEDIUM':
        actions.push({
          type: 'elevated_monitoring',
          userId,
          severity: 'medium',
          reason: `Suspicious patterns detected: ${assessment.triggeredPatterns.join(', ')}`,
          timestamp,
          agentId,
        });
        break;

      default:
        actions.push({
          type: 'log_interaction',
          severity: 'low',
          reason: 'Normal interaction logged',
          timestamp,
          agentId,
        });
    }

    return actions;
  }

  /**
   * Generate secure response based on threat assessment
   */
  private generateSecureResponse(
    assessment: SecurityAssessment,
    agentId: string,
    originalResponse: string,
  ): string {
    const agentResponses =
      this.agentSecurityResponses[
        agentId as keyof typeof this.agentSecurityResponses
      ];

    if (!agentResponses) {
      // Fallback for unknown agents
      if (assessment.riskLevel === 'CRITICAL') {
        return '🚫 This request has been flagged for security review. Please use official channels for all sensitive operations.';
      }
      return originalResponse;
    }

    // For critical threats, always block with security response
    if (assessment.riskLevel === 'CRITICAL') {
      return agentResponses.CRITICAL;
    }

    // For high threats, use security response
    if (assessment.riskLevel === 'HIGH') {
      return agentResponses.HIGH;
    }

    // For medium threats, add security warning to original response
    if (assessment.riskLevel === 'MEDIUM') {
      return `${agentResponses.MEDIUM}\n\n${originalResponse}`;
    }

    // Safe messages get original response
    return originalResponse;
  }

  /**
   * Utility methods
   */
  private getSeverityWeight(severity: string): number {
    const weights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, SAFE: 0 };
    return weights[severity as keyof typeof weights] || 0;
  }

  private getPatternConfidence(severity: string): number {
    const confidence = { CRITICAL: 40, HIGH: 25, MEDIUM: 15, LOW: 10 };
    return confidence[severity as keyof typeof confidence] || 5;
  }

  private sanitizeForLogging(message: string): string {
    // Remove potential sensitive data from logs
    return message
      .replace(/\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g, '[WALLET_ADDRESS]') // Bitcoin addresses
      .replace(/\b[A-HJ-NP-Z1-9]{32,44}\b/g, '[SOLANA_ADDRESS]') // Solana addresses
      .replace(/\b0x[a-fA-F0-9]{40}\b/g, '[ETH_ADDRESS]') // Ethereum addresses
      .replace(/\b\w{12}\s+\w{12}\s+\w{12}\b/g, '[SEED_PHRASE]') // Seed phrases
      .substring(0, 500); // Limit log message length
  }

  private async logSecurityEvent(event: any): Promise<void> {
    // TODO: Integrate with your logging system
    console.log('[SECURITY EVENT]', {
      timestamp: new Date().toISOString(),
      ...event,
    });
  }

  private async logSecurityError(error: any, context: any): Promise<void> {
    console.error('[SECURITY ERROR]', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
    });
  }
}

/**
 * Factory function to create security layer instance
 */
export function createSecurityLayer(): UniversalSecurityLayer {
  return new UniversalSecurityLayer();
}

/**
 * Middleware function for ElizaOS agent integration
 */
export async function securityMiddleware(
  agentId: string,
  userId: string,
  message: string,
  proposedResponse: string,
  securityLayer: UniversalSecurityLayer = createSecurityLayer(),
): Promise<{ response: string; actions: SecurityAction[] }> {
  return securityLayer.processMessage(
    agentId,
    userId,
    message,
    proposedResponse,
  );
}
