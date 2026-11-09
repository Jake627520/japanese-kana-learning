# 日語五十音速成 / Japanese Kana Learning

<p align="center">
  <b><a href="#english">English</a></b> · 
  <b><a href="#繁體中文">繁體中文</a></b> · 
  <b><a href="#简体中文">简体中文</a></b> · 
  <b><a href="#한국어">한국어</a></b> · 
  <b><a href="#español">Español</a></b>
</p>

<p align="center">
  🔗 <b>Live App</b>: <a href="https://jake627520.github.io/japanese-kana-learning/">https://jake627520.github.io/japanese-kana-learning/</a>
</p>

---

## English

A static, zero-backend, offline-capable Japanese learning web app built around the core loop:
**Recognition → Audio Discrimination → Writing → Minimal Pairs → Speaking → Quizzing → Weakness Diagnostics → Spaced Repetition (SRS)**.

### Key Features

#### 1. Full 208-Kana Coverage (Not Just 46 Basic Sounds)

| Category | Count |
|---|---:|
| Hiragana (Seion) | 46 |
| Katakana (Seion) | 46 |
| Voiced (Dakuon) | 40 |
| Semi-voiced (Handakuon) | 10 |
| Contracted (Yoon) | 66 |
| **Total** | **208** |

Most starter apps stop at the basic 46 characters. In real-world reading and listening, voiced sounds and contractions (dakuon/yoon) are where learners actually get stuck.

#### 2. Pre-rendered Native Voice Audio (No Web Speech Synthesis)

All 208 kana, 203 example words, 205 example sentences, 18 shadowing sentences (normal and slow), and the Special Sounds examples use static audio pre-generated via **VOICEVOX** (about 660 MP3 files, about 6.4 MB total).

Browser-native Web Speech Synthesis is inconsistent across devices and operating systems: engines frequently read isolated characters as raw alphabet names, while contracted (yoon) and choked (sokuon) sounds distort. Pre-rendering the entire audio catalog ensures consistent pronunciation.

#### 3. Writing Practice with Intentional Self-Evaluation

- Complete **stroke order diagrams** for all 46 basic Hiragana (stroke count + per-stroke direction cues).
- Canvas handwriting area with toggleable **tracing mode** and **blind-recall mode**.
- Crosshair guidelines to assist character proportion and balance.
- **No algorithmic stroke grading**: Automated handwriting score algorithms produce high false-positive/false-negative rates on kana. Inaccurate feedback is more damaging than no score. Learners calibrate by comparing their input directly with standard reference glyphs.

#### 4. Easily Confused Kana: Distractors Pulled Strictly from the Same Cluster

21 curated pairs/triplets targeting specific confusion factors:

- **Loop vs. No Loop**: ぬ/め, る/ろ, ね/れ/わ
- **Mirror Symmetry**: さ/ち
- **Single-stroke Variation**: き/さ, は/ほ
- **Katakana Stroke Vector / Direction Traps**: シ/ツ, ソ/ン

In generic random quizzes, a question for ぬ might present distractors like か, さ, or と—options so dissimilar that learners guess by elimination without recognizing distinctive features. Here, options are **drawn exclusively from the same confusion cluster**. Each set includes specific decision rules so learners know exactly what visual landmark to verify.

#### 5. Five-step Shadowing: Self-Monitoring Loop Without Broken Machine Scores

Structured 5-step workflow: **Listen Only → Read & Listen → Whisper Shadowing → Record Output → Side-by-Side Comparison**

- Dual playback speeds (Normal / Slow). The slow clip is the same recording time-stretched to 0.7x, which preserves natural pitch contours.
- In-browser local audio recording with immediate sequential comparison: *Native Sample → Learner Recording*.
- Toggleable text visibility (hide Japanese, kana, or romaji) to train pure auditory processing.
- **No automated acoustic grading**: Pitch accent evaluation algorithms on the client side remain unreliable and frequently mislead beginners. The goal is training the learner's own ear to notice discrepancies.

#### 6. Weakness-to-Shadowing Linkage

Missed kana during quizzes automatically link to shadowing sentences containing that sound. Retaining isolated glyphs is hard; practicing them in real spoken context reinforces phonetic recall and creates a closed loop between recognition and speaking.

#### 7. JLPT N5 / N4 / N3 Practice: 280 Original Questions with Diagnostic Distractors

- **N5: 100 questions across 30 topics**, covering Kanji readings, rendaku, okurigana, counters, and particles.
- **N4: 90 questions across 30 topics**, adding usage discrimination (mondai 5), causative, passive (`によって`), giving/receiving vectors, appearance vs. hearsay (`そうです`), and 2 reading comprehension passages.
- **N3: 90 questions across 30 topics**, focusing on subtle nuance distinctions where multiple choices are grammatically valid but only one matches natural pragmatic usage (e.g., わけがない / わけではない, おかげで / せいで, ために / ように, ものだ / ことだ), along with short-passage and info-retrieval reading tasks.
- Free switching between N5, N4, and N3 levels anytime.
- **Weakness diagnosis**: Pinpoints recurring error patterns. Every topic has at least 3 questions to filter out noise.
- Distractors are derived from authentic learner pitfalls (e.g., forming て-form directly from ます-stems, aspect omission, or over-generalizing irregular conjugations).

#### 8. Spaced Repetition System (SRS) & Progress Tracking

- **What actually schedules your reviews: the 6 fixed stages.** 10 min → 1 day → 3 days → 7 days → 14 days → 30 days. A correct answer moves a kana up one stage; a wrong answer moves it down one. Every due date you see comes from this.
- **An adaptive scheduler runs alongside it, but nothing it computes is used yet.** It tracks stability and difficulty per kana (first review after 10 min to 3 days depending on the rating; stability capped at 365 days), works out its own due date, and logs it next to the fixed-stage one so the two can be compared. Its state is saved and included in backups. Switching the app over to it is a later decision — today it is measurement only.
- Mastery map: 5 rings, one per kana group (Hiragana, Katakana, Dakuon, Handakuon, Yoon), each showing the share of mastered kana (informational only; **no arbitrary progression locks**).
- **Data is stored only on this device.** Progress (kana mastery, SRS schedule, quiz records) is saved in this browser's `localStorage`. There is no account or server, so records do **not** sync across devices or browsers automatically.
- **Using another device?** Open the **Backup & Restore Data** card on the dashboard, **Export** a JSON file here, then **Import** it on the other device. Export before clearing browser data or using private/incognito mode.
- **What a backup contains:** kana mastery, SRS review schedule (including the adaptive scheduler state), answer history (used by the dashboard stats, weak-kana ranking and confusable-pair analysis), shadowing progress, chat-lesson position, JLPT records, and your UI language. Backups exported before this change contain only kana progress and JLPT records; importing one keeps the other data already on the device.

