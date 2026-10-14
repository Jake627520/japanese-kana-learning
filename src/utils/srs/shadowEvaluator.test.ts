import { describe, expect, it } from 'vitest';
import {
  appendShadowLog,
  clampResponseMs,
  getShadowEvaluationSummary,
  MAX_SHADOW_LOGS,
} from './shadowEvaluator';
import { SRSShadowLogEntry } from './types';

// 移植自 scripts/test-srs-shadow.py，改成直接執行 shadowEvaluator.ts 的真實實作。

const DAY_MS = 24 * 60 * 60 * 1000;

function makeLog(partial: Partial<SRSShadowLogEntry>): SRSShadowLogEntry {
  return {
    kanaId: 'a',
    timestamp: 1700000000000,
    rating: 'good',
    legacyNextReviewAt: '2023-11-15T22:13:20.000Z',
    adaptiveNextReviewAt: 1700000000000,
    legacyIntervalMs: DAY_MS,
    adaptiveIntervalMs: DAY_MS,
    stability: 1.0,
    difficulty: 5.0,
    ...partial,
  };
}

describe('clampResponseMs', () => {
  it('低於 100ms 夾到 100ms', () => {
    expect(clampResponseMs(15)).toBe(100);
  });

  it('高於 60000ms 夾到 60000ms', () => {
    expect(clampResponseMs(120000)).toBe(60000);
  });

  it('正常範圍原值保留', () => {
    expect(clampResponseMs(2450)).toBe(2450);
  });

  it('無效值（undefined、負數、0、非有限數）回傳 undefined', () => {
    expect(clampResponseMs(undefined)).toBeUndefined();
    expect(clampResponseMs(-500)).toBeUndefined();
    expect(clampResponseMs(0)).toBeUndefined();
    expect(clampResponseMs(Number.NaN)).toBeUndefined();
    expect(clampResponseMs(Number.POSITIVE_INFINITY)).toBeUndefined();
  });
});

describe('appendShadowLog', () => {
  it('最新一筆放在最前面，總數上限 200 筆', () => {
    let logs: SRSShadowLogEntry[] = [];
    for (let i = 0; i < 250; i++) {
      logs = appendShadowLog(logs, makeLog({ kanaId: `kana_${i}`, timestamp: 1700000000000 + i }));
    }
    expect(MAX_SHADOW_LOGS).toBe(200);
    expect(logs).toHaveLength(200);
    expect(logs[0].kanaId).toBe('kana_249');
    expect(logs[199].kanaId).toBe('kana_50');
  });

  it('純函式：不修改傳入的陣列', () => {
    const original = [makeLog({ kanaId: 'old' })];
    const next = appendShadowLog(original, makeLog({ kanaId: 'new' }));
    expect(original).toHaveLength(1);
    expect(next.map((l) => l.kanaId)).toEqual(['new', 'old']);
  });
});

describe('getShadowEvaluationSummary', () => {
  const mockLogs = [
    makeLog({ rating: 'good', stability: 2.0, difficulty: 4.9, legacyIntervalMs: 86400000, adaptiveIntervalMs: 172800000 }),
    makeLog({ rating: 'again', stability: 0.007, difficulty: 5.7, legacyIntervalMs: 600000, adaptiveIntervalMs: 600000 }),
    makeLog({ rating: 'easy', stability: 5.0, difficulty: 4.4, legacyIntervalMs: 259200000, adaptiveIntervalMs: 432000000 }),
    makeLog({ rating: 'good', stability: 3.0, difficulty: 5.0, legacyIntervalMs: 86400000, adaptiveIntervalMs: 172800000 }),
  ];

  it('評分分佈與 again 比率正確', () => {
    const summary = getShadowEvaluationSummary(mockLogs);
    expect(summary.totalReviews).toBe(4);
    expect(summary.ratingBreakdown.good).toEqual({ count: 2, percentage: 50 });
    expect(summary.ratingBreakdown.again).toEqual({ count: 1, percentage: 25 });
    expect(summary.againRate).toBe(0.25);
  });

  it('平均穩定度、難度、間隔差落在合理範圍', () => {
    const summary = getShadowEvaluationSummary(mockLogs);
    expect(summary.averageStability).toBeGreaterThan(0);
    expect(summary.averageDifficulty).toBeGreaterThanOrEqual(1.0);
    expect(summary.averageDifficulty).toBeLessThanOrEqual(10.0);
  });

  it('平均值的精確數字（手算：穩定度 10.007/4、難度 20/4、間隔差 1 天）', () => {
    const summary = getShadowEvaluationSummary(mockLogs);
    expect(summary.averageStability).toBe(2.5);
    expect(summary.averageDifficulty).toBe(5.0);
    expect(summary.averageIntervalDiffDays).toBe(1);
  });

  it('沒有紀錄時回傳預設值', () => {
    const summary = getShadowEvaluationSummary([]);
    expect(summary.totalReviews).toBe(0);
    expect(summary.againRate).toBe(0);
    expect(summary.averageDifficulty).toBe(5.0);
    expect(summary.ratingBreakdown.good).toEqual({ count: 0, percentage: 0 });
  });
});
