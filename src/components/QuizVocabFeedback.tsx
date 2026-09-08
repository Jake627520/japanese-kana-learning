import React from 'react';
import { Volume2 } from 'lucide-react';
import { getPrimaryVocabularyByKanaId, playVocabularyAudio } from '../data/vocabulary';
import { VocabularyKanaBreakdown } from './VocabularyKanaBreakdown';
import { useI18n } from '../i18n';

interface QuizVocabFeedbackProps {
  key?: React.Key;
  kanaId: string;
  compact?: boolean;
}

export function QuizVocabFeedback({ kanaId, compact = false }: QuizVocabFeedbackProps) {
  const { t, language } = useI18n();
  const vocab = getPrimaryVocabularyByKanaId(kanaId);

  if (!vocab) return null;

  const meaning = vocab.meaning[language] || vocab.meaning['zh-TW'];

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    void playVocabularyAudio(vocab);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2.5 bg-[#E6EAD5]/70 rounded-xl border border-[#B6C096]/60 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-[#221F18]">
            {vocab.kanji ? `${vocab.kanji} (${vocab.word})` : vocab.word}
          </span>
          <span className="text-[#5C6B3D] font-bold">[{vocab.romaji}]</span>
          <span className="text-[#6B6252] text-[11px]">・{meaning}</span>
        </div>
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${vocab.word}`}
          title={t('study.listenWord')}
          className="p-1 text-[#5C6B3D] hover:text-[#47552F] hover:bg-emerald-100 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
        >
          <Volume2 size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-[#E6EAD5]/60 rounded-2xl border border-[#B6C096]/70 space-y-2 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-[#5C6B3D] tracking-wide">
          {t('study.representativeWord')}
        </span>
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${vocab.word}`}
          title={t('study.listenWord')}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#5C6B3D] text-[#F1EFE0] rounded-lg text-xs font-bold shadow-xs hover:bg-[#47552F] transition-colors cursor-pointer"
        >
          <Volume2 size={13} />
          <span>{t('study.listenWord')}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            {vocab.kanji && (
              <span className="text-base font-extrabold text-[#221F18]">{vocab.kanji}</span>
            )}
            <span className="text-sm font-bold text-[#3A3529]">({vocab.word})</span>
            <span className="text-xs font-bold text-[#5C6B3D]">[{vocab.romaji}]</span>
          </div>
          <div className="text-xs font-semibold text-[#6B6252]">
            {meaning}
          </div>
        </div>

        <VocabularyKanaBreakdown item={vocab} currentKanaId={kanaId} />
      </div>
    </div>
  );
}
