// lib/memory/scopes.ts
/**
 * Memory scope definitions for Football Squares ElizaOS integration
 * Based on ChatGPT-o3 refinements for clear access control and TTL policies
 */

export const MEMORY_SCOPES = {
  PUBLIC_GAME: 'public_game', // Scores, quarter winners, public game data
  BOARD_STATE: 'board_state', // 10x10 grid, square ownership, game-specific data
  USER_CHAT: 'user_chat', // Coach B ↔ player conversations
  TX_FINANCE: 'tx_finance', // Wallet addresses, USDC payouts, gas metadata
  SYS_INTERNAL: 'sys_internal', // Agent reasoning, VRF logs, chain of thought
} as const;

export type MemoryScope = (typeof MEMORY_SCOPES)[keyof typeof MEMORY_SCOPES];

/**
 * TTL policies for each memory scope (in days)
 */
export const MEMORY_TTL = {
  [MEMORY_SCOPES.PUBLIC_GAME]: 365, // 1 year - public game history
  [MEMORY_SCOPES.BOARD_STATE]: 395, // Season + 30 days buffer
  [MEMORY_SCOPES.USER_CHAT]: 365, // 1 year - user interaction history
  [MEMORY_SCOPES.TX_FINANCE]: 2555, // 7 years - financial compliance
  [MEMORY_SCOPES.SYS_INTERNAL]: 90, // 90 days - system logs
} as const;

/**
 * Agent access permissions for each memory scope
 */
export const SCOPE_ACCESS = {
  [MEMORY_SCOPES.PUBLIC_GAME]: [
    'Coach_B',
    'Coach_Right',
    'Patel_Marketing',
    'Morgan_Business',
    'Calculator',
  ],
  [MEMORY_SCOPES.BOARD_STATE]: [
    'Jerry_Orchestrator',
    'Oracle_Agent',
    'Randomizer_Agent',
    'Trainer_Reviva',
    'Calculator',
  ],
  [MEMORY_SCOPES.USER_CHAT]: ['Coach_B', 'Trainer_Reviva'],
  [MEMORY_SCOPES.TX_FINANCE]: [
    'Jerry_Orchestrator',
    'Settlement_Agent',
    'Dean_Security',
    'Email_Agent',
  ],
  [MEMORY_SCOPES.SYS_INTERNAL]: [
    'Jerry_Orchestrator',
    'Dean_Security',
    'Patel_Marketing',
    'Morgan_Business',
  ],
} as const;

/**
 * Memory entry interface with scope and metadata
 */
export interface ScopedMemoryEntry {
  id: string;
  scope: MemoryScope;
  content: string;
  embedding?: number[];
  metadata: {
    gameId?: string;
    userId?: string;
    agentId: string;
    timestamp: Date;
    [key: string]: any;
  };
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Check if an agent has access to a specific memory scope
 */
export function hasMemoryAccess(agentId: string, scope: MemoryScope): boolean {
  const allowedAgents = SCOPE_ACCESS[scope] as readonly string[];
  return allowedAgents.includes(agentId);
}

/**
 * Calculate expiration date based on scope TTL
 */
export function calculateExpiration(scope: MemoryScope): Date {
  const ttlDays = MEMORY_TTL[scope];
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + ttlDays);
  return expirationDate;
}

/**
 * Validate memory entry before storage
 */
export function validateMemoryEntry(
  entry: Partial<ScopedMemoryEntry>,
): boolean {
  if (!entry.scope || !Object.values(MEMORY_SCOPES).includes(entry.scope)) {
    return false;
  }

  if (!entry.content || !entry.metadata?.agentId) {
    return false;
  }

  if (!hasMemoryAccess(entry.metadata.agentId, entry.scope)) {
    return false;
  }

  return true;
}

/**
 * Create a new scoped memory entry
 */
export function createScopedMemoryEntry(
  scope: MemoryScope,
  content: string,
  agentId: string,
  metadata: Record<string, any> = {},
): ScopedMemoryEntry {
  const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();

  return {
    id,
    scope,
    content,
    metadata: {
      ...metadata,
      agentId,
      timestamp: now,
    },
    createdAt: now,
    expiresAt: calculateExpiration(scope),
  };
}
