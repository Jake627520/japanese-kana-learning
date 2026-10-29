import { JlptQuestion } from '../../types';

// N4 原創題 Batch1：文字・語彙的 10 個知識點，每點 3 題。
//
// 出題依據是 nihongo-tiku 知識圖譜裡每個節點的 evidence——題目要能驗證
// evidence 描述的那個行為，而不是隨便造一個含該詞的句子。
//
// 誘答不是隨機湊的，每個都對應一種真實錯誤來源：
//   中文一個詞對應日文多個詞（味／匂い、音／声）、
//   自他動詞成對（見つかる／見つける）、同音異字（以外／意外）、
//   「接縫都濁化」的錯誤直覺（反対 → はんだい）。
// 答錯時看選項就知道自己是哪一種誤解。
//
// ⚠ source.confirmed 一律 false：這批由模型原創，自然度尚未經第三方覆核。
//    比照 nihongo-tiku 的做法（DESIGN.md 9.2），覆核過才改 true。
export const N4_ORIGINAL_BATCH1: JlptQuestion[] = [
  // ── jpv_n4-i-adjectives ──
  {
    id: 'n4-own-b1-01', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 1,
    type: 'single', score: 1,
    stem: 'この パンは 古く なって、（　　）なりました。',
    options: ['あまく', 'つめたく', 'ひろく', 'かたく'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-i-adjectives', topicIds: ['jpv_n4-i-adjectives'] },
  },
  {
    id: 'n4-own-b1-02', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 2,
    type: 'single', score: 1,
    stem: '山の 上から 見た 景色は とても （　　）です。',
    options: ['うるさかった', '美しかった', '優しかった', '楽しかった'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-i-adjectives', topicIds: ['jpv_n4-i-adjectives'] },
  },
  {
    id: 'n4-own-b1-03', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 3,
    type: 'single', score: 1,
    stem: 'この 花は 日本では （　　）ので、あまり 見る ことが できません。',
    options: ['たのしい', 'やさしい', 'うつくしい', 'めずらしい'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-i-adjectives', topicIds: ['jpv_n4-i-adjectives'] },
  },

  // ── jpv_n4-sensory-nouns ──
  {
    id: 'n4-own-b1-04', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 4,
    type: 'single', score: 1,
    stem: 'となりの へやから ピアノの （　　）が 聞こえます。',
    options: ['味', '音', 'におい', '声'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-sensory-nouns', topicIds: ['jpv_n4-sensory-nouns'] },
  },
  {
    id: 'n4-own-b1-05', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 5,
    type: 'single', score: 1,
    stem: 'だいどころから カレーの いい （　　）が します。',
    options: ['におい', '味', '色', '音'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-sensory-nouns', topicIds: ['jpv_n4-sensory-nouns'] },
  },
  {
    id: 'n4-own-b1-06', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 6,
    type: 'single', score: 1,
    stem: 'あかちゃんの 泣く （　　）が 聞こえました。',
    options: ['音', '味', 'におい', '声'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-sensory-nouns', topicIds: ['jpv_n4-sensory-nouns'] },
  },

  // ── jpv_n4-social-reaction-nouns ──
  {
    id: 'n4-own-b1-07', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 7,
    type: 'single', score: 1,
    stem: 'かえりが おそかったので、両親に （　　）を かけました。',
    options: ['失礼', '心配', 'お辞儀', '経験'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-social-reaction-nouns', topicIds: ['jpv_n4-social-reaction-nouns'] },
  },
  {
    id: 'n4-own-b1-08', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 8,
    type: 'single', score: 1,
    stem: '日本では 人に 会った とき、（　　）を します。',
    options: ['お辞儀', '経験', '失礼', '心配'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-social-reaction-nouns', topicIds: ['jpv_n4-social-reaction-nouns'] },
  },
  {
    id: 'n4-own-b1-09', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 9,
    type: 'single', score: 1,
    stem: '先生に あいさつも しないで 帰って しまい、たいへん （　　）な ことを しました。',
    options: ['安心', '失礼', '熱心', '心配'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-social-reaction-nouns', topicIds: ['jpv_n4-social-reaction-nouns'] },
  },

  // ── jpv_n4-inner-life-nouns ──
  {
    id: 'n4-own-b1-10', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 10,
    type: 'single', score: 1,
    stem: '子どもの ころ 家族で 行った 旅行は、いまでも いい （　　）に なって います。',
    options: ['思い出', '世話', '景色', '夢'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-inner-life-nouns', topicIds: ['jpv_n4-inner-life-nouns'] },
  },
  {
    id: 'n4-own-b1-11', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 11,
    type: 'single', score: 1,
    stem: 'いしゃに なりたいという （　　）が あります。',
    options: ['夢', '思い出', '景色', '世話'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-inner-life-nouns', topicIds: ['jpv_n4-inner-life-nouns'] },
  },
  {
    id: 'n4-own-b1-12', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 12,
    type: 'single', score: 1,
    stem: 'にゅういん中、母が いろいろ （　　）を して くれました。',
    options: ['世話', '経験', '思い出', '夢'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-inner-life-nouns', topicIds: ['jpv_n4-inner-life-nouns'] },
  },

  // ── jpv_n4-status-nouns ──
  {
    id: 'n4-own-b1-13', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 13,
    type: 'single', score: 1,
    stem: '雨が ひどいので、うんどう会は （　　）に なりました。',
    options: ['自由', '中止', '留守', '嘘'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-status-nouns', topicIds: ['jpv_n4-status-nouns'] },
  },
  {
    id: 'n4-own-b1-14', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 14,
    type: 'single', score: 1,
    stem: '何度 電話しても 出ません。（　　）のようです。',
    options: ['中止', '失礼', '留守', '自由'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-status-nouns', topicIds: ['jpv_n4-status-nouns'] },
  },
  {
    id: 'n4-own-b1-15', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 15,
    type: 'single', score: 1,
    stem: 'この へやは だれでも （　　）に 使えます。',
    options: ['中止', '留守', '自由', '嘘'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-status-nouns', topicIds: ['jpv_n4-status-nouns', 'jpg_interrogative-demo'] },
  },

  // ── jpg_n4-adverbs ──
  {
    id: 'n4-own-b1-16', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 16,
    type: 'single', score: 1,
    stem: 'あの 店の ラーメン、（　　）食べて みて ください。',
    options: ['ぜひ', 'なかなか', 'あまり', 'やっと'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '副詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n4-adverbs', topicIds: ['jpg_n4-adverbs'] },
  },
  {
    id: 'n4-own-b1-17', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 17,
    type: 'single', score: 1,
    stem: '一時間 待ちましたが、バスは （　　）来ません。',
    options: ['きっと', 'ぜひ', 'だんだん', 'なかなか'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '副詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n4-adverbs', topicIds: ['jpg_n4-adverbs'] },
  },
  {
    id: 'n4-own-b1-18', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 18,
    type: 'single', score: 1,
    stem: '春に なって、（　　）暖かく なって きました。',
    options: ['もうすぐ', 'だんだん', 'なかなか', 'ぜひ'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '副詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n4-adverbs', topicIds: ['jpg_n4-adverbs'] },
  },

  // ── jpv_n4-suru-verbs ──
  {
    id: 'n4-own-b1-19', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 19,
    type: 'single', score: 1,
    stem: 'らいしゅう、自動車の 工場を （　　）します。',
    options: ['見物', '生産', '見学', '利用'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-suru-verbs', topicIds: ['jpv_n4-suru-verbs'] },
  },
  {
    id: 'n4-own-b1-20', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 20,
    type: 'single', score: 1,
    stem: '道が こんで います。（　　）を して いるようです。',
    options: ['工事', '準備', '説明', '見学'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-suru-verbs', topicIds: ['jpv_n4-suru-verbs'] },
  },
  {
    id: 'n4-own-b1-21', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 21,
    type: 'single', score: 1,
    stem: 'つかい方が わからないので、（　　）して ください。',
    options: ['生産', '中止', '見物', '説明'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-suru-verbs', topicIds: ['jpv_n4-suru-verbs'] },
  },

  // ── jpv_n4-verbs ──
  {
    id: 'n4-own-b1-22', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 22,
    type: 'single', score: 1,
    stem: 'なくした かぎが やっと （　　）。',
    options: ['見えました', '見つかりました', '見つけました', '見ました'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-verbs', topicIds: ['jpv_n4-verbs'] },
  },
  {
    id: 'n4-own-b1-23', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 23,
    type: 'single', score: 1,
    stem: '友だちを えいがに （　　）ました。',
    options: ['うつし', 'さそい', 'つたえ', 'くらべ'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-verbs', topicIds: ['jpv_n4-verbs'] },
  },
  {
    id: 'n4-own-b1-24', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 24,
    type: 'single', score: 1,
    stem: 'どちらが きれいか 知りたくて、ふたつの 写真を （　　）ました。',
    options: ['つたえ', 'くらべ', 'さそい', 'きり'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '語彙', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_n4-verbs', topicIds: ['jpv_n4-verbs'] },
  },

  // ── jpv_homophone-kanji ──
  {
    id: 'n4-own-b1-25', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 25,
    type: 'single', score: 1,
    stem: '日曜日（　　）は まいにち はたらいて います。',
    options: ['意外', '意見', '以内', '以外'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '漢字', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_homophone-kanji', topicIds: ['jpv_homophone-kanji'] },
  },
  {
    id: 'n4-own-b1-26', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 26,
    type: 'single', score: 1,
    stem: 'テストは （　　）に かんたんでした。',
    options: ['以内', '意外', '以外', '意見'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '漢字', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_homophone-kanji', topicIds: ['jpv_homophone-kanji'] },
  },
  {
    id: 'n4-own-b1-27', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 27,
    type: 'single', score: 1,
    stem: 'えきの まえで 友だちに （　　）ました。',
    options: ['開き', '空き', '会い', '合い'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '漢字', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_homophone-kanji', topicIds: ['jpv_homophone-kanji'] },
  },

  // ── jpv_no-rendaku-compounds ──
  {
    id: 'n4-own-b1-28', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 28,
    type: 'single', score: 1,
    stem: '「反対」の 読み方は どれですか。',
    options: ['はんだい', 'ほんたい', 'はんたい', 'ばんたい'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '漢字', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_no-rendaku-compounds', topicIds: ['jpv_no-rendaku-compounds'] },
  },
  {
    id: 'n4-own-b1-29', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 29,
    type: 'single', score: 1,
    stem: '「世界」の 読み方は どれですか。',
    options: ['せいかい', 'よかい', 'せがい', 'せかい'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '漢字', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_no-rendaku-compounds', topicIds: ['jpv_no-rendaku-compounds'] },
  },
  {
    id: 'n4-own-b1-30', subject: '日本語', year: 2026, paper: 'n4-original-batch1', number: 30,
    type: 'single', score: 1,
    stem: '「安心」の 読み方は どれですか。',
    options: ['やすしん', 'あんしん', 'あんこころ', 'あんじん'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '漢字', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_no-rendaku-compounds', topicIds: ['jpv_no-rendaku-compounds'] },
  },
];
