export interface BoardReleaseConfig {
  vipThreshold: number;
  fillThresholds: {
    showCountdown: number;
    allowNextFunding: number;
    targetFill: number;
  };
  releaseStrategy: {
    primetime: string[];
    sundayPriority: {
      lateAfternoon: GamePriority[];
      earlyGames: GamePriority[];
    };
    specialEvents: SpecialEvent[];
  };
  phaseThresholds: PhaseConfig[];
}

interface GamePriority {
  matchup: string;
  priority: number;
  flags: ('divisional' | 'rivalry' | 'nationalTV' | 'playoff')[];
}

interface SpecialEvent {
  name: string;
  weeks: number[];
  releaseStrategy: 'immediate' | 'primetime' | 'tiered';
}

interface PhaseConfig {
  playerCount: { min: number; max: number };
  strategy: 'single' | 'primetime_cascade' | 'paired_release' | 'full_schedule';
  description: string;
}

export const BOARD_RELEASE_CONFIG: BoardReleaseConfig = {
  vipThreshold: 100, // $100 per square

  fillThresholds: {
    showCountdown: 90, // Show next game countdown at 90%
    allowNextFunding: 95, // Allow funding next board at 95%
    targetFill: 100, // Target 100% to avoid house covering
  },

  releaseStrategy: {
    primetime: [
      'MNF', // Monday Night Football - Release 5 min after game ends
      'SNF', // Sunday Night Football - After MNF fills
      'TNF', // Thursday Night Football - After SNF fills
    ],

    sundayPriority: {
      lateAfternoon: [
        // NFC East Divisional (Highest Priority)
        {
          matchup: 'DAL-PHI',
          priority: 1,
          flags: ['divisional', 'rivalry', 'nationalTV'],
        },
        { matchup: 'DAL-WAS', priority: 1, flags: ['divisional', 'rivalry'] },
        { matchup: 'DAL-NYG', priority: 1, flags: ['divisional', 'rivalry'] },
        { matchup: 'PHI-WAS', priority: 1, flags: ['divisional'] },
        { matchup: 'PHI-NYG', priority: 1, flags: ['divisional'] },
        { matchup: 'WAS-NYG', priority: 1, flags: ['divisional'] },

        // AFC West Divisional
        { matchup: 'KC-LV', priority: 2, flags: ['divisional', 'rivalry'] },
        { matchup: 'KC-LAC', priority: 2, flags: ['divisional', 'rivalry'] },
        { matchup: 'KC-DEN', priority: 2, flags: ['divisional'] },
        { matchup: 'LV-LAC', priority: 2, flags: ['divisional', 'rivalry'] },
        { matchup: 'LV-DEN', priority: 2, flags: ['divisional'] },
        { matchup: 'LAC-DEN', priority: 2, flags: ['divisional'] },

        // NFC North Classic Rivalries
        {
          matchup: 'GB-CHI',
          priority: 3,
          flags: ['divisional', 'rivalry', 'nationalTV'],
        },
        { matchup: 'GB-MIN', priority: 3, flags: ['divisional', 'rivalry'] },
        { matchup: 'GB-DET', priority: 3, flags: ['divisional'] },
        { matchup: 'CHI-MIN', priority: 3, flags: ['divisional'] },
        { matchup: 'CHI-DET', priority: 3, flags: ['divisional'] },
        { matchup: 'MIN-DET', priority: 3, flags: ['divisional'] },

        // AFC North Blood Feuds
        {
          matchup: 'PIT-BAL',
          priority: 4,
          flags: ['divisional', 'rivalry', 'nationalTV'],
        },
        { matchup: 'PIT-CLE', priority: 4, flags: ['divisional', 'rivalry'] },
        { matchup: 'PIT-CIN', priority: 4, flags: ['divisional', 'rivalry'] },
        { matchup: 'BAL-CLE', priority: 4, flags: ['divisional'] },
        { matchup: 'BAL-CIN', priority: 4, flags: ['divisional'] },
        { matchup: 'CLE-CIN', priority: 4, flags: ['divisional', 'rivalry'] },

        // NFC West
        { matchup: 'SF-SEA', priority: 5, flags: ['divisional', 'rivalry'] },
        { matchup: 'SF-LAR', priority: 5, flags: ['divisional', 'rivalry'] },
        { matchup: 'SF-ARI', priority: 5, flags: ['divisional'] },
        { matchup: 'SEA-LAR', priority: 5, flags: ['divisional'] },
        { matchup: 'SEA-ARI', priority: 5, flags: ['divisional'] },
        { matchup: 'LAR-ARI', priority: 5, flags: ['divisional'] },

        // AFC East
        { matchup: 'BUF-MIA', priority: 6, flags: ['divisional', 'rivalry'] },
        { matchup: 'BUF-NE', priority: 6, flags: ['divisional', 'rivalry'] },
        { matchup: 'BUF-NYJ', priority: 6, flags: ['divisional'] },
        { matchup: 'MIA-NE', priority: 6, flags: ['divisional'] },
        { matchup: 'MIA-NYJ', priority: 6, flags: ['divisional'] },
        { matchup: 'NE-NYJ', priority: 6, flags: ['divisional', 'rivalry'] },
      ],

      earlyGames: [
        // AFC North (if not in late slot)
        { matchup: 'CIN-CLE', priority: 1, flags: ['divisional', 'rivalry'] },
        { matchup: 'CIN-BAL', priority: 1, flags: ['divisional'] },

        // NFC South Divisional
        { matchup: 'NO-ATL', priority: 2, flags: ['divisional', 'rivalry'] },
        { matchup: 'NO-TB', priority: 2, flags: ['divisional', 'rivalry'] },
        { matchup: 'NO-CAR', priority: 2, flags: ['divisional'] },
        { matchup: 'ATL-TB', priority: 2, flags: ['divisional'] },
        { matchup: 'ATL-CAR', priority: 2, flags: ['divisional', 'rivalry'] },
        { matchup: 'TB-CAR', priority: 2, flags: ['divisional'] },

        // AFC South
        { matchup: 'HOU-IND', priority: 3, flags: ['divisional', 'rivalry'] },
        { matchup: 'HOU-TEN', priority: 3, flags: ['divisional', 'rivalry'] },
        { matchup: 'HOU-JAX', priority: 3, flags: ['divisional'] },
        { matchup: 'IND-TEN', priority: 3, flags: ['divisional', 'rivalry'] },
        { matchup: 'IND-JAX', priority: 3, flags: ['divisional'] },
        { matchup: 'TEN-JAX', priority: 3, flags: ['divisional'] },

        // Cross-Conference Marquee
        { matchup: 'DAL-NE', priority: 4, flags: ['rivalry', 'nationalTV'] },
        { matchup: 'GB-KC', priority: 4, flags: ['nationalTV'] },
        { matchup: 'SF-BUF', priority: 4, flags: ['nationalTV'] },
        { matchup: 'PHI-BUF', priority: 4, flags: ['nationalTV'] },
      ],
    },

    specialEvents: [
      {
        name: 'Thanksgiving',
        weeks: [12], // Week 12 typically
        releaseStrategy: 'immediate', // All 3 games release immediately after MNF
      },
      {
        name: 'Christmas',
        weeks: [16, 17], // Can vary
        releaseStrategy: 'primetime', // Treat as primetime regardless of slot
      },
      {
        name: 'Week18',
        weeks: [18],
        releaseStrategy: 'tiered', // Playoff implications first
      },
      {
        name: 'Playoffs',
        weeks: [19, 20, 21, 22], // Wild Card through Championship
        releaseStrategy: 'immediate', // No restrictions
      },
      {
        name: 'SuperBowl',
        weeks: [23],
        releaseStrategy: 'immediate', // Immediate release, no restrictions
      },
    ],
  },

  phaseThresholds: [
    {
      playerCount: { min: 0, max: 50 },
      strategy: 'single',
      description: 'Single game release only - concentrate liquidity',
    },
    {
      playerCount: { min: 50, max: 150 },
      strategy: 'primetime_cascade',
      description: 'Primetime cascade (MNF→SNF→TNF)',
    },
    {
      playerCount: { min: 150, max: 500 },
      strategy: 'paired_release',
      description: 'Add 2-game afternoon batches',
    },
    {
      playerCount: { min: 500, max: Infinity },
      strategy: 'full_schedule',
      description: 'Full schedule with VIP-only restrictions',
    },
  ],
};

