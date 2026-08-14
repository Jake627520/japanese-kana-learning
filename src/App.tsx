import React, { useState, useEffect } from 'react';
import { UserProgress, KanaItem, NavigationTab } from './types';
import { HIRAGANA_DATA } from './data/kanaData';
import { getStoredProgress } from './utils/storage';
import { HeaderStats } from './components/HeaderStats';
import { HomeDashboard } from './components/HomeDashboard';
import { GojuuonGrid } from './components/GojuuonGrid';
import { KanaCardView } from './components/KanaCardView';
import { QuizView } from './components/QuizView';
import { ReviewView } from './components/ReviewView';
import { Navigation } from './components/Navigation';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);

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

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#2D3436] font-sans antialiased selection:bg-[#00D1B2]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Sidebar & Mobile Nav Navigation */}
          <Navigation
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            wrongCount={progress.wrongKanaIds.length}
          />

          {/* Main Content View Container */}
          <main className="flex-1 w-full min-w-0 pb-24 lg:pb-8">
            {currentTab === 'home' && (
              <HomeDashboard
                progress={progress}
                allKana={HIRAGANA_DATA}
                onNavigate={(tab) => setCurrentTab(tab)}
                onStartStudyKana={handleStartStudyKana}
              />
            )}

            {currentTab === 'grid' && (
              <GojuuonGrid
                allKana={HIRAGANA_DATA}
                masteredIds={progress.masteredKanaIds}
                onSelectKana={handleStartStudyKana}
              />
            )}

            {currentTab === 'study' && (
              <KanaCardView
                currentKana={selectedKana}
                allKana={HIRAGANA_DATA}
                masteredIds={progress.masteredKanaIds}
                onProgressChange={refreshProgress}
                onBackToGrid={() => setCurrentTab('grid')}
                onSelectKana={(kana) => setSelectedKana(kana)}
              />
            )}

            {currentTab === 'quiz' && (
              <QuizView
                allKana={HIRAGANA_DATA}
                onProgressChange={refreshProgress}
                onFinish={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'review' && (
              <ReviewView
                allKana={HIRAGANA_DATA}
                wrongIds={progress.wrongKanaIds}
                onProgressChange={refreshProgress}
                onStartStudyKana={handleStartStudyKana}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
