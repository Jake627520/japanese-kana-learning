import { LearningEvent } from '../types/learning';
import { UserProgress } from '../types';
import {
  TodayStats,
  WeakKanaStat,
  DailyTrendItem,
  AIRecommendation,
  RecommendationEvidence,
  TrainingOutcome,
  ConfusionMasterySummary,
  ConfusionMasteryOptions,
  ConfusionMatrix,
  ConfusionGroupStat,
  ModalityAccuracy,
  ListeningWeakness,
  ConfusionWeakness,
  WeaknessConfidence,
} from '../types/analytics';
import { CONFUSABLE_GROUPS, ConfusableGroup } from '../data/confusableData';

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
 * Calculate 7-day half-life decay weight for a given timestamp.
 */
function getRecencyWeight(timestamp: number, nowMs: number): number {
  const ageDays = Math.max(0, (nowMs - timestamp) / (1000 * 60 * 60 * 24));
  return Math.pow(0.5, ageDays / 7);
}

/**
 * Determine WeaknessConfidence level based on attempt count.
 * < 3  -> 'low'
 * 3-7  -> 'medium'
 * >= 8 -> 'high'
 */
function getConfidenceLevel(attempts: number): WeaknessConfidence {
  if (attempts < 3) return 'low';
  if (attempts < 8) return 'medium';
  return 'high';
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
 * Calculate per-kana Listening Weakness statistics with confidence, modality gap and recency scoring.
 * Pure function: only evaluates source === 'listening' | 'listening_confusion'.
 */
export function getListeningWeaknesses(
  events: LearningEvent[],
  options?: { now?: number }
): ListeningWeakness[] {
  if (!Array.isArray(events)) return [];
  const nowMs = options?.now ?? Date.now();

  // Extract all distinct kanaIds evaluated in listening
  const kanaSet = new Set<string>();
  for (const e of events) {
    if (
      e &&
      e.kanaId &&
      e.type === 'quiz_answer' &&
      (e.source === 'listening' || e.source === 'listening_confusion')
    ) {
      kanaSet.add(e.kanaId);
    }
  }

  const results: ListeningWeakness[] = [];

  for (const kanaId of kanaSet) {
    // 1. Listening stats
    const listeningEvents = events.filter(
      (e) =>
        e.kanaId === kanaId &&
        e.type === 'quiz_answer' &&
        (e.source === 'listening' || e.source === 'listening_confusion')
    );

    const attempts = listeningEvents.length;
    const wrongCount = listeningEvents.filter((e) => e.correct === false).length;
    const listeningAccuracy =
      attempts > 0 ? Math.round(((attempts - wrongCount) / attempts) * 100) / 100 : 0;

    // 2. Visual stats (only source === 'quiz')
    const visualEvents = events.filter(
      (e) => e.kanaId === kanaId && e.type === 'quiz_answer' && e.source === 'quiz'
    );
    const visualAttempts = visualEvents.length;
    const visualCorrect = visualEvents.filter((e) => e.correct === true).length;
    const visualAccuracy =
      visualAttempts > 0 ? Math.round((visualCorrect / visualAttempts) * 100) / 100 : 0;

    const gap = Math.round((visualAccuracy - listeningAccuracy) * 100) / 100;

    // 3. Top confusion kanaId (from source === 'listening_confusion' where selected !== kanaId)
    const confusionMap: Record<string, number> = {};
    for (const e of listeningEvents) {
      if (
        e.source === 'listening_confusion' &&
        e.selectedKanaId &&
        e.selectedKanaId !== kanaId
      ) {
        confusionMap[e.selectedKanaId] = (confusionMap[e.selectedKanaId] || 0) + 1;
      }
    }

    let topConfusionKanaId: string | undefined = undefined;
    const sortedConfusions = Object.entries(confusionMap).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
    if (sortedConfusions.length > 0) {
      topConfusionKanaId = sortedConfusions[0][0];
    }

    // 4. Confidence & Recency score
    const confidence = getConfidenceLevel(attempts);
    const wrongRate = attempts > 0 ? wrongCount / attempts : 0;
    const volume = Math.max(0, Math.min(Math.log2(attempts + 1) / 5, 1));
    const gapBonus = Math.max(gap, 0);

    let totalWeight = 0;
    let weightedWrong = 0;
    for (const e of listeningEvents) {
      const w = getRecencyWeight(e.timestamp, nowMs);
      totalWeight += w;
      if (e.correct === false) weightedWrong += w;
    }
    const recencyFactor = totalWeight > 0 ? weightedWrong / totalWeight : wrongRate;

    const rawScore = wrongRate * 0.5 + volume * 0.2 + gapBonus * 0.2 + recencyFactor * 0.1;
    const score = Math.round(Math.min(Math.max(rawScore, 0), 1) * 100) / 100;

    results.push({
      kanaId,
      attempts,
      wrongCount,
      listeningAccuracy,
      visualAccuracy,
      gap,
      topConfusionKanaId,
      confidence,
      score,
    });
  }

  // Sort by score DESC, then attempts DESC, then kanaId ASC
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.attempts !== a.attempts) return b.attempts - a.attempts;
    return a.kanaId.localeCompare(b.kanaId);
  });

  return results;
}

