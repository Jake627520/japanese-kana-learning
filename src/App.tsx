import React, { useState, useEffect, useMemo, lazy, Suspense, startTransition } from 'react';
import { UserProgress, KanaItem, NavigationTab, KanaType } from './types';
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUTEN_DATA, HANDAKUTEN_DATA, YOUON_DATA, ALL_LEARNABLE_KANA } from './data/kanaData';
import { getStoredProgress } from './utils/storage';
import { HomeDashboard } from './components/HomeDashboard';
import { Navigation } from './components/Navigation';
import { I18nProvider, Language, Messages, useI18n } from './i18n';
import { loadJlptExplanations } from './data/jlpt/explanations';

// 首頁與導覽列以外的分頁改為按需載入，縮小首屏 JS（JLPT 題庫、單字等資料只進各自的 chunk）
const tabLoaders = {
  grid: () => import('./components/GojuuonGrid'),
  study: () => import('./components/KanaCardView'),
  quiz: () => import('./components/QuizView'),
  review: () => import('./components/ReviewView'),
  special: () => import('./components/SpecialSoundsView'),
  jlpt: () => import('./components/JlptPracticeView'),
  shadowing: () => import('./components/ShadowingView'),
  chat: () => import('./components/ChatTutorView'),
  writing: () => import('./components/WritingPracticeView'),
  confusable: () => import('./components/ConfusableView'),
};

const GojuuonGrid = lazy(() => tabLoaders.grid().then((m) => ({ default: m.GojuuonGrid })));
const KanaCardView = lazy(() => tabLoaders.study().then((m) => ({ default: m.KanaCardView })));
const QuizView = lazy(() => tabLoaders.quiz().then((m) => ({ default: m.QuizView })));
const ReviewView = lazy(() => tabLoaders.review().then((m) => ({ default: m.ReviewView })));
const SpecialSoundsView = lazy(() => tabLoaders.special().then((m) => ({ default: m.SpecialSoundsView })));
const JlptPracticeView = lazy(() => tabLoaders.jlpt().then((m) => ({ default: m.JlptPracticeView })));
const ShadowingView = lazy(() => tabLoaders.shadowing().then((m) => ({ default: m.ShadowingView })));
const ChatTutorView = lazy(() => tabLoaders.chat().then((m) => ({ default: m.ChatTutorView })));
const WritingPracticeView = lazy(() => tabLoaders.writing().then((m) => ({ default: m.WritingPracticeView })));
const ConfusableView = lazy(() => tabLoaders.confusable().then((m) => ({ default: m.ConfusableView })));

// 首屏畫完、瀏覽器閒置時預先抓所有分頁 chunk 與目前語言的 JLPT 解說：
// 1. 之後切分頁幾乎不會看到佔位；2. Service worker 用「用到才存」，
//    不預抓的話，離線時沒開過的分頁會載不到 chunk。
// 其他語言的解說不抓；換語言後會再跑一次，抓新語言的那份。
function prefetchForOffline(language: Language) {
  Object.values(tabLoaders).forEach((load) => load().catch(() => {}));
  loadJlptExplanations(language).catch(() => {});
}

// 分頁 chunk 載入中的佔位：不放 spinner，只保留高度，避免頁尾瞬間上跳
function TabLoadingFallback() {
  return <div className="min-h-[60vh]" aria-busy="true" />;
}

