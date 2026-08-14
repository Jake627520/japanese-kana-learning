import { UserProgress, KanaReviewState, KanaItem } from '../types';

const STORAGE_KEY = 'ai_japanese_learning_progress_v1';

export const REVIEW_INTERVALS: Record<number, number> = {
  0: 10 * 60 * 1000,           // Level 0: 10 mins
  1: 24 * 60 * 60 * 1000,      // Level 1: 1 day
  2: 3 * 24 * 60 * 60 * 1000,  // Level 2: 3 days
  3: 7 * 24 * 60 * 60 * 1000,  // Level 3: 7 days
  4: 14 * 24 * 60 * 60 * 1000, // Level 4: 14 days
  5: 30 * 24 * 60 * 60 * 1000, // Level 5: 30 days
};

const defaultProgress: UserProgress = {
  masteredKanaIds: [],
  wrongKanaIds: [],
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  reviewStates: {},
};

export function getStoredProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;

    const parsed = JSON.parse(raw) as UserProgress;

    if (!parsed.reviewStates) {
      parsed.reviewStates = {};
    }

    const today = new Date().toISOString().split('T')[0];

    if (parsed.lastStudyDate !== today) {
      const lastDate = new Date(parsed.lastStudyDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        parsed.streakDays += 1;
        parsed.lastStudyDate = today;
      } else if (diffDays > 1) {
        parsed.streakDays = 1;
        parsed.lastStudyDate = today;
      }

      saveProgress(parsed);
    }

    return parsed;
  } catch (e) {
    console.error('Failed to read stored progress:', e);
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function getReviewState(progress: UserProgress, kanaId: string): KanaReviewState {
  if (progress.reviewStates && progress.reviewStates[kanaId]) {
    return progress.reviewStates[kanaId];
  }
  return {
    kanaId,
    reviewLevel: 0,
    correctCount: 0,
    wrongCount: 0,
    lastReviewedAt: null,
    nextReviewAt: null,
  };
}

export function recordReviewResult(kanaId: string, isCorrect: boolean): UserProgress {
  const current = getStoredProgress();
  const now = new Date();
  const state = getReviewState(current, kanaId);

  let newLevel = state.reviewLevel;
  let correctCount = state.correctCount;
  let wrongCount = state.wrongCount;

  if (isCorrect) {
    correctCount += 1;
    newLevel = Math.min(5, newLevel + 1);
  } else {
    wrongCount += 1;
    newLevel = Math.max(0, newLevel - 1);
  }

  const intervalMs = REVIEW_INTERVALS[newLevel] || REVIEW_INTERVALS[0];
  const nextReviewAt = new Date(now.getTime() + intervalMs).toISOString();

  const updatedState: KanaReviewState = {
    kanaId,
    reviewLevel: newLevel,
    correctCount,
    wrongCount,
    lastReviewedAt: now.toISOString(),
    nextReviewAt,
  };

  const updatedReviewStates = {
    ...(current.reviewStates || {}),
    [kanaId]: updatedState,
  };

  let updatedWrongIds = current.wrongKanaIds;
  if (!isCorrect && !updatedWrongIds.includes(kanaId)) {
    updatedWrongIds = [...updatedWrongIds, kanaId];
  }

  const updatedProgress: UserProgress = {
    ...current,
    wrongKanaIds: updatedWrongIds,
    reviewStates: updatedReviewStates,
  };

  saveProgress(updatedProgress);
  return updatedProgress;
}

export function getDueReviewItems(allKana: KanaItem[], progress: UserProgress): KanaItem[] {
  const now = new Date();
  const states = progress.reviewStates || {};
  return allKana.filter((k) => {
    const state = states[k.id];
    if (!state || !state.nextReviewAt) return false;
    return new Date(state.nextReviewAt) <= now;
  });
}

export function formatNextReviewText(nextReviewAt: string | null): string {
  if (!nextReviewAt) return '未排程';
  const now = new Date();
  const target = new Date(nextReviewAt);

  if (target <= now) return '已到期';

  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins <= 1) return '1 分鐘後';
  if (diffMins < 60) return `${diffMins} 分鐘後`;
  if (diffHours < 24) return `${diffHours} 小時後`;
  return `${diffDays} 天後`;
}

export function toggleKanaMastered(kanaId: string): UserProgress {
  const current = getStoredProgress();
  const isMastered = current.masteredKanaIds.includes(kanaId);

  const updatedMastered = isMastered
    ? current.masteredKanaIds.filter((id) => id !== kanaId)
    : [...current.masteredKanaIds, kanaId];

  const updated: UserProgress = {
    ...current,
    masteredKanaIds: updatedMastered,
  };

  saveProgress(updated);
  return updated;
}

export function markKanaWrong(kanaId: string): UserProgress {
  return recordReviewResult(kanaId, false);
}

export function removeKanaFromWrong(kanaId: string): UserProgress {
  const current = getStoredProgress();
  const updated = {
    ...current,
    wrongKanaIds: current.wrongKanaIds.filter((id) => id !== kanaId),
  };
  saveProgress(updated);
  return updated;
}

export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear progress:', e);
  }
}
