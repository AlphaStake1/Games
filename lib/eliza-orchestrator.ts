// lib/eliza-orchestrator.ts
/**
 * ElizaOS Character Integration Orchestrator
 *
 * Main orchestrator that manages all Football Squares characters:
 * - Initializes character runtimes
 * - Manages inter-character communication
 * - Handles platform routing
 * - Coordinates with Fry backend services
 */

import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';
import CharacterRuntime, {
  CharacterRuntimeConfig,
  CharacterMessage,
  CharacterResponse,
} from './character-runtime';
import FryCharacterIntegration from '../subagents/Fry/character-integration';
import { MemoryManager } from './memory/manager';

export interface ElizaOrchestratorConfig {
  charactersDir: string;
  memoryConfig: {
    provider: 'postgresql' | 'redis' | 'memory';
    connectionString?: string;
    scopes: Record<string, any>;
  };
  platforms: {
    discord?: { token: string; channels: Record<string, string> };
    telegram?: { token: string };
    twitter?: {
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessTokenSecret: string;
    };
  };
  fryConfig: {
    solanaRPC: string;
    monitoringIntervalMs: number;
    alertThresholds: any;
  };
  enableHotReload?: boolean;
}

export interface PlatformMessage {
  platform: 'discord' | 'telegram' | 'twitter';
  channelId?: string;
  userId: string;
  username: string;
  content: string;
  messageId: string;
  timestamp: Date;
  mentions?: string[];
  attachments?: any[];
}

export class ElizaOrchestrator extends EventEmitter {
  private config: ElizaOrchestratorConfig;
  private characters: Map<string, CharacterRuntime> = new Map();
  private fryIntegration: FryCharacterIntegration;
  private memoryManager: MemoryManager;
  private platformConnections: Map<string, any> = new Map();
  private isRunning: boolean = false;

  constructor(config: ElizaOrchestratorConfig) {
    super();
    this.config = config;
    console.log('🎭 ElizaOS Orchestrator initializing...');
  }

  /**
   * Start the orchestrator and all character runtimes
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Orchestrator already running');
      return;
    }

    console.log('🚀 Starting ElizaOS Football Squares Character System...\n');

    try {
      // Initialize core systems
      await this.initializeMemoryManager();
      await this.initializeFryIntegration();
      await this.loadCharacters();
      await this.initializePlatforms();

      // Start all characters
      await this.startAllCharacters();

      // Setup inter-character communication
      this.setupCharacterCommunication();

      // Setup hot reload if enabled
      if (this.config.enableHotReload) {
        this.setupHotReload();
      }

      this.isRunning = true;
      console.log('🎉 ElizaOS Character System is now fully operational!\n');

      // Display status
      this.displaySystemStatus();

      this.emit('started');
    } catch (error) {
      console.error('❌ Failed to start ElizaOS Orchestrator:', error);
      throw error;
    }
  }

  /**
   * Stop the orchestrator and all characters
   */
  async stop(): Promise<void> {
    if (!this.isRunning) return;

    console.log('⏹️ Stopping ElizaOS Character System...');

    // Stop all characters
    for (const [characterId, runtime] of this.characters) {
      await runtime.stop();
    }

    // Close platform connections
    for (const [platform, connection] of this.platformConnections) {
      if (connection.close) {
        await connection.close();
      }
    }

    // Stop Fry integration
    if (this.fryIntegration) {
      await this.fryIntegration.stop();
    }

    this.isRunning = false;
    console.log('✅ ElizaOS Character System stopped');
    this.emit('stopped');
  }

  /**
   * Process incoming message from any platform
   */
  async processMessage(platformMessage: PlatformMessage): Promise<void> {
    console.log(
      `📨 Processing message from ${platformMessage.username} on ${platformMessage.platform}`,
    );

    try {
      // Determine target character(s)
      const targetCharacters = this.determineTargetCharacters(platformMessage);

      if (targetCharacters.length === 0) {
        console.log('   No characters configured for this message');
        return;
      }

      // Process message with each target character
      for (const characterId of targetCharacters) {
        const character = this.characters.get(characterId);
        if (!character) {
          console.log(`   Character ${characterId} not found`);
          continue;
        }

        const characterMessage: CharacterMessage = {
          characterId,
          platform: platformMessage.platform,
          userId: platformMessage.userId,
          content: platformMessage.content,
          context: {
            channel: platformMessage.channelId,
            threadId: platformMessage.messageId,
            urgency: this.determineUrgency(platformMessage.content),
          },
        };

        try {
          const response = await character.processMessage(characterMessage);
          await this.sendResponse(platformMessage, response, characterId);
        } catch (error) {
          console.error(
            `❌ Error processing message with ${characterId}:`,
            error,
          );

          // Send error response
          await this.sendErrorResponse(platformMessage, characterId, error);
        }
      }
    } catch (error) {
      console.error('❌ Failed to process platform message:', error);
    }
  }

