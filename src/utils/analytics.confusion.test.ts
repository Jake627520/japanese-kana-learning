import { describe, it, expect } from 'vitest';
import {
  getListeningWeaknesses,
  getConfusionWeaknesses,
  getConfusionMatrix,
  getConfusionGroupStats,
  getModalityAccuracy,
  getTrainingOutcome,
  getConfusionMasterySummary,
} from './analytics';
import { getLearningEvents, logLearningEvent } from './learningEvents';
import { LearningEvent } from '../types/learning';
import { CONFUSABLE_GROUPS, ConfusableGroup } from '../data/confusableData';

// 取代 scripts/test-listening-weakness.py、test-confusion-taxonomy.py（矩陣部分）、
// test-c1-5.py（getTrainingOutcome）、test-c1-6.py（getConfusionMasterySummary）。
// 原腳本在 Python 重寫一次演算法再驗證那份 Python；這裡直接跑 analytics.ts。

const NOW = new Date(2026, 7, 28, 10, 0, 0).getTime();
const DAY = 24 * 60 * 60 * 1000;

let seq = 0;
function ev(p: Partial<LearningEvent> & Pick<LearningEvent, 'type' | 'source'>): LearningEvent {
  seq += 1;
  return { id: `e${seq}`, timestamp: NOW, ...p };
}
const quiz = (kanaId: string, correct: boolean, extra: Partial<LearningEvent> = {}) =>
  ev({ type: 'quiz_answer', source: 'quiz', kanaId, correct, ...extra });
const listening = (kanaId: string, correct: boolean, extra: Partial<LearningEvent> = {}) =>
  ev({ type: 'quiz_answer', source: 'listening', kanaId, correct, ...extra });
/** 聽力混淆特訓的一次作答；selected 與 target 相同就是答對 */
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

const group = (id: string, members: string[]): ConfusableGroup => ({
  id,
  members,
  distinguish: 'x',
  category: members[0].startsWith('k_') ? 'katakana' : 'hiragana',
  modality: 'both',
});
const TSU_SHI = group('cf_tsu_shi', ['h_tsu', 'h_shi']);
const NE_RE_WA = group('cf_ne_re_wa', ['h_ne', 'h_re', 'h_wa']);
const SU_MU = group('cf_su_mu', ['h_su', 'h_mu']);

