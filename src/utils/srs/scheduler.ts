import { SRSStateV2, ReviewRating, ReviewResult } from './types';

export const TEN_MINUTES_IN_DAYS = 10 / (24 * 60); // ≈ 0.00694 days
export const DEFAULT_MAX_INTERVAL_DAYS = 365; // 1 year cap

export interface SchedulerOptions {
  maxIntervalDays?: number;
}

/**
 * 1. Difficulty Calculation (Pure function)
 * Adjusts difficulty on a 1.0 ~ 10.0 scale:
 * - again: +0.8 (harder)
 * - hard:  +0.3 (harder)
 * - good:  -0.1 (slight ease)
 * - easy:  -0.5 (much easier)
 */
export function calculateDifficulty(
  prevDifficulty: number = 5.0,
  rating: ReviewRating
): number {
  const clamped = Math.min(10.0, Math.max(1.0, prevDifficulty));
  let delta = 0;

  switch (rating) {
    case 'again':
      delta = 0.8;
      break;
    case 'hard':
      delta = 0.3;
      break;
    case 'good':
      delta = -0.1;
      break;
    case 'easy':
      delta = -0.5;
      break;
  }

  const next = Math.min(10.0, Math.max(1.0, clamped + delta));
  return Math.round(next * 10) / 10;
}

/**
 * 2. Elapsed Days Calculation (Pure function)
 */
export function calculateElapsedDays(
  lastReviewMs: number | null | undefined,
  reviewedAtMs: number
): number {
  if (!lastReviewMs || reviewedAtMs <= lastReviewMs) {
    return 0;
  }
  return (reviewedAtMs - lastReviewMs) / (24 * 60 * 60 * 1000);
}

/**
 * 3. Stability Calculation with Overdue Factor (Pure function)
 * If reviewed overdue (elapsedDays > prevStability) and recalled correctly,
 * memory strength is proven higher, providing an overdue bonus factor.
 */
export function calculateStability(
  prevStability: number = 1.0,
  difficulty: number = 5.0,
  rating: ReviewRating,
  elapsedDays: number = 0
): number {
  const stab = Math.max(TEN_MINUTES_IN_DAYS, prevStability);
  const diff = Math.min(10.0, Math.max(1.0, difficulty));

  if (rating === 'again') {
    // Sharp reduction back to short-term interval on lapse
    const lapsed = Math.max(TEN_MINUTES_IN_DAYS, stab * 0.2);
    return Math.round(lapsed * 10000) / 10000;
  }

  // Calculate overdue bonus if recalled after scheduled due date
  const overdueRatio = elapsedDays > stab ? elapsedDays / stab : 1.0;

  let baseGrowth: number;
  let overdueBonus: number;

  switch (rating) {
    case 'hard':
      baseGrowth = 1.1 + (10 - diff) * 0.02;
      overdueBonus = Math.min(1.5, Math.pow(overdueRatio, 0.25));
      break;
    case 'good':
      baseGrowth = 1.5 + (10 - diff) * 0.08;
      overdueBonus = Math.min(2.0, Math.pow(overdueRatio, 0.35));
      break;
    case 'easy':
      baseGrowth = 2.2 + (10 - diff) * 0.15;
      overdueBonus = Math.min(2.5, Math.pow(overdueRatio, 0.45));
      break;
  }

  const nextStability = Math.max(0.1, stab * baseGrowth * overdueBonus);
  return Math.round(nextStability * 10000) / 10000;
}

/**
 * 4. Interval Policy Calculation (Pure function)
 * - again: short relearning interval (10 minutes)
 * - hard:  conservative interval (0.85 * stability)
 * - good:  normal interval (1.0 * stability)
 * - easy:  accelerated interval (1.3 * stability)
 * Enforces maxIntervalDays upper bound.
 */
export function calculateInterval(
  stability: number,
  rating: ReviewRating,
  options?: SchedulerOptions
): number {
  const maxDays = options?.maxIntervalDays ?? DEFAULT_MAX_INTERVAL_DAYS;

  if (rating === 'again') {
    return TEN_MINUTES_IN_DAYS;
  }

  let multiplier = 1.0;
  switch (rating) {
    case 'hard':
      multiplier = 0.85;
      break;
    case 'good':
      multiplier = 1.0;
      break;
    case 'easy':
      multiplier = 1.3;
      break;
  }

  const intervalDays = Math.min(maxDays, Math.max(0.1, stability * multiplier));
  return Math.round(intervalDays * 10000) / 10000;
}

/**
 * 5. Next Review Time Calculation (Pure function)
 */
export function calculateNextReviewAt(
  reviewedAtMs: number,
  intervalDays: number
): number {
  const intervalMs = Math.max(1, Math.round(intervalDays * 24 * 60 * 60 * 1000));
  return reviewedAtMs + intervalMs;
}

/**
 * 6. High-level Pure Adaptive Scheduler
 */
export function scheduleAdaptiveReview(
  state: SRSStateV2 | null,
  rating: ReviewRating,
  reviewedAt: number = Date.now(),
  kanaId: string = 'unknown',
  options?: SchedulerOptions
): ReviewResult {
  // New Card Strategy
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

    const intervalDays = calculateInterval(initialStability, rating, options);
    const nextDue = calculateNextReviewAt(reviewedAt, intervalDays);

    const nextState: SRSStateV2 = {
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

    return {
      state: nextState,
      nextReviewAt: nextDue,
      due: nextDue,
    };
  }

  // Existing Card Strategy
  const elapsedDays = calculateElapsedDays(state.lastReview, reviewedAt);
  const nextDifficulty = calculateDifficulty(state.difficulty, rating);
  const nextStability = calculateStability(state.stability, nextDifficulty, rating, elapsedDays);
  const intervalDays = calculateInterval(nextStability, rating, options);
  const nextDue = calculateNextReviewAt(reviewedAt, intervalDays);

  const lapses = rating === 'again' ? (state.lapses || 0) + 1 : (state.lapses || 0);
  const consecutiveCorrect = rating === 'again' ? 0 : (state.consecutiveCorrect || 0) + 1;

  const nextState: SRSStateV2 = {
    version: 2,
    kanaId: state.kanaId || kanaId,
    due: nextDue,
    lastReview: reviewedAt,
    stability: nextStability,
    difficulty: nextDifficulty,
    reps: (state.reps || 0) + 1,
    lapses,
    consecutiveCorrect,
  };

  return {
    state: nextState,
    nextReviewAt: nextDue,
    due: nextDue,
  };
}
