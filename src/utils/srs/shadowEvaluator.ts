import { SRSShadowLogEntry, ReviewRating } from './types';

export const MAX_SHADOW_LOGS = 200;
export const MIN_RESPONSE_MS = 100;
export const MAX_RESPONSE_MS = 60000; // 1 minute max bound

/**
 * Clamps responseMs to a realistic human threshold [100ms, 60000ms].
 * Discards negative, zero, or non-finite values.
 */
export function clampResponseMs(responseMs?: number): number | undefined {
  if (typeof responseMs !== 'number' || !Number.isFinite(responseMs) || responseMs <= 0) {
    return undefined;
  }
  return Math.min(MAX_RESPONSE_MS, Math.max(MIN_RESPONSE_MS, Math.round(responseMs)));
}

/**
 * Appends a shadow log entry and trims to the latest MAX_SHADOW_LOGS (FIFO).
 * Pure function: does not mutate input array.
 */
export function appendShadowLog(
  currentLogs: SRSShadowLogEntry[] = [],
  entry: SRSShadowLogEntry
): SRSShadowLogEntry[] {
  const next = [entry, ...(Array.isArray(currentLogs) ? currentLogs : [])];
  return next.slice(0, MAX_SHADOW_LOGS);
}

export interface ShadowEvaluationSummary {
  totalReviews: number;
  ratingBreakdown: Record<ReviewRating, { count: number; percentage: number }>;
  averageStability: number;
  averageDifficulty: number;
  averageIntervalDiffDays: number;
  againRate: number;
}

/**
 * Analyzes local shadow logs to evaluate adaptive vs legacy scheduler differences.
 * Pure function: purely local telemetry without external side effects.
 */
export function getShadowEvaluationSummary(
  shadowLogs: SRSShadowLogEntry[] = []
): ShadowEvaluationSummary {
  const total = Array.isArray(shadowLogs) ? shadowLogs.length : 0;

  const counts: Record<ReviewRating, number> = {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  };

  let sumStability = 0;
  let sumDifficulty = 0;
  let sumIntervalDiffMs = 0;

  for (const log of shadowLogs) {
    if (log && log.rating && counts[log.rating] !== undefined) {
      counts[log.rating] += 1;
    }
    sumStability += log?.stability || 0;
    sumDifficulty += log?.difficulty || 5.0;
    sumIntervalDiffMs += (log?.adaptiveIntervalMs || 0) - (log?.legacyIntervalMs || 0);
  }

  const ratingBreakdown: Record<ReviewRating, { count: number; percentage: number }> = {
    again: {
      count: counts.again,
      percentage: total > 0 ? Math.round((counts.again / total) * 100) : 0,
    },
    hard: {
      count: counts.hard,
      percentage: total > 0 ? Math.round((counts.hard / total) * 100) : 0,
    },
    good: {
      count: counts.good,
      percentage: total > 0 ? Math.round((counts.good / total) * 100) : 0,
    },
    easy: {
      count: counts.easy,
      percentage: total > 0 ? Math.round((counts.easy / total) * 100) : 0,
    },
  };

  const averageStability = total > 0 ? Math.round((sumStability / total) * 100) / 100 : 0;
  const averageDifficulty = total > 0 ? Math.round((sumDifficulty / total) * 10) / 10 : 5.0;
  const avgDiffMs = total > 0 ? sumIntervalDiffMs / total : 0;
  const averageIntervalDiffDays = Math.round((avgDiffMs / (24 * 60 * 60 * 1000)) * 100) / 100;
  const againRate = total > 0 ? Math.round((counts.again / total) * 100) / 100 : 0;

  return {
    totalReviews: total,
    ratingBreakdown,
    averageStability,
    averageDifficulty,
    averageIntervalDiffDays,
    againRate,
  };
}
