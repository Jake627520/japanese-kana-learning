import React, { useMemo, useState, useRef, useEffect } from 'react';
import { KanaItem } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { CONFUSABLE_GROUPS, ConfusableGroup } from '../data/confusableData';
import { recordReviewResult, getStoredProgress } from '../utils/storage';
import { getLearningEvents, logLearningEvent } from '../utils/learningEvents';
import { getTrainingOutcome } from '../utils/analytics';
import { TrainingOutcome } from '../types/analytics';
import { LearningEvent } from '../types/learning';
import { speakJapanese } from '../utils/speech';
import { useI18n } from '../i18n';
import { QuizView } from './QuizView';
import { Volume2, Check, X, RotateCcw, Layers, AlertTriangle, ArrowRight, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  initialGroupId?: string | null;
  onProgressChange?: () => void;
}

const ALL_KANA: KanaItem[] = [...HIRAGANA_DATA, ...KATAKANA_DATA];
const byId = new Map(ALL_KANA.map((k) => [k.id, k] as const));

interface Question {
  group: ConfusableGroup;
  target: KanaItem;
  options: KanaItem[];
}

function buildQuestions(
  scriptFilter: 'all' | 'hiragana' | 'katakana',
  modalityFilter: 'all' | 'visual' | 'listening'
): Question[] {
  const groups = CONFUSABLE_GROUPS.filter((g) => {
    const matchScript = scriptFilter === 'all' || g.category === scriptFilter;
    const gModality = g.modality || 'visual';
    let matchModality = true;
    if (modalityFilter === 'visual') {
      matchModality = gModality === 'visual' || gModality === 'both';
    } else if (modalityFilter === 'listening') {
      matchModality = gModality === 'listening' || gModality === 'both';
    }
    return matchScript && matchModality;
  });

  const qs: Question[] = [];
  for (const g of groups) {
    const members = g.members.map((id) => byId.get(id)).filter(Boolean) as KanaItem[];
    if (members.length < 2) continue;
    for (const target of members) {
      qs.push({
        group: g,
        target,
        options: [...members].sort(() => Math.random() - 0.5),
      });
    }
  }
  return qs.sort(() => Math.random() - 0.5);
}

