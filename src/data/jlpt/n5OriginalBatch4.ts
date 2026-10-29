import { JlptQuestion } from '../../types';

// Batch4：補齊題數不足的考點。
//
// 為什麼補這 10 個：弱點分析要「同一考點答滿 3 題」才納入統計（低於這個數字
// 就只是雜訊，不足以判定弱點）。Batch1 的這 10 個文字語彙考點各只有 2 題，
// 永遠達不到門檻——練完也不會知道自己弱在哪。各補 2 題後變 4 題，超過門檻。
//
// 誘答一律取自真實錯誤來源，不是隨機湊：
//   訓読み/音読み互相干擾、連濁的有無、送り仮名切點、形近漢字、
//   助数詞的音變（本/匹/杯）、位置名詞的相對關係。
// 這樣答錯時看選項就知道自己是哪一種誤解。

export const N5_ORIGINAL_BATCH4: JlptQuestion[] = [
  // ── jpv_kanji-kunyomi（訓読み）──
  {
    id: 'n5-own-b4-01', subject: '日本語', year: 2026, paper: 'original-batch4', number: 1,
    type: 'single', score: 1,
    stem: 'あの 山 は とても たかいです。「山」の 読み方は どれですか。',
    options: ['うみ', 'そら', 'やま', 'かわ'],
    answer: '3',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-kunyomi', topicIds: ['jpv_kanji-kunyomi'] },
  },
  {
    id: 'n5-own-b4-02', subject: '日本語', year: 2026, paper: 'original-batch4', number: 2,
    type: 'single', score: 1,
    stem: 'かばんの 中 に ほんが あります。「中」の 読み方は どれですか。',
    options: ['うえ', 'そと', 'した', 'なか'],
    answer: '4',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-kunyomi', topicIds: ['jpv_kanji-kunyomi'] },
  },

  // ── jpv_kanji-onyomi（音読み）──
  {
    id: 'n5-own-b4-03', subject: '日本語', year: 2026, paper: 'original-batch4', number: 3,
    type: 'single', score: 1,
    stem: 'わたしは 大学 に いきます。「大学」の 読み方は どれですか。',
    options: ['たいがく', 'だいかく', 'おおがく', 'だいがく'],
    answer: '4',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-onyomi', topicIds: ['jpv_kanji-onyomi'] },
  },
  {
    id: 'n5-own-b4-04', subject: '日本語', year: 2026, paper: 'original-batch4', number: 4,
    type: 'single', score: 1,
    stem: 'まいにち 電車 で かいしゃへ いきます。「電車」の 読み方は どれですか。',
    options: ['でんしゃ', 'てんしゃ', 'でんくるま', 'かでんしゃ'],
    answer: '1',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-onyomi', topicIds: ['jpv_kanji-onyomi'] },
  },

  // ── jpv_rendaku（連濁）──
  {
    id: 'n5-own-b4-05', subject: '日本語', year: 2026, paper: 'original-batch4', number: 5,
    type: 'single', score: 1,
    stem: 'にほんの ひらがなと かたかなを 「かな」と いいます。「ひらがな」の かなの ぶぶんは なぜ 「がな」に なりますか。',
    options: ['連濁で 「か」が 「が」に なるから', 'ひらがなだけ とくべつだから', 'かなは いつも 「がな」だから', 'まちがいだから'],
    answer: '1',
    source: { book: 'JLPT N5', chapter: '連濁', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_rendaku', topicIds: ['jpv_rendaku'] },
  },
  {
    id: 'n5-own-b4-06', subject: '日本語', year: 2026, paper: 'original-batch4', number: 6,
    type: 'single', score: 1,
    stem: 'ちいさい こどもを 「こども」と いいます。「はな」＋「ち」＝ はなぢ（鼻血）。この ように 音が かわるのは どれですか。',
    options: ['て＋かみ → てがみ', 'たか＋い → たかい', 'やま＋みち → やまみち', 'あか＋い → あかい'],
    answer: '1',
    source: { book: 'JLPT N5', chapter: '連濁', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_rendaku', topicIds: ['jpv_rendaku'] },
  },

  // ── jpv_okurigana（送り仮名）──
  {
    id: 'n5-own-b4-07', subject: '日本語', year: 2026, paper: 'original-batch4', number: 7,
    type: 'single', score: 1,
    stem: 'ごはんを （　　）。ただしい かきかたは どれですか。',
    options: ['食る', '食べるる', '食べます る', '食べる'],
    answer: '4',
    source: { book: 'JLPT N5', chapter: '送り仮名', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_okurigana', topicIds: ['jpv_okurigana'] },
  },
  {
    id: 'n5-own-b4-08', subject: '日本語', year: 2026, paper: 'original-batch4', number: 8,
    type: 'single', score: 1,
    stem: 'あたらしい くつを かいました。「あたらしい」の ただしい かきかたは どれですか。',
    options: ['新らしい', '新しい', '新い', '新たらしい'],
    answer: '2',
    source: { book: 'JLPT N5', chapter: '送り仮名', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_okurigana', topicIds: ['jpv_okurigana'] },
  },

  // ── jpv_kanji-writing（由讀音選漢字）──
  {
    id: 'n5-own-b4-09', subject: '日本語', year: 2026, paper: 'original-batch4', number: 9,
    type: 'single', score: 1,
    stem: 'あさ 「がっこう」へ いきます。「がっこう」の かんじは どれですか。',
    options: ['学校', '字校', '学枝', '学交'],
    answer: '1',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-writing', topicIds: ['jpv_kanji-writing'] },
  },
  {
    id: 'n5-own-b4-10', subject: '日本語', year: 2026, paper: 'original-batch4', number: 10,
    type: 'single', score: 1,
    stem: 'この 「みせ」は やすいです。「みせ」の かんじは どれですか。',
    options: ['底', '席', '店', '広'],
    answer: '3',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-writing', topicIds: ['jpv_kanji-writing'] },
  },

  // ── jpv_kanji-shape-confusion（形近漢字）──
  {
    id: 'n5-own-b4-11', subject: '日本語', year: 2026, paper: 'original-batch4', number: 11,
    type: 'single', score: 1,
    stem: 'ひるやすみに 「やすみます」。ただしい かんじは どれですか。',
    options: ['木みます', '本みます', '体みます', '休みます'],
    answer: '4',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-shape-confusion', topicIds: ['jpv_kanji-shape-confusion'] },
  },
  {
    id: 'n5-own-b4-12', subject: '日本語', year: 2026, paper: 'original-batch4', number: 12,
    type: 'single', score: 1,
    stem: 'わたしは 「おおきい」いぬが すきです。ただしい かんじは どれですか。',
    options: ['太きい', '大きい', '犬きい', '天きい'],
    answer: '2',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-shape-confusion', topicIds: ['jpv_kanji-shape-confusion'] },
  },

  // ── jpv_counters（助数詞）──
  {
    id: 'n5-own-b4-13', subject: '日本語', year: 2026, paper: 'original-batch4', number: 13,
    type: 'single', score: 1,
    stem: 'えんぴつを 3（　　）ください。',
    options: ['ぼん', 'ほん', 'まい', 'ぽん'],
    answer: '1',
    source: { book: 'JLPT N5', chapter: '助数詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_counters', topicIds: ['jpv_counters'] },
  },
  {
    id: 'n5-own-b4-14', subject: '日本語', year: 2026, paper: 'original-batch4', number: 14,
    type: 'single', score: 1,
    stem: 'かみを 5（　　）ください。',
    options: ['さつ', 'ひき', 'まい', 'ほん'],
    answer: '3',
    source: { book: 'JLPT N5', chapter: '助数詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_counters', topicIds: ['jpv_counters'] },
  },

  // ── jpv_time-words（時間表現）──
  {
    id: 'n5-own-b4-15', subject: '日本語', year: 2026, paper: 'original-batch4', number: 15,
    type: 'single', score: 1,
    stem: 'きょうの つぎの ひは （　　）です。',
    options: ['おととい', 'きのう', 'まいにち', 'あした'],
    answer: '4',
    source: { book: 'JLPT N5', chapter: '時間表現', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_time-words', topicIds: ['jpv_time-words'] },
  },
  {
    id: 'n5-own-b4-16', subject: '日本語', year: 2026, paper: 'original-batch4', number: 16,
    type: 'single', score: 1,
    stem: 'あさ おきて、よるは ねます。「ひるま」は いつですか。',
    options: ['あさと よるの あいだ', 'ねる とき', 'あさの まえ', 'よるの あと'],
    answer: '1',
    source: { book: 'JLPT N5', chapter: '時間表現', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_time-words', topicIds: ['jpv_time-words'] },
  },

  // ── jpv_basic-nouns（基本名詞）──
  {
    id: 'n5-own-b4-17', subject: '日本語', year: 2026, paper: 'original-batch4', number: 17,
    type: 'single', score: 1,
    stem: 'てがみを かくとき、（　　）を つかいます。',
    options: ['くつした', 'まど', 'えんぴつ', 'ぼうし'],
    answer: '3',
    source: { book: 'JLPT N5', chapter: '語彙', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_basic-nouns', topicIds: ['jpv_basic-nouns'] },
  },
  {
    id: 'n5-own-b4-18', subject: '日本語', year: 2026, paper: 'original-batch4', number: 18,
    type: 'single', score: 1,
    stem: 'あついので （　　）を あけました。',
    options: ['いす', 'ほん', 'まど', 'とけい'],
    answer: '3',
    source: { book: 'JLPT N5', chapter: '語彙', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_basic-nouns', topicIds: ['jpv_basic-nouns'] },
  },

  // ── jpv_position-nouns（位置名詞）──
  {
    id: 'n5-own-b4-19', subject: '日本語', year: 2026, paper: 'original-batch4', number: 19,
    type: 'single', score: 1,
    stem: 'ねこが つくえの （　　）に います。つくえより ひくい ところです。',
    options: ['うえ', 'なか', 'した', 'よこ'],
    answer: '3',
    source: { book: 'JLPT N5', chapter: '位置名詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_position-nouns', topicIds: ['jpv_position-nouns'] },
  },
  {
    id: 'n5-own-b4-20', subject: '日本語', year: 2026, paper: 'original-batch4', number: 20,
    type: 'single', score: 1,
    stem: 'ゆうびんきょくは ぎんこうと コンビニの （　　）に あります。',
    options: ['まえ', 'となり', 'うしろ', 'あいだ'],
    answer: '4',
    source: { book: 'JLPT N5', chapter: '位置名詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_position-nouns', topicIds: ['jpv_position-nouns'] },
  },
];
