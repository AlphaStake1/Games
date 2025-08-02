/**
 * Bot Monitoring System - Real-time metrics and policy enforcement tracking
 */

export interface BotMetrics {
  timestamp: Date;
  totalInteractions: number;
  botDetections: number;
  falsePositives: number;
  verificationRequests: number;
  verificationSuccesses: number;
  purchaseBlocks: number;
  escalations: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface PolicyEffectivenessMetrics {
  detectionRate: number; // % of actual bots detected
  falsePositiveRate: number; // % of humans flagged as bots
  verificationCompletionRate: number; // % who complete verification
  appealSuccessRate: number; // % of appeals that are successful
  userSatisfactionScore: number; // Post-interaction survey scores
  automationRate: number; // % of decisions made automatically
}

export interface BotTrend {
  timeframe: string;
  botAttempts: number;
  successfulBlocks: number;
  newPatterns: string[];
  adaptationNeeded: boolean;
}

export class BotMonitoringSystem {
  private metrics: Map<string, BotMetrics> = new Map(); // Key: YYYY-MM-DD-HH
  private detectionHistory: Map<string, any[]> = new Map(); // Key: userId
  private policyViolations: any[] = [];
  private adaptiveThresholds: Map<string, number> = new Map();

  /**
   * Record bot detection event for monitoring
   */
  async recordBotDetection(event: {
    userId: string;
    agentId: string;
    confidence: number;
    riskLevel: string;
    indicators: string[];
    action: string;
    timestamp: Date;
  }): Promise<void> {
    // Update hourly metrics
    const hourKey = this.getHourKey(event.timestamp);
    const metrics = this.getOrCreateMetrics(hourKey);

    metrics.totalInteractions++;

    if (event.confidence >= 0.5) {
      metrics.botDetections++;
    }

    if (event.action === 'quarantine' || event.action === 'restrict') {
      metrics.purchaseBlocks++;
    }

    // Track escalation levels
    if (event.riskLevel === 'LOW') metrics.escalations.low++;
    else if (event.riskLevel === 'MODERATE') metrics.escalations.medium++;
    else if (event.riskLevel === 'HIGH') metrics.escalations.high++;
    else if (event.riskLevel === 'CONFIRMED') metrics.escalations.critical++;

    // Store individual detection for analysis
    const userHistory = this.getUserDetectionHistory(event.userId);
    userHistory.push(event);

    // Analyze for adaptive thresholds
    await this.analyzeForAdaptation(event);
  }

  /**
   * Record verification attempt
   */
  async recordVerificationAttempt(event: {
    userId: string;
    type: 'captcha' | 'behavioral' | 'human' | 'video';
    success: boolean;
    timestamp: Date;
  }): Promise<void> {
    const hourKey = this.getHourKey(event.timestamp);
    const metrics = this.getOrCreateMetrics(hourKey);

    metrics.verificationRequests++;

    if (event.success) {
      metrics.verificationSuccesses++;
    }
  }

  /**
   * Record false positive (human flagged as bot)
   */
  async recordFalsePositive(event: {
    userId: string;
    originalConfidence: number;
    verificationEvidence: string;
    timestamp: Date;
  }): Promise<void> {
    const hourKey = this.getHourKey(event.timestamp);
    const metrics = this.getOrCreateMetrics(hourKey);

    metrics.falsePositives++;

    // Trigger threshold adaptation for high false positive rates
    if (metrics.falsePositives / metrics.totalInteractions > 0.05) {
      // 5% threshold
      await this.triggerThresholdReview('high_false_positive_rate');
    }
  }

  /**
   * Generate real-time effectiveness metrics
   */
  async getEffectivenessMetrics(
    timeframe: 'hour' | 'day' | 'week' = 'day',
  ): Promise<PolicyEffectivenessMetrics> {
    const metrics = this.aggregateMetrics(timeframe);

    return {
      detectionRate: this.calculateDetectionRate(metrics),
      falsePositiveRate: this.calculateFalsePositiveRate(metrics),
      verificationCompletionRate:
        this.calculateVerificationCompletionRate(metrics),
      appealSuccessRate: await this.calculateAppealSuccessRate(timeframe),
      userSatisfactionScore: await this.getUserSatisfactionScore(timeframe),
      automationRate: this.calculateAutomationRate(metrics),
    };
  }

