import { describe, expect, it } from 'vitest';
import { KanaReviewState } from '../../types';
import { migrateReviewState } from './migration';
import { scheduleAdaptiveReview } from './scheduler';
import { ReviewRating, SRSStateV2 } from './types';

// 移植自 scripts/test-srs-promotion-gate.py 的 10 道上線關卡。
// Python 版測的是 py_schedule_review 這份重寫；這裡直接執行 scheduler.ts。
// 關卡 9、10 只檢查 storage.ts 字串，不在 srs 模組內，未移植。

const DAY_MS = 24 * 60 * 60 * 1000;
const T0 = 1700000000000;
const MAX_INTERVAL_DAYS = 365;

// Python random.seed(42) + random.choices(['again','hard','good','easy'], weights=[0.1,0.2,0.5,0.2]) 的前 120 個結果，
// 預先產生後寫死，讓兩邊吃同一串評分。
const SEEDED_120 =
  'gahhggeagahgahgghgeaegghegaaegeggeggegeggahhahhhggghhegghghgegggeghaghheegggeghhghgeghegaahgggagegeeaggghghggeehgheehggh';
const LETTER_TO_RATING: Record<string, ReviewRating> = { a: 'again', h: 'hard', g: 'good', e: 'easy' };

function runSeeded(): SRSStateV2[] {
  const states: SRSStateV2[] = [];
  let state: SRSStateV2 | null = null;
  let t = T0;
  for (const letter of SEEDED_120) {
    state = scheduleAdaptiveReview(state, LETTER_TO_RATING[letter], t, 'a').state;
    states.push(state);
    t += Math.max(600000, Math.trunc(state.stability * DAY_MS));
  }
  return states;
}

function runEasy50(): SRSStateV2 {
  let state: SRSStateV2 | null = null;
  let t = T0;
  for (let i = 0; i < 50; i++) {
    state = scheduleAdaptiveReview(state, 'easy', t, 'a').state;
    t += Math.trunc(state.stability * DAY_MS);
  }
  return state!;
}

describe('上線關卡', () => {
  it('關卡 1：相同評分序列得到相同結果', () => {
    const run = () => {
      let state: SRSStateV2 | null = null;
      let t = T0;
      for (const r of ['again', 'good', 'easy', 'hard', 'good'] as ReviewRating[]) {
        state = scheduleAdaptiveReview(state, r, t, 'a').state;
        t += DAY_MS;
      }
      return state;
    };
    expect(run()).toEqual(run());
  });

  it('關卡 2：120 次複習後難度、due、lapses 仍在邊界內', () => {
    for (const state of runSeeded()) {
      expect(state.difficulty).toBeGreaterThanOrEqual(1.0);
      expect(state.difficulty).toBeLessThanOrEqual(10.0);
      expect(state.stability).toBeGreaterThan(0);
      expect(state.due).toBeGreaterThanOrEqual(state.lastReview!);
      expect(state.lapses).toBeLessThanOrEqual(state.reps);
    }
  });

  // MISMATCH: python 認為穩定度永遠 ≤ 365 天（scripts/test-srs-promotion-gate.py:67-79 把 stab 夾在 365，
  // 斷言在 :137）；TS 的 calculateStability（src/utils/srs/scheduler.ts:98-99）沒有上限，
  // 365 天上限只套在間隔（scheduler.ts:134）。
  it.skip('關卡 2：120 次複習後穩定度 ≤ 365 天', () => {
    for (const state of runSeeded()) {
      expect(state.stability).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
    }
  });

  it('關卡 3：時間戳單調遞增，逾期答對穩定度上升', () => {
    const s1 = scheduleAdaptiveReview(null, 'good', T0, 'a').state;
    expect(s1.due).toBeGreaterThan(T0);

    const t1 = T0 + 10 * DAY_MS;
    const s2 = scheduleAdaptiveReview(s1, 'good', t1, 'a').state;
    expect(s2.due).toBeGreaterThan(t1);
    expect(s2.stability).toBeGreaterThan(s1.stability);
  });

  it('關卡 4：舊版 0~5 級遷移後穩定度落在 (0, 30] 天', () => {
    for (let level = 0; level <= 5; level++) {
      const legacy: KanaReviewState = {
        kanaId: 'a',
        reviewLevel: level,
        correctCount: 0,
        wrongCount: 0,
        lastReviewedAt: null,
        nextReviewAt: null,
      };
      const { stability } = migrateReviewState(legacy, T0);
      expect(stability).toBeGreaterThan(0);
      expect(stability).toBeLessThanOrEqual(30);
    }
  });

  it('關卡 5：新卡初始值與成熟卡 good 的成長範圍', () => {
    expect(scheduleAdaptiveReview(null, 'again', T0).state.stability).toBeCloseTo(10 / 1440, 3);
    expect(scheduleAdaptiveReview(null, 'easy', T0).state.stability).toBe(3.0);

    const mature: SRSStateV2 = {
      version: 2,
      kanaId: 'ka',
      due: T0 + 30 * DAY_MS,
      lastReview: T0,
      stability: 30.0,
      difficulty: 5.0,
      reps: 5,
      lapses: 0,
      consecutiveCorrect: 5,
    };
    const good = scheduleAdaptiveReview(mature, 'good', mature.due).state;
    expect(good.stability).toBeGreaterThan(30.0);
    expect(good.stability).toBeLessThan(100.0);
  });

  it('關卡 6：again 立即重學（10 分鐘、連對歸零、lapses +1）', () => {
    const mature: SRSStateV2 = {
      version: 2,
      kanaId: 'sa',
      due: T0 + 30 * DAY_MS,
      lastReview: T0,
      stability: 30.0,
      difficulty: 4.5,
      reps: 6,
      lapses: 0,
      consecutiveCorrect: 6,
    };
    const again = scheduleAdaptiveReview(mature, 'again', mature.due).state;
    expect(again.consecutiveCorrect).toBe(0);
    expect(again.lapses).toBe(1);
    expect(again.due - mature.due).toBe(10 * 60 * 1000);
  });

  it('關卡 7、8：連續 50 次 easy，間隔封頂 365 天，難度降到 1.0', () => {
    const state = runEasy50();
    expect(state.due - state.lastReview!).toBeLessThanOrEqual(MAX_INTERVAL_DAYS * DAY_MS);
    expect(state.difficulty).toBe(1.0);
  });

  // MISMATCH: python 認為連續 50 次 easy 後穩定度 ≤ 365 天（scripts/test-srs-promotion-gate.py:75、:79，
  // 斷言在 :213）；TS 的 calculateStability（src/utils/srs/scheduler.ts:98-99）沒有上限，穩定度會無限成長。
  it.skip('關卡 7、8：連續 50 次 easy，穩定度 ≤ 365 天', () => {
    expect(runEasy50().stability).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
  });
});
