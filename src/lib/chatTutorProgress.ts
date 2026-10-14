import { KanaType } from '../types';

export const CHAT_TUTOR_STORAGE_KEY = 'chat-tutor-progress-v1';
const STORAGE_KEY = CHAT_TUTOR_STORAGE_KEY;

/**
 * 對話教室的課程位置：每種假名各自記「下一次從第幾行開始」。
 * 只記到「行」為止——行內的進度和小測題目都在對話裡，重建成本高、價值低，
 * 回來時從該行開頭重講一次即可。
 */
export type ChatTutorProgress = Record<KanaType, number>;

const EMPTY: ChatTutorProgress = { hiragana: 0, katakana: 0 };

/** 把任意輸入整理成合法進度：非負整數才保留，其他一律當 0。讀取與備份匯入共用。 */
export function sanitizeChatTutorProgress(raw: unknown): ChatTutorProgress {
  const obj = raw && typeof raw === 'object' ? (raw as Partial<Record<KanaType, unknown>>) : {};
  const clean = (n: unknown) => (typeof n === 'number' && Number.isInteger(n) && n >= 0 ? n : 0);
  return { hiragana: clean(obj.hiragana), katakana: clean(obj.katakana) };
}

export function loadChatTutorProgress(): ChatTutorProgress {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return { ...EMPTY };
    return sanitizeChatTutorProgress(JSON.parse(s));
  } catch {
    return { ...EMPTY };
  }
}

/** 備份匯入用：整份覆寫 */
export function replaceChatTutorProgress(p: ChatTutorProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeChatTutorProgress(p)));
  } catch (e) {
    console.error('Failed to save chat tutor progress', e);
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
