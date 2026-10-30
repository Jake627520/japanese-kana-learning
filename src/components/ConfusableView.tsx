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
import { useI18n, localize } from '../i18n';
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
  const { t, language } = useI18n();
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
          <div className="bg-gradient-to-br from-white to-[color:var(--paper-96)] p-6 sm:p-8 rounded-3xl border border-[color:var(--moss-79)] shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[color:var(--moss-93)] text-[color:var(--moss-50)] rounded-full text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {t('analytics.trainingOutcomeTitle')}
              </div>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  trainingOutcome.isResolved
                    ? 'bg-emerald-100 text-[color:var(--moss-50)] border-[color:var(--moss-75)]'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {trainingOutcome.isResolved
                  ? t('analytics.trainingOutcomeResolved')
                  : t('analytics.trainingOutcomeRemaining')}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[color:var(--ink-24)]">
                {activeTrainingGroup.title} · {t('confusable.listeningPractice')}
              </h2>
              <p className="text-xs text-[color:var(--ink-50)]">
                {localize(activeTrainingGroup.distinguish, language)}
              </p>
            </div>

            {/* Metrics 3-Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--moss-89)] text-center">
              <div>
                <div className="text-xs font-bold text-[color:var(--ink-50)]">
                  {t('analytics.trainingOutcomeSession')}
                </div>
                <div className="text-xl font-black text-[color:var(--moss-50)] mt-1">
                  {Math.round(trainingOutcome.sessionAccuracy * 100)}%
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[color:var(--ink-50)]">
                  {t('analytics.trainingOutcomeBefore')}
                </div>
                <div className="text-xl font-black text-[color:var(--ink-50)] mt-1">
                  {Math.round(trainingOutcome.beforeAccuracy * 100)}%
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[color:var(--ink-50)]">
                  {t('analytics.trainingOutcomeImprovement')}
                </div>
                <div className={`text-xl font-black mt-1 ${trainingOutcome.improvement >= 0 ? 'text-[color:var(--moss-50)]' : 'text-rose-600'}`}>
                  {trainingOutcome.improvement >= 0 ? '+' : ''}
                  {Math.round(trainingOutcome.improvement * 100)}%
                </div>
              </div>
            </div>

            {/* Remaining Confusion Direction */}
            {remainingTargetObj && remainingSelectedObj ? (
              <div className="p-3 bg-[color:var(--paper-92a)]/70 rounded-xl border border-[color:var(--kincha-86a)] text-xs font-medium text-[color:var(--ink-43)] flex items-center justify-between">
                <span className="text-[color:var(--ink-50)] font-bold">{t('analytics.mostConfusedWith')}:</span>
                <span className="font-extrabold text-amber-900">
                  {remainingTargetObj.kana} ({remainingTargetObj.romaji}) → <span className="text-rose-600 font-black">{remainingSelectedObj.kana}</span> ({remainingSelectedObj.romaji})
                </span>
              </div>
            ) : (
              <div className="p-3 bg-[color:var(--moss-93)] rounded-xl border border-[color:var(--moss-79)] text-xs font-bold text-[color:var(--moss-50)] flex items-center justify-center gap-1.5">
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
                className="flex-1 py-3 bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] text-[color:var(--paper-95)] font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
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
                className="flex-1 py-3 bg-[color:var(--paper-bg)] hover:bg-[color:var(--paper-93)] text-[color:var(--ink-24)] font-bold text-xs rounded-xl border border-[color:var(--paper-85)] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)] cursor-pointer"
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
        <div className="bg-[color:var(--paper-bg)] p-8 rounded-3xl border border-[color:var(--paper-85)] shadow-xs text-center space-y-4">
          <h2 className="text-2xl font-display font-bold text-[color:var(--ink-24)]">{t('confusable.title')}</h2>
          <p className="text-sm text-[color:var(--ink-50)]">
            {t('quiz.accuracy')}: <span className="text-[color:var(--moss-50)] font-extrabold">{score.right}</span> / {total}
          </p>
          <button
            onClick={() => restart(scriptFilter, modalityFilter)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] font-extrabold text-sm rounded-2xl hover:bg-[color:var(--moss-43)] cursor-pointer"
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
        <div className="bg-[color:var(--paper-bg)] p-8 rounded-3xl border border-[color:var(--paper-85)] shadow-xs text-center space-y-4">
          <p className="text-xs text-[color:var(--ink-50)]">{t('common.loading')}</p>
          <button
            onClick={() => restart('all', 'all')}
            className="px-4 py-2 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] text-xs font-bold rounded-xl cursor-pointer"
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[color:var(--moss-93)] text-[color:var(--moss-50)] rounded-full text-xs font-extrabold">
          <Layers className="w-3.5 h-3.5" />
          {t('confusable.title')}
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[color:var(--ink-24)]">{t('confusable.subtitle')}</h2>
        <p className="text-xs text-[color:var(--ink-50)] leading-relaxed">
          {t('confusable.distinctionTips')}
        </p>
      </div>

      {/* 篩選控制器：字系與模態 */}
      <div className="space-y-2.5 bg-[color:var(--paper-bg)] p-4 rounded-2xl border border-[color:var(--paper-85)] shadow-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* 字系篩選 */}
          <div className="flex gap-1.5">
            {([['all', t('common.all')], ['hiragana', t('common.hiragana')], ['katakana', t('common.katakana')]] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => restart(v, modalityFilter)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  scriptFilter === v
                    ? 'bg-[color:var(--moss-50)] text-[color:var(--paper-95)]'
                    : 'bg-[color:var(--paper-92)] text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)]'
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
                    ? 'bg-emerald-100 text-[color:var(--moss-50)] font-extrabold border border-[color:var(--moss-75)]'
                    : 'bg-[color:var(--paper-93)] text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)] border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[color:var(--paper-bg)] p-6 sm:p-8 rounded-3xl border border-[color:var(--paper-85)] shadow-xs space-y-6">
        <div className="flex items-center justify-between text-xs text-[color:var(--ink-50)]">
          <span>{index + 1} / {questions.length}</span>
          <div className="flex items-center gap-3">
            {isListeningAvailable && (
              <button
                type="button"
                onClick={() => {
                  // 和其他特訓入口一樣先拍快照，結果才只算這一次特訓
                  setTrainingOutcome(null);
                  setEventsBeforeSnapshot(getLearningEvents());
                  setActiveTrainingGroup(q.group);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-extrabold text-[color:var(--moss-50)] bg-[color:var(--moss-93)] hover:bg-[color:var(--moss-90)] rounded-lg transition-all cursor-pointer border border-[color:var(--moss-75)]"
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
          <p className="text-xs text-[color:var(--ink-50)]">{t('quiz.typeAudioToKana')}</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-extrabold text-[color:var(--ink-24)]">{q.target.romaji}</span>
            <button
              onClick={() => speakJapanese(q.target.kana)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[color:var(--ink-24)] bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-xl hover:bg-[color:var(--paper-93)] cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> {t('common.playAudio')}
            </button>
          </div>
          {wrongIds.includes(q.target.id) && !answered && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--kincha-47)] bg-[color:var(--paper-92a)] px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> {t('header.weak')}
            </span>
          )}
        </div>

        {/* 選項 */}
        <div className={`grid gap-3 ${q.options.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {q.options.map((opt) => {
            const isTarget = opt.id === q.target.id;
            const isPicked = picked === opt.id;
            let cls = 'bg-[color:var(--paper-bg)] border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)]/40';
            if (answered) {
              if (isTarget) cls = 'bg-[color:var(--moss-93)] border-[color:var(--moss-50)]';
              else if (isPicked) cls = 'bg-[color:var(--shu-91)] border-[color:var(--shu-52a)]';
              else cls = 'bg-[color:var(--paper-bg)] border-[color:var(--paper-85)] opacity-50';
            }
            return (
              <button
                key={opt.id}
                onClick={() => choose(opt.id)}
                disabled={answered}
                className={`relative py-8 rounded-2xl border-2 transition-all cursor-pointer disabled:cursor-default ${cls}`}
              >
                <span className="text-5xl font-extrabold text-[color:var(--ink-24)]">{opt.kana}</span>
                {answered && isTarget && (
                  <Check className="w-5 h-5 text-[color:var(--moss-50)] absolute top-2 right-2" />
                )}
                {answered && isPicked && !isTarget && (
                  <X className="w-5 h-5 text-[color:var(--shu-52a)] absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* 判斷點 */}
        {answered && (
          <div
            className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
              isRight ? 'bg-[color:var(--moss-95)] text-[color:var(--ink-24)]' : 'bg-[color:var(--paper-92a)] text-[color:var(--kincha-47)]'
            }`}
          >
            <span className="font-extrabold">{t('confusable.comparison')}: </span>
            {localize(q.group.distinguish, language)}
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[color:var(--moss-50)] text-[color:var(--paper-95)] font-extrabold text-sm rounded-2xl hover:bg-[color:var(--moss-43)] cursor-pointer"
          >
            {index + 1 >= questions.length ? t('quiz.finishQuiz') : t('quiz.nextQuestion')} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
