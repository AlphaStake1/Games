// subagents/Fry/character-integration.ts
/**
 * Integration layer between Fry and ElizaOS characters
 *
 * Provides seamless backend support for character actions
 */

import FryInfrastructureAgent, {
  DiagnosticRequest,
  DiagnosticResponse,
} from './index';
import BlockchainDiagnostics, {
  BlockchainDiagnosticRequest,
  BlockchainDiagnosticResult,
} from './blockchain-diagnostics';

export interface CharacterSupportRequest {
  characterId: string;
  issue: string;
  context: {
    userMessage?: string;
    errorLogs?: string;
    systemState?: any;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
  expectedResponse?: 'technical' | 'user_friendly' | 'escalation';
}

export interface CharacterSupportResponse {
  characterId: string;
  diagnosis: string;
  systemIssue: boolean;
  userIssue: boolean;
  characterResponse: {
    shouldRespond: boolean;
    suggestedMessage?: string;
    escalationNeeded?: boolean;
    escalateTo?: string;
  };
  technicalDetails: {
    rootCause: string;
    fixActions: Array<{
      description: string;
      automated: boolean;
      estimatedTime: string;
      completed?: boolean;
    }>;
  };
  userGuidance?: {
    steps: Array<{
      step: number;
      description: string;
      userFriendly: string;
    }>;
    preventionTips: string[];
  };
}

export class FryCharacterIntegration {
  private fryInfra: FryInfrastructureAgent;
  private blockchainDiag: BlockchainDiagnostics;

  constructor(config: {
    solanaRPC: string;
    monitoringIntervalMs: number;
    alertThresholds: {
      responseTime: number;
      errorRate: number;
      uptimeMinimum: number;
    };
  }) {
    this.fryInfra = new FryInfrastructureAgent(config);
    this.blockchainDiag = new BlockchainDiagnostics(config.solanaRPC);

    // Set up event listeners for proactive character support
    this.setupProactiveSupport();
  }

  /**
   * Main entry point for character support requests
   */
  async supportCharacter(
    request: CharacterSupportRequest,
  ): Promise<CharacterSupportResponse> {
    console.log(`🔧 Fry supporting ${request.characterId}: ${request.issue}`);

    try {
      // Determine diagnostic approach based on issue type
      const diagnosticType = this.categorizeIssue(request.issue);

      let diagnosis: DiagnosticResponse | BlockchainDiagnosticResult;

      if (diagnosticType.isBlockchain) {
        diagnosis = await this.handleBlockchainIssue(request, diagnosticType);
      } else {
        diagnosis = await this.handleInfrastructureIssue(
          request,
          diagnosticType,
        );
      }

      // Generate character-specific response
      const characterResponse = await this.generateCharacterResponse(
        request.characterId,
        diagnosis,
        request.expectedResponse,
      );

      return {
        characterId: request.characterId,
        diagnosis: diagnosis.diagnosis || diagnosis.issue,
        systemIssue: diagnosis.systemIssue,
        userIssue: diagnosis.userIssue,
        characterResponse,
        technicalDetails: {
          rootCause: diagnosis.rootCause,
          fixActions: diagnosis.fixActions || [],
        },
        userGuidance: diagnosis.userSteps
          ? {
              steps: diagnosis.userSteps.map((step) => ({
                step: step.number,
                description: step.technicalDescription,
                userFriendly: step.friendlyDescription,
              })),
              preventionTips: diagnosis.preventionMeasures || [],
            }
          : undefined,
      };
    } catch (error) {
      console.error(
        `🚨 Fry character support error for ${request.characterId}:`,
        error,
      );

      return {
        characterId: request.characterId,
        diagnosis: 'Backend diagnostic system encountered an error',
        systemIssue: true,
        userIssue: false,
        characterResponse: {
          shouldRespond: true,
          escalationNeeded: true,
          escalateTo: 'Dean_Security',
        },
        technicalDetails: {
          rootCause: `Fry diagnostic failure: ${error.message}`,
          fixActions: [
            {
              description: 'Manual investigation required',
              automated: false,
              estimatedTime: '10-30 minutes',
            },
          ],
        },
      };
    }
  }

