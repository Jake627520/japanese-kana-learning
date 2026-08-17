export type KanaType = 'hiragana' | 'katakana';
export type KanaCategory = 'basic-hiragana' | 'basic-katakana' | 'dakuten' | 'handakuten';

export interface ExampleWord {
  word: string;
  kanji?: string;
  romaji: string;
  meaning: string;
  sentence: string;
  sentenceDisplay?: string;
  sentenceMeaning: string;
  requiredLevel?: 'basic' | 'dakuten' | 'handakuten' | 'youon';
}

export interface KanaItem {
  id: string;
  type: KanaType;
  category?: KanaCategory;
  kana: string;
  romaji: string;
  row: string; // e.g., 'あ行'
  col: string; // e.g., 'あ段'
  examples: ExampleWord[];
}

export interface KanaReviewState {
  kanaId: string;
  reviewLevel: number; // 0 to 5
  correctCount: number;
  wrongCount: number;
  lastReviewedAt: string | null; // ISO 8601 string
  nextReviewAt: string | null;   // ISO 8601 string
}

export interface UserProgress {
  masteredKanaIds: string[];
  wrongKanaIds: string[];
  streakDays: number;
  lastStudyDate: string;
  reviewStates?: Record<string, KanaReviewState>;
}

export type NavigationTab = 'home' | 'grid' | 'study' | 'quiz' | 'review';

export interface QuizQuestion {
  type: 'kana-to-romaji' | 'audio-to-kana' | 'input-romaji';
  targetKana: KanaItem;
  options: {
    label: string;
    isCorrect: boolean;
    kana: KanaItem;
  }[];
}
