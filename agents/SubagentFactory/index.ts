/**
 * Subagent Factory for Football Squares Platform
 *
 * Centralized factory for creating and managing specialized subagents.
 * Provides a unified interface for subagent instantiation, configuration,
 * and lifecycle management.
 */

import { EventEmitter } from 'events';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

// Import all available agents
import { BoardAgent } from '../BoardAgent';
import { RandomizerAgent } from '../RandomizerAgent';
import { OracleAgent } from '../OracleAgent';
import { WinnerAgent } from '../WinnerAgent';
import { EmailAgent } from '../EmailAgent';
import { DocumentationAgent } from '../DocumentationAgent';
import { CodeReviewAgent } from '../CodeReviewAgent';
import { TestingOrchestrator } from '../TestingOrchestrator';
import OrchestratorAgent from '../OrchestratorAgent';

interface AgentConfig {
  type: 'game' | 'development' | 'orchestration';
  capabilities: string[];
  dependencies: string[];
  environment: 'localnet' | 'devnet' | 'mainnet' | 'any';
  resources: {
    memory: 'low' | 'medium' | 'high';
    cpu: 'low' | 'medium' | 'high';
    network: boolean;
  };
}

interface AgentInstance {
  id: string;
  name: string;
  type: string;
  instance: any;
  config: AgentConfig;
  status: 'idle' | 'busy' | 'error' | 'shutdown';
  createdAt: Date;
  lastActivity: Date;
  taskCount: number;
}

interface FactoryOptions {
  connection?: Connection;
  provider?: AnchorProvider;
  program?: Program;
  maxInstances: number;
  defaultEnvironment: 'localnet' | 'devnet' | 'mainnet';
}

export class SubagentFactory extends EventEmitter {
  private instances: Map<string, AgentInstance> = new Map();
  private agentConfigs: Map<string, AgentConfig> = new Map();
  private instanceCounter: number = 0;

  // Solana dependencies
  private connection?: Connection;
  private provider?: AnchorProvider;
  private program?: Program;

  // Factory settings
  private maxInstances: number;
  private defaultEnvironment: 'localnet' | 'devnet' | 'mainnet';

  constructor(options: FactoryOptions) {
    super();

    this.connection = options.connection;
    this.provider = options.provider;
    this.program = options.program;
    this.maxInstances = options.maxInstances;
    this.defaultEnvironment = options.defaultEnvironment;

    this.initializeAgentConfigs();
    console.log(
      `SubagentFactory initialized with max ${this.maxInstances} instances`,
    );
  }

  /**
   * Initialize agent configurations and capabilities
   */
  private initializeAgentConfigs(): void {
    const configs: Array<[string, AgentConfig]> = [
      [
        'BoardAgent',
        {
          type: 'game',
          capabilities: [
            'create_board',
            'get_board_state',
            'purchase_square',
            'board_analytics',
          ],
          dependencies: ['solana_connection', 'anchor_program'],
          environment: 'any',
          resources: { memory: 'medium', cpu: 'medium', network: true },
        },
      ],
      [
        'RandomizerAgent',
        {
          type: 'game',
          capabilities: [
            'request_randomization',
            'check_vrf_status',
            'verify_randomness',
          ],
          dependencies: ['solana_connection', 'switchboard_vrf'],
          environment: 'any',
          resources: { memory: 'low', cpu: 'low', network: true },
        },
      ],
      [
        'OracleAgent',
        {
          type: 'game',
          capabilities: ['fetch_scores', 'poll_game_status', 'update_scores'],
          dependencies: ['solana_connection', 'external_apis'],
          environment: 'any',
          resources: { memory: 'low', cpu: 'medium', network: true },
        },
      ],
      [
        'WinnerAgent',
        {
          type: 'game',
          capabilities: [
            'settle_winner',
            'calculate_payout',
            'distribute_prizes',
          ],
          dependencies: ['solana_connection', 'anchor_program'],
          environment: 'any',
          resources: { memory: 'medium', cpu: 'medium', network: true },
        },
      ],
      [
        'EmailAgent',
        {
          type: 'game',
          capabilities: [
            'send_winner_notification',
            'send_game_updates',
            'send_receipts',
          ],
          dependencies: ['email_service'],
          environment: 'any',
          resources: { memory: 'low', cpu: 'low', network: true },
        },
      ],
      [
        'DocumentationAgent',
        {
          type: 'development',
          capabilities: [
            'generate_anchor_docs',
            'generate_agent_docs',
            'generate_api_docs',
            'generate_user_guides',
          ],
          dependencies: ['anthropic_api'],
          environment: 'any',
          resources: { memory: 'high', cpu: 'medium', network: true },
        },
      ],
      [
        'CodeReviewAgent',
        {
          type: 'development',
          capabilities: [
            'review_rust_code',
            'review_typescript_code',
            'review_agent_integration',
          ],
          dependencies: ['anthropic_api'],
          environment: 'any',
          resources: { memory: 'high', cpu: 'medium', network: true },
        },
      ],
      [
        'TestingOrchestrator',
        {
          type: 'development',
          capabilities: [
            'run_test_suites',
            'generate_test_reports',
            'watch_file_changes',
          ],
          dependencies: ['node_environment'],
          environment: 'any',
          resources: { memory: 'high', cpu: 'high', network: false },
        },
      ],
      [
        'OrchestratorAgent',
        {
          type: 'orchestration',
          capabilities: [
            'plan_tasks',
            'delegate_tasks',
            'coordinate_agents',
            'monitor_health',
          ],
          dependencies: ['anthropic_api', 'solana_connection'],
          environment: 'any',
          resources: { memory: 'high', cpu: 'high', network: true },
        },
      ],
    ];

    configs.forEach(([name, config]) => {
      this.agentConfigs.set(name, config);
    });

    console.log(`Registered ${configs.length} agent configurations`);
  }