describe('getListeningWeaknesses', () => {
  it('Test 1：聽力正確率 4/10 = 0.40', () => {
    const events = [...times(4, () => listening('h_tsu', true)), ...times(6, () => listening('h_tsu', false))];
    const [w] = getListeningWeaknesses(events, { now: NOW });
    expect(w).toMatchObject({ kanaId: 'h_tsu', attempts: 10, wrongCount: 6, listeningAccuracy: 0.4 });
  });

  it('Test 2 / 3：視覺 18/20 = 0.90，聽力 5/10 = 0.50，gap = 0.40', () => {
    const events = [
      ...times(18, () => quiz('h_tsu', true)),
      ...times(2, () => quiz('h_tsu', false)),
      ...times(5, () => listening('h_tsu', true)),
      ...times(5, () => listening('h_tsu', false)),
    ];
    const [w] = getListeningWeaknesses(events, { now: NOW });
    expect(w).toMatchObject({ visualAccuracy: 0.9, listeningAccuracy: 0.5, gap: 0.4, attempts: 10 });
  });

  it('listening 與 listening_confusion 都算聽力；review_quiz 等其他 source 不算視覺', () => {
    const events = [
      listening('h_a', true),
      confusion('h_a', 'h_o'),
      ev({ type: 'quiz_answer', source: 'review_quiz', kanaId: 'h_a', correct: false }),
    ];
    const [w] = getListeningWeaknesses(events, { now: NOW });
    expect(w).toMatchObject({ attempts: 2, wrongCount: 1, listeningAccuracy: 0.5, visualAccuracy: 0 });
  });

  it('只做過視覺測驗的假名不會出現', () => {
    expect(getListeningWeaknesses(times(5, () => quiz('h_a', false)), { now: NOW })).toEqual([]);
  });

  it.each([
    [1, 'low'],
    [2, 'low'],
    [3, 'medium'],
    [7, 'medium'],
    [8, 'high'],
  ] as const)('Test 4–7：%i 次作答 → confidence = %s', (n, level) => {
    const [w] = getListeningWeaknesses(times(n, () => listening('h_tsu', false)), { now: NOW });
    expect(w.confidence).toBe(level);
  });

  it('Test 8：近期錯答的權重大於 7 天前的錯答（7 天半衰期）', () => {
    // A：今天錯、7 天前對；B：7 天前錯、今天對。兩者錯誤率都是 0.5。
    // recency：A = 1/(1+0.5) = 0.667，B = 0.5/1.5 = 0.333
    // score = 0.5*0.5 + (log2(3)/5)*0.2 + 0 + recency*0.1 → A ≈ 0.38，B ≈ 0.35
    const events = [
      listening('A', false, { timestamp: NOW }),
      listening('A', true, { timestamp: NOW - 7 * DAY }),
      listening('B', false, { timestamp: NOW - 7 * DAY }),
      listening('B', true, { timestamp: NOW }),
    ];
    const result = getListeningWeaknesses(events, { now: NOW });
    expect(result.map((w) => [w.kanaId, w.score])).toEqual([
      ['A', 0.38],
      ['B', 0.35],
    ]);
  });

  it('topConfusionKanaId：取 listening_confusion 中最常誤選的字，同數時依字母序', () => {
    const events = [
      confusion('h_ne', 'h_wa'),
      confusion('h_ne', 'h_re'),
      confusion('h_ne', 'h_ne'),
      listening('h_ne', false), // 一般聽力沒有 selectedKanaId，不影響
    ];
    expect(getListeningWeaknesses(events, { now: NOW })[0].topConfusionKanaId).toBe('h_re');

    events.push(confusion('h_ne', 'h_wa'));
    expect(getListeningWeaknesses(events, { now: NOW })[0].topConfusionKanaId).toBe('h_wa');
  });

  it('沒有誤選紀錄時 topConfusionKanaId 為 undefined', () => {
    expect(getListeningWeaknesses([listening('h_a', false)], { now: NOW })[0].topConfusionKanaId).toBeUndefined();
  });

  it('排序：score 高者在前；同分時 attempts 多者在前；再同則 kanaId 字母序', () => {
    const events = [
      ...times(3, () => listening('h_c', false)),
      ...times(3, () => listening('h_b', false)),
      ...times(3, () => listening('h_a', false)),
      listening('h_z', true),
    ];
    expect(getListeningWeaknesses(events, { now: NOW }).map((w) => w.kanaId)).toEqual(['h_a', 'h_b', 'h_c', 'h_z']);
  });

  it('空輸入與非陣列輸入都回傳空陣列', () => {
    expect(getListeningWeaknesses([], { now: NOW })).toEqual([]);
    expect(getListeningWeaknesses(null as unknown as LearningEvent[])).toEqual([]);
  });
});

