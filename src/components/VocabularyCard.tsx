import React from 'react';
import { Volume2 } from 'lucide-react';
import type { VocabularyItem } from '../data/vocabulary/vocabularyTypes';
import { playVocabularyAudio } from '../data/vocabulary/vocabularyAudio';
import { VocabularyKanaBreakdown } from './VocabularyKanaBreakdown';
import type { Language } from '../i18n';

interface VocabularyCardProps {
  item: VocabularyItem;
  locale: Language;
  currentKanaId?: string;
}

export function VocabularyCard({
  item,
  locale,
  currentKanaId,
}: VocabularyCardProps) {
  const meaning = item.meaning[locale] || item.meaning['zh-TW'];

  const handlePlay = () => {
    void playVocabularyAudio(item);
  };

  return (
    <section
      className="vocabulary-card"
      aria-label={`${item.word} vocabulary`}
    >
      <div className="vocabulary-card__header">
        <div className="space-y-1">
          {item.kanji && (
            <div className="vocabulary-card__kanji">
              {item.kanji}
            </div>
          )}

          <VocabularyKanaBreakdown
            item={item}
            currentKanaId={currentKanaId}
          />
        </div>

        <button
          type="button"
          className="vocabulary-card__audio"
          onClick={handlePlay}
          aria-label={`Play pronunciation of ${item.word}`}
          title={`Play ${item.word}`}
        >
          <Volume2 size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="vocabulary-card__meaning">
        {meaning}
      </div>
    </section>
  );
}
