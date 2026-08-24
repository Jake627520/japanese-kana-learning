import React from 'react';
import { UserProgress, KanaItem, NavigationTab } from '../types';
import { getDueReviewItems } from '../utils/storage';
import { HeaderStats } from './HeaderStats';
import { DataBackupCard } from './DataBackupCard';
import { LearningPathCard } from './LearningPathCard';
import { KanaMasteryMap } from './KanaMasteryMap';
import { SectionHeading } from './SectionHeading';
import { TodayPlanCard } from './TodayPlanCard';
import { WeakKanaShadowingCard } from './WeakKanaShadowingCard';
import { getShadowingProgress, getTodaySentences } from '../lib/shadowingProgress';
import { ArrowRight, RefreshCw, Sparkles, Headphones } from 'lucide-react';

interface HomeDashboardProps {
  progress: UserProgress;
  allKana: KanaItem[];
  onNavigate: (tab: NavigationTab) => void;
  onStartStudyKana: (kana: KanaItem) => void;
}

export function HomeDashboard({
  progress,
  allKana,
  onNavigate,
  onStartStudyKana,
}: HomeDashboardProps) {
  const dueItems = getDueReviewItems(allKana, progress);
  const wrongKanaList = allKana.filter((k) => progress.wrongKanaIds.includes(k.id));
  const masteredKanaList = allKana.filter((k) => progress.masteredKanaIds.includes(k.id));

  const shadowingProg = getShadowingProgress();
  const todayShadowingSentences = getTodaySentences();
  const shadowingDoneCount = shadowingProg.todayIds.filter(
    (id) => (shadowingProg.practiceCount[id] ?? 0) > 0
  ).length;

  const handleStartTodayShadowing = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shadowing-open-today', '1');
    }
    onNavigate('shadowing');
  };

  return (
    <div className="space-y-7">
      {/* Top Banner */}
      <div className="bg-[linear-gradient(135deg,#00A86B_0%,#009B63_55%,#007E51_100%)] rounded-3xl p-6 sm:p-8 text-white elev-3 rise-in relative overflow-hidden">
        {/* 假名水印：讓大面積綠色有厚度，而不是一塊平色。aria-hidden 因為它是裝飾。 */}
        <div
          aria-hidden
          className="absolute top-0 -right-10 opacity-[0.08] text-[110px] sm:text-[150px] font-extrabold leading-[0.9] tracking-wide whitespace-nowrap select-none text-right pointer-events-none [mask-image:linear-gradient(to_left,black_25%,transparent_75%)]"
        >
          あかさたな
          <br />
          アカサタナ
        </div>
        {/* 頂緣高光 */}
        <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            日語五十音學習系統
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            掌握 208 個假名，完整打下日語基礎
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            支援清音・濁音・半濁音・拗音（平假名＋片假名），結合發音示範、例詞例句與 SRS 間隔重複記憶法，快速告別死記硬背。
          </p>

        </div>
      </div>

      {/* 今日學習：首頁唯一的決策點。放在 Hero 正下方，
          讓「我今天要做什麼」在第一屏就有答案。 */}
      <TodayPlanCard progress={progress} allKana={allKana} onNavigate={onNavigate} />

      {/* 今日概況 */}
      <div className="space-y-3">
        <SectionHeading>今日概況</SectionHeading>
        <HeaderStats progress={progress} totalKana={allKana.length} />
        <KanaMasteryMap masteredIds={progress.masteredKanaIds} onNavigate={onNavigate} />
      </div>

      {/* 針對你的建議 */}
      <div className="space-y-3">
        <SectionHeading>針對你的建議</SectionHeading>
        <WeakKanaShadowingCard wrongKanaIds={progress.wrongKanaIds} onNavigate={onNavigate} />
        <LearningPathCard onNavigate={onNavigate} />
      </div>

      {/* 今天可以做的事 */}
      <SectionHeading>其他練習</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today Shadowing 3 Sentences Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift overflow-hidden flex flex-col">
          <div aria-hidden className="h-1 bg-gradient-to-r from-[#00A86B] to-[#34D399]" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                口說跟讀
              </span>
              <span className="text-xs font-bold text-[#64748B]">今日進度：{shadowingDoneCount} / 3</span>
            </div>
            <h3 className="text-lg font-display font-bold text-[#1E293B]">今日跟讀 · 3 句</h3>
            <p className="text-xs text-[#64748B]">
              每日精選 3 句實用語音，5 步跟讀法搭配自我比對錄音。
            </p>
          </div>

          <div className="space-y-1.5 my-1">
            {todayShadowingSentences.map((s) => {
              const isDone = (shadowingProg.practiceCount[s.id] ?? 0) > 0;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-2 text-xs text-[#334155] bg-[#FAFBFB] px-3 py-2 rounded-xl border border-[#F1F5F9]"
                >
                  <span className={`font-extrabold ${isDone ? 'text-[#00A86B]' : 'text-slate-400'}`}>
                    {isDone ? '✓' : '•'}
                  </span>
                  <span className="truncate font-medium">{s.japanese}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleStartTodayShadowing}
            className="w-full py-3 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-xs rounded-xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
          >
            <Headphones className="w-4 h-4" />
            開始今日跟讀
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          </div>
        </div>

        {/* Due Review Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift overflow-hidden flex flex-col">
          <div aria-hidden className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full">
                SRS 今日排程
              </span>
              <span className="text-xs font-bold text-[#64748B]">到期數量：{dueItems.length}</span>
            </div>
            <h3 className="text-lg font-display font-bold text-[#1E293B]">今日到期複習</h3>
            <p className="text-xs text-[#64748B]">
              {dueItems.length > 0
                ? `系統已安排 ${dueItems.length} 個需要及時複習的假名，及時鞏固長期記憶！`
                : '目前沒有到期的複習項目，太棒了！所有進度均按時完成。'}
            </p>
          </div>

          {dueItems.length > 0 && (
            <div className="flex flex-wrap gap-2 my-1">
              {dueItems.slice(0, 6).map((k) => (
                <span
                  key={k.id}
                  onClick={() => onStartStudyKana(k)}
                  className="w-10 h-10 bg-[#FAFBFB] border border-[#E2E8F0] rounded-xl flex items-center justify-center font-extrabold text-base text-[#1E293B] hover:border-[#00A86B] cursor-pointer"
                >
                  {k.kana}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigate('review')}
            className="w-full py-3 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-[#00A86B]" />
            進入複習中心
            <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
          </button>
          </div>
        </div>

        {/* Weak Kana Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift overflow-hidden flex flex-col">
          <div aria-hidden className="h-1 bg-gradient-to-r from-red-500 to-red-300" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                弱點加強
              </span>
              <span className="text-xs font-bold text-[#64748B]">錯題記錄：{wrongKanaList.length}</span>
            </div>
            <h3 className="text-lg font-display font-bold text-[#1E293B]">弱點錯題庫</h3>
            <p className="text-xs text-[#64748B]">
              {wrongKanaList.length > 0
                ? `積累了 ${wrongKanaList.length} 個在測驗中出錯的假名，建議進行專屬微測驗。`
                : '目前沒有任何錯題記錄，表現完美！'}
            </p>
          </div>

          {wrongKanaList.length > 0 && (
            <div className="flex flex-wrap gap-2 my-1">
              {wrongKanaList.slice(0, 6).map((k) => (
                <span
                  key={k.id}
                  onClick={() => onStartStudyKana(k)}
                  className="w-10 h-10 bg-[#FAFBFB] border border-red-200 rounded-xl flex items-center justify-center font-extrabold text-base text-red-600 hover:border-red-400 cursor-pointer"
                >
                  {k.kana}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigate('review')}
            className="w-full py-3 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] hover:border-red-400 text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            查看弱點並加強
            <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
          </button>
          </div>
        </div>
      </div>

      {/* 資料與備份 */}
      <div className="space-y-3">
        <SectionHeading>資料與備份</SectionHeading>
        <DataBackupCard />
      </div>
    </div>
  );
}
