import React from 'react';
import { NavigationTab } from '../types';
import { Home, Grid, BookOpen, BrainCircuit, RefreshCw, Sparkles, AudioLines, GraduationCap, Headphones, MessagesSquare, PenLine, Layers } from 'lucide-react';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  wrongCount: number;
}

export function Navigation({ currentTab, onSelectTab, wrongCount }: NavigationProps) {
  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: '學習總覽', icon: Home },
    { id: 'grid', label: '五十音圖表', icon: Grid },
    { id: 'study', label: '假名卡片', icon: BookOpen },
    { id: 'writing', label: '書寫練習', icon: PenLine },
    { id: 'quiz', label: '綜合測驗', icon: BrainCircuit },
    { id: 'confusable', label: '易混辨析', icon: Layers },
    { id: 'review', label: '複習中心', icon: RefreshCw, badge: wrongCount },
    { id: 'special', label: '特殊音', icon: AudioLines },
    { id: 'jlpt', label: 'JLPT 練習', icon: GraduationCap },
    { id: 'shadowing', label: '跟讀練習', icon: Headphones },
    { id: 'chat', label: '對話教室', icon: MessagesSquare },
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
            <h1 className="font-extrabold text-base text-[#1E293B] tracking-tight">日語五十音速成</h1>
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
      {/* 11 個項目在 375px 寬的手機上總寬會到 502px——justify-around 不會換行也不會捲動，
          最後三項（JLPT 練習／跟讀練習／對話教室）會被切到畫面外，完全點不到。
          改成可橫向捲動，並讓每一項不被壓縮；pb 留 iOS 的 home indicator 安全區。 */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-2 pt-2 z-50 flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shadow-lg"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative shrink-0 min-w-[64px] ${
                isActive ? 'text-[#00A86B] bg-[#F0FDF7]' : 'text-[#64748B]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold whitespace-nowrap">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
