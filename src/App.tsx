import React, { useState, useEffect, useMemo } from 'react';
import { UserProgress, KanaItem, NavigationTab, KanaType } from './types';
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUTEN_DATA, HANDAKUTEN_DATA, YOUON_DATA, ALL_LEARNABLE_KANA } from './data/kanaData';
import { getStoredProgress } from './utils/storage';
import { HeaderStats } from './components/HeaderStats';
import { HomeDashboard } from './components/HomeDashboard';
import { GojuuonGrid } from './components/GojuuonGrid';
import { KanaCardView } from './components/KanaCardView';
import { QuizView } from './components/QuizView';
import { ReviewView } from './components/ReviewView';
import { SpecialSoundsView } from './components/SpecialSoundsView';
import { JlptPracticeView } from './components/JlptPracticeView';
import { ShadowingView } from './components/ShadowingView';
import { ChatTutorView } from './components/ChatTutorView';
import { WritingPracticeView } from './components/WritingPracticeView';
import { ConfusableView } from './components/ConfusableView';
import { Navigation } from './components/Navigation';
import { I18nProvider, useI18n } from './i18n';

function AppContent() {
  const { t } = useI18n();
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
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
    <div className="min-h-screen bg-[#F8FAF8] text-[#2D3436] font-sans antialiased selection:bg-[#00D1B2]/20">
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
          </main>
        </div>

        {/* 全站頁尾：音源標示與說明 */}
        <footer className="mt-10 pt-6 border-t border-[#E2E8F0] pb-28 lg:pb-8">
          <div className="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
            <p className="text-[11px] text-[#94A3B8]">
              {t('footer.voicevoxPrefix')}
              <span className="font-semibold text-[#64748B]">{t('footer.voicevoxName')}</span>
              <span className="mx-1.5">·</span>
              {t('footer.browserSpeechNote')}
            </p>

            <div className="w-full flex flex-col gap-2.5">
              <p className="text-[11px] text-[#94A3B8] leading-[1.9] text-pretty">
                {t('footer.noInstallNeeded')}
                <span className="font-semibold text-[#64748B]">{t('footer.noInstallNeededBold')}</span>
                {t('footer.noInstallNeededSuffix')}
              </p>
              <p className="text-[11px] text-[#94A3B8] leading-[1.9] text-pretty">
                {t('footer.iphoneMuteTipPrefix')}
                <span className="font-semibold text-[#64748B]">{t('footer.iphoneMuteTipBold')}</span>
                {t('footer.iphoneMuteTipSuffix')}
              </p>
            </div>

            <p className="text-[11px] text-[#94A3B8] pt-3 border-t border-[#F1F5F9] w-full">
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

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
