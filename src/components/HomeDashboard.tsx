import React from 'react';
import { UserProgress, KanaItem, NavigationTab } from '../types';
import { getDueReviewItems } from '../utils/storage';
import { HeaderStats } from './HeaderStats';
import { DataBackupCard } from './DataBackupCard';
import { LearningPathCard } from './LearningPathCard';
import { KanaMasteryMap } from './KanaMasteryMap';
import { SectionHeading } from './SectionHeading';
import { TodayPlanCard } from './TodayPlanCard';
import { WeakKanaShadowingCard } from './WeakKanaShadowingCard';
import { getShadowingProgress, getTodaySentences } from '../lib/shadowingProgress';
import { useI18n } from '../i18n';
import { ArrowRight, RefreshCw, Sparkles, Headphones } from 'lucide-react';

interface HomeDashboardProps {
  progress: UserProgress;
  allKana: KanaItem[];
  onNavigate: (tab: NavigationTab) => void;
  onStartStudyKana: (kana: KanaItem) => void;
}

export function HomeDashboard({
  progress,
  allKana,
  onNavigate,
  onStartStudyKana,
}: HomeDashboardProps) {
  const { t } = useI18n();
  const dueItems = getDueReviewItems(allKana, progress);
  const wrongKanaList = allKana.filter((k) => progress.wrongKanaIds.includes(k.id));

  const shadowingProg = getShadowingProgress();
  const todayShadowingSentences = getTodaySentences();
  const shadowingDoneCount = shadowingProg.todayIds.filter(
    (id) => (shadowingProg.practiceCount[id] ?? 0) > 0
  ).length;

  const handleStartTodayShadowing = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shadowing-open-today', '1');
    }
    onNavigate('shadowing');
  };

  return (
    <div className="space-y-7">
      {/* Top Banner */}
      <div className="bg-[linear-gradient(135deg,#00A86B_0%,#009B63_55%,#007E51_100%)] rounded-3xl p-6 sm:p-8 text-white elev-3 rise-in relative overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 -right-10 opacity-[0.08] text-[110px] sm:text-[150px] font-extrabold leading-[0.9] tracking-wide whitespace-nowrap select-none text-right pointer-events-none [mask-image:linear-gradient(to_left,black_25%,transparent_75%)]"
        >
          あかさたな
          <br />
          アカサタナ
        </div>
        <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            {t('home.hero.tag')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            {t('home.hero.title')}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            {t('home.hero.desc')}
          </p>
        </div>
      </div>

      {/* 今日學習 */}
      <TodayPlanCard progress={progress} allKana={allKana} onNavigate={onNavigate} />

      {/* 今日概況 */}
      <div className="space-y-3">
        <SectionHeading>{t('home.sections.todayOverview')}</SectionHeading>
        <HeaderStats progress={progress} totalKana={allKana.length} />
        <KanaMasteryMap masteredIds={progress.masteredKanaIds} onNavigate={onNavigate} />
      </div>

      {/* 針對你的建議 */}
      <div className="space-y-3">
        <SectionHeading>{t('home.sections.recommendations')}</SectionHeading>
        <WeakKanaShadowingCard wrongKanaIds={progress.wrongKanaIds} onNavigate={onNavigate} />
        <LearningPathCard onNavigate={onNavigate} />
      </div>

      {/* 其他練習 */}
      <SectionHeading>{t('home.sections.otherPractices')}</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today Shadowing 3 Sentences Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift overflow-hidden flex flex-col">
          <div aria-hidden className="h-1 bg-gradient-to-r from-[#00A86B] to-[#34D399]" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  {t('nav.shadowing')}
                </span>
                <span className="text-xs font-bold text-[#64748B]">{shadowingDoneCount} / 3</span>
              </div>
              <h3 className="text-lg font-display font-bold text-[#1E293B]">{t('home.shadowingCard.title')}</h3>
              <p className="text-xs text-[#64748B]">
                {t('home.shadowingCard.desc')}
              </p>
            </div>

            <div className="space-y-1.5 my-1">
              {todayShadowingSentences.map((s) => {
                const isDone = (shadowingProg.practiceCount[s.id] ?? 0) > 0;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-xs text-[#334155] bg-[#FAFBFB] px-3 py-2 rounded-xl border border-[#F1F5F9]"
                  >
                    <span className={`font-extrabold ${isDone ? 'text-[#00A86B]' : 'text-slate-400'}`}>
                      {isDone ? '✓' : '•'}
                    </span>
                    <span className="truncate font-medium">{s.japanese}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleStartTodayShadowing}
              className="w-full py-3 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-xs rounded-xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
            >
              <Headphones className="w-4 h-4" />
              {t('home.shadowingCard.btnStart')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Due Review Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift overflow-hidden flex flex-col">
          <div aria-hidden className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full">
                  {t('nav.srsBadge')}
                </span>
                <span className="text-xs font-bold text-[#64748B]">{dueItems.length}</span>
              </div>
              <h3 className="text-lg font-display font-bold text-[#1E293B]">{t('review.dueTab')}</h3>
              <p className="text-xs text-[#64748B]">
                {dueItems.length > 0 ? `${t('home.todayPlan.dueCount')}: ${dueItems.length}` : t('review.noDueTitle')}
              </p>
            </div>

            {dueItems.length > 0 && (
              <div className="flex flex-wrap gap-2 my-1">
                {dueItems.slice(0, 6).map((k) => (
                  <span
                    key={k.id}
                    onClick={() => onStartStudyKana(k)}
                    className="w-10 h-10 bg-[#FAFBFB] border border-[#E2E8F0] rounded-xl flex items-center justify-center font-extrabold text-base text-[#1E293B] hover:border-[#00A86B] cursor-pointer"
                  >
                    {k.kana}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('review')}
              className="w-full py-3 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-[#00A86B]" />
              {t('home.reviewCard.btnStart')}
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* Weak Kana Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift overflow-hidden flex flex-col">
          <div aria-hidden className="h-1 bg-gradient-to-r from-red-500 to-red-300" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  {t('header.weak')}
                </span>
                <span className="text-xs font-bold text-[#64748B]">{wrongKanaList.length}</span>
              </div>
              <h3 className="text-lg font-display font-bold text-[#1E293B]">{t('header.weak')}</h3>
              <p className="text-xs text-[#64748B]">
                {wrongKanaList.length > 0 ? `${t('quiz.reviewWrongCount')}: ${wrongKanaList.length}` : t('review.noWeakTitle')}
              </p>
            </div>

            {wrongKanaList.length > 0 && (
              <div className="flex flex-wrap gap-2 my-1">
                {wrongKanaList.slice(0, 6).map((k) => (
                  <span
                    key={k.id}
                    onClick={() => onStartStudyKana(k)}
                    className="w-10 h-10 bg-[#FAFBFB] border border-red-200 rounded-xl flex items-center justify-center font-extrabold text-base text-red-600 hover:border-red-400 cursor-pointer"
                  >
                    {k.kana}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('review')}
              className="w-full py-3 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] hover:border-red-400 text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {t('home.quizCard.btnStart')}
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
        </div>
      </div>

      {/* 資料與備份 */}
      <div className="space-y-3">
        <SectionHeading>{t('home.backup.title')}</SectionHeading>
        <DataBackupCard />
      </div>
    </div>
  );
}