#### 9. Progressive Web App (PWA): Installable & Offline-capable

Addable to mobile and desktop home screens. The service worker precaches only the entry page and caches everything else on first use. HTML is network-first and bypasses the HTTP cache, so a new deploy shows up on the next load. Hashed build assets (`/assets/`) and audio (`/audio/`) are cache-first. The manifest and icons are stale-while-revalidate. Offline, the app works with the pages and assets this browser has already loaded. Audio works offline once a clip has been played: the browser fetches audio with Range requests, so the service worker stores the whole file and answers each Range request from it. Clips never played before still need a connection.

#### 10. No Gated Content / Artificial Barriers

Kana training and JLPT paths remain completely unlocked from day one. Users may already know basic kana or be studying directly for N4/N3; enforcing arbitrary prerequisites wastes learner time.

#### 11. Five Interface Languages

The app is available in 繁體中文, 简体中文, English, 한국어, and Español. Translated content covers all UI text, the meanings of example words, sentences, and vocabulary, stroke-order steps and notes, confusable-kana tips, shadowing meanings, focus points, and tips, JLPT topic names and descriptions, and every JLPT explanation. Japanese learning material (kana, words, sentences, questions) stays in Japanese. Pick a language from the selector in the header. The choice is saved in this browser and included in backups. On the first visit, the app follows the browser language.

### Tab Modules

| Tab | Details |
|---|---|
| Dashboard | Displays "Today's Actionable Next Step" (Weakness → Due Reviews → New Kana → Shadowing), mastery distribution, and backup tools. |
| Kana Chart | 208-character grid with filters for seion, dakuon, handakuon, yoon, and hiragana/katakana. Cells display live mastery status. |
| Kana Detail Card | Kana, romaji, audio, a representative vocabulary card, example words/sentences, and a mark-as-mastered toggle. |
| Writing | Stroke order guide, onion-skin tracing mode, and freehand practice canvas. |
| Quiz | 4 modes (Kana to Romaji, Audio to Kana, Romaji Typing, Hiragana/Katakana Conversion) with post-quiz mistake review and targeted drills. |
| Confused Kana | 21 confusion groups with visual cues and distinction rules. |
| Review Center | Weakness queue + scheduled SRS due items (mutually exclusive queues to avoid duplicate work). |
| Special Sounds | Sokuon (っ/ッ) and chouon (long vowels): rules and example words with audio. |
| JLPT Practice | 280 original N5/N4/N3 questions with level switcher and diagnostic error analysis. |
| Shadowing | 5-step shadowing system with built-in recording and dual-playback comparison. |
| Chat Tutor | Chat-style guided lesson: teaches kana row by row, with a short quiz after each row. |

### Tech Stack & Quick Start

React 19 · TypeScript · Vite · Tailwind CSS 4 · lucide-react

```bash
# Run locally
npm install
npm run dev

# Production build & preview
npm run build
npm run preview
```

---

## 繁體中文

以「**認讀 → 聽音 → 書寫 → 辨析 → 口說 → 測驗 → 弱點 → SRS**」為核心的日文學習 Web App。純靜態、無後端、可離線使用。

### 特色

#### 1. 完整覆蓋 208 個假名，不只 46 音

| 分類 | 數量 |
|---|---:|
| 平假名清音 | 46 |
| 片假名清音 | 46 |
| 濁音 | 40 |
| 半濁音 | 10 |
| 拗音 | 66 |
| **合計** | **208** |

多數五十音工具停在基本 46 音，但濁音、拗音才是實際閱讀時的常見障礙。

#### 2. 真人級日語發音，不用瀏覽器 TTS

全部 208 個假名、203 個例詞、205 句例句、18 句跟讀句（正常＋慢速）與特殊音頁的例字都使用 **VOICEVOX** 預先生成音檔（約 660 個 mp3，共約 6.4MB）。

瀏覽器內建語音合成唸單一假名時品質不穩定——有些引擎會唸成字母名稱，拗音與促音也常糊掉，而這正是初學者最需要聽清楚的部分。改用預生成音檔後發音穩定。

例詞與例句也一併預生成：在補齊之前，特殊音頁面唸的全是單字（がっこう・コーヒー），完全落在瀏覽器 TTS 上，同一個網站會出現兩種音色。全站語音固定使用同一個聲音，避免不同單元像換了老師。

#### 3. 書寫練習：會認 ≠ 會寫

- 46 個平假名的**筆順說明**（筆畫數 + 每一畫的書寫要點）
- Canvas 手寫區，可切換**描紅模式**（關掉就是默寫）
- 十字參考線輔助抓字形比例
- **刻意不做自動評分**——手寫相似度判斷不可靠，錯誤的回饋比沒有回饋更傷。改由學習者對照參考後自我判斷

#### 4. 易混假名辨析：干擾項只從同組抽

21 組真實易混字，涵蓋四種干擾來源：

- **繞不繞圈**：ぬ/め、る/ろ、ね/れ/わ
- **鏡像**：さ/ち
- **差一筆**：き/さ、は/ほ
- **片假名方向陷阱**：シ/ツ、ソ/ン

一般隨機測驗中，ぬ 的干擾項可能是 か/さ/と——太好猜，練不到真正困難的地方。這裡的選項**只從同一組易混字抽出**，逼使用者真的去分辨特徵。每組都附「**怎麼分辨**」的判斷點，因為這類錯誤需要的是決策規則，不是更多次重複。

#### 5. 跟讀練習：自我監聽迴圈，不打分數

五步驟引導：**只聽 → 看字聽 → 輕聲跟 → 錄音 → 對照**

- 正常 / 慢速雙速播放，慢速版由同一段原始音時間拉伸到 0.7x 而成，語調一致才對得上
- 瀏覽器錄音，播放「母語版 → 自己的錄音」連續對照
- 可隱藏日文/假名/羅馬字，練到真正靠耳朵
- **不做發音評分**：日語 pitch accent 的機器評分現階段不可靠，錯誤回饋會誤導初學者。價值在於自己聽出差距

