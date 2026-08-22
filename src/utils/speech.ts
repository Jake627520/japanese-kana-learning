import { ALL_KANA_AUDIO } from '../data/kanaAudioMap';

// 全站的日語發音入口。8 個元件、17 個呼叫點都走這裡，所以音源策略集中在這一個
// 函式：有預先生成的 VOICEVOX 音檔就用它，沒有才退回瀏覽器 Web Speech。
//
// 為什麼值得替假名準備音檔：瀏覽器 TTS 唸單一假名時品質很不穩定——有些引擎會
// 把它當字母名稱唸、拗音與促音也常常糊掉，而這正是初學者要聽準的東西。
//
// 保留 Web Speech 作為 fallback，是因為例詞、例句這些沒有預生成音檔的內容仍要能發音。
//
// ⚠ 音檔為 VOICEVOX:四国めたん 產生，使用時必須標示（授權要求，見跟讀頁面）。

let jaVoice: SpeechSynthesisVoice | null = null;

// iOS Safari 與多數瀏覽器首次載入時 getVoices() 會同步回傳空陣列，
// 要等 voiceschanged 才有內容。先快取起來，避免第一次發音選不到日語語音。
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const pick = () => {
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith('ja'));
    if (v) jaVoice = v;
  };
  pick();
  window.speechSynthesis.addEventListener?.('voiceschanged', pick);
}

let current: HTMLAudioElement | null = null;

function speakWithTts(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = 0.9;
    if (jaVoice) u.voice = jaVoice;
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error('Speech synthesis failed:', e);
  }
}

export function speakJapanese(text: string): void {
  // 連續點擊多個假名時，前一個要先停掉，否則會疊在一起
  window.speechSynthesis?.cancel();
  if (current) {
    current.pause();
    current = null;
  }

  const file = ALL_KANA_AUDIO[text];
  if (file) {
    const el = new Audio(`${import.meta.env.BASE_URL}audio/kana/${file}.mp3`);
    current = el;
    // 音檔缺失或解碼失敗時不要靜默失敗，退回 TTS 讓使用者仍聽得到
    el.onerror = () => speakWithTts(text);
    el.play().catch(() => speakWithTts(text));
    return;
  }

  speakWithTts(text);
}
