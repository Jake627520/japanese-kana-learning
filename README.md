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

All 208 kana, 203 vocabulary words, 204 example sentences, and 18 shadowing sentences use static audio pre-generated via **VOICEVOX** (656 MP3 files, ~7.3 MB total).

Browser-native Web Speech Synthesis is inconsistent across devices and operating systems: engines frequently read isolated characters as raw alphabet names, while contracted (yoon) and choked (sokuon) sounds distort. Pre-rendering the entire audio catalog ensures consistent pronunciation and enables reliable offline playback.

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

- Dual playback speeds (Normal / 0.7x Slow). Slow audio is time-stretched from the original recording to preserve natural pitch contours.
- In-browser local audio recording with immediate sequential comparison: *Native Sample → Learner Recording*.
- Toggleable text visibility (hide Japanese, kana, or romaji) to train pure auditory processing.
- **No automated acoustic grading**: Pitch accent evaluation algorithms on the client side remain unreliable and frequently mislead beginners. The goal is training the learner's own ear to notice discrepancies.

#### 6. Weakness-to-Shadowing Linkage

Missed kana during quizzes automatically link to shadowing sentences containing that sound. Retaining isolated glyphs is hard; practicing them in real spoken context reinforces phonetic recall and creates a closed loop between recognition and speaking.

#### 7. JLPT N5 / N4 / N3 Practice: 280 Original Questions with Diagnostic Distractors

- **N5: 100 questions across 30 grammar points**, covering Kanji readings, rendaku, okurigana, counters, and particles.
- **N4: 90 questions across 30 grammar points**, adding usage discrimination (mondai 5), causative, passive (`によって`), giving/receiving vectors, appearance vs. hearsay (`そうです`), and 2 reading comprehension passages.
- **N3: 90 questions across 30 grammar points**, focusing on subtle nuance distinctions where multiple choices are grammatically valid but only one matches natural pragmatic usage (e.g., わけがない / わけではない, おかげで / せいで, ために / ように, ものだ / ことだ), along with short-passage and info-retrieval reading tasks.
- Free switching between N5, N4, and N3 levels anytime.
- **Weakness diagnosis**: Pinpoints recurring error patterns. Every tested grammar point contains at least 3 distinct questions to filter out noise.
- Distractors are derived from authentic learner pitfalls (e.g., forming て-form directly from ます-stems, aspect omission, or over-generalizing irregular conjugations).

#### 8. Spaced Repetition System (SRS) & Progress Tracking

- 6 interval stages: 10 min → 1 day → 3 days → 7 days → 14 days → 30 days.
- Mastery ring visualization across 5 proficiency tiers (informational only; **no arbitrary progression locks**).
- JSON export and import for seamless cross-device migration and backup.

#### 9. Progressive Web App (PWA): Installable & Fully Offline

Addable to mobile and desktop home screens. Built with a network-first strategy for index HTML (ensuring prompt updates) and cache-first for static assets and audio.

#### 10. No Gated Content / Artificial Barriers

Kana training and JLPT paths remain completely unlocked from day one. Users may already know basic kana or be studying directly for N4/N3; enforcing arbitrary prerequisites wastes learner time.

### Tab Modules

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

### Tech Stack & Quick Start

React 19 · TypeScript · Vite · Tailwind CSS 4 · lucide-react · motion

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

全部 208 個假名、203 個例詞、204 句例句與 18 句跟讀句都使用 **VOICEVOX** 預先生成音檔（656 個 mp3，共 7.3MB）。

瀏覽器內建語音合成唸單一假名時品質不穩定——有些引擎會唸成字母名稱，拗音與促音也常糊掉，而這正是初學者最需要聽清楚的部分。改用預生成音檔後發音穩定，且離線也能播。

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

- 正常 / 慢速（0.7x）雙速播放，慢速版由同一段原始音時間拉伸而成，語調一致才對得上
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

- 6 階段間隔：10 分 → 1 天 → 3 天 → 7 天 → 14 天 → 30 天
- 假名掌握地圖：五階段圓環進度（純顯示，**不設關卡**）
- 進度匯出 / 匯入 JSON，換裝置或清快取前可備份

#### 9. PWA：可安裝、可離線

