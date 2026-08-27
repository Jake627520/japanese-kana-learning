import { LearningEvent } from '../types/learning';
import { UserProgress } from '../types';
import {
  TodayStats,
  WeakKanaStat,
  DailyTrendItem,
  AIRecommendation,
} from '../types/analytics';

/**
 * Format Date to local YYYY-MM-DD string.
 */
function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Calculate learning actions completed today.
 * Pure function: relies entirely on input events and given reference time.
 */
export function getTodayStats(events: LearningEvent[], now = new Date()): TodayStats {
  const todayStr = toLocalDateString(now);

  const todayEvents = events.filter((e) => {
    const eventDate = toLocalDateString(new Date(e.timestamp));
    return eventDate === todayStr;
  });

  let quizCount = 0;
  let reviewCount = 0;
  let writingCount = 0;
  let shadowingCount = 0;

  for (const e of todayEvents) {
    if (e.type === 'quiz_answer') quizCount += 1;
    else if (e.type === 'review_complete') reviewCount += 1;
    else if (e.type === 'writing_complete') writingCount += 1;
    else if (e.type === 'shadowing_complete') shadowingCount += 1;
  }

  return {
    quizCount,
    reviewCount,
    writingCount,
    shadowingCount,
    totalActions: todayEvents.length,
  };
}

/**
 * Calculate and rank weak kana by failure rate and attempt volume.
 * Pure function: takes events array and returns top N weak kana statistics.
 * Applies minAttempts gate (default: 3) to filter out small sample noise.
 */
export function getWeakKanaRanking(
  events: LearningEvent[],
  limit = 5,
  minAttempts = 3
): WeakKanaStat[] {
  const statsMap: Record<string, { attempts: number; wrongCount: number }> = {};

  for (const e of events) {
    if (e.kanaId && e.type === 'quiz_answer' && e.correct !== undefined) {
      if (!statsMap[e.kanaId]) {
        statsMap[e.kanaId] = { attempts: 0, wrongCount: 0 };
      }
      statsMap[e.kanaId].attempts += 1;
      if (!e.correct) {
        statsMap[e.kanaId].wrongCount += 1;
      }
    }
  }

  const list: WeakKanaStat[] = Object.entries(statsMap)
    .filter(([_, data]) => data.attempts >= minAttempts && data.wrongCount > 0)
    .map(([kanaId, data]) => ({
      kanaId,
      attempts: data.attempts,
      wrongCount: data.wrongCount,
      wrongRate: Math.round((data.wrongCount / data.attempts) * 100) / 100,
    }));

  // Sort primarily by wrongRate descending, then by wrongCount descending
  list.sort((a, b) => {
    if (b.wrongRate !== a.wrongRate) {
      return b.wrongRate - a.wrongRate;
    }
    return b.wrongCount - a.wrongCount;
  });

  return list.slice(0, limit);
}

/**
 * Calculate 7-day activity trend ending on reference date.
 * Pure function: generates 7-day breakdown without external side effects.
 */
export function getSevenDayTrend(events: LearningEvent[], now = new Date()): DailyTrendItem[] {
  const result: DailyTrendItem[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = toLocalDateString(d);
    const displayDate = `${d.getMonth() + 1}/${d.getDate()}`;

    const dayEvents = events.filter(
      (e) => toLocalDateString(new Date(e.timestamp)) === dateStr
    );

    let quizCount = 0;
    let reviewCount = 0;
    let writingCount = 0;
    let shadowingCount = 0;

    for (const e of dayEvents) {
      if (e.type === 'quiz_answer') quizCount += 1;
      else if (e.type === 'review_complete') reviewCount += 1;
      else if (e.type === 'writing_complete') writingCount += 1;
      else if (e.type === 'shadowing_complete') shadowingCount += 1;
    }

    result.push({
      date: dateStr,
      displayDate,
      count: dayEvents.length,
      quizCount,
      reviewCount,
      writingCount,
      shadowingCount,
    });
  }

  return result;
}

/**
 * Rule-based AI Recommendation Engine.
 * Synthesizes UserProgress and LearningEvents into targeted daily action.
 * Pure function: returns i18n key references and dynamic params.
 */
export function getAIRecommendation(
  progress: UserProgress,
  events: LearningEvent[],
  now = new Date()
): AIRecommendation {
  const weakList = getWeakKanaRanking(events, 3, 3);
  const nowMs = now.getTime();

  // Rule 1: High Error Rate Kana (with >=3 attempts) -> Writing practice
  if (weakList.length > 0 && weakList[0].wrongRate >= 0.5) {
    const topWeak = weakList[0];
    return {
      priority: 'high',
      targetKanaId: topWeak.kanaId,
      recommendedAction: 'writing',
      titleKey: 'analytics.recommendationPracticeWriting',
      reasonKey: 'analytics.recommendationHighErrorRate',
      reasonParams: { rate: Math.round(topWeak.wrongRate * 100) },
    };
  }

  // Rule 2: Due SRS Reviews -> Spaced repetition review
  const states = progress.reviewStates || {};
  const dueKanaIds = Object.keys(states).filter((id) => {
    const nextAt = states[id].nextReviewAt;
    return nextAt && new Date(nextAt).getTime() <= nowMs;
  });

  if (dueKanaIds.length > 0) {
    return {
      priority: 'high',
      targetKanaId: dueKanaIds[0],
      recommendedAction: 'review',
      titleKey: 'analytics.recommendationReview',
      reasonKey: 'analytics.recommendationSrsDue',
      reasonParams: { count: dueKanaIds.length },
    };
  }

  // Rule 3: Weak Kana present in wrongKanaIds -> Shadowing / Quiz
  if (progress.wrongKanaIds.length > 0) {
    const firstWrong = progress.wrongKanaIds[0];
    return {
      priority: 'medium',
      targetKanaId: firstWrong,
      recommendedAction: 'shadowing',
      titleKey: 'analytics.recommendationShadowing',
      reasonKey: 'analytics.recommendationShadowingWeak',
    };
  }

  // Rule 4: Normal daily learning flow -> General Quiz
  return {
    priority: 'normal',
    recommendedAction: 'quiz',
    titleKey: 'analytics.recommendationQuiz',
    reasonKey: 'analytics.recommendationDailyChallenge',
  };
}