describe('getConfusionWeaknesses', () => {
  it('Test 10 / 11：目標與所選都在群組內才計算；選到群組外的字忽略', () => {
    const events = [
      confusion('h_tsu', 'h_shi'), // 錯，算
      confusion('h_tsu', 'h_tsu'), // 對，算
      confusion('h_tsu', 'h_su'), // 選到群組外，忽略
    ];
    const [w] = getConfusionWeaknesses(events, [TSU_SHI], { now: NOW });
    expect(w).toMatchObject({ groupId: 'cf_tsu_shi', attempts: 2, wrongCount: 1, wrongRate: 0.5 });
  });

  it('只看 source = listening_confusion；quiz 與一般 listening 不算', () => {
    const events = [
      ev({ type: 'quiz_answer', source: 'quiz', kanaId: 'h_tsu', selectedKanaId: 'h_shi', correct: false }),
      ev({ type: 'quiz_answer', source: 'listening', kanaId: 'h_tsu', selectedKanaId: 'h_shi', correct: false }),
    ];
    expect(getConfusionWeaknesses(events, [TSU_SHI], { now: NOW })[0].attempts).toBe(0);
  });

  it('Test 9 / 12：A→B 與 B→A 分開統計，topDirection 取次數最多的方向', () => {
    const events = [...times(8, () => confusion('h_tsu', 'h_shi')), ...times(3, () => confusion('h_shi', 'h_tsu'))];
    const [w] = getConfusionWeaknesses(events, [TSU_SHI], { now: NOW });
    expect(w.topDirection).toEqual({ target: 'h_tsu', selected: 'h_shi', count: 8 });
  });

  it('Test 13：同次數時依 target 字母序，再依 selected 字母序', () => {
    const tie = [...times(5, () => confusion('h_tsu', 'h_shi')), ...times(5, () => confusion('h_shi', 'h_tsu'))];
    expect(getConfusionWeaknesses(tie, [TSU_SHI], { now: NOW })[0].topDirection).toEqual({
      target: 'h_shi',
      selected: 'h_tsu',
      count: 5,
    });

    const sameTarget = [...times(2, () => confusion('h_ne', 'h_wa')), ...times(2, () => confusion('h_ne', 'h_re'))];
    expect(getConfusionWeaknesses(sameTarget, [NE_RE_WA], { now: NOW })[0].topDirection).toEqual({
      target: 'h_ne',
      selected: 'h_re',
      count: 2,
    });
  });

  it('答對不算方向；全對時 topDirection 為 undefined', () => {
    const [w] = getConfusionWeaknesses(times(3, () => confusion('h_tsu', 'h_tsu')), [TSU_SHI], { now: NOW });
    expect(w).toMatchObject({ attempts: 3, wrongCount: 0, wrongRate: 0, topDirection: undefined });
  });

  it('score 與 confidence：10 次錯 4 次、同一時間 → 0.49 / high', () => {
    // 0.4*0.6 + (log2(11)/5)*0.3 + 0.4*0.1 = 0.24 + 0.2076 + 0.04 = 0.4876
    const events = [...times(4, () => confusion('h_tsu', 'h_shi')), ...times(6, () => confusion('h_tsu', 'h_tsu'))];
    const [w] = getConfusionWeaknesses(events, [TSU_SHI], { now: NOW });
    expect(w).toMatchObject({ score: 0.49, confidence: 'high', wrongRate: 0.4 });
  });

  it('沒有資料的群組也會回傳（score 0、confidence low），排序為 score → attempts → groupId', () => {
    const events = times(3, () => confusion('h_su', 'h_mu'));
    const result = getConfusionWeaknesses(events, [TSU_SHI, NE_RE_WA, SU_MU], { now: NOW });
    expect(result.map((w) => w.groupId)).toEqual(['cf_su_mu', 'cf_ne_re_wa', 'cf_tsu_shi']);
    expect(result[1]).toMatchObject({ attempts: 0, score: 0, confidence: 'low', memberKanaIds: ['h_ne', 'h_re', 'h_wa'] });
  });

  it('預設對全部 CONFUSABLE_GROUPS 計算', () => {
    expect(getConfusionWeaknesses([], undefined, { now: NOW })).toHaveLength(CONFUSABLE_GROUPS.length);
  });

  it('非陣列輸入回傳空陣列', () => {
    expect(getConfusionWeaknesses(undefined as unknown as LearningEvent[], [TSU_SHI])).toEqual([]);
  });
});

