import type { Language } from '../../i18n/types';

export type VocabularyType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'expression'
  | 'particle'
  | 'sound-example';

export type LocalizedString = Record<Language, string>;

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