  /**
   * Send character response back to the platform
   */
  private async sendResponse(
    originalMessage: PlatformMessage,
    response: CharacterResponse,
    characterId: string,
  ): Promise<void> {
    const platform = this.platformConnections.get(originalMessage.platform);
    if (!platform) {
      console.error(`Platform ${originalMessage.platform} not connected`);
      return;
    }

    try {
      // Format response based on platform
      const formattedResponse = this.formatResponse(
        response,
        originalMessage.platform,
        characterId,
      );

      // Send response via platform
      switch (originalMessage.platform) {
        case 'discord':
          await this.sendDiscordResponse(
            platform,
            originalMessage,
            formattedResponse,
          );
          break;
        case 'telegram':
          await this.sendTelegramResponse(
            platform,
            originalMessage,
            formattedResponse,
          );
          break;
        case 'twitter':
          await this.sendTwitterResponse(
            platform,
            originalMessage,
            formattedResponse,
          );
          break;
      }

      console.log(
        `   ✅ ${characterId} responded on ${originalMessage.platform}`,
      );
    } catch (error) {
      console.error(
        `❌ Failed to send response via ${originalMessage.platform}:`,
        error,
      );
    }
  }

  /**
   * Initialize memory manager
   */
  private async initializeMemoryManager(): Promise<void> {
    console.log('🧠 Initializing Memory Manager...');

    this.memoryManager = new MemoryManager({
      provider: this.config.memoryConfig.provider,
      connectionString: this.config.memoryConfig.connectionString,
      scopes: this.config.memoryConfig.scopes,
    });

    await this.memoryManager.initialize();
    console.log('   ✅ Memory Manager initialized');
  }

  /**
   * Initialize Fry integration
   */
  private async initializeFryIntegration(): Promise<void> {
    console.log('🔧 Initializing Fry Integration...');

    this.fryIntegration = new FryCharacterIntegration(this.config.fryConfig);
    await this.fryIntegration.start();

    console.log('   ✅ Fry Integration initialized');
  }

  /**
   * Load all character configurations
   */
  private async loadCharacters(): Promise<void> {
    console.log('📁 Loading Character Configurations...');

    const characterFiles = fs
      .readdirSync(this.config.charactersDir)
      .filter((file) => file.endsWith('.json'))
      .filter((file) => !file.includes('README'));

    for (const file of characterFiles) {
      try {
        const filePath = path.join(this.config.charactersDir, file);
        const characterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const config: CharacterRuntimeConfig = {
          characterId: characterData.name || path.basename(file, '.json'),
          memoryScopes: characterData.memoryScopes || ['USER_CHAT'],
          platforms: characterData.clients || ['discord'],
          actions: characterData.actions || [],
          fryIntegration: {
            enabled: true,
            supportLevel: this.determineFrySupportLevel(characterData.name),
            escalationRules: this.generateEscalationRules(characterData.name),
            responseStyle: this.determineResponseStyle(characterData.name),
          },
        };

        const runtime = new CharacterRuntime(
          config,
          this.fryIntegration,
          this.memoryManager,
        );
        this.characters.set(config.characterId, runtime);

        console.log(`   ✅ Loaded character: ${config.characterId}`);
      } catch (error) {
        console.error(`   ❌ Failed to load character from ${file}:`, error);
      }
    }

    console.log(`   📊 Total characters loaded: ${this.characters.size}`);
  }

  /**
   * Initialize platform connections
   */
  private async initializePlatforms(): Promise<void> {
    console.log('🌐 Initializing Platform Connections...');

    // Discord integration
    if (this.config.platforms.discord) {
      try {
        const discord = await this.initializeDiscord(
          this.config.platforms.discord,
        );
        this.platformConnections.set('discord', discord);
        console.log('   ✅ Discord connected');
      } catch (error) {
        console.error('   ❌ Discord connection failed:', error);
      }
    }

    // Telegram integration
    if (this.config.platforms.telegram) {
      try {
        const telegram = await this.initializeTelegram(
          this.config.platforms.telegram,
        );
        this.platformConnections.set('telegram', telegram);
        console.log('   ✅ Telegram connected');
      } catch (error) {
        console.error('   ❌ Telegram connection failed:', error);
      }
    }

    // Twitter integration
    if (this.config.platforms.twitter) {
      try {
        const twitter = await this.initializeTwitter(
          this.config.platforms.twitter,
        );
        this.platformConnections.set('twitter', twitter);
        console.log('   ✅ Twitter connected');
      } catch (error) {
        console.error('   ❌ Twitter connection failed:', error);
      }
    }
  }

