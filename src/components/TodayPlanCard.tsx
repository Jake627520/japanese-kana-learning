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
      detail: t('common.kanaCount', { count: weakCount }),
      icon: AlertTriangle,
      tint: 'bg-[color:var(--shu-91)]',
      fg: 'text-[color:var(--shu-56)]',
      cta: `${t('review.startWeakReview')} (${weakCount})`,
      run: () => goReview('wrong'),
    });
  }
  if (dueCount > 0) {
    steps.push({
      key: 'due',
      label: t('home.todayPlan.dueCount'),
      detail: t('common.kanaCount', { count: dueCount }),
      icon: RefreshCw,
      tint: 'bg-[color:var(--paper-92a)]',
      fg: 'text-amber-500',
      cta: `${t('review.startDueReview')} (${dueCount})`,
      run: () => goReview('due'),
    });
  }
  if (weakCount === 0 && dueCount === 0 && newCount > 0) {
    steps.push({
      key: 'new',
      label: t('home.todayPlan.newKanaCount'),
      detail: t('common.kanaCount', { count: newCount }),
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
      tint: 'bg-[color:var(--moss-93)]',
      fg: 'text-[color:var(--moss-50)]',
      cta: t('home.shadowingCard.btnStart'),
      run: goShadowing,
    });
  }

  const primary = steps[0];
  const rest = steps.slice(1);

  return (
    <div className="bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] elev-2 overflow-hidden rise-in">
      <div
        aria-hidden
        className={`h-1 ${primary ? 'bg-gradient-to-r from-[color:var(--moss-50)] to-[color:var(--moss-66)]' : 'bg-[color:var(--moss-50)]'}`}
      />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[color:var(--moss-50)]" />
            <h3 className="text-sm font-extrabold text-[color:var(--ink-24)]">{t('home.todayPlan.tag')}</h3>
          </div>
          <span className="text-[11px] text-[color:var(--ink-62)]">{t('home.todayPlan.desc')}</span>
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
                <div className="text-base font-extrabold text-[color:var(--ink-24)] leading-tight">
                  {primary.label}
                </div>
                <div className="text-xs text-[color:var(--ink-50)] mt-0.5">{primary.detail}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={primary.run}
              className="w-full py-3.5 bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] text-[color:var(--paper-95)] font-extrabold text-sm rounded-2xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
            >
              {primary.cta}
              <ArrowRight className="w-4 h-4" />
            </button>

            {rest.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-[color:var(--ink-62)]">{t('common.next')}</div>
                {rest.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={s.run}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[color:var(--paper-92)] bg-[color:var(--paper-bg)] hover:bg-[color:var(--paper-bg)] hover:border-[color:var(--moss-50)] transition-all cursor-pointer text-left"
                  >
                    <span
                      className={`w-7 h-7 rounded-lg ${s.tint} ${s.fg} flex items-center justify-center shrink-0`}
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[color:var(--ink-24)]">{s.label}</span>
                    <span className="text-[11px] text-[color:var(--ink-50)] truncate">{s.detail}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[color:var(--paper-81)] ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-12 h-12 rounded-2xl bg-[color:var(--moss-93)] text-[color:var(--moss-50)] flex items-center justify-center">
              <Check className="w-6 h-6" strokeWidth={3} />
            </div>
            <div>
              <div className="text-base font-extrabold text-[color:var(--ink-24)]">{t('home.todayPlan.allClearTitle')}</div>
              <div className="text-xs text-[color:var(--ink-50)] mt-1 leading-relaxed">
                {t('home.todayPlan.allClearDesc')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="px-5 py-2.5 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)] hover:bg-[color:var(--paper-bg)] text-[color:var(--ink-24)] font-bold text-xs rounded-xl btn-lift cursor-pointer flex items-center gap-2"
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