#### 6. 假名弱點 ↔ 跟讀句聯動

答錯的假名會對應到「練得到那個音的句子」。光背字形容易忘，放進句子裡唸過才記得牢——這把「認假名」和「口說」接成閉環。

#### 7. JLPT N5／N4／N3 練習：280 題原創，每題誘答都有診斷意義

- **N5：100 題 / 30 個考點**，涵蓋漢字読み、連濁、送り仮名、助数詞、助詞等
- **N4：90 題 / 30 個考點**，新增用法題（もんだい5）與使役、受身・によって、授受方向、様態／傳聞そうです等文法，並含兩組原創読解短文
- **N3：90 題 / 30 個考點**，集中在「四個選項文法都對、只有一個語感對」的題型：わけがない／わけではない、おかげで／せいで、ために／ように、ものだ／ことだ，並含短文與資訊檢索読解
- 頁面上可自由切換 N5／N4／N3
- **弱點分析**：依實際作答找出最常錯的考點。每個考點都有 ≥3 題，確保足以判定（低於此只是雜訊）
- 誘答取自真實錯誤來源，例如：て形從ます形變（のみて）、中文無體標記造成的干擾（住みます）、把例外當規則推（知っていません）

#### 8. SRS 間隔複習與進度追蹤

- 到期複習依 6 階段間隔：10 分 → 1 天 → 3 天 → 7 天 → 14 天 → 30 天。答對升一階，答錯降一階
- **實際決定到期日的，是上面那六個固定階段。** 你在複習中心看到的每一筆到期，都是它算出來的
- **另有一套調適排程同時在跑，但它算出來的東西目前都還沒被採用。** 它記錄每個假名的穩定度與難度（首次複習依作答評分為 10 分鐘到 3 天；穩定度上限 365 天），也會算出自己的到期日，並與固定階段的結果並排記下來供比對。它的狀態會存檔並納入備份。要不要把 app 切換過去是之後的決定，現在它只負責量測
- 假名掌握地圖：五個圓環，平假名、片假名、濁音、半濁音、拗音各一個，顯示該組已掌握的比例（純顯示，**不設關卡**）
- **資料只存在你目前這台裝置的瀏覽器**：進度（假名掌握、SRS 排程、測驗紀錄）存在本機瀏覽器 `localStorage`，沒有帳號也沒有伺服器，**不會在不同裝置或瀏覽器之間自動同步**。
- **要換到另一台裝置？** 到「學習總覽」頁的 **資料備份與還原** 卡片，在這台 **匯出** JSON 檔，再到另一台 **匯入**。清除瀏覽器資料或用無痕模式前也請先匯出。
- **備份包含什麼**：假名掌握、SRS 複習排程（含調適排程狀態）、作答紀錄（首頁統計、弱點排行、易混辨析都靠它）、跟讀進度、對話教室進度、JLPT 紀錄、介面語言。這次改版前匯出的舊備份只有假名進度和 JLPT 紀錄；匯入舊檔時，本機其餘資料會保留不動。

#### 9. PWA：可安裝、可離線

可加入手機主畫面。Service worker 安裝時只預快取入口頁，其餘資源用到才存。HTML 走 network-first 並繞過 HTTP 快取（部署後下次載入即是新版）；帶 hash 的建置資產（`/assets/`）與音檔（`/audio/`）走 cache-first；manifest 與圖示走 stale-while-revalidate。離線時可使用這個瀏覽器已載入過的頁面與資產。播放過的音檔離線也能播：瀏覽器以 Range 請求抓音檔，service worker 會另外存下完整檔案，再從中切出請求的那一段回應。從沒播過的音檔仍需連網。

#### 10. 不設學習門檻

假名與 JLPT 兩條路徑**永遠開放**。使用者可能已會五十音、或正在準備 N4，強制要求先通過假名測驗是錯的假設。

#### 11. 介面支援 5 種語言

介面可切換繁體中文、简体中文、English、한국어、Español。翻譯範圍：全部介面文字、例詞／例句／詞彙的意思、筆順說明與提示、易混辨析的判斷點、跟讀句的意思／重點／技巧、JLPT 考點名稱與說明，以及每一題 JLPT 解說。日文學習內容本身（假名、單字、例句、題目）維持日文。在頁首的語言選單切換；選擇會存在這個瀏覽器，也會納入備份。第一次開啟時依瀏覽器語言決定。

### 功能分頁

| 分頁 | 內容 |
|---|---|
| 學習總覽 | 「今日學習」給出唯一的下一步（弱點→到期→新假名→跟讀），加上進度統計、掌握地圖與備份 |
| 五十音圖表 | 208 假名，可依清音/濁音/半濁音/拗音、平/片假名切換；每格顯示學習狀態（弱點/今日到期/學習中/已掌握/未學習）|
| 假名卡片 | 假名、羅馬字、發音、代表詞彙卡、例詞例句，可標記已掌握 |
| 書寫練習 | 筆順說明 + 描紅 + 手寫 |
| 綜合測驗 | 四種題型（看假名選羅馬字／聽音選假名／打羅馬字／平片假名互換）；完成後列出逐題對錯與本次弱點，可直接只練錯的那幾個 |
| 易混辨析 | 21 組易混字對比 |
| 複習中心 | 弱點假名 + SRS 到期複習（兩者互斥，同一個假名只出現在一處）|
| 特殊音 | 促音（っ/ッ）與長音：規則說明 + 有發音的例字 |
| JLPT 練習 | 280 題 N5／N4／N3 原創題 + 分級切換 + 弱點分析 |
| 跟讀練習 | 五步驟 shadowing + 錄音對照 |
| 對話教室 | 聊天式假名引導教學：逐行教假名，每行結束有小測驗 |

---

## 简体中文

以「**认读 → 听音 → 书写 → 辨析 → 口语 → 测验 → 弱点 → SRS**」为核心的日语学习 Web App。纯静态、无后端、支持离线使用。

### 特色

#### 1. 完整覆盖 208 个假名，不局限于 46 音

| 分类 | 数量 |
|---|---:|
| 平假名清音 | 46 |
| 片假名清音 | 46 |
| 浊音 | 40 |
| 半浊音 | 10 |
| 拗音 | 66 |
| **合计** | **208** |

