import {
  SRSStateV2,
  ReviewRating,
  ReviewInput,
  UserProgressV2,
  SRSEngine,
} from './types';
import { getSRSEngine } from './engine';

/**
 * Maps quiz outcome / response timing to an SRS ReviewRating.
 * Prioritizes explicit user manual rating when available.
 */
export function mapQuizResultToRating(
  isCorrect: boolean,
  responseMs?: number,
  manualRating?: ReviewRating
): ReviewRating {
  if (manualRating) {
    return manualRating;
  }

  if (!isCorrect) {
    return 'again';
  }

  // Response time heuristics (if available)
  if (typeof responseMs === 'number' && responseMs > 0) {
    if (responseMs < 1200) {
      return 'easy'; // Instant effortless recall
    }
    if (responseMs > 6000) {
      return 'hard'; // Slow, effortful recall
    }
  }

  return 'good';
}

/**
 * Constructs a structured ReviewInput for the SRS Engine.
 */
export function buildReviewInput(
  rating: ReviewRating,
  kanaId: string,
  reviewedAt: number = Date.now(),
  responseMs?: number
): ReviewInput {
  return {
    rating,
    kanaId,
    reviewedAt,
    now: reviewedAt,
    responseMs,
  };
}

/**
 * Pure function: Applies a review outcome to UserProgressV2.
 * Does not mutate input progress object.
 */
export function applyReviewResult(
  progress: UserProgressV2,
  kanaId: string,
  rating: ReviewRating,
  reviewedAt: number = Date.now(),
  responseMs?: number,
  engine: SRSEngine = getSRSEngine('adaptive')
): UserProgressV2 {
  const existingState = progress.srsStates?.[kanaId] ?? null;
  const input = buildReviewInput(rating, kanaId, reviewedAt, responseMs);
  const result = engine.review(existingState, input);

  const updatedStates: Record<string, SRSStateV2> = {
    ...(progress.srsStates || {}),
    [kanaId]: result.state,
  };

  let updatedWrongIds = Array.isArray(progress.wrongKanaIds) ? [...progress.wrongKanaIds] : [];
  if (rating === 'again') {
    if (!updatedWrongIds.includes(kanaId)) {
      updatedWrongIds.push(kanaId);
    }
  }

  return {
    ...progress,
    schemaVersion: 2,
    wrongKanaIds: updatedWrongIds,
    srsStates: updatedStates,
  };
}
