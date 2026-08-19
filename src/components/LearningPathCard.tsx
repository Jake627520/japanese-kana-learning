import React from 'react';
import { NavigationTab } from '../types';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

interface LearningPathCardProps {
  onNavigate: (tab: NavigationTab) => void;
}

// 首頁的學習路徑卡：兩條路都常開，不設門檻、不假設使用者程度。
// 剛入門的走「打好假名基礎」，已有基礎的直接「挑戰 JLPT 題庫」。
// 刻意不顯示假名掌握度當作解鎖條件——使用者可能已會五十音或在準備 N4，
// 強制先測假名是錯的假設。
export function LearningPathCard({ onNavigate }: LearningPathCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
      <h3 className="text-sm font-extrabold text-[#1E293B] mb-1">選擇你的學習路徑</h3>
      <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
        剛開始就從假名打基礎；已經會五十音的話，直接進 JLPT 題庫練習。兩邊隨時可進，不用先通過任何測驗。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('grid')}
          className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#00A86B] hover:bg-[#F0FDF7] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00A86B]/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#00A86B]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1E293B]">打好假名基礎</div>
              <div className="text-[11px] text-[#64748B]">五十音圖表・清濁半濁拗音</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00A86B] transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('jlpt')}
          className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#00A86B] hover:bg-[#F0FDF7] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00A86B]/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#00A86B]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1E293B]">挑戰 JLPT 題庫</div>
              <div className="text-[11px] text-[#64748B]">N5 原創練習・文字語彙文法助詞</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00A86B] transition-colors" />
        </button>
      </div>
    </div>
  );
}
