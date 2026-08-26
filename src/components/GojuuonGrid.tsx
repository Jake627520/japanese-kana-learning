import React from 'react';
import { KanaItem, UserProgress } from '../types';
import { speakJapanese } from '../utils/speech';
import {
  getKanaStatus,
  countKanaStatuses,
  KANA_STATUS_STYLE,
  KANA_STATUS_ORDER,
  KanaStatus,
} from '../utils/kanaStatus';
import { Volume2, Check } from 'lucide-react';
import { useI18n } from '../i18n';

interface GojuuonGridProps {
  allKana: KanaItem[];
  progress: UserProgress;
  kanaCategory?: 'basic' | 'dakuten' | 'handakuten' | 'youon';
  onKanaCategoryChange?: (category: 'basic' | 'dakuten' | 'handakuten' | 'youon') => void;
  kanaType?: 'hiragana' | 'katakana';
  onKanaTypeChange?: (type: 'hiragana' | 'katakana') => void;
  onSelectKana: (kana: KanaItem) => void;
}

export function GojuuonGrid({
  allKana,
  progress,
  kanaCategory = 'basic',
  onKanaCategoryChange,
  kanaType = 'hiragana',
  onKanaTypeChange,
  onSelectKana,
}: GojuuonGridProps) {
  const { t } = useI18n();
  const counts = countKanaStatuses(allKana, progress);

  const categories: { id: 'basic' | 'dakuten' | 'handakuten' | 'youon'; label: string }[] = [
    { id: 'basic', label: t('common.basic') },
    { id: 'dakuten', label: t('common.dakuten') },
    { id: 'handakuten', label: t('common.handakuten') },
    { id: 'youon', label: t('common.youon') },
  ];

  const getStatusLabel = (s: KanaStatus): string => {
    switch (s) {
      case 'weak': return t('header.weak');
      case 'due': return t('review.dueTab');
      case 'mastered': return t('grid.statusMastered');
      case 'learning': return t('grid.statusLearning');
      case 'new': return t('grid.statusUnlearned');
      default: return '';
    }
  };

  const getCategoryTitle = (): string => {
    const typeStr = kanaType === 'katakana' ? t('common.katakana') : t('common.hiragana');
    let catStr = t('nav.gridShort');
    if (kanaCategory === 'dakuten') catStr = t('common.dakuten');
    else if (kanaCategory === 'handakuten') catStr = t('common.handakuten');
    else if (kanaCategory === 'youon') catStr = t('common.youon');
    return `${typeStr} ${catStr} ${t('nav.grid')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] elev-2 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-[#1E293B]">
              {getCategoryTitle()}
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              {t('grid.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onKanaCategoryChange && (
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
                {categories.map((c) => (
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
                {(['hiragana', 'katakana'] as const).map((typeItem) => (
                  <button
                    key={typeItem}
                    type="button"
                    onClick={() => onKanaTypeChange(typeItem)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                      kanaType === typeItem
                        ? 'bg-white text-[#00A86B] elev-1'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    {typeItem === 'hiragana' ? t('common.hiragana') : t('common.katakana')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 圖例兼統計 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-[#F1F5F9]">
          {KANA_STATUS_ORDER.map((s) => {
            const style = KANA_STATUS_STYLE[s];
            const label = getStatusLabel(s);
            return (
              <div key={s} className="flex items-center gap-1.5" title={label}>
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                <span className="text-xs font-bold text-[#64748B]">{label}</span>
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
          const statusLabel = getStatusLabel(status);

          return (
            <div
              key={item.id}
              onClick={() => {
                speakJapanese(item.kana);
                onSelectKana(item);
              }}
              title={`${item.kana} (${statusLabel})`}
              className={`bg-white rounded-2xl border elev-1 card-lift rise-in overflow-hidden cursor-pointer relative group ${style.card}`}
              style={{ ['--stagger' as string]: `${Math.min(i, 11) * 25}ms` }}
            >
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
                  className="p-1.5 text-[#64748B] hover:text-[#00A86B] rounded-lg hover:bg-[#E6F8F2] transition-colors cursor-pointer"
                  title={t('common.playAudio')}
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
