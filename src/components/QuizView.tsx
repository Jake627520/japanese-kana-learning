import React, { useState, useEffect, useRef } from 'react';
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

  const questionStartTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const currentQ = questions[currentIndex];

  // Auto-play audio when navigating questions in listening mode and track start time
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    if (currentQ && (quizMode === 'listening' || isConfusionMode) && !isAnswered && !isCompleted) {
      speakJapanese(currentQ.targetKana.kana);
    }
  }, [currentIndex, currentQ, quizMode, isConfusionMode, isCompleted]);

  const handleSelectOption = (label: string, isCorrect: boolean) => {
    if (isAnswered) return;

    setSelectedOption(label);
    setIsAnswered(true);

    const responseMs = Math.max(10, Date.now() - questionStartTimeRef.current);
    const targetKana = currentQ.targetKana;
    const selectedKana = currentQ.options.find((o) => o.label === label)?.kana;

    recordReviewResult(targetKana.id, isCorrect, responseMs);
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
      responseMs,
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

    inputRef.current?.blur();
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

  useEffect(() => {
    if (questions.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const isTargetInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // 未作答且焦點在輸入框上時，完全放行給輸入框自己處理，避免雙擊或干擾打字
      if (!isAnswered && isTargetInput) return;

      if (isCompleted) {
        if (e.key === 'Enter') {
          e.preventDefault();
          setRetryPool(null);
          generateQuiz(
            isConfusionMode ? customPool : pool,
            isConfusionMode ? 'listening' : quizMode
          );
        }
        return;
      }

      if (!isAnswered) {
        const isChoiceMode = currentQ && (currentQ.type !== 'input-romaji' || quizMode === 'listening');
        if (isChoiceMode && currentQ.options) {
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
          if (optIdx !== undefined && optIdx < currentQ.options.length) {
            e.preventDefault();
            const opt = currentQ.options[optIdx];
            handleSelectOption(opt.label, opt.isCorrect);
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
  }, [questions, currentIndex, currentQ, isAnswered, isCompleted, quizMode, isConfusionMode, customPool, pool]);

  if (!currentQ && !isCompleted) {
    return <div className="p-8 text-center text-xs text-[#6B6252]">{t('common.loading')}</div>;
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
      <div className="max-w-md mx-auto bg-[#F4EEDE] p-6 sm:p-8 rounded-3xl border border-[#D9CDB2] shadow-xs rise-in">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#E6EAD5] text-[#5C6B3D] mx-auto flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#221F18]">{t('quiz.resultTitle')}</h2>
            <p className="text-xs text-[#6B6252]">
              {allCorrect ? t('quiz.congratsPerfect') : pct >= 70 ? t('quiz.greatJob') : t('quiz.keepPracticing')}
            </p>
          </div>

          <div className="p-5 bg-[#F4EEDE] rounded-2xl border border-[#D9CDB2] text-center space-y-3">
            <div className="text-4xl font-extrabold text-[#5C6B3D] leading-none">{pct}%</div>
            <div className="text-xs font-bold text-[#6B6252]">
              {t('quiz.accuracy')}: {correctCount} / {total}
            </div>
            <div className="h-1.5 rounded-full bg-[#D9CDB2] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5C6B3D] transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#6B6252]">{t('quiz.explanation')}</div>
              <div className="flex flex-wrap gap-2">
                {results.map((r, i) => (
                  <button
                    key={`${r.kana.id}-${i}`}
                    type="button"
                    onClick={() => speakJapanese(r.kana.kana)}
                    title={`${r.kana.kana} (${r.kana.romaji})`}
                    className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center leading-none btn-lift cursor-pointer ${
                      r.isCorrect
                        ? 'border-[#5C6B3D]/40 bg-[#EEF0E3] text-[#221F18]'
                        : 'border-[#CAA096] bg-[#EFDBD5] text-[#A6443A]'
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
            <div className="p-4 rounded-2xl bg-[#EFDBD5] border border-[#D8B8B0] space-y-3">
              <div className="text-xs font-extrabold text-[#8E3A31]">
                {t('quiz.wrongListTitle')} · {weakKana.length}
              </div>
              <div className="flex flex-wrap gap-2">
                {weakKana.map((k) => (
                  <span
                    key={k.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4EEDE] border border-[#D8B8B0] text-xs font-extrabold text-[#A6443A]"
                  >
                    <span>{k.kana}</span>
                    <span className="font-bold text-red-400 uppercase text-[11px]">{k.romaji}</span>
                    {onPracticeWriting && (
                      <button
                        type="button"
                        onClick={() => onPracticeWriting(k)}
                        aria-label={`${t('quiz.practiceWriting')}: ${k.kana}`}
                        title={`${t('quiz.practiceWriting')}: ${k.kana}`}
                        className="p-0.5 text-red-400 hover:text-[#8E3A31] hover:bg-[#EFDBD5] rounded transition-colors cursor-pointer ml-0.5"
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
                className="w-full py-3 bg-[#F4EEDE] border border-[#A8B487] text-[#5C6B3D] font-extrabold text-xs rounded-xl hover:bg-[#E6EAD5]/60 btn-lift cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {t('quiz.reviewWeakInReview')}
              </button>
            )}
            {!allCorrect && (
              <button
                type="button"
                onClick={handleRetryWeak}
                className="w-full py-3 bg-[#5C6B3D] text-[#F1EFE0] font-extrabold text-xs rounded-xl hover:bg-[#47552F] btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
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
                className="flex-1 py-3 bg-[#F4EEDE] border border-[#D9CDB2] text-[#221F18] font-bold text-xs rounded-xl hover:bg-[#F4EEDE] hover:border-[#5C6B3D] btn-lift cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {retryPool ? t('common.reset') : t('quiz.restartQuiz')}
              </button>
              <button
                onClick={onFinish}
                className={`flex-1 py-3 font-bold text-xs rounded-xl btn-lift cursor-pointer ${
                  allCorrect
                    ? 'bg-[#5C6B3D] text-[#F1EFE0] hover:bg-[#47552F] elev-green'
                    : 'bg-[#F4EEDE] border border-[#D9CDB2] text-[#221F18] hover:bg-[#F4EEDE]'
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
        <div className="bg-[#F4EEDE] p-4 rounded-2xl border border-[#D9CDB2] shadow-xs space-y-3">
          {/* Mode Switcher: Visual vs Listening */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#ECE4D0]">
            <div className="text-xs font-bold text-[#6B6252]">{t('quiz.modeSelect')}</div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleSwitchQuizMode('visual')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  quizMode === 'visual'
                    ? 'bg-[#5C6B3D] text-[#F1EFE0] shadow-xs'
                    : 'bg-[#ECE4D0] text-[#6B6252] hover:text-[#221F18]'
                }`}
              >
                {t('quiz.visualMode')}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchQuizMode('listening')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  quizMode === 'listening'
                    ? 'bg-[#5C6B3D] text-[#F1EFE0] shadow-xs'
                    : 'bg-[#ECE4D0] text-[#6B6252] hover:text-[#221F18]'
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
                    ? 'bg-emerald-100 text-[#5C6B3D] font-extrabold border border-[#A8B487]'
                    : 'bg-[#F0E9D8] text-[#6B6252] hover:text-[#221F18] border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isConfusionMode && (
        <div className="bg-[#F4EEDE] p-3.5 rounded-2xl border border-[#B6C096] bg-[#E6EAD5]/50 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#5C6B3D] text-[#F1EFE0] rounded-lg">
              <Headphones className="w-4 h-4" />
            </span>
            <span className="text-xs font-extrabold text-[#221F18]">
              {t('confusable.fiveQuestions')}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#5C6B3D] bg-[#F4EEDE] px-2.5 py-1 rounded-full border border-[#B6C096]">
            {t('confusable.listeningPractice')}
          </span>
        </div>
      )}

      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between text-xs font-bold text-[#6B6252]">
        <span>
          {t('quiz.questionCount')}: {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-[#5C6B3D]">{t('quiz.score')}：{score}</span>
      </div>

      {/* a11y: 螢幕報讀器結果播報（常駐 live region，作答後才有內容） */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {isAnswered
          ? results[results.length - 1]?.isCorrect
            ? t('common.answerCorrect')
            : t('common.answerWrongWithCorrect', {
                answer:
                  currentQ.type === 'input-romaji' && quizMode !== 'listening'
                    ? currentQ.targetKana.romaji
                    : currentQ.options.find((o) => o.isCorrect)?.label ?? '',
              })
          : ''}
      </div>

      {/* Question Card */}
      <div className="bg-[#F4EEDE] p-6 sm:p-8 rounded-3xl border border-[#D9CDB2] shadow-xs space-y-6">
        {quizMode === 'listening' ? (
          /* 🎧 聽音辨假名專屬題卡 */
          <div className="text-center py-6 bg-[#F4EEDE] rounded-2xl border border-[#ECE4D0] space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C6B3D] bg-[#E6EAD5] px-3 py-1 rounded-full">
              <Headphones className="w-3.5 h-3.5" />
              {t('quiz.listeningMode')}
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => speakJapanese(currentQ.targetKana.kana)}
                aria-label={t('quiz.replayAudio')}
                title={t('quiz.replayAudio')}
                className="px-6 py-3.5 bg-[#5C6B3D] hover:bg-[#47552F] text-[#F1EFE0] font-extrabold text-sm rounded-2xl elev-green btn-lift flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>{t('quiz.replayAudio')}</span>
              </button>
              <p className="text-xs text-[#6B6252] font-medium">
                {t('quiz.listenAndChoose')}
              </p>
            </div>

            {isAnswered && (
              <div className="text-xs font-extrabold pt-2">
                {selectedOption === currentQ.targetKana.kana ? (
                  <span className="text-[#5C6B3D] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('quiz.listeningCorrect')}
                  </span>
                ) : (
                  <span className="text-[#A6443A] flex items-center justify-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {t('quiz.listeningIncorrect')} {currentQ.targetKana.kana} ({currentQ.targetKana.romaji})
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* 綜合測驗題卡 */
          <div className="text-center py-6 bg-[#F4EEDE] rounded-2xl border border-[#ECE4D0] space-y-3">
            <span className="text-xs font-bold text-[#6B6252] bg-[#ECE4D0] px-3 py-1 rounded-full">
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
                className="p-4 bg-[#5C6B3D] text-[#F1EFE0] rounded-2xl shadow-xs hover:bg-[#47552F] transition-all cursor-pointer mx-auto block"
              >
                <Volume2 className="w-8 h-8" />
              </button>
            ) : (
              <div lang="ja" className="text-6xl font-extrabold text-[#221F18]">{currentQ.targetKana.kana}</div>
            )}
          </div>
        )}

        {/* Answer Area */}
        {currentQ.type === 'input-romaji' && quizMode !== 'listening' ? (
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={inputRomaji}
              disabled={isAnswered}
              onChange={(e) => setInputRomaji(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleSubmitInput()}
              placeholder={t('quiz.inputPlaceholder')}
              className="w-full px-4 py-3 bg-[#F4EEDE] border border-[#D9CDB2] rounded-2xl text-sm font-bold text-[#221F18] focus:outline-none focus:border-[#5C6B3D]"
            />
            {!isAnswered && (
              <button
                onClick={handleSubmitInput}
                className="w-full py-3 bg-[#5C6B3D] text-[#F1EFE0] font-bold text-xs rounded-2xl hover:bg-[#47552F] cursor-pointer"
              >
                {t('quiz.submitAnswer')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.label;

              let btnStyle = 'bg-[#F4EEDE] border-[#D9CDB2] text-[#221F18] hover:border-[#5C6B3D]';
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-[#E6EAD5] border-[#5C6B3D] text-[#5C6B3D] font-extrabold';
                } else if (isSelected) {
                  btnStyle = 'bg-[#EFDBD5] border-red-400 text-[#A6443A] font-extrabold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.label, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`p-4 border rounded-2xl text-lg font-bold transition-all cursor-pointer flex items-center justify-center relative ${btnStyle}`}
                >
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#ECE4D0] text-[11px] font-bold text-[#6B6252] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span lang={currentQ.type === 'kana-to-romaji' ? undefined : 'ja'}>{opt.label}</span>
                  {isAnswered && opt.isCorrect && (
                    <span className="sr-only">（{t('common.correctAnswer')}）</span>
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <span className="sr-only">（{t('common.yourWrongAnswer')}）</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Message */}
        {isAnswered && (
          <div className="pt-4 border-t border-[#ECE4D0] space-y-3">
            {feedbackNote && (
              <div className="text-xs font-bold text-[#5C6B3D] text-center">{feedbackNote}</div>
            )}
            <QuizVocabFeedback kanaId={currentQ.targetKana.id} />
            <button
              onClick={handleNext}
              className="w-full py-3 bg-[#5C6B3D] text-[#F1EFE0] font-bold text-xs rounded-2xl hover:bg-[#47552F] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{currentIndex < questions.length - 1 ? t('quiz.nextQuestion') : t('quiz.finishQuiz')}</span>
              <kbd className="text-[10px] bg-[#f4eede]/20 px-1.5 py-0.5 rounded font-mono font-bold leading-none">↵</kbd>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
