# Japanese Kana Learning

[繁體中文](README.md) · [简体中文](README.zh-CN.md) · [English](README.en.md)

A static, zero-backend, offline-capable Japanese learning web app built around the core loop:
**Recognition → Audio Discrimination → Writing → Minimal Pairs → Speaking → Quizzing → Weakness Diagnostics → Spaced Repetition (SRS)**.

🔗 **Live Web App**: <https://jake627520.github.io/japanese-kana-learning/>

---

## Key Features

### 1. Full 208-Kana Coverage (Not Just 46 Basic Sounds)

| Category | Count |
|---|---:|
| Hiragana (Seion) | 46 |
| Katakana (Seion) | 46 |
| Voiced (Dakuon) | 40 |
| Semi-voiced (Handakuon) | 10 |
| Contracted (Yoon) | 66 |
| **Total** | **208** |

Most starter apps stop at the basic 46 characters. In real-world reading and listening, voiced sounds and contractions (dakuon/yoon) are where learners actually get stuck.

### 2. Pre-rendered Native Voice Audio (No Web Speech Synthesis)

All 208 kana, 203 vocabulary words, 204 example sentences, and 18 shadowing sentences use high-quality static audio pre-generated via **VOICEVOX** (656 MP3 files, ~7.3 MB total).

Browser-native Web Speech Synthesis is inconsistent across devices and operating systems: some speech engines read isolated characters as raw alphabet labels, and contracted (yoon) or choked (sokuon) sounds frequently distort. Pre-rendering the entire audio catalog ensures consistent pronunciation and allows seamless offline playback.

Vocabulary and full sentences share the exact same voice persona across all modules, eliminating jarring timbre shifts between units.

### 3. Writing Practice with Intentional Self-Evaluation

- Complete **stroke order diagrams** for all 46 basic Hiragana (stroke counts + per-stroke direction cues).
- Canvas handwriting area with toggleable **tracing mode** and **blind-recall mode**.
- Crosshair guidelines to assist character proportion and balance.
- **No algorithmic stroke grading**: Automated handwriting score algorithms produce high false-positive/false-negative rates on kana. Inaccurate feedback is more damaging than no score. Instead, learners calibrate by comparing their input directly with standard reference glyphs.

### 4. Easily Confused Kana: Distractors Pulled Strictly from the Same Cluster

21 curated pairs/triplets targeting specific confusion factors:

- **Loop vs. No Loop**: ぬ/め, る/ろ, ね/れ/わ
- **Mirror Symmetry**: さ/ち
- **Single-stroke Variation**: き/さ, は/ほ
- **Katakana Stroke Vector / Direction Traps**: シ/ツ, ソ/ン

In generic random quizzes, a question for ぬ might present distractors like か, さ, or と—options so dissimilar that learners can guess by elimination without recognizing distinctive features. Here, options are **drawn exclusively from the same confusion cluster**. Each set includes specific decision rules so learners know exactly what visual landmark to verify.

### 5. Five-step Shadowing: Self-Monitoring Loop Without Broken Machine Scores

Structured 5-step workflow: **Listen Only → Read & Listen → Whisper Shadowing → Record Output → Side-by-Side Comparison**

- Dual playback speeds (Normal / 0.7x Slow). Slow audio is time-stretched from the original recording to preserve natural pitch contours.
- In-browser local audio recording with immediate sequential comparison: *Native Sample → Learner Recording*.
- Toggleable text visibility (hide Japanese, kana, or romaji) to train pure auditory processing.
- **No automated acoustic grading**: Pitch accent evaluation algorithms on the client side remain unreliable and frequently mislead beginners. The goal is training the learner's own ear to notice discrepancies.

### 6. Weakness-to-Shadowing Linkage

Missed kana during quizzes automatically link to shadowing sentences containing that sound. Retaining isolated glyphs is hard; practicing them in real spoken context reinforces phonetic recall and creates a closed loop between recognition and speaking.

### 7. JLPT N5 / N4 / N3 Practice: 280 Original Questions with Diagnostic Distractors

- **N5: 100 questions across 30 grammar points**, covering Kanji readings, rendaku, okurigana, counters, and particles.
- **N4: 90 questions across 30 grammar points**, adding usage discrimination (mondai 5), causative, passive (`によって`), giving/receiving vectors, appearance vs. hearsay (`そうです`), and 2 reading comprehension passages.
- **N3: 90 questions across 30 grammar points**, focusing on subtle nuance distinctions where multiple choices are grammatically valid but only one matches natural pragmatic usage (e.g., わけがない / わけではない, おかげで / せいで, ために / ように, ものだ / ことだ), along with short-passage and info-retrieval reading tasks.
- Free switching between N5, N4, and N3 levels anytime.
- **Weakness diagnosis**: Pinpoints recurring error patterns. Every tested grammar point contains at least 3 distinct questions to filter out noise.
- Distractors are derived from authentic learner pitfalls (e.g., forming て-form directly from ます-stems, aspect omission, or over-generalizing irregular conjugations).

