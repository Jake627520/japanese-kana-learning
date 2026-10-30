import React, { useState, useEffect } from 'react';
import { JlptTopic, JlptQuestion, JlptGrade } from '../types';
import {
  AVAILABLE_LEVELS,
  getTopicsByLevel,
  getQuestionsByTopic,
  getOwnJlptQuestionsByLevel,
  getOwnJlptQuestions,
} from '../data/jlpt';
import { recordJlptAnswer, getWrongQuestionIds } from '../utils/jlptStorage';
import { shuffle, withShuffledOptions } from '../utils/shuffle';
import { JlptWeakPointCard } from './JlptWeakPointCard';
import { JlptWrongRedoButton } from './JlptWrongRedoButton';
import { RichText } from './RichText';
import { useI18n, localize, Language } from '../i18n';
import { JlptExplanations, loadJlptExplanations } from '../data/jlpt/explanations';
import { GraduationCap, BookOpen, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Sparkles, ChevronRight, HelpCircle, RefreshCw } from 'lucide-react';

const DOMAIN_STYLE: Record<string, { band: string; tint: string; fg: string }> = {
  '文字・語彙': { band: 'from-[color:var(--moss-50)] to-[color:var(--moss-66)]', tint: 'bg-[color:var(--moss-93)]', fg: 'text-[color:var(--moss-40)]' },
  文法: { band: 'from-blue-500 to-blue-300', tint: 'bg-blue-50', fg: 'text-blue-600' },
  読解: { band: 'from-amber-500 to-amber-300', tint: 'bg-[color:var(--paper-92a)]', fg: 'text-[color:var(--kincha-47)]' },
};
const DOMAIN_FALLBACK = { band: 'from-slate-400 to-slate-300', tint: 'bg-[color:var(--paper-92)]', fg: 'text-[color:var(--ink-50)]' };

// 一次測驗是單一知識點，或兩種跨知識點的場次：全部隨機（all）、錯題重做（wrong）。
type JlptSession = JlptTopic | { id: 'all' } | { id: 'wrong' };

type ExplanationsState = { language: Language } & (
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'ready'; byId: JlptExplanations }
);

