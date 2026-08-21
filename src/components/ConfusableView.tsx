import React, { useMemo, useState } from 'react';
import { KanaItem } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { CONFUSABLE_GROUPS, ConfusableGroup } from '../data/confusableData';
import { recordReviewResult, getStoredProgress } from '../utils/storage';
import { speakJapanese } from '../utils/speech';
import { Volume2, Check, X, RotateCcw, Layers, AlertTriangle, ArrowRight } from 'lucide-react';

// 易混假名對比練習。
//
// 為什麼不能用一般測驗代替：隨機抽卡時 ぬ 的干擾項可能是 か、さ、と——那題太好猜，
// 練不到真正的困難。這裡的干擾項**只從同一組易混字裡抽**，逼使用者真的去分辨
// 「繞不繞圈」「往左還往右」，而不是靠排除法。
//
// 答錯時直接show出該組的判斷點（distinguish），因為這類錯誤補的不是記憶量，
// 是「該看哪個特徵」——沒講清楚判斷點，再練幾次還是會錯。
//
// 對錯沿用 recordReviewResult：和綜合測驗共用同一套 SRS 與錯題本，
// 不另開一套統計，否則兩邊的「弱點」會各說各話。

interface Props {
  onProgressChange?: () => void;
}

const ALL_KANA: KanaItem[] = [...HIRAGANA_DATA, ...KATAKANA_DATA];
const byId = new Map(ALL_KANA.map((k) => [k.id, k] as const));

interface Question {
  group: ConfusableGroup;
  target: KanaItem;      // 要找的字
  options: KanaItem[];   // 全部來自同組
}

function buildQuestions(filter: 'all' | 'hiragana' | 'katakana'): Question[] {
  const groups = CONFUSABLE_GROUPS.filter(
    (g) => filter === 'all' || g.category === filter,
  );
  const qs: Question[] = [];
  for (const g of groups) {
    const members = g.members.map((id) => byId.get(id)).filter(Boolean) as KanaItem[];
    if (members.length < 2) continue;
    // 每組每個成員都當一次答案，確保兩個方向都練到（ぬ→め 和 め→ぬ）
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
          <h2 className="text-2xl font-extrabold text-[#1E293B]">易混練習完成</h2>
          <p className="text-sm text-[#64748B]">
            答對 <span className="text-[#00A86B] font-extrabold">{score.right}</span> / {total}
          </p>
          <button
            onClick={() => restart(filter)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> 再練一輪
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
          易混假名對比
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">分辨長得像的假名</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          干擾項只從同一組易混字裡抽——ぬ 的選項就是 め，逼你真的去看「繞不繞圈」，不是靠排除法猜。
        </p>
      </div>

      {/* 篩選 */}
      <div className="flex gap-2">
        {([['all', '全部'], ['hiragana', '平假名'], ['katakana', '片假名']] as const).map(([v, label]) => (
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
          <span>第 {index + 1} / {questions.length} 題</span>
          <span>
            ✓ {score.right} 　✗ {score.wrong}
          </span>
        </div>

        {/* 題目：給讀音找字 */}
        <div className="text-center space-y-2">
          <p className="text-xs text-[#64748B]">哪一個是這個讀音？</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-extrabold text-[#1E293B]">{q.target.romaji}</span>
            <button
              onClick={() => speakJapanese(q.target.kana)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> 聽
            </button>
          </div>
          {wrongIds.includes(q.target.id) && !answered && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> 這個你之前錯過
            </span>
          )}
        </div>

        {/* 選項：全部來自同組 */}
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

        {/* 判斷點：答完才顯示，答錯時最重要 */}
        {answered && (
          <div
            className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
              isRight ? 'bg-[#F0FDF7] text-[#1E293B]' : 'bg-[#FEF3C7] text-[#92400E]'
            }`}
          >
            <span className="font-extrabold">怎麼分辨：</span>
            {q.group.distinguish}
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] cursor-pointer"
          >
            {index + 1 >= questions.length ? '看結果' : '下一題'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
