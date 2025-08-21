/**
 * Shared Context Service
 * Provides real-time contextual information to all agents
 * Prevents redundant checks and ensures consistent decision-making
 */

import { Connection, PublicKey } from '@solana/web3.js';

export interface SystemContext {
  financial: FinancialContext;
  network: NetworkContext;
  game: GameContext;
  security: SecurityContext;
  operational: OperationalContext;
}

export interface FinancialContext {
  treasuryBalance: number;
  pendingPayouts: number;
  availableBalance: number;
  minimumReserve: number;
  projectedBalance24h: number;
  canCreateBoard: boolean;
  canProcessPayout: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface NetworkContext {
  solanaTPS: number;
  currentSlot: number;
  averageFee: number;
  networkCongestion: 'LOW' | 'MEDIUM' | 'HIGH';
  vrfQueueDepth: number;
  vrfEstimatedWait: number;
  optimalActionTime: Date | null;
  switchboardStatus: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
}

export interface GameContext {
  activeGames: GameInfo[];
  upcomingGames: GameInfo[];
  activeBoards: number;
  totalSquaresSold: number;
  fillRate: number;
  peakHours: boolean;
  currentQuarter: string | null;
  highStakesActive: boolean;
}

export interface SecurityContext {
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeThreats: ThreatInfo[];
  suspiciousWallets: Set<string>;
  recentAttacks: AttackInfo[];
  blacklistedWallets: Set<string>;
  whitelistedWallets: Set<string>;
  anomalyDetected: boolean;
}

export interface OperationalContext {
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  agentStatuses: Map<string, AgentStatus>;
  activeIncidents: IncidentInfo[];
  performanceMetrics: PerformanceMetrics;
  maintenanceWindow: boolean;
  deploymentInProgress: boolean;
}

// Supporting interfaces
interface GameInfo {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  currentScore?: { home: number; away: number };
  quarter?: string;
  boardValue: number;
  fillRate: number;
}

interface ThreatInfo {
  type: 'DDOS' | 'SYBIL' | 'WASH_TRADE' | 'EXPLOIT' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  timestamp: Date;
  affectedComponents: string[];
}

interface AttackInfo {
  timestamp: Date;
  type: string;
  source: string;
  prevented: boolean;
  impact: string;
}

interface AgentStatus {
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  lastSeen: Date;
  taskQueue: number;
  errorRate: number;
}

interface IncidentInfo {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  startTime: Date;
  affectedServices: string[];
  status: 'ACTIVE' | 'MITIGATED' | 'RESOLVED';
}

interface PerformanceMetrics {
  avgResponseTime: number;
  errorRate: number;
  successRate: number;
  tps: number;
  cpuUsage: number;
  memoryUsage: number;
}

/**
 * Shared Context Service - Singleton
 * All agents query this service for context before making decisions
 */
export class SharedContextService {
  private static instance: SharedContextService;
  private connection: Connection;
  private context: SystemContext;
  private updateInterval: NodeJS.Timer | null = null;
  private subscribers: Set<ContextSubscriber> = new Set();

