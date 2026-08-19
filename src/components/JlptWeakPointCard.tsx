import React from 'react';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { getStoredJlptRecords } from '../utils/jlptStorage';
import { getOwnJlptQuestions, ALL_N5_TOPICS_UI } from '../data/jlpt';

// JLPT 弱點分析：從作答紀錄找出最常錯的考點。
// 關鍵：不信任紀錄裡存的 topicId（隨機模式會存成合成的 'all'），改用每筆的
// questionId 反查題目的 topics.primary——這樣不論哪種練習模式都正確歸到真實
// 考點。純顯示、不作答；看到弱點後往下捲到題目列表點該考點的「開始練習」即可。
//
// 門檻 MIN_ATTEMPTS 沿用 nihongo-tiku 的判斷哲學：證據不足（答太少）時不判人
// 弱點，避免一兩題的雜訊被當成結論。

const MIN_ATTEMPTS = 3;

interface WeakPoint {
  topicId: string;
  name: string;
  total: number;
  wrong: number;
  rate: number; // 0–1 答錯率
}

export function JlptWeakPointCard() {
  const records = getStoredJlptRecords();

  const qById = new Map(getOwnJlptQuestions().map((q) => [q.id, q] as const));
  const nameById = new Map(ALL_N5_TOPICS_UI.map((t) => [t.id, t.name] as const));

  const agg = new Map<string, { total: number; wrong: number }>();
  let totalAnswered = 0;
  let totalCorrect = 0;

  for (const r of records) {
    const q = qById.get(r.questionId);
    if (!q) continue; // 舊紀錄指向已不存在的題目 → 略過，不污染統計
    const tid = q.topics.primary;
    const cur = agg.get(tid) || { total: 0, wrong: 0 };
    cur.total += 1;
    if (!r.isCorrect) cur.wrong += 1;
    agg.set(tid, cur);
    totalAnswered += 1;
    if (r.isCorrect) totalCorrect += 1;
  }

  const weakPoints: WeakPoint[] = [...agg.entries()]
    .map(([topicId, v]) => ({
      topicId,
      name: nameById.get(topicId) || topicId,
      total: v.total,
      wrong: v.wrong,
      rate: v.wrong / v.total,
    }))
    .filter((w) => w.total >= MIN_ATTEMPTS && w.wrong > 0)
    .sort((a, b) => b.rate - a.rate || b.wrong - a.wrong)
    .slice(0, 5);

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  if (totalAnswered === 0) {
    return (
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-[#00A86B]" />
          <h3 className="text-sm font-extrabold text-[#1E293B]">弱點分析</h3>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          開始練習後，這裡會依你的作答自動找出最常錯的考點，讓你知道該優先補哪裡。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00A86B]" />
          <h3 className="text-sm font-extrabold text-[#1E293B]">弱點分析</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <TrendingUp className="w-3.5 h-3.5" />
          已答 {totalAnswered} 題 · 正確率 {accuracy}%
        </div>
      </div>

      {weakPoints.length === 0 ? (
        <p className="text-xs text-[#64748B] leading-relaxed">
          目前還沒有明顯弱點——各考點答錯率都很低，繼續保持！（每個考點答滿 {MIN_ATTEMPTS} 題才會納入分析）
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[#64748B]">
            以下是你答錯率最高的考點，往下找到對應知識點點「開始練習」加強：
          </p>
          {weakPoints.map((w) => (
            <div key={w.topicId} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1E293B] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  {w.name}
                </span>
                <span className="text-[#64748B] shrink-0">
                  答錯 {w.wrong}/{w.total}（{Math.round(w.rate * 100)}%）
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full"
                  style={{ width: `${Math.round(w.rate * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