  /**
   * Handle blockchain-specific issues
   */
  private async handleBlockchainIssue(
    request: CharacterSupportRequest,
    diagnosticType: { type: string; priority: string },
  ): Promise<BlockchainDiagnosticResult> {
    const blockchainRequest: BlockchainDiagnosticRequest = {
      type: diagnosticType.type as any,
      errorMessage: request.context.errorLogs,
      expectedBehavior: 'Normal wallet/transaction operation',
    };

    // Extract specific details from context
    if (request.issue.toLowerCase().includes('wallet')) {
      blockchainRequest.walletAddress = this.extractWalletAddress(
        request.context,
      );
    }

    if (request.issue.toLowerCase().includes('transaction')) {
      blockchainRequest.transactionHash = this.extractTransactionHash(
        request.context,
      );
    }

    return await this.blockchainDiag.diagnose(blockchainRequest);
  }

  /**
   * Handle infrastructure issues
   */
  private async handleInfrastructureIssue(
    request: CharacterSupportRequest,
    diagnosticType: { type: string; priority: string },
  ): Promise<DiagnosticResponse> {
    const infraRequest: DiagnosticRequest = {
      issue: request.issue,
      system: diagnosticType.type,
      errorLogs: request.context.errorLogs,
      userContext: request.context.userMessage,
      urgency: request.context.urgency,
    };

    return await this.fryInfra.diagnose(infraRequest);
  }

  /**
   * Categorize issue to determine diagnostic approach
   */
  private categorizeIssue(issue: string): {
    type: string;
    priority: string;
    isBlockchain: boolean;
  } {
    const lowerIssue = issue.toLowerCase();

    // Blockchain issues
    if (lowerIssue.includes('wallet') || lowerIssue.includes('connect')) {
      return { type: 'wallet', priority: 'high', isBlockchain: true };
    }

    if (lowerIssue.includes('transaction') || lowerIssue.includes('tx')) {
      return { type: 'transaction', priority: 'high', isBlockchain: true };
    }

    if (lowerIssue.includes('program') || lowerIssue.includes('anchor')) {
      return { type: 'program', priority: 'critical', isBlockchain: true };
    }

    if (lowerIssue.includes('rpc') || lowerIssue.includes('node')) {
      return { type: 'rpc', priority: 'critical', isBlockchain: true };
    }

    // Infrastructure issues
    if (lowerIssue.includes('discord') || lowerIssue.includes('telegram')) {
      return { type: 'plugin', priority: 'medium', isBlockchain: false };
    }

    if (lowerIssue.includes('database') || lowerIssue.includes('sql')) {
      return { type: 'database', priority: 'high', isBlockchain: false };
    }

    if (lowerIssue.includes('api') || lowerIssue.includes('endpoint')) {
      return { type: 'api', priority: 'medium', isBlockchain: false };
    }

    // Default to infrastructure
    return { type: 'general', priority: 'medium', isBlockchain: false };
  }

  /**
   * Generate character-specific responses based on their personality
   */
  private async generateCharacterResponse(
    characterId: string,
    diagnosis: DiagnosticResponse | BlockchainDiagnosticResult,
    expectedResponse?: string,
  ) {
    const response = {
      shouldRespond: true,
      escalationNeeded: false,
      escalateTo: undefined as string | undefined,
      suggestedMessage: undefined as string | undefined,
    };

    // Check if this is a cross-chain recovery case
    if ('crossChainRecovery' in diagnosis && diagnosis.crossChainRecovery) {
      response.suggestedMessage = this.generateCrossChainRecoveryResponse(
        characterId,
        diagnosis.crossChainRecovery,
      );

      // Special escalation rules for cross-chain recovery
      if (
        !diagnosis.crossChainRecovery.platformCreditEligible &&
        diagnosis.crossChainRecovery.recoveryOptions.length === 0
      ) {
        response.escalationNeeded = true;
        response.escalateTo =
          characterId === 'Dean_Security'
            ? 'Commissioner_Jerry'
            : 'Dean_Security';
      }

      return response;
    }

    // Character-specific response patterns for regular diagnostics
    switch (characterId) {
      case 'Trainer_Reviva':
        response.suggestedMessage = this.generateRevivaResponse(diagnosis);
        if (diagnosis.systemIssue && !diagnosis.userIssue) {
          response.escalationNeeded = true;
          response.escalateTo = 'Dean_Security';
        }
        break;

      case 'Coach_B':
        response.suggestedMessage = this.generateCoachBResponse(diagnosis);
        if (diagnosis.systemIssue) {
          response.escalationNeeded = true;
          response.escalateTo = 'Trainer_Reviva';
        }
        break;

      case 'Dean_Security':
        response.suggestedMessage = this.generateDeanResponse(diagnosis);
        // Dean handles escalations, doesn't escalate further unless critical
        if (
          diagnosis.systemIssue &&
          'status' in diagnosis &&
          diagnosis.status === 'escalated'
        ) {
          response.escalationNeeded = true;
          response.escalateTo = 'Commissioner_Jerry';
        }
        break;

      case 'Commissioner_Jerry':
        response.suggestedMessage = this.generateJerryResponse(diagnosis);
        // Jerry makes final decisions
        break;

      default:
        response.suggestedMessage = this.generateGenericResponse(diagnosis);
    }

    return response;
  }