  /**
   * Detect emerging bot patterns and trends
   */
  async detectEmergingPatterns(): Promise<BotTrend[]> {
    const trends: BotTrend[] = [];

    // Analyze last 24 hours vs previous 24 hours
    const recent = this.aggregateMetrics('day');
    const previous = this.aggregateMetrics('day', 1); // 1 day offset

    // Look for significant increases in bot attempts
    const botAttemptIncrease =
      (recent.botDetections - previous.botDetections) /
      Math.max(previous.botDetections, 1);

    if (botAttemptIncrease > 0.5) {
      // 50% increase
      trends.push({
        timeframe: 'last 24h',
        botAttempts: recent.botDetections,
        successfulBlocks: recent.purchaseBlocks,
        newPatterns: await this.identifyNewPatterns(),
        adaptationNeeded: botAttemptIncrease > 1.0, // 100% increase needs immediate attention
      });
    }

    return trends;
  }

  /**
   * Adaptive threshold management
   */
  async optimizeThresholds(): Promise<Map<string, number>> {
    const effectiveness = await this.getEffectivenessMetrics();
    const newThresholds = new Map(this.adaptiveThresholds);

    // If false positive rate is too high, increase thresholds
    if (effectiveness.falsePositiveRate > 0.03) {
      // 3% threshold
      newThresholds.set(
        'bot_confidence_threshold',
        Math.min(
          0.8,
          (newThresholds.get('bot_confidence_threshold') || 0.5) + 0.1,
        ),
      );
    }

    // If detection rate is too low, decrease thresholds
    if (effectiveness.detectionRate < 0.9) {
      // 90% threshold
      newThresholds.set(
        'bot_confidence_threshold',
        Math.max(
          0.3,
          (newThresholds.get('bot_confidence_threshold') || 0.5) - 0.05,
        ),
      );
    }

    // Update verification requirements based on completion rates
    if (effectiveness.verificationCompletionRate < 0.8) {
      // 80% threshold
      newThresholds.set(
        'verification_threshold',
        Math.min(
          0.8,
          (newThresholds.get('verification_threshold') || 0.3) + 0.1,
        ),
      );
    }

    this.adaptiveThresholds = newThresholds;
    return newThresholds;
  }

