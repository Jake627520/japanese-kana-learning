import type { LocalizedText } from '../../i18n/types';

export type VocabularyType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'expression'
  | 'particle'
  | 'sound-example';

export interface VocabularyItem {
  id: string;
  word: string;
  kanji?: string;
  romaji: string;
  primaryKanaId: string;
  kanaLinks: string[];
  type: VocabularyType;
  meaning: LocalizedText;
  audioKey: string;
  tag?: string;
}