/**
 * Calculate Confusion Group Weakness with strict group membership enforcement and directional analysis.
 * Pure function: only considers source === 'listening_confusion' where target & selected both in group.
 */
export function getConfusionWeaknesses(
  events: LearningEvent[],
  groups: ConfusableGroup[] = CONFUSABLE_GROUPS,
  options?: { now?: number }
): ConfusionWeakness[] {
  if (!Array.isArray(events)) return [];
  const nowMs = options?.now ?? Date.now();
  const confusionEvents = events.filter(
    (e) => e && e.type === 'quiz_answer' && e.source === 'listening_confusion'
  );

  const results: ConfusionWeakness[] = [];

  for (const g of groups) {
    const memberSet = new Set(g.members);
    const validGroupEvents = confusionEvents.filter(
      (e) =>
        e.kanaId &&
        e.selectedKanaId &&
        memberSet.has(e.kanaId) &&
        memberSet.has(e.selectedKanaId)
    );

    const attempts = validGroupEvents.length;
    const wrongCount = validGroupEvents.filter((e) => e.correct === false).length;
    const wrongRate =
      attempts > 0 ? Math.round((wrongCount / attempts) * 100) / 100 : 0;

    // Top direction counting (target !== selected)
    const dirMap: Record<string, { target: string; selected: string; count: number }> = {};
    for (const e of validGroupEvents) {
      if (e.kanaId && e.selectedKanaId && e.kanaId !== e.selectedKanaId) {
        const key = `${e.kanaId}->${e.selectedKanaId}`;
        if (!dirMap[key]) {
          dirMap[key] = { target: e.kanaId, selected: e.selectedKanaId, count: 0 };
        }
        dirMap[key].count += 1;
      }
    }

    const sortedDirs = Object.values(dirMap).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (a.target !== b.target) return a.target.localeCompare(b.target);
      return a.selected.localeCompare(b.selected);
    });

    const topDirection = sortedDirs.length > 0 ? sortedDirs[0] : undefined;
    const confidence = getConfidenceLevel(attempts);
    const volume = Math.max(0, Math.min(Math.log2(attempts + 1) / 5, 1));

    let totalWeight = 0;
    let weightedWrong = 0;
    for (const e of validGroupEvents) {
      const w = getRecencyWeight(e.timestamp, nowMs);
      totalWeight += w;
      if (e.correct === false) weightedWrong += w;
    }
    const recencyFactor = totalWeight > 0 ? weightedWrong / totalWeight : wrongRate;

    const rawScore = wrongRate * 0.6 + volume * 0.3 + recencyFactor * 0.1;
    const score = Math.round(Math.min(Math.max(rawScore, 0), 1) * 100) / 100;

    results.push({
      groupId: g.id,
      memberKanaIds: [...g.members],
      attempts,
      wrongCount,
      wrongRate,
      topDirection,
      confidence,
      score,
    });
  }

  // Sort by score DESC, then attempts DESC, then groupId ASC
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.attempts !== a.attempts) return b.attempts - a.attempts;
    return a.groupId.localeCompare(b.groupId);
  });

  return results;
}

/**
 * Rule-based AI Recommendation Engine.
 * Synthesizes UserProgress, LearningEvents, and Confusion Weakness into targeted daily action.
 * Priority hierarchy:
 * 1. High-confidence listening confusion
 * 2. High-confidence writing weakness
 * 3. Due SRS reviews
 * 4. General listening weakness / shadowing
 * 5. Daily quiz challenge
 */
