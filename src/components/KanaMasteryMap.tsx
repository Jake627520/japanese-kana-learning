import React from 'react';
import { NavigationTab } from '../types';
import {
  HIRAGANA_DATA,
  KATAKANA_DATA,
  DAKUTEN_DATA,
  HANDAKUTEN_DATA,
  YOUON_DATA,
} from '../data/kanaData';
import { Check, Map } from 'lucide-react';
import { useI18n } from '../i18n';

interface KanaMasteryMapProps {
  masteredIds: string[];
  onNavigate: (tab: NavigationTab) => void;
}

const RADIUS = 29;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function KanaMasteryMap({ masteredIds, onNavigate }: KanaMasteryMapProps) {
  const { t } = useI18n();

  const stagesDef = [
    { key: 'hiragana', label: t('common.hiragana'), data: HIRAGANA_DATA },
    { key: 'katakana', label: t('common.katakana'), data: KATAKANA_DATA },
    { key: 'dakuten', label: t('common.dakuten'), data: DAKUTEN_DATA },
    { key: 'handakuten', label: t('common.handakuten'), data: HANDAKUTEN_DATA },
    { key: 'youon', label: t('common.youon'), data: YOUON_DATA },
  ];

  const mastered = new Set(masteredIds);
  const stages = stagesDef.map((s) => {
    const total = s.data.length;
    const done = s.data.filter((k) => mastered.has(k.id)).length;
    return { label: s.label, total, done, pct: total > 0 ? done / total : 0 };
  });
  const grandTotal = stages.reduce((n, s) => n + s.total, 0);
  const grandDone = stages.reduce((n, s) => n + s.done, 0);
  const grandPct = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0;

  const allKana = stagesDef.flatMap((s) => s.data);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] elev-2 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#00A86B]" />
          <h3 className="text-sm font-extrabold text-[#1E293B]">{t('home.masteryMap.title')}</h3>
        </div>
        <span className="text-xs text-[#64748B]">
          {grandDone}/{grandTotal} ({grandPct}%)
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {stages.map((s, i) => {
          const complete = s.total > 0 && s.done === s.total;
          return (
            <button
              key={s.label}
              onClick={() => onNavigate('grid')}
              className="flex flex-col items-center gap-2 group cursor-pointer"
              title={`${s.label} ${s.done}/${s.total}`}
            >
              <div className="relative w-14 h-14 sm:w-[68px] sm:h-[68px] transition-transform group-hover:scale-105">
                <svg viewBox="0 0 68 68" className="w-full h-full -rotate-90">
                  <circle cx="34" cy="34" r={RADIUS} fill="none" stroke="#F1F5F9" strokeWidth="7" />
                  <circle
                    className="ring-draw"
                    cx="34"
                    cy="34"
                    r={RADIUS}
                    fill="none"
                    stroke="#00A86B"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    style={{
                      ['--ring-len' as string]: `${CIRCUMFERENCE}`,
                      ['--ring-off' as string]: `${CIRCUMFERENCE * (1 - s.pct)}`,
                      ['--stagger' as string]: `${i * 90}ms`,
                      strokeDashoffset: CIRCUMFERENCE * (1 - s.pct),
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {complete ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00A86B]" />
                  ) : (
                    <span className="text-[11px] sm:text-[13px] font-extrabold text-[#1E293B]">
                      {Math.round(s.pct * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center leading-tight">
                <div className="text-[11px] sm:text-xs font-bold text-[#1E293B]">{s.label}</div>
                <div className="text-[10px] text-[#64748B]">
                  {s.done}/{s.total}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 每一點代表一個假名 */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] font-bold text-[#64748B]">{grandTotal} {t('common.countUnit')}</span>
          <span className="text-[11px] text-[#94A3B8]">{t('grid.legendTitle')}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {allKana.map((k) => (
            <span
              key={k.id}
              title={`${k.kana} ${mastered.has(k.id) ? `(${t('grid.statusMastered')})` : `(${t('grid.statusLearning')})`}`}
              className={`w-[7px] h-[7px] rounded-[2px] transition-transform hover:scale-[1.8] ${
                mastered.has(k.id) ? 'bg-[#00A86B]' : 'bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
        {t('home.masteryMap.viewGrid')}
      </p>
    </div>
  );
}
