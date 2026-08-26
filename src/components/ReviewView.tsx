import { EmptyState } from './EmptyState';
import React, { useEffect, useState } from 'react';
import { KanaItem, UserProgress } from '../types';
import {
  getDueReviewItems,
  getReviewState,
  formatNextReviewText,
  removeKanaFromWrong,
} from '../utils/storage';
import { getKanaStatus } from '../utils/kanaStatus';
import { speakJapanese } from '../utils/speech';
import { getPrimaryVocabularyByKanaId, playVocabularyAudio } from '../data/vocabulary';
import { QuizView } from './QuizView';
import { useI18n } from '../i18n';
import {
  Volume2,
  Play,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

interface ReviewViewProps {
  allKana: KanaItem[];
  progress: UserProgress;
  onProgressChange: () => void;
  onStartStudyKana: (kana: KanaItem) => void;
}

export function ReviewView({
  allKana,
  progress,
  onProgressChange,
  onStartStudyKana,
}: ReviewViewProps) {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'due' | 'wrong'>('due');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const want = sessionStorage.getItem('review-open-tab');
    if (want === 'due' || want === 'wrong') {
      setActiveTab(want);
      sessionStorage.removeItem('review-open-tab');
    }
  }, []);

  const [isMiniQuizActive, setIsMiniQuizActive] = useState(false);
  const [selectedKanaDetail, setSelectedKanaDetail] = useState<KanaItem | null>(null);
  const [confirmModalKana, setConfirmModalKana] = useState<KanaItem | null>(null);

  const wrongList = allKana.filter((k) => progress.wrongKanaIds.includes(k.id));
  const dueList = getDueReviewItems(allKana, progress).filter(
    (k) => getKanaStatus(progress, k.id) === 'due'
  );

  const displayList = activeTab === 'due' ? dueList : wrongList;

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakJapanese(text);
  };

  const handleConfirmRemove = () => {
    if (confirmModalKana) {
      removeKanaFromWrong(confirmModalKana.id);
      onProgressChange();
      setConfirmModalKana(null);
      if (selectedKanaDetail?.id === confirmModalKana.id) {
        setSelectedKanaDetail(null);
      }
    }
  };

  if (isMiniQuizActive) {
    const miniQuizPool = selectedKanaDetail
      ? [selectedKanaDetail]
      : activeTab === 'due' && dueList.length > 0
      ? dueList
      : wrongList;

    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsMiniQuizActive(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:text-[#1E293B] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('common.back')}
        </button>

        <QuizView
          allKana={allKana}
          customPool={miniQuizPool}
          isReviewMode={true}
          onProgressChange={onProgressChange}
          onFinish={() => setIsMiniQuizActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-[#1E293B]">{t('review.title')}</h2>
          <p className="text-xs text-[#64748B] mt-1">
            {t('review.subtitle')}
          </p>
        </div>

        {displayList.length > 0 && (
          <button
            onClick={() => {
              setSelectedKanaDetail(null);
              setIsMiniQuizActive(true);
            }}
            className="px-5 py-3 bg-[#00A86B] text-white font-extrabold text-xs rounded-2xl hover:bg-[#008F5B] transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {activeTab === 'due' ? t('review.startDueReview') : t('review.startWeakReview')}
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-[#E2E8F0] gap-4">
        <button
          onClick={() => setActiveTab('due')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'due'
              ? 'border-[#00A86B] text-[#00A86B]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          {t('review.dueTab')} ({dueList.length})
        </button>
        <button
          onClick={() => setActiveTab('wrong')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'wrong'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          {t('review.weakTab')} ({wrongList.length})
        </button>
      </div>

      {/* Empty State Banner or Grid */}
      {displayList.length === 0 ? (
        <EmptyState
          art={activeTab === 'due' ? 'calendar' : 'target'}
          title={activeTab === 'due' ? t('review.noDueTitle') : t('review.noWeakTitle')}
          body={
            activeTab === 'due'
              ? t('review.noDueDesc')
              : t('review.noWeakDesc')
          }
          actions={
            activeTab === 'due' && wrongList.length > 0 ? (
              <button
                onClick={() => setActiveTab('wrong')}
                className="px-5 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl hover:bg-white hover:border-[#00A86B] btn-lift cursor-pointer"
              >
                {t('review.weakTab')} ({wrongList.length})
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayList.map((item) => {
            const firstEx = item.examples[0];
            const srsState = getReviewState(progress, item.id);

            return (
              <div
                key={item.id}
                onClick={() => onStartStudyKana(item)}
                className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#00A86B] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#FAFBFB] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-3xl font-extrabold text-[#1E293B] group-hover:scale-105 transition-transform">
                      {item.kana}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[#00A86B] uppercase">
                          {item.romaji}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.type === 'katakana'
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}>
                          {item.type === 'katakana' ? t('common.katakana') : t('common.hiragana')}
                        </span>
                        {item.category === 'dakuten' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706]">
                            {t('common.dakuten')}
                          </span>
                        )}
                        {item.category === 'handakuten' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FCE7F3] text-[#DB2777]">
                            {t('common.handakuten')}
                          </span>
                        )}
                        {item.category === 'youon' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED]">
                            {t('common.youon')}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                          L{srsState.reviewLevel}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        {t('study.nextReviewTime')}: {formatNextReviewText(srsState.nextReviewAt)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handlePlayAudio(e, item.kana)}
                    className="p-2.5 text-[#64748B] hover:text-[#00A86B] hover:bg-[#E6F8F2] rounded-xl transition-colors cursor-pointer"
                    title={t('common.playAudio')}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {(() => {
                  const vocab = getPrimaryVocabularyByKanaId(item.id);
                  if (vocab) {
                    const meaning = vocab.meaning[language] || vocab.meaning['zh-TW'];
                    return (
                      <div className="bg-emerald-50/60 p-2.5 rounded-xl text-xs text-[#64748B] border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#00A86B]">{t('study.representativeWord')}:</span>
                          <strong className="text-[#1E293B] font-bold">
                            {vocab.kanji ? `${vocab.kanji} (${vocab.word})` : vocab.word}
                          </strong>
                          <span className="text-[#00A86B] font-semibold">[{vocab.romaji}]</span>
                          <span className="text-[#64748B]">・ {meaning}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void playVocabularyAudio(vocab);
                          }}
                          className="p-1 text-[#00A86B] hover:text-[#008F5B] hover:bg-emerald-100 rounded-md transition-colors cursor-pointer shrink-0 ml-1.5"
                          title={t('study.listenWord')}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }
                  if (firstEx) {
                    return (
                      <div className="bg-[#FAFBFB] p-3 rounded-xl text-xs text-[#64748B] border border-[#F1F5F9]">
                        {t('study.examples')}: <strong className="text-[#1E293B] font-semibold">{firstEx.word}</strong> ({firstEx.meaning})
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] gap-2">
                  <span className="text-xs font-bold text-[#00A86B] flex items-center gap-1">
                    {t('common.details')} <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModalKana(item);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-[#16A34A] bg-[#F0FDF4] hover:bg-[#DCFCE7] rounded-lg transition-colors cursor-pointer"
                  >
                    {t('study.unmarkMastered')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalKana && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E2E8F0] shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-[#1E293B]">{t('study.removeFromReview')}?</h3>
            <p className="text-xs text-[#64748B]">
              {confirmModalKana.kana} ({confirmModalKana.romaji})
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmModalKana(null)}
                className="flex-1 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-2.5 bg-[#00A86B] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
