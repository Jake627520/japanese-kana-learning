import { describe, it, expect, vi } from 'vitest';
import { buildBackupData, validateAndImportProgressData } from './dataPortability';
import { getStoredProgress, recordReviewResult, saveProgress, STORAGE_KEY_V1, STORAGE_KEY_V2 } from './storage';
import { JLPT_STORAGE_KEY, setStoredJlptRecords, JlptPracticeRecord } from './jlptStorage';
import { LEARNING_EVENTS_STORAGE_KEY, logLearningEvent, getLearningEvents, MAX_LEARNING_EVENTS } from './learningEvents';
import { toggleMarkedOk } from '../lib/shadowingProgress';
import { CHAT_TUTOR_STORAGE_KEY, loadChatTutorProgress, saveChatTutorRow } from '../lib/chatTutorProgress';
import { LANGUAGE_STORAGE_KEY } from '../i18n';
import { UserProgress } from '../types';

const SHADOWING_KEY = 'shadowing-progress-v1';

/** CHG-005 涵蓋的 7 個 localStorage 鍵（規格原本 6 個，加上對話教室進度） */
const ALL_KEYS = [
  STORAGE_KEY_V1,
  STORAGE_KEY_V2,
  JLPT_STORAGE_KEY,
  LEARNING_EVENTS_STORAGE_KEY,
  SHADOWING_KEY,
  LANGUAGE_STORAGE_KEY,
  CHAT_TUTOR_STORAGE_KEY,
];

const PROGRESS: UserProgress = {
  masteredKanaIds: ['h_a', 'h_i'],
  wrongKanaIds: [],
  streakDays: 4,
  lastStudyDate: '2026-10-01',
  reviewStates: {},
};

const JLPT: JlptPracticeRecord[] = [
  { questionId: 'q1', topicId: 't1', selectedOption: 2, isCorrect: false, answeredAt: '2026-10-01T09:00:00.000Z' },
];

/** 用 app 自己的寫入路徑，在這台「裝置」上留下 7 種資料 */
function seedEverything() {
  saveProgress(PROGRESS);
  recordReviewResult('h_o', false, 1200); // 會同時寫入 v1 與 v2（含調適排程狀態）
  setStoredJlptRecords(JLPT);
  logLearningEvent({ type: 'quiz_answer', source: 'quiz', kanaId: 'h_o', correct: false, timestamp: 1_700_000_000_000, id: 'e1' });
  toggleMarkedOk('sentence-1');
  localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
  saveChatTutorRow('hiragana', 3);
}

const snapshot = () => Object.fromEntries(ALL_KEYS.map((k) => [k, localStorage.getItem(k)]));

describe('REQ-001 / REQ-002：匯出', () => {
  it('AC-01 / AC-10：version 2，包含全部 7 種資料', () => {
    seedEverything();
    const data = buildBackupData();

    expect(data.version).toBe(2);
    expect(data.kanaProgress.wrongKanaIds).toEqual(['h_o']);
    expect(data.jlptRecords).toEqual(JLPT);
    expect(data.progressV2?.schemaVersion).toBe(2);
    expect(data.progressV2?.srsStates.h_o).toBeDefined();
    expect(data.learningEvents?.map((e) => e.id)).toEqual(['e1']);
    expect(data.shadowingProgress?.markedOk).toEqual(['sentence-1']);
    expect(data.language).toBe('en');
    expect(data.chatTutorProgress).toEqual({ hiragana: 3, katakana: 0 });
  });

  it('本機沒有的資料不放進檔案（不是放 null）', () => {
    // 全新裝置。注意：只要存過假名進度，saveProgress 就會一併寫出 v2，所以實務上 v2 幾乎總是存在
    const json = JSON.parse(JSON.stringify(buildBackupData()));

    for (const field of ['learningEvents', 'shadowingProgress', 'language', 'chatTutorProgress']) {
      expect(json).not.toHaveProperty(field);
    }
    if (localStorage.getItem(STORAGE_KEY_V2) === null) expect(json).not.toHaveProperty('progressV2');
  });

  it('某個鍵內容壞掉時照樣匯出其他資料，不丟例外', () => {
    seedEverything();
    localStorage.setItem(LEARNING_EVENTS_STORAGE_KEY, '{not json');
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const data = buildBackupData();

    expect(data).not.toHaveProperty('learningEvents');
    expect(data.language).toBe('en');
  });
});

