/**
 * Player and Community Transfer Types
 * Supports community transfer system and referral management
 */

export interface Player {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  referralCode: string; // Current CBL's referral code
  originalReferralCode?: string; // First referral code used during signup
  transferPlayer: boolean; // Flag to identify transferred players vs new signups
  joinedAt: Date;
  lastTransferDate?: Date;
  transferCount: number; // Track number of transfers (for potential limits)
  currentCBLId: string; // Current community they belong to
  previousCBLIds: string[]; // History of previous communities
  vipStatus: boolean;
  totalPointsEarned: number;
  pointsBalance: number;
  nftsMinted: number;
  totalSpent: number;
  preferences: PlayerPreferences;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  communityUpdates: boolean;
  gameReminders: boolean;
}

export interface CommunityTransferRequest {
  id: string;
  playerId: string;
  fromCBLId: string;
  toCBLId: string;
  requestedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  walletSignature?: string;
  transactionHash?: string;
  reason?: string;
  notes?: string;
}

export interface CBLProfile {
  id: string;
  name: string;
  handle: string;
  description: string;
  theme: string;
  culture: string;
  primaryTeams: string[];
  specialties: string[];
  referralCode: string;
  memberCount: number;
  avgWinRate: string;
  perks: string[];
  testimonial?: string;
  avatar?: string;
  bannerColor: string;
  isActive: boolean;
  allowTransfers: boolean; // CBL can opt out of receiving transfers
  maxMembers?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralReward {
  id: string;
  playerId: string;
  referredPlayerId: string;
  cblId: string;
  rewardType: 'signup_bonus' | 'nft_commission' | 'activity_bonus';
  amount: number;
  currency: 'points' | 'usd';
  isTransferPlayer: boolean; // Used to determine if bonus should be awarded
  processedAt?: Date;
  status: 'pending' | 'processed' | 'cancelled';
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface PlayerActivity {
  id: string;
  playerId: string;
  activityType:
    | 'board_purchase'
    | 'nft_mint'
    | 'community_transfer'
    | 'referral_signup'
    | 'points_earned';
  description: string;
  amount?: number;
  metadata: Record<string, any>;
  timestamp: Date;
}

// Transfer-specific types
export interface TransferEligibility {
  eligible: boolean;
  reason?: string;
  cooldownRemaining?: number; // minutes until next transfer allowed
  transfersRemaining?: number; // if there's a monthly limit
}

export interface TransferConfig {
  enabled: boolean;
  cooldownPeriod: number; // minutes between transfers
  maxTransfersPerMonth: number;
  requireWalletSignature: boolean;
  requireApproval: boolean; // if CBL approval is needed
}

// Bonus distribution logic types
export interface BonusEligibility {
  playerBonus: boolean; // Should the referring player get bonus?
  cblBonus: boolean; // Should the CBL get bonus?
  reason: string; // Why bonus was/wasn't awarded
}

export interface BonusCalculation {
  referralSignupBonus: number; // Points for referring a new player
  nftCommissionRate: number; // Percentage (e.g., 30 for 30%)
  activityBonusMultiplier: number; // Multiplier for various activities
}

// Coach B integration types
export interface CoachBResponse {
  type: 'community_transfer_offer';
  message: string;
  secretPageUrl: string;
  playerId: string;
  timestamp: Date;
  metadata: {
    playerCurrentCBL?: string;
    playerComplaintReason?: string;
    suggestedCBLs?: string[];
  };
}

// API response types
export interface TransferPageData {
  availableCBLs: CBLProfile[];
  currentPlayer: Player;
  transferEligibility: TransferEligibility;
  transferConfig: TransferConfig;
}

export interface TransferResponse {
  success: boolean;
  transferId?: string;
  message: string;
  newReferralCode?: string;
  error?: string;
}

// Utility types for the reward system
export interface RewardContext {
  isNewPlayer: boolean;
  isTransferPlayer: boolean;
  referringCBL: string;
  activityType: string;
  amount?: number;
}

export interface RewardDecision {
  awardBonus: boolean;
  bonusAmount: number;
  recipient: 'player' | 'cbl' | 'both' | 'none';
  reason: string;
}
