import { getStoredProgress, saveProgress } from './storage';
import { getStoredJlptRecords, setStoredJlptRecords, JlptPracticeRecord } from './jlptStorage';
import { UserProgress } from '../types';

export interface ExportBackupData {
  version: number;
  exportedAt: string;
  app: string;
  kanaProgress: UserProgress;
  jlptRecords: JlptPracticeRecord[];
}

/**
 * 匯出所有假名與 JLPT 進度資料為 JSON 檔案
 */
export function exportAllProgressData(): void {
  const kanaProgress = getStoredProgress();
  const jlptRecords = getStoredJlptRecords();

  const backupData: ExportBackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'japanese-kana-learning',
    kanaProgress,
    jlptRecords,
  };

  const jsonString = JSON.stringify(backupData, null, 2);
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

    // 儲存假名進度
    saveProgress(validatedKanaProgress);

    // 儲存 JLPT 作答記錄（若有）
    if (Array.isArray(parsed.jlptRecords)) {
      setStoredJlptRecords(parsed.jlptRecords);
    }

    return { success: true, message: '進度備份匯入成功！' };
  } catch (err) {
    return { success: false, message: '解析檔案失敗，請確認檔案格式是否正確。' };
  }
}
