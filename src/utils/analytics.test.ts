import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getTodayStats,
  getSevenDayTrend,
  getWeakKanaRanking,
  getAIRecommendation,
  getListeningWeaknesses,
  getConfusionWeaknesses,
  getConfusionMasterySummary,
} from './analytics';
import { LearningEvent } from '../types/learning';
import { AIRecommendation } from '../types/analytics';
import { UserProgress, KanaReviewState } from '../types';
import { ConfusableGroup } from '../data/confusableData';
import { zhTW } from '../i18n/zh-TW';
import { zhCN } from '../i18n/zh-CN';
import { en } from '../i18n/en';

// 取代 scripts/test-analytics.py、test-b8-manual-qa.py、test-listening-weakness.py（推薦部分）、
// test-c1-3-manual-qa.py（QA-1/2/3）、test-c1-4.py（evidence）。
// 原腳本只比對字串或在 Python 重寫一次演算法；這裡直接呼叫真的 analytics.ts。
// 所有日期都用本地時間建構，跟 analytics.ts 的 toLocalDateString 一致，與機器時區無關。

const NOW_DATE = new Date(2026, 7, 27, 10, 0, 0); // 2026-08-27 10:00 本地
const NOW = NOW_DATE.getTime();
const at = (y: number, m: number, d: number, h = 12, min = 0, s = 0, ms = 0) =>
  new Date(y, m - 1, d, h, min, s, ms).getTime();

let seq = 0;
function ev(p: Partial<LearningEvent> & Pick<LearningEvent, 'type' | 'source'>): LearningEvent {
  seq += 1;
  return { id: `e${seq}`, timestamp: NOW, ...p };
}
const quiz = (kanaId: string, correct: boolean, extra: Partial<LearningEvent> = {}) =>
  ev({ type: 'quiz_answer', source: 'quiz', kanaId, correct, ...extra });
const confusion = (kanaId: string, selectedKanaId: string, extra: Partial<LearningEvent> = {}) =>
  ev({
    type: 'quiz_answer',
    source: 'listening_confusion',
    kanaId,
    selectedKanaId,
    correct: kanaId === selectedKanaId,
    ...extra,
  });
const times = <T>(n: number, f: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => f(i));

const TSU_SHI: ConfusableGroup = {
  id: 'cf_tsu_shi',
  members: ['h_tsu', 'h_shi'],
  distinguish: 'x',
  category: 'hiragana',
  modality: 'both',
};

function progress(over: Partial<UserProgress> = {}): UserProgress {
  return {
    masteredKanaIds: [],
    wrongKanaIds: [],
    streakDays: 1,
    lastStudyDate: '2026-08-27',
    reviewStates: {},
    ...over,
  };
}
function reviewState(kanaId: string, nextReviewAt: string | null): KanaReviewState {
  return { kanaId, reviewLevel: 1, correctCount: 1, wrongCount: 0, lastReviewedAt: null, nextReviewAt };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getTodayStats', () => {
  it('沒有事件時全部為 0（不是 NaN / undefined）', () => {
    expect(getTodayStats([], NOW_DATE)).toEqual({
      quizCount: 0,
      reviewCount: 0,
      writingCount: 0,
      shadowingCount: 0,
      totalActions: 0,
    });
  });

  it('只計算今天的事件，並依類型分開計數', () => {
    const events = [
      quiz('h_a', true),
      quiz('h_i', false),
      ev({ type: 'writing_complete', source: 'writing_view', kanaId: 'h_tsu' }),
      ev({ type: 'shadowing_complete', source: 'shadowing_view' }),
      ev({ type: 'review_complete', source: 'review', kanaId: 'h_ka' }),
      quiz('h_u', true, { timestamp: NOW - 24 * 60 * 60 * 1000 }), // 昨天
    ];
    expect(getTodayStats(events, NOW_DATE)).toEqual({
      quizCount: 2,
      reviewCount: 1,
      writingCount: 1,
      shadowingCount: 1,
      totalActions: 5,
    });
  });

  it('日界線依本地時間：今天 00:00:00.000 算今天，昨天 23:59:59.999 與明天 00:00 不算', () => {
    const events = [
      quiz('h_a', true, { timestamp: at(2026, 8, 27, 0, 0, 0, 0) }),
      quiz('h_a', true, { timestamp: at(2026, 8, 27, 23, 59, 59, 999) }),
      quiz('h_a', true, { timestamp: at(2026, 8, 26, 23, 59, 59, 999) }),
      quiz('h_a', true, { timestamp: at(2026, 8, 28, 0, 0, 0, 0) }),
    ];
    expect(getTodayStats(events, NOW_DATE).quizCount).toBe(2);
  });
});