export function getAIRecommendation(
  progress: UserProgress,
  events: LearningEvent[],
  groups: ConfusableGroup[] = CONFUSABLE_GROUPS,
  now = new Date()
): AIRecommendation {
  const nowMs = now.getTime();

  // Rule 1: High-confidence Listening Confusion Drill
  const confusionWeaknesses = getConfusionWeaknesses(events, groups, { now: nowMs });
  const highConfWeakness = confusionWeaknesses.find(
    (w) => w.confidence === 'high' && (w.wrongRate >= 0.4 || w.score >= 0.5)
  );

  if (highConfWeakness) {
    const listeningWeaknesses = getListeningWeaknesses(events, { now: nowMs });
    const memberSet = new Set(
      groups.find((g) => g.id === highConfWeakness.groupId)?.members || []
    );
    const relatedListening = listeningWeaknesses.find((lw) =>
      memberSet.has(lw.kanaId)
    );

    return {
      priority: 'high',
      targetConfusionGroupId: highConfWeakness.groupId,
      recommendedAction: 'listening_confusion',
      titleKey: 'analytics.recommendationListeningConfusion',
      reasonKey: 'analytics.recommendationHighConfusionRate',
      reasonParams: { rate: Math.round(highConfWeakness.wrongRate * 100) },
      evidence: {
        listeningAccuracy: relatedListening?.listeningAccuracy ?? (1 - highConfWeakness.wrongRate),
        visualAccuracy: relatedListening?.visualAccuracy ?? 1,
        gap: relatedListening?.gap ?? highConfWeakness.wrongRate,
        recentAttempts: highConfWeakness.attempts,
        topDirection: highConfWeakness.topDirection
          ? {
              target: highConfWeakness.topDirection.target,
              selected: highConfWeakness.topDirection.selected,
              count: highConfWeakness.topDirection.count,
            }
          : undefined,
        confidence: highConfWeakness.confidence,
        score: highConfWeakness.score,
      },
    };
  }

  // Rule 2: High Error Rate Kana (with >=3 attempts) -> Writing practice
  const weakList = getWeakKanaRanking(events, 3, 3);
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

  // Rule 3: Due SRS Reviews -> Spaced repetition review
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

  // Rule 4: Weak Kana present in wrongKanaIds -> Shadowing
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

  // Rule 5: Normal daily learning flow -> General Quiz
  return {
    priority: 'normal',
    recommendedAction: 'quiz',
    titleKey: 'analytics.recommendationQuiz',
    reasonKey: 'analytics.recommendationDailyChallenge',
  };
}

/**
 * Build directional Confusion Matrix (targetKanaId -> selectedKanaId -> count)
 * Pure function: takes events array and returns nested frequency map.
 * Only processes events with source === 'listening_confusion' where both kanaId and selectedKanaId exist.
 */
export function getConfusionMatrix(events: LearningEvent[]): ConfusionMatrix {
  const matrix: ConfusionMatrix = {};

  for (const e of events) {
    if (e.source === 'listening_confusion' && e.kanaId && e.selectedKanaId) {
      const target = e.kanaId;
      const selected = e.selectedKanaId;

      if (!matrix[target]) {
        matrix[target] = {};
      }
      matrix[target][selected] = (matrix[target][selected] || 0) + 1;
    }
  }

  return matrix;
}

/**
 * Calculate statistics per ConfusableGroup for listening confusion drills.
 * Pure function: only considers events with source === 'listening_confusion'
 * where both target kana and selected kana belong to the group's members.
 */
export function getConfusionGroupStats(
  events: LearningEvent[],
  groups: ConfusableGroup[]
): ConfusionGroupStat[] {
  const confusionEvents = events.filter((e) => e.source === 'listening_confusion');

  return groups.map((g) => {
    const memberSet = new Set(g.members);
    let attempts = 0;
    let wrongCount = 0;

    for (const e of confusionEvents) {
      if (
        e.kanaId &&
        e.selectedKanaId &&
        memberSet.has(e.kanaId) &&
        memberSet.has(e.selectedKanaId)
      ) {
        attempts += 1;
        if (e.correct === false) {
          wrongCount += 1;
        }
      }
    }

    const wrongRate =
      attempts > 0 ? Math.round((wrongCount / attempts) * 100) / 100 : 0;

    return {
      groupId: g.id,
      attempts,
      wrongCount,
      wrongRate,
    };
  });
}