  /**
   * Generate security dashboard data
   */
  async generateDashboardData(): Promise<{
    realTimeMetrics: BotMetrics;
    effectiveness: PolicyEffectivenessMetrics;
    trends: BotTrend[];
    alerts: string[];
    recommendations: string[];
  }> {
    const currentHour = this.getHourKey(new Date());
    const realTimeMetrics = this.getOrCreateMetrics(currentHour);
    const effectiveness = await this.getEffectivenessMetrics();
    const trends = await this.detectEmergingPatterns();

    // Generate alerts
    const alerts: string[] = [];
    if (effectiveness.falsePositiveRate > 0.05) {
      alerts.push('⚠️ High false positive rate detected');
    }
    if (effectiveness.detectionRate < 0.85) {
      alerts.push('🚨 Bot detection rate below target');
    }
    if (trends.some((t) => t.adaptationNeeded)) {
      alerts.push('📈 Significant increase in bot attempts detected');
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (effectiveness.verificationCompletionRate < 0.8) {
      recommendations.push(
        'Simplify verification process to improve completion rates',
      );
    }
    if (effectiveness.automationRate < 0.85) {
      recommendations.push(
        'Increase automation to reduce manual review burden',
      );
    }
    if (trends.length > 0) {
      recommendations.push('Review and update bot detection patterns');
    }

    return {
      realTimeMetrics,
      effectiveness,
      trends,
      alerts,
      recommendations,
    };
  }

  /**
   * Policy review trigger system
   */
  async checkPolicyReviewTriggers(): Promise<{
    triggersActivated: string[];
    reviewType: 'emergency' | 'threshold' | 'scheduled' | 'none';
    timeline: string;
  }> {
    const effectiveness = await this.getEffectivenessMetrics();
    const triggers: string[] = [];
    let reviewType: 'emergency' | 'threshold' | 'scheduled' | 'none' = 'none';
    let timeline = '';

    // Emergency triggers (72 hours)
    if (effectiveness.falsePositiveRate > 0.1) {
      // 10% false positive rate
      triggers.push('Critical false positive rate');
      reviewType = 'emergency';
      timeline = '72 hours';
    }

    if (effectiveness.detectionRate < 0.5) {
      // 50% detection rate
      triggers.push('Critical detection failure');
      reviewType = 'emergency';
      timeline = '72 hours';
    }

    // Threshold triggers (14 days)
    if (reviewType === 'none' && effectiveness.falsePositiveRate > 0.05) {
      triggers.push('High false positive rate');
      reviewType = 'threshold';
      timeline = '14 days';
    }

    if (reviewType === 'none' && effectiveness.detectionRate < 0.85) {
      triggers.push('Low detection rate');
      reviewType = 'threshold';
      timeline = '14 days';
    }

    if (
      reviewType === 'none' &&
      effectiveness.verificationCompletionRate < 0.6
    ) {
      triggers.push('Low verification completion');
      reviewType = 'threshold';
      timeline = '14 days';
    }

    return {
      triggersActivated: triggers,
      reviewType,
      timeline,
    };
  }

  /**
   * Helper methods
   */
  private getHourKey(date: Date): string {
    return date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
  }

  private getOrCreateMetrics(hourKey: string): BotMetrics {
    if (!this.metrics.has(hourKey)) {
      this.metrics.set(hourKey, {
        timestamp: new Date(hourKey),
        totalInteractions: 0,
        botDetections: 0,
        falsePositives: 0,
        verificationRequests: 0,
        verificationSuccesses: 0,
        purchaseBlocks: 0,
        escalations: { low: 0, medium: 0, high: 0, critical: 0 },
      });
    }
    return this.metrics.get(hourKey)!;
  }

  private getUserDetectionHistory(userId: string): any[] {
    if (!this.detectionHistory.has(userId)) {
      this.detectionHistory.set(userId, []);
    }
    return this.detectionHistory.get(userId)!;
  }

  private aggregateMetrics(
    timeframe: 'hour' | 'day' | 'week',
    offset: number = 0,
  ): BotMetrics {
    const now = new Date();
    const startTime = new Date(now);

    if (timeframe === 'hour') {
      startTime.setHours(startTime.getHours() - 1 - offset);
    } else if (timeframe === 'day') {
      startTime.setDate(startTime.getDate() - 1 - offset);
    } else if (timeframe === 'week') {
      startTime.setDate(startTime.getDate() - 7 - offset);
    }

    const aggregated: BotMetrics = {
      timestamp: now,
      totalInteractions: 0,
      botDetections: 0,
      falsePositives: 0,
      verificationRequests: 0,
      verificationSuccesses: 0,
      purchaseBlocks: 0,
      escalations: { low: 0, medium: 0, high: 0, critical: 0 },
    };

    for (const [hourKey, metrics] of this.metrics) {
      const hourDate = new Date(hourKey);
      if (hourDate >= startTime && hourDate <= now) {
        aggregated.totalInteractions += metrics.totalInteractions;
        aggregated.botDetections += metrics.botDetections;
        aggregated.falsePositives += metrics.falsePositives;
        aggregated.verificationRequests += metrics.verificationRequests;
        aggregated.verificationSuccesses += metrics.verificationSuccesses;
        aggregated.purchaseBlocks += metrics.purchaseBlocks;
        aggregated.escalations.low += metrics.escalations.low;
        aggregated.escalations.medium += metrics.escalations.medium;
        aggregated.escalations.high += metrics.escalations.high;
        aggregated.escalations.critical += metrics.escalations.critical;
      }
    }

    return aggregated;
  }

  private calculateDetectionRate(metrics: BotMetrics): number {
    // This would be calculated against known ground truth data
    // For now, estimate based on successful blocks vs total bots
    return metrics.totalInteractions > 0
      ? Math.min(
          1.0,
          metrics.botDetections / Math.max(metrics.totalInteractions * 0.1, 1),
        )
      : 0;
  }

  private calculateFalsePositiveRate(metrics: BotMetrics): number {
    return metrics.totalInteractions > 0
      ? metrics.falsePositives / metrics.totalInteractions
      : 0;
  }

  private calculateVerificationCompletionRate(metrics: BotMetrics): number {
    return metrics.verificationRequests > 0
      ? metrics.verificationSuccesses / metrics.verificationRequests
      : 0;
  }

  private async calculateAppealSuccessRate(timeframe: string): Promise<number> {
    // This would query the appeals system
    return 0.85; // Placeholder - 85% of appeals successful
  }

  private async getUserSatisfactionScore(timeframe: string): Promise<number> {
    // This would integrate with user feedback systems
    return 4.2; // Placeholder - 4.2/5.0 satisfaction score
  }

  private calculateAutomationRate(metrics: BotMetrics): number {
    const totalDecisions = metrics.botDetections + metrics.verificationRequests;
    const automatedDecisions = metrics.botDetections; // Assuming bot detections are automated
    return totalDecisions > 0 ? automatedDecisions / totalDecisions : 0;
  }

  private async identifyNewPatterns(): Promise<string[]> {
    // This would use ML to identify new attack patterns
    return ['Fast response timing variation', 'New user-agent patterns'];
  }

  private async analyzeForAdaptation(event: any): Promise<void> {
    // Implement adaptive learning logic here
    // This would update detection patterns based on feedback
  }

  private async triggerThresholdReview(reason: string): Promise<void> {
    console.log(`[THRESHOLD REVIEW TRIGGERED] Reason: ${reason}`);
    // This would notify the security team for threshold review
  }
}

/**
 * Factory function to create bot monitoring system
 */
export function createBotMonitoringSystem(): BotMonitoringSystem {
  return new BotMonitoringSystem();
}
