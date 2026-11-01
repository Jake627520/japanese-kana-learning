import { EmptyState } from './EmptyState';
import React from 'react';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { getStoredJlptRecords } from '../utils/jlptStorage';
import { getOwnJlptQuestions, findJlptTopic } from '../data/jlpt';
import { useI18n, localize } from '../i18n';

const MIN_ATTEMPTS = 3;

interface WeakPoint {
  topicId: string;
  name: string;
  total: number;
  wrong: number;
  rate: number;
}

export function JlptWeakPointCard() {
  const { t, language } = useI18n();
  const records = getStoredJlptRecords();

  const qById = new Map(getOwnJlptQuestions().map((q) => [q.id, q] as const));

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
    .map(([topicId, v]) => {
      const topic = findJlptTopic(topicId);
      return {
        topicId,
        name: topic ? localize(topic.name, language) : topicId,
        total: v.total,
        wrong: v.wrong,
        rate: v.wrong / v.total,
      };
    })
    .filter((w) => w.total >= MIN_ATTEMPTS && w.wrong > 0)
    .sort((a, b) => b.rate - a.rate || b.wrong - a.wrong)
    .slice(0, 5);

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  if (totalAnswered === 0) {
    return (
      <div className="bg-[color:var(--paper-bg)] p-5 sm:p-6 rounded-3xl border border-[color:var(--paper-85)] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-[color:var(--moss-50)]" />
          <h3 className="text-sm font-extrabold text-[color:var(--ink-24)]">{t('jlpt.weakPoints')}</h3>
        </div>
        <p className="text-xs text-[color:var(--ink-50)] leading-relaxed">
          {t('jlpt.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--paper-bg)] p-5 sm:p-6 rounded-3xl border border-[color:var(--paper-85)] elev-2 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[color:var(--moss-50)]" />
          <h3 className="text-sm font-extrabold text-[color:var(--ink-24)]">{t('jlpt.weakPoints')}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[color:var(--ink-50)]">
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
          <p className="text-xs text-[color:var(--ink-50)]">
            {t('home.weakShadowing.desc')}
          </p>
          {weakPoints.map((w) => (
            <div key={w.topicId} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[color:var(--ink-24)] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--kincha-56)] shrink-0" />
                  {w.name}
                </span>
                <span className="text-[color:var(--ink-50)] shrink-0">
                  {w.wrong}/{w.total} ({Math.round(w.rate * 100)}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-[color:var(--paper-92)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[color:var(--kincha-56)] rounded-full"
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