  /**
   * Start all character runtimes
   */
  private async startAllCharacters(): Promise<void> {
    console.log('🤖 Starting Character Runtimes...');

    const startPromises = Array.from(this.characters.entries()).map(
      async ([characterId, runtime]) => {
        try {
          await runtime.start();
          console.log(`   ✅ ${characterId} started`);
        } catch (error) {
          console.error(`   ❌ Failed to start ${characterId}:`, error);
        }
      },
    );

    await Promise.all(startPromises);
  }

  /**
   * Setup inter-character communication
   */
  private setupCharacterCommunication(): void {
    console.log('🔄 Setting up Inter-Character Communication...');

    // Listen for escalations from all characters
    for (const [characterId, runtime] of this.characters) {
      runtime.on('escalation', async (escalationMessage: CharacterMessage) => {
        console.log(
          `🔄 Escalation: ${characterId} → ${escalationMessage.characterId}`,
        );

        const targetRuntime = this.characters.get(
          escalationMessage.characterId,
        );
        if (targetRuntime) {
          await targetRuntime.processMessage(escalationMessage);
        }
      });

      runtime.on('fryAlert', (alert) => {
        console.log(`🚨 Fry Alert received by ${characterId}`);
        this.emit('fryAlert', { characterId, alert });
      });
    }

    console.log('   ✅ Inter-character communication established');
  }

  /**
   * Setup hot reload for development
   */
  private setupHotReload(): void {
    console.log('🔥 Setting up Hot Reload...');

    fs.watch(
      this.config.charactersDir,
      { recursive: true },
      async (eventType, filename) => {
        if (filename && filename.endsWith('.json')) {
          console.log(`🔄 Character file changed: ${filename}`);

          try {
            // Reload the specific character
            const characterId = path.basename(filename, '.json');
            await this.reloadCharacter(characterId);

            console.log(`   ✅ ${characterId} reloaded successfully`);
          } catch (error) {
            console.error(`   ❌ Failed to reload character:`, error);
          }
        }
      },
    );

    console.log('   ✅ Hot reload enabled');
  }

  /**
   * Reload a specific character
   */
  private async reloadCharacter(characterId: string): Promise<void> {
    // Stop existing character
    const existingRuntime = this.characters.get(characterId);
    if (existingRuntime) {
      await existingRuntime.stop();
    }

    // Load new configuration
    const filePath = path.join(
      this.config.charactersDir,
      `${characterId}.json`,
    );
    if (fs.existsSync(filePath)) {
      const characterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const config: CharacterRuntimeConfig = {
        characterId: characterData.name || characterId,
        memoryScopes: characterData.memoryScopes || ['USER_CHAT'],
        platforms: characterData.clients || ['discord'],
        actions: characterData.actions || [],
        fryIntegration: {
          enabled: true,
          supportLevel: this.determineFrySupportLevel(characterData.name),
          escalationRules: this.generateEscalationRules(characterData.name),
          responseStyle: this.determineResponseStyle(characterData.name),
        },
      };

      const runtime = new CharacterRuntime(
        config,
        this.fryIntegration,
        this.memoryManager,
      );
      await runtime.start();

      this.characters.set(characterId, runtime);
    }
  }

  /**
   * Determine which characters should handle a message
   */
  private determineTargetCharacters(message: PlatformMessage): string[] {
    const targets: string[] = [];

    // Check for direct mentions
    if (message.mentions) {
      for (const mention of message.mentions) {
        if (this.characters.has(mention)) {
          targets.push(mention);
        }
      }
    }

    // If no direct mentions, use default routing
    if (targets.length === 0) {
      // Route to appropriate character based on content and platform
      const content = message.content.toLowerCase();

      if (content.includes('help') || content.includes('support')) {
        targets.push('Trainer_Reviva');
      } else if (content.includes('game') || content.includes('rules')) {
        targets.push('Coach_B');
      } else if (content.includes('security') || content.includes('hack')) {
        targets.push('Dean_Security');
      } else if (
        content.includes('partnership') ||
        content.includes('business')
      ) {
        targets.push('Morgan_Reese');
      } else {
        // Default to community manager or head coach based on platform
        if (message.platform === 'discord') {
          targets.push('Coach_Right');
        } else {
          targets.push('Coach_B');
        }
      }
    }

    return targets;
  }

