import { UserProgress, KanaReviewState, KanaItem } from '../types';
import {
  UserProgressV2,
  ReviewRating,
  migrateUserProgress,
  applyReviewResult,
  mapQuizResultToRating,
  SRS_MODE,
} from './srs';

export const STORAGE_KEY_V1 = 'ai_japanese_learning_progress_v1';
export const STORAGE_KEY_V2 = 'ai_japanese_learning_progress_v2';
const STORAGE_KEY = STORAGE_KEY_V1;

export const REVIEW_INTERVALS: Record<number, number> = {
  0: 10 * 60 * 1000,           // Level 0: 10 mins
  1: 24 * 60 * 60 * 1000,      // Level 1: 1 day
  2: 3 * 24 * 60 * 60 * 1000,  // Level 2: 3 days
  3: 7 * 24 * 60 * 60 * 1000,  // Level 3: 7 days
  4: 14 * 24 * 60 * 60 * 1000, // Level 4: 14 days
  5: 30 * 24 * 60 * 60 * 1000, // Level 5: 30 days
};

export const defaultProgress: UserProgress = {
  masteredKanaIds: [],
  wrongKanaIds: [],
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  reviewStates: {},
};

export function getStoredProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V1);
    if (!raw) {
      // Fallback: If v2 exists, reconstruct v1
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (rawV2) {
        try {
          const parsedV2 = JSON.parse(rawV2) as UserProgressV2;
          if (parsedV2 && parsedV2.schemaVersion === 2) {
            return {
              masteredKanaIds: Array.isArray(parsedV2.masteredKanaIds) ? parsedV2.masteredKanaIds : [],
              wrongKanaIds: Array.isArray(parsedV2.wrongKanaIds) ? parsedV2.wrongKanaIds : [],
              streakDays: typeof parsedV2.streakDays === 'number' ? parsedV2.streakDays : 1,
              lastStudyDate: parsedV2.lastStudyDate || new Date().toISOString().split('T')[0],
              reviewStates: parsedV2.reviewStates || {},
            };
          }
        } catch {
          // Ignore corrupted v2, fallback to default
        }
      }
      return defaultProgress;
    }

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

/**
 * CHG-006 M5：v2 調適資料的版本。
 * 修正前，每次寫 v1 都會用 migrateUserProgress 整份重建 v2，
 * srsStates 與 shadowLogs 從未真正累積。讀到沒有這個版本標記的 v2 時，整份捨棄、從目前的 v1 重新開始。
 */
export const ADAPTIVE_DATA_VERSION = 2;

/** 讀取目前版本的 v2；不存在、壞掉或是修正前的舊資料時回傳 null */
function readCurrentV2(): UserProgressV2 | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProgressV2;
    if (
      parsed &&
      parsed.schemaVersion === 2 &&
      parsed.srsStates &&
      typeof parsed.srsStates === 'object' &&
      parsed.adaptiveDataVersion === ADAPTIVE_DATA_VERSION
    ) {
      return parsed;
    }
  } catch {
    // 壞掉的 JSON 視同沒有
  }
  return null;
}

/** 從 v1 建一份全新的 v2：調適狀態由 v1 推算，shadow log 清空 */
function freshV2FromV1(v1: UserProgress): UserProgressV2 {
  return { ...migrateUserProgress(v1), shadowLogs: [], adaptiveDataVersion: ADAPTIVE_DATA_VERSION };
}

/** 捨棄現有的 v2，依指定的 v1 重建（備份匯入時用，讓 v2 對應匯入的 v1） */
export function resetProgressV2FromV1(v1: UserProgress): void {
  saveProgressV2(freshV2FromV1(v1));
}

export function saveProgress(progress: UserProgress): void {
  try {
    // 1. Persist v1 primary store (Zero breakage guarantee, v1 is NEVER deleted)
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(progress));

    // 2. 同步 v1 的鏡像欄位到 v2，但保留既有的調適狀態與 shadow log（CHG-006 M5）。
    //    只有還沒有 v2 狀態的假名才從 v1 推算；v2 不存在或是舊資料時，從 v1 整份重建。
    const existing = readCurrentV2();
    const migrated = migrateUserProgress(progress);
    const v2: UserProgressV2 = existing
      ? {
          ...migrated,
          srsStates: { ...migrated.srsStates, ...existing.srsStates },
          shadowLogs: existing.shadowLogs ?? [],
          adaptiveDataVersion: ADAPTIVE_DATA_VERSION,
        }
      : freshV2FromV1(progress);
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(v2));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function saveProgressV2(progress: UserProgressV2): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress v2:', e);
  }
}

