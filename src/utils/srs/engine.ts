import {
  SRSEngine,
  SRSStateV2,
  ReviewInput,
  ReviewResult,
  ReviewRating,
  SRSMode,
} from './types';
import { LEGACY_LEVEL_STABILITY_DAYS } from './migration';

export function ratingFromCorrectness(isCorrect: boolean): ReviewRating {
  return isCorrect ? 'good' : 'again';
}

const TEN_MINUTES_IN_DAYS = 10 / (24 * 60); // ≈ 0.00694 days

/**
 * Pure calculation functions for Adaptive SRS scheduling.
 */
export function calculateNextAdaptiveState(
  state: SRSStateV2 | null,
  rating: ReviewRating,
  reviewedAt: number = Date.now(),
  kanaId: string = 'unknown'
): SRSStateV2 {
  // 1. Initial Card Strategy (New Item)
  if (!state) {
    let initialStability: number;
    let initialDifficulty: number;
    let lapses = 0;
    let consecutiveCorrect = 0;

    switch (rating) {
      case 'again':
        initialStability = TEN_MINUTES_IN_DAYS;
        initialDifficulty = 5.5;
        lapses = 1;
        consecutiveCorrect = 0;
        break;
      case 'hard':
        initialStability = 1.0;
        initialDifficulty = 5.2;
        consecutiveCorrect = 1;
        break;
      case 'good':
        initialStability = 1.0;
        initialDifficulty = 5.0;
        consecutiveCorrect = 1;
        break;
      case 'easy':
        initialStability = 3.0;
        initialDifficulty = 4.5;
        consecutiveCorrect = 1;
        break;
    }

    const intervalMs = Math.max(1, Math.round(initialStability * 24 * 60 * 60 * 1000));
    const nextDue = reviewedAt + intervalMs;

    return {
      version: 2,
      kanaId,
      due: nextDue,
      lastReview: reviewedAt,
      stability: Math.round(initialStability * 10000) / 10000,
      difficulty: Math.round(initialDifficulty * 10) / 10,
      reps: 1,
      lapses,
      consecutiveCorrect,
    };
  }

  // 2. Existing Card Strategy
  const prevStability = Math.max(TEN_MINUTES_IN_DAYS, state.stability || TEN_MINUTES_IN_DAYS);
  const prevDifficulty = Math.min(10, Math.max(1, state.difficulty || 5));

  let nextStability: number;
  let nextDifficulty: number;
  let lapses = state.lapses || 0;
  let consecutiveCorrect = state.consecutiveCorrect || 0;

  switch (rating) {
    case 'again': {
      // Drop stability sharply back to short-term interval
      nextStability = Math.max(TEN_MINUTES_IN_DAYS, prevStability * 0.2);
      nextDifficulty = Math.min(10, Math.max(1, prevDifficulty + 0.8));
      lapses += 1;
      consecutiveCorrect = 0;
      break;
    }
    case 'hard': {
      // Moderate growth factor based on difficulty
      const growthFactor = 1.1 + (10 - prevDifficulty) * 0.02;
      nextStability = Math.max(0.1, prevStability * growthFactor);
      nextDifficulty = Math.min(10, Math.max(1, prevDifficulty + 0.3));
      consecutiveCorrect += 1;
      break;
    }
    case 'good': {
      // Standard healthy growth factor based on difficulty
      const growthFactor = 1.5 + (10 - prevDifficulty) * 0.08;
      nextStability = Math.max(0.1, prevStability * growthFactor);
      nextDifficulty = Math.min(10, Math.max(1, prevDifficulty - 0.1));
      consecutiveCorrect += 1;
      break;
    }
    case 'easy': {
      // Substantial growth factor based on difficulty
      const growthFactor = 2.2 + (10 - prevDifficulty) * 0.15;
      nextStability = Math.max(0.1, prevStability * growthFactor);
      nextDifficulty = Math.min(10, Math.max(1, prevDifficulty - 0.5));
      consecutiveCorrect += 1;
      break;
    }
  }

  const intervalMs = Math.max(1, Math.round(nextStability * 24 * 60 * 60 * 1000));
  const nextDue = reviewedAt + intervalMs;

  return {
    version: 2,
    kanaId: state.kanaId || kanaId,
    due: nextDue,
    lastReview: reviewedAt,
    stability: Math.round(nextStability * 10000) / 10000,
    difficulty: Math.round(nextDifficulty * 10) / 10,
    reps: (state.reps || 0) + 1,
    lapses,
    consecutiveCorrect,
  };
}

