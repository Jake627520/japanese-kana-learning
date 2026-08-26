export * from './vocabularyTypes';
export * from './seion46';
export * from './dakuten20';
export * from './handakuten5';
export * from './youon33';
export * from './katakanaSeion46';
export * from './katakanaDakuten20';
export * from './katakanaHandakuten5';
export * from './vocabularyAudio';

import { SEION_46_VOCABULARY } from './seion46';
import { DAKUTEN_20_VOCABULARY } from './dakuten20';
import { HANDAKUTEN_5_VOCABULARY } from './handakuten5';
import { YOUON_33_VOCABULARY } from './youon33';
import { KATAKANA_SEION_46_VOCABULARY } from './katakanaSeion46';
import { KATAKANA_DAKUTEN_20_VOCABULARY } from './katakanaDakuten20';
import { KATAKANA_HANDAKUTEN_5_VOCABULARY } from './katakanaHandakuten5';
import { VocabularyItem } from './vocabularyTypes';
import { ALL_LEARNABLE_KANA } from '../kanaData';

export const ALL_VOCABULARY: VocabularyItem[] = [
  ...SEION_46_VOCABULARY,
  ...DAKUTEN_20_VOCABULARY,
  ...HANDAKUTEN_5_VOCABULARY,
  ...YOUON_33_VOCABULARY,
  ...KATAKANA_SEION_46_VOCABULARY,
  ...KATAKANA_DAKUTEN_20_VOCABULARY,
  ...KATAKANA_HANDAKUTEN_5_VOCABULARY,
];

const KANA_MAP = new Map<string, string>(
  ALL_LEARNABLE_KANA.map((item) => [item.id, item.kana])
);

export function getKanaCharacterById(kanaId: string): string | undefined {
  return KANA_MAP.get(kanaId);
}

export interface VocabularyKanaPart {
  kanaId: string;
  character: string;
}

export function getVocabularyKanaBreakdown(item: VocabularyItem): VocabularyKanaPart[] {
  return item.kanaLinks
    .map((kanaId) => {
      const character = getKanaCharacterById(kanaId);
      if (!character) return null;
      return { kanaId, character };
    })
    .filter((part): part is VocabularyKanaPart => part !== null);
}

export function getVocabularyByKanaId(kanaId: string): VocabularyItem[] {
  return ALL_VOCABULARY.filter((item) => item.kanaLinks.includes(kanaId));
}

export function getPrimaryVocabularyByKanaId(kanaId: string): VocabularyItem | undefined {
  return ALL_VOCABULARY.find((item) => item.primaryKanaId === kanaId) ||
         ALL_VOCABULARY.find((item) => item.kanaLinks[0] === kanaId) ||
         ALL_VOCABULARY.find((item) => item.kanaLinks.includes(kanaId));
}