describe('getConfusionMatrix', () => {
  it('Test 8：target = h_tsu、selected = h_su → matrix[h_tsu][h_su] = 1', () => {
    expect(getConfusionMatrix([confusion('h_tsu', 'h_su')])).toEqual({ h_tsu: { h_su: 1 } });
  });

  it('Test 9：反向 h_su → h_tsu 是另一筆統計', () => {
    const events = [confusion('h_tsu', 'h_su'), confusion('h_su', 'h_tsu'), confusion('h_su', 'h_tsu')];
    expect(getConfusionMatrix(events)).toEqual({ h_tsu: { h_su: 1 }, h_su: { h_tsu: 2 } });
  });

  it('Test 10 / 11：source = quiz 與 source = listening 不進矩陣', () => {
    const events = [
      ev({ type: 'quiz_answer', source: 'quiz', kanaId: 'h_tsu', selectedKanaId: 'h_su', correct: false }),
      ev({ type: 'quiz_answer', source: 'listening', kanaId: 'h_tsu', selectedKanaId: 'h_su', correct: false }),
    ];
    expect(getConfusionMatrix(events)).toEqual({});
  });

  it('缺 selectedKanaId 的事件忽略；答對記在對角線上', () => {
    const events = [
      ev({ type: 'quiz_answer', source: 'listening_confusion', kanaId: 'h_tsu', correct: false }),
      confusion('h_tsu', 'h_tsu'),
    ];
    expect(getConfusionMatrix(events)).toEqual({ h_tsu: { h_tsu: 1 } });
  });

  it('空輸入回傳空物件', () => {
    expect(getConfusionMatrix([])).toEqual({});
  });
});

describe('getConfusionGroupStats', () => {
  it('依輸入群組順序回傳，套用群組成員限制', () => {
    const events = [
      confusion('h_tsu', 'h_shi'),
      confusion('h_tsu', 'h_tsu'),
      confusion('h_tsu', 'h_tsu'),
      confusion('h_tsu', 'h_su'), // 群組外
      confusion('h_su', 'h_mu'),
      listening('h_su', false), // 非 listening_confusion
    ];
    expect(getConfusionGroupStats(events, [TSU_SHI, SU_MU, NE_RE_WA])).toEqual([
      { groupId: 'cf_tsu_shi', attempts: 3, wrongCount: 1, wrongRate: 0.33 },
      { groupId: 'cf_su_mu', attempts: 1, wrongCount: 1, wrongRate: 1 },
      { groupId: 'cf_ne_re_wa', attempts: 0, wrongCount: 0, wrongRate: 0 },
    ]);
  });
});

describe('getModalityAccuracy', () => {
  const events = [
    ...times(9, () => quiz('h_a', true)),
    quiz('h_a', false),
    listening('h_a', true),
    confusion('h_a', 'h_o'),
    quiz('h_i', false),
    ev({ type: 'quiz_answer', source: 'review_quiz', kanaId: 'h_a', correct: false }), // 不算視覺
    ev({ type: 'quiz_answer', source: 'quiz', kanaId: 'h_a' }), // 沒有 correct，不算
  ];

  it('指定 kanaId：視覺 0.9、聽力 0.5、gap 0.4', () => {
    expect(getModalityAccuracy(events, 'h_a')).toEqual({ visualAccuracy: 0.9, listeningAccuracy: 0.5, gap: 0.4 });
  });

  it('不指定 kanaId：全部假名合計（視覺 9/11 = 0.82）', () => {
    expect(getModalityAccuracy(events)).toEqual({ visualAccuracy: 0.82, listeningAccuracy: 0.5, gap: 0.32 });
  });

  it('沒有資料時全部為 0', () => {
    expect(getModalityAccuracy([])).toEqual({ visualAccuracy: 0, listeningAccuracy: 0, gap: 0 });
  });
});

