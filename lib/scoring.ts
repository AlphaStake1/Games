/**
 * Green Points Scoring System for Season Pass Conferences
 *
 * This module calculates points earned for scoring events during NFL games.
 * Each quarter/OT period has its own point distribution based on hit patterns.
 */

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'OT';
export type Result = 'forward' | 'backward' | '+5f' | '+5b';
export type PlayoffRound = 'WC' | 'DIV' | 'CONF' | 'SB' | null;

/**
 * Calculate Green points earned for a single scoring event.
 *
 * @param quarter - The quarter/period when the score occurred
 * @param resultType - The type of hit pattern matched
 * @param isPlayoff - Whether this is a playoff game
 * @param otNumber - Which OT period (for display purposes, doesn't affect scoring)
 * @param playoffRound - The specific playoff round for multiplier calculation
 * @returns Points earned (with 2 decimal precision to minimize ties)
 */
export function calculateGreenPoints({
  quarter,
  resultType,
  isPlayoff,
  otNumber = 1,
  playoffRound = null,
}: {
  quarter: Quarter;
  resultType: Result;
  isPlayoff: boolean;
  otNumber?: number;
  playoffRound?: PlayoffRound;
}): number {
  /** Baseline points per period */
  const base: Record<Quarter, number> = {
    Q1: 200,
    Q2: 250, // 250-point base award (not a percentage multiplier)
    Q3: 200,
    Q4: 250, // 250-point base award
    OT: 200, // Each OT period is its own 200-point distribution
  };

  /** Category percentage split - determines relative rarity/reward */
  const split: Record<Result, number> = {
    forward: 0.45, // Most common: (Home, Away)
    backward: 0.3, // Second: (Away, Home)
    '+5f': 0.15, // Third: ((H+5)%10, (A+5)%10)
    '+5b': 0.1, // Rarest: ((A+5)%10, (H+5)%10)
  };

  /** Playoff multipliers */
  const bump: Record<Exclude<PlayoffRound, null>, number> = {
    WC: 1.5, // Wild Card
    DIV: 2, // Divisional
    CONF: 3.5, // Conference Championship
    SB: 5, // Super Bowl
  };

  // Core quarter value - OT periods are independent, not cumulative
  const quarterPoints = base[quarter];

  // Base score for this category
  const rawScore = quarterPoints * split[resultType];

  // Apply playoff-round bonus if relevant
  const finalScore =
    isPlayoff && playoffRound ? rawScore * bump[playoffRound] : rawScore;

  // Keep two decimals to minimize ties
  return Number(finalScore.toFixed(2));
}

/**
 * Get human-readable description of a hit pattern
 */
export function getResultDescription(result: Result): string {
  const descriptions: Record<Result, string> = {
    forward: '(Home, Away)',
    backward: '(Away, Home)',
    '+5f': '((H+5) mod 10, (A+5) mod 10)',
    '+5b': '((A+5) mod 10, (H+5) mod 10)',
  };
  return descriptions[result];
}

/**
 * Get example scores for a hit pattern
 */
export function getResultExample(result: Result): string {
  const examples: Record<Result, string> = {
    forward: '(7, 4)',
    backward: '(4, 7)',
    '+5f': '(2, 9)', // 7+5=12%10=2, 4+5=9
    '+5b': '(9, 2)', // 4+5=9, 7+5=12%10=2
  };
  return examples[result];
}

/**
 * Calculate example points for UI display
 */
export function getExamplePoints(
  result: Result,
  quarter: Quarter = 'Q1',
): number {
  return calculateGreenPoints({
    quarter,
    resultType: result,
    isPlayoff: false,
    playoffRound: null,
  });
}
