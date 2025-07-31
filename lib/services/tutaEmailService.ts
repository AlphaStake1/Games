/**
 * Tuta Email Service Integration
 * Handles OC-Phil's Tuta email operations with lifecycle management
 */

import EmailLifecycleService from './emailLifecycleService';

export interface TutaConfig {
  email: string;
  password: string;
  recoveryCode: string;
  baseUrl: string;
}

export interface TutaEmail {
  id: string;
  subject: string;
  from: string;
  to: string[];
  body: string;
  timestamp: Date;
  size: number; // in bytes
  category?: string;
  read: boolean;
  attachments?: TutaAttachment[];
}

export interface TutaAttachment {
  name: string;
  size: number;
  mimeType: string;
  cid?: string;
}

export interface SendEmailRequest {
  to: string | string[];
  subject: string;
  body: string;
  category?: string;
  priority?: 'low' | 'normal' | 'high';
  attachments?: TutaAttachment[];
  template?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  storageWarning?: boolean;
}

export class TutaEmailService {
  private config: TutaConfig;
  private lifecycleService?: EmailLifecycleService;
  private isAuthenticated: boolean = false;
  private authToken?: string;

  constructor(config?: Partial<TutaConfig>) {
    this.config = {
      email: config?.email || 'OC-Phil@tutamail.com',
      password: config?.password || 'OffensiveCoordinatorPhil01',
      recoveryCode:
        config?.recoveryCode ||
        '31af 1199 f4a5 d95c 0669 c083 5272 be01 c574 f28c 8a2d 70b5 c96f 23ed ff14 0dbe',
      baseUrl: config?.baseUrl || 'https://mail.tutanota.com',
    };
  }

  /**
   * Initialize with lifecycle management
   */
  initializeWithLifecycle(archiveService?: any, database?: any): void {
    this.lifecycleService = new EmailLifecycleService(
      this,
      archiveService,
      database,
    );

    // Start automatic cleanup monitoring
    this.lifecycleService.scheduleAutomaticCleanup();
  }