describe('getTrainingOutcome', () => {
  it('群組不存在、after 沒有群組事件、或輸入不是陣列時回傳 null', () => {
    expect(getTrainingOutcome([], [confusion('h_tsu', 'h_tsu')], 'cf_nope', [TSU_SHI])).toBeNull();
    expect(getTrainingOutcome([], [confusion('h_su', 'h_mu')], 'cf_tsu_shi', [TSU_SHI])).toBeNull();
    expect(getTrainingOutcome(null as unknown as LearningEvent[], [], 'cf_tsu_shi', [TSU_SHI])).toBeNull();
  });

  it('沒有歷史：5 題對 4 題 → session 0.8、before 0、視為已解決', () => {
    const session = [...times(4, () => confusion('h_tsu', 'h_tsu')), confusion('h_tsu', 'h_shi')];
    expect(getTrainingOutcome([], session, 'cf_tsu_shi', [TSU_SHI])).toEqual({
      groupId: 'cf_tsu_shi',
      beforeAccuracy: 0,
      afterAccuracy: 0.8, // 沒有特訓後觀察窗，沿用 session
      sessionAccuracy: 0.8,
      improvement: 0.8,
      remainingTopDirection: { target: 'h_tsu', selected: 'h_shi', count: 1 },
      isResolved: true,
    });
  });

  it('session < 0.8 不算解決', () => {
    const session = [...times(3, () => confusion('h_tsu', 'h_tsu')), ...times(2, () => confusion('h_tsu', 'h_shi'))];
    const outcome = getTrainingOutcome([], session, 'cf_tsu_shi', [TSU_SHI]);
    expect(outcome).toMatchObject({ sessionAccuracy: 0.6, isResolved: false });
  });

  it('有歷史時需要進步 ≥ 0.15：0.6 → 1.0 解決；0.7 → 0.8 只進步 0.1 不解決', () => {
    const before60 = [...times(6, () => confusion('h_tsu', 'h_tsu')), ...times(4, () => confusion('h_tsu', 'h_shi'))];
    const perfect = times(5, () => confusion('h_tsu', 'h_tsu'));
    expect(getTrainingOutcome(before60, perfect, 'cf_tsu_shi', [TSU_SHI])).toMatchObject({
      beforeAccuracy: 0.6,
      sessionAccuracy: 1,
      improvement: 0.4,
      remainingTopDirection: undefined,
      isResolved: true,
    });

    const before70 = [...times(7, () => confusion('h_tsu', 'h_tsu')), ...times(3, () => confusion('h_tsu', 'h_shi'))];
    const eighty = [...times(4, () => confusion('h_tsu', 'h_tsu')), confusion('h_tsu', 'h_shi')];
    expect(getTrainingOutcome(before70, eighty, 'cf_tsu_shi', [TSU_SHI])).toMatchObject({
      beforeAccuracy: 0.7,
      sessionAccuracy: 0.8,
      improvement: 0.1,
      isResolved: false,
    });
  });

  it('after 含特訓前的歷史時，只有快照裡沒有的事件算 session；方向統計也只看 session', () => {
    // 歷史裡錯得很多（shi → tsu），這次特訓只錯一題 tsu → shi
    const history = [confusion('h_shi', 'h_tsu'), confusion('h_shi', 'h_tsu'), confusion('h_tsu', 'h_tsu')];
    const session = [...times(4, () => confusion('h_tsu', 'h_tsu')), confusion('h_tsu', 'h_shi')];
    // 和實際存放一樣：最新在前
    const after = [...session.reverse(), ...history];

    expect(getTrainingOutcome(history, after, 'cf_tsu_shi', [TSU_SHI])).toMatchObject({
      beforeAccuracy: 0.33,
      sessionAccuracy: 0.8,
      afterAccuracy: 0.8,
      improvement: 0.47,
      remainingTopDirection: { target: 'h_tsu', selected: 'h_shi', count: 1 },
      isResolved: true,
    });
  });

  it('session 不限 5 題：7 題全部計入', () => {
    const session = [...times(6, () => confusion('h_tsu', 'h_tsu')), confusion('h_tsu', 'h_shi')];
    expect(getTrainingOutcome([], session, 'cf_tsu_shi', [TSU_SHI])).toMatchObject({ sessionAccuracy: 0.86 });
  });

  it('快照之後沒有新的群組事件時回傳 null', () => {
    const history = times(3, () => confusion('h_tsu', 'h_tsu'));
    expect(getTrainingOutcome(history, history, 'cf_tsu_shi', [TSU_SHI])).toBeNull();
  });

  // 回歸測試：舊寫法取 after.slice(-5)，而事件是最新在前，
  // 有歷史時會把最舊的 5 筆當成本次特訓（scripts/test-c1-5.py 的 session isolation）
  it('實際流程：先有歷史再特訓，session 應該是剛做完的 5 題', () => {
    // 歷史：5 題對 2 題（0.4）
    for (let i = 0; i < 5; i++) {
      const selected = i < 2 ? 'h_tsu' : 'h_shi';
      logLearningEvent({ ...confusion('h_tsu', selected), id: `old${i}`, timestamp: NOW - DAY + i });
    }
    const snapshot = getLearningEvents(); // ConfusableView 開始特訓時的快照
    // 特訓：5 題全對
    for (let i = 0; i < 5; i++) {
      logLearningEvent({ ...confusion('h_tsu', 'h_tsu'), id: `new${i}`, timestamp: NOW + i });
    }
    const outcome = getTrainingOutcome(snapshot, getLearningEvents(), 'cf_tsu_shi', CONFUSABLE_GROUPS);
    expect(outcome).toMatchObject({ beforeAccuracy: 0.4, sessionAccuracy: 1, improvement: 0.6, isResolved: true });
  });
});