  /**
   * Create a new agent instance
   */
  async createAgent<T = any>(
    agentType: string,
    options?: {
      id?: string;
      environment?: 'localnet' | 'devnet' | 'mainnet';
      config?: Partial<AgentConfig>;
    },
  ): Promise<T> {
    // Check instance limits
    if (this.instances.size >= this.maxInstances) {
      throw new Error(`Maximum agent instances reached: ${this.maxInstances}`);
    }

    const config = this.agentConfigs.get(agentType);
    if (!config) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }

    // Validate dependencies
    await this.validateDependencies(config.dependencies);

    // Generate unique instance ID
    const instanceId =
      options?.id || `${agentType}_${++this.instanceCounter}_${Date.now()}`;

    let instance: any;

    try {
      // Create agent instance based on type
      switch (agentType) {
        case 'BoardAgent':
          if (!this.connection || !this.provider || !this.program) {
            throw new Error('Solana dependencies required for BoardAgent');
          }
          instance = new BoardAgent(
            this.connection,
            this.provider,
            this.program,
          );
          break;

        case 'RandomizerAgent':
          if (!this.connection || !this.provider || !this.program) {
            throw new Error('Solana dependencies required for RandomizerAgent');
          }
          instance = new RandomizerAgent(
            this.connection,
            this.provider,
            this.program,
          );
          break;

        case 'OracleAgent':
          if (!this.connection || !this.provider || !this.program) {
            throw new Error('Solana dependencies required for OracleAgent');
          }
          instance = new OracleAgent(
            this.connection,
            this.provider,
            this.program,
          );
          break;

        case 'WinnerAgent':
          if (!this.connection || !this.provider || !this.program) {
            throw new Error('Solana dependencies required for WinnerAgent');
          }
          instance = new WinnerAgent(
            this.connection,
            this.provider,
            this.program,
          );
          break;

        case 'EmailAgent':
          instance = new EmailAgent();
          break;

        case 'DocumentationAgent':
          instance = new DocumentationAgent();
          break;

        case 'CodeReviewAgent':
          instance = new CodeReviewAgent();
          break;

        case 'TestingOrchestrator':
          instance = new TestingOrchestrator();
          break;

        case 'OrchestratorAgent':
          if (!this.connection || !this.provider || !this.program) {
            throw new Error(
              'Solana dependencies required for OrchestratorAgent',
            );
          }
          instance = new OrchestratorAgent(
            this.connection,
            this.provider,
            this.program,
          );
          break;

        default:
          throw new Error(`Unsupported agent type: ${agentType}`);
      }

      // Set up instance tracking
      const agentInstance: AgentInstance = {
        id: instanceId,
        name: agentType,
        type: agentType,
        instance,
        config: { ...config, ...options?.config },
        status: 'idle',
        createdAt: new Date(),
        lastActivity: new Date(),
        taskCount: 0,
      };

      this.instances.set(instanceId, agentInstance);

      // Set up event monitoring
      this.setupInstanceMonitoring(agentInstance);

      this.emit('agentCreated', { instanceId, agentType });
      console.log(`Created ${agentType} instance: ${instanceId}`);

      return instance as T;
    } catch (error) {
      console.error(`Failed to create ${agentType}:`, error);
      throw error;
    }
  }

  /**
   * Get an existing agent instance
   */
  getAgent<T = any>(instanceId: string): T | undefined {
    const agentInstance = this.instances.get(instanceId);
    return agentInstance?.instance as T;
  }

  /**
   * Get all instances of a specific agent type
   */
  getAgentsByType<T = any>(agentType: string): T[] {
    const agents: T[] = [];

    for (const instance of Array.from(this.instances.values())) {
      if (instance.type === agentType) {
        agents.push(instance.instance as T);
      }
    }

    return agents;
  }

  /**
   * Get or create an agent instance (singleton pattern for specific types)
   */
  async getOrCreateAgent<T = any>(
    agentType: string,
    options?: {
      singleton?: boolean;
      environment?: 'localnet' | 'devnet' | 'mainnet';
      config?: Partial<AgentConfig>;
    },
  ): Promise<T> {
    if (options?.singleton) {
      const existing = this.getAgentsByType<T>(agentType);
      if (existing.length > 0) {
        return existing[0];
      }
    }

    return this.createAgent<T>(agentType, options);
  }

  /**
   * Shutdown and remove an agent instance
   */
  async shutdownAgent(instanceId: string): Promise<void> {
    const agentInstance = this.instances.get(instanceId);
    if (!agentInstance) {
      throw new Error(`Agent instance not found: ${instanceId}`);
    }

    try {
      agentInstance.status = 'shutdown';

      // Call shutdown method if available
      if (typeof agentInstance.instance.shutdown === 'function') {
        await agentInstance.instance.shutdown();
      }

      // Remove event listeners
      if (agentInstance.instance.removeAllListeners) {
        agentInstance.instance.removeAllListeners();
      }

      this.instances.delete(instanceId);
      this.emit('agentShutdown', { instanceId, agentType: agentInstance.type });

      console.log(`Shutdown agent instance: ${instanceId}`);
    } catch (error) {
      console.error(`Error shutting down agent ${instanceId}:`, error);
      throw error;
    }
  }

  /**
   * Shutdown all agent instances
   */
  async shutdownAll(): Promise<void> {
    const shutdownPromises = Array.from(this.instances.keys()).map(
      (instanceId) => this.shutdownAgent(instanceId),
    );

    await Promise.allSettled(shutdownPromises);
    console.log('All agent instances shutdown');
  }

  /**
   * Get factory statistics
   */
  getFactoryStats(): {
    totalInstances: number;
    instancesByType: Record<string, number>;
    instancesByStatus: Record<string, number>;
    resourceUsage: {
      memory: { low: number; medium: number; high: number };
      cpu: { low: number; medium: number; high: number };
    };
    oldestInstance: string | null;
    newestInstance: string | null;
  } {
    const instancesByType: Record<string, number> = {};
    const instancesByStatus: Record<string, number> = {};
    const resourceUsage = {
      memory: { low: 0, medium: 0, high: 0 },
      cpu: { low: 0, medium: 0, high: 0 },
    };

    let oldestInstance: AgentInstance | null = null;
    let newestInstance: AgentInstance | null = null;

    for (const instance of Array.from(this.instances.values())) {
      // Count by type
      instancesByType[instance.type] =
        (instancesByType[instance.type] || 0) + 1;

      // Count by status
      instancesByStatus[instance.status] =
        (instancesByStatus[instance.status] || 0) + 1;

      // Resource usage
      resourceUsage.memory[instance.config.resources.memory]++;
      resourceUsage.cpu[instance.config.resources.cpu]++;

      // Track oldest/newest
      if (!oldestInstance || instance.createdAt < oldestInstance.createdAt) {
        oldestInstance = instance;
      }
      if (!newestInstance || instance.createdAt > newestInstance.createdAt) {
        newestInstance = instance;
      }
    }

    return {
      totalInstances: this.instances.size,
      instancesByType,
      instancesByStatus,
      resourceUsage,
      oldestInstance: oldestInstance?.id || null,
      newestInstance: newestInstance?.id || null,
    };
  }

  /**
   * Get all available agent types and their capabilities
   */
  getAvailableAgentTypes(): Array<{
    name: string;
    config: AgentConfig;
    activeInstances: number;
  }> {
    const types: Array<{
      name: string;
      config: AgentConfig;
      activeInstances: number;
    }> = [];

    for (const [name, config] of this.agentConfigs.entries()) {
      const activeInstances = Array.from(this.instances.values()).filter(
        (instance) => instance.type === name,
      ).length;

      types.push({ name, config, activeInstances });
    }

    return types;
  }

  /**
   * Health check for all active instances
   */
  async healthCheckAll(): Promise<Record<string, boolean>> {
    const healthResults: Record<string, boolean> = {};

    const healthChecks = Array.from(this.instances.entries()).map(
      async ([instanceId, agentInstance]) => {
        try {
          let isHealthy = true;

          // Call health check if available
          if (typeof agentInstance.instance.healthCheck === 'function') {
            isHealthy = await agentInstance.instance.healthCheck();
          }

          healthResults[instanceId] = isHealthy;

          // Update status based on health
          if (!isHealthy && agentInstance.status !== 'error') {
            agentInstance.status = 'error';
            this.emit('agentHealthError', {
              instanceId,
              agentType: agentInstance.type,
            });
          }
        } catch (error) {
          healthResults[instanceId] = false;
          agentInstance.status = 'error';
          console.error(`Health check failed for ${instanceId}:`, error);
        }
      },
    );

    await Promise.allSettled(healthChecks);
    return healthResults;
  }

  /**
   * Set up monitoring for an agent instance
   */
  private setupInstanceMonitoring(agentInstance: AgentInstance): void {
    const instance = agentInstance.instance;

    // Monitor events if the instance is an EventEmitter
    if (instance && typeof instance.on === 'function') {
      // Track activity
      const activityEvents = [
        'taskStarted',
        'taskCompleted',
        'operationPerformed',
      ];

      activityEvents.forEach((event) => {
        instance.on(event, () => {
          agentInstance.lastActivity = new Date();
          agentInstance.taskCount++;
          agentInstance.status = 'busy';
        });
      });

      // Track completion
      const completionEvents = ['taskCompleted', 'operationCompleted', 'idle'];

      completionEvents.forEach((event) => {
        instance.on(event, () => {
          agentInstance.status = 'idle';
        });
      });

      // Track errors
      instance.on('error', (error: any) => {
        agentInstance.status = 'error';
        this.emit('agentError', {
          instanceId: agentInstance.id,
          agentType: agentInstance.type,
          error,
        });
      });
    }
  }

  /**
   * Validate agent dependencies
   */
  private async validateDependencies(dependencies: string[]): Promise<void> {
    for (const dependency of dependencies) {
      switch (dependency) {
        case 'solana_connection':
          if (!this.connection) {
            throw new Error('Solana connection required but not provided');
          }
          break;
        case 'anchor_program':
          if (!this.program) {
            throw new Error('Anchor program required but not provided');
          }
          break;
        case 'anthropic_api':
          if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('ANTHROPIC_API_KEY environment variable required');
          }
          break;
        case 'node_environment':
          // Always available in Node.js environment
          break;
        case 'email_service':
          // Basic validation - could be enhanced
          break;
        case 'external_apis':
          // Network connectivity check could be added
          break;
        case 'switchboard_vrf':
          // VRF-specific validation could be added
          break;
      }
    }
  }

  /**
   * Clean up idle instances to free resources
   */
  async cleanupIdleInstances(maxIdleTime: number = 300000): Promise<number> {
    // 5 minutes default
    const now = new Date();
    const idleInstances: string[] = [];

    for (const [instanceId, instance] of this.instances.entries()) {
      const idleTime = now.getTime() - instance.lastActivity.getTime();

      if (idleTime > maxIdleTime && instance.status === 'idle') {
        idleInstances.push(instanceId);
      }
    }

    // Shutdown idle instances
    const cleanupPromises = idleInstances.map((instanceId) =>
      this.shutdownAgent(instanceId).catch((error) =>
        console.error(`Failed to cleanup instance ${instanceId}:`, error),
      ),
    );

    await Promise.allSettled(cleanupPromises);

    console.log(`Cleaned up ${idleInstances.length} idle agent instances`);
    return idleInstances.length;
  }
}

export default SubagentFactory;
