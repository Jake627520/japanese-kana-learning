import { getStoredProgress, saveProgress, saveProgressV2, resetProgressV2FromV1, STORAGE_KEY_V2 } from './storage';
import { getStoredJlptRecords, setStoredJlptRecords, JlptPracticeRecord } from './jlptStorage';
import { LEARNING_EVENTS_STORAGE_KEY, replaceLearningEvents } from './learningEvents';
import { getShadowingProgressRaw, replaceShadowingProgress, ShadowingProgress } from '../lib/shadowingProgress';
import {
  CHAT_TUTOR_STORAGE_KEY,
  replaceChatTutorProgress,
  sanitizeChatTutorProgress,
  ChatTutorProgress,
} from '../lib/chatTutorProgress';
import { LANGUAGE_STORAGE_KEY, Language } from '../i18n';
import { UserProgress } from '../types';
import { UserProgressV2 } from './srs/types';
import { LearningEvent } from '../types/learning';

const LANGUAGES: Language[] = ['en', 'zh-TW', 'zh-CN'];

/**
 * 備份檔格式（CHG-005）。
 * version 1：只有 kanaProgress 與 jlptRecords。
 * version 2：再加上其餘 5 個 localStorage 鍵。新欄位都是選填——
 *   匯出時本機沒有該資料就不放；匯入時檔案沒有該欄位就保留本機現有資料。
 */
export interface ExportBackupData {
  version: number;
  exportedAt: string;
  app: string;
  kanaProgress: UserProgress;
  jlptRecords: JlptPracticeRecord[];
  progressV2?: UserProgressV2;
  learningEvents?: LearningEvent[];
  shadowingProgress?: ShadowingProgress;
  language?: Language;
  chatTutorProgress?: ChatTutorProgress;
}

/** 讀一個 JSON 格式的 localStorage 鍵；不存在或壞掉時回傳 undefined */
function readJsonKey(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch (e) {
    console.error(`Backup export: cannot read ${key}`, e);
    return undefined;
  }
}

/** 收集這台裝置上全部的學習資料（REQ-001） */
export function buildBackupData(): ExportBackupData {
  const data: ExportBackupData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    app: 'japanese-kana-learning',
    kanaProgress: getStoredProgress(),
    jlptRecords: getStoredJlptRecords(),
  };

  const progressV2 = readJsonKey(STORAGE_KEY_V2);
  if (isProgressV2(progressV2)) data.progressV2 = progressV2;

  const events = readJsonKey(LEARNING_EVENTS_STORAGE_KEY);
  if (Array.isArray(events)) data.learningEvents = events as LearningEvent[];

  const shadowing = getShadowingProgressRaw();
  if (shadowing) data.shadowingProgress = shadowing;

  try {
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(language)) data.language = language;
  } catch (e) {
    console.error('Backup export: cannot read language', e);
  }

  const chat = readJsonKey(CHAT_TUTOR_STORAGE_KEY);
  if (chat !== undefined) data.chatTutorProgress = sanitizeChatTutorProgress(chat);

  return data;
}

/**
 * 匯出所有學習資料為 JSON 檔案
 */
export function exportAllProgressData(): void {
  const jsonString = JSON.stringify(buildBackupData(), null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];

  const link = document.createElement('a');
  link.href = url;
  link.download = `kana-jlpt-progress-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 驗證並匯入進度 JSON 檔案
 */
export function validateAndImportProgressData(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: '無效的 JSON 備份檔案。' };
    }

    // 檢查是否有假名進度或至少為本系統備份
    const rawKana = parsed.kanaProgress || parsed;

    if (!rawKana || typeof rawKana !== 'object') {
      return { success: false, message: '找不到有效的學習進度資料結構。' };
    }

    // 驗證假名進度必要欄位與陣列型別
    if (
      !Array.isArray(rawKana.masteredKanaIds) ||
      !Array.isArray(rawKana.wrongKanaIds)
    ) {
      return { success: false, message: '檔案內容非本系統相容的進度備份。' };
    }

    const validatedKanaProgress: UserProgress = {
      masteredKanaIds: rawKana.masteredKanaIds,
      wrongKanaIds: rawKana.wrongKanaIds,
      streakDays: typeof rawKana.streakDays === 'number' ? rawKana.streakDays : 1,
      lastStudyDate: rawKana.lastStudyDate || new Date().toISOString().split('T')[0],
      reviewStates: rawKana.reviewStates && typeof rawKana.reviewStates === 'object' ? rawKana.reviewStates : {},
    };

    // 儲存假名進度。saveProgress 會保留本機既有的 v2 調適資料（CHG-006 M5），
    // 但匯入是整份還原，所以 v2 改依匯入的 v1 重建；檔案帶有合法 progressV2 時，下面會再覆寫。
    saveProgress(validatedKanaProgress);
    resetProgressV2FromV1(validatedKanaProgress);

    // 儲存 JLPT 作答記錄（若有）
    if (Array.isArray(parsed.jlptRecords)) {
      setStoredJlptRecords(parsed.jlptRecords);
    }

    // REQ-004：version 1 或沒有 version 的舊檔，只還原上面兩項
    if (parsed.version === 2) {
      importOptionalFields(parsed);
    }

    return { success: true, message: '進度備份匯入成功！' };
  } catch (err) {
    return { success: false, message: '解析檔案失敗，請確認檔案格式是否正確。' };
  }
}

/**
 * REQ-003 / REQ-005 / REQ-006：逐欄驗證後覆寫。
 * 欄位不存在 → 跳過；欄位存在但不合法 → 跳過並警告；寫入失敗由各 replace* 自行記錄，不中斷其他欄位。
 */
function importOptionalFields(parsed: Record<string, unknown>): void {
  const skip = (field: string) => console.warn(`Backup import: skipped invalid field "${field}"`);

  if (parsed.progressV2 !== undefined) {
    if (isProgressV2(parsed.progressV2)) saveProgressV2(parsed.progressV2);
    else skip('progressV2');
  }

  if (parsed.learningEvents !== undefined) {
    if (Array.isArray(parsed.learningEvents) && parsed.learningEvents.every(isLearningEvent)) {
      replaceLearningEvents(parsed.learningEvents);
    } else skip('learningEvents');
  }

  if (parsed.shadowingProgress !== undefined) {
    if (isShadowingProgress(parsed.shadowingProgress)) replaceShadowingProgress(parsed.shadowingProgress);
    else skip('shadowingProgress');
  }

  if (parsed.language !== undefined) {
    if (isLanguage(parsed.language)) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, parsed.language);
      } catch (e) {
        console.error('Backup import: cannot save language', e);
      }
    } else skip('language');
  }

  if (parsed.chatTutorProgress !== undefined) {
    if (parsed.chatTutorProgress && typeof parsed.chatTutorProgress === 'object') {
      replaceChatTutorProgress(sanitizeChatTutorProgress(parsed.chatTutorProgress));
    } else skip('chatTutorProgress');
  }
}

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function isProgressV2(v: unknown): v is UserProgressV2 {
  return isObject(v) && v.schemaVersion === 2 && isObject(v.srsStates);
}

function isLearningEvent(e: unknown): e is LearningEvent {
  return isObject(e) && typeof e.id === 'string' && typeof e.timestamp === 'number' && typeof e.type === 'string';
}

function isShadowingProgress(v: unknown): v is ShadowingProgress {
  return isObject(v) && typeof v.date === 'string' && Array.isArray(v.todayIds);
}

function isLanguage(v: unknown): v is Language {
  return typeof v === 'string' && (LANGUAGES as string[]).includes(v);
}
