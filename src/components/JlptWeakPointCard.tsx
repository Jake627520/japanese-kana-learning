import { EmptyState } from './EmptyState';
import React from 'react';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { getStoredJlptRecords } from '../utils/jlptStorage';
import { getOwnJlptQuestions, ALL_N5_TOPICS_UI } from '../data/jlpt';
import { useI18n } from '../i18n';

const MIN_ATTEMPTS = 3;

interface WeakPoint {
  topicId: string;
  name: string;
  total: number;
  wrong: number;
  rate: number;
}

export function JlptWeakPointCard() {
  const { t } = useI18n();
  const records = getStoredJlptRecords();

  const qById = new Map(getOwnJlptQuestions().map((q) => [q.id, q] as const));
  const nameById = new Map(ALL_N5_TOPICS_UI.map((t) => [t.id, t.name] as const));

  const agg = new Map<string, { total: number; wrong: number }>();
  let totalAnswered = 0;
  let totalCorrect = 0;

  for (const r of records) {
    const q = qById.get(r.questionId);
    if (!q) continue;
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
      <div className="bg-[#F4EEDE] p-5 sm:p-6 rounded-3xl border border-[#D9CDB2] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-[#5C6B3D]" />
          <h3 className="text-sm font-extrabold text-[#221F18]">{t('jlpt.weakPoints')}</h3>
        </div>
        <p className="text-xs text-[#6B6252] leading-relaxed">
          {t('jlpt.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F4EEDE] p-5 sm:p-6 rounded-3xl border border-[#D9CDB2] elev-2 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#5C6B3D]" />
          <h3 className="text-sm font-extrabold text-[#221F18]">{t('jlpt.weakPoints')}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6B6252]">
          <TrendingUp className="w-3.5 h-3.5" />
          {t('quiz.accuracy')}: {accuracy}% ({totalAnswered})
        </div>
      </div>

      {weakPoints.length === 0 ? (
        <EmptyState
          bare
          art="chart"
          title={t('review.noWeakTitle')}
          body={t('review.noWeakDesc')}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[#6B6252]">
            {t('home.weakShadowing.desc')}
          </p>
          {weakPoints.map((w) => (
            <div key={w.topicId} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#221F18] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#996A2C] shrink-0" />
                  {w.name}
                </span>
                <span className="text-[#6B6252] shrink-0">
                  {w.wrong}/{w.total} ({Math.round(w.rate * 100)}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#ECE4D0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#996A2C] rounded-full"
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