可加入手機主畫面，離線完整使用。HTML 走 network-first（新版立即生效），靜態資產走 cache-first。

#### 10. 不設學習門檻

假名與 JLPT 兩條路徑**永遠開放**。使用者可能已會五十音、或正在準備 N4，強制要求先通過假名測驗是錯的假設。

### 功能分頁

| 分頁 | 內容 |
|---|---|
| 學習總覽 | 「今日學習」給出唯一的下一步（弱點→到期→新假名→跟讀），加上進度統計、掌握地圖與備份 |
| 五十音圖表 | 208 假名，可依清音/濁音/半濁音/拗音、平/片假名切換；每格顯示學習狀態（弱點/今日到期/學習中/已掌握/未學習）|
| 假名卡片 | 單字詳解、例詞例句 |
| 書寫練習 | 筆順說明 + 描紅 + 手寫 |
| 綜合測驗 | 四種題型（看假名選羅馬字／聽音選假名／打羅馬字／平片假名互換）；完成後列出逐題對錯與本次弱點，可直接只練錯的那幾個 |
| 易混辨析 | 21 組易混字對比 |
| 複習中心 | 弱點假名 + SRS 到期複習（兩者互斥，同一個假名只出現在一處）|
| 特殊音 | 濁音、半濁音、拗音專區 |
| JLPT 練習 | 280 題 N5／N4／N3 原創題 + 分級切換 + 弱點分析 |
| 跟讀練習 | 五步驟 shadowing + 錄音對照 |
| 對話教室 | 聊天式假名引導教學 |

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

全部 208 个假名、203 个例词、204 句例句与 18 句跟读句均采用 **VOICEVOX** 预生成音频（656 个 mp3 文件，共 7.3MB）。

浏览器内置语音合成朗读单个假名时稳定性差——不同引擎常读成字母代码，拗音与促音容易失真，而这恰恰是初学者最需要精准分辨的声音。改用预渲染静态音频后，发音统一且离线可直接播放。

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

- 提供正常语速与 0.7x 慢速播放；慢速版由同一原声进行时间拉伸生成，音高语调保持一致
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

- 6 级记忆间隔梯级：10 分钟 → 1 天 → 3 天 → 7 天 → 14 天 → 30 天
- 假名掌握度矩阵：5 阶环形进度指示（仅呈现数据，**不设置强制作业关卡**）
- 学习数据支持导出与导入 JSON，方便跨设备迁移或清空缓存前备份

#### 9. PWA 规范：支持安装与完全离线

支持添加至手机桌面与离线使用。HTML 采用 network-first 策略保障更新及时性，静态资源采用 cache-first 策略确保毫秒级离线加载。

#### 10. 无强制解锁门槛

假名与 JLPT 两条路径**完全开放**。许多学习者可能已掌握五十音或直接备考 N4/N3，强制要求通关假名测试再学后续内容是反人性的设计假设。

### 功能模块

| 模块 | 说明 |
|---|---|
| 学习总览 | 「今日任务」给出唯一的下一步建议（弱点复习 → 到期复习 → 新增假名 → 句子跟读），配合掌握度地图与数据备份 |
| 五十音图表 | 208 个假名总览，支持按清音/浊音/半浊音/拗音、平片假名过滤；每个单元格实时展示掌握状态（弱点/今日到期/学习中/已掌握/未学习） |
| 假名卡片 | 单个假名拆解，展示拼写、发音要点与对应例词例句 |
| 书写练习 | 笔顺拆解 + 描红临摹 + 空白画布练习 |
| 综合测验 | 四类题型（看假名选罗马字 / 听音辨字 / 输入罗马字 / 平片假名互换）；测验后生成详细对错列表与弱点清单，支持一键专项针对练习 |
| 易混辨析 | 21 组易混淆字形深度对比与辨析规则 |
| 复习中心 | 弱点假名优先消化 + SRS 到期队列（两模块互斥，同一假名不会重复堆叠） |
| 特殊音 | 浊音、半浊音、拗音专项强化 |
| JLPT 练习 | 280 题 N5 / N4 / N3 原创题库，支持分级切换与考点弱点定位 |
| 跟读练习 | 五步影子跟读训练法 + 本地录音对比 |
| 对话教室 | 交互式假名学习引导问答 |

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