export function JlptPracticeView() {
  const { t, language } = useI18n();
  const [level, setLevel] = useState<JlptGrade>('n5');
  const [selectedTopic, setSelectedTopic] = useState<JlptSession | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<JlptQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [explanations, setExplanations] = useState<ExplanationsState>({ language, status: 'loading' });

  useEffect(() => {
    let current = true;
    setExplanations({ language, status: 'loading' });
    loadJlptExplanations(language).then(
      (byId) => current && setExplanations({ language, status: 'ready', byId }),
      (e) => {
        console.warn(`[jlpt] Failed to load ${language} explanations:`, e);
        if (current) setExplanations({ language, status: 'failed' });
      },
    );
    return () => {
      current = false;
    };
  }, [language]);

  const handleStartTopic = (topic: JlptTopic) => {
    const questions = getQuestionsByTopic(topic.id);
    if (questions.length === 0) return;

    setSelectedTopic(topic);
    setQuizQuestions(shuffle(questions).map(withShuffledOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleStartAll = () => {
    const all = getOwnJlptQuestionsByLevel(level);
    if (all.length === 0) return;

    setSelectedTopic({ id: 'all' });
    setQuizQuestions(shuffle(all).slice(0, 10).map(withShuffledOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleStartWrong = () => {
    const wrongIds = new Set(getWrongQuestionIds());
    const questions = getOwnJlptQuestions().filter((q) => wrongIds.has(q.id));
    if (questions.length === 0) return;

    setSelectedTopic({ id: 'wrong' });
    setQuizQuestions(shuffle(questions).map(withShuffledOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentQ = quizQuestions[currentIndex];
    const isCorrect = String(optionIndex + 1) === currentQ.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (selectedTopic) {
      recordJlptAnswer(currentQ.id, selectedTopic.id, optionIndex, isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    if (!selectedTopic) return;
    if ('name' in selectedTopic) handleStartTopic(selectedTopic);
    else if (selectedTopic.id === 'wrong') handleStartWrong();
    else handleStartAll();
  };

  const sessionTitle = !selectedTopic
    ? ''
    : 'name' in selectedTopic
      ? localize(selectedTopic.name, language)
      : selectedTopic.id === 'wrong'
        ? t('jlpt.wrongRedoTitle')
        : t('jlpt.allTopicName', { level: level.toUpperCase() });

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    if (!selectedTopic) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // A held key must not keep advancing: one press, one action.
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (isCompleted) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleRestart();
        }
        return;
      }

      if (!isAnswered) {
        const keyMap: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          Numpad1: 0,
          Numpad2: 1,
          Numpad3: 2,
          Numpad4: 3,
        };
        const optIdx = keyMap[e.key] ?? (e.code ? keyMap[e.code] : undefined);
        if (optIdx !== undefined) {
          const currentQ = quizQuestions[currentIndex];
          if (currentQ && optIdx < currentQ.options.length) {
            e.preventDefault();
            handleSelectOption(optIdx);
          }
        }
      } else {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTopic, quizQuestions, currentIndex, isAnswered, isCompleted]);

  const topics = getTopicsByLevel(level);
  const levelQuestionCount = getOwnJlptQuestionsByLevel(level).length;
  const levelCoverage = Math.min(100, Math.round((levelQuestionCount / 90) * 100));

  const currentQ = quizQuestions[currentIndex];
  // Until the effect catches up with a language change, the state still holds the old language.
  const explanationsStatus = explanations.language === language ? explanations.status : 'loading';
  const explanation =
    currentQ && explanations.language === language && explanations.status === 'ready'
      ? explanations.byId[currentQ.id]
      : undefined;

  return (
    <div className="space-y-6">
      {selectedTopic && currentQ ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <button
            onClick={handleBackToTopics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-50)] bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-xl hover:text-[color:var(--ink-24)] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('common.back')}
          </button>

          {!isCompleted ? (
            <div className="bg-[color:var(--paper-bg)] p-6 sm:p-8 rounded-3xl border border-[color:var(--paper-85)] shadow-xs space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-[color:var(--moss-50)] bg-[color:var(--moss-93)] px-3 py-1 rounded-full">
                  {sessionTitle}
                </span>
                <span className="text-xs font-bold text-[color:var(--ink-50)]">
                  {t('jlpt.questionProgress')}: {currentIndex + 1} / {quizQuestions.length}
                </span>
              </div>

              {/* a11y: 螢幕報讀器結果播報 */}
              <div aria-live="assertive" aria-atomic="true" className="sr-only">
                {isAnswered
                  ? selectedOption !== null && String(selectedOption + 1) === currentQ.answer
                    ? t('common.answerCorrect')
                    : t('common.answerWrongWithCorrect', {
                        answer: currentQ.options[Number(currentQ.answer) - 1] ?? '',
                      })
                  : ''}
              </div>

              <div className="p-5 bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--paper-92)]">
                <div lang="ja" className="text-lg font-bold text-[color:var(--ink-24)] leading-relaxed">
                  <RichText text={currentQ.stem} />
                </div>
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = String(idx + 1) === currentQ.answer;

                  let btnStyle = 'bg-[color:var(--paper-bg)] border-[color:var(--paper-85)] text-[color:var(--ink-24)] hover:border-[color:var(--moss-50)]';
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-[color:var(--moss-93)] border-[color:var(--moss-50)] text-[color:var(--moss-50)] font-extrabold';
                    } else if (isSelected) {
                      btnStyle = 'bg-[color:var(--shu-91)] border-[color:var(--shu-74)] text-[color:var(--shu-52a)] font-extrabold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[color:var(--paper-92)] text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span lang="ja"><RichText text={opt} /></span>
                      </span>
                      {isAnswered && isCorrectAnswer && (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-[color:var(--moss-50)] shrink-0" aria-hidden="true" />
                          <span className="sr-only">（{t('common.correctAnswer')}）</span>
                        </>
                      )}
                      {isAnswered && isSelected && !isCorrectAnswer && (
                        <>
                          <XCircle className="w-5 h-5 text-[color:var(--shu-56)] shrink-0" aria-hidden="true" />
                          <span className="sr-only">（{t('common.yourWrongAnswer')}）</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="space-y-4 pt-4 border-t border-[color:var(--paper-92)]">
                  {(explanationsStatus !== 'ready' || explanation !== undefined) && (
                    <div className="p-4 bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--paper-85)] space-y-2">
                      <div className="text-xs font-extrabold text-[color:var(--ink-24)] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[color:var(--moss-50)]" />
                        {t('jlpt.explainTitle')}
                      </div>
                      {explanationsStatus === 'loading' && (
                        <div aria-busy="true" className="space-y-2 py-0.5">
                          <span className="sr-only">{t('common.loading')}</span>
                          <div className="h-3 w-full rounded bg-[color:var(--paper-92)] animate-pulse" />
                          <div className="h-3 w-11/12 rounded bg-[color:var(--paper-92)] animate-pulse" />
                          <div className="h-3 w-2/3 rounded bg-[color:var(--paper-92)] animate-pulse" />
                        </div>
                      )}
                      {explanationsStatus === 'failed' && (
                        <div role="alert" className="flex flex-wrap items-center justify-between gap-3">
                          <p className="flex-1 min-w-48 text-xs text-[color:var(--shu-52a)] font-semibold leading-relaxed">
                            {t('jlpt.explainLoadFailed')}
                          </p>
                          {/* A failed chunk import is cached for the page's lifetime, so only a reload can refetch it. */}
                          <button
                            type="button"
                            onClick={() => window.location.reload()}
                            // Enter on this button means reload, not the page-wide Enter-for-next shortcut.
                            onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[color:var(--paper-95)] bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] rounded-xl cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {t('common.reloadPage')}
                          </button>
                        </div>
                      )}
                      {explanation !== undefined && (
                        <div className="text-xs text-[color:var(--ink-50)] leading-relaxed">
                          <RichText text={explanation} />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    className="w-full py-3.5 bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] text-[color:var(--paper-95)] font-extrabold text-sm rounded-2xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{currentIndex + 1 < quizQuestions.length ? t('quiz.nextQuestion') : t('quiz.finishQuiz')}</span>
                    <kbd className="text-[10px] bg-[color:var(--paper-bg)]/20 px-1.5 py-0.5 rounded font-mono font-bold leading-none">↵</kbd>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[color:var(--paper-bg)] p-8 rounded-3xl border border-[color:var(--paper-85)] shadow-xs text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[color:var(--moss-93)] text-[color:var(--moss-50)] mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-[color:var(--ink-24)]">{t('quiz.resultTitle')}</h3>
                <p className="text-xs text-[color:var(--ink-50)] mt-1">{sessionTitle}</p>
              </div>

              <div className="p-6 bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--paper-85)] max-w-xs mx-auto space-y-2">
                <div className="text-4xl font-extrabold text-[color:var(--moss-50)]">
                  {Math.round((score / quizQuestions.length) * 100)}%
                </div>
                <div className="text-xs font-bold text-[color:var(--ink-50)]">
                  {t('quiz.accuracy')}: {score} / {quizQuestions.length}
                </div>
              </div>

              <div className="flex gap-3 max-w-xs mx-auto">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)] text-[color:var(--ink-24)] font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t('quiz.restartQuiz')}
                </button>
                <button
                  onClick={handleBackToTopics}
                  className="flex-1 py-3 bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] text-[color:var(--paper-95)] font-bold text-xs rounded-xl cursor-pointer"
                >
                  {t('common.back')}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[color:var(--paper-bg)] p-6 rounded-3xl border border-[color:var(--paper-85)] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[color:var(--moss-93)] text-[color:var(--moss-50)] rounded-full text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {t('jlpt.title')}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[color:var(--ink-24)]">
                  JLPT {level.toUpperCase()} {t('jlpt.topicSelect')}
                </h2>
                <p className="text-xs text-[color:var(--ink-50)] leading-relaxed max-w-lg">
                  {t('jlpt.subtitle')}
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartAll}
                disabled={levelQuestionCount === 0}
                className={`px-5 py-3 font-extrabold text-xs sm:text-sm rounded-2xl btn-lift cursor-pointer flex items-center gap-2 shrink-0 ${
                  levelQuestionCount > 0
                    ? 'bg-[color:var(--moss-50)] text-[color:var(--paper-95)] hover:bg-[color:var(--moss-43)] elev-green'
                    : 'bg-[color:var(--paper-92)] text-[color:var(--ink-62)] cursor-not-allowed'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {t('jlpt.startPractice')} (10)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-1 bg-[color:var(--paper-92)] p-1 rounded-xl w-fit">
                {AVAILABLE_LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setLevel(lv)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                      level === lv
                        ? 'bg-[color:var(--paper-bg)] text-[color:var(--moss-50)] elev-1'
                        : 'text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)]'
                    }`}
                  >
                    {lv.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="flex-1 h-1.5 rounded-full bg-[color:var(--paper-92)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[color:var(--moss-50)] to-[color:var(--moss-66)] transition-[width] duration-700 ease-out"
                    style={{ width: `${levelCoverage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[color:var(--ink-50)] whitespace-nowrap">
                  {topics.length} · {levelQuestionCount}
                </span>
              </div>
            </div>
          </div>

          {/* 錯題重做 */}
          <JlptWrongRedoButton onStart={handleStartWrong} />

          {/* 弱點分析 */}
          <JlptWeakPointCard />

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((topic, i) => {
              const count = getQuestionsByTopic(topic.id).length;
              const style = DOMAIN_STYLE[topic.domain] ?? DOMAIN_FALLBACK;

              return (
                <div
                  key={topic.id}
                  className="bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] elev-1 card-lift rise-in overflow-hidden flex flex-col group"
                  style={{ ['--stagger' as string]: `${Math.min(i, 7) * 40}ms` }}
                >
                  <div aria-hidden className={`h-1 bg-gradient-to-r ${style.band}`} />
                  <div className="p-5 flex flex-col justify-between gap-4 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${style.tint} ${style.fg}`}>
                          {topic.domain} · {topic.chapter}
                        </span>
                        <span className="text-xs font-bold text-[color:var(--moss-50)] bg-[color:var(--moss-93)] px-2.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      </div>

                      <h3 className="text-base font-display font-bold text-[color:var(--ink-24)] group-hover:text-[color:var(--moss-50)] transition-colors">
                        {localize(topic.name, language)}
                      </h3>
                      <p className="text-xs text-[color:var(--ink-50)] leading-relaxed">
                        {localize(topic.description, language)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={count === 0}
                      onClick={() => handleStartTopic(topic)}
                      className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        count > 0
                          ? 'bg-[color:var(--paper-93)] group-hover:bg-[color:var(--moss-50)] text-[color:var(--ink-24)] group-hover:text-[color:var(--paper-95)] border border-[color:var(--paper-85)] group-hover:border-[color:var(--moss-50)] cursor-pointer'
                          : 'bg-[color:var(--paper-92)] text-[color:var(--ink-62)] border border-[color:var(--paper-85)] cursor-not-allowed'
                      }`}
                    >
                      {count > 0 ? (
                        <>
                          {t('common.start')}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        t('common.loading')
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