describe('getConfusionMasterySummary', () => {
  const OLD = NOW - 10 * DAY; // 7 天窗口之前
  const RECENT = NOW - 1 * DAY; // 7 天窗口之內
  const old = (t: string, s: string) => confusion(t, s, { timestamp: OLD });
  const recent = (t: string, s: string) => confusion(t, s, { timestamp: RECENT });

  it('門檻：before 與 recent 都至少 3 筆才評估', () => {
    const tooFewBefore = [...times(2, () => old('h_tsu', 'h_shi')), ...times(5, () => recent('h_tsu', 'h_tsu'))];
    const tooFewRecent = [...times(3, () => old('h_tsu', 'h_shi')), ...times(2, () => recent('h_tsu', 'h_tsu'))];
    const enough = [...times(3, () => old('h_tsu', 'h_shi')), ...times(3, () => recent('h_tsu', 'h_tsu'))];

    expect(getConfusionMasterySummary(tooFewBefore, [TSU_SHI], { now: NOW }).totalGroupsEvaluated).toBe(0);
    expect(getConfusionMasterySummary(tooFewRecent, [TSU_SHI], { now: NOW }).totalGroupsEvaluated).toBe(0);
    expect(getConfusionMasterySummary(enough, [TSU_SHI], { now: NOW }).totalGroupsEvaluated).toBe(1);
  });

  it('群組成員限制：選到群組外的字不算入門檻', () => {
    const events = [
      ...times(2, () => old('h_tsu', 'h_shi')),
      old('h_tsu', 'h_su'), // 群組外，不算 → before 只有 2 筆
      ...times(3, () => recent('h_tsu', 'h_tsu')),
    ];
    expect(getConfusionMasterySummary(events, [TSU_SHI], { now: NOW }).totalGroupsEvaluated).toBe(0);
  });

  it('剛好在窗口邊界（now - 7 天）的事件算 recent', () => {
    const cutoff = NOW - 7 * DAY;
    const events = [
      ...times(3, () => old('h_tsu', 'h_shi')),
      ...times(3, () => confusion('h_tsu', 'h_tsu', { timestamp: cutoff })),
    ];
    expect(getConfusionMasterySummary(events, [TSU_SHI], { now: NOW }).groupOutcomes[0]).toMatchObject({
      beforeAccuracy: 0,
      recentAccuracy: 1,
    });
  });

  it('解決條件：recent ≥ 0.8 且進步 ≥ 0.15（含邊界 0.75 → 0.9）', () => {
    const solved = [
      ...times(3, () => old('h_tsu', 'h_tsu')),
      old('h_tsu', 'h_shi'), // before 0.75
      ...times(9, () => recent('h_tsu', 'h_tsu')),
      recent('h_tsu', 'h_shi'), // recent 0.9
    ];
    expect(getConfusionMasterySummary(solved, [TSU_SHI], { now: NOW }).groupOutcomes[0]).toMatchObject({
      beforeAccuracy: 0.75,
      recentAccuracy: 0.9,
      improvement: 0.15,
      isResolved: true,
    });
  });

  it('未解決：進步不足（0.8 → 0.9）或正確率不足（0 → 0.75）', () => {
    const smallGain = [
      ...times(4, () => old('h_tsu', 'h_tsu')),
      old('h_tsu', 'h_shi'),
      ...times(9, () => recent('h_tsu', 'h_tsu')),
      recent('h_tsu', 'h_shi'),
    ];
    expect(getConfusionMasterySummary(smallGain, [TSU_SHI], { now: NOW }).groupOutcomes[0]).toMatchObject({
      improvement: 0.1,
      isResolved: false,
    });

    const lowAccuracy = [
      ...times(3, () => old('h_tsu', 'h_shi')),
      ...times(3, () => recent('h_tsu', 'h_tsu')),
      recent('h_tsu', 'h_shi'),
    ];
    expect(getConfusionMasterySummary(lowAccuracy, [TSU_SHI], { now: NOW }).groupOutcomes[0]).toMatchObject({
      recentAccuracy: 0.75,
      improvement: 0.75,
      isResolved: false,
    });
  });

  it('remainingTopDirection 只看 recent 的錯答，同數時依 target、selected 字母序', () => {
    const events = [
      ...times(3, () => old('h_ne', 'h_re')),
      ...times(5, () => old('h_wa', 'h_ne')), // 舊的錯答不算
      recent('h_ne', 'h_wa'),
      recent('h_ne', 'h_re'),
      recent('h_re', 'h_ne'),
    ];
    expect(getConfusionMasterySummary(events, [NE_RE_WA], { now: NOW }).groupOutcomes[0].remainingTopDirection).toEqual(
      { target: 'h_ne', selected: 'h_re', count: 1 }
    );
  });

  it('彙總：評估數、解決數、仍弱數、平均進步（四捨五入兩位），groupTitle 用成員 id', () => {
    const events = [
      // cf_tsu_shi：0 → 1.0，解決
      ...times(3, () => old('h_tsu', 'h_shi')),
      ...times(3, () => recent('h_tsu', 'h_tsu')),
      // cf_su_mu：0.67 → 0.67，未解決
      ...times(2, () => old('h_su', 'h_su')),
      old('h_su', 'h_mu'),
      ...times(2, () => recent('h_su', 'h_su')),
      recent('h_su', 'h_mu'),
    ];
    const summary = getConfusionMasterySummary(events, [TSU_SHI, SU_MU, NE_RE_WA], { now: NOW });
    expect(summary).toMatchObject({
      totalGroupsEvaluated: 2,
      resolvedCount: 1,
      activeWeakCount: 1,
      averageImprovement: 0.5, // (1 + 0) / 2
    });
    expect(summary.groupOutcomes.map((o) => [o.groupId, o.groupTitle, o.isResolved])).toEqual([
      ['cf_tsu_shi', 'h_tsu / h_shi', true],
      ['cf_su_mu', 'h_su / h_mu', false],
    ]);
  });

  it('可自訂窗口與門檻', () => {
    const events = [old('h_tsu', 'h_shi'), recent('h_tsu', 'h_tsu')];
    const summary = getConfusionMasterySummary(events, [TSU_SHI], {
      now: NOW,
      recentWindowDays: 3,
      minBeforeAttempts: 1,
      minRecentAttempts: 1,
      resolvedAccuracy: 1,
      resolvedImprovement: 1,
    });
    expect(summary.groupOutcomes[0]).toMatchObject({ beforeAccuracy: 0, recentAccuracy: 1, improvement: 1, isResolved: true });
  });

  it('空輸入與非陣列輸入回傳全 0', () => {
    const empty = {
      totalGroupsEvaluated: 0,
      resolvedCount: 0,
      activeWeakCount: 0,
      averageImprovement: 0,
      groupOutcomes: [],
    };
    expect(getConfusionMasterySummary([], [TSU_SHI], { now: NOW })).toEqual(empty);
    expect(getConfusionMasterySummary(null as unknown as LearningEvent[])).toEqual(empty);
  });
});
