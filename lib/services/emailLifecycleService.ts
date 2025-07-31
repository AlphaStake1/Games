/**
 * Email Lifecycle Management Service for Tuta Free Plan (1GB)
 * Implements intelligent email deletion strategy to stay within storage limits
 */

export interface EmailRetentionPolicy {
  category: string;
  retentionDays: number;
  priority: 'high' | 'medium' | 'low';
  archiveBeforeDelete: boolean;
  description: string;
}

export interface EmailStorageStats {
  totalEmails: number;
  estimatedStorageUsed: number; // in MB
  storageLimit: number; // 1024 MB for free plan
  utilizationPercent: number;
  oldestEmail: Date;
  recommendedCleanup: boolean;
}

export interface EmailCleanupResult {
  deletedCount: number;
  archivedCount: number;
  storageFreed: number; // in MB
  categories: Record<string, number>;
  errors: string[];
}

export class EmailLifecycleService {
  private readonly STORAGE_LIMIT_MB = 1024; // 1GB free plan
  private readonly WARNING_THRESHOLD = 0.85; // 85% full
  private readonly CRITICAL_THRESHOLD = 0.95; // 95% full
  private readonly AVERAGE_EMAIL_SIZE_MB = 0.025; // ~25KB average

  private retentionPolicies: EmailRetentionPolicy[] = [
    // High Priority - Keep Longer
    {
      category: 'transfer_confirmations',
      retentionDays: 90,
      priority: 'high',
      archiveBeforeDelete: true,
      description: 'Community transfer confirmations - legal/audit trail',
    },
    {
      category: 'cbl_applications',
      retentionDays: 60,
      priority: 'high',
      archiveBeforeDelete: true,
      description: 'CBL application submissions and approvals',
    },
    {
      category: 'dispute_resolutions',
      retentionDays: 120,
      priority: 'high',
      archiveBeforeDelete: true,
      description: 'Player disputes and resolution communications',
    },

    // Medium Priority - Standard Retention
    {
      category: 'player_notifications',
      retentionDays: 30,
      priority: 'medium',
      archiveBeforeDelete: false,
      description: 'General player notifications and updates',
    },
    {
      category: 'cbl_communications',
      retentionDays: 45,
      priority: 'medium',
      archiveBeforeDelete: true,
      description: 'CBL milestone notifications and rewards',
    },
    {
      category: 'system_alerts',
      retentionDays: 21,
      priority: 'medium',
      archiveBeforeDelete: false,
      description: 'System status and operational alerts',
    },

    // Low Priority - Delete Quickly
    {
      category: 'promotional',
      retentionDays: 14,
      priority: 'low',
      archiveBeforeDelete: false,
      description: 'Marketing emails and promotions',
    },
    {
      category: 'automated_reports',
      retentionDays: 7,
      priority: 'low',
      archiveBeforeDelete: false,
      description: 'Daily/weekly automated reports',
    },
    {
      category: 'spam_filtered',
      retentionDays: 3,
      priority: 'low',
      archiveBeforeDelete: false,
      description: 'Spam and filtered messages',
    },
    {
      category: 'bounce_notifications',
      retentionDays: 7,
      priority: 'low',
      archiveBeforeDelete: false,
      description: 'Email bounce and delivery failure notifications',
    },
  ];

  constructor(
    private tutaEmailService: any, // Your Tuta email service
    private archiveService: any, // Archive to external storage (optional)
    private database: any, // Database for tracking
  ) {}

