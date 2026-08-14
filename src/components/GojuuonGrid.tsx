import React from 'react';
import { KanaItem } from '../types';
import { speakJapanese } from '../utils/speech';
import { Volume2, CheckCircle2 } from 'lucide-react';

interface GojuuonGridProps {
  allKana: KanaItem[];
  masteredIds: string[];
  onSelectKana: (kana: KanaItem) => void;
}

export function GojuuonGrid({ allKana, masteredIds, onSelectKana }: GojuuonGridProps) {
  const rows = ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行 / ん'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E293B]">清音五十音圖表</h2>
          <p className="text-xs text-[#64748B] mt-1">
            點擊卡片播放標準發音並進入詳細發音與例句學習卡片。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
          <span className="w-3 h-3 rounded-full bg-[#00A86B] inline-block"></span>
          精通標記
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4">
        {allKana.map((item) => {
          const isMastered = masteredIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => {
                speakJapanese(item.kana);
                onSelectKana(item);
              }}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col items-center justify-between gap-2 relative group hover:shadow-md ${
                isMastered
                  ? 'border-[#00A86B] bg-[#F0FDF4]/50'
                  : 'border-[#E2E8F0] hover:border-[#00A86B]'
              }`}
            >
              {isMastered && (
                <div className="absolute top-2 right-2 text-[#00A86B]">
                  <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                </div>
              )}

              <div className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] group-hover:scale-110 transition-transform">
                {item.kana}
              </div>

              <div className="text-xs font-extrabold text-[#00A86B] uppercase">{item.romaji}</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakJapanese(item.kana);
                }}
                className="p-1.5 text-[#64748B] hover:text-[#00A86B] rounded-lg hover:bg-[#E6F8F2] transition-colors"
                title="發音"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
