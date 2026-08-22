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

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [currentKanaCategory, setCurrentKanaCategory] = useState<'basic' | 'dakuten' | 'handakuten' | 'youon'>('basic');
  const [currentKanaType, setCurrentKanaType] = useState<KanaType>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);

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
                allKana={ALL_LEARNABLE_KANA}
                onNavigate={(tab) => setCurrentTab(tab)}
                onStartStudyKana={handleStartStudyKana}
              />
            )}

            {currentTab === 'grid' && (
              <GojuuonGrid
                allKana={currentKanaData}
                masteredIds={progress.masteredKanaIds}
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
              />
            )}

            {currentTab === 'review' && (
              <ReviewView
                allKana={ALL_LEARNABLE_KANA}
                wrongIds={progress.wrongKanaIds}
                onProgressChange={refreshProgress}
                onStartStudyKana={handleStartStudyKana}
              />
            )}

            {currentTab === 'special' && <SpecialSoundsView />}

            {currentTab === 'jlpt' && <JlptPracticeView />}

            {currentTab === 'shadowing' && <ShadowingView />}

            {currentTab === 'chat' && <ChatTutorView onProgressChange={refreshProgress} />}

            {currentTab === 'writing' && <WritingPracticeView onProgressChange={refreshProgress} />}

            {currentTab === 'confusable' && <ConfusableView onProgressChange={refreshProgress} />}
          </main>
        </div>

        {/* 全站頁尾：音源標示。
            VOICEVOX 的授權要求標明使用了 VOICEVOX 與角色名稱——站上 208 個假名
            與 18 句跟讀都用它產生，所以標示放在全站頁尾而不是只放跟讀頁。
            MIT 指的是本站程式碼，與音檔授權是兩回事，分開寫免得被誤解成
            音檔也是 MIT。 */}
        <footer className="mt-8 pt-6 border-t border-[#E2E8F0] text-center space-y-1 pb-24 lg:pb-6">
          <p className="text-[11px] text-[#94A3B8]">
            語音：<span className="font-semibold text-[#64748B]">VOICEVOX:四国めたん</span>
            {' · '}部分內容使用瀏覽器內建語音合成
          </p>
          <p className="text-[11px] text-[#94A3B8]">
            日語五十音速成 · 本站程式碼以 MIT 授權釋出
          </p>
        </footer>
      </div>
    </div>
  );
}