describe('REQ-003：匯入 version 2', () => {
  it('AC-02：換到空白裝置後，7 個鍵的內容和原本完全相同', () => {
    seedEverything();
    const before = snapshot();
    const file = JSON.stringify(buildBackupData());

    localStorage.clear();
    const result = validateAndImportProgressData(file);

    expect(result.success).toBe(true);
    expect(snapshot()).toEqual(before);
  });

  it('AC-04：缺少選填欄位時照樣成功，缺的那幾項保留本機資料', () => {
    seedEverything();
    const before = snapshot();
    const file = JSON.stringify({ version: 2, kanaProgress: PROGRESS, jlptRecords: [] });

    const result = validateAndImportProgressData(file);

    expect(result.success).toBe(true);
    for (const key of [LEARNING_EVENTS_STORAGE_KEY, SHADOWING_KEY, LANGUAGE_STORAGE_KEY, CHAT_TUTOR_STORAGE_KEY]) {
      expect(localStorage.getItem(key)).toBe(before[key]);
    }
  });

  it('學習事件超過 500 筆時只留前 500 筆（最新在前）', () => {
    const events = Array.from({ length: MAX_LEARNING_EVENTS + 20 }, (_, i) => ({
      id: `e${i}`,
      timestamp: 1_700_000_000_000 - i,
      type: 'quiz_answer',
      source: 'quiz',
    }));

    validateAndImportProgressData(JSON.stringify({ version: 2, kanaProgress: PROGRESS, learningEvents: events }));

    const stored = getLearningEvents();
    expect(stored).toHaveLength(MAX_LEARNING_EVENTS);
    expect(stored[0].id).toBe('e0');
  });

  it('對話教室進度：負數、小數、非數字一律當 0', () => {
    // 先存非 0 的進度：如果匯入沒有真的寫入，結果會停在 5 / 7，測試就會失敗
    saveChatTutorRow('hiragana', 5);
    saveChatTutorRow('katakana', 7);
    validateAndImportProgressData(
      JSON.stringify({ version: 2, kanaProgress: PROGRESS, chatTutorProgress: { hiragana: -3, katakana: 2.5 } }),
    );
    expect(loadChatTutorProgress()).toEqual({ hiragana: 0, katakana: 0 });
  });
});

describe('REQ-005：選填欄位逐一驗證', () => {
  it.each([
    ['progressV2', { schemaVersion: 1, srsStates: {} }, STORAGE_KEY_V2],
    ['learningEvents', [{ id: 'ok', timestamp: 1, type: 'quiz_answer' }, { id: 'no-timestamp', type: 'quiz_answer' }], LEARNING_EVENTS_STORAGE_KEY],
    ['shadowingProgress', { markedOk: ['x'] }, SHADOWING_KEY], // 缺 date 與 todayIds
    ['language', 'fr', LANGUAGE_STORAGE_KEY],
    ['chatTutorProgress', 'row-3', CHAT_TUTOR_STORAGE_KEY],
  ])('%s 不合法：跳過該欄並警告，其餘照常匯入', (field, badValue, key) => {
    seedEverything();
    const before = localStorage.getItem(key);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const file = { ...buildBackupData(), jlptRecords: [], [field]: badValue };

    const result = validateAndImportProgressData(JSON.stringify(file));

    expect(result.success).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(field));
    if (key === STORAGE_KEY_V2) {
      // v2 一定會被 saveProgress 依匯入的 v1 重新產生；要確認的是壞資料沒有被寫進去
      expect(JSON.parse(localStorage.getItem(key)!).schemaVersion).toBe(2);
    } else {
      expect(localStorage.getItem(key)).toBe(before);
    }
    expect(localStorage.getItem(JLPT_STORAGE_KEY)).toBe('[]'); // 其他欄位仍然有匯入
  });
});

describe('REQ-004：匯入 version 1 舊檔', () => {
  const v1File = (extra: Record<string, unknown> = {}) =>
    JSON.stringify({ version: 1, exportedAt: '2026-09-01T00:00:00.000Z', app: 'japanese-kana-learning', kanaProgress: PROGRESS, jlptRecords: JLPT, ...extra });

  it('AC-03：還原假名進度與 JLPT 紀錄', () => {
    const result = validateAndImportProgressData(v1File());
    expect(result.success).toBe(true);
    expect(getStoredProgress().masteredKanaIds).toEqual(['h_a', 'h_i']);
    expect(localStorage.getItem(JLPT_STORAGE_KEY)).toBe(JSON.stringify(JLPT));
  });

  it('AC-03：不動其他資料——即使舊檔裡剛好有同名欄位', () => {
    seedEverything();
    const before = snapshot();

    validateAndImportProgressData(v1File({ learningEvents: [], language: 'zh-CN', chatTutorProgress: { hiragana: 9 } }));

    for (const key of [LEARNING_EVENTS_STORAGE_KEY, SHADOWING_KEY, LANGUAGE_STORAGE_KEY, CHAT_TUTOR_STORAGE_KEY]) {
      expect(localStorage.getItem(key)).toBe(before[key]);
    }
  });

  it('沒有 version 欄位的檔案視同 version 1', () => {
    seedEverything();
    const before = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const result = validateAndImportProgressData(JSON.stringify({ kanaProgress: PROGRESS, language: 'zh-CN' }));
    expect(result.success).toBe(true);
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe(before);
  });
});

describe('拒絕無效的檔案，而且完全不動本機資料', () => {
  it.each([
    ['不是 JSON', 'not json at all'],
    ['不是物件', '42'],
    ['缺少假名進度欄位', JSON.stringify({ version: 2, kanaProgress: { streakDays: 3 }, language: 'zh-CN' })],
  ])('%s', (_label, content) => {
    seedEverything();
    const before = snapshot();

    const result = validateAndImportProgressData(content);

    expect(result.success).toBe(false);
    expect(snapshot()).toEqual(before);
  });
});
