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
