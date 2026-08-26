export * from './vocabularyTypes';
export * from './seion46';
export * from './vocabularyAudio';

import { SEION_46_VOCABULARY } from './seion46';
import { VocabularyItem } from './vocabularyTypes';
import { ALL_LEARNABLE_KANA } from '../kanaData';

export const ALL_VOCABULARY: VocabularyItem[] = [
  ...SEION_46_VOCABULARY,
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
  return ALL_VOCABULARY.find((item) => item.kanaLinks[0] === kanaId) ||
         ALL_VOCABULARY.find((item) => item.kanaLinks.includes(kanaId));
}