多数五十音工具仅覆盖基础 46 音，但浊音与拗音才是实际阅读和听力中最容易卡壳的部分。

#### 2. 真人级日语发音，不依赖浏览器 TTS

全部 208 个假名、203 个例词、205 句例句、18 句跟读句（正常 + 慢速）与特殊音页的例字均采用 **VOICEVOX** 预生成音频（约 660 个 mp3 文件，共约 6.4MB）。

浏览器内置语音合成朗读单个假名时稳定性差——不同引擎常读成字母代码，拗音与促音容易失真，而这恰恰是初学者最需要精准分辨的声音。改用预渲染静态音频后，发音统一。

例词与例句同样全量预生成，避免不同章节在本地 TTS 与预生成音频之间频繁切换音色。全站固定同一声线，保持听觉一致性。

#### 3. 书写练习：能认出不等于能写出

- 46 个平假名的**笔顺说明**（笔画数与每笔书写要领）
- Canvas 手写画布，支持切换**描红模式**与**盲写模式**
- 十字米字参考线辅助把控字形结构
- **刻意不加入机器自动评分**——笔迹相似度算法现阶段对初学笔画判定极不可靠，错误评判的误导性远大于无评分。练习者通过对照基准字形进行自我校准更有效。

#### 4. 易混假名辨析：干扰项仅从同组提取

精选 21 组高频混淆字，覆盖四类典型视觉/结构干扰：

- **环状卷曲差异**：ぬ/め、る/ろ、ね/れ/わ
- **镜像对称**：さ/ち
- **笔画增减**：き/さ、は/ほ
- **片假名笔势走向**：シ/ツ、ソ/ン

常规随机测验中，ぬ 的干扰项往往是 か/さ/と 等毫无关联的字，一眼即可排除，达不到辨析训练目的。本模块选项**严格从同组易混字中抽取**，迫使学习者捕捉细节特征。每组均附带明确的**辨析决策规则**，直接解决识别犹豫。

#### 5. 影子跟读：自我监听闭环，不搞机器打分

五步跟读流程：**盲听 → 看文本听 → 低声轻读 → 录音输出 → 对比回放**

- 提供正常语速与慢速播放；慢速版由同一原声时间拉伸到 0.7x 生成，音高语调保持一致
- 浏览器端纯本地录音，支持「标准发音 → 自身录音」无缝连播对比
- 可自由隐藏假名、汉字或罗马字，训练真实听感
- **不做声学评分**：日语音调核（Pitch Accent）的算法判定在纯前端并不稳定，生硬的打分只会误导初学者。核心价值在于让学习者自己听出两者差距。

#### 6. 假名弱点与跟读例句联动

测验中出错的假名会自动关联到包含该发音的跟读句子。脱离语境单独背字形遗忘率高，融入实际句子练习发音才能建立稳固连接，将「识字」与「口语」打通。

#### 7. JLPT N5 / N4 / N3 训练：280 道原创题，干扰项具备诊断价值

- **N5：100 题 / 30 个考点**，涵盖汉字读音、连浊、送假名、助数词、助词等
- **N4：90 题 / 30 个考点**，新增用法辨析（问题5）、使役、被动（によって）、授受方向、样态/传闻（そうです）等语法，并包含 2 组原创短文读解
- **N3：90 题 / 30 个考点**，聚焦「语法结构皆通，唯语感搭配唯一」的典型考法（如 わけがない / わけではない、おかげで / せいで、ために / ように、ものだ / ことだ），以及短文与信息检索读解
- 页面可自由切换 N5 / N4 / N3 等级
- **弱点统计**：根据答题记录定位高频错误考点。每个考点均配有 ≥3 题，保障统计有效性，排除偶然误选
- 干扰项均源自真实学习困境，例如：て形错误沿用ます形词干（のみて）、母语思维导致的体态缺失（住みます）、过度泛化特殊变形规则（知っていません）

#### 8. SRS 间隔重复与进度追踪

- 到期复习按 6 级间隔：10 分钟 → 1 天 → 3 天 → 7 天 → 14 天 → 30 天。答对升一级，答错降一级
- **实际决定到期日的，是上面那六个固定阶段。** 你在复习中心看到的每一笔到期，都是它算出来的
- **另有一套自适应排程同时在跑，但它算出来的东西目前都还没被采用。** 它记录每个假名的稳定度与难度（首次复习按作答评分为 10 分钟到 3 天；稳定度上限 365 天），也会算出自己的到期日，并与固定阶段的结果并排记下来供比对。它的状态会存档并纳入备份。要不要把 app 切换过去是之后的决定，现在它只负责测量
- 假名掌握度地图：五个圆环，平假名、片假名、浊音、半浊音、拗音各一个，显示该组已掌握的比例（仅呈现数据，**不设置强制作业关卡**）
- **数据只保存在你当前这台设备的浏览器**：进度（假名掌握、SRS 排程、测验记录）存在本机浏览器 `localStorage`，没有账号也没有服务器，**不会在不同设备或浏览器之间自动同步**。
- **要换到另一台设备？** 到「学习总览」页的 **数据备份与还原** 卡片，在这台 **导出** JSON 文件，再到另一台 **导入**。清除浏览器数据或用无痕模式前也请先导出。
- **备份包含什么**：假名掌握、SRS 复习计划（含自适应排程状态）、答题记录（首页统计、弱点排行、易混辨析都依赖它）、跟读进度、对话教室进度、JLPT 记录、界面语言。这次改版前导出的旧备份只有假名进度和 JLPT 记录；导入旧文件时，本机其余数据会保留不动。

#### 9. PWA 规范：支持安装与离线使用

支持添加至手机桌面。Service worker 安装时只预缓存入口页，其余资源用到时才缓存。HTML 采用 network-first 并绕过 HTTP 缓存（部署后下次加载即为新版）；带 hash 的构建产物（`/assets/`）与音频（`/audio/`）采用 cache-first；manifest 与图标采用 stale-while-revalidate。离线时可使用该浏览器已加载过的页面与资源。播放过的音频离线也能播放：浏览器以 Range 请求获取音频，service worker 会另外保存完整文件，再从中切出请求的那一段响应。从未播放过的音频仍需联网。

#### 10. 无强制解锁门槛

