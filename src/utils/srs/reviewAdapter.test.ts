import { describe, expect, it } from 'vitest';
import { SRS_MODE } from './index';
import { LegacySRSEngine } from './engine';
import { applyReviewResult, buildReviewInput, mapQuizResultToRating } from './reviewAdapter';
import { UserProgressV2 } from './types';

// 移植自 scripts/test-srs-review-adapter.py，改成直接執行 reviewAdapter.ts 的真實實作。

const DAY_MS = 24 * 60 * 60 * 1000;
const T0 = 1700000000000;

function baseProgress(): UserProgressV2 {
  return {
    schemaVersion: 2,
    masteredKanaIds: [],
    wrongKanaIds: [],
    streakDays: 1,
    lastStudyDate: '2026-08-28',
    srsStates: {},
  };
}

describe('功能旗標', () => {
  it('SRS_MODE 預設為 legacy', () => {
    expect(SRS_MODE).toBe('legacy');
  });
});

describe('mapQuizResultToRating', () => {
  it('手動評分優先於答對與否', () => {
    expect(mapQuizResultToRating(false, undefined, 'easy')).toBe('easy');
    expect(mapQuizResultToRating(true, undefined, 'hard')).toBe('hard');
  });

  it('答錯 → again', () => {
    expect(mapQuizResultToRating(false, 500)).toBe('again');
  });

  it('快速答對（< 1200ms）→ easy', () => {
    expect(mapQuizResultToRating(true, 800)).toBe('easy');
  });

  it('緩慢答對（> 6000ms）→ hard', () => {
    expect(mapQuizResultToRating(true, 7500)).toBe('hard');
  });

  it('正常速度或沒有時間資料 → good', () => {
    expect(mapQuizResultToRating(true, 2500)).toBe('good');
    expect(mapQuizResultToRating(true, undefined)).toBe('good');
  });
});

describe('buildReviewInput', () => {
  it('填入 rating、kanaId、reviewedAt/now，並夾住 responseMs', () => {
    expect(buildReviewInput('good', 'a', T0, 15)).toEqual({
      rating: 'good',
      kanaId: 'a',
      reviewedAt: T0,
      now: T0,
      responseMs: 100,
    });
    expect(buildReviewInput('hard', 'b', T0).responseMs).toBeUndefined();
  });
});

describe('applyReviewResult', () => {
  it('多步驟：again → good → easy，且不修改輸入', () => {
    const base = baseProgress();

    // 第 1 次：again
    const p1 = applyReviewResult(base, 'a', 'again', T0);
    expect(Object.keys(base.srsStates)).toHaveLength(0);
    expect(base.wrongKanaIds).toHaveLength(0);
    expect(p1.srsStates.a.reps).toBe(1);
    expect(p1.srsStates.a.lapses).toBe(1);
    expect(p1.srsStates.a.consecutiveCorrect).toBe(0);
    expect(p1.wrongKanaIds).toContain('a');

    // 第 2 次：good（10 分鐘後）
    const t1 = T0 + 10 * 60 * 1000;
    const p2 = applyReviewResult(p1, 'a', 'good', t1);
    expect(p2.srsStates.a.reps).toBe(2);
    expect(p2.srsStates.a.lapses).toBe(1);
    expect(p2.srsStates.a.consecutiveCorrect).toBe(1);
    expect(p2.srsStates.a.stability).toBeGreaterThan(p1.srsStates.a.stability);

    // 第 3 次：easy（間隔一個穩定度之後）
    const t2 = t1 + Math.trunc(p2.srsStates.a.stability * DAY_MS);
    const p3 = applyReviewResult(p2, 'a', 'easy', t2);
    expect(p3.srsStates.a.reps).toBe(3);
    expect(p3.srsStates.a.consecutiveCorrect).toBe(2);
    expect(p3.srsStates.a.stability).toBeGreaterThan(p2.srsStates.a.stability);

    // 前一步的物件沒有被改動
    expect(p1.srsStates.a.reps).toBe(1);
    expect(p2.srsStates.a.reps).toBe(2);
  });

  it('due 在複習時間之後，wrongKanaIds 不重複加入', () => {
    const p1 = applyReviewResult(baseProgress(), 'a', 'again', T0);
    const p2 = applyReviewResult(p1, 'a', 'again', T0 + 1000);
    expect(p2.srsStates.a.due).toBeGreaterThan(T0 + 1000);
    expect(p2.wrongKanaIds).toEqual(['a']);
  });

  it('寫入一筆 shadow log，比較 adaptive 與 legacy 的間隔', () => {
    const p = applyReviewResult(baseProgress(), 'a', 'good', T0, 2500);
    expect(p.shadowLogs).toHaveLength(1);
    const log = p.shadowLogs![0];
    expect(log.kanaId).toBe('a');
    expect(log.rating).toBe('good');
    expect(log.responseMs).toBe(2500);
    expect(log.adaptiveIntervalMs).toBe(DAY_MS);
    expect(log.legacyIntervalMs).toBe(DAY_MS);
    expect(log.legacyNextReviewAt).toBe(new Date(T0 + DAY_MS).toISOString());
  });

  it('可注入其他引擎', () => {
    const p = applyReviewResult(baseProgress(), 'a', 'easy', T0, undefined, new LegacySRSEngine());
    expect(p.srsStates.a.stability).toBe(1);
  });
});
