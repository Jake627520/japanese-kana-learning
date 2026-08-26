export interface LocalizedString {
  'zh-TW': string;
  'zh-CN': string;
  'en': string;
}

export type VocabularyType = 'noun' | 'verb' | 'adjective' | 'particle' | 'sound-example';

export interface VocabularyItem {
  id: string;              // Unique identifier e.g. "vocab_asa"
  word: string;            // Japanese kana text e.g. "あさ"
  kanji?: string;          // Kanji representation e.g. "朝"
  romaji: string;          // Romaji e.g. "asa"
  kanaLinks: string[];     // Array of related kana IDs e.g. ["h_a", "h_sa"]
  type: VocabularyType;    // Word category or special marker
  meaning: LocalizedString; // Trilingual meanings
  audioKey: string;        // Audio identifier e.g. "vocab_asa"
  tag?: string;            // e.g. "seion46"
}