### 8. Spaced Repetition System (SRS) & Progress Tracking

- 6 interval stages: 10 min → 1 day → 3 days → 7 days → 14 days → 30 days.
- Mastery ring visualization across 5 proficiency tiers (informational only; **no arbitrary progression locks**).
- JSON export and import for seamless cross-device migration and backup.

### 9. Progressive Web App (PWA): Installable & Fully Offline

Addable to mobile and desktop home screens. Built with a network-first strategy for index HTML (ensuring prompt updates) and cache-first for static assets and audio.

### 10. No Gated Content / Artificial Barriers

Kana training and JLPT paths remain completely unlocked from day one. Users may already know basic kana or be studying directly for N4/N3; enforcing arbitrary prerequisites wastes learner time.

---

## Tab Modules

| Tab | Details |
|---|---|
| Dashboard | Displays "Today's Actionable Next Step" (Weakness → Due Reviews → New Kana → Shadowing), mastery distribution, and backup tools. |
| Kana Chart | 208-character grid with filters for seion, dakuon, handakuon, yoon, and hiragana/katakana. Cells display live mastery status. |
| Kana Detail Card | Detailed breakdown with stroke order, audio, mnemonic notes, and example vocabulary/sentences. |
| Writing | Stroke order guide, onion-skin tracing mode, and freehand practice canvas. |
| Quiz | 4 modes (Kana to Romaji, Audio to Kana, Romaji Typing, Hiragana/Katakana Conversion) with post-quiz mistake review and targeted drills. |
| Confused Kana | 21 confusion groups with visual cues and distinction rules. |
| Review Center | Weakness queue + scheduled SRS due items (mutually exclusive queues to avoid duplicate work). |
| Special Sounds | Dedicated focus on Dakuon, Handakuon, and Yoon. |
| JLPT Practice | 280 original N5/N4/N3 questions with level switcher and diagnostic error analysis. |
| Shadowing | 5-step shadowing system with built-in recording and dual-playback comparison. |
| Chat Tutor | Interactive conversational tutor for kana guidance and Q&A. |

---

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · lucide-react · motion

Pure client-side application. No backend server, no database, no third-party API keys. All progress is persisted locally in `localStorage`, and audio files are served as static assets.

## Getting Started

```bash
npm install
npm run dev
```

## Production Build & Preview

```bash
npm run build
npm run preview
```

## Regenerating Audio

To re-synthesize audio assets, install and start the [VOICEVOX](https://voicevox.hiroshiba.jp/) local engine and ensure `ffmpeg` is installed:

```bash
node scripts/gen-kana-audio.mjs     # 208 kana clips
node scripts/gen-content-audio.mjs  # 412 words, sentences, and special sound clips
node scripts/gen-audio.mjs          # 18 shadowing clips (regular and time-stretched slow)
```

## Data Validation

```bash
npm run lint            # TypeScript static type check
npm run validate:data   # Consistency check for kana and question datasets
```

---

## Licensing & Attribution

### Source Code

Released under the **MIT License**. See [LICENSE](./LICENSE).

### Audio Attribution

Audio assets were synthesized using **VOICEVOX:四国めたん**. Under the VOICEVOX terms of service, commercial and non-commercial usage as well as embedded distribution within applications is permitted, provided attribution to VOICEVOX and the voice model character is maintained.

- VOICEVOX Official: <https://voicevox.hiroshiba.jp/>
- Shikoku Metan Usage Terms: <https://zunko.jp/con_ongen_kiyaku.html>

⚠️ If you fork this repository and retain these audio files, **you must maintain this attribution**. If switching to another voice character, you must update the attribution according to that character's individual terms of service.

### Third-Party Assets

See [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md). UI icons provided by Lucide Icons (ISC License).

### Educational Content Notice

1. Kana characters and standard Hepburn romanization belong to public linguistic standards.
2. All vocabulary selections, example sentences, explanations, translations, JLPT practice questions, shadowing passages, and stroke order notes are **original works created specifically for this project**.
3. All JLPT questions are marked `license: 'own'` and `origin: 'own'`, and **contain no past exam questions or copyrighted textbook materials**.
4. No proprietary textbook content, paid course materials, or third-party copyrighted curricula were copied or ingested.
