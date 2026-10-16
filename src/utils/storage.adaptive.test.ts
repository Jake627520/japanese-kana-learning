import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ADAPTIVE_DATA_VERSION,
  STORAGE_KEY_V1,
  STORAGE_KEY_V2,
  getStoredProgressV2,
  recordReviewResult,
  removeKanaFromWrong,
  toggleKanaMastered,
  markKanaWrong,
  saveProgress,
} from './storage';
import { validateAndImportProgressData } from './dataPortability';
import { UserProgress } from '../types';

/**
 * CHG-006 M5：調適資料要真的累積。
 * 修正前，每次寫 v1 都會用 migrateUserProgress 整份重建 v2：
 * consecutiveCorrect 永遠 1、difficulty 永遠 4.5、reps 多算一次、shadowLogs 永遠 1 筆。
 */

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-01-01T00:00:00Z').getTime();

const v2 = () => JSON.parse(localStorage.getItem(STORAGE_KEY_V2)!);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
});
afterEach(() => {
  vi.useRealTimers();
});

/** 同一個假名連續作答 n 次，每次間隔 days 天 */
function reviewTimes(kanaId: string, n: number, days = 10, rating: 'easy' | 'good' | 'hard' = 'good') {
  let t = T0;
  for (let i = 0; i < n; i++) {
    vi.setSystemTime(t);
    recordReviewResult(kanaId, true, 3000, rating);
    t += days * DAY;
  }
}

describe('CHG-006 M5：作答時調適狀態會累積', () => {
  it('連續答對 5 次：consecutiveCorrect 與 reps 從 1 數到 5，難度隨作答下降', () => {
    const seen: { cc: number; reps: number; difficulty: number }[] = [];
    let t = T0;
    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(t);
      recordReviewResult('h_ka', true, 3000, 'easy');
      const s = getStoredProgressV2().srsStates.h_ka;
      seen.push({ cc: s.consecutiveCorrect, reps: s.reps, difficulty: s.difficulty });
      t += 10 * DAY;
    }
    expect(seen.map((x) => x.cc)).toEqual([1, 2, 3, 4, 5]);
    expect(seen.map((x) => x.reps)).toEqual([1, 2, 3, 4, 5]);
    // easy 會讓難度逐次下降（下限 1），不會卡在同一個值
    expect(new Set(seen.map((x) => x.difficulty)).size).toBeGreaterThan(1);
  });

  it('shadowLogs 每次作答多一筆，不會被清掉', () => {
    reviewTimes('h_ka', 4);
    expect(getStoredProgressV2().shadowLogs).toHaveLength(4);
  });

  it.each([
    ['hard', 1],
    ['good', 1],
    ['easy', 3],
  ] as const)('全新的假名首次作答走新卡路徑（M1）：%s → %i 天後複習', (rating, days) => {
    recordReviewResult('h_sa', true, 3000, rating);
    const s = getStoredProgressV2().srsStates.h_sa;
    expect(s.reps).toBe(1);
    expect(s.due - T0).toBe(days * DAY);
  });

  it('答錯（again）的新卡：10 分鐘後複習、lapses 1', () => {
    recordReviewResult('h_sa', false, 3000);
    const s = getStoredProgressV2().srsStates.h_sa;
    expect(s.lapses).toBe(1);
    expect(s.due - T0).toBe(10 * 60 * 1000);
  });
});

describe('CHG-006 M5：其他寫入 v1 的操作不會清掉調適資料', () => {
  it.each([
    ['toggleKanaMastered', () => toggleKanaMastered('h_ka')],
    ['removeKanaFromWrong', () => removeKanaFromWrong('h_ka')],
  ])('%s 之後 srsStates 與 shadowLogs 原樣保留', (_name, action) => {
    reviewTimes('h_ka', 3);
    const before = getStoredProgressV2();

    action();

    const after = getStoredProgressV2();
    expect(after.srsStates.h_ka).toEqual(before.srsStates.h_ka);
    expect(after.shadowLogs).toEqual(before.shadowLogs);
  });

  it('markKanaWrong 等於記一次答錯：在既有狀態上累加，不是重建', () => {
    reviewTimes('h_ka', 3);
    const before = getStoredProgressV2();

    markKanaWrong('h_ka');

    const after = getStoredProgressV2();
    expect(after.srsStates.h_ka).toMatchObject({
      reps: before.srsStates.h_ka.reps + 1,
      lapses: before.srsStates.h_ka.lapses + 1,
      consecutiveCorrect: 0,
    });
    expect(after.shadowLogs).toHaveLength(before.shadowLogs!.length + 1);
  });

  it('v1 新增的假名會補進 v2，既有假名的調適狀態不被 v1 推算值覆蓋', () => {
    reviewTimes('h_ka', 3);
    const kaBefore = getStoredProgressV2().srsStates.h_ka;
    const v1 = JSON.parse(localStorage.getItem(STORAGE_KEY_V1)!) as UserProgress;
    v1.reviewStates!.h_ki = {
      kanaId: 'h_ki', reviewLevel: 2, correctCount: 2, wrongCount: 0,
      lastReviewedAt: new Date(T0).toISOString(), nextReviewAt: new Date(T0 + 3 * DAY).toISOString(),
    };

    saveProgress(v1);

    const states = getStoredProgressV2().srsStates;
    expect(states.h_ka).toEqual(kaBefore);
    expect(states.h_ki).toMatchObject({ reps: 2, consecutiveCorrect: 0 });
  });
});

