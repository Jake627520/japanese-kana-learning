import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AdaptiveSRSEngine,
  calculateNextAdaptiveState,
  getSRSEngine,
  LegacySRSEngine,
  ratingFromCorrectness,
  scheduleAdaptiveReview,
} from './engine';
import { ReviewRating, SRSStateV2 } from './types';

// 移植自 scripts/test-srs-engine.py，以及 scripts/test-srs-storage.py 的舊版排程回歸測試。
// Python 版測的是 py_calculate_adaptive_state 這份重寫；這裡直接執行 engine.ts。

const DAY_MS = 24 * 60 * 60 * 1000;
const TEN_MIN_MS = 10 * 60 * 1000;
const NOW = 1700000000000;
const RATINGS: ReviewRating[] = ['again', 'hard', 'good', 'easy'];

function makeState(partial: Partial<SRSStateV2>): SRSStateV2 {
  return {
    version: 2,
    kanaId: 'ka',
    due: NOW,
    lastReview: NOW - DAY_MS,
    stability: 1.0,
    difficulty: 5.0,
    reps: 3,
    lapses: 0,
    consecutiveCorrect: 3,
    ...partial,
  };
}

const adaptive = new AdaptiveSRSEngine();

describe('引擎合約', () => {
  it('四種評分都能排程（取代 types.ts 字串檢查）', () => {
    for (const rating of RATINGS) {
      const result = adaptive.review(null, { rating, reviewedAt: NOW, kanaId: 'a' });
      expect(result.state.kanaId).toBe('a');
      expect(result.nextReviewAt).toBeGreaterThan(NOW);
    }
  });

  it('getSRSEngine 依模式回傳對應引擎，預設與 shadow 都用 legacy', () => {
    expect(getSRSEngine('adaptive')).toBeInstanceOf(AdaptiveSRSEngine);
    expect(getSRSEngine('legacy')).toBeInstanceOf(LegacySRSEngine);
    expect(getSRSEngine('shadow')).toBeInstanceOf(LegacySRSEngine);
    expect(getSRSEngine()).toBeInstanceOf(LegacySRSEngine);
  });

  it('calculateNextAdaptiveState 是 scheduleAdaptiveReview 的別名', () => {
    expect(calculateNextAdaptiveState).toBe(scheduleAdaptiveReview);
  });

  it('ratingFromCorrectness：答對 good、答錯 again', () => {
    expect(ratingFromCorrectness(true)).toBe('good');
    expect(ratingFromCorrectness(false)).toBe('again');
  });

  it('nextReviewAt 與 due 相同（相容別名）', () => {
    const result = adaptive.review(null, { rating: 'good', reviewedAt: NOW });
    expect(result.due).toBe(result.nextReviewAt);
    expect(result.state.due).toBe(result.nextReviewAt);
  });
});

describe('AdaptiveSRSEngine：新卡初始排程', () => {
  it('again → 10 分鐘，lapses 1，連對 0', () => {
    const { state } = adaptive.review(null, { rating: 'again', reviewedAt: NOW, kanaId: 'a' });
    expect(state.stability).toBeCloseTo(10 / 1440, 4);
    expect(state.due).toBe(NOW + TEN_MIN_MS);
    expect(state.lapses).toBe(1);
    expect(state.consecutiveCorrect).toBe(0);
  });

  // CHG-006 M1 回歸測試：首次複習固定 1 天。修正前誤乘 hard 倍率 0.85，得到 0.85 天。
  it('hard → 1 天，連對 1', () => {
    const { state } = adaptive.review(null, { rating: 'hard', reviewedAt: NOW, kanaId: 'a' });
    expect(state.stability).toBe(1.0);
    expect(state.due).toBe(NOW + DAY_MS);
    expect(state.consecutiveCorrect).toBe(1);
  });

  it('hard → 穩定度 1、連對 1（不含 due 的部分）', () => {
    const { state } = adaptive.review(null, { rating: 'hard', reviewedAt: NOW, kanaId: 'a' });
    expect(state.stability).toBe(1.0);
    expect(state.consecutiveCorrect).toBe(1);
  });

  it('good → 1 天，連對 1', () => {
    const { state } = adaptive.review(null, { rating: 'good', reviewedAt: NOW, kanaId: 'a' });
    expect(state.stability).toBe(1.0);
    expect(state.due).toBe(NOW + DAY_MS);
    expect(state.consecutiveCorrect).toBe(1);
  });

  // CHG-006 M2 回歸測試：首次複習固定 3 天。修正前誤乘 easy 倍率 1.3，得到 3.9 天。
  it('easy → 3 天，連對 1', () => {
    const { state } = adaptive.review(null, { rating: 'easy', reviewedAt: NOW, kanaId: 'a' });
    expect(state.stability).toBe(3.0);
    expect(state.due).toBe(NOW + 3 * DAY_MS);
    expect(state.consecutiveCorrect).toBe(1);
  });

  it('easy → 穩定度 3、連對 1（不含 due 的部分）', () => {
    const { state } = adaptive.review(null, { rating: 'easy', reviewedAt: NOW, kanaId: 'a' });
    expect(state.stability).toBe(3.0);
    expect(state.consecutiveCorrect).toBe(1);
  });
});

