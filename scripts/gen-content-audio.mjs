// 用 VOICEVOX 產生「例詞・例句・特殊音例字」的發音。
//
// 為什麼需要這一支：gen-kana-audio.mjs 只做了 208 個單假名，其餘內容都還落回
// 瀏覽器內建 TTS——同一個網站兩種音色，在特殊音頁面（唸的全是單字）尤其明顯。
//
// 檔名用文字的 SHA-1 前 12 碼：例詞的 romaji 帶長音符號（kōhī）不是 ASCII，
// 直接當檔名在不同系統與伺服器上會出問題；雜湊同時保證同樣的文字只產生一份。
//
// 前置：開著 VOICEVOX（engine 在 50021）；需要 ffmpeg。
// 執行：node scripts/gen-content-audio.mjs [--force]
//
// ⚠ 授權：VOICEVOX 產出可商用，但必須標示「VOICEVOX:四国めたん」。

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'audio', 'content');
const ENGINE = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VOICEVOX_SPEAKER ?? 2); // 2 = 四国めたん，與假名、跟讀句同一位「老師」
const FORCE = process.argv.includes('--force');

const hashOf = (text) => createHash('sha1').update(text, 'utf8').digest('hex').slice(0, 12);

function collect() {
  const set = new Set();
  // 例詞與例句
  for (const f of readdirSync(join(ROOT, 'src', 'data')).filter((n) => n.endsWith('Data.ts'))) {
    const s = readFileSync(join(ROOT, 'src', 'data', f), 'utf8');
    for (const m of s.matchAll(/"word":\s*"([^"]+)"/g)) set.add(m[1]);
    for (const m of s.matchAll(/"sentence":\s*"([^"]+)"/g)) set.add(m[1]);
  }
  // 特殊音頁的例字（寫在元件裡，不在 data 底下）
  const sp = readFileSync(join(ROOT, 'src', 'components', 'SpecialSoundsView.tsx'), 'utf8');
  for (const m of sp.matchAll(/word:\s*'([^']+)'/g)) set.add(m[1]);
  return [...set];
}

async function synth(text) {
  const q = await fetch(`${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`,
    { method: 'POST' });
  if (!q.ok) throw new Error(`audio_query ${q.status}`);
  const query = await q.json();
  // 單字與句子比單假名長，留白可以稍多一點，聽起來才不會被切掉頭
  query.prePhonemeLength = 0.05;
  query.postPhonemeLength = 0.08;
  const s = await fetch(`${ENGINE}/synthesis?speaker=${SPEAKER}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(query),
  });
  if (!s.ok) throw new Error(`synthesis ${s.status}`);
  return Buffer.from(await s.arrayBuffer());
}

// 與假名音檔同一組處理：去頭尾靜音 + 音量正規化。
// 音量不一致在「先點假名再點例詞」時特別刺耳。
const FILTERS =
  'silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,' +
  'areverse,silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,' +
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

const items = collect();
mkdirSync(OUT_DIR, { recursive: true });
console.log(`要處理 ${items.length} 筆`);

const map = {};
let made = 0, skipped = 0;
for (const [i, text] of items.entries()) {
  const id = hashOf(text);
  map[text] = id;
  const out = join(OUT_DIR, `${id}.mp3`);
  if (!FORCE && existsSync(out)) { skipped++; continue; }
  toMp3(await synth(text), out);
  made++;
  if (made % 25 === 0) console.log(`  ${i + 1}/${items.length}…`);
}

const entries = Object.entries(map)
  .sort(([a], [b]) => a.localeCompare(b, 'ja'))
  .map(([text, id]) => `  ${JSON.stringify(text)}: '${id}',`)
  .join('\n');

writeFileSync(join(ROOT, 'src', 'data', 'contentAudioMap.ts'),
`// 由 scripts/gen-content-audio.mjs 產生，請勿手動編輯。
// 例詞・例句・特殊音例字 → 音檔 id（文字 SHA-1 前 12 碼）。
//
// 為什麼是雜湊不是可讀檔名：例詞的 romaji 帶長音符號（kōhī）不是 ASCII，
// 當檔名在不同系統與伺服器上會出問題；雜湊也保證同樣的文字只存一份。
//
// ⚠ 音檔為 VOICEVOX:四国めたん 產生，使用時必須標示。
export const CONTENT_AUDIO: Record<string, string> = {
${entries}
};
`, 'utf8');

console.log(`✓ 新增 ${made}，略過 ${skipped}，map 共 ${Object.keys(map).length} 筆`);
