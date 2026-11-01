import React from 'react';
import { KanaItem } from '../types';
import { speakJapanese } from '../utils/speech';
import { toggleKanaMastered } from '../utils/storage';
import { getPrimaryVocabularyByKanaId } from '../data/vocabulary';
import { VocabularyCard } from './VocabularyCard';
import { Volume2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useI18n, localize } from '../i18n';

interface KanaCardViewProps {
  currentKana: KanaItem;
  allKana: KanaItem[];
  masteredIds: string[];
  onProgressChange: () => void;
  onBackToGrid: () => void;
  onSelectKana: (kana: KanaItem) => void;
}

export function KanaCardView({
  currentKana,
  allKana,
  masteredIds,
  onProgressChange,
  onBackToGrid,
  onSelectKana,
}: KanaCardViewProps) {
  const { t, language } = useI18n();
  const currentIndex = allKana.findIndex((k) => k.id === currentKana.id);
  const isMastered = masteredIds.includes(currentKana.id);
  const primaryVocab = getPrimaryVocabularyByKanaId(currentKana.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectKana(allKana[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allKana.length - 1) {
      onSelectKana(allKana[currentIndex + 1]);
    }
  };

  const handleToggleMastered = () => {
    toggleKanaMastered(currentKana.id);
    onProgressChange();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Nav Back */}
      <button
        onClick={onBackToGrid}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-50)] bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-xl hover:text-[color:var(--ink-24)] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t('study.backToGrid')}
      </button>

      {/* Main Card */}
      <div className="bg-[color:var(--paper-bg)] rounded-3xl p-6 sm:p-8 border border-[color:var(--paper-85)] shadow-xs space-y-6 relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[color:var(--ink-50)] bg-[color:var(--paper-92)] px-3 py-1 rounded-full">
            {currentKana.row} ・ {currentKana.col}
          </span>

          <button
            onClick={handleToggleMastered}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isMastered
                ? 'bg-[color:var(--moss-93)] text-[color:var(--moss-50)] border border-[color:var(--moss-50)]'
                : 'bg-[color:var(--paper-bg)] text-[color:var(--ink-50)] border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isMastered ? t('study.unmarkMastered') : t('study.markMastered')}
          </button>
        </div>

        {/* Kana Display */}
        <div className="text-center py-6 space-y-3 bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--paper-92)] relative">
          <div className="text-7xl font-extrabold text-[color:var(--ink-24)]">{currentKana.kana}</div>
          <div className="text-xl font-black text-[color:var(--moss-50)] uppercase">{currentKana.romaji}</div>

          <button
            onClick={() => speakJapanese(currentKana.kana)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] rounded-xl text-xs font-bold shadow-xs hover:bg-[color:var(--moss-43)] transition-all cursor-pointer mt-2"
          >
            <Volume2 className="w-4 h-4" />
            {t('study.listenPronounce')}
          </button>
        </div>

        {/* Representative Vocabulary (v1.6.2 VocabularyCard) */}
        {primaryVocab && (
          <VocabularyCard
            item={primaryVocab}
            locale={language}
            currentKanaId={currentKana.id}
          />
        )}

        {/* Existing Examples & Sentences */}
        {currentKana.examples && currentKana.examples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[color:var(--ink-24)]">{t('study.examples')}</h3>
            <div className="space-y-3">
              {currentKana.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--paper-85)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-[color:var(--ink-24)]">{ex.word}</span>
                      <span className="text-xs font-bold text-[color:var(--moss-50)]">({ex.romaji})</span>
                      <button
                        onClick={() => speakJapanese(ex.word)}
                        aria-label={`Play ${ex.word}`}
                        className="p-1 text-[color:var(--ink-50)] hover:text-[color:var(--moss-50)] transition-colors cursor-pointer rounded-md hover:bg-[color:var(--paper-92)]"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-[color:var(--ink-50)]">{localize(ex.meaning, language)}</span>
                  </div>
                  {ex.sentence && (
                    <div className="text-xs text-[color:var(--ink-43)] pt-1 flex items-center justify-between">
                      <span>
                        {t('study.sentence')}: {ex.sentence} ({localize(ex.sentenceMeaning, language)})
                      </span>
                      <button
                        onClick={() => speakJapanese(ex.sentence)}
                        aria-label={`Play sentence: ${ex.sentence}`}
                        className="p-1 text-[color:var(--ink-50)] hover:text-[color:var(--moss-50)] transition-colors cursor-pointer rounded-md hover:bg-[color:var(--paper-92)] shrink-0 ml-2"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card Switch Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[color:var(--paper-92)]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-xl text-xs font-bold text-[color:var(--ink-24)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[color:var(--paper-bg)] cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('study.prevKana')}
          </button>

          <span className="text-xs font-bold text-[color:var(--ink-50)]">
            {currentIndex + 1} / {allKana.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === allKana.length - 1}
            className="px-4 py-2 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[color:var(--moss-43)] cursor-pointer flex items-center gap-1.5"
          >
            {t('study.nextKana')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
