import React from 'react';
import { KanaItem, UserProgress } from '../types';
import { speakJapanese } from '../utils/speech';
import {
  getKanaStatus,
  countKanaStatuses,
  KANA_STATUS_STYLE,
  KANA_STATUS_ORDER,
} from '../utils/kanaStatus';
import { Volume2, Check } from 'lucide-react';

interface GojuuonGridProps {
  allKana: KanaItem[];
  progress: UserProgress;
  kanaCategory?: 'basic' | 'dakuten' | 'handakuten' | 'youon';
  onKanaCategoryChange?: (category: 'basic' | 'dakuten' | 'handakuten' | 'youon') => void;
  kanaType?: 'hiragana' | 'katakana';
  onKanaTypeChange?: (type: 'hiragana' | 'katakana') => void;
  onSelectKana: (kana: KanaItem) => void;
}

const CATEGORIES: { id: 'basic' | 'dakuten' | 'handakuten' | 'youon'; label: string }[] = [
  { id: 'basic', label: '基本清音' },
  { id: 'dakuten', label: '濁音' },
  { id: 'handakuten', label: '半濁音' },
  { id: 'youon', label: '拗音' },
];

export function GojuuonGrid({
  allKana,
  progress,
  kanaCategory = 'basic',
  onKanaCategoryChange,
  kanaType = 'hiragana',
  onKanaTypeChange,
  onSelectKana,
}: GojuuonGridProps) {
  // 計數只算目前顯示的這一批，圖例的數字才對得上眼前看到的格子
  const counts = countKanaStatuses(allKana, progress);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] elev-2 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-[#1E293B]">
              {kanaType === 'katakana' ? '片假名' : '平假名'}
              {kanaCategory === 'dakuten'
                ? '濁音'
                : kanaCategory === 'handakuten'
                ? '半濁音'
                : kanaCategory === 'youon'
                ? '拗音'
                : '五十音'}
              圖表
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              點擊卡片播放標準發音並進入詳細發音與例句學習卡片。顏色代表你在這個假名上的狀態。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onKanaCategoryChange && (
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onKanaCategoryChange(c.id)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                      kanaCategory === c.id
                        ? 'bg-white text-[#00A86B] elev-1'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {onKanaTypeChange && (
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
                {(['hiragana', 'katakana'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onKanaTypeChange(t)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                      kanaType === t
                        ? 'bg-white text-[#00A86B] elev-1'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    {t === 'hiragana' ? '平假名' : '片假名'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 圖例兼統計：一眼看出「這一批我還有多少沒熟」。
            順序由「該處理」到「已完成」，和注意力順序一致。 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-[#F1F5F9]">
          {KANA_STATUS_ORDER.map((s) => {
            const style = KANA_STATUS_STYLE[s];
            return (
              <div key={s} className="flex items-center gap-1.5" title={style.hint}>
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                <span className="text-xs font-bold text-[#64748B]">{style.label}</span>
                <span className="text-xs font-extrabold text-[#1E293B]">{counts[s]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4">
        {allKana.map((item, i) => {
          const status = getKanaStatus(progress, item.id);
          const style = KANA_STATUS_STYLE[status];

          return (
            <div
              key={item.id}
              onClick={() => {
                speakJapanese(item.kana);
                onSelectKana(item);
              }}
              title={`${item.kana}（${style.label}）— ${style.hint}`}
              className={`bg-white rounded-2xl border elev-1 card-lift rise-in overflow-hidden cursor-pointer relative group ${style.card}`}
              style={{ ['--stagger' as string]: `${Math.min(i, 11) * 25}ms` }}
            >
              {/* 狀態帶。顏色之外還有位置與圖示兩層線索，
                  不讓「分辨得出來」只靠顏色——色盲使用者一樣讀得到。 */}
              {style.bar && <div aria-hidden className={`h-1 w-full ${style.bar}`} />}
              {!style.bar && <div aria-hidden className="h-1 w-full" />}

              <div className="p-3 sm:p-4 flex flex-col items-center justify-between gap-2">
                {status === 'mastered' && (
                  <div className="absolute top-2.5 right-2 text-[#00A86B]">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                )}
                {status === 'weak' && (
                  <div className="absolute top-2.5 right-2.5 text-red-500 text-xs font-extrabold leading-none">
                    !
                  </div>
                )}
                {status === 'due' && (
                  <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