  private constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    );
    this.context = this.initializeContext();
  }

  public static getInstance(): SharedContextService {
    if (!SharedContextService.instance) {
      SharedContextService.instance = new SharedContextService();
    }
    return SharedContextService.instance;
  }

  /**
   * Start automatic context updates
   */
  public startContextUpdates(intervalMs: number = 5000): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      await this.updateContext();
      this.notifySubscribers();
    }, intervalMs);

    // Initial update
    this.updateContext();
  }

  /**
   * Get current context snapshot
   */
  public getContext(): SystemContext {
    return { ...this.context };
  }

  /**
   * Get specific context domain
   */
  public getFinancialContext(): FinancialContext {
    return { ...this.context.financial };
  }

  public getNetworkContext(): NetworkContext {
    return { ...this.context.network };
  }

  public getGameContext(): GameContext {
    return { ...this.context.game };
  }

  public getSecurityContext(): SecurityContext {
    return { ...this.context.security };
  }

  /**
   * Subscribe to context updates
   */
  public subscribe(subscriber: ContextSubscriber): void {
    this.subscribers.add(subscriber);
  }

  /**
   * Make intelligent decision based on context
   */
  public async makeContextualDecision(
    action: string,
    params: any,
  ): Promise<DecisionResult> {
    const context = this.getContext();

    switch (action) {
      case 'CREATE_BOARD':
        return this.evaluateBoardCreation(params, context);

      case 'PROCESS_PAYOUT':
        return this.evaluatePayoutProcessing(params, context);

      case 'REQUEST_VRF':
        return this.evaluateVRFRequest(params, context);

      case 'DEPLOY_CODE':
        return this.evaluateDeployment(params, context);

      default:
        return {
          approved: true,
          reason: 'No context rules for this action',
          recommendations: [],
        };
    }
  }

  /**
   * Update all context domains
   */
  private async updateContext(): Promise<void> {
    // Update each context domain in parallel
    const [financial, network, game, security, operational] = await Promise.all(
      [
        this.updateFinancialContext(),
        this.updateNetworkContext(),
        this.updateGameContext(),
        this.updateSecurityContext(),
        this.updateOperationalContext(),
      ],
    );

    this.context = {
      financial,
      network,
      game,
      security,
      operational,
    };
  }

  private async updateFinancialContext(): Promise<FinancialContext> {
    // Fetch treasury balance
    const treasuryBalance = await this.getTreasuryBalance();
    const pendingPayouts = await this.getPendingPayouts();
    const minimumReserve = treasuryBalance * 0.2; // 20% reserve
    const availableBalance = treasuryBalance - pendingPayouts - minimumReserve;

    return {
      treasuryBalance,
      pendingPayouts,
      availableBalance,
      minimumReserve,
      projectedBalance24h: treasuryBalance - pendingPayouts * 1.2, // 20% buffer
      canCreateBoard: availableBalance > 100, // 100 SOL minimum for new board
      canProcessPayout: availableBalance > 0,
      riskLevel: this.calculateFinancialRisk(availableBalance, treasuryBalance),
    };
  }

  private async updateNetworkContext(): Promise<NetworkContext> {
    const slot = await this.connection.getSlot();
    const tps = await this.estimateTPS();
    const fees = await this.connection.getRecentPrioritizationFees();
    const avgFee =
      fees.length > 0
        ? fees.reduce((a, b) => a + b.prioritizationFee, 0) / fees.length
        : 5000;

    return {
      solanaTPS: tps,
      currentSlot: slot,
      averageFee: avgFee,
      networkCongestion: this.calculateCongestion(tps, avgFee),
      vrfQueueDepth: await this.getVRFQueueDepth(),
      vrfEstimatedWait: await this.estimateVRFWait(),
      optimalActionTime: this.calculateOptimalTime(tps, avgFee),
      switchboardStatus: await this.checkSwitchboardStatus(),
    };
  }

  private async updateGameContext(): Promise<GameContext> {
    // This would fetch from your game database
    const activeGames = await this.getActiveGames();
    const upcomingGames = await this.getUpcomingGames();
    const boards = await this.getActiveBoards();

    return {
      activeGames,
      upcomingGames,
      activeBoards: boards.length,
      totalSquaresSold: boards.reduce((sum, b) => sum + b.soldSquares, 0),
      fillRate: this.calculateFillRate(boards),
      peakHours: this.isPeakHours(),
      currentQuarter: this.getCurrentQuarter(activeGames),
      highStakesActive: boards.some((b) => b.totalValue > 1000), // 1000 SOL
    };
  }

  private async updateSecurityContext(): Promise<SecurityContext> {
    const threats = await this.detectThreats();
    const suspicious = await this.getSuspiciousWallets();

    return {
      threatLevel: this.calculateThreatLevel(threats),
      activeThreats: threats,
      suspiciousWallets: new Set(suspicious),
      recentAttacks: await this.getRecentAttacks(),
      blacklistedWallets: new Set(await this.getBlacklistedWallets()),
      whitelistedWallets: new Set(await this.getWhitelistedWallets()),
      anomalyDetected: threats.length > 0,
    };
  }

  private async updateOperationalContext(): Promise<OperationalContext> {
    const agentStatuses = await this.getAgentStatuses();
    const incidents = await this.getActiveIncidents();
    const metrics = await this.getPerformanceMetrics();

    return {
      systemHealth: this.calculateSystemHealth(metrics, incidents),
      agentStatuses,
      activeIncidents: incidents,
      performanceMetrics: metrics,
      maintenanceWindow: this.isMaintenanceWindow(),
      deploymentInProgress: await this.isDeploymentActive(),
    };
  }

  /**
   * Context-aware decision evaluators
   */
  private evaluateBoardCreation(
    params: any,
    context: SystemContext,
  ): DecisionResult {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let approved = true;

    // Check treasury
    if (!context.financial.canCreateBoard) {
      approved = false;
      reasons.push('Insufficient treasury balance for new board');
      recommendations.push('Wait for pending payouts to complete');
    }

    // Check network congestion
    if (context.network.networkCongestion === 'HIGH') {
      recommendations.push('Consider waiting 30 minutes for lower fees');
    }

    // Check game timing
    const gameStart = new Date(params.gameStartTime);
    const hoursUntilGame =
      (gameStart.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilGame < 2) {
      approved = false;
      reasons.push('Too close to game start time');
    }

    // Check security
    if (
      context.security.threatLevel === 'HIGH' ||
      context.security.threatLevel === 'CRITICAL'
    ) {
      approved = false;
      reasons.push('Security threat detected - board creation suspended');
    }

    return {
      approved,
      reason: reasons.join('; ') || 'Board creation approved',
      recommendations,
      contextUsed: {
        treasuryBalance: context.financial.treasuryBalance,
        networkCongestion: context.network.networkCongestion,
        threatLevel: context.security.threatLevel,
      },
    };
  }

  private evaluatePayoutProcessing(
    params: any,
    context: SystemContext,
  ): DecisionResult {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let approved = true;

    // Check if wallet is suspicious
    if (context.security.suspiciousWallets.has(params.wallet)) {
      approved = false;
      reasons.push('Wallet flagged as suspicious');
      recommendations.push('Manual review required');
    }

    // Check treasury
    if (!context.financial.canProcessPayout) {
      approved = false;
      reasons.push('Insufficient available balance');
    }

    // Check network for batching opportunity
    if (context.network.networkCongestion === 'HIGH' && params.amount < 10) {
      recommendations.push('Batch with other payouts to save fees');
    }

    return {
      approved,
      reason: reasons.join('; ') || 'Payout approved',
      recommendations,
      contextUsed: {
        availableBalance: context.financial.availableBalance,
        walletStatus: context.security.suspiciousWallets.has(params.wallet)
          ? 'SUSPICIOUS'
          : 'CLEAR',
      },
    };
  }

  private evaluateVRFRequest(
    params: any,
    context: SystemContext,
  ): DecisionResult {
    const recommendations: string[] = [];
    let delayRecommended = false;

    // Check Switchboard status
    if (context.network.switchboardStatus !== 'OPERATIONAL') {
      return {
        approved: false,
        reason: 'Switchboard service not operational',
        recommendations: ['Use backup randomness provider'],
      };
    }

    // Check network congestion
    if (context.network.networkCongestion === 'HIGH' && !params.urgent) {
      delayRecommended = true;
      recommendations.push(
        `Wait ${context.network.optimalActionTime} for lower fees`,
      );
    }

    // Check VRF queue
    if (context.network.vrfQueueDepth > 100) {
      recommendations.push('Consider using alternative VRF provider');
    }

    return {
      approved: true,
      reason: delayRecommended
        ? 'Approved but delay recommended'
        : 'VRF request approved',
      recommendations,
      contextUsed: {
        vrfQueue: context.network.vrfQueueDepth,
        congestion: context.network.networkCongestion,
      },
    };
  }

  private evaluateDeployment(
    params: any,
    context: SystemContext,
  ): DecisionResult {
    const reasons: string[] = [];
    let approved = true;

    // Check for active games
    if (context.game.activeGames.length > 0 && !params.emergency) {
      approved = false;
      reasons.push(`${context.game.activeGames.length} games in progress`);
    }

    // Check system health
    if (context.operational.systemHealth === 'CRITICAL') {
      approved = false;
      reasons.push('System health critical - stabilize first');
    }

    // Check for active incidents
    if (
      context.operational.activeIncidents.some((i) => i.severity === 'CRITICAL')
    ) {
      approved = false;
      reasons.push('Critical incident in progress');
    }

    return {
      approved,
      reason: reasons.join('; ') || 'Deployment approved',
      recommendations: approved
        ? ['Monitor closely after deployment']
        : ['Wait for games to complete'],
      contextUsed: {
        activeGames: context.game.activeGames.length,
        systemHealth: context.operational.systemHealth,
      },
    };
  }

  // Helper methods (would implement actual logic)
  private async getTreasuryBalance(): Promise<number> {
    // Implement actual treasury balance fetch
    return 500; // Mock: 500 SOL
  }

  private async getPendingPayouts(): Promise<number> {
    // Implement actual pending payouts calculation
    return 50; // Mock: 50 SOL pending
  }

  private calculateFinancialRisk(
    available: number,
    total: number,
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const ratio = available / total;
    if (ratio > 0.5) return 'LOW';
    if (ratio > 0.3) return 'MEDIUM';
    if (ratio > 0.1) return 'HIGH';
    return 'CRITICAL';
  }

  private async estimateTPS(): Promise<number> {
    // Implement actual TPS estimation
    return 2500; // Mock TPS
  }

  private calculateCongestion(
    tps: number,
    fee: number,
  ): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (tps > 3000 && fee < 10000) return 'LOW';
    if (tps > 2000 && fee < 50000) return 'MEDIUM';
    return 'HIGH';
  }

  private calculateOptimalTime(tps: number, fee: number): Date | null {
    if (tps > 3000 && fee < 10000) return null; // Now is optimal
    // Calculate based on historical patterns
    const optimalHour = new Date();
    optimalHour.setHours(optimalHour.getHours() + 2); // Mock: 2 hours from now
    return optimalHour;
  }

  private async getVRFQueueDepth(): Promise<number> {
    // Implement actual VRF queue check
    return 5; // Mock: 5 requests in queue
  }

  private async estimateVRFWait(): Promise<number> {
    // Implement actual wait time estimation
    return 30; // Mock: 30 seconds
  }

  private async checkSwitchboardStatus(): Promise<
    'OPERATIONAL' | 'DEGRADED' | 'DOWN'
  > {
    // Implement actual Switchboard health check
    return 'OPERATIONAL';
  }

  private async getActiveGames(): Promise<GameInfo[]> {
    // Implement actual active games fetch
    return []; // Mock: no active games
  }

  private async getUpcomingGames(): Promise<GameInfo[]> {
    // Implement actual upcoming games fetch
    return [];
  }

  private async getActiveBoards(): Promise<any[]> {
    // Implement actual boards fetch
    return [];
  }

  private calculateFillRate(boards: any[]): number {
    if (boards.length === 0) return 0;
    const totalFilled = boards.reduce((sum, b) => sum + b.soldSquares, 0);
    const totalSquares = boards.length * 100; // 100 squares per board
    return (totalFilled / totalSquares) * 100;
  }

  private isPeakHours(): boolean {
    const hour = new Date().getHours();
    return (hour >= 18 && hour <= 23) || (hour >= 12 && hour <= 14); // Evening and lunch
  }

  private getCurrentQuarter(games: GameInfo[]): string | null {
    const activeGame = games.find((g) => g.currentScore !== undefined);
    return activeGame?.quarter || null;
  }

  private async detectThreats(): Promise<ThreatInfo[]> {
    // Implement actual threat detection
    return [];
  }

  private calculateThreatLevel(
    threats: ThreatInfo[],
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (threats.length === 0) return 'LOW';
    const hasCritical = threats.some((t) => t.severity === 'CRITICAL');
    if (hasCritical) return 'CRITICAL';
    const hasHigh = threats.some((t) => t.severity === 'HIGH');
    if (hasHigh) return 'HIGH';
    return 'MEDIUM';
  }

  private async getSuspiciousWallets(): Promise<string[]> {
    // Implement actual suspicious wallet detection
    return [];
  }

  private async getRecentAttacks(): Promise<AttackInfo[]> {
    // Implement actual attack history fetch
    return [];
  }

  private async getBlacklistedWallets(): Promise<string[]> {
    // Implement actual blacklist fetch
    return [];
  }

  private async getWhitelistedWallets(): Promise<string[]> {
    // Implement actual whitelist fetch
    return [];
  }

  private async getAgentStatuses(): Promise<Map<string, AgentStatus>> {
    // Implement actual agent status checks
    return new Map();
  }

  private async getActiveIncidents(): Promise<IncidentInfo[]> {
    // Implement actual incident fetch
    return [];
  }

  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // Implement actual metrics collection
    return {
      avgResponseTime: 100,
      errorRate: 0.01,
      successRate: 0.99,
      tps: 50,
      cpuUsage: 45,
      memoryUsage: 60,
    };
  }

  private calculateSystemHealth(
    metrics: PerformanceMetrics,
    incidents: IncidentInfo[],
  ): 'HEALTHY' | 'DEGRADED' | 'CRITICAL' {
    if (incidents.some((i) => i.severity === 'CRITICAL')) return 'CRITICAL';
    if (metrics.errorRate > 0.05) return 'DEGRADED';
    if (metrics.cpuUsage > 80 || metrics.memoryUsage > 80) return 'DEGRADED';
    return 'HEALTHY';
  }

  private isMaintenanceWindow(): boolean {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    // Tuesday 2-4 AM
    return day === 2 && hour >= 2 && hour < 4;
  }

  private async isDeploymentActive(): Promise<boolean> {
    // Check if deployment is in progress
    return false;
  }

  private initializeContext(): SystemContext {
    return {
      financial: {
        treasuryBalance: 0,
        pendingPayouts: 0,
        availableBalance: 0,
        minimumReserve: 0,
        projectedBalance24h: 0,
        canCreateBoard: false,
        canProcessPayout: false,
        riskLevel: 'LOW',
      },
      network: {
        solanaTPS: 0,
        currentSlot: 0,
        averageFee: 0,
        networkCongestion: 'LOW',
        vrfQueueDepth: 0,
        vrfEstimatedWait: 0,
        optimalActionTime: null,
        switchboardStatus: 'OPERATIONAL',
      },
      game: {
        activeGames: [],
        upcomingGames: [],
        activeBoards: 0,
        totalSquaresSold: 0,
        fillRate: 0,
        peakHours: false,
        currentQuarter: null,
        highStakesActive: false,
      },
      security: {
        threatLevel: 'LOW',
        activeThreats: [],
        suspiciousWallets: new Set(),
        recentAttacks: [],
        blacklistedWallets: new Set(),
        whitelistedWallets: new Set(),
        anomalyDetected: false,
      },
      operational: {
        systemHealth: 'HEALTHY',
        agentStatuses: new Map(),
        activeIncidents: [],
        performanceMetrics: {
          avgResponseTime: 0,
          errorRate: 0,
          successRate: 0,
          tps: 0,
          cpuUsage: 0,
          memoryUsage: 0,
        },
        maintenanceWindow: false,
        deploymentInProgress: false,
      },
    };
  }

  private notifySubscribers(): void {
    const context = this.getContext();
    this.subscribers.forEach((subscriber) => {
      subscriber.onContextUpdate(context);
    });
  }
}

// Interfaces for external use
export interface ContextSubscriber {
  onContextUpdate(context: SystemContext): void;
}

export interface DecisionResult {
  approved: boolean;
  reason: string;
  recommendations: string[];
  contextUsed?: any;
}

// Export singleton instance getter
export const getSharedContext = () => SharedContextService.getInstance();
