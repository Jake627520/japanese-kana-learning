import React from 'react';
import { NavigationTab } from '../types';
import { Home, Grid, BookOpen, BrainCircuit, RefreshCw, Sparkles } from 'lucide-react';

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
    { id: 'quiz', label: '綜合測驗', icon: BrainCircuit },
    { id: 'review', label: '複習中心', icon: RefreshCw, badge: wrongCount },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs shrink-0 sticky top-8">
        <div className="flex items-center gap-3 px-3 py-2 mb-6 border-b border-[#F1F5F9] pb-4">
          <div className="w-10 h-10 bg-[#00A86B] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-xs">
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
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAFBFB]'
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

        <div className="mt-8 p-4 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9] text-xs text-[#64748B] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
            <Sparkles className="w-4 h-4 text-[#00A86B]" />
            高效記憶指引
          </div>
          <p>結合間隔重複 SRS 演算法，科學自動排程最需要複習的假名卡片。</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-3 py-2 z-50 flex justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-[#00A86B]' : 'text-[#64748B]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
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
