export interface JlptPracticeRecord {
  questionId: string;
  topicId: string;
  selectedOption: number;
  isCorrect: boolean;
  answeredAt: string; // ISO 8601 string
}

const JLPT_STORAGE_KEY = 'japanese_jlpt_practice_records';

export function getStoredJlptRecords(): JlptPracticeRecord[] {
  try {
    const raw = localStorage.getItem(JLPT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setStoredJlptRecords(records: JlptPracticeRecord[]): void {
  try {
    localStorage.setItem(JLPT_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to set stored JLPT records', err);
  }
}

export function recordJlptAnswer(
  questionId: string,
  topicId: string,
  selectedOption: number,
  isCorrect: boolean
): void {
  const records = getStoredJlptRecords();
  records.push({
    questionId,
    topicId,
    selectedOption,
    isCorrect,
    answeredAt: new Date().toISOString(),
  });
  setStoredJlptRecords(records);
}

// 錯題清單：一題若「最新一筆作答」是錯的，就算待複習的錯題。
// 用最新一筆判定（不是「曾經錯過」）——重做答對後，最新紀錄變成對，該題就
// 自動畢業、從清單消失，不必另外記畢業狀態。ISO 8601 時間字串可直接字典序比大小。
export function getWrongQuestionIds(): string[] {
  const latest = new Map<string, JlptPracticeRecord>();
  for (const r of getStoredJlptRecords()) {
    const prev = latest.get(r.questionId);
    if (!prev || r.answeredAt > prev.answeredAt) latest.set(r.questionId, r);
  }
  return [...latest.values()].filter((r) => !r.isCorrect).map((r) => r.questionId);
}
