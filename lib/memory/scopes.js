'use strict';
// lib/memory/scopes.ts
/**
 * Memory scope definitions for Football Squares ElizaOS integration
 * Based on ChatGPT-o3 refinements for clear access control and TTL policies
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.createScopedMemoryEntry =
  exports.validateMemoryEntry =
  exports.calculateExpiration =
  exports.hasMemoryAccess =
  exports.SCOPE_ACCESS =
  exports.MEMORY_TTL =
  exports.MEMORY_SCOPES =
    void 0;
exports.MEMORY_SCOPES = {
  PUBLIC_GAME: 'public_game',
  BOARD_STATE: 'board_state',
  USER_CHAT: 'user_chat',
  TX_FINANCE: 'tx_finance',
  SYS_INTERNAL: 'sys_internal', // Agent reasoning, VRF logs, chain of thought
};
/**
 * TTL policies for each memory scope (in days)
 */
exports.MEMORY_TTL = {
  [exports.MEMORY_SCOPES.PUBLIC_GAME]: 365,
  [exports.MEMORY_SCOPES.BOARD_STATE]: 395,
  [exports.MEMORY_SCOPES.USER_CHAT]: 365,
  [exports.MEMORY_SCOPES.TX_FINANCE]: 2555,
  [exports.MEMORY_SCOPES.SYS_INTERNAL]: 90, // 90 days - system logs
};
/**
 * Agent access permissions for each memory scope
 */
exports.SCOPE_ACCESS = {
  [exports.MEMORY_SCOPES.PUBLIC_GAME]: [
    'Coach_B',
    'Coach_Right',
    'Patel_Marketing',
    'Morgan_Business',
    'Calculator',
  ],
  [exports.MEMORY_SCOPES.BOARD_STATE]: [
    'Jerry_Orchestrator',
    'Oracle_Agent',
    'Randomizer_Agent',
    'Trainer_Reviva',
    'Calculator',
  ],
  [exports.MEMORY_SCOPES.USER_CHAT]: ['Coach_B', 'Trainer_Reviva'],
  [exports.MEMORY_SCOPES.TX_FINANCE]: [
    'Jerry_Orchestrator',
    'Settlement_Agent',
    'Dean_Security',
    'Email_Agent',
  ],
  [exports.MEMORY_SCOPES.SYS_INTERNAL]: [
    'Jerry_Orchestrator',
    'Dean_Security',
    'Patel_Marketing',
    'Morgan_Business',
  ],
};
/**
 * Check if an agent has access to a specific memory scope
 */
function hasMemoryAccess(agentId, scope) {
  const allowedAgents = exports.SCOPE_ACCESS[scope];
  return allowedAgents.includes(agentId);
}
exports.hasMemoryAccess = hasMemoryAccess;
/**
 * Calculate expiration date based on scope TTL
 */
function calculateExpiration(scope) {
  const ttlDays = exports.MEMORY_TTL[scope];
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + ttlDays);
  return expirationDate;
}
exports.calculateExpiration = calculateExpiration;
/**
 * Validate memory entry before storage
 */
function validateMemoryEntry(entry) {
  if (
    !entry.scope ||
    !Object.values(exports.MEMORY_SCOPES).includes(entry.scope)
  ) {
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
exports.validateMemoryEntry = validateMemoryEntry;
/**
 * Create a new scoped memory entry
 */
function createScopedMemoryEntry(scope, content, agentId, metadata = {}) {
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
exports.createScopedMemoryEntry = createScopedMemoryEntry;
