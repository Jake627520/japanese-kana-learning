import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  LEARNING_EVENTS_STORAGE_KEY,
  MAX_LEARNING_EVENTS,
  getLearningEvents,
  logLearningEvent,
  replaceLearningEvents,
  clearLearningEvents,
} from './learningEvents';
import { LearningEvent } from '../types/learning';

// 取代 scripts/test-learning-events.py：原本只比對原始碼字串，
// 再用 Python 自己模擬一份 localStorage 生命週期。這裡改成直接跑真的 TS。

const NOW = new Date(2026, 7, 27, 10, 0, 0).getTime();

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('常數契約', () => {
  it('儲存鍵是 learning-events-v1，上限 500 筆', () => {
    expect(LEARNING_EVENTS_STORAGE_KEY).toBe('learning-events-v1');
    expect(MAX_LEARNING_EVENTS).toBe(500);
  });
});

describe('getLearningEvents', () => {
  it('沒有資料時回傳空陣列', () => {
    expect(getLearningEvents()).toEqual([]);
  });

  it('JSON 壞掉時回傳空陣列，不丟例外', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(LEARNING_EVENTS_STORAGE_KEY, 'INVALID_JSON_CORRUPTED{[');
    expect(getLearningEvents()).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('JSON 合法但不是陣列時回傳空陣列', () => {
    localStorage.setItem(LEARNING_EVENTS_STORAGE_KEY, '{"id":"x"}');
    expect(getLearningEvents()).toEqual([]);
  });

  it('沒有 window（SSR）時回傳空陣列，不讀 storage', () => {
    localStorage.setItem(LEARNING_EVENTS_STORAGE_KEY, JSON.stringify([{ id: 'a' }]));
    vi.stubGlobal('window', undefined);
    expect(getLearningEvents()).toEqual([]);
  });
});

describe('logLearningEvent', () => {
  it('自動產生 id 與 timestamp，並寫入 storage', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const evt = logLearningEvent({ type: 'quiz_answer', source: 'quiz_view', kanaId: 'h_a', correct: true });

    expect(evt.id).toMatch(new RegExp(`^evt_${NOW}_[a-z0-9]+$`));
    expect(evt.timestamp).toBe(NOW);
    expect(getLearningEvents()).toEqual([evt]);
  });

  it('呼叫端給的 id 與 timestamp 會被保留', () => {
    const evt = logLearningEvent({ id: 'fixed', timestamp: 123, type: 'review_complete', source: 'review' });
    expect(evt.id).toBe('fixed');
    expect(evt.timestamp).toBe(123);
  });

  it('只帶有值的選填欄位；correct=false 與 responseMs=0 不能被當成「沒有」丟掉', () => {
    const evt = logLearningEvent({
      id: 'e1',
      timestamp: NOW,
      type: 'quiz_answer',
      source: 'listening_confusion',
      kanaId: 'h_tsu',
      selectedKanaId: 'h_shi',
      correct: false,
      responseMs: 0,
    });
    expect(evt).toEqual({
      id: 'e1',
      timestamp: NOW,
      type: 'quiz_answer',
      source: 'listening_confusion',
      kanaId: 'h_tsu',
      selectedKanaId: 'h_shi',
      correct: false,
      responseMs: 0,
    });

    const bare = logLearningEvent({ id: 'e2', timestamp: NOW, type: 'shadowing_complete', source: 'shadowing_view' });
    expect(Object.keys(bare).sort()).toEqual(['id', 'source', 'timestamp', 'type']);
  });

  it('新事件放在最前面（最新在前）', () => {
    logLearningEvent({ id: 'old', timestamp: 1, type: 'quiz_answer', source: 'quiz' });
    logLearningEvent({ id: 'new', timestamp: 2, type: 'quiz_answer', source: 'quiz' });
    expect(getLearningEvents().map((e) => e.id)).toEqual(['new', 'old']);
  });

  it('超過 500 筆時只保留最新的 500 筆', () => {
    logLearningEvent({ id: 'first', timestamp: 1, type: 'quiz_answer', source: 'quiz_view', kanaId: 'h_a', correct: true });
    for (let i = 0; i < 550; i++) {
      logLearningEvent({ id: `r${i}`, timestamp: 2 + i, type: 'review_complete', source: 'review_view', kanaId: `h_${i}`, correct: false });
    }

    const events = getLearningEvents();
    expect(events).toHaveLength(500);
    // 共 551 筆：最新的是 r549，第 500 筆是 r50；first 與 r0..r49 被擠掉
    expect(events[0].id).toBe('r549');
    expect(events[499].id).toBe('r50');
    expect(events.some((e) => e.id === 'first')).toBe(false);
  });

  it('沒有 window 時仍回傳事件，但不寫入 storage', () => {
    vi.stubGlobal('window', undefined);
    const evt = logLearningEvent({ id: 'e1', timestamp: NOW, type: 'quiz_answer', source: 'quiz' });
    expect(evt.id).toBe('e1');
    expect(localStorage.getItem(LEARNING_EVENTS_STORAGE_KEY)).toBeNull();
  });
});

describe('replaceLearningEvents / clearLearningEvents', () => {
  it('replace 只保留前 500 筆（最新在前的順序）', () => {
    const events: LearningEvent[] = Array.from({ length: 600 }, (_, i) => ({
      id: `e${i}`,
      timestamp: 1000 - i,
      type: 'quiz_answer',
      source: 'quiz',
    }));
    replaceLearningEvents(events);
    const stored = getLearningEvents();
    expect(stored).toHaveLength(500);
    expect(stored[0].id).toBe('e0');
    expect(stored[499].id).toBe('e499');
  });

  it('clear 之後讀回空陣列', () => {
    localStorage.setItem(LEARNING_EVENTS_STORAGE_KEY, JSON.stringify([{ id: 'test' }]));
    clearLearningEvents();
    expect(localStorage.getItem(LEARNING_EVENTS_STORAGE_KEY)).toBeNull();
    expect(getLearningEvents()).toEqual([]);
  });
});
