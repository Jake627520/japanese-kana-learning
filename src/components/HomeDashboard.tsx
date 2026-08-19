import React from 'react';
import { UserProgress, KanaItem, NavigationTab } from '../types';
import { getDueReviewItems } from '../utils/storage';
import { HeaderStats } from './HeaderStats';
import { DataBackupCard } from './DataBackupCard';
import { ArrowRight, Play, BookOpen, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            日語五十音學習系統
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            掌握 208 個假名，完整打下日語基礎
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            支援清音・濁音・半濁音・拗音（平假名＋片假名），結合發音示範、例詞例句與 SRS 間隔重複記憶法，快速告別死記硬背。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('grid')}
              className="px-5 py-2.5 bg-white text-[#00A86B] font-extrabold text-xs sm:text-sm rounded-xl hover:bg-slate-50 transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              開始五十音圖表
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="px-5 py-2.5 bg-white/10 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-white/20 transition-all border border-white/20 cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              快速綜合測驗
            </button>
          </div>
        </div>
      </div>

      {/* Header Stats */}
      <HeaderStats progress={progress} totalKana={allKana.length} />

      {/* Data Portability / Backup Card */}
      <DataBackupCard />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Review Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full">
                SRS 今日排程
              </span>
              <span className="text-xs font-bold text-[#64748B]">到期數量：{dueItems.length}</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#1E293B]">今日到期複習</h3>
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

        {/* Weak Kana Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                弱點加強
              </span>
              <span className="text-xs font-bold text-[#64748B]">錯題記錄：{wrongKanaList.length}</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#1E293B]">弱點錯題庫</h3>
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
  );
}
