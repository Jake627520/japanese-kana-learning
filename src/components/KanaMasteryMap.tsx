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

// 假名掌握地圖：把 208 假名的學習拆成五個階段（平清→片清→濁→半濁→拗），
// 隨 masteredKanaIds 點亮。這是「進度地圖」不是「關卡」——每個階段的圓環只
// 反映掌握比例，點任一階段都直接進五十音圖表，不鎖、不強制先過前一關。
// （呼應使用者的決定：A 已會假名、B 準備 N4，都不該被門檻擋住。）

interface KanaMasteryMapProps {
  masteredIds: string[];
  onNavigate: (tab: NavigationTab) => void;
}

const STAGES = [
  { label: '平假名', data: HIRAGANA_DATA },
  { label: '片假名', data: KATAKANA_DATA },
  { label: '濁音', data: DAKUTEN_DATA },
  { label: '半濁音', data: HANDAKUTEN_DATA },
  { label: '拗音', data: YOUON_DATA },
];

export function KanaMasteryMap({ masteredIds, onNavigate }: KanaMasteryMapProps) {
  const mastered = new Set(masteredIds);
  const stages = STAGES.map((s) => {
    const total = s.data.length;
    const done = s.data.filter((k) => mastered.has(k.id)).length;
    return { label: s.label, total, done, pct: total > 0 ? done / total : 0 };
  });
  const grandTotal = stages.reduce((n, s) => n + s.total, 0);
  const grandDone = stages.reduce((n, s) => n + s.done, 0);
  const grandPct = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#00A86B]" />
          <h3 className="text-sm font-extrabold text-[#1E293B]">假名掌握地圖</h3>
        </div>
        <span className="text-xs text-[#64748B]">
          整體 {grandDone}/{grandTotal}（{grandPct}%）
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {stages.map((s) => {
          const complete = s.total > 0 && s.done === s.total;
          const deg = Math.round(s.pct * 360);
          return (
            <button
              key={s.label}
              onClick={() => onNavigate('grid')}
              className="flex flex-col items-center gap-2 group cursor-pointer"
              title="前往五十音圖表學習"
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ background: `conic-gradient(#00A86B ${deg}deg, #F1F5F9 ${deg}deg)` }}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center">
                  {complete ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00A86B]" />
                  ) : (
                    <span className="text-[10px] sm:text-xs font-extrabold text-[#1E293B]">
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

      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
        點任一階段前往五十音圖表學習。這是進度地圖，不是關卡——任何階段都能直接進入，不用先通過前一關。
      </p>
    </div>
  );
}
