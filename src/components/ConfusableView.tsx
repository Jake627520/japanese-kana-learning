import React, { useMemo, useState } from 'react';
import { KanaItem } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { CONFUSABLE_GROUPS, ConfusableGroup } from '../data/confusableData';
import { recordReviewResult, getStoredProgress } from '../utils/storage';
import { speakJapanese } from '../utils/speech';
import { useI18n } from '../i18n';
import { Volume2, Check, X, RotateCcw, Layers, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  onProgressChange?: () => void;
}

const ALL_KANA: KanaItem[] = [...HIRAGANA_DATA, ...KATAKANA_DATA];
const byId = new Map(ALL_KANA.map((k) => [k.id, k] as const));

interface Question {
  group: ConfusableGroup;
  target: KanaItem;
  options: KanaItem[];
}

function buildQuestions(filter: 'all' | 'hiragana' | 'katakana'): Question[] {
  const groups = CONFUSABLE_GROUPS.filter(
    (g) => filter === 'all' || g.category === filter,
  );
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

export function ConfusableView({ onProgressChange }: Props) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions('all'));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  const q = questions[index];
  const answered = picked !== null;
  const isRight = answered && picked === q?.target.id;

  const wrongIds = useMemo(() => getStoredProgress().wrongKanaIds, [index]);

  const restart = (f: 'all' | 'hiragana' | 'katakana') => {
    setFilter(f);
    setQuestions(buildQuestions(f));
    setIndex(0);
    setPicked(null);
    setScore({ right: 0, wrong: 0 });
    setDone(false);
  };

  const choose = (id: string) => {
    if (answered || !q) return;
    setPicked(id);
    const correct = id === q.target.id;
    setScore((s) => ({
      right: s.right + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
    }));
    recordReviewResult(q.target.id, correct);
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
            onClick={() => restart(filter)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> {t('quiz.restartQuiz')}
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

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

      {/* 篩選 */}
      <div className="flex gap-2">
        {([['all', t('common.all')], ['hiragana', t('common.hiragana')], ['katakana', t('common.katakana')]] as const).map(([v, label]) => (
          <button
            key={v}
            onClick={() => restart(v)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              filter === v
                ? 'bg-[#00A86B] text-white border-[#00A86B]'
                : 'bg-white text-[#1E293B] border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>{index + 1} / {questions.length}</span>
          <span>
            ✓ {score.right} 　✗ {score.wrong}
          </span>
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
