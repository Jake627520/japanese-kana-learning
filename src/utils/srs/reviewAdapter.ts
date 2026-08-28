import {
  SRSStateV2,
  ReviewRating,
  ReviewInput,
  UserProgressV2,
  SRSEngine,
  SRSShadowLogEntry,
} from './types';
import { getSRSEngine, LegacySRSEngine } from './engine';
import { clampResponseMs, appendShadowLog } from './shadowEvaluator';

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

  const validMs = clampResponseMs(responseMs);
  if (typeof validMs === 'number') {
    if (validMs < 1200) {
      return 'easy'; // Instant effortless recall
    }
    if (validMs > 6000) {
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
    responseMs: clampResponseMs(responseMs),
  };
}

const legacyEngine = new LegacySRSEngine();

/**
 * Pure function: Applies a review outcome to UserProgressV2.
 * Generates shadow evaluation logs without mutating input progress object.
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

  // Compute shadow legacy comparison
  const legacyResult = legacyEngine.review(existingState, input);
  const legacyIntervalMs = legacyResult.nextReviewAt - reviewedAt;
  const adaptiveIntervalMs = result.nextReviewAt - reviewedAt;

  const shadowEntry: SRSShadowLogEntry = {
    kanaId,
    timestamp: reviewedAt,
    rating,
    responseMs: clampResponseMs(responseMs),
    legacyNextReviewAt: new Date(legacyResult.nextReviewAt).toISOString(),
    adaptiveNextReviewAt: result.nextReviewAt,
    legacyIntervalMs,
    adaptiveIntervalMs,
    stability: result.state.stability,
    difficulty: result.state.difficulty,
  };

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

  const updatedShadowLogs = appendShadowLog(progress.shadowLogs, shadowEntry);

  return {
    ...progress,
    schemaVersion: 2,
    wrongKanaIds: updatedWrongIds,
    srsStates: updatedStates,
    shadowLogs: updatedShadowLogs,
  };
}
