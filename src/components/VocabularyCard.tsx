import React from 'react';
import { Volume2 } from 'lucide-react';
import type { VocabularyItem } from '../data/vocabulary/vocabularyTypes';
import { playVocabularyAudio } from '../data/vocabulary/vocabularyAudio';
import type { Language } from '../i18n';

interface VocabularyCardProps {
  item: VocabularyItem;
  locale: Language;
}

export function VocabularyCard({
  item,
  locale,
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
        <div>
          {item.kanji && (
            <div className="vocabulary-card__kanji">
              {item.kanji}
            </div>
          )}

          <div className="vocabulary-card__word">
            {item.word}
          </div>

          <div className="vocabulary-card__romaji">
            {item.romaji}
          </div>
        </div>

        <button
          type="button"
          className="vocabulary-card__audio"
          onClick={handlePlay}
          aria-label={`Play pronunciation of ${item.word}`}
          title={`Play ${item.word}`}
        >
          <Volume2 size={20} aria-hidden="true" />
          <span>🔊</span>
        </button>
      </div>

      <div className="vocabulary-card__meaning">
        {meaning}
      </div>
    </section>
  );
}
