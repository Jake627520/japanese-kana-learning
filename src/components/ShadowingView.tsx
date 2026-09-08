import React, { useState, useRef, useEffect } from 'react';
import { SHADOWING_SENTENCES, ShadowingSentence, getShadowingText } from '../data/shadowing';
import {
  getShadowingProgress,
  incrementPractice,
  toggleMarkedOk,
  ShadowingProgress,
} from '../lib/shadowingProgress';
import { logLearningEvent } from '../utils/learningEvents';
import {
  Headphones,
  Volume2,
  Mic,
  Square,
  Play,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  VolumeX,
  AudioLines,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useI18n } from '../i18n';

type Step = 1 | 2 | 3 | 4 | 5;

export function ShadowingView() {
  const { t, language } = useI18n();
  const [progress, setProgress] = useState<ShadowingProgress>(() => getShadowingProgress());
  const [filterTodayOnly, setFilterTodayOnly] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const flag = sessionStorage.getItem('shadowing-open-today');
      if (flag === '1') {
        sessionStorage.removeItem('shadowing-open-today');
        return true;
      }
    }
    return false;
  });

  const stepsDef: { id: Step; label: string; hint: string }[] = [
    { id: 1, label: t('shadowing.listenNative'), hint: t('shadowing.tips') },
    { id: 2, label: t('common.details'), hint: t('shadowing.subtitle') },
    { id: 3, label: t('shadowing.pitchAccent'), hint: t('shadowing.tips') },
    { id: 4, label: t('shadowing.startRecord'), hint: t('shadowing.micHint') },
    { id: 5, label: t('shadowing.feedback'), hint: t('shadowing.tips') },
  ];

  const allList = SHADOWING_SENTENCES;
  const todayList = progress.todayIds
    .map((id) => allList.find((s) => s.id === id))
    .filter((x): x is ShadowingSentence => !!x);
  const list = filterTodayOnly && todayList.length > 0 ? todayList : allList;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [step, setStep] = useState<Step>(1);

  const [hideJapanese, setHideJapanese] = useState<boolean>(true);
  const [hideKana, setHideKana] = useState<boolean>(true);
  const [hideRomaji, setHideRomaji] = useState<boolean>(true);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isSpeakingTts, setIsSpeakingTts] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const jaVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const pick = () => {
      const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith('ja'));
      if (v) jaVoiceRef.current = v;
    };
    pick();
    window.speechSynthesis.addEventListener?.('voiceschanged', pick);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', pick);
  }, []);

  const currentSentence: ShadowingSentence = list[Math.min(currentIndex, list.length - 1)] || allList[0];

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current.currentTime = 0;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsSpeakingTts(false);
    setIsPlayingUserAudio(false);
    setIsComparing(false);
    setIsRecording(false);
  };

  const playPreGeneratedClip = (audioPath: string, rate = 1.0): Promise<void> => {
    return new Promise((resolve) => {
      stopAllAudio();
      setIsSpeakingTts(true);
      const audio = new Audio(audioPath);
      audio.playbackRate = rate;
      audio.onended = () => {
        setIsSpeakingTts(false);
        resolve();
      };
      audio.onerror = () => {
        setIsSpeakingTts(false);
        resolve();
      };
      audio.play().catch(() => {
        setIsSpeakingTts(false);
        resolve();
      });
    });
  };

  const playNativeTts = (rate = 0.9): Promise<void> => {
    const isSlow = rate < 0.8;
    const clipPath = isSlow
      ? currentSentence.audio?.slow || currentSentence.audio?.normal
      : currentSentence.audio?.normal;

    if (clipPath) {
      return playPreGeneratedClip(clipPath, isSlow ? 0.9 : 1.0);
    }

    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      stopAllAudio();
      setIsSpeakingTts(true);

      const utterance = new SpeechSynthesisUtterance(currentSentence.japanese);
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      if (jaVoiceRef.current) utterance.voice = jaVoiceRef.current;

      utterance.onend = () => {
        setIsSpeakingTts(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeakingTts(false);
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const startRecording = async () => {
    stopAllAudio();
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setUserAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setStep(4);
    } catch (e) {
      setMicError(t('shadowing.permissionDenied'));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playUserRecording = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!userAudioUrl) {
        resolve();
        return;
      }
      stopAllAudio();
      setIsPlayingUserAudio(true);

      const audio = new Audio(userAudioUrl);
      userAudioPlayerRef.current = audio;

      audio.onended = () => {
        setIsPlayingUserAudio(false);
        resolve();
      };
      audio.onerror = () => {
        setIsPlayingUserAudio(false);
        resolve();
      };
      audio.play().catch(() => {
        setIsPlayingUserAudio(false);
        resolve();
      });
    });
  };

  const handleCompare = async () => {
    if (!userAudioUrl || isRecording || isSpeakingTts || isComparing) return;
    setIsComparing(true);
    setStep(5);

    await playNativeTts(0.9);
    setTimeout(async () => {
      await playUserRecording();
      setIsComparing(false);
      const updated = incrementPractice(currentSentence.id);
      logLearningEvent({
        type: 'shadowing_complete',
        source: 'shadowing_view',
      });
      setProgress(updated);
    }, 400);
  };

  const goTo = (idx: number) => {
    stopAllAudio();
    setCurrentIndex(idx);
    setUserAudioUrl(null);
    setStep(1);
    setHideJapanese(true);
    setHideKana(true);
    setHideRomaji(true);
  };

  const isCurrentSentenceMarkedOk = progress.markedOk.includes(currentSentence.id);
  const currentSentencePracticedCount = progress.practiceCount[currentSentence.id] ?? 0;
  const todayDoneCount = progress.todayIds.filter(
    (id) => (progress.practiceCount[id] ?? 0) > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#F4EEDE] p-6 rounded-3xl border border-[#D9CDB2] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6EAD5] text-[#5C6B3D] rounded-full text-xs font-bold">
            <Headphones className="w-3.5 h-3.5" />
            {t('nav.shadowing')}
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#221F18]">
            {t('shadowing.title')}
          </h2>
          <p className="text-xs text-[#6B6252]">
            {t('shadowing.subtitle')}
          </p>
        </div>

        {/* Scope Switcher & Progress */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-[#ECE4D0] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setFilterTodayOnly(false);
                goTo(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                !filterTodayOnly
                  ? 'bg-[#F4EEDE] text-[#221F18] shadow-xs'
                  : 'text-[#6B6252] hover:text-[#221F18]'
              }`}
            >
              {t('shadowing.allTab')} ({allList.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterTodayOnly(true);
                goTo(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                filterTodayOnly
                  ? 'bg-[#5C6B3D] text-[#F1EFE0] shadow-xs'
                  : 'text-[#6B6252] hover:text-[#221F18]'
              }`}
            >
              {t('shadowing.todayTab')}
            </button>
          </div>
          <div className="text-xs text-[#6B6252] font-bold">
            {t('home.todayPlan.dueCount')}: <span className="text-[#5C6B3D] font-extrabold">{todayDoneCount}</span> / 3
          </div>
        </div>
      </div>

      {/* Step Guide Bar */}
      <div className="bg-[#F4EEDE] p-5 rounded-3xl border border-[#D9CDB2] shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-[#221F18]">{t('common.details')}</span>
          <div className="flex flex-wrap gap-1.5">
            {stepsDef.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStep(st.id)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  step === st.id
                    ? 'bg-[#5C6B3D] text-[#F1EFE0] shadow-xs'
                    : 'bg-[#F4EEDE] text-[#6B6252] border border-[#D9CDB2] hover:bg-[#F4EEDE] hover:text-[#221F18]'
                }`}
              >
                {st.id}. {st.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#6B6252] leading-relaxed">
          {stepsDef.find((x) => x.id === step)?.hint}
        </p>
        {currentSentence.tip && (
          <p className="text-xs text-[#5C6B3D] font-bold flex items-center gap-1.5 pt-1 border-t border-[#ECE4D0]">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            {getShadowingText(currentSentence.tip, language)}
          </p>
        )}
      </div>

      {/* Main Practice Card */}
      <div className="bg-[#F4EEDE] p-6 sm:p-8 rounded-3xl border border-[#D9CDB2] shadow-xs space-y-6">
        {/* Text Visibility Toggles */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setHideJapanese(!hideJapanese)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              hideJapanese
                ? 'bg-[#F4EEDE] text-[#6B6252] border-[#D9CDB2]'
                : 'bg-[#5C6B3D]/10 text-[#5C6B3D] border-[#5C6B3D]/30'
            }`}
          >
            {hideJapanese ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {t('shadowing.toggleJapanese')}
          </button>
          <button
            type="button"
            onClick={() => setHideKana(!hideKana)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              hideKana
                ? 'bg-[#F4EEDE] text-[#6B6252] border-[#D9CDB2]'
                : 'bg-[#5C6B3D]/10 text-[#5C6B3D] border-[#5C6B3D]/30'
            }`}
          >
            {hideKana ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {t('shadowing.toggleKana')}
          </button>
          <button
            type="button"
            onClick={() => setHideRomaji(!hideRomaji)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              hideRomaji
                ? 'bg-[#F4EEDE] text-[#6B6252] border-[#D9CDB2]'
                : 'bg-[#5C6B3D]/10 text-[#5C6B3D] border-[#5C6B3D]/30'
            }`}
          >
            {hideRomaji ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {t('shadowing.toggleRomaji')}
          </button>
        </div>

        {/* Sentence Display Area */}
        <div className="space-y-4 text-center py-6 border-y border-[#ECE4D0] bg-[#F4EEDE]/50 rounded-2xl">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#221F18] tracking-wide leading-relaxed min-h-[3rem] flex items-center justify-center">
            {hideJapanese ? (
              <span className="text-[#6B6252] font-mono tracking-widest select-none">
                •••• ••••••••
              </span>
            ) : (
              currentSentence.japanese
            )}
          </div>
          {!hideKana && (
            <div className="text-sm font-bold text-[#6B6252]">
              {currentSentence.kana || currentSentence.reading}
            </div>
          )}
          {!hideRomaji && (
            <div className="text-xs font-medium text-[#8F8674] font-mono">
              {currentSentence.romaji}
            </div>
          )}
          <div className="text-base font-bold text-[#5C6B3D]">
            {getShadowingText(currentSentence.meaning, language)}
          </div>
        </div>

        {/* Mic Permission Error Alert */}
        {micError && (
          <div className="p-3 bg-[#EFDBD5] border border-[#D8B8B0] text-[#A6443A] rounded-2xl text-xs font-bold flex items-center gap-2">
            <VolumeX className="w-4 h-4 shrink-0" />
            {micError}
          </div>
        )}

        {/* Audio Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Native Audio Column */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              step === 1 || step === 2 || step === 3
                ? 'bg-[#F4EEDE] border-[#5C6B3D] ring-1 ring-[#5C6B3D]/30 shadow-xs'
                : 'bg-[#F4EEDE] border-[#D9CDB2]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#6B6252]">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#5C6B3D]" />
                {t('shadowing.listenNative')}
              </span>
              {step === 3 && (
                <span className="text-[10px] text-[#5C6B3D] bg-[#E6EAD5] px-2 py-0.5 rounded-full font-bold">
                  {t('shadowing.speed')}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => playNativeTts(0.9)}
                disabled={isSpeakingTts || isComparing}
                className="flex-1 py-3 bg-[#F4EEDE] hover:bg-[#F0E9D8] border border-[#D9CDB2] hover:border-[#5C6B3D] text-[#221F18] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 text-[#5C6B3D] fill-current" />
                {t('shadowing.normal')}
              </button>
              <button
                type="button"
                onClick={() => playNativeTts(0.6)}
                disabled={isSpeakingTts || isComparing}
                className="flex-1 py-3 bg-[#F4EEDE] hover:bg-[#F0E9D8] border border-[#D9CDB2] hover:border-[#5C6B3D] text-[#221F18] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>🐢</span>
                {t('shadowing.slow')}
              </button>
            </div>
          </div>

          {/* User Recording Column */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              step === 4
                ? 'bg-[#F4EEDE] border-[#5C6B3D] ring-1 ring-[#5C6B3D]/30 shadow-xs'
                : 'bg-[#F4EEDE] border-[#D9CDB2]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#6B6252]">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#5C6B3D]" />
                {t('shadowing.playbackRecord')}
              </span>
              {userAudioUrl && (
                <span className="text-[#5C6B3D] bg-[#E6EAD5] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {t('common.completed')}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isSpeakingTts || isComparing}
                  className="flex-1 py-3 bg-[#5C6B3D] hover:bg-[#47552F] text-[#F1EFE0] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mic className="w-4 h-4" />
                  {t('shadowing.startRecord')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-[#F1EFE0] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  {t('shadowing.stopRecord')}
                </button>
              )}

              <button
                type="button"
                onClick={() => playUserRecording()}
                disabled={!userAudioUrl || isRecording || isSpeakingTts || isComparing || isPlayingUserAudio}
                className="flex-1 py-3 bg-[#F4EEDE] hover:bg-[#F0E9D8] border border-[#D9CDB2] hover:border-[#5C6B3D] text-[#221F18] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 text-[#5C6B3D] fill-current" />
                {t('shadowing.playbackRecord')}
              </button>
            </div>
          </div>
        </div>

        {/* Dual AB Comparison Playback Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCompare}
            disabled={!userAudioUrl || isRecording || isSpeakingTts || isComparing || isPlayingUserAudio}
            className="w-full py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#5C6B3D] to-[#47552F] text-[#F1EFE0]"
          >
            <AudioLines className="w-4 h-4" />
            {isComparing
              ? t('shadowing.feedback')
              : userAudioUrl
              ? `${t('shadowing.listenNative')} ➔ ${t('shadowing.playbackRecord')}`
              : t('shadowing.startRecord')}
          </button>
        </div>

        {/* Step Quick Navigation */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
            className="px-4 py-2 bg-[#F4EEDE] hover:bg-[#F4EEDE] border border-[#D9CDB2] text-[#6B6252] hover:text-[#221F18] font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {t('common.previous')}
          </button>
          <span className="text-xs font-bold text-[#6B6252]">{step} / 5</span>
          <button
            type="button"
            disabled={step === 5}
            onClick={() => setStep((prev) => Math.min(5, prev + 1) as Step)}
            className="px-4 py-2 bg-[#F4EEDE] hover:bg-[#F4EEDE] border border-[#D9CDB2] text-[#6B6252] hover:text-[#221F18] font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t('common.next')} →
          </button>
        </div>

        {/* Practice Stats & Mark OK */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#ECE4D0] text-xs text-[#6B6252] flex-wrap">
          <span>
            {t('shadowing.practiceCount')}: <span className="text-[#221F18] font-extrabold">{currentSentencePracticedCount}</span>
          </span>
          <button
            type="button"
            onClick={() => setProgress(toggleMarkedOk(currentSentence.id))}
            className="font-extrabold text-[#5C6B3D] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            {isCurrentSentenceMarkedOk ? (
              <>
                <Check className="w-4 h-4" />
                {t('common.completed')}
              </>
            ) : (
              t('common.confirm')
            )}
          </button>
        </div>

        {/* Sentence Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#ECE4D0]">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 bg-[#F4EEDE] hover:bg-[#F4EEDE] border border-[#D9CDB2] text-[#221F18] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('common.previous')}
          </button>

          <span className="text-xs text-[#8F8674] font-bold">
            {currentIndex + 1} / {list.length}
          </span>

          <button
            type="button"
            onClick={() => goTo(Math.min(list.length - 1, currentIndex + 1))}
            disabled={currentIndex === list.length - 1}
            className="px-4 py-2.5 bg-[#5C6B3D] hover:bg-[#47552F] text-[#F1EFE0] font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('common.next')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-[#8F8674] text-center">
        {t('footer.voicevoxPrefix')}{t('footer.voicevoxName')}
      </p>
    </div>
  );
}
