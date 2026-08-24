import { ALL_KANA_AUDIO } from '../data/kanaAudioMap';
import { CONTENT_AUDIO } from '../data/contentAudioMap';

// 全站的日語發音入口。8 個元件、17 個呼叫點都走這裡，所以音源策略集中在這一個
// 函式：有預先生成的 VOICEVOX 音檔就用它，沒有才退回瀏覽器 Web Speech。
//
// 為什麼值得替假名準備音檔：瀏覽器 TTS 唸單一假名時品質很不穩定——有些引擎會
// 把它當字母名稱唸、拗音與促音也常常糊掉，而這正是初學者要聽準的東西。
//
// 例詞、例句、特殊音例字也一併預生成了（見 gen-content-audio.mjs）：在補之前，
// 特殊音頁唸的全是單字（がっこう・コーヒー），完全落在 TTS 上，同一個網站
// 會出現兩種音色，聽起來像壞了。
//
// Web Speech 仍然保留當 fallback：對話教室的自由輸入無法預先生成，
// 音檔缺失或解碼失敗時也要有東西能發聲。
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

  // 先查單假名，再查例詞／例句；兩個 map 的 key 不重疊（單假名不會出現在例詞裡）
  const kanaFile = ALL_KANA_AUDIO[text];
  const contentFile = kanaFile ? null : CONTENT_AUDIO[text];
  const src = kanaFile
    ? `${import.meta.env.BASE_URL}audio/kana/${kanaFile}.mp3`
    : contentFile
    ? `${import.meta.env.BASE_URL}audio/content/${contentFile}.mp3`
    : null;

  if (src) {
    const el = new Audio(src);
    current = el;
    // 音檔缺失或解碼失敗時不要靜默失敗，退回 TTS 讓使用者仍聽得到
    el.onerror = () => speakWithTts(text);
    el.play().catch(() => speakWithTts(text));
    return;
  }

  speakWithTts(text);
}
