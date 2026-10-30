# 日語五十音速成 / Japanese Kana Learning

<p align="center">
  <b><a href="#english">English</a></b> · 
  <b><a href="#繁體中文">繁體中文</a></b> · 
  <b><a href="#简体中文">简体中文</a></b>
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

- Due reviews follow 6 stages: 10 min → 1 day → 3 days → 7 days → 14 days → 30 days. A correct answer moves a kana up one stage; a wrong answer moves it down one.
- An adaptive scheduler (stability and difficulty per kana; first review after 10 min to 3 days depending on the rating; stability capped at 365 days) also records every answer and is included in backups. It does not set due dates yet.
- Mastery map: 5 rings, one per kana group (Hiragana, Katakana, Dakuon, Handakuon, Yoon), each showing the share of mastered kana (informational only; **no arbitrary progression locks**).
- **Data is stored only on this device.** Progress (kana mastery, SRS schedule, quiz records) is saved in this browser's `localStorage`. There is no account or server, so records do **not** sync across devices or browsers automatically.
- **Using another device?** Open the **Backup & Restore Data** card on the dashboard, **Export** a JSON file here, then **Import** it on the other device. Export before clearing browser data or using private/incognito mode.
- **What a backup contains:** kana mastery, SRS review schedule (including the adaptive scheduler state), answer history (used by the dashboard stats, weak-kana ranking and confusable-pair analysis), shadowing progress, chat-lesson position, JLPT records, and your UI language. Backups exported before this change contain only kana progress and JLPT records; importing one keeps the other data already on the device.

#### 9. Progressive Web App (PWA): Installable & Offline-capable

Addable to mobile and desktop home screens. The service worker precaches only the entry page and caches everything else on first use. HTML is network-first and bypasses the HTTP cache, so a new deploy shows up on the next load. Hashed build assets (`/assets/`) and audio (`/audio/`) are cache-first. The manifest and icons are stale-while-revalidate. Offline, the app works with the pages and assets this browser has already loaded. Audio clips may still need a connection: the browser fetches them with Range requests, and the service worker does not store those partial responses.

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
- 另有調適排程（每個假名記穩定度與難度；首次複習依作答評分為 10 分鐘到 3 天；穩定度上限 365 天）同步記錄每次作答並納入備份，但目前還不決定到期日
- 假名掌握地圖：五個圓環，平假名、片假名、濁音、半濁音、拗音各一個，顯示該組已掌握的比例（純顯示，**不設關卡**）
- **資料只存在你目前這台裝置的瀏覽器**：進度（假名掌握、SRS 排程、測驗紀錄）存在本機瀏覽器 `localStorage`，沒有帳號也沒有伺服器，**不會在不同裝置或瀏覽器之間自動同步**。
- **要換到另一台裝置？** 到「學習總覽」頁的 **資料備份與還原** 卡片，在這台 **匯出** JSON 檔，再到另一台 **匯入**。清除瀏覽器資料或用無痕模式前也請先匯出。
- **備份包含什麼**：假名掌握、SRS 複習排程（含調適排程狀態）、作答紀錄（首頁統計、弱點排行、易混辨析都靠它）、跟讀進度、對話教室進度、JLPT 紀錄、介面語言。這次改版前匯出的舊備份只有假名進度和 JLPT 紀錄；匯入舊檔時，本機其餘資料會保留不動。

#### 9. PWA：可安裝、可離線

可加入手機主畫面。Service worker 安裝時只預快取入口頁，其餘資源用到才存。HTML 走 network-first 並繞過 HTTP 快取（部署後下次載入即是新版）；帶 hash 的建置資產（`/assets/`）與音檔（`/audio/`）走 cache-first；manifest 與圖示走 stale-while-revalidate。離線時可使用這個瀏覽器已載入過的頁面與資產。音檔離線時可能仍需連網：瀏覽器以 Range 請求抓音檔，service worker 不會存下這種部分回應。

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
- 另有自适应排程（每个假名记录稳定度与难度；首次复习按作答评分为 10 分钟到 3 天；稳定度上限 365 天）同步记录每次作答并纳入备份，但目前还不决定到期日
- 假名掌握度地图：五个圆环，平假名、片假名、浊音、半浊音、拗音各一个，显示该组已掌握的比例（仅呈现数据，**不设置强制作业关卡**）
- **数据只保存在你当前这台设备的浏览器**：进度（假名掌握、SRS 排程、测验记录）存在本机浏览器 `localStorage`，没有账号也没有服务器，**不会在不同设备或浏览器之间自动同步**。
- **要换到另一台设备？** 到「学习总览」页的 **数据备份与还原** 卡片，在这台 **导出** JSON 文件，再到另一台 **导入**。清除浏览器数据或用无痕模式前也请先导出。
- **备份包含什么**：假名掌握、SRS 复习计划（含自适应排程状态）、答题记录（首页统计、弱点排行、易混辨析都依赖它）、跟读进度、对话教室进度、JLPT 记录、界面语言。这次改版前导出的旧备份只有假名进度和 JLPT 记录；导入旧文件时，本机其余数据会保留不动。

#### 9. PWA 规范：支持安装与离线使用

支持添加至手机桌面。Service worker 安装时只预缓存入口页，其余资源用到时才缓存。HTML 采用 network-first 并绕过 HTTP 缓存（部署后下次加载即为新版）；带 hash 的构建产物（`/assets/`）与音频（`/audio/`）采用 cache-first；manifest 与图标采用 stale-while-revalidate。离线时可使用该浏览器已加载过的页面与资源。音频离线时可能仍需联网：浏览器以 Range 请求获取音频，service worker 不会保存这种部分响应。

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
