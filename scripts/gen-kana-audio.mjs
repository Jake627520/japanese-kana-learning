// 用 VOICEVOX 產生 208 個假名的發音。
//
// 假名發音跟句子不同，有兩個要注意的地方：
//   1. 單一假名餵給引擎有可能被念成「字母名稱」而不是那個音。已驗證 VOICEVOX
//      會正確解析成音素（あ→ア、っ→ッ、きゃ→キャ），包含小字與拗音。
//   2. 檔名用 id（h_a）而不是假名字元（あ）——檔名帶非 ASCII 在不同系統與
//      伺服器上容易出問題，用 id 也剛好對得上資料裡的 kana.id。
//
// 前置：開著 VOICEVOX（engine 在 50021）；需要 ffmpeg。
// 執行：node scripts/gen-kana-audio.mjs [--force]
//
// ⚠ 授權：VOICEVOX 產出可商用，但必須標示「VOICEVOX:四国めたん」。

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'audio', 'kana');
const ENGINE = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VOICEVOX_SPEAKER ?? 2); // 2 = 四国めたん，與跟讀句同一位「老師」
const FORCE = process.argv.includes('--force');

function loadKana() {
  const out = [];
  for (const f of ['kanaData', 'katakanaData', 'dakutenData', 'handakutenData', 'youonData']) {
    const s = readFileSync(join(ROOT, 'src', 'data', `${f}.ts`), 'utf8');
    for (const m of s.matchAll(/"id":\s*"([^"]+)"[\s\S]{0,200}?"kana":\s*"([^"]+)"/g)) {
      out.push({ id: m[1], kana: m[2] });
    }
  }
  return out;
}

async function synth(text) {
  const q = await fetch(`${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`,
    { method: 'POST' });
  if (!q.ok) throw new Error(`audio_query ${q.status}`);
  const query = await q.json();
  // 單一假名太短，前後留白會讓點擊後感覺有延遲；縮到最小
  query.prePhonemeLength = 0.03;
  query.postPhonemeLength = 0.03;
  const s = await fetch(`${ENGINE}/synthesis?speaker=${SPEAKER}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(query),
  });
  if (!s.ok) throw new Error(`synthesis ${s.status}`);
  return Buffer.from(await s.arrayBuffer());
}

// 去頭尾靜音 + 音量正規化。音量不一致在連續點擊多個假名時特別明顯。
const FILTERS =
  'silenceremove=start_periods=1:start_silence=0.03:start_threshold=-45dB,' +
  'areverse,silenceremove=start_periods=1:start_silence=0.03:start_threshold=-45dB,areverse,' +
  'loudnorm=I=-16:TP=-1.5:LRA=11';

function toMp3(wav, outPath) {
  const tmp = outPath + '.tmp.wav';
  writeFileSync(tmp, wav);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-af', FILTERS,
    '-ar', '44100', '-ac', '1', '-b:a', '96k', outPath]);
  unlinkSync(tmp);
}

try {
  const v = await fetch(`${ENGINE}/version`);
  console.log(`VOICEVOX ${(await v.text()).trim()} @ ${ENGINE}, speaker=${SPEAKER}`);
} catch {
  console.error(`✘ 連不上 VOICEVOX (${ENGINE})，請先開啟應用程式。`);
  process.exit(1);
}

const kana = loadKana();
mkdirSync(OUT_DIR, { recursive: true });
let made = 0, skipped = 0;
for (const { id, kana: ch } of kana) {
  const out = join(OUT_DIR, `${id}.mp3`);
  if (!FORCE && existsSync(out)) { skipped++; continue; }
  toMp3(await synth(ch), out);
  made++;
  if (made % 20 === 0) process.stdout.write(`  ...${made} 個\n`);
}
console.log(`\n完成：新生成 ${made}，略過 ${skipped}（--force 可重生）`);
console.log(`輸出：public/audio/kana/  共 ${kana.length} 個假名`);