  /**
   * Determine message urgency based on content
   */
  private determineUrgency(
    content: string,
  ): 'low' | 'medium' | 'high' | 'critical' {
    const lowerContent = content.toLowerCase();

    if (
      lowerContent.includes('urgent') ||
      lowerContent.includes('critical') ||
      lowerContent.includes('emergency')
    ) {
      return 'critical';
    } else if (
      lowerContent.includes('important') ||
      lowerContent.includes('issue') ||
      lowerContent.includes('problem')
    ) {
      return 'high';
    } else if (
      lowerContent.includes('help') ||
      lowerContent.includes('question')
    ) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Format response for specific platform
   */
  private formatResponse(
    response: CharacterResponse,
    platform: string,
    characterId: string,
  ): string {
    let formatted = response.content;

    // Add character identification for multi-character channels
    if (platform === 'discord') {
      formatted = `**${characterId}**: ${formatted}`;
    }

    // Platform-specific formatting
    if (platform === 'twitter') {
      // Truncate for Twitter character limit
      if (formatted.length > 280) {
        formatted = formatted.substring(0, 277) + '...';
      }
    }

    return formatted;
  }

  /**
   * Display system status
   */
  private displaySystemStatus(): void {
    console.log('📊 System Status:');
    console.log('━'.repeat(50));
    console.log(`Characters: ${this.characters.size} active`);
    console.log(`Platforms: ${this.platformConnections.size} connected`);
    console.log(
      `Fry Integration: ${this.fryIntegration ? 'Active' : 'Inactive'}`,
    );
    console.log(
      `Memory Manager: ${this.memoryManager ? 'Active' : 'Inactive'}`,
    );
    console.log(
      `Hot Reload: ${this.config.enableHotReload ? 'Enabled' : 'Disabled'}`,
    );
    console.log('');

    console.log('🤖 Active Characters:');
    for (const characterId of this.characters.keys()) {
      console.log(`   • ${characterId}`);
    }
    console.log('');

    console.log('🌐 Connected Platforms:');
    for (const platform of this.platformConnections.keys()) {
      console.log(`   • ${platform}`);
    }
    console.log('');
  }

  // Platform-specific initialization methods (simplified implementations)
  private async initializeDiscord(config: any): Promise<any> {
    // This would use discord.js or similar
    return {
      send: async (channelId: string, content: string) => {
        /* Discord send logic */
      },
      close: async () => {
        /* Discord cleanup */
      },
    };
  }

  private async initializeTelegram(config: any): Promise<any> {
    // This would use telegraf or similar
    return {
      send: async (chatId: string, content: string) => {
        /* Telegram send logic */
      },
      close: async () => {
        /* Telegram cleanup */
      },
    };
  }

  private async initializeTwitter(config: any): Promise<any> {
    // This would use twitter-api-v2 or similar
    return {
      tweet: async (content: string) => {
        /* Twitter tweet logic */
      },
      close: async () => {
        /* Twitter cleanup */
      },
    };
  }

  // Platform-specific response methods
  private async sendDiscordResponse(
    platform: any,
    message: PlatformMessage,
    response: string,
  ): Promise<void> {
    // Discord-specific response logic
    console.log(`Discord response: ${response}`);
  }

  private async sendTelegramResponse(
    platform: any,
    message: PlatformMessage,
    response: string,
  ): Promise<void> {
    // Telegram-specific response logic
    console.log(`Telegram response: ${response}`);
  }

  private async sendTwitterResponse(
    platform: any,
    message: PlatformMessage,
    response: string,
  ): Promise<void> {
    // Twitter-specific response logic
    console.log(`Twitter response: ${response}`);
  }

  private async sendErrorResponse(
    message: PlatformMessage,
    characterId: string,
    error: Error,
  ): Promise<void> {
    const errorResponse = `Sorry, ${characterId} encountered an error. Please try again later.`;
    // Send error response via appropriate platform
    console.log(`Error response for ${characterId}: ${errorResponse}`);
  }

  // Helper methods for character configuration
  private determineFrySupportLevel(
    characterName: string,
  ): 'full' | 'escalation' | 'monitoring' {
    const supportRoles = ['Trainer_Reviva', 'Coach_B'];
    const escalationRoles = ['Dean_Security', 'Commissioner_Jerry'];

    if (supportRoles.includes(characterName)) return 'full';
    if (escalationRoles.includes(characterName)) return 'escalation';
    return 'monitoring';
  }

  private generateEscalationRules(characterName: string): any {
    // Generate escalation rules based on character role
    return {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['executive_decision_required'],
      threshold: 'high',
    };
  }

  private determineResponseStyle(characterName: string): string {
    const styleMap = {
      Trainer_Reviva: 'empathetic_detailed',
      Coach_B: 'supportive_sports',
      Dean_Security: 'technical_terse',
      Commissioner_Jerry: 'executive_summary',
    };
    return styleMap[characterName] || 'professional_generic';
  }
}

export default ElizaOrchestrator;