describe('getSevenDayTrend', () => {
  it('回傳 7 個由舊到新的日期桶，最後一桶是今天', () => {
    const trend = getSevenDayTrend([], NOW_DATE);
    expect(trend.map((d) => d.date)).toEqual([
      '2026-08-21',
      '2026-08-22',
      '2026-08-23',
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
    ]);
    expect(trend.map((d) => d.displayDate)).toEqual(['8/21', '8/22', '8/23', '8/24', '8/25', '8/26', '8/27']);
    for (const day of trend) {
      expect(day).toMatchObject({ count: 0, quizCount: 0, reviewCount: 0, writingCount: 0, shadowingCount: 0 });
    }
  });

  it('跨月：3/3 往回 7 天是 2/25～3/3（2026 非閏年）', () => {
    const trend = getSevenDayTrend([], new Date(2026, 2, 3, 9, 0));
    expect(trend[0].date).toBe('2026-02-25');
    expect(trend[0].displayDate).toBe('2/25');
    expect(trend[3].date).toBe('2026-02-28');
    expect(trend[4].date).toBe('2026-03-01');
    expect(trend[6].date).toBe('2026-03-03');
  });

  it('跨年：1/2 往回 7 天從 2025-12-27 開始', () => {
    const trend = getSevenDayTrend([], new Date(2026, 0, 2, 9, 0));
    expect(trend[0].date).toBe('2025-12-27');
    expect(trend[6].date).toBe('2026-01-02');
  });

  it('事件依本地日期分桶，窗口外的事件不計', () => {
    const events = [
      quiz('h_a', true, { timestamp: at(2026, 8, 20, 23, 59, 59, 999) }), // 窗口前一天，不計
      quiz('h_a', true, { timestamp: at(2026, 8, 21, 0, 0, 0, 0) }), // 第一桶
      ev({ type: 'writing_complete', source: 'writing_view', timestamp: at(2026, 8, 21, 18) }),
      ev({ type: 'review_complete', source: 'review', timestamp: at(2026, 8, 24, 8) }),
      ev({ type: 'shadowing_complete', source: 'shadowing_view', timestamp: at(2026, 8, 27, 23, 59) }),
      quiz('h_i', false, { timestamp: at(2026, 8, 27, 1) }),
      quiz('h_i', false, { timestamp: at(2026, 8, 28, 0, 0) }), // 明天，不計
    ];
    const trend = getSevenDayTrend(events, NOW_DATE);
    expect(trend[0]).toMatchObject({ date: '2026-08-21', count: 2, quizCount: 1, writingCount: 1 });
    expect(trend[3]).toMatchObject({ date: '2026-08-24', count: 1, reviewCount: 1 });
    expect(trend[6]).toMatchObject({ date: '2026-08-27', count: 2, quizCount: 1, shadowingCount: 1 });
    expect(trend.reduce((sum, d) => sum + d.count, 0)).toBe(5);
  });
});

