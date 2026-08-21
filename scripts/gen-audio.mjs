// 用 VOICEVOX 產生跟讀句的高品質日語音檔。
//
// 為什麼不是 Web Speech：瀏覽器內建語音的日語在拗音、長音、促音上常不夠自然，
// 而跟讀練的正是這些。VOICEVOX 可商用（需標示），且產出是靜態 mp3，
// 不需要後端、不需要 API key，直接跟著網站部署。
//
// 為什麼慢速版用 ffmpeg 而不是叫 VOICEVOX 用慢速合成：兩次合成會得到兩段
// 語調不同的音，跟讀時對不起來。改成用同一段原始音做時間拉伸（變速不變調），
// 正常版與慢速版的語調完全一致。
//
// 前置：
//   1. 安裝並啟動 VOICEVOX（https://voicevox.hiroshiba.jp/），它會在 50021 提供 API
//   2. 需要 ffmpeg（brew install ffmpeg）
// 執行：
//   node scripts/gen-audio.mjs            只補還沒生成的
//   node scripts/gen-audio.mjs --force    全部重生
//
// ⚠ 授權：VOICEVOX 產出的音檔可商用，但**必須標示使用了 VOICEVOX 與角色名**。
//    predefined speaker 見 http://127.0.0.1:50021/speakers

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'audio', 'shadowing');
const ENGINE = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VOICEVOX_SPEAKER ?? 2); // 2 = 四国めたん ノーマル（固定成同一位「老師」，中途換聲音會讓學習者以為換人）
const SLOW_TEMPO = 0.7;
const FORCE = process.argv.includes('--force');

// 從 TS 資料檔抽出 id 與 japanese，不 import TS（省掉建置步驟）
function loadSentences() {
  const src = readFileSync(join(ROOT, 'src', 'data', 'shadowing.ts'), 'utf8');
  const out = [];
  const re = /id:\s*'([^']+)'[\s\S]*?japanese:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], text: m[2] });
  return out;
}

async function synth(text) {
  const q = await fetch(
    `${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`,
    { method: 'POST' },
  );
  if (!q.ok) throw new Error(`audio_query failed: ${q.status}`);
  const query = await q.json();
  const s = await fetch(`${ENGINE}/synthesis?speaker=${SPEAKER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!s.ok) throw new Error(`synthesis failed: ${s.status}`);
  return Buffer.from(await s.arrayBuffer());
}

// 去頭尾靜音 + 音量正規化：長度不一的靜音會混進跟讀的節奏感受，
// 音量差則會變成「聽對了但不是靠聽音」的旁道線索。
const FILTERS =
  'silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,' +
  'areverse,silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,' +
  'loudnorm=I=-16:TP=-1.5:LRA=11';

function toMp3(wav, outPath, slow) {
  const tmp = outPath + '.tmp.wav';
  writeFileSync(tmp, wav);
  const af = slow ? `${FILTERS},atempo=${SLOW_TEMPO}` : FILTERS;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-af', af,
    '-ar', '44100', '-ac', '1', '-b:a', '96k', outPath]);
  unlinkSync(tmp);
}

const sentences = loadSentences();
if (!sentences.length) {
  console.error('✘ 沒有從 shadowing.ts 讀到句子，請確認資料格式');
  process.exit(1);
}

try {
  const v = await fetch(`${ENGINE}/version`);
  console.log(`VOICEVOX engine ${(await v.text()).trim()} @ ${ENGINE}，speaker=${SPEAKER}`);
} catch {
  console.error(`✘ 連不上 VOICEVOX (${ENGINE})。請先開啟 VOICEVOX 應用程式再執行。`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
let made = 0, skipped = 0;
for (const { id, text } of sentences) {
  const normal = join(OUT_DIR, `${id}.mp3`);
  const slow = join(OUT_DIR, `${id}-slow.mp3`);
  if (!FORCE && existsSync(normal) && existsSync(slow)) { skipped++; continue; }
  process.stdout.write(`  ${id} ${text.slice(0, 20)}… `);
  const wav = await synth(text);
  toMp3(wav, normal, false);
  toMp3(wav, slow, true);   // 同一段原始音做拉伸，語調才會一致
  made++;
  console.log('✔');
}

console.log(`\n完成：新生成 ${made}，略過 ${skipped}（已存在，--force 可重生）`);
console.log(`輸出：public/audio/shadowing/`);
console.log('\n接著把路徑填進 src/data/shadowing.ts 的 audio 欄位，例如：');
console.log(`  audio: { normal: 'audio/shadowing/sh-01.mp3', slow: 'audio/shadowing/sh-01-slow.mp3' },`);
console.log('\n⚠ 記得在網站上標示使用了 VOICEVOX 與角色名稱（授權要求）。');
