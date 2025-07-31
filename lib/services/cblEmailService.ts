/**
 * CBL Email Management Service
 * Secure database and batch sending system for OC-Phil
 */

import {
  CBLEmailContact,
  EmailCampaign,
  EmailTemplate,
  BatchSendResult,
  EmailSendResult,
  EmailFilter,
  EmailAnalytics,
  EmailImportResult,
  OCPhilSession,
  EmailSecurityLog,
} from '@/lib/types/cblEmail';
import TutaEmailService from './tutaEmailService';

export class CBLEmailService {
  private database: any;
  private tutaService: TutaEmailService;
  private currentSession?: OCPhilSession;

  constructor(database: any, tutaService: TutaEmailService) {
    this.database = database;
    this.tutaService = tutaService;
  }

  /**
   * Authenticate OC-Phil access (wallet-based)
   */
  async authenticateOCPhil(
    walletAddress: string,
    signature: string,
  ): Promise<OCPhilSession | null> {
    try {
      // Verify this is OC-Phil's wallet address
      const ocPhilWallet = process.env.OC_PHIL_WALLET_ADDRESS;
      if (
        !ocPhilWallet ||
        walletAddress.toLowerCase() !== ocPhilWallet.toLowerCase()
      ) {
        await this.logSecurityEvent(null, 'login', {
          error: 'Unauthorized wallet access attempt',
          walletAddress,
        });
        return null;
      }

      // Verify wallet signature (implement your signature verification)
      const isValidSignature = await this.verifyWalletSignature(
        walletAddress,
        signature,
      );
      if (!isValidSignature) {
        await this.logSecurityEvent(null, 'login', {
          error: 'Invalid wallet signature',
          walletAddress,
        });
        return null;
      }

      // Create session
      const session: OCPhilSession = {
        sessionId: this.generateSessionId(),
        walletAddress,
        authenticated: true,
        permissions: [
          'view_contacts',
          'send_campaigns',
          'manage_templates',
          'view_analytics',
        ],
        loginTime: new Date(),
        lastActivity: new Date(),
        ipAddress: this.getClientIP(),
        userAgent: this.getClientUserAgent(),
      };

      // Store session
      await this.database.storeOCPhilSession(session);
      this.currentSession = session;

      // Log successful login
      await this.logSecurityEvent(session.sessionId, 'login', {
        success: true,
        walletAddress,
      });

      return session;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Add new CBL email contact
   */
  async addCBLContact(
    contactData: Partial<CBLEmailContact>,
  ): Promise<CBLEmailContact> {
    this.requireAuthentication();

    try {
      // Check for duplicates
      const existingContact = await this.database.getCBLContactByEmail(
        contactData.emailAddress,
      );
      if (existingContact) {
        throw new Error('Email address already exists in database');
      }

      const contact: CBLEmailContact = {
        id: this.generateId(),
        cblId: contactData.cblId || this.generateId(),
        cblName: contactData.cblName || 'Unknown CBL',
        emailAddress: contactData.emailAddress!,
        primaryContact: contactData.primaryContact || 'Unknown',
        secondaryEmail: contactData.secondaryEmail,
        phoneNumber: contactData.phoneNumber,
        telegramHandle: contactData.telegramHandle,
        discordHandle: contactData.discordHandle,

        preferences: {
          emailNotifications: true,
          milestoneUpdates: true,
          promotionalEmails: true,
          systemAlerts: true,
          batchCommunications: true,
          ...contactData.preferences,
        },

        status: 'pending_verification',
        emailVerified: false,
        totalEmailsSent: 0,
        emailBounces: 0,

        memberCount: contactData.memberCount || 0,
        avgWinRate: contactData.avgWinRate || '0%',
        platform: contactData.platform || 'unknown',
        referralCode: contactData.referralCode || '',
        joinedDate: contactData.joinedDate || new Date(),
        lastActivity: new Date(),

        tags: contactData.tags || [],
        notes: contactData.notes,

        submittedBy:
          contactData.submittedBy || this.currentSession!.walletAddress,
        verificationToken: this.generateVerificationToken(),
        ipAddress: this.getClientIP(),
        userAgent: this.getClientUserAgent(),

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.database.createCBLContact(contact);

      // Send verification email
      await this.sendVerificationEmail(contact);

      await this.logSecurityEvent(
        this.currentSession!.sessionId,
        'import_data',
        {
          contactId: contact.id,
          emailAddress: contact.emailAddress,
        },
      );

      return contact;
    } catch (error) {
      console.error('Error adding CBL contact:', error);
      throw error;
    }
  }

  /**
   * Get all CBL contacts with filtering
   */
  async getCBLContacts(
    filters?: EmailFilter[],
    limit?: number,
    offset?: number,
  ): Promise<CBLEmailContact[]> {
    this.requireAuthentication();

    await this.logSecurityEvent(
      this.currentSession!.sessionId,
      'view_contacts',
      {
        filtersApplied: !!filters,
        filterCount: filters?.length || 0,
      },
    );

    return this.database.getCBLContacts(filters, limit, offset);
  }

  /**
   * Create email campaign
   */
  async createCampaign(
    campaignData: Partial<EmailCampaign>,
  ): Promise<EmailCampaign> {
    this.requireAuthentication();

    const campaign: EmailCampaign = {
      id: this.generateId(),
      name: campaignData.name || 'Untitled Campaign',
      subject: campaignData.subject || '',
      body: campaignData.body || '',
      htmlBody: campaignData.htmlBody,

      campaignType: campaignData.campaignType || 'manual',
      priority: campaignData.priority || 'normal',

      targetAudience: campaignData.targetAudience || 'all',
      customFilters: campaignData.customFilters,
      includeTags: campaignData.includeTags,
      excludeTags: campaignData.excludeTags,

      scheduled: campaignData.scheduled || false,
      sendAt: campaignData.sendAt,
      timezone: campaignData.timezone,

      status: 'draft',
      recipientCount: 0,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0,

      createdBy: this.currentSession!.walletAddress,
      template: campaignData.template,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Calculate recipient count
    const recipients = await this.getRecipients(campaign);
    campaign.recipientCount = recipients.length;

    await this.database.createEmailCampaign(campaign);
    return campaign;
  }

  /**
   * Send batch email campaign
   */
  async sendBatchCampaign(campaignId: string): Promise<BatchSendResult> {
    this.requireAuthentication();

    const startTime = new Date();
    const campaign = await this.database.getEmailCampaign(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.createdBy !== this.currentSession!.walletAddress) {
      throw new Error('Unauthorized: Campaign not created by current user');
    }

    // Update campaign status
    await this.database.updateCampaignStatus(campaignId, 'sending');

    const recipients = await this.getRecipients(campaign);
    const results: EmailSendResult[] = [];
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    // Process recipients in batches to avoid overwhelming Tuta
    const batchSize = 10; // Send 10 emails at a time
    const batches = this.chunkArray(recipients, batchSize);

    for (const batch of batches) {
      const batchPromises = batch.map(async (contact) => {
        try {
          // Check if contact should be skipped
          if (
            contact.status === 'unsubscribed' ||
            contact.status === 'bounced'
          ) {
            skippedCount++;
            return {
              contactId: contact.id,
              emailAddress: contact.emailAddress,
              status: 'skipped' as const,
              timestamp: new Date(),
            };
          }

          // Personalize email content
          const personalizedSubject = this.personalizeContent(
            campaign.subject,
            contact,
          );
          const personalizedBody = this.personalizeContent(
            campaign.body,
            contact,
          );

          // Send email
          const sendResult = await this.tutaService.sendEmail({
            to: contact.emailAddress,
            subject: personalizedSubject,
            body: personalizedBody,
            category: 'cbl_communications',
            priority: campaign.priority as any,
          });

          if (sendResult.success) {
            successCount++;

            // Update contact statistics
            await this.database.updateContactEmailStats(contact.id, {
              lastEmailSent: new Date(),
              totalEmailsSent: contact.totalEmailsSent + 1,
            });

            return {
              contactId: contact.id,
              emailAddress: contact.emailAddress,
              status: 'sent' as const,
              messageId: sendResult.messageId,
              timestamp: new Date(),
            };
          } else {
            failureCount++;
            errors.push(
              `Failed to send to ${contact.emailAddress}: ${sendResult.error}`,
            );

            return {
              contactId: contact.id,
              emailAddress: contact.emailAddress,
              status: 'failed' as const,
              error: sendResult.error,
              timestamp: new Date(),
            };
          }
        } catch (error) {
          failureCount++;
          const errorMsg = `Error sending to ${contact.emailAddress}: ${error}`;
          errors.push(errorMsg);

          return {
            contactId: contact.id,
            emailAddress: contact.emailAddress,
            status: 'failed' as const,
            error: errorMsg,
            timestamp: new Date(),
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Brief pause between batches to respect rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second pause
      }
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Update campaign with final statistics
    await this.database.updateCampaignStats(campaignId, {
      status: 'sent',
      sentCount: successCount,
      sentAt: endTime,
      updatedAt: endTime,
    });

    const batchResult: BatchSendResult = {
      campaignId,
      totalRecipients: recipients.length,
      successCount,
      failureCount,
      skippedCount,
      results,
      errors,
      startTime,
      endTime,
      duration,
    };

    // Log batch send activity
    await this.logSecurityEvent(
      this.currentSession!.sessionId,
      'send_campaign',
      {
        campaignId,
        recipientCount: recipients.length,
        successCount,
        failureCount,
        duration,
      },
    );

    // Store batch results
    await this.database.storeBatchSendResult(batchResult);

    return batchResult;
  }

  /**
   * Get recipients for a campaign
   */
  private async getRecipients(
    campaign: EmailCampaign,
  ): Promise<CBLEmailContact[]> {
    let filters: EmailFilter[] = [];

    // Base filter - only active, verified contacts
    filters.push(
      { field: 'emailVerified', operator: 'equals', value: true },
      { field: 'status', operator: 'equals', value: 'active' },
    );

    // Add audience-specific filters
    switch (campaign.targetAudience) {
      case 'active':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filters.push({
          field: 'lastActivity',
          operator: 'greater_than',
          value: thirtyDaysAgo,
        });
        break;

      case 'new':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filters.push({
          field: 'joinedDate',
          operator: 'greater_than',
          value: sevenDaysAgo,
        });
        break;

      case 'high_performers':
        filters.push({
          field: 'memberCount',
          operator: 'greater_than',
          value: 100,
        });
        break;

      case 'custom':
        if (campaign.customFilters) {
          filters.push(...campaign.customFilters);
        }
        break;
    }

    // Add tag filters
    if (campaign.includeTags && campaign.includeTags.length > 0) {
      filters.push({
        field: 'tags',
        operator: 'in',
        value: campaign.includeTags,
      });
    }

    if (campaign.excludeTags && campaign.excludeTags.length > 0) {
      filters.push({
        field: 'tags',
        operator: 'not_in',
        value: campaign.excludeTags,
      });
    }

    return this.database.getCBLContacts(filters);
  }

  /**
   * Import CBL contacts from CSV/JSON
   */
  async importContacts(
    contactsData: Partial<CBLEmailContact>[],
  ): Promise<EmailImportResult> {
    this.requireAuthentication();

    const result: EmailImportResult = {
      totalProcessed: contactsData.length,
      successCount: 0,
      skippedCount: 0,
      errorCount: 0,
      duplicateCount: 0,
      errors: [],
      importedContacts: [],
    };

    for (let i = 0; i < contactsData.length; i++) {
      const contactData = contactsData[i];

      try {
        // Check for required fields
        if (!contactData.emailAddress) {
          result.errors.push({
            row: i + 1,
            error: 'Email address is required',
            data: contactData,
          });
          result.errorCount++;
          continue;
        }

        // Check for duplicates
        const existingContact = await this.database.getCBLContactByEmail(
          contactData.emailAddress,
        );
        if (existingContact) {
          result.duplicateCount++;
          continue;
        }

        // Import contact
        const contact = await this.addCBLContact(contactData);
        result.importedContacts.push(contact);
        result.successCount++;
      } catch (error) {
        result.errors.push({
          row: i + 1,
          email: contactData.emailAddress,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: contactData,
        });
        result.errorCount++;
      }
    }

    await this.logSecurityEvent(this.currentSession!.sessionId, 'import_data', {
      totalProcessed: result.totalProcessed,
      successCount: result.successCount,
      errorCount: result.errorCount,
    });

    return result;
  }

  /**
   * Get email analytics
   */
  async getEmailAnalytics(
    campaignId?: string,
    days: number = 30,
  ): Promise<EmailAnalytics> {
    this.requireAuthentication();

    return this.database.getEmailAnalytics(campaignId, days);
  }

  /**
   * Create email template
   */
  async createTemplate(
    templateData: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    this.requireAuthentication();

    const template: EmailTemplate = {
      id: this.generateId(),
      name: templateData.name || 'Untitled Template',
      description: templateData.description || '',
      subject: templateData.subject || '',
      body: templateData.body || '',
      htmlBody: templateData.htmlBody,
      variables: templateData.variables || [],
      category: templateData.category || 'announcement',
      tags: templateData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.database.createEmailTemplate(template);
    return template;
  }

  /**
   * Send verification email to new contact
   */
  private async sendVerificationEmail(contact: CBLEmailContact): Promise<void> {
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${contact.verificationToken}`;

    await this.tutaService.sendEmail({
      to: contact.emailAddress,
      subject: '🏈 Verify Your CBL Email Subscription',
      body: `
Hi ${contact.primaryContact},

Thanks for submitting your email for CBL communications!

Please verify your email address by clicking the link below:
${verificationUrl}

Once verified, you'll receive:
• CBL milestone notifications and rewards
• Platform updates and announcements  
• Community insights and tips from OC-Phil
• Exclusive CBL program benefits

If you didn't request this, simply ignore this email.

Best regards,
OC-Phil & The Football Squares Team 🏈

---
This verification link expires in 7 days.
      `.trim(),
      category: 'system_alerts',
      priority: 'normal',
    });
  }

  /**
   * Personalize email content with contact data
   */
  private personalizeContent(
    content: string,
    contact: CBLEmailContact,
  ): string {
    return content
      .replace(/\{cblName\}/g, contact.cblName)
      .replace(/\{primaryContact\}/g, contact.primaryContact)
      .replace(/\{memberCount\}/g, contact.memberCount.toString())
      .replace(/\{avgWinRate\}/g, contact.avgWinRate)
      .replace(/\{platform\}/g, contact.platform)
      .replace(/\{referralCode\}/g, contact.referralCode);
  }

  /**
   * Utility methods
   */
  private requireAuthentication(): void {
    if (!this.currentSession?.authenticated) {
      throw new Error('Authentication required');
    }
  }

  private async verifyWalletSignature(
    walletAddress: string,
    signature: string,
  ): Promise<boolean> {
    // Implement wallet signature verification
    // This is a placeholder - implement actual verification
    return true;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVerificationToken(): string {
    return Math.random().toString(36).substr(2, 32);
  }

  private getClientIP(): string {
    // Implement IP detection
    return '127.0.0.1';
  }

  private getClientUserAgent(): string {
    // Implement user agent detection
    return 'Unknown';
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async logSecurityEvent(
    sessionId: string | null,
    action: EmailSecurityLog['action'],
    details: Record<string, any>,
  ): Promise<void> {
    const log: EmailSecurityLog = {
      id: this.generateId(),
      sessionId: sessionId || 'anonymous',
      action,
      details,
      ipAddress: this.getClientIP(),
      userAgent: this.getClientUserAgent(),
      timestamp: new Date(),
    };

    await this.database.logSecurityEvent(log);
  }
}

export default CBLEmailService;
