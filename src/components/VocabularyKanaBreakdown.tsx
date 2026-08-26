import React from 'react';
import type { VocabularyItem } from '../data/vocabulary/vocabularyTypes';
import { getVocabularyKanaBreakdown } from '../data/vocabulary';

interface VocabularyKanaBreakdownProps {
  item: VocabularyItem;
  currentKanaId?: string;
}

export function VocabularyKanaBreakdown({
  item,
  currentKanaId,
}: VocabularyKanaBreakdownProps) {
  const parts = getVocabularyKanaBreakdown(item);

  if (parts.length === 0) {
    return null;
  }

  return (
    <div
      className="vocabulary-kana-breakdown"
      aria-label={`Kana breakdown for ${item.word}`}
    >
      <div className="vocabulary-kana-breakdown__parts">
        {parts.map((part, index) => (
          <span key={`${part.kanaId}-${index}`} className="inline-flex items-center">
            <span
              className={
                part.kanaId === currentKanaId
                  ? 'vocabulary-kana-breakdown__kana vocabulary-kana-breakdown__kana--current'
                  : 'vocabulary-kana-breakdown__kana'
              }
            >
              {part.character}
            </span>

            {index < parts.length - 1 && (
              <span
                className="vocabulary-kana-breakdown__separator"
                aria-hidden="true"
              >
                ・
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="vocabulary-kana-breakdown__word">
        {item.word}
      </div>

      <div className="vocabulary-kana-breakdown__romaji">
        {item.romaji}
      </div>
    </div>
  );
}