假名与 JLPT 两条路径**完全开放**。许多学习者可能已掌握五十音或直接备考 N4/N3，强制要求通关假名测试再学后续内容是反人性的设计假设。

#### 11. 界面支持 5 种语言

界面可切换繁體中文、简体中文、English、한국어、Español。翻译范围：全部界面文字、例词／例句／词汇的释义、笔顺说明与提示、易混辨析的判断点、跟读句的释义／重点／技巧、JLPT 考点名称与说明，以及每一道 JLPT 解析。日语学习内容本身（假名、单词、例句、题目）保持日语。在页首的语言菜单切换；选择会保存在该浏览器，也会纳入备份。首次打开时按浏览器语言决定。

### 功能模块

| 模块 | 说明 |
|---|---|
| 学习总览 | 「今日任务」给出唯一的下一步建议（弱点复习 → 到期复习 → 新增假名 → 句子跟读），配合掌握度地图与数据备份 |
| 五十音图表 | 208 个假名总览，支持按清音/浊音/半浊音/拗音、平片假名过滤；每个单元格实时展示掌握状态（弱点/今日到期/学习中/已掌握/未学习） |
| 假名卡片 | 单个假名拆解，展示假名、罗马字、发音、代表词汇卡与对应例词例句，可标记已掌握 |
| 书写练习 | 笔顺拆解 + 描红临摹 + 空白画布练习 |
| 综合测验 | 四类题型（看假名选罗马字 / 听音辨字 / 输入罗马字 / 平片假名互换）；测验后生成详细对错列表与弱点清单，支持一键专项针对练习 |
| 易混辨析 | 21 组易混淆字形深度对比与辨析规则 |
| 复习中心 | 弱点假名优先消化 + SRS 到期队列（两模块互斥，同一假名不会重复堆叠） |
| 特殊音 | 促音（っ/ッ）与长音：规则说明 + 带发音的例字 |
| JLPT 练习 | 280 题 N5 / N4 / N3 原创题库，支持分级切换与考点弱点定位 |
| 跟读练习 | 五步影子跟读训练法 + 本地录音对比 |
| 对话教室 | 聊天式假名引导教学：逐行讲解假名，每行结束有小测验 |

---

## 한국어

정적 호스팅, 백엔드 없음, 오프라인 사용이 가능한 일본어 학습 웹 앱입니다. 핵심 흐름은 다음과 같습니다.
**인식 → 소리 구별 → 쓰기 → 혼동 글자 구별 → 말하기 → 퀴즈 → 약점 진단 → 간격 반복(SRS)**

### 주요 기능

#### 1. 가나 208자 전체 수록 (기본 46자에 그치지 않음)

| 분류 | 개수 |
|---|---:|
| 히라가나 (청음) | 46 |
| 가타카나 (청음) | 46 |
| 탁음 | 40 |
| 반탁음 | 10 |
| 요음 | 66 |
| **합계** | **208** |

입문 앱 대부분은 기본 46자에서 멈춥니다. 하지만 실제로 읽고 들을 때 학습자가 막히는 곳은 탁음과 요음입니다.

#### 2. 미리 생성한 음성 파일 (브라우저 음성 합성 미사용)

가나 208자, 예시 단어 203개, 예문 205개, 섀도잉 문장 18개(보통 속도·느린 속도), 특수음 예시까지 모두 **VOICEVOX**로 미리 만든 정적 음성 파일을 사용합니다(MP3 약 660개, 약 6.4MB).

브라우저 내장 음성 합성은 기기와 운영체제마다 결과가 다릅니다. 글자 하나만 읽힐 때 알파벳 이름으로 읽어 버리는 엔진이 많고, 요음과 촉음은 자주 뭉개집니다. 전부 미리 생성해 두면 발음이 일정하게 유지됩니다.

#### 3. 쓰기 연습: 채점하지 않고 스스로 비교

- 기본 히라가나 46자의 **획순 안내**(획수 + 획마다 방향 설명).
- 캔버스 필기 영역. **따라쓰기 모드**와 **안 보고 쓰기 모드**를 전환할 수 있습니다.
- 글자 균형을 잡도록 돕는 십자 보조선.
- **획순 자동 채점은 넣지 않았습니다.** 가나에 대한 필기 채점 알고리즘은 오탐과 미탐이 많습니다. 틀린 피드백은 피드백이 없는 것보다 해롭습니다. 학습자가 표준 자형과 직접 비교해 판단합니다.

#### 4. 혼동하기 쉬운 가나: 오답은 같은 묶음에서만

혼동 요인별로 정리한 21개 조:

- **고리의 유무**: ぬ/め, る/ろ, ね/れ/わ
- **좌우 대칭**: さ/ち
- **획 하나 차이**: き/さ, は/ほ
- **가타카나의 획 방향 함정**: シ/ツ, ソ/ン

일반적인 무작위 퀴즈에서는 ぬ 문제의 오답으로 か, さ, と 같은 글자가 나옵니다. 너무 달라서 특징을 몰라도 소거법으로 맞힐 수 있습니다. 여기서는 **같은 혼동 묶음 안에서만** 오답을 뽑고, 조마다 "어디를 보면 되는지"를 명시합니다.

#### 5. 5단계 섀도잉: 기계 점수 없이 스스로 확인하는 흐름

**듣기만 → 보면서 듣기 → 작은 소리로 따라 하기 → 녹음 → 나란히 비교**의 5단계 구성.

- 보통 속도와 느린 속도. 느린 음원은 같은 녹음을 0.7배로 늘인 것이라 억양이 그대로 유지됩니다.
- 브라우저 안에서 녹음하고, **원어민 음성 → 내 녹음** 순서로 바로 이어서 들을 수 있습니다.
- 일본어·가나·로마자 표시를 각각 끌 수 있어 순수하게 귀로만 판단하는 연습이 가능합니다.
- **발음 자동 채점은 넣지 않았습니다.** 브라우저에서 돌아가는 억양 평가는 아직 신뢰하기 어렵고, 초보자를 잘못된 방향으로 이끄는 경우가 많습니다. 목표는 학습자 자신의 귀가 차이를 알아채게 만드는 것입니다.

#### 6. 약점 가나와 섀도잉 문장의 연결