  /**
   * Handle cross-chain recovery scenarios with character-specific responses
   */
  private generateCrossChainRecoveryResponse(
    characterId: string,
    crossChainResult: any, // CrossChainRecoveryResult type from blockchain-diagnostics
  ): string {
    const recoveryStatus = crossChainResult.recoveryStatus;
    const platformCredit = crossChainResult.platformCreditEligible;
    const recoveryOptions = crossChainResult.recoveryOptions?.length || 0;

    switch (characterId) {
      case 'Trainer_Reviva':
        if (platformCredit) {
          return (
            "Oh no! 😔 I can see you accidentally sent your tokens to the wrong blockchain - that's happened to more people than you'd think! " +
            "The good news is that you're eligible for platform credit, so we can make this right. 🌱 " +
            "I've already started the credit request process. You should see the credit in your account within 24-48 hours. " +
            "In the meantime, here's how to prevent this in the future: always double-check the network before sending! ✨"
          );
        } else if (recoveryOptions > 0) {
          return (
            "Don't panic! 🌱 I found your transaction and we have some recovery options available. " +
            `I've identified ${recoveryOptions} different ways we might be able to help you recover your tokens. ` +
            'Let me walk you through each option so you can choose what works best for you. ' +
            "We're going to get through this together! 💪"
          );
        } else {
          return (
            "I can see your transaction, but unfortunately the tokens went somewhere we can't automatically recover them from. 😔 " +
            "But don't worry - I'm escalating this to our technical team right away. " +
            'They specialize in these complex recovery situations and will review your case personally. ' +
            "I'll keep you updated every step of the way! 🌱"
          );
        }

      case 'Coach_B':
        if (platformCredit) {
          return (
            'Hey champ! 🏈 Looks like the ball got thrown to the wrong end zone - happens to the best of us! ' +
            "Good news is you're eligible for platform credit, so we're calling this play a wash. " +
            "I'm handing you off to Trainer Reviva - she's our specialist for getting players back in the game fast! " +
            "*@Trainer Reviva - we've got a player who needs some technical assistance with a cross-chain recovery!*"
          );
        } else {
          return (
            "Tough break, player! 🏈 Sometimes the ball doesn't go where we intended. " +
            "But every good coach knows - it's not about the fumble, it's about the recovery! " +
            "I'm calling in our technical specialist Trainer Reviva to help you get back in the game. " +
            "She's got all the plays for situations like this!"
          );
        }

      case 'Dean_Security':
        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
        if (platformCredit) {
          return (
            `[${timestamp}] Cross-chain transaction detected. User eligible for platform credit compensation. ` +
            `Recovery status: ${recoveryStatus.toUpperCase()}. Automated credit process initiated. ` +
            `ETA resolution: 24-48 hours. Risk assessment: LOW.`
          );
        } else {
          return (
            `[${timestamp}] Cross-chain recovery analysis complete. Status: ${recoveryStatus.toUpperCase()}. ` +
            `Available recovery vectors: ${recoveryOptions}. Manual intervention ${recoveryOptions === 0 ? 'required' : 'optional'}. ` +
            `Escalating to Commissioner Jerry for resource allocation approval.`
          );
        }

      case 'Commissioner_Jerry':
        if (platformCredit) {
          return (
            'Cross-chain recovery case escalated to me:\n\n' +
            `• Issue: User sent tokens to wrong blockchain\n` +
            `• Recovery status: Platform credit eligible\n` +
            `• Compensation approved: Yes\n` +
            `• Processing time: 24-48 hours\n` +
            `• Resource allocation: Approved for immediate credit issuance\n\n` +
            'Our team will handle this according to standard recovery protocols.'
          );
        } else {
          return (
            'Complex cross-chain recovery case requiring executive review:\n\n' +
            `• Recovery complexity: ${crossChainResult.technicalAnalysis?.recoveryComplexity || 'High'}\n` +
            `• Available options: ${recoveryOptions}\n` +
            `• Estimated cost: ${crossChainResult.estimatedCosts?.totalEstimated || 'TBD'}\n` +
            `• Resource allocation: ${recoveryOptions > 0 ? 'Approved for technical recovery' : 'Manual investigation authorized'}\n\n` +
            'Assigning our best recovery specialists to this case.'
          );
        }

      default:
        return this.generateGenericResponse(crossChainResult);
    }
  }

