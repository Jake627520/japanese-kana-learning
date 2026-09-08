import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { getWrongQuestionIds } from '../utils/jlptStorage';

interface Props {
  onStart: () => void;
}

// 錯題重做入口：顯示目前待複習的錯題數，點擊開始只由這些題組成的一輪練習。
// 數量在每次題目列表重繪時重算（作答→返回列表就會刷新）；答對的題會自動從
// getWrongQuestionIds() 消失，所以這裡不需要自己維護清單。
export function JlptWrongRedoButton({ onStart }: Props) {
  const count = getWrongQuestionIds().length;

  if (count === 0) {
    return (
      <div className="bg-[#F4EEDE] p-4 sm:p-5 rounded-2xl border border-[#D9CDB2] shadow-xs flex items-center gap-2 text-xs text-[#6B6252]">
        <CheckCircle2 className="w-4 h-4 text-[#5C6B3D] shrink-0" />
        目前沒有待複習的錯題——答錯的題會自動收進這裡，重做答對後就移除。
      </div>
    );
  }

  return (
    <button
      onClick={onStart}
      className="w-full bg-[#F4EEDE] p-4 sm:p-5 rounded-2xl border border-[#D9CDB2] shadow-xs flex items-center justify-between gap-3 hover:border-[#5C6B3D] transition-all cursor-pointer text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F1E1DB] flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5 text-[#A6443A]" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-[#221F18]">重做錯題</div>
          <div className="text-xs text-[#6B6252]">把你答錯過的題重做一次，答對就從清單移除</div>
        </div>
      </div>
      <span className="px-3 py-1.5 rounded-full bg-[#A6443A] text-[#F1EFE0] text-xs font-extrabold shrink-0">
        {count} 題
      </span>
    </button>
  );
}
