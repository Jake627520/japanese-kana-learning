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

/**
 * Legacy SRS Engine (v1 scheduling logic ported to SRSEngine interface)
 * Uses the 6-stage interval mapping: 10m -> 1d -> 3d -> 7d -> 14d -> 30d
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

  public review(input: ReviewInput): ReviewResult {
    const { state, rating, now } = input;
    const isCorrect = rating === 'good' || rating === 'easy';
    const currentLevel = this.levelFromStability(state.stability);

    let nextLevel = currentLevel;
    let lapses = state.lapses;
    let consecutiveCorrect = state.consecutiveCorrect;

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
    const nextDue = now + intervalMs;

    const nextState: SRSStateV2 = {
      ...state,
      version: 2,
      lastReview: now,
      due: nextDue,
      stability: nextStability,
      difficulty: state.difficulty,
      reps: state.reps + 1,
      lapses,
      consecutiveCorrect,
    };

    return {
      state: nextState,
      due: nextDue,
    };
  }

  public getNextDue(state: SRSStateV2, now: number): number {
    const intervalMs = Math.round(state.stability * 24 * 60 * 60 * 1000);
    return (state.lastReview ?? now) + intervalMs;
  }
}

/**
 * Adaptive SRS Engine Foundation (Phase 2 stub with safe baseline implementation)
 */
export class AdaptiveSRSEngine implements SRSEngine {
  private legacyEngine = new LegacySRSEngine();

  public review(input: ReviewInput): ReviewResult {
    // In Phase 1, fallback to deterministic legacy scheduling behavior
    return this.legacyEngine.review(input);
  }

  public getNextDue(state: SRSStateV2, now: number): number {
    return this.legacyEngine.getNextDue(state, now);
  }
}

export function getSRSEngine(mode: SRSMode = 'legacy'): SRSEngine {
  if (mode === 'adaptive') {
    return new AdaptiveSRSEngine();
  }
  return new LegacySRSEngine();
}