export function ConfusableView({ initialGroupId, onProgressChange }: Props) {
  const { t } = useI18n();
  const [scriptFilter, setScriptFilter] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'visual' | 'listening'>('all');
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestions('all', 'all')
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const [trainingOutcome, setTrainingOutcome] = useState<TrainingOutcome | null>(null);
  const [eventsBeforeSnapshot, setEventsBeforeSnapshot] = useState<LearningEvent[]>(() => getLearningEvents());
  const [activeTrainingGroup, setActiveTrainingGroup] = useState<ConfusableGroup | null>(() => {
    if (initialGroupId) {
      return CONFUSABLE_GROUPS.find((g) => g.id === initialGroupId) || null;
    }
    return null;
  });

  // Watch for external initialGroupId changes
  React.useEffect(() => {
    if (initialGroupId) {
      const g = CONFUSABLE_GROUPS.find((group) => group.id === initialGroupId);
      if (g) {
        setTrainingOutcome(null);
        setEventsBeforeSnapshot(getLearningEvents());
        setActiveTrainingGroup(g);
      }
    }
  }, [initialGroupId]);

  const q = questions[index];
  const answered = picked !== null;
  const isRight = answered && picked === q?.target.id;

  const wrongIds = useMemo(() => getStoredProgress().wrongKanaIds, [index]);

  const questionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [index, q]);

  const restart = (
    s: 'all' | 'hiragana' | 'katakana' = scriptFilter,
    m: 'all' | 'visual' | 'listening' = modalityFilter
  ) => {
    setScriptFilter(s);
    setModalityFilter(m);
    setQuestions(buildQuestions(s, m));
    setIndex(0);
    setPicked(null);
    setScore({ right: 0, wrong: 0 });
    setDone(false);
  };

  const choose = (id: string) => {
    if (answered || !q) return;
    setPicked(id);
    const correct = id === q.target.id;
    const responseMs = Math.max(10, Date.now() - questionStartTimeRef.current);
    setScore((s) => ({
      right: s.right + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
    }));
    recordReviewResult(q.target.id, correct, responseMs);
    logLearningEvent({
      type: 'quiz_answer',
      source: 'confusable_quiz',
      kanaId: q.target.id,
      selectedKanaId: id,
      correct,
    });
    onProgressChange?.();
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const handleTrainingFinish = () => {
    if (activeTrainingGroup) {
      const eventsAfter = getLearningEvents();
      const outcome = getTrainingOutcome(
        eventsBeforeSnapshot,
        eventsAfter,
        activeTrainingGroup.id,
        CONFUSABLE_GROUPS
      );
      setTrainingOutcome(outcome);
      onProgressChange?.();
    }
  };

  if (activeTrainingGroup) {
    if (trainingOutcome) {
      const remainingTargetObj = trainingOutcome.remainingTopDirection
        ? byId.get(trainingOutcome.remainingTopDirection.target)
        : undefined;
      const remainingSelectedObj = trainingOutcome.remainingTopDirection
        ? byId.get(trainingOutcome.remainingTopDirection.selected)
        : undefined;

      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-[#F6FCF9] p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t('analytics.trainingOutcomeTitle')}
              </div>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  trainingOutcome.isResolved
                    ? 'bg-emerald-100 text-[#00A86B] border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {trainingOutcome.isResolved
                  ? t('analytics.trainingOutcomeResolved')
                  : t('analytics.trainingOutcomeRemaining')}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1E293B]">
                {activeTrainingGroup.title} · {t('confusable.listeningPractice')}
              </h2>
              <p className="text-xs text-[#64748B]">
                {activeTrainingGroup.distinguish}
              </p>
            </div>

            {/* Metrics 3-Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-emerald-100 text-center">
              <div>
                <div className="text-xs font-bold text-[#64748B]">
                  {t('analytics.trainingOutcomeSession')}
                </div>
                <div className="text-xl font-black text-[#00A86B] mt-1">
                  {Math.round(trainingOutcome.sessionAccuracy * 100)}%
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#64748B]">
                  {t('analytics.trainingOutcomeBefore')}
                </div>
                <div className="text-xl font-black text-[#64748B] mt-1">
                  {Math.round(trainingOutcome.beforeAccuracy * 100)}%
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#64748B]">
                  {t('analytics.trainingOutcomeImprovement')}
                </div>
                <div className={`text-xl font-black mt-1 ${trainingOutcome.improvement >= 0 ? 'text-[#00A86B]' : 'text-rose-600'}`}>
                  {trainingOutcome.improvement >= 0 ? '+' : ''}
                  {Math.round(trainingOutcome.improvement * 100)}%
                </div>
              </div>
            </div>

            {/* Remaining Confusion Direction */}
            {remainingTargetObj && remainingSelectedObj ? (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs font-medium text-[#475569] flex items-center justify-between">
                <span className="text-[#64748B] font-bold">{t('analytics.mostConfusedWith')}:</span>
                <span className="font-extrabold text-amber-900">
                  {remainingTargetObj.kana} ({remainingTargetObj.romaji}) → <span className="text-rose-600 font-black">{remainingSelectedObj.kana}</span> ({remainingSelectedObj.romaji})
                </span>
              </div>
            ) : (
              <div className="p-3 bg-[#E6F8F2] rounded-xl border border-emerald-200 text-xs font-bold text-[#00A86B] flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('analytics.trainingOutcomeResolved')}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setTrainingOutcome(null);
                  setEventsBeforeSnapshot(getLearningEvents());
                }}
                className="flex-1 py-3 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('analytics.retryTraining')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrainingOutcome(null);
                  setActiveTrainingGroup(null);
                  onProgressChange?.();
                }}
                className="flex-1 py-3 bg-white hover:bg-slate-50 text-[#1E293B] font-bold text-xs rounded-xl border border-[#E2E8F0] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{t('analytics.finishTraining')}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const groupMembers = activeTrainingGroup.members
      .map((id) => byId.get(id))
      .filter(Boolean) as KanaItem[];

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            setTrainingOutcome(null);
            setActiveTrainingGroup(null);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#1E293B] cursor-pointer"
        >
          ← {t('confusable.title')}
        </button>
        <QuizView
          allKana={ALL_KANA}
          customPool={groupMembers}
          isConfusionMode={true}
          onProgressChange={onProgressChange ?? (() => {})}
          onFinish={handleTrainingFinish}
        />
      </div>
    );
  }

  if (done) {
    const total = score.right + score.wrong;
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-4">
          <h2 className="text-2xl font-display font-bold text-[#1E293B]">{t('confusable.title')}</h2>
          <p className="text-sm text-[#64748B]">
            {t('quiz.accuracy')}: <span className="text-[#00A86B] font-extrabold">{score.right}</span> / {total}
          </p>
          <button
            onClick={() => restart(scriptFilter, modalityFilter)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> {t('quiz.restartQuiz')}
          </button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-4">
          <p className="text-xs text-[#64748B]">{t('common.loading')}</p>
          <button
            onClick={() => restart('all', 'all')}
            className="px-4 py-2 bg-[#00A86B] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            {t('common.reset')}
          </button>
        </div>
      </div>
    );
  }

  const isListeningAvailable = q.group.modality === 'listening' || q.group.modality === 'both';

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-extrabold">
          <Layers className="w-3.5 h-3.5" />
          {t('confusable.title')}
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1E293B]">{t('confusable.subtitle')}</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          {t('confusable.distinctionTips')}
        </p>
      </div>

      {/* 篩選控制器：字系與模態 */}
      <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* 字系篩選 */}
          <div className="flex gap-1.5">
            {([['all', t('common.all')], ['hiragana', t('common.hiragana')], ['katakana', t('common.katakana')]] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => restart(v, modalityFilter)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  scriptFilter === v
                    ? 'bg-[#00A86B] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 模態篩選 */}
          <div className="flex gap-1.5">
            {([['all', t('confusable.all')], ['visual', t('confusable.visual')], ['listening', t('confusable.listening')]] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => restart(scriptFilter, v)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  modalityFilter === v
                    ? 'bg-emerald-100 text-[#00A86B] font-extrabold border border-emerald-300'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B] border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>{index + 1} / {questions.length}</span>
          <div className="flex items-center gap-3">
            {isListeningAvailable && (
              <button
                type="button"
                onClick={() => setActiveTrainingGroup(q.group)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-extrabold text-[#00A86B] bg-[#E6F8F2] hover:bg-[#D1F2E6] rounded-lg transition-all cursor-pointer border border-emerald-300"
              >
                <Headphones className="w-3 h-3" />
                {t('confusable.startListening')}
              </button>
            )}
            <span>
              ✓ {score.right} 　✗ {score.wrong}
            </span>
          </div>
        </div>

        {/* 題目 */}
        <div className="text-center space-y-2">
          <p className="text-xs text-[#64748B]">{t('quiz.typeAudioToKana')}</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-extrabold text-[#1E293B]">{q.target.romaji}</span>
            <button
              onClick={() => speakJapanese(q.target.kana)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> {t('common.playAudio')}
            </button>
          </div>
          {wrongIds.includes(q.target.id) && !answered && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> {t('header.weak')}
            </span>
          )}
        </div>

        {/* 選項 */}
        <div className={`grid gap-3 ${q.options.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {q.options.map((opt) => {
            const isTarget = opt.id === q.target.id;
            const isPicked = picked === opt.id;
            let cls = 'bg-white border-[#E2E8F0] hover:border-[#00A86B]/40';
            if (answered) {
              if (isTarget) cls = 'bg-[#E6F8F2] border-[#00A86B]';
              else if (isPicked) cls = 'bg-[#FEE2E2] border-[#E11D48]';
              else cls = 'bg-white border-[#E2E8F0] opacity-50';
            }
            return (
              <button
                key={opt.id}
                onClick={() => choose(opt.id)}
                disabled={answered}
                className={`relative py-8 rounded-2xl border-2 transition-all cursor-pointer disabled:cursor-default ${cls}`}
              >
                <span className="text-5xl font-extrabold text-[#1E293B]">{opt.kana}</span>
                {answered && isTarget && (
                  <Check className="w-5 h-5 text-[#00A86B] absolute top-2 right-2" />
                )}
                {answered && isPicked && !isTarget && (
                  <X className="w-5 h-5 text-[#E11D48] absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* 判斷點 */}
        {answered && (
          <div
            className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
              isRight ? 'bg-[#F0FDF7] text-[#1E293B]' : 'bg-[#FEF3C7] text-[#92400E]'
            }`}
          >
            <span className="font-extrabold">{t('confusable.comparison')}: </span>
            {q.group.distinguish}
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] cursor-pointer"
          >
            {index + 1 >= questions.length ? t('quiz.finishQuiz') : t('quiz.nextQuestion')} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
