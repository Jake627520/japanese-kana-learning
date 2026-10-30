import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { getWrongQuestionIds } from '../utils/jlptStorage';
import { useI18n } from '../i18n';

interface Props {
  onStart: () => void;
}

// 錯題重做入口：顯示目前待複習的錯題數，點擊開始只由這些題組成的一輪練習。
// 數量在每次題目列表重繪時重算（作答→返回列表就會刷新）；答對的題會自動從
// getWrongQuestionIds() 消失，所以這裡不需要自己維護清單。
export function JlptWrongRedoButton({ onStart }: Props) {
  const { t } = useI18n();
  const count = getWrongQuestionIds().length;

  if (count === 0) {
    return (
      <div className="bg-[color:var(--paper-bg)] p-4 sm:p-5 rounded-2xl border border-[color:var(--paper-85)] shadow-xs flex items-center gap-2 text-xs text-[color:var(--ink-50)]">
        <CheckCircle2 className="w-4 h-4 text-[color:var(--moss-50)] shrink-0" />
        {t('jlpt.wrongRedoEmpty')}
      </div>
    );
  }

  return (
    <button
      onClick={onStart}
      className="w-full bg-[color:var(--paper-bg)] p-4 sm:p-5 rounded-2xl border border-[color:var(--paper-85)] shadow-xs flex items-center justify-between gap-3 hover:border-[color:var(--moss-50)] transition-all cursor-pointer text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[color:var(--shu-92)] flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5 text-[color:var(--shu-52a)]" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-[color:var(--ink-24)]">{t('jlpt.wrongRedoTitle')}</div>
          <div className="text-xs text-[color:var(--ink-50)]">{t('jlpt.wrongRedoDesc')}</div>
        </div>
      </div>
      <span className="px-3 py-1.5 rounded-full bg-[color:var(--shu-52a)] text-[color:var(--paper-95)] text-xs font-extrabold shrink-0">
        {t('jlpt.questionCount', { count })}
      </span>
    </button>
  );
}