describe('getWeakKanaRanking', () => {
  it('minAttempts 預設 3：1/1、2/2 錯被排除，3/3 錯才列入', () => {
    const events = [
      quiz('h_1', false),
      quiz('h_2', false),
      quiz('h_2', false),
      quiz('h_3', false),
      quiz('h_3', false),
      quiz('h_3', false),
    ];
    expect(getWeakKanaRanking(events)).toEqual([{ kanaId: 'h_3', attempts: 3, wrongCount: 3, wrongRate: 1 }]);
  });

  it('b8 情境：3 次錯 2 次，錯誤率四捨五入到小數兩位 = 0.67', () => {
    const events = [
      quiz('h_a', false),
      quiz('h_i', false),
      quiz('h_i', false),
      quiz('h_tsu', false),
      quiz('h_tsu', false),
      quiz('h_tsu', true),
    ];
    expect(getWeakKanaRanking(events)).toEqual([{ kanaId: 'h_tsu', attempts: 3, wrongCount: 2, wrongRate: 0.67 }]);
  });

  // MISMATCH: scripts/test-b8-manual-qa.py:64 says rate ≈ 0.6666 (assertAlmostEqual places=3, i.e. 0.667),
  // TS (src/utils/analytics.ts:114) rounds wrongRate to 2 decimals → 0.67, which differs by 0.003.
  it.skip('b8 腳本期望錯誤率精確到小數三位（0.6666）', () => {
    const events = [quiz('h_tsu', false), quiz('h_tsu', false), quiz('h_tsu', true)];
    expect(getWeakKanaRanking(events)[0].wrongRate).toBeCloseTo(0.6666, 3);
  });

  it('全對的假名不算弱點（wrongCount 必須 > 0）', () => {
    expect(getWeakKanaRanking(times(5, () => quiz('h_a', true)))).toEqual([]);
  });

  it('排序：錯誤率高者在前，同錯誤率時錯誤次數多者在前；limit 截斷', () => {
    const events = [
      ...times(4, () => quiz('A', false)), // 1.0, 4 錯
      ...times(3, () => quiz('B', false)), // 1.0, 3 錯
      ...times(4, () => quiz('C', false)), // 0.8, 4 錯
      quiz('C', true),
      ...times(5, () => quiz('D', false)), // 0.5, 5 錯
      ...times(5, () => quiz('D', true)),
    ];
    expect(getWeakKanaRanking(events).map((w) => w.kanaId)).toEqual(['A', 'B', 'C', 'D']);
    expect(getWeakKanaRanking(events, 2).map((w) => w.kanaId)).toEqual(['A', 'B']);
  });

  it('四捨五入後同錯誤率（2/3 與 4/6 都是 0.67）時，以錯誤次數決勝', () => {
    const events = [
      ...times(2, () => quiz('X', false)),
      quiz('X', true),
      ...times(4, () => quiz('Y', false)),
      ...times(2, () => quiz('Y', true)),
    ];
    const ranked = getWeakKanaRanking(events);
    expect(ranked.map((w) => [w.kanaId, w.wrongRate, w.wrongCount])).toEqual([
      ['Y', 0.67, 4],
      ['X', 0.67, 2],
    ]);
  });

  it('只計 quiz_answer 且有 kanaId 與 correct 的事件', () => {
    const events = [
      ...times(3, () => quiz('h_a', false)),
      ev({ type: 'writing_complete', source: 'writing_view', kanaId: 'h_a' }),
      ev({ type: 'review_complete', source: 'review', kanaId: 'h_a', correct: false }),
      ev({ type: 'quiz_answer', source: 'quiz', kanaId: 'h_a' }), // 沒有 correct
      ev({ type: 'quiz_answer', source: 'quiz', correct: false }), // 沒有 kanaId
    ];
    expect(getWeakKanaRanking(events)).toEqual([{ kanaId: 'h_a', attempts: 3, wrongCount: 3, wrongRate: 1 }]);
  });

  it('可自訂 minAttempts', () => {
    expect(getWeakKanaRanking([quiz('h_a', false)], 5, 1)).toEqual([
      { kanaId: 'h_a', attempts: 1, wrongCount: 1, wrongRate: 1 },
    ]);
  });

  it('空輸入回傳空陣列', () => {
    expect(getWeakKanaRanking([])).toEqual([]);
  });
});

