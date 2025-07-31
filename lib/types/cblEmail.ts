/**
 * CBL Email Management Types
 * Secure email database for OC-Phil's batch communications
 */

export interface CBLEmailContact {
  id: string;
  cblId: string;
  cblName: string;
  emailAddress: string;
  primaryContact: string; // Name of primary contact
  secondaryEmail?: string; // Backup email
  phoneNumber?: string;
  telegramHandle?: string;
  discordHandle?: string;

  // Contact preferences
  preferences: {
    emailNotifications: boolean;
    milestoneUpdates: boolean;
    promotionalEmails: boolean;
    systemAlerts: boolean;
    batchCommunications: boolean;
  };

  // Contact status
  status:
    | 'active'
    | 'inactive'
    | 'bounced'
    | 'unsubscribed'
    | 'pending_verification';
  emailVerified: boolean;
  lastEmailSent?: Date;
  lastEmailOpened?: Date;
  totalEmailsSent: number;
  emailBounces: number;

  // CBL context
  memberCount: number;
  avgWinRate: string;
  platform: string;
  referralCode: string;
  joinedDate: Date;
  lastActivity: Date;

  // Tags for segmentation
  tags: string[];
  notes?: string;

  // Security
  submittedBy: string; // Wallet address of submitter
  verificationToken?: string;
  ipAddress?: string;
  userAgent?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;

  // Campaign settings
  campaignType:
    | 'milestone'
    | 'announcement'
    | 'promotional'
    | 'system_alert'
    | 'manual';
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Targeting
  targetAudience: 'all' | 'active' | 'new' | 'high_performers' | 'custom';
  customFilters?: EmailFilter[];
  includeTags?: string[];
  excludeTags?: string[];

  // Scheduling
  scheduled: boolean;
  sendAt?: Date;
  timezone?: string;

  // Tracking
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;

  // Metadata
  createdBy: string; // Should always be OC-Phil
  template?: string;

  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
}

export interface EmailFilter {
  field: keyof CBLEmailContact;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'starts_with'
    | 'ends_with'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in';
  value: any;
}

export interface BatchSendResult {
  campaignId: string;
  totalRecipients: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  results: EmailSendResult[];
  errors: string[];
  startTime: Date;
  endTime: Date;
  duration: number; // milliseconds
}

export interface EmailSendResult {
  contactId: string;
  emailAddress: string;
  status: 'sent' | 'failed' | 'skipped';
  messageId?: string;
  error?: string;
  timestamp: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  htmlBody?: string;

  // Template variables
  variables: TemplateVariable[];

  // Template metadata
  category: 'milestone' | 'welcome' | 'announcement' | 'promotional' | 'system';
  tags: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface EmailAnalytics {
  campaignId: string;
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;

  // Time-based analytics
  hourlyStats: HourlyEmailStats[];
  dailyStats: DailyEmailStats[];

  // Segmentation analytics
  platformBreakdown: Record<string, EmailMetrics>;
  memberCountBreakdown: Record<string, EmailMetrics>;

  generatedAt: Date;
}

export interface HourlyEmailStats {
  hour: string; // ISO datetime
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
}

export interface DailyEmailStats {
  date: string; // YYYY-MM-DD
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface EmailImportResult {
  totalProcessed: number;
  successCount: number;
  skippedCount: number;
  errorCount: number;
  duplicateCount: number;
  errors: EmailImportError[];
  importedContacts: CBLEmailContact[];
}

export interface EmailImportError {
  row: number;
  email?: string;
  error: string;
  data: any;
}

export interface EmailListSegment {
  id: string;
  name: string;
  description: string;
  filters: EmailFilter[];
  contactCount: number;
  lastUpdated: Date;
  createdAt: Date;
}

// Security and access control
export interface OCPhilSession {
  sessionId: string;
  walletAddress: string;
  authenticated: boolean;
  permissions: string[];
  loginTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

export interface EmailSecurityLog {
  id: string;
  sessionId: string;
  action:
    | 'login'
    | 'logout'
    | 'view_contacts'
    | 'send_campaign'
    | 'export_data'
    | 'import_data'
    | 'delete_contact';
  contactId?: string;
  campaignId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
