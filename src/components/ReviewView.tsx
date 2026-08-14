import React, { useState } from 'react';
import { KanaItem, UserProgress } from '../types';
import {
  getDueReviewItems,
  getReviewState,
  formatNextReviewText,
  removeKanaFromWrong,
} from '../utils/storage';
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
  wrongIds: string[];
  onProgressChange: () => void;
  onStartStudyKana: (kana: KanaItem) => void;
}

export function ReviewView({
  allKana,
  wrongIds,
  onProgressChange,
  onStartStudyKana,
}: ReviewViewProps) {
  const [activeTab, setActiveTab] = useState<'due' | 'wrong'>('due');
  const [isMiniQuizActive, setIsMiniQuizActive] = useState(false);
  const [selectedKanaDetail, setSelectedKanaDetail] = useState<KanaItem | null>(null);
  const [confirmModalKana, setConfirmModalKana] = useState<KanaItem | null>(null);

  const progress: UserProgress = {
    masteredKanaIds: [],
    wrongKanaIds: wrongIds,
    streakDays: 1,
    lastStudyDate: '',
  };

  const wrongList = allKana.filter((k) => wrongIds.includes(k.id));
  const dueList = getDueReviewItems(allKana, progress);

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
          <h2 className="text-xl font-extrabold text-[#1E293B]">SRS 複習中心</h2>
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
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-xs text-center space-y-4">
          <div className="w-14 h-14 bg-[#E6F8F2] text-[#00A86B] rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-[#1E293B]">
            {activeTab === 'due' ? '目前沒有到期複習' : '目前沒有錯題記錄'}
          </h3>
          <p className="text-xs text-[#64748B]">
            {activeTab === 'due'
              ? '太棒了！今天預定的卡片都已按時複習完成。'
              : '太棒了！你在測驗中表現完美。'}
          </p>
          {activeTab === 'due' && wrongList.length > 0 && (
            <button
              onClick={() => setActiveTab('wrong')}
              className="px-5 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer"
            >
              查看全部弱點錯題 ({wrongList.length})
            </button>
          )}
        </div>
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
            <h3 className="text-lg font-extrabold text-[#1E293B]">確認標記已克服？</h3>
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