describe('AdaptiveSRSEngine：不變量（難度 1~10 × 穩定度 0.5~30 天）', () => {
  for (const difficulty of [1.0, 3.0, 5.0, 7.0, 10.0]) {
    for (const stability of [0.5, 1.0, 3.0, 7.0, 14.0, 30.0]) {
      it(`difficulty=${difficulty}, stability=${stability}`, () => {
        const base = makeState({ stability, difficulty });
        const [again, hard, good, easy] = RATINGS.map(
          (rating) => adaptive.review(base, { rating, reviewedAt: NOW }).state
        );

        // again 不會提高穩定度，連對歸零、lapses +1
        expect(again.stability).toBeLessThanOrEqual(base.stability);
        expect(again.consecutiveCorrect).toBe(0);
        expect(again.lapses).toBe(base.lapses + 1);

        // easy > good > hard > again
        expect(good.stability).toBeGreaterThan(hard.stability);
        expect(hard.stability).toBeGreaterThan(again.stability);
        expect(easy.stability).toBeGreaterThan(good.stability);

        for (const s of [again, hard, good, easy]) {
          expect(s.stability).toBeGreaterThan(0);
          expect(s.due).toBeGreaterThan(NOW);
          expect(s.difficulty).toBeGreaterThanOrEqual(1.0);
          expect(s.difficulty).toBeLessThanOrEqual(10.0);
        }
      });
    }
  }
});

describe('AdaptiveSRSEngine：決定性與難度邊界', () => {
  it('相同輸入得到相同輸出', () => {
    const state = makeState({ kanaId: 'sa', stability: 3.5, difficulty: 5.0, reps: 2, consecutiveCorrect: 2, lastReview: null });
    const r1 = adaptive.review(state, { rating: 'good', reviewedAt: NOW });
    const r2 = adaptive.review(state, { rating: 'good', reviewedAt: NOW });
    expect(r1).toEqual(r2);
  });

  it('連續答錯的卡難度不超過 10.0', () => {
    const state = makeState({ kanaId: 'ta', stability: 1.0, difficulty: 9.8, reps: 5, lapses: 3, consecutiveCorrect: 0 });
    expect(adaptive.review(state, { rating: 'again', reviewedAt: NOW }).state.difficulty).toBe(10.0);
  });

  it('連續 easy 的卡難度不低於 1.0', () => {
    const state = makeState({ kanaId: 'na', stability: 10.0, difficulty: 1.2, reps: 5, consecutiveCorrect: 5 });
    expect(adaptive.review(state, { rating: 'easy', reviewedAt: NOW }).state.difficulty).toBe(1.0);
  });
});

describe('時鐘來源', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('沒給 reviewedAt 時改用 now 別名，兩者都沒有才讀系統時鐘', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const engine = new LegacySRSEngine();
    expect(engine.review(null, { rating: 'good', now: NOW + 5 }).state.lastReview).toBe(NOW + 5);
    expect(engine.review(null, { rating: 'good' }).state.lastReview).toBe(NOW);
    expect(adaptive.review(null, { rating: 'good' }).state.lastReview).toBe(NOW);
  });
});

describe('LegacySRSEngine：舊版六階排程回歸', () => {
  const legacy = new LegacySRSEngine();
  const INTERVALS_MS = [TEN_MIN_MS, DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS, 30 * DAY_MS];

  function run(state: SRSStateV2 | null, correct: boolean) {
    return legacy.review(state, { rating: correct ? 'good' : 'again', reviewedAt: NOW, kanaId: 'ta' });
  }

  it('新卡答對 → 第 1 級（1 天），reps 1、穩定度 1、連對 1', () => {
    const r = run(null, true);
    expect(r.nextReviewAt).toBe(NOW + DAY_MS);
    expect(r.state.reps).toBe(1);
    expect(r.state.stability).toBe(1.0);
    expect(r.state.consecutiveCorrect).toBe(1);
  });

  it('逐級上升的間隔依序為 1、3、7、14、30 天，第 5 級封頂', () => {
    let state: SRSStateV2 | null = null;
    const seen: number[] = [];
    for (let i = 0; i < 10; i++) {
      const r = run(state, true);
      seen.push(r.nextReviewAt - NOW);
      state = r.state;
    }
    expect(seen.slice(0, 5)).toEqual(INTERVALS_MS.slice(1));
    expect(seen.slice(5)).toEqual(Array(5).fill(30 * DAY_MS));
  });

  it('答錯降一級並累計 lapses；第 0 級封底為 10 分鐘', () => {
    let state: SRSStateV2 | null = run(run(null, true).state, true).state; // 第 2 級
    const down = run(state, false);
    expect(down.nextReviewAt - NOW).toBe(DAY_MS); // 降到第 1 級
    expect(down.state.lapses).toBe(1);
    expect(down.state.consecutiveCorrect).toBe(0);

    state = down.state;
    for (let i = 0; i < 10; i++) state = run(state, false).state;
    expect(state.due - NOW).toBe(TEN_MIN_MS);
    expect(state.lapses).toBe(11);
  });

  it('getNextDue = lastReview + 穩定度換成的毫秒', () => {
    const state = makeState({ stability: 7, lastReview: NOW });
    expect(legacy.getNextDue(state, 0)).toBe(NOW + 7 * DAY_MS);
    expect(legacy.getNextDue(makeState({ stability: 1, lastReview: null }), NOW)).toBe(NOW + DAY_MS);
  });
});
