import React from 'react';
import { NavigationTab } from '../types';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';

interface LearningPathCardProps {
  onNavigate: (tab: NavigationTab) => void;
}

export function LearningPathCard({ onNavigate }: LearningPathCardProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
      <h3 className="text-sm font-extrabold text-[#1E293B] mb-1">{t('home.learningPath.title')}</h3>
      <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
        {t('home.learningPath.step1Desc')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('grid')}
          className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#00A86B] hover:bg-[#F0FDF7] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00A86B]/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#00A86B]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1E293B]">{t('home.learningPath.step1Title')}</div>
              <div className="text-[11px] text-[#64748B]">{t('home.learningPath.step3Title')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00A86B] transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('jlpt')}
          className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#00A86B] hover:bg-[#F0FDF7] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00A86B]/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#00A86B]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1E293B]">{t('home.jlptCard.title')}</div>
              <div className="text-[11px] text-[#64748B]">{t('home.jlptCard.desc')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00A86B] transition-colors" />
        </button>
      </div>
    </div>
  );
}
