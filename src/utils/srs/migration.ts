import { KanaReviewState, UserProgress } from '../../types';
import { SRSStateV2, UserProgressV2 } from './types';

/**
 * Maps legacy 6-stage reviewLevels (0 to 5) to initial stability in days:
 * Level 0: 10 minutes = 10 / (24 * 60) ≈ 0.00694 days
 * Level 1: 1 day
 * Level 2: 3 days
 * Level 3: 7 days
 * Level 4: 14 days
 * Level 5: 30 days
 */
export const LEGACY_LEVEL_STABILITY_DAYS: Record<number, number> = {
  0: 10 / (24 * 60),
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

function parseDateToMs(
  dateStr: string | null | undefined,
  fallback: number | null
): number | null {
  if (!dateStr || typeof dateStr !== 'string') return fallback;
  const parsed = new Date(dateStr).getTime();
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Migrates a single legacy KanaReviewState (v1) into SRSStateV2.
 * Pure function: Does not mutate legacy input.
 */
export function migrateReviewState(
  legacy: KanaReviewState,
  now: number = Date.now()
): SRSStateV2 {
  const kanaId = legacy?.kanaId || 'unknown';

  const rawLevel = typeof legacy?.reviewLevel === 'number' ? legacy.reviewLevel : 0;
  const clampedLevel = Math.max(0, Math.min(5, Math.floor(rawLevel)));
  const stability = LEGACY_LEVEL_STABILITY_DAYS[clampedLevel] ?? LEGACY_LEVEL_STABILITY_DAYS[0];

  const correctCount = Math.max(0, Math.floor(legacy?.correctCount || 0));
  const wrongCount = Math.max(0, Math.floor(legacy?.wrongCount || 0));

  const reps = correctCount + wrongCount;
  const lapses = wrongCount;

  // v1 has no difficulty history.
  // Use neutral difficulty (5 on a 1-10 scale) during migration.
  const difficulty = 5;

  // v1 has no consecutive correct history.
  // Must be initialized to 0 rather than inferred from total correctCount.
  const consecutiveCorrect = 0;

  const due = parseDateToMs(legacy?.nextReviewAt, now) ?? now;
  const lastReview = parseDateToMs(legacy?.lastReviewedAt, null);

  return {
    version: 2,
    kanaId,
    due,
    lastReview,
    stability,
    difficulty,
    reps,
    lapses,
    consecutiveCorrect,
  };
}

/**
 * Migrates legacy UserProgress (v1) into UserProgressV2.
 * Pure function: Does not mutate legacy input.
 */
export function migrateUserProgress(
  v1: UserProgress,
  now: number = Date.now()
): UserProgressV2 {
  const srsStates: Record<string, SRSStateV2> = {};

  if (v1 && v1.reviewStates && typeof v1.reviewStates === 'object') {
    for (const [id, state] of Object.entries(v1.reviewStates)) {
      if (!id || !state) continue;
      srsStates[id] = migrateReviewState(state, now);
    }
  }

  return {
    schemaVersion: 2,
    masteredKanaIds: Array.isArray(v1?.masteredKanaIds) ? [...v1.masteredKanaIds] : [],
    wrongKanaIds: Array.isArray(v1?.wrongKanaIds) ? [...v1.wrongKanaIds] : [],
    streakDays: typeof v1?.streakDays === 'number' && v1.streakDays >= 1 ? v1.streakDays : 1,
    lastStudyDate: v1?.lastStudyDate || new Date(now).toISOString().split('T')[0],
    srsStates,
    reviewStates: v1?.reviewStates ? { ...v1.reviewStates } : {},
  };
}