/**
 * Calculate Visual vs Listening accuracy breakdown and gap.
 * Visual: source === 'quiz' (excludes review_quiz and listening)
 * Listening: source === 'listening' || source === 'listening_confusion'
 */
export function getModalityAccuracy(
  events: LearningEvent[],
  kanaId?: string
): ModalityAccuracy {
  let visualAttempts = 0;
  let visualCorrect = 0;
  let listeningAttempts = 0;
  let listeningCorrect = 0;

  for (const e of events) {
    if (kanaId && e.kanaId !== kanaId) continue;

    if (e.type === 'quiz_answer' && e.correct !== undefined) {
      if (e.source === 'quiz') {
        visualAttempts += 1;
        if (e.correct) visualCorrect += 1;
      } else if (e.source === 'listening' || e.source === 'listening_confusion') {
        listeningAttempts += 1;
        if (e.correct) listeningCorrect += 1;
      }
    }
  }

  const visualAccuracy =
    visualAttempts > 0 ? Math.round((visualCorrect / visualAttempts) * 100) / 100 : 0;
  const listeningAccuracy =
    listeningAttempts > 0
      ? Math.round((listeningCorrect / listeningAttempts) * 100) / 100
      : 0;

  const gap = Math.round((visualAccuracy - listeningAccuracy) * 100) / 100;

  return {
    visualAccuracy,
    listeningAccuracy,
    gap,
  };
}

/**
 * Calculate post-training outcome comparing before vs after metrics.
 * Pure function: rigorously separates pre-training baseline, session performance (last 5 events),
 * and subsequent observation window without modifying underlying events.
 */
export function getTrainingOutcome(
  eventsBefore: LearningEvent[],
  eventsAfter: LearningEvent[],
  groupId: string,
  groups: ConfusableGroup[] = CONFUSABLE_GROUPS
): TrainingOutcome | null {
  if (!Array.isArray(eventsBefore) || !Array.isArray(eventsAfter)) {
    return null;
  }

  const group = groups.find((item) => item.id === groupId);
  if (!group) {
    return null;
  }

  const members = new Set(group.members);

  const valid = (event: LearningEvent) =>
    Boolean(
      event &&
      event.type === 'quiz_answer' &&
      event.source === 'listening_confusion' &&
      event.kanaId &&
      members.has(event.kanaId)
    );

  const before = eventsBefore.filter(valid);
  const after = eventsAfter.filter(valid);

  if (after.length === 0) {
    return null;
  }

  /*
   * The final 5-event block is treated as the training session.
   * The remaining events are the post-training observation window.
   */
  const session = after.slice(-5);
  const postTraining = after.slice(0, -5);

  if (session.length === 0) {
    return null;
  }

  const accuracy = (events: LearningEvent[]) =>
    events.length === 0
      ? 0
      : Math.round((events.filter((event) => event.correct === true).length / events.length) * 100) / 100;

  const beforeAccuracy = accuracy(before);
  const sessionAccuracy = accuracy(session);
  const afterAccuracy = postTraining.length > 0 ? accuracy(postTraining) : sessionAccuracy;

  const directionCounts = new Map<string, {
    target: string;
    selected: string;
    count: number;
  }>();

  const evalEvents = postTraining.length > 0 ? postTraining : session;
  for (const event of evalEvents) {
    if (
      event.correct === false &&
      event.kanaId &&
      event.selectedKanaId &&
      members.has(event.selectedKanaId)
    ) {
      const key = `${event.kanaId}->${event.selectedKanaId}`;
      const existing = directionCounts.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        directionCounts.set(key, {
          target: event.kanaId,
          selected: event.selectedKanaId,
          count: 1,
        });
      }
    }
  }

  const remainingTopDirection = [...directionCounts.values()]
    .sort((a, b) => b.count - a.count)[0];

  const improvement = Math.round((sessionAccuracy - beforeAccuracy) * 100) / 100;

  return {
    groupId,
    beforeAccuracy,
    afterAccuracy,
    sessionAccuracy,
    improvement,
    remainingTopDirection,
    isResolved:
      sessionAccuracy >= 0.8 &&
      (beforeAccuracy === 0 || improvement >= 0.15),
  };
}

/**
 * Calculate long-term confusion mastery summary across groups.
 * Pure function:
 * 1. Segregates events into 'before' (older than recentWindowDays) and 'recent' (within recentWindowDays).
 * 2. Enforces strict group membership (target in group && selected in group).
 * 3. Requires minBeforeAttempts (default 3) and minRecentAttempts (default 3) to qualify as evaluated.
 * 4. Resolves group if recentAccuracy >= resolvedAccuracy (default 0.8) and improvement >= resolvedImprovement (default 0.15).
 */