describe('analytics 是純函式（test-analytics.py 的「不碰 localStorage」）', () => {
  it('不讀寫 localStorage，也不修改輸入陣列', () => {
    const getSpy = vi.spyOn(localStorage, 'getItem');
    const setSpy = vi.spyOn(localStorage, 'setItem');
    const events = [
      ...times(10, (i) => confusion('h_tsu', i < 4 ? 'h_shi' : 'h_tsu', { timestamp: NOW - i * 1000 })),
      ...times(4, () => quiz('h_a', false)),
    ];
    const before = JSON.stringify(events);
    const p = progress({ wrongKanaIds: ['h_su'] });

    getTodayStats(events, NOW_DATE);
    getSevenDayTrend(events, NOW_DATE);
    getWeakKanaRanking(events);
    getListeningWeaknesses(events, { now: NOW });
    getConfusionWeaknesses(events, [TSU_SHI], { now: NOW });
    getConfusionMasterySummary(events, [TSU_SHI], { now: NOW });
    getAIRecommendation(p, events, [TSU_SHI], NOW_DATE);

    expect(getSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(events)).toBe(before);
  });
});

describe('getAIRecommendation：規則優先順序', () => {
  it('Rule 5：沒有任何弱點 → 每日測驗（quiz / normal）', () => {
    expect(getAIRecommendation(progress(), [], [TSU_SHI], NOW_DATE)).toEqual({
      priority: 'normal',
      recommendedAction: 'quiz',
      titleKey: 'analytics.recommendationQuiz',
      reasonKey: 'analytics.recommendationDailyChallenge',
    });
  });

  it('Rule 4：wrongKanaIds 有字 → 跟讀（shadowing / medium），目標是第一個錯字', () => {
    expect(getAIRecommendation(progress({ wrongKanaIds: ['h_su', 'h_a'] }), [], [TSU_SHI], NOW_DATE)).toEqual({
      priority: 'medium',
      targetKanaId: 'h_su',
      recommendedAction: 'shadowing',
      titleKey: 'analytics.recommendationShadowing',
      reasonKey: 'analytics.recommendationShadowingWeak',
    });
  });

  it('Rule 3：有到期的 SRS 複習 → review，count 只算到期的', () => {
    const p = progress({
      wrongKanaIds: ['h_su'],
      reviewStates: {
        h_ka: reviewState('h_ka', '2020-01-01T00:00:00Z'), // 早已到期
        h_ki: reviewState('h_ki', new Date(NOW).toISOString()), // 剛好現在到期（<=）
        h_ku: reviewState('h_ku', new Date(NOW + 1).toISOString()), // 還沒到期
        h_ke: reviewState('h_ke', null), // 未排程
      },
    });
    expect(getAIRecommendation(p, [], [TSU_SHI], NOW_DATE)).toEqual({
      priority: 'high',
      targetKanaId: 'h_ka',
      recommendedAction: 'review',
      titleKey: 'analytics.recommendationReview',
      reasonKey: 'analytics.recommendationSrsDue',
      reasonParams: { count: 2 },
    });
  });

  it('Rule 2：≥3 次且錯誤率 ≥ 50% → 寫字練習，優先於 SRS 到期', () => {
    const p = progress({ reviewStates: { h_ka: reviewState('h_ka', '2020-01-01T00:00:00Z') } });
    const events = times(4, () => quiz('h_tsu', false));
    expect(getAIRecommendation(p, events, [TSU_SHI], NOW_DATE)).toEqual({
      priority: 'high',
      targetKanaId: 'h_tsu',
      recommendedAction: 'writing',
      titleKey: 'analytics.recommendationPracticeWriting',
      reasonKey: 'analytics.recommendationHighErrorRate',
      reasonParams: { rate: 100 },
    });
  });

  it('Rule 2 門檻：錯誤率剛好 0.5 觸發；0.33 不觸發而往下走', () => {
    const half = [quiz('h_a', false), quiz('h_a', false), quiz('h_a', true), quiz('h_a', true)];
    expect(getAIRecommendation(progress(), half, [TSU_SHI], NOW_DATE)).toMatchObject({
      recommendedAction: 'writing',
      reasonParams: { rate: 50 },
    });

    const third = [quiz('h_a', false), quiz('h_a', true), quiz('h_a', true)];
    expect(getAIRecommendation(progress(), third, [TSU_SHI], NOW_DATE).recommendedAction).toBe('quiz');
  });

  it('Rule 1（QA-3）：高信心（10 次）且錯誤率 40% 的聽力混淆 → listening_confusion，優先於一切', () => {
    const events = [
      ...times(6, (i) => confusion('h_tsu', 'h_tsu', { timestamp: NOW - i })),
      ...times(4, (i) => confusion('h_tsu', 'h_shi', { timestamp: NOW - 10 - i })),
      ...times(9, () => quiz('h_tsu', true)),
      quiz('h_tsu', false),
    ];
    const p = progress({
      wrongKanaIds: ['h_su'],
      reviewStates: { h_ka: reviewState('h_ka', '2020-01-01T00:00:00Z') },
    });
    const rec = getAIRecommendation(p, events, [TSU_SHI], NOW_DATE);

    // 手算：score = 0.4*0.6 + (log2(11)/5)*0.3 + 0.4*0.1 = 0.24 + 0.2076 + 0.04 ≈ 0.49
    // 聽力 6/10 = 0.6；視覺 9/10 = 0.9；gap = 0.3
    expect(rec).toEqual({
      priority: 'high',
      targetConfusionGroupId: 'cf_tsu_shi',
      recommendedAction: 'listening_confusion',
      titleKey: 'analytics.recommendationListeningConfusion',
      reasonKey: 'analytics.recommendationHighConfusionRate',
      reasonParams: { rate: 40 },
      evidence: {
        listeningAccuracy: 0.6,
        visualAccuracy: 0.9,
        gap: 0.3,
        recentAttempts: 10,
        topDirection: { target: 'h_tsu', selected: 'h_shi', count: 4 },
        confidence: 'high',
        score: 0.49,
      },
    });
  });

  it('Rule 1 的 OR 分支：錯誤率 < 0.4 但 score ≥ 0.5（大量樣本）也會觸發', () => {
    // 40 次錯 14 次：wrongRate 0.35；volume 封頂 1 → score ≈ 0.21 + 0.3 + 0.035 = 0.545
    const events = times(40, (i) => confusion('h_tsu', i < 14 ? 'h_shi' : 'h_tsu'));
    const rec = getAIRecommendation(progress(), events, [TSU_SHI], NOW_DATE);
    expect(rec.recommendedAction).toBe('listening_confusion');
    expect(rec.reasonParams).toEqual({ rate: 35 });
    expect(rec.evidence?.score).toBeGreaterThanOrEqual(0.5);
  });

  it('Rule 1 沒有視覺測驗資料時：evidence 的 visualAccuracy 與 gap 留空（畫面顯示 —），不是 0', () => {
    // 回歸測試：以前回報視覺 0%、差距 0，首頁推薦卡因此顯示「視覺 0%」
    const events = times(8, () => confusion('h_shi', 'h_tsu'));
    const rec = getAIRecommendation(progress(), events, [TSU_SHI], NOW_DATE);
    expect(rec.recommendedAction).toBe('listening_confusion');
    expect(rec.evidence).toMatchObject({
      listeningAccuracy: 0,
      topDirection: { target: 'h_shi', selected: 'h_tsu', count: 8 },
    });
    expect(rec.evidence?.visualAccuracy).toBeUndefined();
    expect(rec.evidence?.gap).toBeUndefined();
  });

  it('Rule 1 有視覺測驗資料時：evidence 帶出實際的視覺正確率與差距', () => {
    const events = [...times(8, () => confusion('h_shi', 'h_tsu')), ...times(4, () => quiz('h_shi', true))];
    const rec = getAIRecommendation(progress(), events, [TSU_SHI], NOW_DATE);
    expect(rec.recommendedAction).toBe('listening_confusion');
    expect(rec.evidence).toMatchObject({ listeningAccuracy: 0, visualAccuracy: 1, gap: 1 });
  });

  it('QA-2 / Test 15：低信心（2/2 全錯）不觸發 listening_confusion，退回 quiz', () => {
    const events = [confusion('h_tsu', 'h_shi'), confusion('h_tsu', 'h_shi')];
    const rec = getAIRecommendation(progress(), events, [TSU_SHI], NOW_DATE);
    expect(rec.recommendedAction).toBe('quiz');
  });

  it('中信心（7/7 全錯）不觸發 listening_confusion；但同批事件會讓 Rule 2 推寫字', () => {
    // getWeakKanaRanking 不分 source，聽力混淆的錯答也算進「弱字」→ writing
    const events = times(7, () => confusion('h_tsu', 'h_shi'));
    const rec = getAIRecommendation(progress(), events, [TSU_SHI], NOW_DATE);
    expect(rec.recommendedAction).not.toBe('listening_confusion');
    expect(rec).toMatchObject({ recommendedAction: 'writing', targetKanaId: 'h_tsu' });
  });

  it('高信心但錯誤率低（10 次錯 1 次）不觸發', () => {
    const events = times(10, (i) => confusion('h_tsu', i === 0 ? 'h_shi' : 'h_tsu'));
    expect(getAIRecommendation(progress(), events, [TSU_SHI], NOW_DATE).recommendedAction).toBe('quiz');
  });

  it('預設使用 CONFUSABLE_GROUPS（cf_tsu_shi 是真實群組）', () => {
    const events = times(10, () => confusion('h_tsu', 'h_shi'));
    expect(getAIRecommendation(progress(), events, undefined, NOW_DATE).targetConfusionGroupId).toBe('cf_tsu_shi');
  });
});

