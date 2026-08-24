import { EmptyState } from './EmptyState';
import React, { useEffect, useState } from 'react';
import { KanaItem, UserProgress } from '../types';
import {
  getDueReviewItems,
  getReviewState,
  formatNextReviewText,
  removeKanaFromWrong,
} from '../utils/storage';
import { getKanaStatus } from '../utils/kanaStatus';
import { speakJapanese } from '../utils/speech';
import { QuizView } from './QuizView';
import {
  Volume2,
  CheckCircle2,
  Play,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface ReviewViewProps {
  allKana: KanaItem[];
  progress: UserProgress;
  onProgressChange: () => void;
  onStartStudyKana: (kana: KanaItem) => void;
}

export function ReviewView({
  allKana,
  progress,
  onProgressChange,
  onStartStudyKana,
}: ReviewViewProps) {
  const [activeTab, setActiveTab] = useState<'due' | 'wrong'>('due');

  // 首頁的「今日學習」會指定要開哪一頁（弱點或到期）。用 sessionStorage 傳遞
  // 而不是加 prop，是為了不動到 onNavigate(tab) 的簽名——跟讀那邊的
  // shadowing-open-today 已經是同一套做法。讀完就清掉，這是一次性的意圖，
  // 留著會讓使用者下次自己點進複習中心時被莫名帶到另一頁。
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const want = sessionStorage.getItem('review-open-tab');
    if (want === 'due' || want === 'wrong') {
      setActiveTab(want);
      sessionStorage.removeItem('review-open-tab');
    }
  }, []);
  const [isMiniQuizActive, setIsMiniQuizActive] = useState(false);
  const [selectedKanaDetail, setSelectedKanaDetail] = useState<KanaItem | null>(null);
  const [confirmModalKana, setConfirmModalKana] = useState<KanaItem | null>(null);

  // 這裡原本是用 wrongIds 現拼一個假的 progress 物件，而且沒有 reviewStates。
  // getDueReviewItems 讀的正是 reviewStates，拿到空物件——所以「今日到期複習」
  // 分頁永遠是 0，SRS 排程在複習中心等於完全沒作用。首頁用的是真的 progress，
  // 兩邊因此長期對不起來（首頁說到期 6、這裡說 0）。改成直接收真正的 progress。
  const wrongList = allKana.filter((k) => progress.wrongKanaIds.includes(k.id));
  // 到期清單排除弱點：同一個假名只出現在一個分頁，兩個分頁是互斥的分割而不是
  // 重疊的集合——否則使用者會把同一個假名做兩次，兩處的數字加起來也不等於
  // 實際要練的數量。優先序（weak > due）沿用 kanaStatus，讓首頁、五十音圖表、
  // 複習中心三個地方講的是同一個故事。
  const dueList = getDueReviewItems(allKana, progress).filter(
    (k) => getKanaStatus(progress, k.id) === 'due'
  );

  // Strictly map displayList according to activeTab
  const displayList = activeTab === 'due' ? dueList : wrongList;

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakJapanese(text);
  };

  const handleConfirmRemove = () => {
    if (confirmModalKana) {
      removeKanaFromWrong(confirmModalKana.id);
      onProgressChange();
      setConfirmModalKana(null);
      if (selectedKanaDetail?.id === confirmModalKana.id) {
        setSelectedKanaDetail(null);
      }
    }
  };

  // Mini Quiz Mode
  if (isMiniQuizActive) {
    const miniQuizPool = selectedKanaDetail
      ? [selectedKanaDetail]
      : activeTab === 'due' && dueList.length > 0
      ? dueList
      : wrongList;

    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsMiniQuizActive(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:text-[#1E293B] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          返回複習中心
        </button>

        <QuizView
          allKana={allKana}
          customPool={miniQuizPool}
          isReviewMode={true}
          onProgressChange={onProgressChange}
          onFinish={() => setIsMiniQuizActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-[#1E293B]">SRS 複習中心</h2>
          <p className="text-xs text-[#64748B] mt-1">
            依據遺忘曲線自動進行多段式記憶排程，及時強固弱點。
          </p>
        </div>

        {displayList.length > 0 && (
          <button
            onClick={() => {
              setSelectedKanaDetail(null);
              setIsMiniQuizActive(true);
            }}
            className="px-5 py-3 bg-[#00A86B] text-white font-extrabold text-xs rounded-2xl hover:bg-[#008F5B] transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            開始微測驗
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-[#E2E8F0] gap-4">
        <button
          onClick={() => setActiveTab('due')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'due'
              ? 'border-[#00A86B] text-[#00A86B]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          今日到期複習 ({dueList.length})
        </button>
        <button
          onClick={() => setActiveTab('wrong')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'wrong'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          弱點錯題庫 ({wrongList.length})
        </button>
      </div>

      {/* Empty State Banner or Grid */}
      {displayList.length === 0 ? (
        <EmptyState
          art={activeTab === 'due' ? 'calendar' : 'target'}
          title={activeTab === 'due' ? '今天的複習都完成了' : '錯題庫是空的'}
          body={
            activeTab === 'due'
              ? 'SRS 排程沒有到期項目，下一批會在明天自動出現。現在可以去練還沒學過的假名，或做一輪綜合測驗。'
              : '目前沒有任何答錯記錄。測驗答錯的假名會自動收進這裡並排進加強複習——所以這一頁空著是好事。'
          }
          actions={
            activeTab === 'due' && wrongList.length > 0 ? (
              <button
                onClick={() => setActiveTab('wrong')}
                className="px-5 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl hover:bg-white hover:border-[#00A86B] btn-lift cursor-pointer"
              >
                查看全部弱點錯題 ({wrongList.length})
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayList.map((item) => {
            const firstEx = item.examples[0];
            const srsState = getReviewState(progress, item.id);

            return (
              <div
                key={item.id}
                onClick={() => onStartStudyKana(item)}
                className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#00A86B] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#FAFBFB] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-3xl font-extrabold text-[#1E293B] group-hover:scale-105 transition-transform">
                      {item.kana}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[#00A86B] uppercase">
                          {item.romaji}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.type === 'katakana'
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}>
                          {item.type === 'katakana' ? '片假名' : '平假名'}
                        </span>
                        {item.category === 'dakuten' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706]">
                            濁音
                          </span>
                        )}
                        {item.category === 'handakuten' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FCE7F3] text-[#DB2777]">
                            半濁音
                          </span>
                        )}
                        {item.category === 'youon' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED]">
                            拗音
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                          L{srsState.reviewLevel}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        下次：{formatNextReviewText(srsState.nextReviewAt)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handlePlayAudio(e, item.kana)}
                    className="p-2.5 text-[#64748B] hover:text-[#00A86B] hover:bg-[#E6F8F2] rounded-xl transition-colors cursor-pointer"
                    title="聽發音"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {firstEx && (
                  <div className="bg-[#FAFBFB] p-3 rounded-xl text-xs text-[#64748B] border border-[#F1F5F9]">
                    例詞：<strong className="text-[#1E293B] font-semibold">{firstEx.word}</strong> (
                    {firstEx.meaning})
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] gap-2">
                  <span className="text-xs font-bold text-[#00A86B] flex items-center gap-1">
                    查看詳情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModalKana(item);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-[#16A34A] bg-[#F0FDF4] hover:bg-[#DCFCE7] rounded-lg transition-colors cursor-pointer"
                  >
                    標記為已克服
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalKana && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E2E8F0] shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-[#1E293B]">確認標記已克服？</h3>
            <p className="text-xs text-[#64748B]">
              將假名「<strong className="text-[#1E293B]">{confirmModalKana.kana}</strong>」移除出弱點名單。
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmModalKana(null)}
                className="flex-1 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-2.5 bg-[#00A86B] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                確認移除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
