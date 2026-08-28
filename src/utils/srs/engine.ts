import {
  SRSEngine,
  SRSStateV2,
  ReviewInput,
  ReviewResult,
  ReviewRating,
  SRSMode,
} from './types';
import { LEGACY_LEVEL_STABILITY_DAYS } from './migration';
import { scheduleAdaptiveReview } from './scheduler';

export { scheduleAdaptiveReview, scheduleAdaptiveReview as calculateNextAdaptiveState } from './scheduler';

export function ratingFromCorrectness(isCorrect: boolean): ReviewRating {
  return isCorrect ? 'good' : 'again';
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

    return scheduleAdaptiveReview(state, input.rating, reviewedAt, kanaId);
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