describe('CHG-006 M5：清掉修正前的舊 v2 資料（只做一次）', () => {
  const v1WithHistory: UserProgress = {
    masteredKanaIds: [],
    wrongKanaIds: [],
    streakDays: 1,
    lastStudyDate: new Date(T0).toISOString().split('T')[0],
    reviewStates: {
      h_ka: {
        kanaId: 'h_ka', reviewLevel: 3, correctCount: 3, wrongCount: 1,
        lastReviewedAt: new Date(T0 - DAY).toISOString(), nextReviewAt: new Date(T0 + 7 * DAY).toISOString(),
      },
    },
  };
  // 修正前留下的 v2：沒有 adaptiveDataVersion，內容是被反覆重建的假資料
  const oldV2 = {
    schemaVersion: 2,
    masteredKanaIds: [],
    wrongKanaIds: [],
    streakDays: 1,
    lastStudyDate: v1WithHistory.lastStudyDate,
    srsStates: { h_ka: { version: 2, kanaId: 'h_ka', due: 0, lastReview: 0, stability: 90.75, difficulty: 4.5, reps: 99, lapses: 0, consecutiveCorrect: 1 } },
    reviewStates: v1WithHistory.reviewStates,
    shadowLogs: [{ kanaId: 'h_ka', timestamp: 1 }],
  };

  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(v1WithHistory));
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(oldV2));
  });

  it('讀取時捨棄舊資料：shadowLogs 清空，srsStates 從目前的 v1 重建，並標上新版本', () => {
    const p = getStoredProgressV2();
    expect(p.adaptiveDataVersion).toBe(ADAPTIVE_DATA_VERSION);
    expect(p.shadowLogs).toEqual([]);
    expect(p.srsStates.h_ka).toMatchObject({ reps: 4, lapses: 1, consecutiveCorrect: 0, difficulty: 5 });
    expect(v2().adaptiveDataVersion).toBe(ADAPTIVE_DATA_VERSION); // 已寫回，不會每次都重建
  });

  it('升級後第一次作答：以作答前的 v1 為基準只算一次（reps 4 → 5）', () => {
    recordReviewResult('h_ka', true, 3000, 'good');
    const s = getStoredProgressV2().srsStates.h_ka;
    expect(s.reps).toBe(5);
    expect(s.consecutiveCorrect).toBe(1);
    expect(getStoredProgressV2().shadowLogs).toHaveLength(1);
  });

  it('只重建一次：之後的作答繼續累積，不再被重設', () => {
    recordReviewResult('h_ka', true, 3000, 'good');
    vi.setSystemTime(T0 + 10 * DAY);
    recordReviewResult('h_ka', true, 3000, 'good');
    const p = getStoredProgressV2();
    expect(p.srsStates.h_ka).toMatchObject({ reps: 6, consecutiveCorrect: 2 });
    expect(p.shadowLogs).toHaveLength(2);
  });
});

describe('CHG-006 M5：備份匯入（CHG-005）', () => {
  const progress = (reviewLevel: number): UserProgress => ({
    masteredKanaIds: [],
    wrongKanaIds: [],
    streakDays: 1,
    lastStudyDate: new Date(T0).toISOString().split('T')[0],
    reviewStates: {
      h_ta: {
        kanaId: 'h_ta', reviewLevel, correctCount: reviewLevel, wrongCount: 0,
        lastReviewedAt: new Date(T0).toISOString(), nextReviewAt: new Date(T0 + DAY).toISOString(),
      },
    },
  });

  it('沒有 progressV2 的備份：v2 依匯入的 v1 重建，本機原有的調適資料不殘留', () => {
    reviewTimes('h_ka', 3); // 本機已有調適歷史

    validateAndImportProgressData(JSON.stringify({ version: 1, kanaProgress: progress(2), jlptRecords: [] }));

    const p = getStoredProgressV2();
    expect(Object.keys(p.srsStates)).toEqual(['h_ta']);
    expect(p.shadowLogs).toEqual([]);
  });

  it('帶著修正前舊版 progressV2 的備份：匯入後讀取時一樣會被捨棄', () => {
    const file = {
      version: 2,
      kanaProgress: progress(1),
      jlptRecords: [],
      progressV2: { schemaVersion: 2, srsStates: { h_ta: { reps: 99 } }, shadowLogs: [{}, {}] },
    };
    validateAndImportProgressData(JSON.stringify(file));

    const p = getStoredProgressV2();
    expect(p.shadowLogs).toEqual([]);
    expect(p.srsStates.h_ta.reps).toBe(1);
  });

  it('帶著新版 progressV2 的備份：調適資料原樣還原', () => {
    reviewTimes('h_ka', 3);
    const exported = getStoredProgressV2();
    localStorage.clear();

    validateAndImportProgressData(
      JSON.stringify({ version: 2, kanaProgress: JSON.parse(JSON.stringify({ ...progress(0), reviewStates: {} })), jlptRecords: [], progressV2: exported }),
    );

    expect(getStoredProgressV2()).toEqual(exported);
  });
});
