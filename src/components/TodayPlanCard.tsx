import React from 'react';
import { KanaItem, NavigationTab, UserProgress } from '../types';
import { getDueReviewItems } from '../utils/storage';
import { getKanaStatus } from '../utils/kanaStatus';
import { getShadowingProgress } from '../lib/shadowingProgress';
import { useI18n } from '../i18n';
import {
  AlertTriangle, RefreshCw, Headphones, BookOpen, ArrowRight, Check, CalendarCheck,
} from 'lucide-react';

interface TodayPlanCardProps {
  progress: UserProgress;
  allKana: KanaItem[];
  onNavigate: (tab: NavigationTab) => void;
}

interface PlanStep {
  key: string;
  label: string;
  detail: string;
  icon: React.ElementType;
  tint: string;
  fg: string;
  cta: string;
  run: () => void;
}

export function TodayPlanCard({ progress, allKana, onNavigate }: TodayPlanCardProps) {
  const { t } = useI18n();
  const weakCount = progress.wrongKanaIds.length;

  // 扣掉弱點後才是「純粹因為 SRS 排程而到期」的部分
  const dueCount = getDueReviewItems(allKana, progress).filter(
    (k) => getKanaStatus(progress, k.id) === 'due'
  ).length;

  const newCount = allKana.filter((k) => getKanaStatus(progress, k.id) === 'new').length;

  const shadowing = getShadowingProgress();
  const shadowingDone = shadowing.todayIds.filter(
    (id) => (shadowing.practiceCount[id] ?? 0) > 0
  ).length;
  const shadowingTotal = shadowing.todayIds.length || 3;

  const goReview = (tab: 'due' | 'wrong') => {
    if (typeof window !== 'undefined') sessionStorage.setItem('review-open-tab', tab);
    onNavigate('review');
  };

  const goShadowing = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('shadowing-open-today', '1');
    onNavigate('shadowing');
  };

  const steps: PlanStep[] = [];

  if (weakCount > 0) {
    steps.push({
      key: 'weak',
      label: t('home.todayPlan.weakCount'),
      detail: `${weakCount} ${t('common.countUnit')}`,
      icon: AlertTriangle,
      tint: 'bg-red-50',
      fg: 'text-red-500',
      cta: `${t('review.startWeakReview')} (${weakCount})`,
      run: () => goReview('wrong'),
    });
  }
  if (dueCount > 0) {
    steps.push({
      key: 'due',
      label: t('home.todayPlan.dueCount'),
      detail: `${dueCount} ${t('common.countUnit')}`,
      icon: RefreshCw,
      tint: 'bg-amber-50',
      fg: 'text-amber-500',
      cta: `${t('review.startDueReview')} (${dueCount})`,
      run: () => goReview('due'),
    });
  }
  if (weakCount === 0 && dueCount === 0 && newCount > 0) {
    steps.push({
      key: 'new',
      label: t('home.todayPlan.newKanaCount'),
      detail: `${newCount} ${t('common.countUnit')}`,
      icon: BookOpen,
      tint: 'bg-blue-50',
      fg: 'text-blue-500',
      cta: t('home.todayPlan.btnStart'),
      run: () => onNavigate('grid'),
    });
  }
  if (shadowingDone < shadowingTotal) {
    steps.push({
      key: 'shadowing',
      label: t('home.shadowingCard.title'),
      detail: `${shadowingDone} / ${shadowingTotal}`,
      icon: Headphones,
      tint: 'bg-[#E6F8F2]',
      fg: 'text-[#00A86B]',
      cta: t('home.shadowingCard.btnStart'),
      run: goShadowing,
    });
  }

  const primary = steps[0];
  const rest = steps.slice(1);

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-2 overflow-hidden rise-in">
      <div
        aria-hidden
        className={`h-1 ${primary ? 'bg-gradient-to-r from-[#00A86B] to-[#34D399]' : 'bg-[#00A86B]'}`}
      />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#00A86B]" />
            <h3 className="text-sm font-extrabold text-[#1E293B]">{t('home.todayPlan.tag')}</h3>
          </div>
          <span className="text-[11px] text-[#94A3B8]">{t('home.todayPlan.desc')}</span>
        </div>

        {primary ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl ${primary.tint} ${primary.fg} flex items-center justify-center shrink-0`}
              >
                <primary.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-[#1E293B] leading-tight">
                  {primary.label}
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">{primary.detail}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={primary.run}
              className="w-full py-3.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-sm rounded-2xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
            >
              {primary.cta}
              <ArrowRight className="w-4 h-4" />
            </button>

            {rest.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-[#94A3B8]">{t('common.next')}</div>
                {rest.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={s.run}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#F1F5F9] bg-[#FAFBFB] hover:bg-white hover:border-[#00A86B] transition-all cursor-pointer text-left"
                  >
                    <span
                      className={`w-7 h-7 rounded-lg ${s.tint} ${s.fg} flex items-center justify-center shrink-0`}
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#1E293B]">{s.label}</span>
                    <span className="text-[11px] text-[#64748B] truncate">{s.detail}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1] ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F2] text-[#00A86B] flex items-center justify-center">
              <Check className="w-6 h-6" strokeWidth={3} />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#1E293B]">{t('home.todayPlan.allClearTitle')}</div>
              <div className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {t('home.todayPlan.allClearDesc')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="px-5 py-2.5 bg-[#FAFBFB] border border-[#E2E8F0] hover:border-[#00A86B] hover:bg-white text-[#1E293B] font-bold text-xs rounded-xl btn-lift cursor-pointer flex items-center gap-2"
            >
              {t('home.todayPlan.allClearBtn')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
