/**
 * Player Email Management Types
 * Secure email database for Coach B's batch communications with players
 */

export interface PlayerEmailContact {
  id: string;
  playerId: string;
  playerName: string;
  emailAddress: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  source: 'submission_form' | 'manual_import' | 'other';
  notes?: string;
  preferences: {
    receivesNewsletter: boolean;
    receivesUpdates: boolean;
    receivesPromotions: boolean;
  };
  status: 'active' | 'inactive' | 'bounced' | 'unsubscribed';
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  targetAudience: 'all' | 'active' | 'inactive' | 'unsubscribed' | 'verified' | 'unverified';
  createdAt: Date;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  analytics: {
    totalRecipients: number;
    sentCount: number;
    failedCount: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // HTML or Markdown content
  variables: string[]; // e.g., ['playerName', 'playerId']
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchSendResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  details: {
    contactId: string;
    status: 'sent' | 'failed';
    error?: string;
  }[];
}

export interface PlayerEmailSystemStats {
  totalContacts: number;
  activeContacts: number;
  unsubscribedContacts: number;
  bouncedContacts: number;
  totalCampaigns: number;
  emailsSentThisMonth: number;
  storageSize: number; // in MB
}

export interface SecureAdminSession {
  sessionId: string;
  adminWallet: string; // Coach B's wallet address
  expiresAt: Date;
  permissions: ('read' | 'write' | 'send')[];
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  adminWallet: string;
  action: string; // e.g., 'login', 'create_campaign', 'send_batch'
  details: Record<string, any>;
  ipAddress: string;
}
