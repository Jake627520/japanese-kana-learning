import { describe, expect, it } from 'vitest';
import {
  calculateDifficulty,
  calculateElapsedDays,
  calculateInterval,
  calculateNextReviewAt,
  calculateStability,
  DEFAULT_MAX_INTERVAL_DAYS,
  scheduleAdaptiveReview,
  TEN_MINUTES_IN_DAYS,
} from './scheduler';
import { SRSStateV2 } from './types';

// 移植自 scripts/test-srs-scheduler.py，改成直接執行 scheduler.ts 的真實實作。

const DAY_MS = 24 * 60 * 60 * 1000;
const T0 = 1700000000000;

describe('calculateDifficulty', () => {
  it('依評分調整難度（again +0.8、hard +0.3、good -0.1、easy -0.5）', () => {
    expect(calculateDifficulty(5.0, 'again')).toBe(5.8);
    expect(calculateDifficulty(5.0, 'hard')).toBe(5.3);
    expect(calculateDifficulty(5.0, 'good')).toBe(4.9);
    expect(calculateDifficulty(5.0, 'easy')).toBe(4.5);
  });

  it('上限夾在 10.0', () => {
    expect(calculateDifficulty(9.8, 'again')).toBe(10.0);
    expect(calculateDifficulty(10.0, 'again')).toBe(10.0);
  });

  it('下限夾在 1.0', () => {
    expect(calculateDifficulty(1.2, 'easy')).toBe(1.0);
    expect(calculateDifficulty(1.0, 'easy')).toBe(1.0);
  });
});

describe('calculateElapsedDays', () => {
  it('沒有上次複習時間，或上次時間在未來，回傳 0', () => {
    expect(calculateElapsedDays(null, T0)).toBe(0);
    expect(calculateElapsedDays(undefined, T0)).toBe(0);
    expect(calculateElapsedDays(T0 + 1000, T0)).toBe(0);
  });

  it('同一時間點回傳 0', () => {
    expect(calculateElapsedDays(T0, T0)).toBe(0);
  });

  it('回傳精確的經過天數', () => {
    expect(calculateElapsedDays(T0, T0 + DAY_MS)).toBe(1);
    expect(calculateElapsedDays(T0, T0 + 10 * DAY_MS)).toBe(10);
  });
});

describe('calculateStability', () => {
  it('逾期後答對，穩定度成長大於準時答對', () => {
    const onTime = calculateStability(3.0, 5.0, 'good', 3.0);
    const overdue = calculateStability(3.0, 5.0, 'good', 10.0);
    expect(overdue).toBeGreaterThan(onTime);
  });

  it('again 不給逾期加成，一律重設並低於原穩定度', () => {
    const againOnTime = calculateStability(3.0, 5.0, 'again', 3.0);
    const againOverdue = calculateStability(3.0, 5.0, 'again', 10.0);
    expect(againOnTime).toBe(againOverdue);
    expect(againOnTime).toBeLessThan(3.0);
  });
});

describe('calculateInterval', () => {
  it('again 回到 10 分鐘', () => {
    expect(calculateInterval(5.0, 'again')).toBeCloseTo(TEN_MINUTES_IN_DAYS, 4);
  });

  it('hard 0.85 倍、good 1.0 倍、easy 1.3 倍', () => {
    expect(calculateInterval(10.0, 'hard')).toBeCloseTo(8.5, 2);
    expect(calculateInterval(10.0, 'good')).toBeCloseTo(10.0, 2);
    expect(calculateInterval(10.0, 'easy')).toBeCloseTo(13.0, 2);
  });

  it('套用 maxIntervalDays 上限（預設 365 天）', () => {
    expect(DEFAULT_MAX_INTERVAL_DAYS).toBe(365);
    expect(calculateInterval(500.0, 'easy')).toBe(365);
    expect(calculateInterval(500.0, 'easy', { maxIntervalDays: 365 })).toBe(365);
    expect(calculateInterval(100.0, 'good', { maxIntervalDays: 60 })).toBe(60);
  });
});

describe('calculateNextReviewAt', () => {
  it('把天數換成毫秒加到複習時間上，且至少 +1ms', () => {
    expect(calculateNextReviewAt(T0, 1)).toBe(T0 + DAY_MS);
    expect(calculateNextReviewAt(T0, TEN_MINUTES_IN_DAYS)).toBe(T0 + 10 * 60 * 1000);
    expect(calculateNextReviewAt(T0, 0)).toBe(T0 + 1);
  });
});

describe('scheduleAdaptiveReview', () => {
  const existing: SRSStateV2 = {
    version: 2,
    kanaId: 'sa',
    due: T0,
    lastReview: T0 - 3 * DAY_MS,
    stability: 3.0,
    difficulty: 5.0,
    reps: 2,
    lapses: 0,
    consecutiveCorrect: 2,
  };

  it('相同輸入得到相同輸出（決定性）', () => {
    expect(scheduleAdaptiveReview(existing, 'good', T0)).toEqual(
      scheduleAdaptiveReview(existing, 'good', T0)
    );
  });

  it('純函式：不修改傳入的 state', () => {
    const snapshot = structuredClone(existing);
    scheduleAdaptiveReview(existing, 'again', T0);
    scheduleAdaptiveReview(existing, 'easy', T0);
    expect(existing).toEqual(snapshot);
  });

  it('既有卡片會把經過時間算進穩定度（逾期加成）', () => {
    const onTime = scheduleAdaptiveReview(existing, 'good', T0);
    const overdue = scheduleAdaptiveReview(existing, 'good', T0 + 7 * DAY_MS);
    expect(overdue.state.stability).toBeGreaterThan(onTime.state.stability);
  });
});