퀴즈에서 틀린 가나는 그 소리가 들어 있는 섀도잉 문장과 자동으로 연결됩니다. 글자 하나만 떼어 외우기는 어렵습니다. 실제 발화 속에서 연습하면 소리 기억이 강해지고, 인식과 발화가 하나의 고리로 이어집니다.

#### 7. JLPT N5 / N4 / N3 연습: 자체 제작 280문항, 오답에도 진단 기능

- **N5: 30개 항목 100문항** — 한자 읽기, 연탁, 오쿠리가나, 조수사, 조사.
- **N4: 30개 항목 90문항** — 용법 문제(문제 5), 사역, 수동(`によって`), 수수 표현의 방향, 양태와 전문의 `そうです`, 독해 지문 2세트 추가.
- **N3: 30개 항목 90문항** — 네 선택지가 문법적으로는 모두 성립하지만 자연스러운 쓰임은 하나뿐인 유형에 집중(わけがない / わけではない, おかげで / せいで, ために / ように, ものだ / ことだ 등). 단문 독해와 정보 검색 문제 포함.
- N5·N4·N3는 언제든지 자유롭게 전환할 수 있습니다.
- **약점 진단**: 반복되는 실수 유형을 짚어 줍니다. 잡음을 걸러 내려고 모든 항목에 최소 3문항을 두었습니다.
- 오답은 실제 학습자가 저지르는 실수에서 가져왔습니다(ます형에서 바로 て형을 만들기, 상 표지 누락, 예외를 규칙으로 일반화하기 등).

#### 8. 간격 반복(SRS)과 진도 관리

- **복습 일정을 실제로 정하는 것은 6단계 고정 간격입니다.** 10분 → 1일 → 3일 → 7일 → 14일 → 30일. 맞히면 한 단계 올라가고, 틀리면 한 단계 내려갑니다. 복습 센터에 보이는 예정일은 모두 여기서 나옵니다.
- **적응형 스케줄러도 함께 돌아가지만, 그 결과는 아직 쓰이지 않습니다.** 가나별 안정도와 난이도를 기록하고(평가에 따라 첫 복습은 10분에서 3일 사이, 안정도 상한은 365일), 자체 예정일도 계산해 고정 간격의 결과와 나란히 남겨 비교할 수 있게 합니다. 상태는 저장되고 백업에도 포함됩니다. 앱을 이쪽으로 바꿀지는 나중에 정할 일이고, 지금은 측정만 합니다.
- 숙달 지도: 가나 그룹(히라가나·가타카나·탁음·반탁음·요음)마다 고리 하나씩 5개. 각 고리는 숙달 비율만 보여 줍니다. **단계를 잠그지 않습니다.**
- **데이터는 이 기기에만 저장됩니다.** 진도(가나 숙달도, SRS 일정, 퀴즈 기록)는 이 브라우저의 `localStorage`에 저장됩니다. 계정도 서버도 없으므로 다른 기기나 브라우저와 **자동으로 동기화되지 않습니다**.
- **다른 기기를 쓰려면?** 대시보드의 **데이터 백업·복원** 카드에서 JSON 파일을 **내보내기** 한 다음, 다른 기기에서 **가져오기** 하세요. 브라우저 데이터를 지우기 전이나 시크릿 모드를 쓰기 전에도 내보내 두시기 바랍니다.
- **백업에 담기는 것:** 가나 숙달도, SRS 복습 일정(적응형 스케줄러 상태 포함), 응답 기록(대시보드 통계·약점 가나 순위·혼동 쌍 분석에 쓰임), 섀도잉 진도, 채팅 수업 위치, JLPT 기록, 화면 언어 설정. 이 기능이 생기기 전에 내보낸 백업에는 가나 진도와 JLPT 기록만 들어 있으며, 가져와도 기기에 이미 있는 나머지 데이터는 그대로 남습니다.

#### 9. PWA: 설치 가능하고 오프라인에서도 동작

휴대폰과 데스크톱 홈 화면에 추가할 수 있습니다. 서비스 워커는 시작 페이지만 미리 캐시하고, 나머지는 처음 사용할 때 캐시합니다. HTML은 네트워크 우선이며 HTTP 캐시를 건너뛰므로 새로 배포하면 다음 방문에 바로 반영됩니다. 해시가 붙은 빌드 자산(`/assets/`)과 음성(`/audio/`)은 캐시 우선입니다. 매니페스트와 아이콘은 stale-while-revalidate 방식입니다. 오프라인에서는 이 브라우저가 이미 불러온 페이지와 자산으로 동작합니다. 음성은 한 번 재생한 뒤부터 오프라인에서도 들을 수 있습니다. 브라우저가 Range 요청으로 음성을 가져오므로 서비스 워커가 파일 전체를 저장해 두고 각 Range 요청에 답합니다. 한 번도 재생하지 않은 음원은 여전히 연결이 필요합니다.

#### 10. 잠긴 콘텐츠 없음

가나 학습과 JLPT 경로는 처음부터 전부 열려 있습니다. 이미 가나를 아는 사람도 있고 바로 N4·N3를 준비하는 사람도 있습니다. 임의의 선행 조건을 강제하면 학습자의 시간만 낭비됩니다.

#### 11. 화면 언어 5종

繁體中文, 简体中文, English, 한국어, Español을 지원합니다. 번역 범위는 모든 화면 문구, 예시 단어·예문·어휘의 뜻, 획순 단계와 설명, 혼동 가나 요령, 섀도잉의 뜻·핵심·요령, JLPT 항목 이름과 설명, 그리고 JLPT 해설 전체입니다. 일본어 학습 자료(가나, 단어, 문장, 문제) 자체는 일본어로 둡니다. 상단의 선택기에서 언어를 고르세요. 선택한 언어는 이 브라우저에 저장되고 백업에도 포함됩니다. 처음 방문할 때는 브라우저 언어를 따릅니다.

### 탭 구성