export function getConfusionMasterySummary(
  events: LearningEvent[],
  groups: ConfusableGroup[] = CONFUSABLE_GROUPS,
  options?: ConfusionMasteryOptions
): ConfusionMasterySummary {
  if (!Array.isArray(events)) {
    return {
      totalGroupsEvaluated: 0,
      resolvedCount: 0,
      activeWeakCount: 0,
      averageImprovement: 0,
      groupOutcomes: [],
    };
  }

  const nowMs = options?.now ?? Date.now();
  const recentDays = options?.recentWindowDays ?? 7;
  const cutoffMs = nowMs - recentDays * 24 * 60 * 60 * 1000;
  const minBeforeAttempts = options?.minBeforeAttempts ?? 3;
  const minRecentAttempts = options?.minRecentAttempts ?? 3;
  const resolvedAccuracy = options?.resolvedAccuracy ?? 0.8;
  const resolvedImprovement = options?.resolvedImprovement ?? 0.15;

  const confusionEvents = events.filter(
    (e) => e && e.type === 'quiz_answer' && e.source === 'listening_confusion'
  );

  const groupOutcomes: ConfusionMasterySummary['groupOutcomes'] = [];
  let totalImprovement = 0;

  for (const g of groups) {
    const memberSet = new Set(g.members);
    const validGroupEvents = confusionEvents.filter(
      (e) =>
        e.kanaId &&
        e.selectedKanaId &&
        memberSet.has(e.kanaId) &&
        memberSet.has(e.selectedKanaId)
    );

    const beforeEvents = validGroupEvents.filter((e) => e.timestamp < cutoffMs);
    const recentEvents = validGroupEvents.filter((e) => e.timestamp >= cutoffMs);

    // Check evaluation threshold: requires both history and recent observation
    if (beforeEvents.length < minBeforeAttempts || recentEvents.length < minRecentAttempts) {
      continue;
    }

    const beforeCorrect = beforeEvents.filter((e) => e.correct === true).length;
    const beforeAccuracy = Math.round((beforeCorrect / beforeEvents.length) * 100) / 100;

    const recentCorrect = recentEvents.filter((e) => e.correct === true).length;
    const recentAccuracy = Math.round((recentCorrect / recentEvents.length) * 100) / 100;

    const improvement = Math.round((recentAccuracy - beforeAccuracy) * 100) / 100;

    const isResolved =
      recentEvents.length >= minRecentAttempts &&
      recentAccuracy >= resolvedAccuracy &&
      improvement >= resolvedImprovement;

    // Remaining top direction in recent window (only wrong answers)
    const dirMap: Record<string, { target: string; selected: string; count: number }> = {};
    for (const e of recentEvents) {
      if (e.correct === false && e.kanaId && e.selectedKanaId && e.kanaId !== e.selectedKanaId) {
        const key = `${e.kanaId}->${e.selectedKanaId}`;
        if (!dirMap[key]) {
          dirMap[key] = { target: e.kanaId, selected: e.selectedKanaId, count: 0 };
        }
        dirMap[key].count += 1;
      }
    }

    const sortedDirs = Object.values(dirMap).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (a.target !== b.target) return a.target.localeCompare(b.target);
      return a.selected.localeCompare(b.selected);
    });

    const remainingTopDirection = sortedDirs.length > 0 ? sortedDirs[0] : undefined;

    groupOutcomes.push({
      groupId: g.id,
      groupTitle: g.members.join(' / '),
      beforeAccuracy,
      recentAccuracy,
      improvement,
      isResolved,
      remainingTopDirection,
    });

    totalImprovement += improvement;
  }

  const totalGroupsEvaluated = groupOutcomes.length;
  const resolvedCount = groupOutcomes.filter((o) => o.isResolved).length;
  const activeWeakCount = totalGroupsEvaluated - resolvedCount;
  const averageImprovement =
    totalGroupsEvaluated > 0
      ? Math.round((totalImprovement / totalGroupsEvaluated) * 100) / 100
      : 0;

  return {
    totalGroupsEvaluated,
    resolvedCount,
    activeWeakCount,
    averageImprovement,
    groupOutcomes,
  };
}
