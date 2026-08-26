import React, { useEffect, useState } from 'react';
import { NavigationTab } from '../types';
import { Home, Grid, BookOpen, BrainCircuit, RefreshCw, Sparkles, AudioLines, GraduationCap, Headphones, MessagesSquare, PenLine, Layers, LayoutGrid, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { LanguageSelector } from './LanguageSelector';

const PRIMARY_TABS: NavigationTab[] = ['home', 'grid', 'quiz', 'review'];

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  wrongCount: number;
}

export function Navigation({ currentTab, onSelectTab, wrongCount }: NavigationProps) {
  const { t } = useI18n();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const navItems: {
    id: NavigationTab;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'home', label: t('nav.home'), shortLabel: t('nav.homeShort'), icon: Home },
    { id: 'grid', label: t('nav.grid'), shortLabel: t('nav.gridShort'), icon: Grid },
    { id: 'study', label: t('nav.study'), shortLabel: t('nav.studyShort'), icon: BookOpen },
    { id: 'writing', label: t('nav.writing'), shortLabel: t('nav.writingShort'), icon: PenLine },
    { id: 'quiz', label: t('nav.quiz'), shortLabel: t('nav.quizShort'), icon: BrainCircuit },
    { id: 'confusable', label: t('nav.confusable'), shortLabel: t('nav.confusableShort'), icon: Layers },
    { id: 'review', label: t('nav.review'), shortLabel: t('nav.reviewShort'), icon: RefreshCw, badge: wrongCount },
    { id: 'special', label: t('nav.special'), shortLabel: t('nav.specialShort'), icon: AudioLines },
    { id: 'jlpt', label: t('nav.jlpt'), shortLabel: t('nav.jlptShort'), icon: GraduationCap },
    { id: 'shadowing', label: t('nav.shadowing'), shortLabel: t('nav.shadowingShort'), icon: Headphones },
    { id: 'chat', label: t('nav.chat'), shortLabel: t('nav.chatShort'), icon: MessagesSquare },
  ];

  const sheetGroups: { label: string; ids: NavigationTab[] }[] = [
    { label: t('nav.practiceGroup'), ids: ['study', 'writing', 'confusable', 'special'] },
    { label: t('nav.advancedGroup'), ids: ['jlpt', 'shadowing', 'chat'] },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border border-[#E2E8F0] rounded-3xl p-5 elev-2 shrink-0 sticky top-8">
        <div className="flex items-center justify-between gap-3 px-3 py-2 mb-4 border-b border-[#F1F5F9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00A86B] to-[#008F5B] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl elev-green">
              あ
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-[#1E293B] tracking-tight">{t('nav.appTitle')}</h1>
              <span className="text-[11px] font-semibold text-[#00A86B] bg-[#E6F8F2] px-2 py-0.5 rounded-full inline-block">
                {t('nav.srsBadge')}
              </span>
            </div>
          </div>
        </div>

        {/* Language Selector in Desktop Sidebar */}
        <div className="px-3 pb-3 mb-2 flex items-center justify-between border-b border-[#F1F5F9]">
          <span className="text-xs font-bold text-[#64748B]">{t('header.selectLanguage')}</span>
          <LanguageSelector variant="header" />
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
            {t('nav.memoryGuideTitle')}
          </div>
          <p>{t('nav.memoryGuideDesc')}</p>
        </div>
      </aside>

      {/* Mobile Top Bar with App Title & Language Selector */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl mb-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00A86B] to-[#008F5B] text-white rounded-xl flex items-center justify-center font-extrabold text-sm elev-green">
            あ
          </div>
          <span className="font-display font-bold text-sm text-[#1E293B]">{t('nav.appTitle')}</span>
        </div>
        <LanguageSelector variant="compact" />
      </div>

      {/* Mobile Bottom Navigation */}
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
              className={`flex flex-col items-center justify-center gap-1 min-h-[52px] px-1 rounded-xl transition-all relative cursor-pointer ${
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

        {/* 「更多」：目前分頁若在面板裡，就直接顯示它的圖示與名稱 */}
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
              className={`flex flex-col items-center justify-center gap-1 min-h-[52px] px-1 rounded-xl transition-all cursor-pointer ${
                activeInSheet ? 'text-[#00A86B] bg-[#F0FDF7]' : 'text-[#64748B] active:bg-[#F1F5F9]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold whitespace-nowrap">
                {activeInSheet ? activeInSheet.shortLabel : t('nav.more')}
              </span>
            </button>
          );
        })()}
      </div>

      {/* 更多面板 */}
      {isSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t('nav.more')}>
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
              <h2 className="text-base font-display font-bold text-[#1E293B]">{t('nav.more')}</h2>
              <button
                onClick={() => setIsSheetOpen(false)}
                aria-label={t('common.close')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] active:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {sheetGroups.map((group) => (
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
                          className={`flex items-center gap-3 min-h-[56px] px-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
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