// Helper function to determine current phase
export function getCurrentPhase(activePlayerCount: number): PhaseConfig {
  return (
    BOARD_RELEASE_CONFIG.phaseThresholds.find(
      (phase) =>
        activePlayerCount >= phase.playerCount.min &&
        activePlayerCount < phase.playerCount.max,
    ) || BOARD_RELEASE_CONFIG.phaseThresholds[0]
  );
}

// Helper to check if game should be released
export function shouldReleaseGame(
  game: string,
  currentFillPercent: number,
  phase: PhaseConfig,
  isVIP: boolean,
): boolean {
  // Check fill thresholds
  if (
    currentFillPercent < BOARD_RELEASE_CONFIG.fillThresholds.allowNextFunding
  ) {
    return false;
  }

  // Apply phase-specific logic
  switch (phase.strategy) {
    case 'single':
      return false; // Only one game at a time
    case 'primetime_cascade':
      return BOARD_RELEASE_CONFIG.releaseStrategy.primetime.includes(game);
    case 'paired_release':
    case 'full_schedule':
      return isVIP || phase.strategy === 'full_schedule';
    default:
      return false;
  }
}

// Get next games to release based on priority
export function getNextReleaseBatch(
  completedGames: string[],
  timeSlot: 'primetime' | 'lateAfternoon' | 'early',
  week: number,
): string[] {
  // Check for special events first
  const specialEvent = BOARD_RELEASE_CONFIG.releaseStrategy.specialEvents.find(
    (event) => event.weeks.includes(week),
  );

  if (specialEvent?.releaseStrategy === 'immediate') {
    return ['ALL_GAMES']; // Release all games for this week
  }

  // Standard release logic
  if (timeSlot === 'primetime') {
    const primetimeGames = BOARD_RELEASE_CONFIG.releaseStrategy.primetime;
    return primetimeGames
      .filter((game) => !completedGames.includes(game))
      .slice(0, 1);
  }

  // For Sunday games, return NFC/AFC pair
  const priorities =
    timeSlot === 'lateAfternoon'
      ? BOARD_RELEASE_CONFIG.releaseStrategy.sundayPriority.lateAfternoon
      : BOARD_RELEASE_CONFIG.releaseStrategy.sundayPriority.earlyGames;

  const availableGames = priorities
    .filter(
      (game) =>
        !completedGames.some(
          (completed) =>
            game.matchup.includes(completed) ||
            completed.includes(game.matchup),
        ),
    )
    .sort((a, b) => a.priority - b.priority);

  // Return one NFC and one AFC game
  const nfcGame = availableGames.find((game) =>
    [
      'DAL',
      'PHI',
      'WAS',
      'NYG',
      'GB',
      'CHI',
      'MIN',
      'DET',
      'SF',
      'SEA',
      'LAR',
      'ARI',
      'NO',
      'ATL',
      'TB',
      'CAR',
    ].some((team) => game.matchup.includes(team)),
  );

  const afcGame = availableGames.find((game) =>
    [
      'KC',
      'LV',
      'LAC',
      'DEN',
      'PIT',
      'BAL',
      'CLE',
      'CIN',
      'BUF',
      'MIA',
      'NE',
      'NYJ',
      'HOU',
      'IND',
      'TEN',
      'JAX',
    ].some((team) => game.matchup.includes(team)),
  );

  return [nfcGame?.matchup, afcGame?.matchup].filter(Boolean);
}
