import React, { useState, useEffect } from 'react';
import { KanaItem, QuizQuestion } from '../types';
import { removeKanaFromWrong, recordReviewResult } from '../utils/storage';
import { logLearningEvent } from '../utils/learningEvents';
import { speakJapanese } from '../utils/speech';
import { CONFUSABLE_GROUPS } from '../data/confusableData';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  PenLine,
  BookOpen,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { QuizVocabFeedback } from './QuizVocabFeedback';
import { useI18n } from '../i18n';

interface QuizViewProps {
  allKana: KanaItem[];
  masteredIds?: string[];
  customPool?: KanaItem[];
  isReviewMode?: boolean;
  isConfusionMode?: boolean;
  onProgressChange: () => void;
  onFinish: () => void;
  onNavigateToReview?: () => void;
  onPracticeWriting?: (kana: KanaItem) => void;
}

/**
 * Build distractors for listening recognition questions.
 * Priority 1: Confusable group members (same type)
 * Priority 2: Same row or category (close sounds)
 * Priority 3: Random same-type fallback
 * Guarantees 4 unique kana IDs (target + 3 distractors).
 */
function getListeningDistractors(
  target: KanaItem,
  allKana: KanaItem[],
  pool: KanaItem[]
): KanaItem[] {
  const targetType = target.type;
  const sameTypeAll = allKana.filter((k) => k.type === targetType && k.id !== target.id);
  const selectedIds = new Set<string>([target.id]);
  const distractors: KanaItem[] = [];

  // Priority 1: Matching confusable group members
  for (const group of CONFUSABLE_GROUPS) {
    if (group.members.includes(target.id)) {
      for (const mId of group.members) {
        if (!selectedIds.has(mId)) {
          const match = sameTypeAll.find((k) => k.id === mId);
          if (match) {
            selectedIds.add(mId);
            distractors.push(match);
            if (distractors.length >= 3) break;
          }
        }
      }
    }
    if (distractors.length >= 3) break;
  }

  // Priority 2: Same row or same category / close sound from pool or sameTypeAll
  if (distractors.length < 3) {
    const sameRowOrCategory = sameTypeAll
      .filter(
        (k) =>
          !selectedIds.has(k.id) &&
          (k.row === target.row || k.category === target.category)
      )
      .sort(() => 0.5 - Math.random());

    for (const k of sameRowOrCategory) {
      selectedIds.add(k.id);
      distractors.push(k);
      if (distractors.length >= 3) break;
    }
  }

  // Priority 3: Random same-type fallback
  if (distractors.length < 3) {
    const fallbackPool = sameTypeAll
      .filter((k) => !selectedIds.has(k.id))
      .sort(() => 0.5 - Math.random());
    for (const k of fallbackPool) {
      selectedIds.add(k.id);
      distractors.push(k);
      if (distractors.length >= 3) break;
    }
  }

  return distractors.slice(0, 3);
}