function AppContent() {
  const { t, language } = useI18n();
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress());
  const [currentTab, setCurrentTabState] = useState<NavigationTab>('home');
  // 切換分頁走 transition：新分頁的 chunk 還沒好時先留著舊畫面，不閃出空白佔位
  const setCurrentTab = (tab: NavigationTab) => startTransition(() => setCurrentTabState(tab));
  const [currentKanaCategory, setCurrentKanaCategory] = useState<'basic' | 'dakuten' | 'handakuten' | 'youon'>('basic');
  const [currentKanaType, setCurrentKanaType] = useState<KanaType>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);
  const [targetWritingKanaId, setTargetWritingKanaId] = useState<string | null>(null);
  const [targetConfusionGroupId, setTargetConfusionGroupId] = useState<string | null>(null);

  const currentKanaData = useMemo(() => {
    if (currentKanaCategory === 'dakuten') {
      return DAKUTEN_DATA.filter((k) => k.type === currentKanaType);
    }
    if (currentKanaCategory === 'handakuten') {
      return HANDAKUTEN_DATA.filter((k) => k.type === currentKanaType);
    }
    if (currentKanaCategory === 'youon') {
      return YOUON_DATA.filter((k) => k.type === currentKanaType);
    }
    return currentKanaType === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
  }, [currentKanaCategory, currentKanaType]);

  // Refresh stored progress state
  const refreshProgress = () => {
    setProgress(getStoredProgress());
  };

  useEffect(() => {
    refreshProgress();
  }, [currentTab]);

  useEffect(() => {
    // Safari 沒有 requestIdleCallback，退回 setTimeout
    const prefetch = () => prefetchForOffline(language);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 2000);
    return () => clearTimeout(id);
  }, [language]);

  const handleStartStudyKana = (kana: KanaItem) => {
    setSelectedKana(kana);
    setCurrentTab('study');
  };

  const handleSelectTab = (tab: NavigationTab) => {
    setTargetWritingKanaId(null);
    setTargetConfusionGroupId(null);
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-[color:var(--paper-91)] text-[color:var(--ink-24)] font-sans antialiased selection:bg-[color:var(--aotake-50)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Sidebar & Mobile Nav Navigation */}
          <Navigation
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            wrongCount={progress.wrongKanaIds.length}
          />

          {/* Main Content View Container */}
          <main className="flex-1 w-full min-w-0 pb-24 lg:pb-8">
            <Suspense fallback={<TabLoadingFallback />}>
              {currentTab === 'home' && (
                <HomeDashboard
                  progress={progress}
                  allKana={ALL_LEARNABLE_KANA}
                  onNavigate={handleSelectTab}
                  onStartStudyKana={handleStartStudyKana}
                  onPracticeWriting={(kana) => {
                    setTargetWritingKanaId(kana.id);
                    setCurrentTab('writing');
                  }}
                  onPracticeConfusionGroup={(groupId) => {
                    setTargetConfusionGroupId(groupId);
                    setCurrentTab('confusable');
                  }}
                />
              )}

              {currentTab === 'grid' && (
                <GojuuonGrid
                  allKana={currentKanaData}
                  progress={progress}
                  kanaCategory={currentKanaCategory}
                  onKanaCategoryChange={(cat) => setCurrentKanaCategory(cat)}
                  kanaType={currentKanaType}
                  onKanaTypeChange={(type) => setCurrentKanaType(type)}
                  onSelectKana={handleStartStudyKana}
                />
              )}

              {currentTab === 'study' && (
                <KanaCardView
                  currentKana={selectedKana}
                  allKana={currentKanaData}
                  masteredIds={progress.masteredKanaIds}
                  onProgressChange={refreshProgress}
                  onBackToGrid={() => setCurrentTab('grid')}
                  onSelectKana={(kana) => setSelectedKana(kana)}
                />
              )}

              {currentTab === 'quiz' && (
                <QuizView
                  allKana={ALL_LEARNABLE_KANA}
                  onProgressChange={refreshProgress}
                  onFinish={() => setCurrentTab('home')}
                  onNavigateToReview={() => setCurrentTab('review')}
                  onPracticeWriting={(kana) => {
                    setTargetWritingKanaId(kana.id);
                    setCurrentTab('writing');
                  }}
                />
              )}

              {currentTab === 'review' && (
                <ReviewView
                  allKana={ALL_LEARNABLE_KANA}
                  progress={progress}
                  onProgressChange={refreshProgress}
                  onStartStudyKana={handleStartStudyKana}
                />
              )}

              {currentTab === 'special' && <SpecialSoundsView />}

              {currentTab === 'jlpt' && <JlptPracticeView />}

              {currentTab === 'shadowing' && <ShadowingView />}

              {currentTab === 'chat' && <ChatTutorView onProgressChange={refreshProgress} />}

              {currentTab === 'writing' && (
                <WritingPracticeView
                  initialKanaId={targetWritingKanaId}
                  onProgressChange={refreshProgress}
                />
              )}

              {currentTab === 'confusable' && (
                <ConfusableView
                  initialGroupId={targetConfusionGroupId}
                  onProgressChange={refreshProgress}
                />
              )}
            </Suspense>
          </main>
        </div>

        {/* 全站頁尾：音源標示與說明 */}
        <footer className="mt-10 pt-6 border-t border-[color:var(--paper-85)] pb-28 lg:pb-8">
          <div className="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
            <p className="text-[11px] text-[color:var(--ink-62)]">
              {t('footer.voicevoxPrefix')}
              <span className="font-semibold text-[color:var(--ink-50)]">{t('footer.voicevoxName')}</span>
              <span className="mx-1.5">·</span>
              {t('footer.browserSpeechNote')}
            </p>

            <div className="w-full flex flex-col gap-2.5">
              <p className="text-[11px] text-[color:var(--ink-62)] leading-[1.9] text-pretty">
                {t('footer.noInstallNeeded')}
                <span className="font-semibold text-[color:var(--ink-50)]">{t('footer.noInstallNeededBold')}</span>
                {t('footer.noInstallNeededSuffix')}
              </p>
              <p className="text-[11px] text-[color:var(--ink-62)] leading-[1.9] text-pretty">
                {t('footer.iphoneMuteTipPrefix')}
                <span className="font-semibold text-[color:var(--ink-50)]">{t('footer.iphoneMuteTipBold')}</span>
                {t('footer.iphoneMuteTipSuffix')}
              </p>
            </div>

            <p className="text-[11px] text-[color:var(--ink-62)] pt-3 border-t border-[color:var(--paper-92)] w-full">
              {t('footer.siteTitle')}
              <span className="mx-1.5">·</span>
              {t('footer.mitLicense')}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App({ messages }: { messages: Messages }) {
  return (
    <I18nProvider initial={messages}>
      <AppContent />
    </I18nProvider>
  );
}
