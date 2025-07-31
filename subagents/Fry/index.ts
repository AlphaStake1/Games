// subagents/Fry/index.ts
/**
 * Fry - Backend Infrastructure & Blockchain Specialist Subagent
 *
 * NOT user-facing. Works behind the scenes to support ElizaOS characters with:
 * - Infrastructure monitoring and auto-recovery
 * - Blockchain diagnostics and Web3 troubleshooting
 * - Plugin health management
 * - Technical analysis for character escalations
 *
 * Integrates with: All ElizaOS characters for backend support
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface InfrastructureStatus {
  timestamp: Date;
  services: ServiceStatus[];
  blockchain: BlockchainStatus;
  plugins: PluginStatus[];
  overall: 'healthy' | 'degraded' | 'critical';
  recommendations: string[];
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime?: number;
  lastCheck: Date;
  errorCount: number;
  uptime: number;
}

export interface BlockchainStatus {
  solana: {
    rpcHealth: 'healthy' | 'slow' | 'down';
    blockHeight: number;
    tps: number;
    validatorHealth: boolean;
  };
  walletServices: {
    phantomAPI: boolean;
    solflareAPI: boolean;
    walletAdapterHealth: boolean;
  };
  smartContracts: {
    anchorPrograms: Array<{
      programId: string;
      status: 'deployed' | 'error' | 'upgrading';
      lastInteraction: Date;
    }>;
    multiSigWallets: Array<{
      address: string;
      balance: number;
      signatories: number;
      pendingTx: number;
    }>;
  };
}

export interface PluginStatus {
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'error';
  dependencies: string[];
  lastActivity: Date;
  errorMessages?: string[];
}

export interface DiagnosticRequest {
  issue: string;
  system: string;
  errorLogs?: string;
  userContext?: any;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface DiagnosticResponse {
  diagnosis: string;
  rootCause: string;
  systemIssue: boolean;
  userIssue: boolean;
  fixActions: Array<{
    description: string;
    automated: boolean;
    estimatedTime: string;
  }>;
  userSteps?: Array<{
    number: number;
    technicalDescription: string;
    friendlyDescription: string;
  }>;
  preventionMeasures: string[];
}

export class FryInfrastructureAgent extends EventEmitter {
  private solanaConnection: Connection;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;
  private serviceCache: Map<string, ServiceStatus> = new Map();

  constructor(
    private config: {
      solanaRPC: string;
      monitoringIntervalMs: number;
      alertThresholds: {
        responseTime: number;
        errorRate: number;
        uptimeMinimum: number;
      };
    },
  ) {
    super();

    this.solanaConnection = new Connection(config.solanaRPC, 'confirmed');

    console.log('🔧 Fry Infrastructure Agent initialized');
    console.log(`   RPC: ${config.solanaRPC}`);
    console.log(`   Monitoring: ${config.monitoringIntervalMs}ms intervals`);
  }

  /**
   * Start continuous infrastructure monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🔍 Fry starting infrastructure monitoring...');

    this.monitoringInterval = setInterval(async () => {
      try {
        const status = await this.getInfrastructureStatus();

        // Emit alerts for critical issues
        if (status.overall === 'critical') {
          this.emit('criticalAlert', status);
        } else if (status.overall === 'degraded') {
          this.emit('degradedAlert', status);
        }

        // Auto-fix common issues
        await this.autoFixIssues(status);
      } catch (error) {
        console.error('🚨 Fry monitoring error:', error);
        this.emit('monitoringError', error);
      }
    }, this.config.monitoringIntervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('⏹️ Fry monitoring stopped');
  }

  /**
   * Get comprehensive infrastructure status
   */
  async getInfrastructureStatus(): Promise<InfrastructureStatus> {
    const [services, blockchain, plugins] = await Promise.all([
      this.checkServices(),
      this.checkBlockchainHealth(),
      this.checkPluginStatus(),
    ]);

    const overall = this.determineOverallHealth(services, blockchain, plugins);

    return {
      timestamp: new Date(),
      services,
      blockchain,
      plugins,
      overall,
      recommendations: this.generateRecommendations(
        services,
        blockchain,
        plugins,
      ),
    };
  }

  /**
   * Diagnose specific technical issues
   */
  async diagnose(request: DiagnosticRequest): Promise<DiagnosticResponse> {
    console.log(`🔍 Fry diagnosing: ${request.issue} (${request.urgency})`);

    try {
      // Get current system status for context
      const infraStatus = await this.getInfrastructureStatus();

      // Analyze the specific issue
      const diagnosis = await this.analyzeIssue(request, infraStatus);

      // Generate fix actions
      const fixActions = await this.generateFixActions(diagnosis, request);

      // Create user-friendly steps if needed
      const userSteps = diagnosis.userIssue
        ? await this.generateUserSteps(diagnosis, request)
        : undefined;

      return {
        diagnosis: diagnosis.summary,
        rootCause: diagnosis.rootCause,
        systemIssue: diagnosis.systemIssue,
        userIssue: diagnosis.userIssue,
        fixActions,
        userSteps,
        preventionMeasures: diagnosis.preventionMeasures,
      };
    } catch (error) {
      console.error('🚨 Fry diagnostic error:', error);

      return {
        diagnosis: 'Diagnostic system encountered an error',
        rootCause: `Internal diagnostic failure: ${error.message}`,
        systemIssue: true,
        userIssue: false,
        fixActions: [
          {
            description: 'Escalate to manual troubleshooting',
            automated: false,
            estimatedTime: '10-30 minutes',
          },
        ],
        preventionMeasures: ['Improve diagnostic error handling'],
      };
    }
  }

  /**
   * Check health of external services
   */
  private async checkServices(): Promise<ServiceStatus[]> {
    const services = [
      { name: 'Discord API', url: 'https://discord.com/api/v10/gateway' },
      { name: 'Telegram API', url: 'https://api.telegram.org' },
      { name: 'Twitter API', url: 'https://api.twitter.com/2/tweets' },
      { name: 'Solana RPC', url: this.config.solanaRPC },
      { name: 'Database', url: process.env.DATABASE_URL },
    ];

    const results = await Promise.allSettled(
      services.map(async (service) => {
        const startTime = Date.now();

        try {
          // Simple health check (adjust per service)
          const response = await fetch(service.url, {
            method: 'GET',
            timeout: 5000,
          });

          const responseTime = Date.now() - startTime;
          const status: ServiceStatus = {
            name: service.name,
            status: response.ok ? 'online' : 'degraded',
            responseTime,
            lastCheck: new Date(),
            errorCount: response.ok ? 0 : 1,
            uptime: response.ok ? 100 : 90, // Simplified
          };

          this.serviceCache.set(service.name, status);
          return status;
        } catch (error) {
          const responseTime = Date.now() - startTime;
          const status: ServiceStatus = {
            name: service.name,
            status: 'offline',
            responseTime,
            lastCheck: new Date(),
            errorCount: 1,
            uptime: 0,
          };

          this.serviceCache.set(service.name, status);
          return status;
        }
      }),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<ServiceStatus> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
  }

  /**
   * Check blockchain and Web3 infrastructure health
   */
  private async checkBlockchainHealth(): Promise<BlockchainStatus> {
    try {
      // Solana RPC health checks
      const [slot, health, recentPerformance] = await Promise.allSettled([
        this.solanaConnection.getSlot(),
        this.solanaConnection.getHealth(),
        this.solanaConnection.getRecentPerformanceSamples(1),
      ]);

      const blockHeight = slot.status === 'fulfilled' ? slot.value : 0;
      const rpcHealthy = health.status === 'fulfilled' && health.value === 'ok';
      const tps =
        recentPerformance.status === 'fulfilled' &&
        recentPerformance.value.length > 0
          ? recentPerformance.value[0].numTransactions /
            recentPerformance.value[0].samplePeriodSecs
          : 0;

      // Wallet service health (simplified checks)
      const walletServices = {
        phantomAPI: await this.checkWalletService('phantom'),
        solflareAPI: await this.checkWalletService('solflare'),
        walletAdapterHealth: await this.checkWalletAdapter(),
      };

      // Smart contract health
      const smartContracts = {
        anchorPrograms: await this.checkAnchorPrograms(),
        multiSigWallets: await this.checkMultiSigWallets(),
      };

      return {
        solana: {
          rpcHealth: rpcHealthy ? 'healthy' : 'down',
          blockHeight,
          tps,
          validatorHealth: rpcHealthy, // Simplified
        },
        walletServices,
        smartContracts,
      };
    } catch (error) {
      console.error('🚨 Blockchain health check failed:', error);

      return {
        solana: {
          rpcHealth: 'down',
          blockHeight: 0,
          tps: 0,
          validatorHealth: false,
        },
        walletServices: {
          phantomAPI: false,
          solflareAPI: false,
          walletAdapterHealth: false,
        },
        smartContracts: {
          anchorPrograms: [],
          multiSigWallets: [],
        },
      };
    }
  }

  /**
   * Check wallet service availability
   */
  private async checkWalletService(
    wallet: 'phantom' | 'solflare',
  ): Promise<boolean> {
    try {
      // This would typically check wallet provider APIs
      // For now, return true as a placeholder
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check wallet adapter health
   */
  private async checkWalletAdapter(): Promise<boolean> {
    try {
      // Check if wallet adapter libraries are functioning
      // This would test the actual wallet connection flow
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check Anchor program status
   */
  private async checkAnchorPrograms(): Promise<
    Array<{
      programId: string;
      status: 'deployed' | 'error' | 'upgrading';
      lastInteraction: Date;
    }>
  > {
    // This would check your specific Anchor programs
    // Placeholder implementation
    return [];
  }

  /**
   * Check multi-sig wallet status
   */
  private async checkMultiSigWallets(): Promise<
    Array<{
      address: string;
      balance: number;
      signatories: number;
      pendingTx: number;
    }>
  > {
    // This would check your treasury multi-sig wallets
    // Placeholder implementation
    return [];
  }

  /**
   * Check ElizaOS plugin status
   */
  private async checkPluginStatus(): Promise<PluginStatus[]> {
    // This would check the health of ElizaOS plugins
    // Placeholder implementation
    const plugins = [
      'elizaos-plugin-discord',
      'elizaos-plugin-telegram',
      'elizaos-plugin-sql',
      'elizaos-plugin-security',
    ];

    return plugins.map((name) => ({
      name,
      version: '1.0.0',
      status: 'active' as const,
      dependencies: [],
      lastActivity: new Date(),
    }));
  }

  /**
   * Analyze specific issue in context
   */
  private async analyzeIssue(
    request: DiagnosticRequest,
    infraStatus: InfrastructureStatus,
  ) {
    // This is where Fry's diagnostic intelligence would go
    // For now, simplified analysis based on common patterns

    const isWalletIssue = request.issue.toLowerCase().includes('wallet');
    const isConnectionIssue = request.issue.toLowerCase().includes('connect');
    const isTransactionIssue = request.issue
      .toLowerCase()
      .includes('transaction');

    let systemIssue = false;
    let userIssue = false;
    let rootCause = 'Unknown issue';
    let summary = 'Analyzing...';
    let preventionMeasures: string[] = [];

    if (isWalletIssue && isConnectionIssue) {
      // Wallet connection analysis
      const rpcHealthy = infraStatus.blockchain.solana.rpcHealth === 'healthy';
      const walletServicesUp =
        infraStatus.blockchain.walletServices.walletAdapterHealth;

      if (!rpcHealthy) {
        systemIssue = true;
        rootCause = 'Solana RPC connection degraded';
        summary = 'Backend RPC services are experiencing issues';
        preventionMeasures = ['Monitor RPC health', 'Implement RPC failover'];
      } else if (!walletServicesUp) {
        systemIssue = true;
        rootCause = 'Wallet adapter service down';
        summary = 'Wallet connection infrastructure needs restart';
        preventionMeasures = ['Regular wallet adapter health checks'];
      } else {
        userIssue = true;
        rootCause = 'User-side wallet configuration or browser issue';
        summary = 'Wallet connection issue appears to be client-side';
        preventionMeasures = ['Improve user wallet setup guidance'];
      }
    }

    return {
      systemIssue,
      userIssue,
      rootCause,
      summary,
      preventionMeasures,
    };
  }

  /**
   * Generate fix actions for diagnosed issues
   */
  private async generateFixActions(diagnosis: any, request: DiagnosticRequest) {
    const actions = [];

    if (diagnosis.systemIssue) {
      if (request.system.includes('rpc')) {
        actions.push({
          description: 'Switch to backup RPC endpoint',
          automated: true,
          estimatedTime: '30 seconds',
        });
      }

      if (request.system.includes('plugin')) {
        actions.push({
          description: 'Restart affected plugin services',
          automated: true,
          estimatedTime: '2 minutes',
        });
      }
    }

    return actions;
  }

  /**
   * Generate user-friendly troubleshooting steps
   */
  private async generateUserSteps(diagnosis: any, request: DiagnosticRequest) {
    if (request.issue.toLowerCase().includes('wallet')) {
      return [
        {
          number: 1,
          technicalDescription: 'Clear browser cache and wallet extension data',
          friendlyDescription: 'Clear your browser cache and refresh the page',
        },
        {
          number: 2,
          technicalDescription: 'Reconnect wallet extension to site',
          friendlyDescription: 'Disconnect and reconnect your wallet',
        },
        {
          number: 3,
          technicalDescription: 'Verify wallet network is set to Mainnet',
          friendlyDescription: 'Make sure your wallet is on the Solana mainnet',
        },
      ];
    }

    return [];
  }

  /**
   * Determine overall system health
   */
  private determineOverallHealth(
    services: ServiceStatus[],
    blockchain: BlockchainStatus,
    plugins: PluginStatus[],
  ): 'healthy' | 'degraded' | 'critical' {
    const criticalServices = services.filter(
      (s) => s.status === 'offline',
    ).length;
    const degradedServices = services.filter(
      (s) => s.status === 'degraded',
    ).length;

    const blockchainHealthy = blockchain.solana.rpcHealth === 'healthy';
    const pluginErrors = plugins.filter((p) => p.status === 'error').length;

    if (criticalServices > 1 || !blockchainHealthy || pluginErrors > 2) {
      return 'critical';
    } else if (
      criticalServices > 0 ||
      degradedServices > 2 ||
      pluginErrors > 0
    ) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  /**
   * Generate recommendations for system improvements
   */
  private generateRecommendations(
    services: ServiceStatus[],
    blockchain: BlockchainStatus,
    plugins: PluginStatus[],
  ): string[] {
    const recommendations = [];

    if (blockchain.solana.rpcHealth !== 'healthy') {
      recommendations.push('Consider implementing RPC endpoint failover');
    }

    const slowServices = services.filter(
      (s) => s.responseTime && s.responseTime > 2000,
    );
    if (slowServices.length > 0) {
      recommendations.push(
        `Optimize slow services: ${slowServices.map((s) => s.name).join(', ')}`,
      );
    }

    return recommendations;
  }

  /**
   * Auto-fix common infrastructure issues
   */
  private async autoFixIssues(status: InfrastructureStatus) {
    // Implement automated fixes for common issues
    // This would include restarting services, clearing caches, etc.

    if (status.overall === 'critical') {
      console.log('🔧 Fry attempting auto-fix for critical issues...');

      // Example auto-fixes would go here
    }
  }

  /**
   * Health check for Fry itself
   */
  async healthCheck() {
    return {
      status: 'operational',
      agent: 'Fry_Infrastructure',
      capabilities: [
        'infrastructure_monitoring',
        'blockchain_diagnostics',
        'plugin_health_management',
        'automated_issue_resolution',
        'technical_analysis_support',
      ],
      monitoring: this.isMonitoring,
      solanaConnection: await this.solanaConnection.getHealth(),
      uptime: process.uptime(),
    };
  }
}

export default FryInfrastructureAgent;
