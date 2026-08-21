import React, { useState, useRef, useEffect } from 'react';
import { SHADOWING_SENTENCES, ShadowingSentence } from '../data/shadowing';
import {
  getShadowingProgress,
  incrementPractice,
  toggleMarkedOk,
  ShadowingProgress,
} from '../lib/shadowingProgress';
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

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS: { id: Step; label: string; hint: string }[] = [
  { id: 1, label: '只聽', hint: '不看文字，專注聆聽母語發音的音調起伏與停頓節奏。' },
  { id: 2, label: '看字聽', hint: '對照日文文字再次聆聽，把耳朵聽到的聲音與字形對齊。' },
  { id: 3, label: '輕聲跟', hint: '邊播放母語發音邊小聲跟讀（同步跟隨），抓準語速與節拍。' },
  { id: 4, label: '錄音', hint: '以正常音量完整錄下自己的跟讀版本。' },
  { id: 5, label: '對照', hint: '連續播放「母語版 → 我的錄音」，用耳朵比對找出發音差異。' },
];

export function ShadowingView() {
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

  // 語音清單在 iOS Safari / 首次載入時，getVoices() 會同步回傳空陣列，要等
  // 'voiceschanged' 事件才有內容。這裡在掛載時就快取日文語音，之後 speak 優先
  // 讀 ref，避免第一次播放選不到日文語音、把日文念成英文腔（iOS 常見問題）。
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

  // Stop any ongoing speech or playback
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

  // Switch sentence clean up
  const goTo = (i: number) => {
    stopAllAudio();
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
    }
    setUserAudioUrl(null);
    setMicError(null);
    setStep(1);
    setCurrentIndex(i);
  };

  // Step change behavior: auto-hide in step 1, auto-show in step 2
  useEffect(() => {
    if (step === 1) {
      setHideJapanese(true);
      setHideKana(true);
      setHideRomaji(true);
    } else if (step === 2) {
      setHideJapanese(false);
      setHideKana(false);
      setHideRomaji(false);
    }
  }, [step]);

  useEffect(() => {
    return () => {
      stopAllAudio();
      if (userAudioUrl) {
        URL.revokeObjectURL(userAudioUrl);
      }
    };
  }, [userAudioUrl]);

  // Play Native TTS
  const playNativeTts = (rate: number, onEndCallback?: () => void) => {
    window.speechSynthesis?.cancel();
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
    }

    // 有預先生成的高品質音檔就優先播它——Web Speech 的日語在拗音、長音、
    // 促音上常常不夠自然，而跟讀練的正是這些。rate < 0.9 視為要慢速版。
    // 音檔缺任一速度時自動退回 TTS，所以可以一句一句補，不必等全部生完。
    const clip = rate < 0.9 ? currentSentence.audio?.slow : currentSentence.audio?.normal;
    if (clip) {
      const el = new Audio(`${import.meta.env.BASE_URL}${clip}`);
      setIsSpeakingTts(true);
      el.onended = () => {
        setIsSpeakingTts(false);
        onEndCallback?.();
      };
      el.onerror = () => {
        // 音檔壞掉或不存在時不要卡住流程，退回 TTS 繼續
        setIsSpeakingTts(false);
        speakWithTts(rate, onEndCallback);
      };
      el.play().catch(() => {
        setIsSpeakingTts(false);
        speakWithTts(rate, onEndCallback);
      });
      return;
    }

    speakWithTts(rate, onEndCallback);
  };

  const speakWithTts = (rate: number, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援語音合成功能。');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentSentence.japanese);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;

    const jaVoice =
      jaVoiceRef.current ||
      window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    setIsSpeakingTts(true);

    utterance.onend = () => {
      setIsSpeakingTts(false);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = () => {
      setIsSpeakingTts(false);
      setIsComparing(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start recording
  const startRecording = async () => {
    setMicError(null);
    stopAllAudio();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('您的瀏覽器或當前環境不支援麥克風錄音（請在 HTTPS 或 Localhost 下執行）。');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (userAudioUrl) URL.revokeObjectURL(userAudioUrl);
        const url = URL.createObjectURL(audioBlob);
        setUserAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      setMicError('無法取得麥克風權限，請確認瀏覽器已允許麥克風存取。');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Auto move to step 5 (compare)
      setStep(5);
    }
  };

  // Play user recording
  const playUserRecording = (onEndCallback?: () => void) => {
    if (!userAudioUrl) return;

    window.speechSynthesis.cancel();
    if (!userAudioPlayerRef.current) {
      userAudioPlayerRef.current = new Audio(userAudioUrl);
    } else {
      userAudioPlayerRef.current.src = userAudioUrl;
    }

    const player = userAudioPlayerRef.current;
    setIsPlayingUserAudio(true);

    player.onended = () => {
      setIsPlayingUserAudio(false);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    player.onerror = () => {
      setIsPlayingUserAudio(false);
      setIsComparing(false);
    };

    player.play().catch((e) => {
      console.error('Play audio failed:', e);
      setIsPlayingUserAudio(false);
      setIsComparing(false);
    });
  };

  // AB comparison: Play native TTS -> play user recording -> increment count
  const handleCompare = () => {
    if (!userAudioUrl) {
      alert('請先在步驟 4 完成自己的錄音後再進行對照播放！');
      return;
    }

    setIsComparing(true);
    playNativeTts(0.9, () => {
      setTimeout(() => {
        playUserRecording(() => {
          setIsComparing(false);
          const updated = incrementPractice(currentSentence.id);
          setProgress(updated);
        });
      }, 350);
    });
  };

  const isCurrentSentenceMarkedOk = progress.markedOk.includes(currentSentence.id);
  const currentSentencePracticedCount = progress.practiceCount[currentSentence.id] ?? 0;
  const todayDoneCount = progress.todayIds.filter(
    (id) => (progress.practiceCount[id] ?? 0) > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-bold">
            <Headphones className="w-3.5 h-3.5" />
            影子跟讀法 (Shadowing v0.1)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
            日語口說跟讀與發音自我比對
          </h2>
          <p className="text-xs text-[#64748B]">
            5 步科學跟讀流程：只聽 → 看字聽 → 輕聲跟 → 錄音 → 連貫對照。
          </p>
        </div>

        {/* Scope Switcher & Progress */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setFilterTodayOnly(false);
                goTo(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                !filterTodayOnly
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              全部 ({allList.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterTodayOnly(true);
                goTo(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                filterTodayOnly
                  ? 'bg-[#00A86B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              今日 3 句
            </button>
          </div>
          <div className="text-xs text-[#64748B] font-bold">
            今日已練：<span className="text-[#00A86B] font-extrabold">{todayDoneCount}</span> / 3
          </div>
        </div>
      </div>

      {/* Step Guide Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-[#1E293B]">步驟引導</span>
          <div className="flex flex-wrap gap-1.5">
            {STEPS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStep(st.id)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  step === st.id
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'bg-[#FAFBFB] text-[#64748B] border border-[#E2E8F0] hover:bg-white hover:text-[#1E293B]'
                }`}
              >
                {st.id}. {st.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          {STEPS.find((x) => x.id === step)?.hint}
        </p>
        {currentSentence.tip && (
          <p className="text-xs text-[#00A86B] font-bold flex items-center gap-1.5 pt-1 border-t border-[#F1F5F9]">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            本句重點：{currentSentence.tip}
          </p>
        )}
      </div>

      {/* Main Practice Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
        {/* Text Visibility Toggles */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setHideJapanese((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
              hideJapanese
                ? 'bg-[#1E293B] text-white border-[#1E293B]'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {hideJapanese ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {hideJapanese ? '顯示日文' : '隱藏日文'}
          </button>
          <button
            type="button"
            onClick={() => setHideKana((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
              hideKana
                ? 'bg-[#1E293B] text-white border-[#1E293B]'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {hideKana ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {hideKana ? '顯示假名' : '隱藏假名'}
          </button>
          <button
            type="button"
            onClick={() => setHideRomaji((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
              hideRomaji
                ? 'bg-[#1E293B] text-white border-[#1E293B]'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {hideRomaji ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {hideRomaji ? '顯示羅馬字' : '隱藏羅馬字'}
          </button>
        </div>

        {/* Sentence Display Area */}
        <div className="space-y-4 text-center py-6 border-y border-[#F1F5F9] bg-[#FAFBFB]/50 rounded-2xl">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-wide leading-relaxed min-h-[3rem] flex items-center justify-center">
            {hideJapanese ? (
              <span className="text-slate-300 font-mono tracking-widest select-none">
                •••• ••••••••
              </span>
            ) : (
              currentSentence.japanese
            )}
          </div>
          {!hideKana && (
            <div className="text-sm font-bold text-[#64748B]">
              {currentSentence.kana || currentSentence.reading}
            </div>
          )}
          {!hideRomaji && (
            <div className="text-xs font-medium text-[#94A3B8] font-mono">
              {currentSentence.romaji}
            </div>
          )}
          <div className="text-base font-bold text-[#00A86B]">
            {currentSentence.meaning}
          </div>
        </div>

        {/* Mic Permission Error Alert */}
        {micError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
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
                ? 'bg-white border-[#00A86B] ring-1 ring-[#00A86B]/30 shadow-xs'
                : 'bg-[#FAFBFB] border-[#E2E8F0]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#00A86B]" />
                母語示範發音
              </span>
              {step === 3 && (
                <span className="text-[10px] text-[#00A86B] bg-[#E6F8F2] px-2 py-0.5 rounded-full font-bold">
                  步驟 3：輕聲同步跟讀
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => playNativeTts(0.9)}
                disabled={isSpeakingTts || isComparing}
                className="flex-1 py-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 text-[#00A86B] fill-current" />
                正常語速
              </button>
              <button
                type="button"
                onClick={() => playNativeTts(0.6)}
                disabled={isSpeakingTts || isComparing}
                className="flex-1 py-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>🐢</span>
                慢速朗讀
              </button>
            </div>
          </div>

          {/* User Recording Column */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              step === 4
                ? 'bg-white border-[#00A86B] ring-1 ring-[#00A86B]/30 shadow-xs'
                : 'bg-[#FAFBFB] border-[#E2E8F0]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#00A86B]" />
                你的跟讀錄音
              </span>
              {userAudioUrl && (
                <span className="text-[#00A86B] bg-[#E6F8F2] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  已錄製
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isSpeakingTts || isComparing}
                  className="flex-1 py-3 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mic className="w-4 h-4" />
                  開始錄音
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  停止錄音
                </button>
              )}

              <button
                type="button"
                onClick={() => playUserRecording()}
                disabled={!userAudioUrl || isRecording || isSpeakingTts || isComparing || isPlayingUserAudio}
                className="flex-1 py-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 text-[#00A86B] fill-current" />
                播放我的錄音
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
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              step === 5
                ? 'bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white ring-2 ring-[#00A86B]/40'
                : 'bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white'
            }`}
          >
            <AudioLines className="w-4 h-4" />
            {isComparing
              ? '正在連續對照播放中...'
              : userAudioUrl
              ? '步驟 5：母語版 → 我的錄音（連貫對照比對）'
              : '母語版 → 我的錄音（請先在步驟 4 錄音）'}
          </button>
        </div>

        {/* Step Quick Navigation (上一步 / 下一步) */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
            className="px-4 py-2 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 上一步
          </button>
          <span className="text-xs font-bold text-[#64748B]">步驟 {step} / 5</span>
          <button
            type="button"
            disabled={step === 5}
            onClick={() => setStep((prev) => Math.min(5, prev + 1) as Step)}
            className="px-4 py-2 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一步 →
          </button>
        </div>

        {/* Practice Stats & Mark OK */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#F1F5F9] text-xs text-[#64748B] flex-wrap">
          <span>
            本句今日已練習：<span className="text-[#1E293B] font-extrabold">{currentSentencePracticedCount}</span> 次
          </span>
          <button
            type="button"
            onClick={() => setProgress(toggleMarkedOk(currentSentence.id))}
            className="font-extrabold text-[#00A86B] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            {isCurrentSentenceMarkedOk ? (
              <>
                <Check className="w-4 h-4" />
                已標記 OK
              </>
            ) : (
              '標記這句 OK'
            )}
          </button>
        </div>

        {/* Sentence Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            上一句
          </button>

          <span className="text-xs text-[#94A3B8] font-bold">
            第 {currentIndex + 1} 句 / 共 {list.length} 句
          </span>

          <button
            type="button"
            onClick={() => goTo(Math.min(list.length - 1, currentIndex + 1))}
            disabled={currentIndex === list.length - 1}
            className="px-4 py-2.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一句
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 音檔來源標示。VOICEVOX 的使用條款要求標明使用了 VOICEVOX 與角色名稱，
          這是使用其語音的必要條件，不是選擇性的裝飾。 */}
      <p className="text-[11px] text-[#94A3B8] text-center">
        示範語音：VOICEVOX:四国めたん
      </p>
    </div>
  );
}
