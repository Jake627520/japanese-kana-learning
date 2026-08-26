export * from './vocabularyTypes';
export * from './seion46';
export * from './vocabularyAudio';

import { SEION_46_VOCABULARY } from './seion46';
import { VocabularyItem } from './vocabularyTypes';

export const ALL_VOCABULARY: VocabularyItem[] = [
  ...SEION_46_VOCABULARY,
];

export function getVocabularyByKanaId(kanaId: string): VocabularyItem[] {
  return ALL_VOCABULARY.filter((item) => item.kanaLinks.includes(kanaId));
}

export function getPrimaryVocabularyByKanaId(kanaId: string): VocabularyItem | undefined {
  return ALL_VOCABULARY.find((item) => item.kanaLinks[0] === kanaId) ||
         ALL_VOCABULARY.find((item) => item.kanaLinks.includes(kanaId));
}
