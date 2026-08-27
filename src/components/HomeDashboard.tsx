import React, { useMemo } from 'react';
import { UserProgress, KanaItem, NavigationTab } from '../types';
import { getDueReviewItems } from '../utils/storage';
import { getLearningEvents } from '../utils/learningEvents';
import {
  getTodayStats,
  getWeakKanaRanking,
  getSevenDayTrend,
  getAIRecommendation,
} from '../utils/analytics';
import { HeaderStats } from './HeaderStats';
import { DataBackupCard } from './DataBackupCard';
import { LearningPathCard } from './LearningPathCard';
import { KanaMasteryMap } from './KanaMasteryMap';
import { SectionHeading } from './SectionHeading';
import { TodayPlanCard } from './TodayPlanCard';
import { WeakKanaShadowingCard } from './WeakKanaShadowingCard';
import { getShadowingProgress, getTodaySentences } from '../lib/shadowingProgress';
import { useI18n } from '../i18n';
import {
  ArrowRight,
  RefreshCw,
  Sparkles,
  Headphones,
  Activity,
  TrendingUp,
  Target,
  PenLine,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface HomeDashboardProps {
  progress: UserProgress;
  allKana: KanaItem[];
  onNavigate: (tab: NavigationTab) => void;
  onStartStudyKana: (kana: KanaItem) => void;
  onPracticeWriting?: (kana: KanaItem) => void;
}

export function HomeDashboard({
  progress,
  allKana,
  onNavigate,
  onStartStudyKana,
  onPracticeWriting,
}: HomeDashboardProps) {
  const { t } = useI18n();
  const dueItems = getDueReviewItems(allKana, progress);
  const wrongKanaList = allKana.filter((k) => progress.wrongKanaIds.includes(k.id));

  // Compute analytics data purely from event stream & progress state
  const learningEvents = useMemo(() => getLearningEvents(), []);
  const todayStats = useMemo(() => getTodayStats(learningEvents), [learningEvents]);
  const sevenDayTrend = useMemo(() => getSevenDayTrend(learningEvents), [learningEvents]);
  const weakRanking = useMemo(() => getWeakKanaRanking(learningEvents, 3, 3), [learningEvents]);
  const aiRecommendation = useMemo(
    () => getAIRecommendation(progress, learningEvents),
    [progress, learningEvents]
  );

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

  const handleRecommendationAction = () => {
    if (aiRecommendation.recommendedAction === 'writing') {
      if (aiRecommendation.targetKanaId && onPracticeWriting) {
        const target = allKana.find((k) => k.id === aiRecommendation.targetKanaId);
        if (target) {
          onPracticeWriting(target);
          return;
        }
      }
      onNavigate('writing');
    } else if (aiRecommendation.recommendedAction === 'review') {
      onNavigate('review');
    } else if (aiRecommendation.recommendedAction === 'shadowing') {
      onNavigate('shadowing');
    } else {
      onNavigate('quiz');
    }
  };

  // Find max activity count in 7-day trend for responsive SVG scaling
  const maxTrendCount = Math.max(...sevenDayTrend.map((d) => d.count), 5);

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

      {/* AI 智能學習建議 (AI Recommendation Card) */}
      <div className="bg-gradient-to-br from-white to-[#F6FCF9] p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('analytics.recommendation')}
          </div>
          {aiRecommendation.priority === 'high' && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              High Priority
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#1E293B] flex items-center gap-2">
              {aiRecommendation.recommendedAction === 'writing' && <PenLine className="w-5 h-5 text-[#00A86B]" />}
              {aiRecommendation.recommendedAction === 'review' && <BookOpen className="w-5 h-5 text-[#00A86B]" />}
              {aiRecommendation.recommendedAction === 'shadowing' && <Headphones className="w-5 h-5 text-[#00A86B]" />}
              {aiRecommendation.recommendedAction === 'quiz' && <Target className="w-5 h-5 text-[#00A86B]" />}
              {t(aiRecommendation.titleKey)}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {t(aiRecommendation.reasonKey, aiRecommendation.reasonParams)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRecommendationAction}
            className="w-full sm:w-auto px-5 py-3 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-xs rounded-xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>{t('analytics.startAction')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 今日學習 */}
      <TodayPlanCard progress={progress} allKana={allKana} onNavigate={onNavigate} />

      {/* 今日學習統計與 7 日趨勢 (Analytics Dashboard) */}
      <div className="space-y-3">
        <SectionHeading>{t('analytics.today')}</SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 今日學習數據細分 */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#00A86B]" />
                {t('analytics.today')}
              </span>
              <span className="text-xs font-extrabold text-[#00A86B] bg-[#E6F8F2] px-2.5 py-0.5 rounded-full">
                {t('analytics.total')}: {todayStats.totalActions}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9]">
                <div className="text-[11px] font-bold text-[#64748B]">{t('analytics.quiz')}</div>
                <div className="text-xl font-extrabold text-[#1E293B] mt-0.5">{todayStats.quizCount}</div>
              </div>
              <div className="p-3 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9]">
                <div className="text-[11px] font-bold text-[#64748B]">{t('analytics.review')}</div>
                <div className="text-xl font-extrabold text-[#1E293B] mt-0.5">{todayStats.reviewCount}</div>
              </div>
              <div className="p-3 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9]">
                <div className="text-[11px] font-bold text-[#64748B]">{t('analytics.writing')}</div>
                <div className="text-xl font-extrabold text-[#1E293B] mt-0.5">{todayStats.writingCount}</div>
              </div>
              <div className="p-3 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9]">
                <div className="text-[11px] font-bold text-[#64748B]">{t('analytics.shadowing')}</div>
                <div className="text-xl font-extrabold text-[#1E293B] mt-0.5">{todayStats.shadowingCount}</div>
              </div>
            </div>
          </div>

          {/* 7 日趨勢原生 SVG 圖表 (Zero Dependency) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#00A86B]" />
                {t('analytics.sevenDayTrend')}
              </span>
              <span className="text-[11px] text-[#94A3B8]">Past 7 Days</span>
            </div>

            {/* 原生 SVG 響應式柱狀圖 */}
            <div className="w-full pt-2">
              <div
                className="grid grid-cols-7 gap-2 items-end h-28 px-2"
                role="img"
                aria-label={t('analytics.sevenDayTrend')}
              >
                {sevenDayTrend.map((item, idx) => {
                  const heightPercent = Math.max(8, Math.round((item.count / maxTrendCount) * 100));
                  const isToday = idx === 6;
                  return (
                    <div key={item.date} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div className="w-full bg-[#F1F5F9] rounded-lg h-full max-h-20 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-lg transition-all duration-500 ${
                            isToday ? 'bg-[#00A86B]' : 'bg-[#34D399]/80 group-hover:bg-[#00A86B]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                          title={`${item.date}: ${item.count} actions`}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${isToday ? 'text-[#00A86B]' : 'text-[#94A3B8]'}`}>
                        {item.displayDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 弱點假名排行 (Weak Kana Ranking Card) */}
      <div className="space-y-3">
        <SectionHeading>{t('analytics.weakKana')}</SectionHeading>

        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
          {weakRanking.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {weakRanking.map((w, idx) => {
                const kanaObj = allKana.find((k) => k.id === w.kanaId);
                const percent = Math.round(w.wrongRate * 100);
                return (
                  <div
                    key={w.kanaId}
                    className="p-4 bg-[#FAFBFB] rounded-2xl border border-red-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 font-extrabold text-xl flex items-center justify-center border border-red-200">
                        {kanaObj?.kana || w.kanaId}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E293B]">
                          #{idx + 1} {kanaObj?.romaji.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {w.wrongCount} / {w.attempts} {t('analytics.attempts')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-red-600">{percent}%</div>
                      <div className="text-[10px] text-[#94A3B8]">{t('analytics.errorRate')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs font-bold text-[#64748B] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
              {t('analytics.noWeakKana')}
            </div>
          )}
        </div>
      </div>

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
          <div aria-hidden className="h-1 bg-gradient-to-r from-blue-500 to-indigo-400" />
          <div className="p-6 flex flex-col justify-between gap-4 flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  {t('nav.review')}
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
