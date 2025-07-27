// API Service Layer Types for Weekly Football Squares
// Provides TypeScript interfaces for real API integration

import { NFLTeam } from '@/lib/nflTeams';
import { BoardTier, PayoutStructure } from '@/lib/boardTypes';

// Base API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  retryable?: boolean;
}

// Game Schedule API Types
export interface GameScheduleResponse {
  gameId: string;
  week: number;
  homeTeam: NFLTeam;
  awayTeam: NFLTeam;
  gameDate: string; // ISO date string
  kickoffTime: string; // ISO datetime string
  isPlayoffs: boolean;
  gameType: 'regular' | 'wildcard' | 'divisional' | 'conference' | 'superbowl';
  season: number;
  venue?: {
    name: string;
    city: string;
    state: string;
  };
  weather?: {
    temperature?: number;
    conditions?: string;
    windSpeed?: number;
  };
}

export interface NFLScheduleFilters {
  week?: number;
  season?: number;
  teamId?: string;
  gameType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Board Availability API Types
export interface BoardAvailabilityResponse {
  boardId: string;
  gameId: string;
  tierId: string;
  totalSquaresSold: number;
  availableSquares: number;
  isActive: boolean;
  isCancelled: boolean;
  isLocked: boolean;
  boardState: BoardState;
  createdAt: string;
  lastUpdated: string;
  pricePerSquare: number;
  maxSquaresPerUser: number;
  // VRF and randomization data
  vrfStatus?: {
    isRandomized: boolean;
    randomizationTxHash?: string;
    randomizationTimestamp?: string;
    homeNumbers?: number[];
    awayNumbers?: number[];
  };
  // Threshold tracking for cancellation
  fillPercentage: number;
  cancellationThreshold: number; // Usually 95%
  cancellationDeadline?: string; // ISO datetime
}

export enum BoardState {
  OPEN = 'open',
  FILLING = 'filling',
  THRESHOLD_WARNING = 'threshold_warning', // Near 95% threshold
  LOCKED = 'locked', // Game started or board full
  CANCELLED = 'cancelled', // Under 95% at deadline
  LIVE = 'live', // Game in progress
  COMPLETED = 'completed', // Game finished, payouts distributed
}

// Square Ownership API Types
export interface SquareOwnership {
  squareIndex: number;
  owner: string; // wallet address
  ownerNFT?: string; // NFT identifier or symbol
  purchaseTimestamp: string;
  purchasePrice: number;
  homeNumber?: number; // Assigned after VRF
  awayNumber?: number; // Assigned after VRF
}

export interface BoardSquaresResponse {
  boardId: string;
  squares: SquareOwnership[];
  lastUpdated: string;
  totalSquaresSold: number;
  boardState: BoardState;
}

// Purchase API Types
export interface PurchaseSquareRequest {
  boardId: string;
  squareIndices: number[];
  walletAddress: string;
  totalCost: number;
  userSignature?: string; // For authentication
}

export interface PurchaseSquareResponse {
  success: boolean;
  transactionId: string;
  boardId: string;
  squareIndices: number[];
  totalCost: number;
  purchaseTimestamp: string;
  newBoardState?: BoardState;
  estimatedConfirmationTime?: number; // seconds
}

// Real-time Updates
export interface BoardUpdateEvent {
  type:
    | 'square_purchased'
    | 'board_locked'
    | 'board_cancelled'
    | 'vrf_completed'
    | 'game_started'
    | 'score_update';
  boardId: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface SquarePurchasedEvent {
  squareIndices: number[];
  purchaser: string;
  totalCost: number;
  newAvailableSquares: number;
  fillPercentage: number;
}

export interface VRFCompletedEvent {
  homeNumbers: number[];
  awayNumbers: number[];
  vrfTxHash: string;
  timestamp: string;
}

// User Profile API Types
export interface UserProfile {
  walletAddress: string;
  isVIP: boolean;
  favoriteTeam?: NFLTeam;
  totalSquaresPurchased: number;
  totalWinnings: number;
  joinDate: string;
  lastActiveDate: string;
  preferences: {
    notifications: {
      gameStart: boolean;
      scoreUpdates: boolean;
      winnings: boolean;
      boardFilling: boolean;
    };
    autoRenew: boolean;
    defaultTeam?: string;
  };
}

// Game Status and Scoring API Types
export interface GameStatus {
  gameId: string;
  status:
    | 'scheduled'
    | 'pregame'
    | 'live'
    | 'halftime'
    | 'final'
    | 'postponed'
    | 'cancelled';
  quarter: 1 | 2 | 3 | 4 | 'OT' | 'final';
  timeRemaining?: string; // "12:45" format
  homeScore: number;
  awayScore: number;
  lastUpdated: string;
  homeScoreByQuarter: number[];
  awayScoreByQuarter: number[];
  isOvertimeGame: boolean;
  winningSquares?: {
    quarter: string;
    homeDigit: number;
    awayDigit: number;
    squareIndex: number;
    payout: number;
    winners: Array<{
      walletAddress: string;
      sharePercentage: number;
      payoutAmount: number;
    }>;
  }[];
}

// Error Types
export enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  BOARD_FULL = 'BOARD_FULL',
  BOARD_LOCKED = 'BOARD_LOCKED',
  BOARD_CANCELLED = 'BOARD_CANCELLED',
  SQUARE_ALREADY_OWNED = 'SQUARE_ALREADY_OWNED',
  INVALID_SQUARE_SELECTION = 'INVALID_SQUARE_SELECTION',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VRF_NOT_READY = 'VRF_NOT_READY',
  GAME_ALREADY_STARTED = 'GAME_ALREADY_STARTED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
}

// WebSocket Event Types for Real-time Updates
export interface WebSocketMessage {
  type: string;
  boardId?: string;
  gameId?: string;
  data: any;
  timestamp: string;
}

export interface WebSocketSubscription {
  boardIds?: string[];
  gameIds?: string[];
  userWallet?: string;
  eventTypes?: string[];
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Configuration and Settings
export interface SystemConfiguration {
  boardCancellationThreshold: number; // Percentage (e.g., 95)
  maxSquaresPerUserStandard: number;
  maxSquaresPerUserVIP: number;
  vrfConfirmationBlocks: number;
  gameStartLockMinutes: number; // Minutes before game to lock board
  payoutDelayMinutes: number; // Minutes after quarter end to process payouts
  maintenanceMode: boolean;
  supportedChains: string[];
  minimumBoardFillForLive: number; // Minimum squares needed to go live
}
