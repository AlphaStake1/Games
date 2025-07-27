/**
 * VRF (Verifiable Random Function) types and interfaces
 * Supporting Chainlink VRF integration for digit randomization
 */

// VRF process states based on the weekly-boards.md specification
export type VRFStatus =
  | 'pending' // Board created, waiting for VRF trigger (40 min before kickoff)
  | 'requested' // VRF request submitted to Chainlink
  | 'processing' // VRF request being processed by oracle
  | 'completed' // VRF proof received and digits set
  | 'failed' // VRF process failed, fallback may be used
  | 'cancelled'; // Board cancelled (< 95% sold)

// VRF proof data structure
export interface VRFProof {
  requestId: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  randomSeed: string;
  homeDigits: number[];
  awayDigits: number[];
  proof: {
    gamma: [string, string];
    c: string;
    s: string;
    seed: string;
    uWitness: [string, string];
    cGammaWitness: [string, string];
    sHashWitness: [string, string];
    zInv: string;
  };
  verified: boolean;
}

// VRF request information
export interface VRFRequest {
  requestId: string;
  boardId: string;
  gameId: string;
  requestTime: Date;
  scheduledTriggerTime: Date; // 40 minutes before kickoff
  transactionHash?: string;
  gasUsed?: number;
  status: VRFStatus;
}

// VRF state for a specific board
export interface VRFState {
  boardId: string;
  status: VRFStatus;
  request?: VRFRequest;
  proof?: VRFProof;
  error?: VRFError;
  countdown?: {
    timeUntilTrigger: number; // milliseconds until VRF trigger
    timeUntilReveal: number; // milliseconds until digit reveal
    isActive: boolean;
  };
}

// VRF error information
export interface VRFError {
  code: string;
  message: string;
  timestamp: Date;
  fallbackUsed?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

// VRF configuration constants
export const VRF_CONFIG = {
  // Timing constants (from weekly-boards.md)
  TRIGGER_BEFORE_KICKOFF_MINUTES: 40,
  REGISTRATION_LOCK_MINUTES: 60,
  AUTO_FILL_THRESHOLD: 0.95,

  // VRF request parameters
  REQUEST_TIMEOUT_MINUTES: 10,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_SECONDS: 30,

  // Solana network configuration
  CHAINLINK_VRF_PROGRAM_ID:
    process.env.NEXT_PUBLIC_CHAINLINK_VRF_PROGRAM_ID || '',
  SOLANA_EXPLORER_BASE_URL:
    process.env.NEXT_PUBLIC_SOLANA_EXPLORER_URL ||
    'https://explorer.solana.com',

  // UI update intervals
  COUNTDOWN_UPDATE_INTERVAL_MS: 1000,
  STATUS_POLL_INTERVAL_MS: 5000,
} as const;

// Utility functions for VRF status
export const getVRFStatusColor = (status: VRFStatus): string => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'requested':
    case 'processing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'cancelled':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getVRFStatusMessage = (status: VRFStatus): string => {
  switch (status) {
    case 'pending':
      return 'Waiting for randomization trigger';
    case 'requested':
      return 'Random number generation requested';
    case 'processing':
      return 'Generating provably fair random numbers';
    case 'completed':
      return 'Digits revealed - game ready!';
    case 'failed':
      return 'Randomization failed - using fallback';
    case 'cancelled':
      return 'Board cancelled due to low participation';
    default:
      return 'Unknown status';
  }
};

export const isVRFPending = (status: VRFStatus): boolean => {
  return ['pending', 'requested', 'processing'].includes(status);
};

export const isVRFComplete = (status: VRFStatus): boolean => {
  return status === 'completed';
};

export const hasVRFError = (status: VRFStatus): boolean => {
  return status === 'failed';
};

// Calculate timing information for VRF process
export const calculateVRFTiming = (
  gameStartTime: Date,
): {
  triggerTime: Date;
  timeUntilTrigger: number;
  timeUntilReveal: number;
  isTriggered: boolean;
  isRevealed: boolean;
} => {
  const now = new Date();
  const triggerTime = new Date(
    gameStartTime.getTime() -
      VRF_CONFIG.TRIGGER_BEFORE_KICKOFF_MINUTES * 60 * 1000,
  );

  const timeUntilTrigger = triggerTime.getTime() - now.getTime();
  const timeUntilReveal = gameStartTime.getTime() - now.getTime();

  return {
    triggerTime,
    timeUntilTrigger,
    timeUntilReveal,
    isTriggered: timeUntilTrigger <= 0,
    isRevealed: timeUntilReveal <= 0,
  };
};

// Format time duration for countdown display
export const formatCountdownTime = (milliseconds: number): string => {
  if (milliseconds <= 0) return '00:00:00';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const displayHours = hours % 24;
  const displayMinutes = minutes % 60;
  const displaySeconds = seconds % 60;

  if (hours > 0) {
    return `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  }

  return `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
};

// Generate Solana Explorer URLs
export const getSolanaExplorerUrl = (
  transactionHash: string,
  cluster: string = 'mainnet-beta',
): string => {
  return `${VRF_CONFIG.SOLANA_EXPLORER_BASE_URL}/tx/${transactionHash}${cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : ''}`;
};

export const getChainlinkVRFExplorerUrl = (requestId: string): string => {
  // Chainlink specific VRF request explorer URL
  return `https://vrf.chain.link/request/${requestId}`;
};

// Type guards for VRF data
export const isValidVRFProof = (proof: any): proof is VRFProof => {
  return (
    proof &&
    typeof proof.requestId === 'string' &&
    typeof proof.transactionHash === 'string' &&
    Array.isArray(proof.homeDigits) &&
    Array.isArray(proof.awayDigits) &&
    proof.homeDigits.length === 10 &&
    proof.awayDigits.length === 10 &&
    proof.proof &&
    typeof proof.verified === 'boolean'
  );
};

export const isValidVRFRequest = (request: any): request is VRFRequest => {
  return (
    request &&
    typeof request.requestId === 'string' &&
    typeof request.boardId === 'string' &&
    typeof request.gameId === 'string' &&
    request.requestTime instanceof Date &&
    request.scheduledTriggerTime instanceof Date &&
    [
      'pending',
      'requested',
      'processing',
      'completed',
      'failed',
      'cancelled',
    ].includes(request.status)
  );
};
