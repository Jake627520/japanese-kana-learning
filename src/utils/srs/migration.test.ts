import { describe, expect, it } from 'vitest';
import { KanaReviewState, UserProgress } from '../../types';
import { LEGACY_LEVEL_STABILITY_DAYS, migrateReviewState, migrateUserProgress } from './migration';

// 移植自 scripts/test-srs-migration.py 與 scripts/test-srs-storage.py 的遷移部分，
// 改成直接執行 migration.ts 的真實實作。

const NOW = 1700000000000;

// 模擬損壞或缺欄位的舊資料，型別上刻意不完整
function legacy(partial: Record<string, unknown>): KanaReviewState {
  return partial as unknown as KanaReviewState;
}

describe('LEGACY_LEVEL_STABILITY_DAYS', () => {
  it('舊版 0~5 級對應 10 分鐘、1、3、7、14、30 天', () => {
    expect(LEGACY_LEVEL_STABILITY_DAYS).toEqual({
      0: 10 / (24 * 60),
      1: 1,
      2: 3,
      3: 7,
      4: 14,
      5: 30,
    });
  });
});

describe('migrateReviewState', () => {
  it('Level 0：10 分鐘穩定度、中性難度 5、reps/lapses 為 0', () => {
    const s = migrateReviewState(legacy({ kanaId: 'a', reviewLevel: 0, correctCount: 0, wrongCount: 0 }), NOW);
    expect(s.version).toBe(2);
    expect(s.kanaId).toBe('a');
    expect(s.stability).toBeCloseTo(10 / 1440, 4);
    expect(s.reps).toBe(0);
    expect(s.lapses).toBe(0);
    expect(s.consecutiveCorrect).toBe(0);
    expect(s.difficulty).toBe(5);
  });

  it('Level 3：reps = 答對 + 答錯，lapses = 答錯', () => {
    const s = migrateReviewState(legacy({ kanaId: 'i', reviewLevel: 3, correctCount: 4, wrongCount: 1 }), NOW);
    expect(s.stability).toBe(7.0);
    expect(s.reps).toBe(5);
    expect(s.lapses).toBe(1);
    expect(s.consecutiveCorrect).toBe(0);
  });

  it('Level 5：30 天穩定度', () => {
    const s = migrateReviewState(legacy({ kanaId: 'u', reviewLevel: 5, correctCount: 10, wrongCount: 0 }), NOW);
    expect(s.stability).toBe(30.0);
    expect(s.reps).toBe(10);
    expect(s.lapses).toBe(0);
    expect(s.consecutiveCorrect).toBe(0);
  });

  it('大量答對也不推估 consecutiveCorrect（固定為 0）', () => {
    const s = migrateReviewState(legacy({ kanaId: 'ka', reviewLevel: 4, correctCount: 100, wrongCount: 0 }), NOW);
    expect(s.reps).toBe(100);
    expect(s.lapses).toBe(0);
    expect(s.consecutiveCorrect).toBe(0);
  });

  it('全部答錯：lapses = reps', () => {
    const s = migrateReviewState(legacy({ kanaId: 'ko', reviewLevel: 0, correctCount: 0, wrongCount: 100 }), NOW);
    expect(s.reps).toBe(100);
    expect(s.lapses).toBe(100);
  });

  it('等級超出範圍時夾到 0~5', () => {
    expect(migrateReviewState(legacy({ kanaId: 'ki', reviewLevel: -1 }), NOW).stability).toBeCloseTo(10 / 1440, 4);
    expect(migrateReviewState(legacy({ kanaId: 'ku', reviewLevel: 99 }), NOW).stability).toBe(30.0);
  });

  it('缺 kanaId 時用 unknown', () => {
    expect(migrateReviewState(legacy({}), NOW).kanaId).toBe('unknown');
  });

  it('無效日期：lastReview 為 null，due 回退到 now', () => {
    const s = migrateReviewState(
      legacy({ kanaId: 'ke', lastReviewedAt: 'invalid-date-format', nextReviewAt: 'gibberish' }),
      NOW
    );
    expect(s.lastReview).toBeNull();
    expect(s.due).toBe(NOW);
  });

  it('ISO 字串轉成 epoch ms', () => {
    const s = migrateReviewState(
      legacy({
        kanaId: 'a',
        reviewLevel: 1,
        correctCount: 1,
        wrongCount: 0,
        lastReviewedAt: '2026-08-28T00:00:00.000Z',
        nextReviewAt: '2026-08-29T00:00:00.000Z',
      }),
      NOW
    );
    expect(s.lastReview).toBe(Date.UTC(2026, 7, 28));
    expect(s.due).toBe(Date.UTC(2026, 7, 29));
  });

  it('純函式：不修改舊資料', () => {
    const input = legacy({ kanaId: 'a', reviewLevel: 2, correctCount: 2, wrongCount: 1, lastReviewedAt: null, nextReviewAt: null });
    const snapshot = structuredClone(input);
    migrateReviewState(input, NOW);
    expect(input).toEqual(snapshot);
  });
});

describe('migrateUserProgress', () => {
  const v1: UserProgress = {
    masteredKanaIds: ['a', 'i'],
    wrongKanaIds: ['u'],
    streakDays: 5,
    lastStudyDate: '2026-08-28',
    reviewStates: {
      a: {
        kanaId: 'a',
        reviewLevel: 3,
        correctCount: 3,
        wrongCount: 0,
        lastReviewedAt: '2026-08-28T00:00:00.000Z',
        nextReviewAt: '2026-09-04T00:00:00.000Z',
      },
    },
  };

  it('v1 轉成 schemaVersion 2，保留舊欄位與 reviewStates', () => {
    const v2 = migrateUserProgress(v1, NOW);
    expect(v2.schemaVersion).toBe(2);
    expect(v2.masteredKanaIds).toEqual(['a', 'i']);
    expect(v2.wrongKanaIds).toEqual(['u']);
    expect(v2.streakDays).toBe(5);
    expect(v2.lastStudyDate).toBe('2026-08-28');
    expect(v2.srsStates.a.stability).toBe(7.0);
    expect(v2.srsStates.a.consecutiveCorrect).toBe(0);
    expect(v2.reviewStates).toEqual(v1.reviewStates);
  });

  it('純函式：不修改 v1 輸入', () => {
    const snapshot = structuredClone(v1);
    const v2 = migrateUserProgress(v1, NOW);
    v2.masteredKanaIds.push('x');
    expect(v1).toEqual(snapshot);
  });

  it('streakDays 小於 1 或缺漏時改為 1；缺 lastStudyDate 時用 now 的日期', () => {
    const v2 = migrateUserProgress({ masteredKanaIds: [], wrongKanaIds: [], streakDays: 0, lastStudyDate: '' }, NOW);
    expect(v2.streakDays).toBe(1);
    expect(v2.lastStudyDate).toBe('2023-11-14');
    expect(v2.srsStates).toEqual({});
  });
});
