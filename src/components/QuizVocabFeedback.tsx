import React from 'react';
import { Volume2 } from 'lucide-react';
import { getPrimaryVocabularyByKanaId, playVocabularyAudio } from '../data/vocabulary';
import { VocabularyKanaBreakdown } from './VocabularyKanaBreakdown';
import { useI18n, localize } from '../i18n';

interface QuizVocabFeedbackProps {
  key?: React.Key;
  kanaId: string;
  compact?: boolean;
}

export function QuizVocabFeedback({ kanaId, compact = false }: QuizVocabFeedbackProps) {
  const { t, language } = useI18n();
  const vocab = getPrimaryVocabularyByKanaId(kanaId);

  if (!vocab) return null;

  const meaning = localize(vocab.meaning, language);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    void playVocabularyAudio(vocab);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2.5 bg-[color:var(--moss-93)]/70 rounded-xl border border-[color:var(--moss-79)]/60 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-[color:var(--ink-24)]">
            {vocab.kanji ? `${vocab.kanji} (${vocab.word})` : vocab.word}
          </span>
          <span className="text-[color:var(--moss-50)] font-bold">[{vocab.romaji}]</span>
          <span className="text-[color:var(--ink-50)] text-[11px]">・{meaning}</span>
        </div>
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${vocab.word}`}
          title={t('study.listenWord')}
          className="p-1 text-[color:var(--moss-50)] hover:text-[color:var(--moss-43)] hover:bg-emerald-100 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
        >
          <Volume2 size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-[color:var(--moss-93)]/60 rounded-2xl border border-[color:var(--moss-79)]/70 space-y-2 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-[color:var(--moss-50)] tracking-wide">
          {t('study.representativeWord')}
        </span>
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${vocab.word}`}
          title={t('study.listenWord')}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] rounded-lg text-xs font-bold shadow-xs hover:bg-[color:var(--moss-43)] transition-colors cursor-pointer"
        >
          <Volume2 size={13} />
          <span>{t('study.listenWord')}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            {vocab.kanji && (
              <span className="text-base font-extrabold text-[color:var(--ink-24)]">{vocab.kanji}</span>
            )}
            <span className="text-sm font-bold text-[color:var(--ink-33)]">({vocab.word})</span>
            <span className="text-xs font-bold text-[color:var(--moss-50)]">[{vocab.romaji}]</span>
          </div>
          <div className="text-xs font-semibold text-[color:var(--ink-50)]">
            {meaning}
          </div>
        </div>

        <VocabularyKanaBreakdown item={vocab} currentKanaId={kanaId} />
      </div>
    </div>
  );
}