| 탭 | 내용 |
|---|---|
| 대시보드 | "오늘 할 일"을 하나로 제시(약점 → 복습 예정 → 새 가나 → 섀도잉). 숙달 분포와 백업 도구 포함. |
| 가나 표 | 208자 표. 청음·탁음·반탁음·요음과 히라가나/가타카나로 필터링. 칸마다 현재 숙달 상태 표시. |
| 가나 상세 카드 | 가나, 로마자, 음성, 대표 어휘 카드, 예시 단어와 예문, 숙달 표시 전환. |
| 쓰기 | 획순 안내, 따라쓰기 모드, 자유 필기 캔버스. |
| 퀴즈 | 4가지 방식(가나→로마자, 소리→가나, 로마자 입력, 히라가나/가타카나 변환). 끝나면 틀린 문제만 다시 연습. |
| 혼동 가나 | 21개 조. 시각적 단서와 구별 규칙 제공. |
| 복습 센터 | 약점 대기열과 SRS 복습 예정(두 대기열은 서로 겹치지 않아 중복 학습이 없습니다). |
| 특수음 | 촉음(っ/ッ)과 장음: 규칙과 예시 단어, 음성 포함. |
| JLPT 연습 | 자체 제작 N5/N4/N3 280문항. 급수 전환과 오답 분석. |
| 섀도잉 | 5단계 섀도잉. 녹음과 두 속도 비교 내장. |
| 채팅 수업 | 대화형 수업. 행 단위로 가나를 배우고 행마다 짧은 퀴즈. |

### 기술 스택과 실행 방법

React 19 · TypeScript · Vite · Tailwind CSS 4 · lucide-react

```bash
# 로컬 실행
npm install
npm run dev

# 프로덕션 빌드와 미리 보기
npm run build
npm run preview
```

---

## Español

Aplicación web estática para aprender japonés: sin backend y utilizable sin conexión. Su ciclo central es:
**reconocer → discriminar sonidos → escribir → distinguir pares confundibles → hablar → practicar → diagnosticar puntos débiles → repaso espaciado (SRS)**.

### Características principales

#### 1. Los 208 kana completos (no solo los 46 básicos)

| Categoría | Cantidad |
|---|---:|
| Hiragana (seion) | 46 |
| Katakana (seion) | 46 |
| Sonoras (dakuon) | 40 |
| Semisonoras (handakuon) | 10 |
| Contraídas (yōon) | 66 |
| **Total** | **208** |

La mayoría de las aplicaciones para principiantes se detienen en los 46 caracteres básicos. Al leer y escuchar de verdad, donde el estudiante se atasca es en las sonoras y las contraídas.

#### 2. Audio pregrabado (sin síntesis de voz del navegador)

Los 208 kana, 203 palabras de ejemplo, 205 oraciones de ejemplo, 18 frases de shadowing (velocidad normal y lenta) y los ejemplos de sonidos especiales usan archivos estáticos generados de antemano con **VOICEVOX** (unos 660 MP3, alrededor de 6,4 MB).

La síntesis de voz del navegador no es consistente entre dispositivos ni sistemas operativos: muchos motores leen un carácter aislado como el nombre de una letra, y las contraídas y las geminadas suelen distorsionarse. Generar todo el audio por adelantado mantiene la pronunciación estable.

#### 3. Práctica de escritura con autoevaluación deliberada

- **Guía de trazos** completa para los 46 hiragana básicos (número de trazos y dirección de cada uno).
- Lienzo de escritura a mano con **modo calco** y **modo de memoria** intercambiables.
- Líneas guía en cruz para ayudar con la proporción y el equilibrio del carácter.
- **Sin corrección automática de trazos.** Los algoritmos que puntúan escritura a mano producen muchos falsos positivos y negativos con los kana. Una corrección equivocada hace más daño que ninguna. El estudiante se calibra comparando su trazo con el modelo de referencia.

#### 4. Kana que se confunden: los distractores salen solo del mismo grupo

21 grupos seleccionados según el factor de confusión:

- **Con bucle o sin bucle**: ぬ/め, る/ろ, ね/れ/わ
- **Simetría especular**: さ/ち
- **Un solo trazo de diferencia**: き/さ, は/ほ
- **Dirección del trazo en katakana**: シ/ツ, ソ/ン

En un examen aleatorio normal, una pregunta sobre ぬ puede ofrecer か, さ o と como distractores: tan distintos que se acierta por descarte sin reconocer el rasgo que distingue. Aquí las opciones **salen únicamente del mismo grupo de confusión**, y cada grupo indica exactamente qué detalle hay que mirar.

#### 5. Shadowing en cinco pasos: control propio, sin puntuaciones automáticas poco fiables

Flujo estructurado en 5 pasos: **solo escuchar → leer y escuchar → repetir en voz baja → grabarse → comparar en paralelo**.

- Dos velocidades (normal y lenta). La versión lenta es la misma grabación estirada a 0,7x, de modo que la entonación se conserva.
- Grabación local en el navegador y comparación inmediata: **muestra nativa → grabación del estudiante**.
- El texto se puede ocultar por partes (japonés, kana o rōmaji) para entrenar solo el oído.
- **Sin evaluación acústica automática.** Los algoritmos de acento tonal en el navegador siguen siendo poco fiables y con frecuencia confunden a los principiantes. El objetivo es entrenar el oído del propio estudiante para que note las diferencias.

#### 6. Los kana débiles enlazan con el shadowing

Los kana fallados en los exámenes se enlazan automáticamente con las frases de shadowing que contienen ese sonido. Memorizar un carácter aislado es difícil; practicarlo dentro de habla real refuerza el recuerdo fonético y cierra el ciclo entre reconocer y hablar.

#### 7. Práctica JLPT N5 / N4 / N3: 280 preguntas propias con distractores diagnósticos

- **N5: 100 preguntas en 30 temas**, sobre lecturas de kanji, rendaku, okurigana, contadores y partículas.
- **N4: 90 preguntas en 30 temas**, añadiendo las preguntas de uso (mondai 5), causativo, pasiva con `によって`, dirección de dar y recibir, `そうです` de apariencia frente a rumor, y 2 textos de comprensión lectora.
- **N3: 90 preguntas en 30 temas**, centradas en matices donde las cuatro opciones son gramaticales pero solo una resulta natural (わけがない / わけではない, おかげで / せいで, ために / ように, ものだ / ことだ, entre otras), más textos breves y tareas de búsqueda de información.
- Se puede cambiar entre N5, N4 y N3 en cualquier momento.
- **Diagnóstico de puntos débiles**: señala los patrones de error que se repiten. Cada tema tiene al menos 3 preguntas para filtrar el ruido.
- Los distractores salen de errores reales de estudiantes (formar la forma て directamente desde la raíz ます, omitir la marca de aspecto, generalizar una excepción como si fuera regla).

