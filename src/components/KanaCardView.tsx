import React from 'react';
import { KanaItem } from '../types';
import { speakJapanese } from '../utils/speech';
import { toggleKanaMastered } from '../utils/storage';
import { getPrimaryVocabularyByKanaId } from '../data/vocabulary';
import { VocabularyCard } from './VocabularyCard';
import { Volume2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n';

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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6B6252] bg-[#F4EEDE] border border-[#D9CDB2] rounded-xl hover:text-[#221F18] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t('study.backToGrid')}
      </button>

      {/* Main Card */}
      <div className="bg-[#F4EEDE] rounded-3xl p-6 sm:p-8 border border-[#D9CDB2] shadow-xs space-y-6 relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6B6252] bg-[#ECE4D0] px-3 py-1 rounded-full">
            {currentKana.row} ・ {currentKana.col}
          </span>

          <button
            onClick={handleToggleMastered}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isMastered
                ? 'bg-[#E6EAD5] text-[#5C6B3D] border border-[#5C6B3D]'
                : 'bg-[#F4EEDE] text-[#6B6252] border border-[#D9CDB2] hover:border-[#5C6B3D]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isMastered ? t('study.unmarkMastered') : t('study.markMastered')}
          </button>
        </div>

        {/* Kana Display */}
        <div className="text-center py-6 space-y-3 bg-[#F4EEDE] rounded-2xl border border-[#ECE4D0] relative">
          <div className="text-7xl font-extrabold text-[#221F18]">{currentKana.kana}</div>
          <div className="text-xl font-black text-[#5C6B3D] uppercase">{currentKana.romaji}</div>

          <button
            onClick={() => speakJapanese(currentKana.kana)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C6B3D] text-[#F1EFE0] rounded-xl text-xs font-bold shadow-xs hover:bg-[#47552F] transition-all cursor-pointer mt-2"
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
            <h3 className="text-sm font-extrabold text-[#221F18]">{t('study.examples')}</h3>
            <div className="space-y-3">
              {currentKana.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F4EEDE] rounded-2xl border border-[#D9CDB2] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-[#221F18]">{ex.word}</span>
                      <span className="text-xs font-bold text-[#5C6B3D]">({ex.romaji})</span>
                      <button
                        onClick={() => speakJapanese(ex.word)}
                        aria-label={`Play ${ex.word}`}
                        className="p-1 text-[#6B6252] hover:text-[#5C6B3D] transition-colors cursor-pointer rounded-md hover:bg-[#ECE4D0]"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-[#6B6252]">{ex.meaning}</span>
                  </div>
                  {ex.sentence && (
                    <div className="text-xs text-[#55503F] pt-1 flex items-center justify-between">
                      <span>
                        {t('study.sentence')}: {ex.sentence} ({ex.sentenceMeaning})
                      </span>
                      <button
                        onClick={() => speakJapanese(ex.sentence)}
                        aria-label={`Play sentence: ${ex.sentence}`}
                        className="p-1 text-[#6B6252] hover:text-[#5C6B3D] transition-colors cursor-pointer rounded-md hover:bg-[#ECE4D0] shrink-0 ml-2"
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
        <div className="flex items-center justify-between pt-4 border-t border-[#ECE4D0]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-[#F4EEDE] border border-[#D9CDB2] rounded-xl text-xs font-bold text-[#221F18] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EEDE] cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('study.prevKana')}
          </button>

          <span className="text-xs font-bold text-[#6B6252]">
            {currentIndex + 1} / {allKana.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === allKana.length - 1}
            className="px-4 py-2 bg-[#5C6B3D] text-[#F1EFE0] rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#47552F] cursor-pointer flex items-center gap-1.5"
          >
            {t('study.nextKana')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