  /**
   * Generate Trainer Reviva's empathetic response
   */
  private generateRevivaResponse(
    diagnosis: DiagnosticResponse | BlockchainDiagnosticResult,
  ): string {
    if (diagnosis.systemIssue) {
      return (
        "Hey there! 🌱 I can see what's happening - this looks like it's on our end, not yours! " +
        'Our backend team is already working on it. You should see things working normally in just a few minutes. ' +
        "I'll keep an eye on this for you! 💪"
      );
    } else if (diagnosis.userIssue) {
      const userSteps =
        'userSteps' in diagnosis && diagnosis.userSteps
          ? diagnosis.userSteps
              .map((step) => `${step.number}️⃣ ${step.friendlyDescription}`)
              .join('\n')
          : 'Let me walk you through some troubleshooting steps...';

      return (
        `No worries, we can fix this together! 🌱\n\n${userSteps}\n\n` +
        "Take your time with each step, and let me know if you get stuck anywhere. I'm here to help! ✨"
      );
    } else {
      return (
        'Everything looks good on your end! 🌱 Sometimes these things resolve themselves. ' +
        "If you're still having trouble, just let me know and we can dig deeper together! 💪"
      );
    }
  }

  /**
   * Generate Coach B's supportive response
   */
  private generateCoachBResponse(
    diagnosis: DiagnosticResponse | BlockchainDiagnosticResult,
  ): string {
    if (diagnosis.systemIssue) {
      return (
        "Hey team! 🏈 Looks like we've got a temporary technical timeout on our end. " +
        "I'm calling in Trainer Reviva to get this sorted out ASAP. " +
        'While we fix this, feel free to check out the current games and leaderboards! 💪'
      );
    } else if (diagnosis.userIssue) {
      return (
        "No problem! Every pro player runs into technical challenges - it's part of the game! 🏈 " +
        "Let me hand you off to Trainer Reviva - she's our technical specialist and will get you back in the game fast! " +
        "*@Trainer Reviva - we've got a player who needs some technical coaching!*"
      );
    } else {
      return (
        'Looking good from the sidelines! 🏈 Everything seems to be running smoothly. ' +
        'Ready to get back in the game? Let me know if you need anything else, champ! 💪'
      );
    }
  }

  /**
   * Generate Dean's terse security response
   */
  private generateDeanResponse(
    diagnosis: DiagnosticResponse | BlockchainDiagnosticResult,
  ): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (diagnosis.systemIssue) {
      const severity =
        'findings' in diagnosis
          ? diagnosis.findings.some((f) => f.severity === 'critical')
            ? 'CRITICAL'
            : 'HIGH'
          : 'HIGH';

      return (
        `[${timestamp}] ${severity} system issue detected. ${diagnosis.rootCause}. ` +
        `Automated remediation ${diagnosis.fixActions?.length ? 'initiated' : 'pending'}. ` +
        `ETA resolution: ${diagnosis.fixActions?.[0]?.estimatedTime || 'TBD'}.`
      );
    } else {
      return (
        `[${timestamp}] Diagnostic complete. No security implications. ` +
        `Issue categorized as user-environment. Recommended: standard troubleshooting protocols.`
      );
    }
  }

