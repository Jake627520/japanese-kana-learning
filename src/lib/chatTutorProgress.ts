import { KanaType } from '../types';

const STORAGE_KEY = 'chat-tutor-progress-v1';

/**
 * 對話教室的課程位置：每種假名各自記「下一次從第幾行開始」。
 * 只記到「行」為止——行內的進度和小測題目都在對話裡，重建成本高、價值低，
 * 回來時從該行開頭重講一次即可。
 */
export type ChatTutorProgress = Record<KanaType, number>;

const EMPTY: ChatTutorProgress = { hiragana: 0, katakana: 0 };

export function loadChatTutorProgress(): ChatTutorProgress {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return { ...EMPTY };
    const parsed = JSON.parse(s) as Partial<ChatTutorProgress>;
    const clean = (n: unknown) => (typeof n === 'number' && Number.isInteger(n) && n >= 0 ? n : 0);
    return { hiragana: clean(parsed.hiragana), katakana: clean(parsed.katakana) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveChatTutorRow(type: KanaType, rowIdx: number): void {
  try {
    const next = { ...loadChatTutorProgress(), [type]: rowIdx };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save chat tutor progress', e);
  }
}
