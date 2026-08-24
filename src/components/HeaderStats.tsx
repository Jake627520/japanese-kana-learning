import React from 'react';
import { UserProgress } from '../types';
import { Flame, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface HeaderStatsProps {
  progress: UserProgress;
  totalKana: number;
}

// 每張卡下方多一條進度條：改版前這裡只有數字，看不出「離目標多遠」。
// 條的分母都取自真實資料，不是裝飾——連續學習以 7 天為一輪，
// 弱點錯題以佔全部假名的比例呈現。
export function HeaderStats({ progress, totalKana }: HeaderStatsProps) {
  const masteredCount = progress.masteredKanaIds.length;
  const wrongCount = progress.wrongKanaIds.length;
  const total = totalKana || 1;
  const masteredPct = Math.round((masteredCount / total) * 100);
  const streakPct = Math.min(100, Math.round((progress.streakDays / 7) * 100));
  const wrongPct = Math.min(100, Math.round((wrongCount / total) * 100));

  const cards = [
    {
      key: 'streak',
      label: '連續學習',
      value: String(progress.streakDays),
      unit: ' 天',
      tint: 'bg-orange-50',
      fg: 'text-orange-500',
      bar: 'bg-orange-500',
      pct: streakPct,
      icon: <Flame className="w-5 h-5 fill-current" />,
      title: `連續 ${progress.streakDays} 天，一輪以 7 天計`,
    },
    {
      key: 'mastered',
      label: '精通假名',
      value: String(masteredCount),
      unit: ` / ${totalKana}`,
      tint: 'bg-[#E6F8F2]',
      fg: 'text-[#00A86B]',
      bar: 'bg-[#00A86B]',
      pct: masteredPct,
      icon: <CheckCircle className="w-5 h-5" />,
      title: `已精通 ${masteredCount} 個，共 ${totalKana} 個`,
    },
    {
      key: 'wrong',
      label: '弱點錯題',
      value: String(wrongCount),
      unit: ' 個',
      tint: 'bg-red-50',
      fg: 'text-red-500',
      bar: 'bg-red-500',
      pct: wrongPct,
      icon: <AlertTriangle className="w-5 h-5" />,
      title: `${wrongCount} 個假名有錯題記錄，佔全部的 ${wrongPct}%`,
    },
    {
      key: 'progress',
      label: '學習進度',
      value: String(masteredPct),
      unit: ' %',
      tint: 'bg-blue-50',
      fg: 'text-blue-500',
      bar: 'bg-blue-500',
      pct: masteredPct,
      icon: <BookOpen className="w-5 h-5" />,
      title: `整體進度 ${masteredPct}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <div
          key={c.key}
          title={c.title}
          className="bg-white p-4 rounded-2xl border border-[#E2E8F0] elev-1 card-lift rise-in flex flex-col gap-3"
          style={{ ['--stagger' as string]: `${i * 40}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.tint} ${c.fg} flex items-center justify-center shrink-0`}>
              {c.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-[#64748B]">{c.label}</div>
              <div className="text-lg font-extrabold text-[#1E293B] leading-tight">
                {c.value}
                <span className="text-xs font-normal text-[#94A3B8]">{c.unit}</span>
              </div>
            </div>
          </div>
          <div className="h-1 rounded-full bg-[#F1F5F9] overflow-hidden">
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