  /**
   * Authenticate with Tuta
   */
  async authenticate(): Promise<boolean> {
    try {
      // This would integrate with Tuta's API
      // For now, simulate authentication
      console.log(`Authenticating ${this.config.email} with Tuta...`);

      // Simulate API call
      const authResponse = await this.makeApiCall('/auth/login', {
        email: this.config.email,
        password: this.config.password,
      });

      if (authResponse.success) {
        this.isAuthenticated = true;
        this.authToken = authResponse.token;
        console.log('Tuta authentication successful');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Tuta authentication failed:', error);
      return false;
    }
  }

  /**
   * Send email with storage management
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResult> {
    try {
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      // Check storage before sending
      if (this.lifecycleService) {
        const stats = await this.lifecycleService.getStorageStats();
        if (stats.utilizationPercent > 95) {
          console.warn(
            'Storage critically full - running emergency cleanup before sending',
          );
          await this.lifecycleService.emergencyCleanup();
        }
      }

      // Categorize email for lifecycle management
      const category =
        request.category || this.categorizeOutgoingEmail(request);

      const emailData = {
        to: Array.isArray(request.to) ? request.to : [request.to],
        subject: request.subject,
        body: request.body,
        priority: request.priority || 'normal',
        attachments: request.attachments || [],
        category,
        timestamp: new Date(),
      };

      // Send via Tuta API
      const response = await this.makeApiCall('/mail/send', emailData);

      if (response.success) {
        // Check if storage warning needed
        const storageWarning = this.lifecycleService
          ? (await this.lifecycleService.getStorageStats()).utilizationPercent >
            85
          : false;

        return {
          success: true,
          messageId: response.messageId,
          storageWarning,
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to send email',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get email count for storage management
   */
  async getEmailCount(): Promise<number> {
    try {
      const response = await this.makeApiCall('/mail/count');
      return response.count || 0;
    } catch (error) {
      console.error('Error getting email count:', error);
      return 0;
    }
  }

  /**
   * Get oldest email date
   */
  async getOldestEmailDate(): Promise<Date> {
    try {
      const response = await this.makeApiCall('/mail/oldest');
      return new Date(response.date);
    } catch (error) {
      console.error('Error getting oldest email date:', error);
      return new Date(); // Return current date as fallback
    }
  }

  /**
   * Get emails by category and date for cleanup
   */
  async getEmailsByCategory(
    category: string,
    beforeDate: Date,
  ): Promise<TutaEmail[]> {
    try {
      const response = await this.makeApiCall('/mail/search', {
        category,
        beforeDate: beforeDate.toISOString(),
        limit: 100, // Process in batches
      });

      return response.emails || [];
    } catch (error) {
      console.error('Error getting emails by category:', error);
      return [];
    }
  }

  /**
   * Get email size
   */
  async getEmailSize(emailId: string): Promise<number> {
    try {
      const response = await this.makeApiCall(`/mail/${emailId}/size`);
      return response.size || 25000; // Default ~25KB
    } catch (error) {
      console.error('Error getting email size:', error);
      return 25000; // Default size in bytes
    }
  }

  /**
   * Delete email
   */
  async deleteEmail(emailId: string): Promise<boolean> {
    try {
      const response = await this.makeApiCall(
        `/mail/${emailId}`,
        null,
        'DELETE',
      );
      return response.success;
    } catch (error) {
      console.error('Error deleting email:', error);
      return false;
    }
  }

  /**
   * Send community transfer confirmation email
   */
  async sendTransferConfirmation(
    playerEmail: string,
    playerName: string,
    fromCBL: string,
    toCBL: string,
    newReferralCode: string,
  ): Promise<SendEmailResult> {
    const subject = `🏈 Community Transfer Confirmed - Welcome to ${toCBL}!`;
    const body = `
Hi ${playerName},

Your community transfer has been successfully completed! 🎉

**Transfer Details:**
• From: ${fromCBL}
• To: ${toCBL}
• New Referral Code: ${newReferralCode}
• Transfer Date: ${new Date().toLocaleDateString()}

**What's Next:**
✅ You now have access to ${toCBL}'s exclusive member perks
✅ Future NFT minting commissions (30%) will go to ${toCBL}
✅ Your new referral code is active immediately
✅ You can start participating in ${toCBL}'s community activities

**Important Notes:**
• This transfer is permanent and cannot be undone
• Your previous community access has been removed
• Standard activity points continue as normal
• Bonus referral points are only for new player signups

Welcome to your new community! We're excited to have you on the team.

Best regards,
Coach B & The Football Squares Team 🏈

---
Questions? Reply to this email or contact support.
This email was sent regarding your Football Squares account.
    `.trim();

    return this.sendEmail({
      to: playerEmail,
      subject,
      body,
      category: 'transfer_confirmations',
      priority: 'high',
    });
  }

  /**
   * Send CBL notification about new transferred member
   */
  async sendCBLTransferNotification(
    cblEmail: string,
    cblName: string,
    playerWallet: string,
    playerName?: string,
  ): Promise<SendEmailResult> {
    const subject = `🎯 New Member Transfer - ${playerName || 'Player'} Joined Your Community`;
    const body = `
Hi ${cblName},

Great news! A new player has transferred to your community.

**New Member Details:**
• Player: ${playerName || 'Anonymous Player'}
• Wallet: ${playerWallet}
• Transfer Date: ${new Date().toLocaleDateString()}
• Source: Community transfer (not a new signup)

**What This Means:**
✅ You'll receive 30% commission on their future NFT mints
✅ They have access to your community perks immediately
✅ Standard CBL rewards apply for their activities
⚠️  No bonus referral points (transfers only get commissions)

**Next Steps:**
1. Welcome them to your community channels
2. Share your community guidelines and perks
3. Help them get integrated with existing members

This transferred player chose your community because of your reputation and offerings - well done building an attractive community environment!

Keep up the great work!

Best regards,
Coach B & The CBL Success Team 🏆

---
CBL Dashboard: [View Your Community Stats]
Questions? Reply to this email or contact CBL support.
    `.trim();

    return this.sendEmail({
      to: cblEmail,
      subject,
      body,
      category: 'cbl_communications',
      priority: 'normal',
    });
  }

  /**
   * Send storage warning email
   */
  async sendStorageWarning(
    utilizationPercent: number,
  ): Promise<SendEmailResult> {
    const urgency =
      utilizationPercent > 95
        ? 'CRITICAL'
        : utilizationPercent > 85
          ? 'WARNING'
          : 'NOTICE';
    const subject = `${urgency}: Tuta Email Storage at ${utilizationPercent}%`;

    const body = `
TUTA EMAIL STORAGE ALERT

Current Usage: ${utilizationPercent}% of 1GB free plan
Account: ${this.config.email}
Date: ${new Date().toLocaleString()}

${
  utilizationPercent > 95
    ? 'CRITICAL: Storage almost full! Automatic emergency cleanup has been triggered.'
    : utilizationPercent > 85
      ? 'WARNING: Storage usage high. Consider manual cleanup or plan upgrade.'
      : 'NOTICE: Storage usage increasing. Monitor and clean up if needed.'
}

Recommended Actions:
${
  utilizationPercent > 95
    ? '• Emergency cleanup is running automatically\n• Consider upgrading to paid Tuta plan\n• Archive important emails immediately'
    : '• Review and delete old promotional emails\n• Archive important transfer confirmations\n• Clean up automated reports older than 7 days'
}

---
This is an automated alert from the Email Lifecycle Management System.
    `.trim();

    return this.sendEmail({
      to: 'admin@yourdomain.com', // Send to admin
      subject,
      body,
      category: 'system_alerts',
      priority: 'high',
    });
  }

  /**
   * Get lifecycle management statistics
   */
  async getLifecycleStats() {
    if (!this.lifecycleService) {
      throw new Error('Lifecycle service not initialized');
    }
    return this.lifecycleService.getCleanupReport();
  }

  /**
   * Perform manual cleanup
   */
  async performManualCleanup(forceCleanup: boolean = false) {
    if (!this.lifecycleService) {
      throw new Error('Lifecycle service not initialized');
    }
    return this.lifecycleService.performCleanup(forceCleanup);
  }

  /**
   * Categorize outgoing email for lifecycle management
   */
  private categorizeOutgoingEmail(request: SendEmailRequest): string {
    const subject = request.subject.toLowerCase();
    const to = Array.isArray(request.to) ? request.to[0] : request.to;

    if (subject.includes('transfer') && subject.includes('confirm')) {
      return 'transfer_confirmations';
    }
    if (subject.includes('cbl') || subject.includes('community')) {
      return 'cbl_communications';
    }
    if (subject.includes('storage') || subject.includes('alert')) {
      return 'system_alerts';
    }
    if (subject.includes('welcome') || subject.includes('notification')) {
      return 'player_notifications';
    }
    if (subject.includes('report') || subject.includes('summary')) {
      return 'automated_reports';
    }

    return 'player_notifications'; // Default category
  }

  /**
   * Make API call to Tuta (mock implementation)
   */
  private async makeApiCall(
    endpoint: string,
    data?: any,
    method: string = 'POST',
  ): Promise<any> {
    // This is a mock implementation
    // In reality, you'd integrate with Tuta's actual API

    console.log(
      `Tuta API Call: ${method} ${endpoint}`,
      data ? Object.keys(data) : 'no data',
    );

    // Simulate API response
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock successful responses based on endpoint
    if (endpoint === '/auth/login') {
      return { success: true, token: 'mock-auth-token' };
    }
    if (endpoint === '/mail/send') {
      return { success: true, messageId: `msg_${Date.now()}` };
    }
    if (endpoint === '/mail/count') {
      return { count: Math.floor(Math.random() * 500) + 100 };
    }
    if (endpoint === '/mail/oldest') {
      return {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    if (endpoint.includes('/mail/search')) {
      return { emails: [] }; // Mock empty results
    }
    if (endpoint.includes('/size')) {
      return { size: Math.floor(Math.random() * 50000) + 10000 };
    }
    if (method === 'DELETE') {
      return { success: true };
    }

    return { success: false, error: 'Unknown endpoint' };
  }

  /**
   * Get Tuta account configuration (safely)
   */
  getAccountInfo(): { email: string; hasRecoveryCode: boolean } {
    return {
      email: this.config.email,
      hasRecoveryCode: !!this.config.recoveryCode,
    };
  }
}

export default TutaEmailService;