  /**
   * Generate Commissioner Jerry's executive response
   */
  private generateJerryResponse(
    diagnosis: DiagnosticResponse | BlockchainDiagnosticResult,
  ): string {
    if (diagnosis.systemIssue) {
      return (
        'System issue identified and escalated to me:\n\n' +
        `• Root cause: ${diagnosis.rootCause}\n` +
        `• Impact: ${diagnosis.systemIssue ? 'System-wide' : 'User-specific'}\n` +
        `• Resolution ETA: ${diagnosis.fixActions?.[0]?.estimatedTime || 'Investigating'}\n` +
        `• Resource allocation: Approved for immediate fix\n\n` +
        'Monitoring situation closely. Will update when resolved.'
      );
    } else {
      return (
        'Issue review completed:\n\n' +
        `• Status: Resolved at support level\n` +
        `• System impact: None\n` +
        `• User resolution: Support team handled\n\n` +
        'No executive action required. Good work by the team.'
      );
    }
  }

  /**
   * Generate generic response for other characters
   */
  private generateGenericResponse(
    diagnosis: DiagnosticResponse | BlockchainDiagnosticResult,
  ): string {
    if (diagnosis.systemIssue) {
      return (
        "I've identified a technical issue that our backend team is addressing. " +
        'This should be resolved shortly. Thank you for your patience!'
      );
    } else {
      return (
        "I've analyzed the situation and everything appears to be working correctly. " +
        "If you're still experiencing issues, please provide more details."
      );
    }
  }

  /**
   * Extract wallet address from context (simplified)
   */
  private extractWalletAddress(context: any): string | undefined {
    // This would implement wallet address extraction logic
    // from user messages, error logs, etc.
    return undefined;
  }

  /**
   * Extract transaction hash from context (simplified)
   */
  private extractTransactionHash(context: any): string | undefined {
    // This would implement transaction hash extraction logic
    return undefined;
  }

  /**
   * Set up proactive support for characters
   */
  private setupProactiveSupport() {
    // Listen for infrastructure alerts
    this.fryInfra.on('criticalAlert', (status) => {
      console.log(
        '🚨 Fry proactive alert: Critical infrastructure issue detected',
      );

      // Notify relevant characters
      this.notifyCharacters('critical', {
        issue: 'Infrastructure critical alert',
        details: status,
        affectedServices: status.services.filter((s) => s.status === 'offline'),
      });
    });

    this.fryInfra.on('degradedAlert', (status) => {
      console.log(
        '⚠️ Fry proactive alert: Infrastructure degradation detected',
      );

      // Notify Dean for monitoring
      this.notifyCharacters('degraded', {
        issue: 'Infrastructure performance degradation',
        details: status,
        affectedServices: status.services.filter(
          (s) => s.status === 'degraded',
        ),
      });
    });
  }

  /**
   * Notify characters of proactive issues
   */
  private notifyCharacters(severity: 'critical' | 'degraded', details: any) {
    // This would implement character notification logic
    // Could integrate with ElizaOS event system
    console.log(
      `📢 Fry notifying characters of ${severity} issue:`,
      details.issue,
    );
  }

  /**
   * Start Fry's monitoring and support systems
   */
  async start() {
    console.log('🚀 Starting Fry character integration...');
    this.fryInfra.startMonitoring();
    console.log('✅ Fry ready to support characters');
  }

  /**
   * Stop Fry's systems
   */
  async stop() {
    console.log('⏹️ Stopping Fry character integration...');
    this.fryInfra.stopMonitoring();
    console.log('✅ Fry systems stopped');
  }

  /**
   * Health check for the integration system
   */
  async healthCheck() {
    const [infraHealth, blockchainHealth] = await Promise.all([
      this.fryInfra.healthCheck(),
      // Blockchain diagnostics health would go here
    ]);

    return {
      status: 'operational',
      components: {
        infrastructure: infraHealth.status,
        blockchain: 'ready',
        characterIntegration: 'active',
      },
      capabilities: [
        'character_backend_support',
        'proactive_issue_detection',
        'automated_diagnostics',
        'blockchain_troubleshooting',
        'infrastructure_monitoring',
      ],
      supportedCharacters: [
        'Trainer_Reviva',
        'Coach_B',
        'Dean_Security',
        'Commissioner_Jerry',
        'All_Characters',
      ],
    };
  }
}

export default FryCharacterIntegration;
