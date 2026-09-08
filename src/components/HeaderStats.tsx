import React from 'react';
import { UserProgress } from '../types';
import { Flame, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { useI18n } from '../i18n';

interface HeaderStatsProps {
  progress: UserProgress;
  totalKana: number;
}

export function HeaderStats({ progress, totalKana }: HeaderStatsProps) {
  const { t } = useI18n();
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
      value: String(progress.streakDays),
      unit: ` ${t('header.days')}`,
      tint: 'bg-orange-50',
      fg: 'text-orange-500',
      bar: 'bg-orange-500',
      pct: streakPct,
      icon: <Flame className="w-5 h-5 fill-current" />,
      title: `${t('header.streak')} ${progress.streakDays} ${t('header.days')}`,
    },
    {
      key: 'mastered',
      label: t('header.mastered'),
      value: String(masteredCount),
      unit: ` / ${totalKana}`,
      tint: 'bg-[#E6EAD5]',
      fg: 'text-[#5C6B3D]',
      bar: 'bg-[#5C6B3D]',
      pct: masteredPct,
      icon: <CheckCircle className="w-5 h-5" />,
      title: `${t('header.mastered')} ${masteredCount} / ${totalKana}`,
    },
    {
      key: 'wrong',
      label: t('header.weak'),
      value: String(wrongCount),
      unit: ` ${t('common.countUnit')}`,
      tint: 'bg-[#EFDBD5]',
      fg: 'text-[#B0554A]',
      bar: 'bg-red-500',
      pct: wrongPct,
      icon: <AlertTriangle className="w-5 h-5" />,
      title: `${t('header.weak')} ${wrongCount}`,
    },
    {
      key: 'progress',
      label: t('home.todayPlan.learningProgress'),
      value: String(masteredPct),
      unit: ' %',
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
          className="bg-[#F4EEDE] p-4 rounded-2xl border border-[#D9CDB2] elev-1 card-lift rise-in flex flex-col gap-3"
          style={{ ['--stagger' as string]: `${i * 40}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.tint} ${c.fg} flex items-center justify-center shrink-0`}>
              {c.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-[#6B6252]">{c.label}</div>
              <div className="text-lg font-extrabold text-[#221F18] leading-tight">
                {c.value}
                <span className="text-xs font-normal text-[#8F8674]">{c.unit}</span>
              </div>
            </div>
          </div>
          <div className="h-1 rounded-full bg-[#ECE4D0] overflow-hidden">
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
