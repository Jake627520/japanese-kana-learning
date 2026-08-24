import React, { useEffect, useState } from 'react';
import { NavigationTab } from '../types';
import { Home, Grid, BookOpen, BrainCircuit, RefreshCw, Sparkles, AudioLines, GraduationCap, Headphones, MessagesSquare, PenLine, Layers, LayoutGrid, X } from 'lucide-react';

// 手機底部只放 4 個主要分頁，其餘收進「更多」面板。
//
// 為什麼不全部平鋪：11 個項目平均分在 375px 寬的螢幕上，每個只有 34px，
// 遠低於 44px 的最小觸控尺寸——按得到不等於按得準，實際使用會一直按錯。
// 橫向捲動雖然讓每一項都到得了，但要先捲才找得到，同樣不好用。
//
// 主要分頁的挑選依據是「多久用一次」：總覽與圖表是每次都會進的入口，
// 測驗是主要動作，複習中心有到期數量的 badge、有時效性。
// 其餘分頁多半是進到某個情境後才會用，收在一層之下是合理的取捨。
const PRIMARY_TABS: NavigationTab[] = ['home', 'grid', 'quiz', 'review'];

const SHEET_GROUPS: { label: string; ids: NavigationTab[] }[] = [
  { label: '假名練習', ids: ['study', 'writing', 'confusable', 'special'] },
  { label: '進階內容', ids: ['jlpt', 'shadowing', 'chat'] },
];

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  wrongCount: number;
}

export function Navigation({ currentTab, onSelectTab, wrongCount }: NavigationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 面板開著時鎖住背景捲動，並讓 Esc 可以關閉
  useEffect(() => {
    if (!isSheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSheetOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isSheetOpen]);
  // shortLabel 給手機底部用——那裡每格只有約 75px，四個字會折成兩行
  const navItems: {
    id: NavigationTab;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'home', label: '學習總覽', shortLabel: '總覽', icon: Home },
    { id: 'grid', label: '五十音圖表', shortLabel: '五十音', icon: Grid },
    { id: 'study', label: '假名卡片', shortLabel: '卡片', icon: BookOpen },
    { id: 'writing', label: '書寫練習', shortLabel: '書寫', icon: PenLine },
    { id: 'quiz', label: '綜合測驗', shortLabel: '測驗', icon: BrainCircuit },
    { id: 'confusable', label: '易混辨析', shortLabel: '辨析', icon: Layers },
    { id: 'review', label: '複習中心', shortLabel: '複習', icon: RefreshCw, badge: wrongCount },
    { id: 'special', label: '特殊音', shortLabel: '特殊音', icon: AudioLines },
    { id: 'jlpt', label: 'JLPT 練習', shortLabel: 'JLPT', icon: GraduationCap },
    { id: 'shadowing', label: '跟讀練習', shortLabel: '跟讀', icon: Headphones },
    { id: 'chat', label: '對話教室', shortLabel: '對話', icon: MessagesSquare },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border border-[#E2E8F0] rounded-3xl p-5 elev-2 shrink-0 sticky top-8">
        <div className="flex items-center gap-3 px-3 py-2 mb-6 border-b border-[#F1F5F9] pb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00A86B] to-[#008F5B] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl elev-green">
            あ
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-[#1E293B] tracking-tight">日語五十音速成</h1>
            <span className="text-[11px] font-semibold text-[#00A86B] bg-[#E6F8F2] px-2 py-0.5 rounded-full inline-block">
              SRS 記憶系統
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#00A86B] to-[#009960] text-white elev-green'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAFBFB] hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-extrabold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-br from-[#F0FDF7] to-[#FAFBFB] rounded-2xl border border-[#E6F8F2] text-xs text-[#64748B] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
            <Sparkles className="w-4 h-4 text-[#00A86B]" />
            高效記憶指引
          </div>
          <p>結合間隔重複 SRS 演算法，科學自動排程最需要複習的假名卡片。</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      {/* Mobile Bottom Navigation：4 個主要分頁 ＋ 更多 */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-2 pt-2 z-50 grid grid-cols-5 gap-1 shadow-lg"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        {PRIMARY_TABS.map((id) => {
          const item = navItems.find((n) => n.id === id);
          if (!item) return null;
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[52px] px-1 rounded-xl transition-all relative ${
                isActive ? 'text-[#00A86B] bg-[#F0FDF7]' : 'text-[#64748B] active:bg-[#F1F5F9]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold whitespace-nowrap">{item.shortLabel}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 「更多」：目前分頁若在面板裡，就直接顯示它的圖示與名稱，
            這樣使用者不會失去「我現在在哪」的線索。 */}
        {(() => {
          const activeInSheet = navItems.find(
            (n) => n.id === currentTab && !PRIMARY_TABS.includes(n.id)
          );
          const Icon = activeInSheet ? activeInSheet.icon : LayoutGrid;
          return (
            <button
              onClick={() => setIsSheetOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isSheetOpen}
              className={`flex flex-col items-center justify-center gap-1 min-h-[52px] px-1 rounded-xl transition-all ${
                activeInSheet ? 'text-[#00A86B] bg-[#F0FDF7]' : 'text-[#64748B] active:bg-[#F1F5F9]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold whitespace-nowrap">
                {activeInSheet ? activeInSheet.shortLabel : '更多'}
              </span>
            </button>
          );
        })()}
      </div>

      {/* 更多面板 */}
      {isSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="更多分頁">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsSheetOpen(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-[#E2E8F0] px-5 pt-3 sheet-up max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          >
            <div className="flex justify-center pb-3">
              <span aria-hidden className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-display font-bold text-[#1E293B]">更多</h2>
              <button
                onClick={() => setIsSheetOpen(false)}
                aria-label="關閉"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] active:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {SHEET_GROUPS.map((group) => (
                <div key={group.label} className="space-y-2.5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[13px] font-extrabold text-[#1E293B] tracking-tight">
                      {group.label}
                    </span>
                    <span className="flex-1 h-px bg-gradient-to-r from-[#E2E8F0] to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {group.ids.map((id) => {
                      const item = navItems.find((n) => n.id === id);
                      if (!item) return null;
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectTab(item.id);
                            setIsSheetOpen(false);
                          }}
                          className={`flex items-center gap-3 min-h-[56px] px-3.5 rounded-2xl border text-left transition-all ${
                            isActive
                              ? 'border-[#00A86B] bg-[#F0FDF7] text-[#00A86B]'
                              : 'border-[#E2E8F0] text-[#1E293B] active:bg-[#FAFBFB]'
                          }`}
                        >
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-[#00A86B] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                            }`}
                          >
                            <Icon className="w-4.5 h-4.5" />
                          </span>
                          <span className="text-[13px] font-bold leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