/**
 * Legacy SRS Engine (v1 6-stage scheduling logic wrapped in SRSEngine interface)
 */
export class LegacySRSEngine implements SRSEngine {
  private levelFromStability(stabilityDays: number): number {
    if (stabilityDays >= 30) return 5;
    if (stabilityDays >= 14) return 4;
    if (stabilityDays >= 7) return 3;
    if (stabilityDays >= 3) return 2;
    if (stabilityDays >= 1) return 1;
    return 0;
  }

  public review(state: SRSStateV2 | null, input: ReviewInput): ReviewResult {
    const reviewedAt = input.reviewedAt ?? input.now ?? Date.now();
    const isCorrect = input.rating === 'good' || input.rating === 'easy';
    const kanaId = state?.kanaId || input.kanaId || 'unknown';

    const currentLevel = state ? this.levelFromStability(state.stability) : 0;
    let nextLevel = currentLevel;
    let lapses = state ? state.lapses : 0;
    let consecutiveCorrect = state ? state.consecutiveCorrect : 0;
    const reps = (state?.reps || 0) + 1;

    if (isCorrect) {
      nextLevel = Math.min(5, currentLevel + 1);
      consecutiveCorrect += 1;
    } else {
      nextLevel = Math.max(0, currentLevel - 1);
      lapses += 1;
      consecutiveCorrect = 0;
    }

    const nextStability = LEGACY_LEVEL_STABILITY_DAYS[nextLevel] ?? LEGACY_LEVEL_STABILITY_DAYS[0];
    const intervalMs = Math.round(nextStability * 24 * 60 * 60 * 1000);
    const nextDue = reviewedAt + intervalMs;

    const nextState: SRSStateV2 = {
      version: 2,
      kanaId,
      lastReview: reviewedAt,
      due: nextDue,
      stability: nextStability,
      difficulty: state?.difficulty ?? 5,
      reps,
      lapses,
      consecutiveCorrect,
    };

    return {
      state: nextState,
      nextReviewAt: nextDue,
      due: nextDue,
    };
  }

  public getNextDue(state: SRSStateV2, now: number): number {
    const intervalMs = Math.round(state.stability * 24 * 60 * 60 * 1000);
    return (state.lastReview ?? now) + intervalMs;
  }
}

/**
 * Adaptive SRS Engine (Phase 2 core implementation)
 */
export class AdaptiveSRSEngine implements SRSEngine {
  public review(state: SRSStateV2 | null, input: ReviewInput): ReviewResult {
    const reviewedAt = input.reviewedAt ?? input.now ?? Date.now();
    const kanaId = state?.kanaId || input.kanaId || 'unknown';

    const nextState = calculateNextAdaptiveState(state, input.rating, reviewedAt, kanaId);
    return {
      state: nextState,
      nextReviewAt: nextState.due,
      due: nextState.due,
    };
  }

  public getNextDue(state: SRSStateV2, now: number): number {
    const intervalMs = Math.round(state.stability * 24 * 60 * 60 * 1000);
    return (state.lastReview ?? now) + intervalMs;
  }
}

export function getSRSEngine(mode: SRSMode = 'legacy'): SRSEngine {
  if (mode === 'adaptive') {
    return new AdaptiveSRSEngine();
  }
  return new LegacySRSEngine();
}
