export type KanaType = 'hiragana' | 'katakana';
export type KanaCategory = 'basic-hiragana' | 'basic-katakana' | 'dakuten' | 'handakuten' | 'youon';

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

export type NavigationTab = 'home' | 'grid' | 'study' | 'quiz' | 'review' | 'special' | 'jlpt' | 'shadowing';

export interface QuizQuestion {
  type: 'kana-to-romaji' | 'audio-to-kana' | 'input-romaji' | 'kana-to-kana';
  targetKana: KanaItem;
  options: {
    label: string;
    isCorrect: boolean;
    kana: KanaItem;
  }[];
}

// ── JLPT 模組（第一期）──
export type JlptGrade = 'n5' | 'n4' | 'n3';

export interface JlptTopic {
  id: string;
  type: string;
  subject: string;
  domain: string;
  name: string;
  description: string;
  book: string;
  chapter: string;
  grade: JlptGrade;
  evidence: string[];
  assessmentPrompt?: string | null;
}

export interface JlptQuestion {
  id: string;
  subject: string;
  year: number;
  paper: string;
  number: number;
  type: 'single';
  score: number;
  stem: string;
  options: string[];
  answer: string; // "1" | "2" | "3" | "4"
  explain: string;
  source: {
    book: string;
    chapter: string;
    level: string;
    confirmed: boolean;
    license: 'own';
    origin: 'own';
  };
  topics: {
    primary: string;
    topicIds: string[];
  };
}
