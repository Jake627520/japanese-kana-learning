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
    <div className="bg-[color:var(--paper-bg)] rounded-2xl border border-[color:var(--paper-85)] p-5 sm:p-6 shadow-xs">
      <h3 className="text-sm font-extrabold text-[color:var(--ink-24)] mb-1">{t('home.learningPath.title')}</h3>
      <p className="text-xs text-[color:var(--ink-50)] mb-4 leading-relaxed">
        {t('home.learningPath.step1Desc')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('grid')}
          className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)] hover:bg-[color:var(--moss-95)] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[color:var(--moss-50)]/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[color:var(--moss-50)]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[color:var(--ink-24)]">{t('home.learningPath.step1Title')}</div>
              <div className="text-[11px] text-[color:var(--ink-50)]">{t('home.learningPath.step3Title')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[color:var(--ink-62)] group-hover:text-[color:var(--moss-50)] transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('jlpt')}
          className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)] hover:bg-[color:var(--moss-95)] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[color:var(--moss-50)]/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[color:var(--moss-50)]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[color:var(--ink-24)]">{t('home.jlptCard.title')}</div>
              <div className="text-[11px] text-[color:var(--ink-50)]">{t('home.jlptCard.desc')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[color:var(--ink-62)] group-hover:text-[color:var(--moss-50)] transition-colors" />
        </button>
      </div>
    </div>
  );
}
