import React from 'react';
import { KanaItem, NavigationTab, UserProgress } from '../types';
import { getDueReviewItems } from '../utils/storage';
import { getKanaStatus } from '../utils/kanaStatus';
import { getShadowingProgress } from '../lib/shadowingProgress';
import {
  AlertTriangle, RefreshCw, Headphones, BookOpen, ArrowRight, Check, CalendarCheck,
} from 'lucide-react';

// 今日學習：首頁唯一的決策點。
//
// 改版前首頁有 5 個並列的行動點（Hero 兩顆按鈕 ＋ 三張同權重的行動卡），
// 使用者一進來得自己決定做哪個——而他其實不知道哪個該先做。
//
// 這張卡不是關卡，是建議：三張既有的行動卡都還在，側邊欄也全部常開，
// 隨時可以繞過它。呼應先前定下的「不設門檻」——使用者可能已會五十音、
// 也可能在準備 N4，強制照順序走是錯的假設。
//
// 兩個刻意的設計：
//
// 1. 步驟的「完成」是推導出來的，不存新資料——數字歸零就是做完了。
//    所以「學新假名」不當成有進度的步驟（它要到 208 個全學完才會歸零，
//    會變成一個永遠做不完的待辦），而是弱點與到期都清空後才出現的下一步。
//
// 2. 到期數要扣掉弱點，避免同一個假名被算兩次、做兩次。去重的優先序
//    沿用 kanaStatus 的 weak > due——這樣首頁和五十音圖表講的是同一個
//    故事，不會首頁說「到期 12」、圖表卻把同一個假名標成弱點。

interface TodayPlanCardProps {
  progress: UserProgress;
  allKana: KanaItem[];
  onNavigate: (tab: NavigationTab) => void;
}

interface PlanStep {
  key: string;
  label: string;
  detail: string;
  icon: React.ElementType;
  tint: string;
  fg: string;
  cta: string;
  run: () => void;
}

export function TodayPlanCard({ progress, allKana, onNavigate }: TodayPlanCardProps) {
  const weakCount = progress.wrongKanaIds.length;

  // 扣掉弱點後才是「純粹因為 SRS 排程而到期」的部分
  const dueCount = getDueReviewItems(allKana, progress).filter(
    (k) => getKanaStatus(progress, k.id) === 'due'
  ).length;

  const newCount = allKana.filter((k) => getKanaStatus(progress, k.id) === 'new').length;

  const shadowing = getShadowingProgress();
  const shadowingDone = shadowing.todayIds.filter(
    (id) => (shadowing.practiceCount[id] ?? 0) > 0
  ).length;
  const shadowingTotal = shadowing.todayIds.length || 3;

  // 開啟複習中心時要停在哪一頁。沿用跟讀那邊已經在用的 sessionStorage 做法，
  // 免得為了一個一次性的意圖去改 onNavigate 的簽名。
  const goReview = (tab: 'due' | 'wrong') => {
    if (typeof window !== 'undefined') sessionStorage.setItem('review-open-tab', tab);
    onNavigate('review');
  };

  const goShadowing = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('shadowing-open-today', '1');
    onNavigate('shadowing');
  };

  const steps: PlanStep[] = [];

  // 順序：弱點 → 到期 → 學新假名 → 跟讀。弱點放第一個有兩個理由——它是「確實還沒學會」
  // 最強的訊號，而且趁精神好先處理難的；同時這也和五十音圖表的優先序一致。
  if (weakCount > 0) {
    steps.push({
      key: 'weak', label: '弱點加強', detail: `${weakCount} 個假名答錯過`,
      icon: AlertTriangle, tint: 'bg-red-50', fg: 'text-red-500',
      cta: `加強 ${weakCount} 個弱點`, run: () => goReview('wrong'),
    });
  }
  if (dueCount > 0) {
    steps.push({
      key: 'due', label: '到期複習', detail: `SRS 排了 ${dueCount} 個`,
      icon: RefreshCw, tint: 'bg-amber-50', fg: 'text-amber-500',
      cta: `複習 ${dueCount} 個假名`, run: () => goReview('due'),
    });
  }
  // 沒有複習債的時候，下一步才是往前推進
  if (weakCount === 0 && dueCount === 0 && newCount > 0) {
    steps.push({
      key: 'new', label: '學新假名', detail: `還有 ${newCount} 個沒學過`,
      icon: BookOpen, tint: 'bg-blue-50', fg: 'text-blue-500',
      cta: '開始學新假名', run: () => onNavigate('grid'),
    });
  }
  // 跟讀永遠排最後。它是每天的補充，不是核心迴圈——而且對全新的使用者來說，
  // 假名都還沒學就先跟讀整句是反的。
  if (shadowingDone < shadowingTotal) {
    steps.push({
      key: 'shadowing', label: '今日跟讀',
      detail: `${shadowingDone} / ${shadowingTotal} 句`,
      icon: Headphones, tint: 'bg-[#E6F8F2]', fg: 'text-[#00A86B]',
      cta: '開始今日跟讀', run: goShadowing,
    });
  }

  const primary = steps[0];
  const rest = steps.slice(1);

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-2 overflow-hidden rise-in">
      <div
        aria-hidden
        className={`h-1 ${primary ? 'bg-gradient-to-r from-[#00A86B] to-[#34D399]' : 'bg-[#00A86B]'}`}
      />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#00A86B]" />
            <h3 className="text-sm font-extrabold text-[#1E293B]">今日學習</h3>
          </div>
          <span className="text-[11px] text-[#94A3B8]">建議順序，不是關卡——可以直接跳過</span>
        </div>

        {primary ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl ${primary.tint} ${primary.fg} flex items-center justify-center shrink-0`}
              >
                <primary.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-[#1E293B] leading-tight">
                  {primary.label}
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">{primary.detail}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={primary.run}
              className="w-full py-3.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-sm rounded-2xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
            >
              {primary.cta}
              <ArrowRight className="w-4 h-4" />
            </button>

            {rest.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-[#94A3B8]">接下來</div>
                {rest.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={s.run}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#F1F5F9] bg-[#FAFBFB] hover:bg-white hover:border-[#00A86B] transition-all cursor-pointer text-left"
                  >
                    <span
                      className={`w-7 h-7 rounded-lg ${s.tint} ${s.fg} flex items-center justify-center shrink-0`}
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#1E293B]">{s.label}</span>
                    <span className="text-[11px] text-[#64748B] truncate">{s.detail}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1] ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          // 全部清空：不留一顆按不下去的按鈕，直接給下一步
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F2] text-[#00A86B] flex items-center justify-center">
              <Check className="w-6 h-6" strokeWidth={3} />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#1E293B]">今天的進度都完成了</div>
              <div className="text-xs text-[#64748B] mt-1 leading-relaxed">
                沒有到期複習、沒有弱點，跟讀也做完了。下一批複習會在排程到期時自動出現。
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('jlpt')}
              className="px-5 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] hover:border-[#00A86B] hover:bg-white text-[#1E293B] font-bold text-xs rounded-xl btn-lift cursor-pointer flex items-center gap-2"
            >
              試試 JLPT 題庫
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
