import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getStoredProgress,
  saveProgress,
  recordReviewResult,
  getDueReviewItems,
  removeKanaFromWrong,
  REVIEW_INTERVALS,
} from './storage';
import { ALL_LEARNABLE_KANA } from '../data/kanaData';

// 取代 scripts/test-phase-b7.py Test 7：原本只確認 storage.ts 裡有
// recordReviewResult / getDueReviewItems / removeKanaFromWrong 與三個欄位名稱。
// 這裡改成實際操作這些函式，確認 masteredKanaIds / wrongKanaIds / reviewStates 的行為。

const NOW = new Date('2026-08-27T02:00:00.000Z').getTime();
const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  saveProgress({
    masteredKanaIds: ['h_a'],
    wrongKanaIds: [],
    streakDays: 3,
    lastStudyDate: new Date(NOW).toISOString().split('T')[0],
    reviewStates: {},
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('recordReviewResult', () => {
  it('答錯：加入 wrongKanaIds（不重複），等級維持 0，10 分鐘後到期', () => {
    recordReviewResult('h_ka', false);
    const p = recordReviewResult('h_ka', false);

    expect(p.wrongKanaIds).toEqual(['h_ka']);
    expect(p.masteredKanaIds).toEqual(['h_a']);
    expect(p.reviewStates?.h_ka).toEqual({
      kanaId: 'h_ka',
      reviewLevel: 0,
      correctCount: 0,
      wrongCount: 2,
      lastReviewedAt: new Date(NOW).toISOString(),
      nextReviewAt: new Date(NOW + 10 * MIN).toISOString(),
    });
    expect(getStoredProgress()).toEqual(p);
  });

  it('答對：等級 +1，依 REVIEW_INTERVALS 排下一次（等級 1 = 1 天），不會移出 wrongKanaIds', () => {
    recordReviewResult('h_ka', false);
    const p = recordReviewResult('h_ka', true);
    expect(REVIEW_INTERVALS[1]).toBe(DAY);
    expect(p.reviewStates?.h_ka).toMatchObject({
      reviewLevel: 1,
      correctCount: 1,
      wrongCount: 1,
      nextReviewAt: new Date(NOW + DAY).toISOString(),
    });
    expect(p.wrongKanaIds).toEqual(['h_ka']);
  });

  it('等級上限 5', () => {
    let p = getStoredProgress();
    for (let i = 0; i < 7; i++) p = recordReviewResult('h_ki', true);
    expect(p.reviewStates?.h_ki.reviewLevel).toBe(5);
  });
});

describe('getDueReviewItems（legacy 模式，讀 reviewStates）', () => {
  it('nextReviewAt <= 現在才到期', () => {
    recordReviewResult('h_ka', false); // 10 分鐘後到期
    const ka = ALL_LEARNABLE_KANA.filter((k) => k.id === 'h_ka');

    expect(getDueReviewItems(ka, getStoredProgress())).toEqual([]);

    vi.setSystemTime(NOW + 10 * MIN);
    expect(getDueReviewItems(ka, getStoredProgress()).map((k) => k.id)).toEqual(['h_ka']);
  });

  it('沒有 reviewState 的假名不算到期', () => {
    expect(getDueReviewItems(ALL_LEARNABLE_KANA, getStoredProgress())).toEqual([]);
  });
});

describe('removeKanaFromWrong', () => {
  it('只移除指定的字，其他欄位不動', () => {
    recordReviewResult('h_ka', false);
    recordReviewResult('h_ki', false);
    const p = removeKanaFromWrong('h_ka');
    expect(p.wrongKanaIds).toEqual(['h_ki']);
    expect(p.masteredKanaIds).toEqual(['h_a']);
    expect(Object.keys(p.reviewStates ?? {}).sort()).toEqual(['h_ka', 'h_ki']);
    expect(getStoredProgress().wrongKanaIds).toEqual(['h_ki']);
  });
});
