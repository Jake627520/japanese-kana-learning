export type VocabularyType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'expression'
  | 'particle'
  | 'sound-example';

export interface LocalizedString {
  'zh-TW': string;
  'zh-CN': string;
  'en': string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  kanji?: string;
  romaji: string;
  primaryKanaId: string;
  kanaLinks: string[];
  type: VocabularyType;
  meaning: LocalizedString;
  audioKey: string;
  tag?: string;
}