export function getStoredProgressV2(): UserProgressV2 {
  try {
    const current = readCurrentV2();
    if (current) return current;

    // v2 不存在、壞掉，或是修正前的舊資料：從目前的 v1 重建一次並寫回
    const fresh = freshV2FromV1(getStoredProgress());
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(fresh));
    } catch {
      // ignore storage write error
    }
    return fresh;
  } catch (e) {
    console.error('Failed to read stored progress v2:', e);
    // 也要帶版本標記，否則寫回後下次讀取會被當成舊資料再捨棄一次
    return freshV2FromV1(defaultProgress);
  }
}

export function recordAdaptiveReview(
  kanaId: string,
  rating: ReviewRating,
  responseMs?: number,
  reviewedAt: number = Date.now()
): UserProgressV2 {
  const currentV2 = getStoredProgressV2();
  const updatedV2 = applyReviewResult(currentV2, kanaId, rating, reviewedAt, responseMs);
  saveProgressV2(updatedV2);
  return updatedV2;
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

export function recordReviewResult(
  kanaId: string,
  isCorrect: boolean,
  responseMs?: number,
  manualRating?: ReviewRating
): UserProgress {
  const current = getStoredProgress();
  const now = new Date();

  // 1. 先用「作答前」的 v2 狀態跑調適引擎（CHG-006 M5）。全新的假名沒有狀態，就走新卡路徑（M1）。
  //    舊順序是先 saveProgress：用已更新的 v1 重建 v2 後再套一次，同一次作答被算兩次、調適歷史也不累積。
  try {
    const rating = mapQuizResultToRating(isCorrect, responseMs, manualRating);
    recordAdaptiveReview(kanaId, rating, responseMs, now.getTime());
  } catch (e) {
    console.error('Failed to dual-record adaptive review:', e);
  }

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

  // 2. Save v1 progress (100% legacy backward compatible)。v2 的調適狀態由 saveProgress 保留，不會被重建
  saveProgress(updatedProgress);

  return updatedProgress;
}

export function getDueReviewItems(allKana: KanaItem[], progress: UserProgress): KanaItem[] {
  const now = Date.now();
  if (SRS_MODE === 'adaptive') {
    const v2 = getStoredProgressV2();
    const srsStates = v2.srsStates || {};
    return allKana.filter((k) => {
      const state = srsStates[k.id];
      if (!state || !state.due) return false;
      return state.due <= now;
    });
  }

  // Legacy & Shadow modes: driven by legacy reviewStates for production safety
  const states = progress.reviewStates || {};
  return allKana.filter((k) => {
    const state = states[k.id];
    if (!state || !state.nextReviewAt) return false;
    return new Date(state.nextReviewAt).getTime() <= now;
  });
}

export function formatNextReviewText(
  nextReviewAt: string | number | null,
  t: (path: string, params?: { count: number }) => string,
  now: number = Date.now(),
): string {
  if (!nextReviewAt) return t('study.notScheduled');
  const targetMs = typeof nextReviewAt === 'number' ? nextReviewAt : new Date(nextReviewAt).getTime();

  if (Number.isNaN(targetMs)) return t('study.notScheduled');
  if (targetMs <= now) return t('study.dueNow');

  const diffMs = targetMs - now;
  const diffMins = Math.max(1, Math.round(diffMs / (1000 * 60)));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return t('study.minutesLater', { count: diffMins });
  if (diffHours < 24) return t('study.hoursLater', { count: diffHours });
  return t('study.daysLater', { count: diffDays });
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
    localStorage.removeItem(STORAGE_KEY_V1);
    localStorage.removeItem(STORAGE_KEY_V2);
  } catch (e) {
    console.error('Failed to clear progress:', e);
  }
}