  /**
   * Get current email storage statistics
   */
  async getStorageStats(): Promise<EmailStorageStats> {
    try {
      const emailCount = await this.tutaEmailService.getEmailCount();
      const estimatedStorage = emailCount * this.AVERAGE_EMAIL_SIZE_MB;
      const utilizationPercent =
        (estimatedStorage / this.STORAGE_LIMIT_MB) * 100;
      const oldestEmail = await this.tutaEmailService.getOldestEmailDate();

      return {
        totalEmails: emailCount,
        estimatedStorageUsed: Math.round(estimatedStorage * 100) / 100,
        storageLimit: this.STORAGE_LIMIT_MB,
        utilizationPercent: Math.round(utilizationPercent * 100) / 100,
        oldestEmail,
        recommendedCleanup: utilizationPercent > this.WARNING_THRESHOLD * 100,
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw error;
    }
  }

  /**
   * Perform automated email cleanup based on retention policies
   */
  async performCleanup(
    forceCleanup: boolean = false,
  ): Promise<EmailCleanupResult> {
    const result: EmailCleanupResult = {
      deletedCount: 0,
      archivedCount: 0,
      storageFreed: 0,
      categories: {},
      errors: [],
    };

    try {
      const stats = await this.getStorageStats();

      // Only cleanup if over warning threshold or forced
      if (
        !forceCleanup &&
        stats.utilizationPercent < this.WARNING_THRESHOLD * 100
      ) {
        console.log('Storage usage below threshold, skipping cleanup');
        return result;
      }

      console.log(
        `Starting email cleanup - Storage: ${stats.utilizationPercent}% full`,
      );

      // Process each retention policy
      for (const policy of this.retentionPolicies) {
        try {
          const categoryResult = await this.cleanupCategory(
            policy,
            stats.utilizationPercent > this.CRITICAL_THRESHOLD * 100,
          );

          result.deletedCount += categoryResult.deleted;
          result.archivedCount += categoryResult.archived;
          result.storageFreed += categoryResult.storageFreed;
          result.categories[policy.category] =
            categoryResult.deleted + categoryResult.archived;
        } catch (error) {
          const errorMsg = `Failed to cleanup ${policy.category}: ${error}`;
          console.error(errorMsg);
          result.errors.push(errorMsg);
        }
      }

      // Log cleanup results
      await this.logCleanupActivity(result);

      console.log(
        `Cleanup completed: ${result.deletedCount} deleted, ${result.archivedCount} archived, ${result.storageFreed}MB freed`,
      );

      return result;
    } catch (error) {
      console.error('Error during email cleanup:', error);
      result.errors.push(`Cleanup failed: ${error}`);
      return result;
    }
  }

  /**
   * Cleanup emails for a specific category
   */
  private async cleanupCategory(
    policy: EmailRetentionPolicy,
    criticalMode: boolean,
  ): Promise<{ deleted: number; archived: number; storageFreed: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

    // In critical mode, be more aggressive
    if (criticalMode) {
      cutoffDate.setDate(
        cutoffDate.getDate() + Math.floor(policy.retentionDays * 0.3),
      );
    }

    const oldEmails = await this.tutaEmailService.getEmailsByCategory(
      policy.category,
      cutoffDate,
    );

    let deleted = 0;
    let archived = 0;
    let storageFreed = 0;

    for (const email of oldEmails) {
      try {
        const emailSize = await this.tutaEmailService.getEmailSize(email.id);

        if (policy.archiveBeforeDelete && this.archiveService) {
          // Archive to external storage first
          await this.archiveService.archiveEmail(email, policy.category);
          archived++;
        }

        // Delete from Tuta
        await this.tutaEmailService.deleteEmail(email.id);
        deleted++;
        storageFreed += emailSize;
      } catch (error) {
        console.error(`Failed to process email ${email.id}:`, error);
      }
    }

    return { deleted, archived, storageFreed };
  }

  /**
   * Emergency cleanup when storage is critically full
   */
  async emergencyCleanup(): Promise<EmailCleanupResult> {
    console.warn('Emergency cleanup initiated - storage critically full');

    // More aggressive cleanup - reduce retention by 50%
    const emergencyPolicies = this.retentionPolicies.map((policy) => ({
      ...policy,
      retentionDays: Math.floor(policy.retentionDays * 0.5),
      archiveBeforeDelete: false, // Skip archiving in emergency
    }));

    const originalPolicies = this.retentionPolicies;
    this.retentionPolicies = emergencyPolicies;

    try {
      const result = await this.performCleanup(true);
      result.errors.unshift(
        'EMERGENCY CLEANUP PERFORMED - Reduced retention periods',
      );
      return result;
    } finally {
      this.retentionPolicies = originalPolicies;
    }
  }

  /**
   * Categorize email for retention policy
   */
  categorizeEmail(email: any): string {
    const subject = email.subject?.toLowerCase() || '';
    const from = email.from?.toLowerCase() || '';
    const body = email.body?.toLowerCase() || '';

    // High priority categories
    if (subject.includes('transfer') && subject.includes('confirm')) {
      return 'transfer_confirmations';
    }
    if (
      subject.includes('cbl') &&
      (subject.includes('application') || subject.includes('apply'))
    ) {
      return 'cbl_applications';
    }
    if (subject.includes('dispute') || subject.includes('complaint')) {
      return 'dispute_resolutions';
    }

    // Medium priority categories
    if (subject.includes('milestone') || subject.includes('reward')) {
      return 'cbl_communications';
    }
    if (subject.includes('notification') || subject.includes('alert')) {
      return 'player_notifications';
    }
    if (from.includes('system') || from.includes('admin')) {
      return 'system_alerts';
    }

    // Low priority categories
    if (
      subject.includes('report') &&
      (subject.includes('daily') || subject.includes('weekly'))
    ) {
      return 'automated_reports';
    }
    if (subject.includes('bounce') || subject.includes('delivery failed')) {
      return 'bounce_notifications';
    }
    if (body.includes('unsubscribe') || subject.includes('promo')) {
      return 'promotional';
    }

    // Default to medium priority
    return 'player_notifications';
  }

  /**
   * Schedule automatic cleanup
   */
  scheduleAutomaticCleanup(): void {
    // Run cleanup check every 6 hours
    setInterval(
      async () => {
        try {
          const stats = await this.getStorageStats();

          if (stats.utilizationPercent > this.CRITICAL_THRESHOLD * 100) {
            console.warn('Storage critically full - running emergency cleanup');
            await this.emergencyCleanup();
          } else if (stats.utilizationPercent > this.WARNING_THRESHOLD * 100) {
            console.log(
              'Storage above warning threshold - running standard cleanup',
            );
            await this.performCleanup();
          }
        } catch (error) {
          console.error('Scheduled cleanup failed:', error);
        }
      },
      6 * 60 * 60 * 1000,
    ); // 6 hours
  }

  /**
   * Manual cleanup for specific category
   */
  async cleanupSpecificCategory(
    category: string,
    customRetentionDays?: number,
  ): Promise<EmailCleanupResult> {
    const policy = this.retentionPolicies.find((p) => p.category === category);
    if (!policy) {
      throw new Error(`Unknown email category: ${category}`);
    }

    if (customRetentionDays) {
      policy.retentionDays = customRetentionDays;
    }

    const categoryResult = await this.cleanupCategory(policy, false);

    const result: EmailCleanupResult = {
      deletedCount: categoryResult.deleted,
      archivedCount: categoryResult.archived,
      storageFreed: categoryResult.storageFreed,
      categories: {
        [category]: categoryResult.deleted + categoryResult.archived,
      },
      errors: [],
    };

    await this.logCleanupActivity(result);
    return result;
  }

  /**
   * Get retention policy recommendations
   */
  getRetentionRecommendations(currentUsage: number): string[] {
    const recommendations: string[] = [];

    if (currentUsage > 90) {
      recommendations.push('CRITICAL: Reduce all retention periods by 50%');
      recommendations.push('Consider upgrading to paid Tuta plan');
      recommendations.push('Archive important emails to external storage');
    } else if (currentUsage > 80) {
      recommendations.push(
        'WARNING: Clean up promotional and automated emails',
      );
      recommendations.push('Reduce low-priority email retention to 7 days');
    } else if (currentUsage > 70) {
      recommendations.push('Consider monthly cleanup of old emails');
      recommendations.push('Archive transfer confirmations to free up space');
    }

    return recommendations;
  }

  /**
   * Log cleanup activity for monitoring
   */
  private async logCleanupActivity(result: EmailCleanupResult): Promise<void> {
    try {
      await this.database.logEmailCleanup({
        timestamp: new Date(),
        deletedCount: result.deletedCount,
        archivedCount: result.archivedCount,
        storageFreed: result.storageFreed,
        categories: result.categories,
        errors: result.errors,
        metadata: {
          type: 'automated_cleanup',
          tutaAccount: 'OC-Phil@tutamail.com',
        },
      });
    } catch (error) {
      console.error('Failed to log cleanup activity:', error);
    }
  }

  /**
   * Get cleanup statistics and recommendations
   */
  async getCleanupReport(): Promise<{
    storageStats: EmailStorageStats;
    recommendations: string[];
    retentionPolicies: EmailRetentionPolicy[];
    lastCleanup?: Date;
  }> {
    const storageStats = await this.getStorageStats();
    const recommendations = this.getRetentionRecommendations(
      storageStats.utilizationPercent,
    );
    const lastCleanup = await this.database.getLastCleanupDate();

    return {
      storageStats,
      recommendations,
      retentionPolicies: this.retentionPolicies,
      lastCleanup,
    };
  }
}

export default EmailLifecycleService;
