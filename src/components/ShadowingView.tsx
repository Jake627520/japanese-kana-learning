import React, { useState, useRef, useEffect } from 'react';
import { SHADOWING_SENTENCES, ShadowingSentence } from '../data/shadowing';
import {
  Headphones,
  Volume2,
  Mic,
  Square,
  Play,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  VolumeX,
  AudioLines,
} from 'lucide-react';

export function ShadowingView() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<Record<string, string>>({}); // id -> audioUrl
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isSpeakingTts, setIsSpeakingTts] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const currentSentence: ShadowingSentence = SHADOWING_SENTENCES[currentIndex];
  const userAudioUrl = recordings[currentSentence.id];

  // Stop any ongoing speech or playback when changing sentences or unmounting
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

  useEffect(() => {
    stopAllAudio();
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Play Native TTS at specified rate
  const playNativeTts = (rate: number, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援語音合成功能。');
      return;
    }

    window.speechSynthesis.cancel();
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
    }

    const utterance = new SpeechSynthesisUtterance(currentSentence.japanese);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith('ja'));
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
        const url = URL.createObjectURL(audioBlob);
        setRecordings((prev) => ({
          ...prev,
          [currentSentence.id]: url,
        }));
        // Stop stream tracks
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

  // AB comparison: Play native TTS first -> automatically play user recording
  const handleCompare = () => {
    if (!userAudioUrl) {
      alert('請先完成自己的錄音後再進行對照播放！');
      return;
    }

    setIsComparing(true);
    // Play TTS (0.9 speed) -> on end, play user recording
    playNativeTts(0.9, () => {
      setTimeout(() => {
        playUserRecording(() => {
          setIsComparing(false);
        });
      }, 300); // 300ms pause between native and user
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-bold">
            <Headphones className="w-3.5 h-3.5" />
            影子跟讀法 (Shadowing)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
            日語口說跟讀與發音自我比對
          </h2>
          <p className="text-xs text-[#64748B]">
            邊聽母語示範邊即時模仿跟讀，錄下自己的聲音進行對照，快速校正語調與節奏。
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-[#64748B]">進度</span>
          <div className="text-lg sm:text-xl font-extrabold text-[#00A86B]">
            {currentIndex + 1} / {SHADOWING_SENTENCES.length}
          </div>
        </div>
      </div>

      {/* Main Practice Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
        {/* Sentence Display */}
        <div className="space-y-4 text-center py-4 border-b border-[#F1F5F9]">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-wide leading-relaxed">
            {currentSentence.japanese}
          </div>
          <div className="text-sm font-medium text-[#64748B] font-mono">
            {currentSentence.romaji}
          </div>
          <div className="text-base font-bold text-[#00A86B]">
            {currentSentence.meaning}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAFBFB] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B]">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            <span>重點：{currentSentence.focus}</span>
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
          <div className="p-5 rounded-2xl bg-[#FAFBFB] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
              <Volume2 className="w-4 h-4 text-[#00A86B]" />
              母語示範發音
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
          <div className="p-5 rounded-2xl bg-[#FAFBFB] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#00A86B]" />
                你的跟讀錄音
              </span>
              {userAudioUrl && (
                <span className="text-[#00A86B] bg-[#E6F8F2] px-2 py-0.5 rounded-full text-[10px]">
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
            className="w-full py-3.5 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white font-extrabold text-xs sm:text-sm rounded-2xl hover:opacity-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AudioLines className="w-4 h-4" />
            {isComparing ? '正在連續對照播放中...' : '母語版 → 我的錄音（連貫對照比對）'}
          </button>
        </div>

        {/* Sentence Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 bg-[#FAFBFB] hover:bg-white border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            上一句
          </button>

          <span className="text-xs text-[#94A3B8]">
            第 {currentIndex + 1} 句 / 共 {SHADOWING_SENTENCES.length} 句
          </span>

          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(SHADOWING_SENTENCES.length - 1, prev + 1))}
            disabled={currentIndex === SHADOWING_SENTENCES.length - 1}
            className="px-4 py-2.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一句
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