export function QuizView({
  allKana,
  customPool,
  isReviewMode = false,
  isConfusionMode = false,
  onProgressChange,
  onFinish,
  onNavigateToReview,
  onPracticeWriting,
}: QuizViewProps) {
  const { t } = useI18n();
  const [quizMode, setQuizMode] = useState<'visual' | 'listening'>(
    isConfusionMode ? 'listening' : 'visual'
  );
  const [quizScope, setQuizScope] = useState<'all' | 'basic' | 'dakuten' | 'handakuten' | 'youon'>('all');

  const scopedSource = customPool && customPool.length > 0 ? customPool : allKana;

  const filteredByScope = scopedSource.filter((k) => {
    if (quizScope === 'all') return true;
    if (quizScope === 'basic') {
      return (
        k.category === 'basic-hiragana' ||
        k.category === 'basic-katakana' ||
        (!k.category && (k.type === 'hiragana' || k.type === 'katakana'))
      );
    }
    return k.category === quizScope;
  });

  const pool = filteredByScope.length > 0 ? filteredByScope : scopedSource;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputRomaji, setInputRomaji] = useState('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [correctStreakMap, setCorrectStreakMap] = useState<Record<string, number>>({});
  const [results, setResults] = useState<{ kana: KanaItem; isCorrect: boolean }[]>([]);
  const [retryPool, setRetryPool] = useState<KanaItem[] | null>(null);

  const generateQuiz = (
    sourcePool: KanaItem[] = pool,
    mode: 'visual' | 'listening' = quizMode
  ) => {
    // Specialized 5-question Confusion Training
    if (isConfusionMode) {
      const count = 5;
      const generated: QuizQuestion[] = [];
      for (let i = 0; i < count; i++) {
        const target = sourcePool[Math.floor(Math.random() * sourcePool.length)];
        const options = sourcePool
          .map((k) => ({
            label: k.kana,
            isCorrect: k.id === target.id,
            kana: k,
          }))
          .sort(() => 0.5 - Math.random());

        generated.push({
          type: 'audio-to-kana' as const,
          targetKana: target,
          options,
        });
      }

      setQuestions(generated);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setInputRomaji('');
      setIsAnswered(false);
      setIsCompleted(false);
      setFeedbackNote('');
      setResults([]);
      return;
    }

    const shuffledPool = [...sourcePool].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledPool.slice(0, Math.min(10, shuffledPool.length));

    const generated: QuizQuestion[] = selectedItems.map((item) => {
      // In listening mode, 100% of questions are audio-to-kana
      if (mode === 'listening') {
        const distractors = getListeningDistractors(item, allKana, sourcePool);
        const options = [
          { label: item.kana, isCorrect: true, kana: item },
          ...distractors.map((d) => ({
            label: d.kana,
            isCorrect: false,
            kana: d,
          })),
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'audio-to-kana' as const,
          targetKana: item,
          options,
        };
      }

      const questionTypes: QuizQuestion['type'][] = [
        'kana-to-romaji',
        'audio-to-kana',
        'input-romaji',
        'kana-to-kana',
      ];
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      if (type === 'kana-to-kana') {
        const oppositeType = item.type === 'hiragana' ? 'katakana' : 'hiragana';
        const counterpart = allKana.find(
          (k) => k.type === oppositeType && k.romaji === item.romaji
        );

        if (!counterpart) {
          const sameTypeAndCatPool = allKana.filter(
            (k) =>
              k.type === item.type &&
              (k.category || 'basic') === (item.category || 'basic') &&
              k.id !== item.id
          );
          const sameTypePool = allKana.filter((k) => k.type === item.type && k.id !== item.id);
          const distractorPool =
            sameTypeAndCatPool.length >= 3
              ? sameTypeAndCatPool
              : sameTypePool.length >= 3
              ? sameTypePool
              : allKana.filter((k) => k.id !== item.id);
          const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
          const options = [
            { label: item.romaji, isCorrect: true, kana: item },
            ...distractors.map((d) => ({
              label: d.romaji,
              isCorrect: false,
              kana: d,
            })),
          ].sort(() => 0.5 - Math.random());

          return {
            type: 'kana-to-romaji' as const,
            targetKana: item,
            options,
          };
        }

        const sameTypeAndCatPool = allKana.filter(
          (k) =>
            k.type === oppositeType &&
            (k.category || 'basic') === (item.category || 'basic') &&
            k.id !== counterpart.id
        );
        const sameTypePool = allKana.filter((k) => k.type === oppositeType && k.id !== counterpart.id);
        const distractorPool =
          sameTypeAndCatPool.length >= 3
            ? sameTypeAndCatPool
            : sameTypePool.length >= 3
            ? sameTypePool
            : allKana.filter((k) => k.id !== counterpart.id);
        const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [
          { label: counterpart.kana, isCorrect: true, kana: counterpart },
          ...distractors.map((d) => ({
            label: d.kana,
            isCorrect: false,
            kana: d,
          })),
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'kana-to-kana' as const,
          targetKana: item,
          options,
        };
      }

      if (type === 'kana-to-romaji') {
        const sameTypeAndCatPool = allKana.filter(
          (k) =>
            k.type === item.type &&
            (k.category || 'basic') === (item.category || 'basic') &&
            k.id !== item.id
        );
        const sameTypePool = allKana.filter((k) => k.type === item.type && k.id !== item.id);
        const distractorPool =
          sameTypeAndCatPool.length >= 3
            ? sameTypeAndCatPool
            : sameTypePool.length >= 3
            ? sameTypePool
            : allKana.filter((k) => k.id !== item.id);
        const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [
          { label: item.romaji, isCorrect: true, kana: item },
          ...distractors.map((d) => ({
            label: d.romaji,
            isCorrect: false,
            kana: d,
          })),
        ].sort(() => 0.5 - Math.random());

        return {
          type,
          targetKana: item,
          options,
        };
      }

      if (type === 'audio-to-kana') {
        const distractors = getListeningDistractors(item, allKana, sourcePool);
        const options = [
          { label: item.kana, isCorrect: true, kana: item },
          ...distractors.map((d) => ({
            label: d.kana,
            isCorrect: false,
            kana: d,
          })),
        ].sort(() => 0.5 - Math.random());

        return {
          type,
          targetKana: item,
          options,
        };
      }

      return {
        type: 'input-romaji' as const,
        targetKana: item,
        options: [],
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setInputRomaji('');
    setIsAnswered(false);
    setIsCompleted(false);
    setFeedbackNote('');
    setResults([]);
  };

  useEffect(() => {
    generateQuiz();
  }, [quizScope, quizMode]);

  const currentQ = questions[currentIndex];

  // Auto-play audio when navigating questions in listening mode
  useEffect(() => {
    if (currentQ && (quizMode === 'listening' || isConfusionMode) && !isAnswered && !isCompleted) {
      speakJapanese(currentQ.targetKana.kana);
    }
  }, [currentIndex, currentQ, quizMode, isConfusionMode, isCompleted]);

  const handleSelectOption = (label: string, isCorrect: boolean) => {
    if (isAnswered) return;

    setSelectedOption(label);
    setIsAnswered(true);

    const targetKana = currentQ.targetKana;
    const selectedKana = currentQ.options.find((o) => o.label === label)?.kana;

    recordReviewResult(targetKana.id, isCorrect);
    logLearningEvent({
      type: 'quiz_answer',
      source: isConfusionMode
        ? 'listening_confusion'
        : quizMode === 'listening'
        ? 'listening'
        : isReviewMode
        ? 'review_quiz'
        : 'quiz',
      kanaId: targetKana.id,
      selectedKanaId: selectedKana?.id,
      correct: isCorrect,
    });
    setResults((prev) => [...prev, { kana: targetKana, isCorrect }]);

    if (isCorrect) {
      setScore((prev) => prev + 10);
      const streak = (correctStreakMap[targetKana.id] || 0) + 1;
      setCorrectStreakMap((prev) => ({ ...prev, [targetKana.id]: streak }));

      if (streak >= 2) {
        removeKanaFromWrong(targetKana.id);
        setFeedbackNote(t('quiz.streakBonus'));
      } else {
        setFeedbackNote('');
      }
    } else {
      setCorrectStreakMap((prev) => ({ ...prev, [targetKana.id]: 0 }));
      setFeedbackNote('');
    }

    onProgressChange();
  };

  const handleSubmitInput = () => {
    if (isAnswered) return;

    const isCorrect = inputRomaji.trim().toLowerCase() === currentQ.targetKana.romaji.toLowerCase();
    handleSelectOption(inputRomaji, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setInputRomaji('');
      setIsAnswered(false);
      setFeedbackNote('');
    } else {
      setIsCompleted(true);
    }
  };

  if (!currentQ && !isCompleted) {
    return <div className="p-8 text-center text-xs text-[#64748B]">{t('common.loading')}</div>;
  }

  if (isCompleted) {
    const total = questions.length;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const allCorrect = correctCount === total;
    const weakKana: KanaItem[] = Array.from(
      new Map(results.filter((r) => !r.isCorrect).map((r) => [r.kana.id, r.kana])).values()
    ) as KanaItem[];

    const handleRetryWeak = () => {
      if (weakKana.length === 0) return;
      setRetryPool(weakKana);
      generateQuiz(weakKana, isConfusionMode ? 'listening' : quizMode);
    };

    return (
      <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs rise-in">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F8F2] text-[#00A86B] mx-auto flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#1E293B]">{t('quiz.resultTitle')}</h2>
            <p className="text-xs text-[#64748B]">
              {allCorrect ? t('quiz.congratsPerfect') : pct >= 70 ? t('quiz.greatJob') : t('quiz.keepPracticing')}
            </p>
          </div>

          <div className="p-5 bg-[#FAFBFB] rounded-2xl border border-[#E2E8F0] text-center space-y-3">
            <div className="text-4xl font-extrabold text-[#00A86B] leading-none">{pct}%</div>
            <div className="text-xs font-bold text-[#64748B]">
              {t('quiz.accuracy')}: {correctCount} / {total}
            </div>
            <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00A86B] transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#64748B]">{t('quiz.explanation')}</div>
              <div className="flex flex-wrap gap-2">
                {results.map((r, i) => (
                  <button
                    key={`${r.kana.id}-${i}`}
                    type="button"
                    onClick={() => speakJapanese(r.kana.kana)}
                    title={`${r.kana.kana} (${r.kana.romaji})`}
                    className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center leading-none btn-lift cursor-pointer ${
                      r.isCorrect
                        ? 'border-[#00A86B]/40 bg-[#F0FDF4] text-[#1E293B]'
                        : 'border-red-300 bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="text-base font-extrabold">{r.kana.kana}</span>
                    <span className="text-[9px] font-bold mt-0.5">
                      {r.isCorrect ? '✓' : '✕'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!allCorrect && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <div className="text-xs font-extrabold text-red-700">
                {t('quiz.wrongListTitle')} · {weakKana.length}
              </div>
              <div className="flex flex-wrap gap-2">
                {weakKana.map((k) => (
                  <span
                    key={k.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs font-extrabold text-red-600"
                  >
                    <span>{k.kana}</span>
                    <span className="font-bold text-red-400 uppercase text-[11px]">{k.romaji}</span>
                    {onPracticeWriting && (
                      <button
                        type="button"
                        onClick={() => onPracticeWriting(k)}
                        aria-label={`${t('quiz.practiceWriting')}: ${k.kana}`}
                        title={`${t('quiz.practiceWriting')}: ${k.kana}`}
                        className="p-0.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer ml-0.5"
                      >
                        <PenLine className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5 pt-1">
                {weakKana.map((k) => (
                  <QuizVocabFeedback key={k.id} kanaId={k.id} compact={true} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {!allCorrect && onNavigateToReview && (
              <button
                type="button"
                onClick={onNavigateToReview}
                className="w-full py-3 bg-[#FAFBFB] border border-emerald-300 text-[#00A86B] font-extrabold text-xs rounded-xl hover:bg-emerald-50/60 btn-lift cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {t('quiz.reviewWeakInReview')}
              </button>
            )}
            {!allCorrect && (
              <button
                type="button"
                onClick={handleRetryWeak}
                className="w-full py-3 bg-[#00A86B] text-white font-extrabold text-xs rounded-xl hover:bg-[#008F5B] btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t('quiz.practiceWrongOnly')} ({weakKana.length})
              </button>
            )}
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setRetryPool(null);
                  generateQuiz(isConfusionMode ? customPool : pool, isConfusionMode ? 'listening' : quizMode);
                }}
                className="flex-1 py-3 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl hover:bg-white hover:border-[#00A86B] btn-lift cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {retryPool ? t('common.reset') : t('quiz.restartQuiz')}
              </button>
              <button
                onClick={onFinish}
                className={`flex-1 py-3 font-bold text-xs rounded-xl btn-lift cursor-pointer ${
                  allCorrect
                    ? 'bg-[#00A86B] text-white hover:bg-[#008F5B] elev-green'
                    : 'bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] hover:bg-white'
                }`}
              >
                {t('quiz.backHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSwitchQuizMode = (mode: 'visual' | 'listening') => {
    if (mode === 'listening' && quizScope === 'all') {
      setQuizScope('basic');
    }
    setQuizMode(mode);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {!isReviewMode && !isConfusionMode && (
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          {/* Mode Switcher: Visual vs Listening */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#F1F5F9]">
            <div className="text-xs font-bold text-[#64748B]">{t('quiz.modeSelect')}</div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleSwitchQuizMode('visual')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  quizMode === 'visual'
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {t('quiz.visualMode')}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchQuizMode('listening')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  quizMode === 'listening'
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                {t('quiz.listeningMode')}
              </button>
            </div>
          </div>

          {/* Scope Selector */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: t('common.all') },
                { id: 'basic', label: t('common.basic') },
                { id: 'dakuten', label: t('common.dakuten') },
                { id: 'handakuten', label: t('common.handakuten') },
                { id: 'youon', label: t('common.youon') },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setQuizScope(item.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  quizScope === item.id
                    ? 'bg-emerald-100 text-[#00A86B] font-extrabold border border-emerald-300'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B] border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isConfusionMode && (
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#00A86B] text-white rounded-lg">
              <Headphones className="w-4 h-4" />
            </span>
            <span className="text-xs font-extrabold text-[#1E293B]">
              {t('confusable.fiveQuestions')}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#00A86B] bg-white px-2.5 py-1 rounded-full border border-emerald-200">
            {t('confusable.listeningPractice')}
          </span>
        </div>
      )}

      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
        <span>
          {t('quiz.questionCount')}: {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-[#00A86B]">{t('quiz.score')}：{score}</span>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
        {quizMode === 'listening' ? (
          /* 🎧 聽音辨假名專屬題卡 */
          <div className="text-center py-6 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9] space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full">
              <Headphones className="w-3.5 h-3.5" />
              {t('quiz.listeningMode')}
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => speakJapanese(currentQ.targetKana.kana)}
                aria-label={t('quiz.replayAudio')}
                title={t('quiz.replayAudio')}
                className="px-6 py-3.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-sm rounded-2xl elev-green btn-lift flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>{t('quiz.replayAudio')}</span>
              </button>
              <p className="text-xs text-[#64748B] font-medium">
                {t('quiz.listenAndChoose')}
              </p>
            </div>

            {isAnswered && (
              <div className="text-xs font-extrabold pt-2">
                {selectedOption === currentQ.targetKana.kana ? (
                  <span className="text-[#00A86B] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('quiz.listeningCorrect')}
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center justify-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {t('quiz.listeningIncorrect')} {currentQ.targetKana.kana} ({currentQ.targetKana.romaji})
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* 綜合測驗題卡 */
          <div className="text-center py-6 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9] space-y-3">
            <span className="text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">
              {currentQ.type === 'kana-to-romaji'
                ? t('quiz.typeKanaToRomaji')
                : currentQ.type === 'audio-to-kana'
                ? t('quiz.typeAudioToKana')
                : currentQ.type === 'kana-to-kana'
                ? t('quiz.typeKanaToKana')
                : t('quiz.typeInputRomaji')}
            </span>

            {currentQ.type === 'audio-to-kana' ? (
              <button
                type="button"
                onClick={() => speakJapanese(currentQ.targetKana.kana)}
                aria-label={t('quiz.replayAudio')}
                className="p-4 bg-[#00A86B] text-white rounded-2xl shadow-xs hover:bg-[#008F5B] transition-all cursor-pointer mx-auto block"
              >
                <Volume2 className="w-8 h-8" />
              </button>
            ) : (
              <div className="text-6xl font-extrabold text-[#1E293B]">{currentQ.targetKana.kana}</div>
            )}
          </div>
        )}

        {/* Answer Area */}
        {currentQ.type === 'input-romaji' && quizMode !== 'listening' ? (
          <div className="space-y-3">
            <input
              type="text"
              value={inputRomaji}
              disabled={isAnswered}
              onChange={(e) => setInputRomaji(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleSubmitInput()}
              placeholder={t('quiz.inputPlaceholder')}
              className="w-full px-4 py-3 bg-[#FAFBFB] border border-[#E2E8F0] rounded-2xl text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#00A86B]"
            />
            {!isAnswered && (
              <button
                onClick={handleSubmitInput}
                className="w-full py-3 bg-[#00A86B] text-white font-bold text-xs rounded-2xl hover:bg-[#008F5B] cursor-pointer"
              >
                {t('quiz.submitAnswer')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.label;

              let btnStyle = 'bg-[#FAFBFB] border-[#E2E8F0] text-[#1E293B] hover:border-[#00A86B]';
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-[#E6F8F2] border-[#00A86B] text-[#00A86B] font-extrabold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-600 font-extrabold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.label, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`p-4 border rounded-2xl text-lg font-bold transition-all cursor-pointer ${btnStyle}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Message */}
        {isAnswered && (
          <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
            {feedbackNote && (
              <div className="text-xs font-bold text-[#00A86B] text-center">{feedbackNote}</div>
            )}
            <QuizVocabFeedback kanaId={currentQ.targetKana.id} />
            <button
              onClick={handleNext}
              className="w-full py-3 bg-[#00A86B] text-white font-bold text-xs rounded-2xl hover:bg-[#008F5B] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {currentIndex < questions.length - 1 ? t('quiz.nextQuestion') : t('quiz.finishQuiz')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
