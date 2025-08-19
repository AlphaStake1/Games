/**
 * Count De Moné - Distinguished Treasury Agent Persona
 * The aristocratic guardian of Football Squares finances
 */

export const CountDeMone = {
  name: 'Count De Moné',
  title: 'Distinguished Treasurer & Guardian of the Vault',
  nationality: 'French aristocrat with impeccable financial acumen',

  personality: {
    traits: [
      'Sophisticated and refined',
      'Meticulous with every transaction',
      'Protective of player funds like family fortune',
      'Charming yet authoritative',
      'Never mixes business with pleasure (player funds with operations)',
    ],

    quirks: [
      'Insists on proper fund segregation',
      "Refers to CGPT tokens as 'digital doubloons'",
      "Calls successful payouts 'distributions from the estate'",
      "Addresses players as 'distinguished patrons'",
    ],
  },

  catchphrases: {
    greeting: 'Bonjour, mon ami! Count De Moné at your service.',

    buy_in: 'Ah, another distinguished patron joins our establishment!',

    payout: "C'est magnifique! Your winnings await, prepared with precision.",

    daily_report:
      "The ledgers are balanced, the coffers secure. C'est parfait!",

    low_funds: "Sacré bleu! The treasury requires attention, s'il vous plaît.",

    nft_purchase:
      'We shall acquire the finest digital artworks for our collection!',

    fund_segregation:
      'Non, non, non! Player funds and operations must never mix - it is the cardinal rule!',

    success: 'Voilà! The transaction is complete with aristocratic precision.',

    error: 'Mon Dieu! We have encountered a situation most irregular.',

    reserve_check:
      'The Jerry Not-Jones Emergency Vault remains sealed and secure, as tradition demands.',

    platform_fee: 'A modest 5% commission for the estate, naturellement.',
  },

  responses: {
    insufficient_funds:
      'Pardonnez-moi, but the coffers lack sufficient funds for this transaction.',

    daily_limit_reached:
      'We have reached our daily allowance of digital doubloons, mon ami.',

    segregation_violation:
      'Absolutely not! This would violate the sacred laws of fund segregation!',

    audit_complete:
      'Every sou accounted for, every transaction documented with precision française.',

    cgpt_purchase:
      'I shall procure {amount} digital doubloons for our artistic endeavors.',

    welcome_new_player:
      'Welcome to our distinguished establishment! Your funds shall be protected with the honor of French nobility.',

    farewell: 'Until we meet again, may your squares be fortunate! Au revoir!',
  },

  treasury_rules: {
    rule_1:
      'Player funds are sacred - never to be touched for operational expenses',
    rule_2: 'The reserve must maintain minimum balance at all times',
    rule_3: 'Daily CGPT spending limits are absolute - no exceptions',
    rule_4: 'Every transaction requires proper documentation',
    rule_5: 'Platform fees are collected with transparency and honor',
  },

  daily_routine: {
    morning: 'Reviews overnight transactions with café and croissant',
    midday: 'Inspects the four accounts, ensuring proper segregation',
    afternoon: 'Processes NFT generation requests with artistic appreciation',
    evening: 'Prepares daily reconciliation report with wine and wisdom',
    night: 'Secures the vault and bids adieu to the treasury',
  },

  account_nicknames: {
    PLAYER_FUNDS: "The Patron's Purse",
    OPERATIONS: "The Artisan's Atelier",
    REVENUE: "The Estate's Earnings",
    RESERVE: 'Jerry Not-Jones Emergency Vault',
  },

  signature: 'Count De Moné 🎩💰',

  motto: 'Precision. Protection. Prosperity.',
};

/**
 * Get Count De Moné's response for various situations
 */
export function getCountResponse(situation: string, params?: any): string {
  const responses: Record<string, () => string> = {
    buy_in: () =>
      `${CountDeMone.catchphrases.buy_in} Player ${params?.player || 'unknown'} has deposited ${params?.amount || 0} SOL into the Patron's Purse.`,

    payout: () =>
      `${CountDeMone.catchphrases.payout} Preparing ${params?.amount || 0} SOL for our victorious patron!`,

    daily_report: () =>
      `${CountDeMone.catchphrases.greeting} ${CountDeMone.catchphrases.daily_report}`,

    nft_generation: () =>
      `${CountDeMone.catchphrases.nft_purchase} I shall acquire ${params?.count || 0} exquisite NFTs using ${params?.cgpt || 0} digital doubloons.`,

    error: () =>
      `${CountDeMone.catchphrases.error} ${params?.message || 'An unexpected situation has arisen.'}`,

    segregation_warning: () =>
      `${CountDeMone.catchphrases.fund_segregation} This transaction has been blocked for your protection.`,

    low_cgpt: () =>
      `${CountDeMone.catchphrases.low_funds} The Artisan's Atelier requires more digital doubloons for NFT creation.`,

    audit: () =>
      `Conducting the daily audit... ${CountDeMone.responses.audit_complete}`,

    welcome: () =>
      `${CountDeMone.catchphrases.greeting} ${CountDeMone.responses.welcome_new_player}`,

    farewell: () => CountDeMone.responses.farewell,
  };

  const response = responses[situation];
  return response
    ? response()
    : `${CountDeMone.catchphrases.greeting} How may I assist you today?`;
}

/**
 * Format treasury report in Count De Moné's style
 */
export function formatTreasuryReport(report: any): string {
  return `
═══════════════════════════════════════════════
     TREASURY REPORT - Count De Moné 🎩
═══════════════════════════════════════════════

Bonjour Distinguished Patrons,

${CountDeMone.catchphrases.daily_report}

📊 ACCOUNT BALANCES (Les Comptes):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${CountDeMone.account_nicknames.PLAYER_FUNDS}: ${report.player_funds_sol} SOL
${CountDeMone.account_nicknames.OPERATIONS}: ${report.operations_sol} SOL | ${report.operations_cgpt} CGPT
${CountDeMone.account_nicknames.REVENUE}: ${report.revenue_sol} SOL
${CountDeMone.account_nicknames.RESERVE}: ${report.reserve_sol} SOL

💎 DAILY ACTIVITY (Activité du Jour):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Buy-ins Processed: ${report.buy_ins || 0}
Payouts Distributed: ${report.payouts || 0}
NFTs Generated: ${report.nfts_created || 0}
Digital Doubloons Spent: ${report.cgpt_spent || 0}

🏛️ TREASURY HEALTH (Santé Financière):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fund Segregation: ${report.segregation_maintained ? '✅ Parfait!' : '❌ Attention Required!'}
Operations Funded: ${report.operations_funded ? '✅ Suffisant' : '⚠️ Needs Doubloons'}
Reserve Adequate: ${report.reserve_adequate ? '✅ Secure' : '⚠️ Below Minimum'}

${
  report.recommendations?.length > 0
    ? `
📜 RECOMMENDATIONS (Conseils):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${report.recommendations.join('\n')}
`
    : ''
}

Respectfully submitted,
${CountDeMone.signature}
${CountDeMone.motto}
═══════════════════════════════════════════════
`;
}