#### 8. Repaso espaciado (SRS) y seguimiento del progreso

- **Lo que fija de verdad tus repasos son las 6 etapas fijas.** 10 min → 1 día → 3 días → 7 días → 14 días → 30 días. Un acierto sube un nivel; un fallo lo baja. Todas las fechas que ves en el centro de repaso salen de aquí.
- **Un planificador adaptativo funciona en paralelo, pero nada de lo que calcula se usa todavía.** Registra la estabilidad y la dificultad de cada kana (el primer repaso cae entre 10 minutos y 3 días según la valoración; la estabilidad se limita a 365 días), calcula su propia fecha y la guarda junto a la de las etapas fijas para poder compararlas. Su estado se guarda y se incluye en las copias de seguridad. Cambiar la aplicación a este sistema es una decisión posterior; hoy solo mide.
- Mapa de dominio: 5 anillos, uno por grupo de kana (hiragana, katakana, dakuon, handakuon, yōon), cada uno con el porcentaje dominado (solo informativo; **no bloquea ningún contenido**).
- **Los datos se guardan solo en este dispositivo.** El progreso (dominio de kana, calendario SRS, registros de exámenes) se guarda en el `localStorage` de este navegador. No hay cuenta ni servidor, así que **no se sincroniza** con otros dispositivos ni navegadores.
- **¿Vas a usar otro dispositivo?** Abre la tarjeta **Copia de seguridad y restauración** del panel, **exporta** un archivo JSON aquí e **impórtalo** en el otro dispositivo. Exporta también antes de borrar los datos del navegador o de usar el modo privado.
- **Qué contiene una copia:** dominio de los kana, calendario de repaso SRS (incluido el estado del planificador adaptativo), historial de respuestas (lo usan las estadísticas del panel, el ranking de kana débiles y el análisis de pares confundibles), progreso de shadowing, posición en la lección de chat, registros JLPT y el idioma de la interfaz. Las copias exportadas antes de este cambio solo contienen el progreso de kana y los registros JLPT; al importarlas, el resto de los datos del dispositivo se conserva.

#### 9. PWA: instalable y disponible sin conexión

Se puede añadir a la pantalla de inicio en móvil y escritorio. El service worker precachea únicamente la página de entrada y guarda el resto en el primer uso. El HTML va primero a la red y omite la caché HTTP, así que un despliegue nuevo aparece en la siguiente carga. Los recursos de compilación con hash (`/assets/`) y el audio (`/audio/`) van primero a caché. El manifiesto y los iconos usan stale-while-revalidate. Sin conexión, la aplicación funciona con las páginas y los recursos que este navegador ya cargó. El audio funciona sin conexión en cuanto se ha reproducido una vez: el navegador lo pide con peticiones Range, de modo que el service worker guarda el archivo entero y responde a cada Range desde él. Los clips nunca reproducidos siguen necesitando conexión.

#### 10. Nada bloqueado ni barreras artificiales

El entrenamiento de kana y la ruta JLPT están abiertos desde el primer día. Hay quien ya conoce los kana básicos y quien estudia directamente para N4 o N3; imponer requisitos previos arbitrarios solo hace perder el tiempo.

#### 11. Cinco idiomas de interfaz

La aplicación está disponible en 繁體中文, 简体中文, English, 한국어 y Español. La traducción cubre todos los textos de la interfaz, los significados de las palabras y oraciones de ejemplo y del vocabulario, los pasos y notas del orden de trazos, los consejos sobre kana confundibles, los significados, puntos clave y consejos del shadowing, los nombres y descripciones de los temas JLPT, y todas las explicaciones JLPT. El material de estudio en japonés (kana, palabras, oraciones, preguntas) permanece en japonés. Elige el idioma en el selector de la cabecera. La elección se guarda en este navegador y se incluye en las copias de seguridad. En la primera visita, la aplicación sigue el idioma del navegador.

### Secciones

| Sección | Detalles |
|---|---|
| Panel | Muestra "lo siguiente que toca hoy" (puntos débiles → repasos pendientes → kana nuevos → shadowing), la distribución del dominio y las herramientas de copia de seguridad. |
| Tabla de kana | Cuadrícula de 208 caracteres con filtros de seion, dakuon, handakuon, yōon e hiragana/katakana. Cada celda muestra el estado de dominio actual. |
| Ficha de kana | Kana, rōmaji, audio, una ficha de vocabulario representativa, palabras y oraciones de ejemplo, y el botón para marcar como dominado. |
| Escritura | Guía de trazos, modo calco y lienzo de práctica libre. |
| Examen | 4 modos (kana a rōmaji, audio a kana, escribir en rōmaji, conversión hiragana/katakana) con repaso de fallos al terminar. |
| Kana confundibles | 21 grupos de confusión con pistas visuales y reglas de distinción. |
| Centro de repaso | Cola de puntos débiles y repasos SRS pendientes (colas separadas para no repetir trabajo). |
| Sonidos especiales | Geminadas (っ/ッ) y vocales largas: reglas y palabras de ejemplo con audio. |
| Práctica JLPT | 280 preguntas propias de N5/N4/N3 con selector de nivel y análisis de errores. |
| Shadowing | Sistema de 5 pasos con grabación integrada y comparación a dos velocidades. |
| Tutor de chat | Lección guiada en forma de chat: enseña los kana fila por fila, con un examen corto tras cada fila. |

### Tecnologías y puesta en marcha

React 19 · TypeScript · Vite · Tailwind CSS 4 · lucide-react

```bash
# Ejecutar en local
npm install
npm run dev

# Compilar para producción y previsualizar
npm run build
npm run preview
```

---

## 授權與聲明 / License & Attribution

### Source Code
MIT License. See [LICENSE](./LICENSE).

### Audio Attribution
VOICEVOX:四国めたん. Under VOICEVOX terms, commercial and non-commercial usage as well as embedded distribution within applications is permitted, provided attribution is maintained.
- VOICEVOX: <https://voicevox.hiroshiba.jp/>
- 四国めたん 規約: <https://zunko.jp/con_ongen_kiyaku.html>

### Third-Party Notices
See [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md). Icons by Lucide Icons (ISC License).

### Content Disclaimer
All sample sentences, explanations, JLPT items, and audio scripts are original creations for this project. No past official exam questions or third-party proprietary textbook materials were ingested.
