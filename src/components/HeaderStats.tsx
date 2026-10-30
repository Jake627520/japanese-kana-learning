import React from 'react';
import { UserProgress } from '../types';
import { Flame, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { useI18n } from '../i18n';

interface HeaderStatsProps {
  progress: UserProgress;
  totalKana: number;
}

export function HeaderStats({ progress, totalKana }: HeaderStatsProps) {
  const { t, tAroundCount } = useI18n();
  const masteredCount = progress.masteredKanaIds.length;
  const wrongCount = progress.wrongKanaIds.length;
  const total = totalKana || 1;
  const masteredPct = Math.round((masteredCount / total) * 100);
  const streakPct = Math.min(100, Math.round((progress.streakDays / 7) * 100));
  const wrongPct = Math.min(100, Math.round((wrongCount / total) * 100));

  const cards = [
    {
      key: 'streak',
      label: t('header.streak'),
      value: progress.streakDays,
      around: tAroundCount('header.streakDays', progress.streakDays),
      tint: 'bg-orange-50',
      fg: 'text-orange-500',
      bar: 'bg-orange-500',
      pct: streakPct,
      icon: <Flame className="w-5 h-5 fill-current" />,
      title: `${t('header.streak')} ${t('header.streakDays', { count: progress.streakDays })}`,
    },
    {
      key: 'mastered',
      label: t('header.mastered'),
      value: masteredCount,
      around: ['', ` / ${totalKana}`],
      tint: 'bg-[color:var(--moss-93)]',
      fg: 'text-[color:var(--moss-50)]',
      bar: 'bg-[color:var(--moss-50)]',
      pct: masteredPct,
      icon: <CheckCircle className="w-5 h-5" />,
      title: `${t('header.mastered')} ${masteredCount} / ${totalKana}`,
    },
    {
      key: 'wrong',
      label: t('header.weak'),
      value: wrongCount,
      around: tAroundCount('common.kanaCount', wrongCount),
      tint: 'bg-[color:var(--shu-91)]',
      fg: 'text-[color:var(--shu-56)]',
      bar: 'bg-red-500',
      pct: wrongPct,
      icon: <AlertTriangle className="w-5 h-5" />,
      title: `${t('header.weak')} ${wrongCount}`,
    },
    {
      key: 'progress',
      label: t('home.todayPlan.learningProgress'),
      value: masteredPct,
      around: ['', ' %'],
      tint: 'bg-blue-50',
      fg: 'text-blue-500',
      bar: 'bg-blue-500',
      pct: masteredPct,
      icon: <BookOpen className="w-5 h-5" />,
      title: `${t('home.todayPlan.learningProgress')} ${masteredPct}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <div
          key={c.key}
          title={c.title}
          className="bg-[color:var(--paper-bg)] p-4 rounded-2xl border border-[color:var(--paper-85)] elev-1 card-lift rise-in flex flex-col gap-3"
          style={{ ['--stagger' as string]: `${i * 40}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.tint} ${c.fg} flex items-center justify-center shrink-0`}>
              {c.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-[color:var(--ink-50)]">{c.label}</div>
              <div className="text-lg font-extrabold text-[color:var(--ink-24)] leading-tight">
                {c.around[0] && <span className="text-xs font-normal text-[color:var(--ink-62)]">{c.around[0]}</span>}
                {c.value}
                <span className="text-xs font-normal text-[color:var(--ink-62)]">{c.around[1]}</span>
              </div>
            </div>
          </div>
          <div className="h-1 rounded-full bg-[color:var(--paper-92)] overflow-hidden">
            <div
              className={`h-full rounded-full ${c.bar} transition-[width] duration-700 ease-out`}
              style={{ width: `${c.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
