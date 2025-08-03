import { NFLTeam } from './nflTeams';

export interface PayoutStructure {
  q1Regular: number;
  q2Regular: number;
  q3Regular: number;
  q4Regular: number;
  q1Overtime?: number;
  q2Overtime?: number;
  q3Overtime?: number;
  q4Overtime?: number;
  finalOvertime?: number;
}

export interface BoardTier {
  id: string;
  pricePerSquare: number;
  totalPot: number;
  rake: number;
  playerPool: number;
  payouts: PayoutStructure;
  isVIPOnly: boolean;
  displayName: string;
  description: string;
}

// Based on the CSV data provided
export const BOARD_TIERS: BoardTier[] = [
  {
    id: 'tier-5',
    pricePerSquare: 5,
    totalPot: 500,
    rake: 25,
    playerPool: 475,
    payouts: {
      q1Regular: 71,
      q2Regular: 119,
      q3Regular: 71,
      q4Regular: 214,
      q1Overtime: 71,
      q2Overtime: 119,
      q3Overtime: 71,
      q4Overtime: 107,
      finalOvertime: 107,
    },
    isVIPOnly: false,
    displayName: '$5 Entry',
    description: 'Perfect for beginners - $500 total pot',
  },
  {
    id: 'tier-10',
    pricePerSquare: 10,
    totalPot: 1000,
    rake: 50,
    playerPool: 950,
    payouts: {
      q1Regular: 142,
      q2Regular: 238,
      q3Regular: 142,
      q4Regular: 428,
      q1Overtime: 142,
      q2Overtime: 238,
      q3Overtime: 142,
      q4Overtime: 214,
      finalOvertime: 214,
    },
    isVIPOnly: false,
    displayName: '$10 Entry',
    description: 'Popular choice - $1K total pot',
  },
  {
    id: 'tier-20',
    pricePerSquare: 20,
    totalPot: 2000,
    rake: 100,
    playerPool: 1900,
    payouts: {
      q1Regular: 285,
      q2Regular: 475,
      q3Regular: 285,
      q4Regular: 855,
      q1Overtime: 285,
      q2Overtime: 475,
      q3Overtime: 285,
      q4Overtime: 428,
      finalOvertime: 428,
    },
    isVIPOnly: false,
    displayName: '$20 Entry',
    description: 'Mid-tier action - $2K total pot',
  },
  {
    id: 'tier-50',
    pricePerSquare: 50,
    totalPot: 5000,
    rake: 250,
    playerPool: 4750,
    payouts: {
      q1Regular: 712,
      q2Regular: 1188,
      q3Regular: 712,
      q4Regular: 2138,
      q1Overtime: 712,
      q2Overtime: 1188,
      q3Overtime: 712,
      q4Overtime: 1069,
      finalOvertime: 1069,
    },
    isVIPOnly: false,
    displayName: '$50 Entry',
    description: 'Serious players - $5K total pot',
  },
  {
    id: 'tier-100',
    pricePerSquare: 100,
    totalPot: 10000,
    rake: 800,
    playerPool: 9200,
    payouts: {
      q1Regular: 1380,
      q2Regular: 2300,
      q3Regular: 1380,
      q4Regular: 4140,
      q1Overtime: 1380,
      q2Overtime: 2300,
      q3Overtime: 1380,
      q4Overtime: 2070,
      finalOvertime: 2070,
    },
    isVIPOnly: true,
    displayName: '$100 Entry - VIP Only',
    description: 'High stakes - $10K total pot',
  },
  {
    id: 'tier-250',
    pricePerSquare: 250,
    totalPot: 25000,
    rake: 2000,
    playerPool: 23000,
    payouts: {
      q1Regular: 3450,
      q2Regular: 5750,
      q3Regular: 3450,
      q4Regular: 10350,
      q1Overtime: 3450,
      q2Overtime: 5750,
      q3Overtime: 3450,
      q4Overtime: 5175,
      finalOvertime: 5175,
    },
    isVIPOnly: true,
    displayName: '$250 Entry - VIP Only',
    description: 'Elite tier - $25K total pot',
  },
  {
    id: 'tier-500',
    pricePerSquare: 500,
    totalPot: 50000,
    rake: 4000,
    playerPool: 46000,
    payouts: {
      q1Regular: 6900,
      q2Regular: 11500,
      q3Regular: 6900,
      q4Regular: 20700,
      q1Overtime: 6900,
      q2Overtime: 11500,
      q3Overtime: 6900,
      q4Overtime: 10350,
      finalOvertime: 10350,
    },
    isVIPOnly: true,
    displayName: '$500 Entry - VIP Only',
    description: 'Ultra high stakes - $50K total pot',
  },
  {
    id: 'tier-1000',
    pricePerSquare: 1000,
    totalPot: 100000,
    rake: 8000,
    playerPool: 92000,
    payouts: {
      q1Regular: 13800,
      q2Regular: 23000,
      q3Regular: 13800,
      q4Regular: 41400,
      q1Overtime: 13800,
      q2Overtime: 23000,
      q3Overtime: 13800,
      q4Overtime: 20700,
      finalOvertime: 20700,
    },
    isVIPOnly: true,
    displayName: '$1000 Entry - VIP Only',
    description: 'Whale tier - $100K total pot',
  },
];

export interface GameSchedule {
  gameId: string;
  week: number;
  homeTeam: NFLTeam;
  awayTeam: NFLTeam;
  gameDate: Date;
  isPlayoffs: boolean;
  gameType: 'regular' | 'wildcard' | 'divisional' | 'conference' | 'superbowl';
}

export interface BoardConfiguration {
  boardId: string;
  gameId: string;
  tier: BoardTier;
  game: GameSchedule;
  maxSquaresPerUser: number;
  availableSquares: number;
  totalSquaresSold: number;
  isActive: boolean;
  createdAt: Date;
  gameStartTime: Date;
}

export interface SquareSelection {
  boardId: string;
  squareIndices: number[];
  totalCost: number;
  potentialPayouts: PayoutStructure;
  selectionTimestamp: number;
}

export interface UserBoardPreferences {
  walletAddress: string;
  favoriteTeam: NFLTeam;
  isVIP: boolean;
  selectedBoards: string[];
  activeSelections: SquareSelection[];
  lastUpdated: number;
}

// Utility functions
export const getBoardTierById = (id: string): BoardTier | undefined => {
  return BOARD_TIERS.find((tier) => tier.id === id);
};

export const getAvailableTiers = (isVIP: boolean): BoardTier[] => {
  return BOARD_TIERS.filter((tier) => !tier.isVIPOnly || isVIP);
};

export const calculateSquareSelectionCost = (
  tier: BoardTier,
  squareCount: number,
): number => {
  return tier.pricePerSquare * squareCount;
};

export const getMaxSquaresForUser = (isVIP: boolean): number => {
  return isVIP ? 100 : 5; // VIP gets unlimited (100 is practical max), non-VIP gets 5
};
