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
import { logLearningEvent } from '../utils/learningEvents';
import { getPrimaryVocabularyByKanaId, playVocabularyAudio } from '../data/vocabulary';
import { QuizView } from './QuizView';
import { useI18n, localize } from '../i18n';
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-50)] bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-xl hover:text-[color:var(--ink-24)] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('common.back')}
        </button>

        <QuizView
          allKana={allKana}
          customPool={miniQuizPool}
          isReviewMode={true}
          onProgressChange={onProgressChange}
          onFinish={() => {
            logLearningEvent({
              type: 'review_complete',
              source: 'review_view',
            });
            setIsMiniQuizActive(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[color:var(--paper-bg)] p-6 rounded-3xl border border-[color:var(--paper-85)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-[color:var(--ink-24)]">{t('review.title')}</h2>
          <p className="text-xs text-[color:var(--ink-50)] mt-1">
            {t('review.subtitle')}
          </p>
        </div>

        {displayList.length > 0 && (
          <button
            onClick={() => {
              setSelectedKanaDetail(null);
              setIsMiniQuizActive(true);
            }}
            className="px-5 py-3 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] font-extrabold text-xs rounded-2xl hover:bg-[color:var(--moss-43)] transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {activeTab === 'due' ? t('review.startDueReview') : t('review.startWeakReview')}
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-[color:var(--paper-85)] gap-4">
        <button
          onClick={() => setActiveTab('due')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'due'
              ? 'border-[color:var(--moss-50)] text-[color:var(--moss-50)]'
              : 'border-transparent text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)]'
          }`}
        >
          {t('review.dueTab')} ({dueList.length})
        </button>
        <button
          onClick={() => setActiveTab('wrong')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'wrong'
              ? 'border-red-500 text-[color:var(--shu-52a)]'
              : 'border-transparent text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)]'
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
                className="px-5 py-2.5 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] text-[color:var(--ink-24)] font-bold text-xs rounded-xl hover:bg-[color:var(--paper-bg)] hover:border-[color:var(--moss-50)] btn-lift cursor-pointer"
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
                className="bg-[color:var(--paper-bg)] rounded-2xl p-5 border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-2xl flex items-center justify-center text-3xl font-extrabold text-[color:var(--ink-24)] group-hover:scale-105 transition-transform">
                      {item.kana}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[color:var(--moss-50)] uppercase">
                          {item.romaji}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.type === 'katakana'
                            ? 'bg-[color:var(--ai-92)] text-[color:var(--ai-39)]'
                            : 'bg-[color:var(--paper-92)] text-[color:var(--ink-50)]'
                        }`}>
                          {item.type === 'katakana' ? t('common.katakana') : t('common.hiragana')}
                        </span>
                        {item.category === 'dakuten' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[color:var(--paper-92a)] text-[color:var(--kincha-51)]">
                            {t('common.dakuten')}
                          </span>
                        )}
                        {item.category === 'handakuten' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[color:var(--shu-90)] text-[color:var(--shu-52)]">
                            {t('common.handakuten')}
                          </span>
                        )}
                        {item.category === 'youon' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[color:var(--fuji-91)] text-[color:var(--fuji-45)]">
                            {t('common.youon')}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[color:var(--ink-50)] bg-[color:var(--paper-92)] px-2 py-0.5 rounded-md">
                          L{srsState.reviewLevel}
                        </span>
                      </div>
                      <div className="text-xs text-[color:var(--ink-50)] mt-0.5">
                        {t('study.nextReviewTime')}: {formatNextReviewText(srsState.nextReviewAt, t)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handlePlayAudio(e, item.kana)}
                    className="p-2.5 text-[color:var(--ink-50)] hover:text-[color:var(--moss-50)] hover:bg-[color:var(--moss-93)] rounded-xl transition-colors cursor-pointer"
                    title={t('common.playAudio')}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {(() => {
                  const vocab = getPrimaryVocabularyByKanaId(item.id);
                  if (vocab) {
                    const meaning = localize(vocab.meaning, language);
                    return (
                      <div className="bg-[color:var(--moss-93)]/60 p-2.5 rounded-xl text-xs text-[color:var(--ink-50)] border border-[color:var(--moss-89)] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[color:var(--moss-50)]">{t('study.representativeWord')}:</span>
                          <strong className="text-[color:var(--ink-24)] font-bold">
                            {vocab.kanji ? `${vocab.kanji} (${vocab.word})` : vocab.word}
                          </strong>
                          <span className="text-[color:var(--moss-50)] font-semibold">[{vocab.romaji}]</span>
                          <span className="text-[color:var(--ink-50)]">・ {meaning}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void playVocabularyAudio(vocab);
                          }}
                          className="p-1 text-[color:var(--moss-50)] hover:text-[color:var(--moss-43)] hover:bg-emerald-100 rounded-md transition-colors cursor-pointer shrink-0 ml-1.5"
                          title={t('study.listenWord')}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }
                  if (firstEx) {
                    return (
                      <div className="bg-[color:var(--paper-bg)] p-3 rounded-xl text-xs text-[color:var(--ink-50)] border border-[color:var(--paper-92)]">
                        {t('study.examples')}: <strong className="text-[color:var(--ink-24)] font-semibold">{firstEx.word}</strong> ({localize(firstEx.meaning, language)})
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex items-center justify-between pt-2 border-t border-[color:var(--paper-92)] gap-2">
                  <span className="text-xs font-bold text-[color:var(--moss-50)] flex items-center gap-1">
                    {t('common.details')} <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModalKana(item);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-[color:var(--moss-50)] bg-[color:var(--moss-95)] hover:bg-[color:var(--moss-93)] rounded-lg transition-colors cursor-pointer"
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
          <div className="bg-[color:var(--paper-bg)] rounded-3xl p-6 max-w-sm w-full border border-[color:var(--paper-85)] shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-[color:var(--ink-24)]">{t('study.removeFromReview')}?</h3>
            <p className="text-xs text-[color:var(--ink-50)]">
              {confirmModalKana.kana} ({confirmModalKana.romaji})
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmModalKana(null)}
                className="flex-1 py-2.5 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] text-[color:var(--ink-24)] font-bold text-xs rounded-xl cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-2.5 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] font-bold text-xs rounded-xl cursor-pointer"
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
