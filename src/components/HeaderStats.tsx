import React from 'react';
import { UserProgress } from '../types';
import { Flame, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface HeaderStatsProps {
  progress: UserProgress;
  totalKana: number;
}

export function HeaderStats({ progress, totalKana }: HeaderStatsProps) {
  const masteredCount = progress.masteredKanaIds.length;
  const wrongCount = progress.wrongKanaIds.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#64748B]">連續學習</div>
          <div className="text-lg font-extrabold text-[#1E293B]">{progress.streakDays} 天</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E6F8F2] text-[#00A86B] flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#64748B]">精通假名</div>
          <div className="text-lg font-extrabold text-[#1E293B]">
            {masteredCount} <span className="text-xs font-normal text-[#94A3B8]">/ {totalKana}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#64748B]">弱點錯題</div>
          <div className="text-lg font-extrabold text-[#1E293B]">{wrongCount} 個</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#64748B]">學習進度</div>
          <div className="text-lg font-extrabold text-[#1E293B]">
            {Math.round((masteredCount / (totalKana || 1)) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