describe('getAIRecommendation：每個分支的 i18n 鍵在三語都存在，參數佔位符齊全', () => {
  const locales = { 'zh-TW': zhTW, 'zh-CN': zhCN, en } as const;

  function resolve(dict: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((obj, key) => {
      if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
      return undefined;
    }, dict);
  }

  const reviewDue = progress({ reviewStates: { h_ka: reviewState('h_ka', '2020-01-01T00:00:00Z') } });
  const cases: Record<string, AIRecommendation> = {
    listening_confusion: getAIRecommendation(progress(), times(10, () => confusion('h_tsu', 'h_shi')), [TSU_SHI], NOW_DATE),
    writing: getAIRecommendation(progress(), times(3, () => quiz('h_a', false)), [TSU_SHI], NOW_DATE),
    review: getAIRecommendation(reviewDue, [], [TSU_SHI], NOW_DATE),
    shadowing: getAIRecommendation(progress({ wrongKanaIds: ['h_a'] }), [], [TSU_SHI], NOW_DATE),
    quiz: getAIRecommendation(progress(), [], [TSU_SHI], NOW_DATE),
  };

  it.each(Object.entries(cases))('%s', (action, rec) => {
    expect(rec.recommendedAction).toBe(action);
    for (const [lang, dict] of Object.entries(locales)) {
      for (const key of [rec.titleKey, rec.reasonKey]) {
        const text = resolve(dict, key);
        expect(typeof text, `${lang} 缺 ${key}`).toBe('string');
        expect((text as string).length, `${lang} 的 ${key} 是空字串`).toBeGreaterThan(0);
      }
      const reason = resolve(dict, rec.reasonKey) as string;
      for (const param of Object.keys(rec.reasonParams ?? {})) {
        expect(reason, `${lang} 的 ${rec.reasonKey} 缺 {${param}}`).toContain(`{${param}}`);
      }
    }
  });
});
