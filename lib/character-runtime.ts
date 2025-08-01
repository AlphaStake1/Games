// lib/character-runtime.ts
/**
 * Character Runtime Integration System
 *
 * Connects ElizaOS characters with:
 * - Fry backend infrastructure support
 * - Memory scope enforcement
 * - Action routing and execution
 * - Cross-character communication
 */

import { EventEmitter } from 'events';
import FryCharacterIntegration from '../subagents/Fry/character-integration';
import { MemoryManager } from './memory/manager';

export interface CharacterRuntimeConfig {
  characterId: string;
  memoryScopes: string[];
  platforms: string[];
  actions: string[];
  fryIntegration: {
    enabled: boolean;
    supportLevel: 'full' | 'escalation' | 'monitoring';
    escalationRules: any;
    responseStyle: string;
  };
}

export interface RuntimeAction {
  name: string;
  description: string;
  requiresFry: boolean;
  fryDiagnosticType?: string;
  handler: (params: any) => Promise<any>;
}

export interface CharacterMessage {
  characterId: string;
  platform: string;
  userId: string;
  content: string;
  context: {
    channel?: string;
    threadId?: string;
    isEscalation?: boolean;
    urgency?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface CharacterResponse {
  content: string;
  shouldEscalate: boolean;
  escalateTo?: string;
  actionTaken?: string;
  fryDiagnosis?: any;
  memoryUpdates?: Array<{
    scope: string;
    key: string;
    value: any;
  }>;
}

export class CharacterRuntime extends EventEmitter {
  private config: CharacterRuntimeConfig;
  private fry: FryCharacterIntegration;
  private memoryManager: MemoryManager;
  private actions: Map<string, RuntimeAction> = new Map();
  private isActive: boolean = false;

  constructor(
    config: CharacterRuntimeConfig,
    fryIntegration: FryCharacterIntegration,
    memoryManager: MemoryManager,
  ) {
    super();
    this.config = config;
    this.fry = fryIntegration;
    this.memoryManager = memoryManager;

    this.setupActions();
    console.log(`🤖 Character Runtime initialized: ${config.characterId}`);
  }

  /**
   * Start the character runtime
   */
  async start(): Promise<void> {
    if (this.isActive) return;

    this.isActive = true;
    console.log(`🚀 Starting character runtime: ${this.config.characterId}`);

    // Set up event listeners
    this.setupEventListeners();

    // Initialize memory access
    await this.initializeMemoryAccess();

    // Register with Fry if enabled
    if (this.config.fryIntegration.enabled) {
      await this.registerWithFry();
    }

    this.emit('started', this.config.characterId);
  }

  /**
   * Stop the character runtime
   */
  async stop(): Promise<void> {
    this.isActive = false;
    console.log(`⏹️ Stopping character runtime: ${this.config.characterId}`);

    this.emit('stopped', this.config.characterId);
  }

  /**
   * Process incoming message
   */
  async processMessage(message: CharacterMessage): Promise<CharacterResponse> {
    if (!this.isActive) {
      throw new Error(
        `Character runtime ${this.config.characterId} is not active`,
      );
    }

    console.log(
      `💬 ${this.config.characterId} processing message from ${message.userId}`,
    );

    try {
      // Store message in memory
      await this.storeMessage(message);

      // Analyze message for action triggers
      const actionIntent = await this.analyzeMessageIntent(message);

      // Execute action if needed
      let actionResult = null;
      if (actionIntent.actionName) {
        actionResult = await this.executeAction(actionIntent.actionName, {
          message,
          ...actionIntent.parameters,
        });
      }

      // Generate response
      const response = await this.generateResponse(
        message,
        actionIntent,
        actionResult,
      );

      // Handle escalations
      if (response.shouldEscalate) {
        await this.handleEscalation(message, response);
      }

      // Update memory with response
      await this.storeResponse(message, response);

      return response;
    } catch (error) {
      console.error(
        `❌ Error processing message for ${this.config.characterId}:`,
        error,
      );

      return {
        content: this.generateErrorResponse(
          error instanceof Error ? error : new Error(String(error)),
        ),
        shouldEscalate: true,
        escalateTo: 'Dean_Security',
        fryDiagnosis: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Execute specific character action
   */
  async executeAction(actionName: string, parameters: any): Promise<any> {
    const action = this.actions.get(actionName);
    if (!action) {
      throw new Error(
        `Action ${actionName} not found for character ${this.config.characterId}`,
      );
    }

    console.log(
      `🎯 ${this.config.characterId} executing action: ${actionName}`,
    );

    try {
      // Get Fry support if required
      let fryDiagnosis = null;
      if (action.requiresFry && this.config.fryIntegration.enabled) {
        fryDiagnosis = await this.getFrySupport(action, parameters);
      }

      // Execute the action
      const result = await action.handler({
        ...parameters,
        fryDiagnosis,
        characterId: this.config.characterId,
        memoryManager: this.memoryManager,
      });

      return {
        actionName,
        result,
        fryDiagnosis,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`❌ Action execution failed: ${actionName}`, error);
      throw error;
    }
  }

  /**
   * Get support from Fry for character action
   */
  private async getFrySupport(
    action: RuntimeAction,
    parameters: any,
  ): Promise<any> {
    if (!action.fryDiagnosticType) {
      return null;
    }

    try {
      const supportRequest = {
        characterId: this.config.characterId,
        issue:
          parameters.message?.content || 'Character action support request',
        context: {
          userMessage: parameters.message?.content,
          actionName: action.name,
          urgency: parameters.message?.context?.urgency || 'medium',
        },
        expectedResponse: this.config.fryIntegration.responseStyle as
          | 'technical'
          | 'user_friendly'
          | 'escalation',
      };

      return await this.fry.supportCharacter(supportRequest);
    } catch (error) {
      console.error('❌ Fry support request failed:', error);
      return null;
    }
  }

  /**
   * Setup character-specific actions
   */
  private setupActions(): void {
    // Common actions for all characters
    this.registerAction({
      name: 'respond_to_user',
      description: 'Generate contextual response to user message',
      requiresFry: false,
      handler: async (params) => {
        return await this.generateContextualResponse(params.message);
      },
    });

    // Character-specific actions based on config
    if (this.config.characterId === 'Trainer_Reviva') {
      this.setupRevivaActions();
    } else if (this.config.characterId === 'Coach_B') {
      this.setupCoachBActions();
    } else if (this.config.characterId === 'Dean_Security') {
      this.setupDeanActions();
    } else if (this.config.characterId === 'Commissioner_Jerry') {
      this.setupJerryActions();
    }
    // Add other characters as needed
  }

  /**
   * Setup Trainer Reviva specific actions
   */
  private setupRevivaActions(): void {
    this.registerAction({
      name: 'troubleshoot_wallet',
      description: 'Help users troubleshoot wallet connection issues',
      requiresFry: true,
      fryDiagnosticType: 'wallet',
      handler: async (params) => {
        const diagnosis = params.fryDiagnosis;

        if (diagnosis?.systemIssue) {
          return {
            message:
              'I can see this is a system issue on our end! 🌱 Our backend team is already working on it.',
            escalationNeeded: true,
            escalateTo: 'Dean_Security',
          };
        }

        return {
          message:
            "Let me help you troubleshoot your wallet connection! 💪 First, let's try refreshing your connection...",
          steps: diagnosis?.userGuidance?.steps || [],
        };
      },
    });

    this.registerAction({
      name: 'cross_chain_recovery',
      description: 'Handle cross-chain token recovery scenarios',
      requiresFry: true,
      fryDiagnosticType: 'cross_chain_recovery',
      handler: async (params) => {
        const diagnosis = params.fryDiagnosis;

        if (diagnosis?.crossChainRecovery?.platformCreditEligible) {
          return {
            message:
              "Good news! 🌱 You're eligible for platform credit. I've started the process for you!",
            creditAmount:
              diagnosis.crossChainRecovery.estimatedCosts?.totalEstimated,
            processingTime: '24-48 hours',
          };
        }

        return {
          message:
            'I found your transaction! Let me walk you through the recovery options...',
          recoveryOptions: diagnosis?.crossChainRecovery?.recoveryOptions || [],
        };
      },
    });
  }

  /**
   * Setup Coach B specific actions
   */
  private setupCoachBActions(): void {
    this.registerAction({
      name: 'onboard_player',
      description: 'Guide new players through game setup',
      requiresFry: false,
      handler: async (params) => {
        return {
          message:
            'Welcome to the team, champ! 🏈 Let me show you how Football Squares works...',
          onboardingSteps: [
            'Choose your squares on the board',
            'Wait for the random number generation',
            'Watch the game and cheer for your numbers!',
            'Collect your winnings if you win! 💰',
          ],
        };
      },
    });

    this.registerAction({
      name: 'explain_rules',
      description: 'Explain Football Squares rules and mechanics',
      requiresFry: false,
      handler: async (params) => {
        return {
          message: "Here's how the game works, player! 🏈",
          rules: [
            'Buy squares on a 10x10 grid',
            'Numbers 0-9 are randomly assigned to rows and columns',
            "Winners are determined by the last digit of each team's score",
            'Payouts happen each quarter based on the score at that time',
          ],
        };
      },
    });
  }

  /**
   * Setup Dean Security specific actions
   */
  private setupDeanActions(): void {
    this.registerAction({
      name: 'security_scan',
      description: 'Run security scans and threat analysis',
      requiresFry: false,
      handler: async (params) => {
        // This would integrate with the actual Dean security agent
        return {
          message:
            '[SECURITY SCAN] Initiating comprehensive security analysis...',
          scanId: `scan_${Date.now()}`,
          status: 'initiated',
        };
      },
    });

    this.registerAction({
      name: 'incident_response',
      description: 'Handle security incidents and alerts',
      requiresFry: true,
      fryDiagnosticType: 'rpc',
      handler: async (params) => {
        const diagnosis = params.fryDiagnosis;

        return {
          message: `[INCIDENT RESPONSE] ${diagnosis?.rootCause || 'Security incident detected'}. Automated remediation initiated.`,
          severity: diagnosis?.systemIssue ? 'HIGH' : 'MEDIUM',
          eta: diagnosis?.fixActions?.[0]?.estimatedTime || 'TBD',
        };
      },
    });
  }

  /**
   * Setup Commissioner Jerry specific actions
   */
  private setupJerryActions(): void {
    this.registerAction({
      name: 'resource_allocation',
      description: 'Approve resource allocation for issue resolution',
      requiresFry: false,
      handler: async (params) => {
        return {
          message: 'Resource allocation request reviewed and approved.',
          approvalId: `approval_${Date.now()}`,
          allocatedResources:
            params.requestedResources || 'Standard support package',
        };
      },
    });

    this.registerAction({
      name: 'escalation_review',
      description: 'Review and decide on escalated issues',
      requiresFry: true,
      fryDiagnosticType: 'program',
      handler: async (params) => {
        const diagnosis = params.fryDiagnosis;

        return {
          message: `Executive review complete:\n• Issue: ${diagnosis?.issue}\n• Resolution: Approved for immediate action\n• Resources: Allocated`,
          decision: 'approved',
          priority: diagnosis?.systemIssue ? 'critical' : 'high',
        };
      },
    });
  }

  /**
   * Register a character action
   */
  private registerAction(action: RuntimeAction): void {
    this.actions.set(action.name, action);
    console.log(`   ✅ Registered action: ${action.name}`);
  }

  /**
   * Analyze message to determine intent and required actions
   */
  private async analyzeMessageIntent(message: CharacterMessage): Promise<{
    actionName?: string;
    confidence: number;
    parameters: any;
  }> {
    const content = message.content.toLowerCase();

    // Simple intent detection - in production, you'd use NLP
    const intentPatterns = {
      troubleshoot_wallet: /wallet.*connect|connection.*fail|phantom.*error/i,
      cross_chain_recovery:
        /sent.*wrong.*chain|polygon.*ethereum|cross.*chain/i,
      onboard_player: /how.*play|new.*player|getting.*start/i,
      explain_rules: /rules|how.*work|game.*mechanic/i,
      security_scan: /security.*scan|check.*vulnerabilit/i,
      incident_response: /security.*incident|system.*down|breach/i,
    };

    for (const [actionName, pattern] of Object.entries(intentPatterns)) {
      if (pattern.test(message.content)) {
        // Check if this character can perform this action
        if (this.actions.has(actionName)) {
          return {
            actionName,
            confidence: 0.8,
            parameters: { message },
          };
        }
      }
    }

    return { confidence: 0, parameters: {} };
  }

  /**
   * Generate response based on message and action results
   */
  private async generateResponse(
    message: CharacterMessage,
    actionIntent: any,
    actionResult: any,
  ): Promise<CharacterResponse> {
    let response: CharacterResponse = {
      content: '',
      shouldEscalate: false,
    };

    if (actionResult) {
      // Use action result to generate response
      response.content =
        actionResult.result.message || 'Action completed successfully.';
      response.actionTaken = actionResult.actionName;
      response.fryDiagnosis = actionResult.fryDiagnosis;

      if (actionResult.result.escalationNeeded) {
        response.shouldEscalate = true;
        response.escalateTo = actionResult.result.escalateTo;
      }
    } else {
      // Generate general response
      response.content = await this.generateContextualResponse(message);
    }

    return response;
  }

  /**
   * Generate contextual response based on character personality
   */
  private async generateContextualResponse(
    message: CharacterMessage,
  ): Promise<string> {
    // This would integrate with the character's personality from their JSON file
    // For now, return character-specific default responses

    const defaultResponses = {
      Trainer_Reviva:
        "Hey there! 🌱 I'm here to help you with any technical issues you might be having. What's going on?",
      Coach_B:
        'Hey champ! 🏈 What can I help you with today? Ready to get in the game?',
      Dean_Security:
        '[SYSTEM] Message received. Analyzing for security implications. Please specify the nature of your request.',
      Commissioner_Jerry:
        "I've received your message. Please provide more details about what requires my attention.",
      Coach_Right:
        "Hey there! 👋 Great to see you in the community. What's on your mind?",
      Morgan_Reese:
        "Hello! I'm here to help with any business development or partnership questions you might have.",
      Patel_Neil:
        "Hi! I'm tracking our growth metrics and can help with marketing-related questions.",
      Jordan_Banks:
        'Greetings. I handle financial matters and compliance. How can I assist you?',
      OC_Phil:
        "Welcome! I'm here to help with Community Board Leader training and support. 📚",
    };

    return (
      defaultResponses[
        this.config.characterId as keyof typeof defaultResponses
      ] || 'Hello! How can I assist you today?'
    );
  }

  /**
   * Handle message escalation between characters
   */
  private async handleEscalation(
    message: CharacterMessage,
    response: CharacterResponse,
  ): Promise<void> {
    if (!response.escalateTo) return;

    console.log(
      `🔄 ${this.config.characterId} escalating to ${response.escalateTo}`,
    );

    const escalationMessage: CharacterMessage = {
      ...message,
      characterId: response.escalateTo,
      content: `[ESCALATION from ${this.config.characterId}] ${message.content}`,
      context: {
        ...message.context,
        isEscalation: true,
        urgency: 'high',
      },
    };

    this.emit('escalation', escalationMessage);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for escalations from other characters
    this.on('escalation', async (escalationMessage: CharacterMessage) => {
      if (escalationMessage.characterId === this.config.characterId) {
        console.log(`📥 ${this.config.characterId} received escalation`);
        await this.processMessage(escalationMessage);
      }
    });

    // TODO: Listen for Fry alerts when FryCharacterIntegration extends EventEmitter
    // if (this.config.fryIntegration.enabled) {
    //   this.fry.on('criticalAlert', (alert) => {
    //     console.log(
    //       `🚨 ${this.config.characterId} received critical alert from Fry`,
    //     );
    //     this.emit('fryAlert', { characterId: this.config.characterId, alert });
    //   });
    // }
  }

  /**
   * Initialize memory access for character
   */
  private async initializeMemoryAccess(): Promise<void> {
    for (const scope of this.config.memoryScopes) {
      await this.memoryManager.ensureAccess(this.config.characterId, scope);
    }
    console.log(
      `   ✅ Memory access initialized for scopes: ${this.config.memoryScopes.join(', ')}`,
    );
  }

  /**
   * Register character with Fry integration
   */
  private async registerWithFry(): Promise<void> {
    console.log(
      `   🔧 Registering ${this.config.characterId} with Fry integration`,
    );
    // This would register the character for Fry support
  }

  /**
   * Store message in appropriate memory scope
   */
  private async storeMessage(message: CharacterMessage): Promise<void> {
    const scope = this.determineMemoryScope(message);
    await this.memoryManager.store(scope, `message_${Date.now()}`, {
      characterId: this.config.characterId,
      platform: message.platform,
      userId: message.userId,
      content: message.content,
      timestamp: new Date(),
    });
  }

  /**
   * Store response in memory
   */
  private async storeResponse(
    message: CharacterMessage,
    response: CharacterResponse,
  ): Promise<void> {
    const scope = this.determineMemoryScope(message);
    await this.memoryManager.store(scope, `response_${Date.now()}`, {
      characterId: this.config.characterId,
      userId: message.userId,
      content: response.content,
      actionTaken: response.actionTaken,
      escalated: response.shouldEscalate,
      timestamp: new Date(),
    });
  }

  /**
   * Determine appropriate memory scope for message
   */
  private determineMemoryScope(message: CharacterMessage): string {
    // Simple scope determination logic
    if (
      message.context.isEscalation ||
      message.context.urgency === 'critical'
    ) {
      return 'SYS_INTERNAL';
    }

    if (message.platform === 'internal') {
      return 'SYS_INTERNAL';
    }

    return 'USER_CHAT';
  }

  /**
   * Generate error response
   */
  private generateErrorResponse(error: Error): string {
    const errorResponses = {
      Trainer_Reviva:
        'Oops! 😔 I ran into a technical issue. Let me get some help for you!',
      Coach_B:
        'Looks like we hit a technical timeout, champ! 🏈 Let me call in our technical team.',
      Dean_Security:
        '[ERROR] System malfunction detected. Escalating to manual intervention.',
      Commissioner_Jerry:
        'System error encountered. Initiating manual review process.',
    };

    return (
      errorResponses[this.config.characterId as keyof typeof errorResponses] ||
      "I'm sorry, I encountered an error. Please try again."
    );
  }
}

export default CharacterRuntime;
