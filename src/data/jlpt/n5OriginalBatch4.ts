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
    options: ['やま', 'かわ', 'うみ', 'そら'],
    answer: '1',
    explain: '「山」單獨出現讀訓読み「やま」。音読み是「サン」（例：富士山＝ふじさん），單獨當名詞時用訓読み。',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-kunyomi', topicIds: ['jpv_kanji-kunyomi'] },
  },
  {
    id: 'n5-own-b4-02', subject: '日本語', year: 2026, paper: 'original-batch4', number: 2,
    type: 'single', score: 1,
    stem: 'かばんの 中 に ほんが あります。「中」の 読み方は どれですか。',
    options: ['そと', 'なか', 'うえ', 'した'],
    answer: '2',
    explain: '「中」單獨當位置名詞時讀訓読み「なか」。誘答都是其他位置名詞的讀音：そと＝外、うえ＝上、した＝下。',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-kunyomi', topicIds: ['jpv_kanji-kunyomi'] },
  },

  // ── jpv_kanji-onyomi（音読み）──
  {
    id: 'n5-own-b4-03', subject: '日本語', year: 2026, paper: 'original-batch4', number: 3,
    type: 'single', score: 1,
    stem: 'わたしは 大学 に いきます。「大学」の 読み方は どれですか。',
    options: ['だいがく', 'おおがく', 'たいがく', 'だいかく'],
    answer: '1',
    explain: '「大学」是漢語詞，兩字都用音読み：だい＋がく。「おお」是「大」的訓読み（大きい＝おおきい），漢語詞裡不用。',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-onyomi', topicIds: ['jpv_kanji-onyomi'] },
  },
  {
    id: 'n5-own-b4-04', subject: '日本語', year: 2026, paper: 'original-batch4', number: 4,
    type: 'single', score: 1,
    stem: 'まいにち 電車 で かいしゃへ いきます。「電車」の 読み方は どれですか。',
    options: ['でんしゃ', 'でんくるま', 'かでんしゃ', 'てんしゃ'],
    answer: '1',
    explain: '「電車」兩字都用音読み：でん＋しゃ。「くるま」是「車」的訓読み，漢語複合詞裡不會訓読み混音読み。',
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-onyomi', topicIds: ['jpv_kanji-onyomi'] },
  },

  // ── jpv_rendaku（連濁）──
  {
    id: 'n5-own-b4-05', subject: '日本語', year: 2026, paper: 'original-batch4', number: 5,
    type: 'single', score: 1,
    stem: 'にほんの ひらがなと かたかなを 「かな」と いいます。「ひらがな」の かなの ぶぶんは なぜ 「がな」に なりますか。',
    options: ['連濁で 「か」が 「が」に なるから', 'まちがいだから', 'かなは いつも 「がな」だから', 'ひらがなだけ とくべつだから'],
    answer: '1',
    explain: '複合詞的後半第一個音變濁音叫「連濁」：ひら＋かな → ひらがな。同理 かた＋かな → かたかな 不連濁（前項為漢語時常不連濁），連濁有例外，要個別記。',
    source: { book: 'JLPT N5', chapter: '連濁', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_rendaku', topicIds: ['jpv_rendaku'] },
  },
  {
    id: 'n5-own-b4-06', subject: '日本語', year: 2026, paper: 'original-batch4', number: 6,
    type: 'single', score: 1,
    stem: 'ちいさい こどもを 「こども」と いいます。「はな」＋「ち」＝ はなぢ（鼻血）。この ように 音が かわるのは どれですか。',
    options: ['て＋かみ → てがみ', 'やま＋みち → やまみち', 'あか＋い → あかい', 'たか＋い → たかい'],
    answer: '1',
    explain: '「て＋かみ → てがみ（手紙）」的 か 變 が，是連濁。やまみち 的 み 本來就是濁不了的音；あかい・たかい 是形容詞活用，不是複合詞連濁。',
    source: { book: 'JLPT N5', chapter: '連濁', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_rendaku', topicIds: ['jpv_rendaku'] },
  },

  // ── jpv_okurigana（送り仮名）──
  {
    id: 'n5-own-b4-07', subject: '日本語', year: 2026, paper: 'original-batch4', number: 7,
    type: 'single', score: 1,
    stem: 'ごはんを （　　）。ただしい かきかたは どれですか。',
    options: ['食る', '食べる', '食べます る', '食べるる'],
    answer: '2',
    explain: '「食べる」的送り仮名是「べる」——活用會變的部分要寫成假名。只寫「食る」漏了べ，讀者無法判斷是 たべる 還是 くう。',
    source: { book: 'JLPT N5', chapter: '送り仮名', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_okurigana', topicIds: ['jpv_okurigana'] },
  },
  {
    id: 'n5-own-b4-08', subject: '日本語', year: 2026, paper: 'original-batch4', number: 8,
    type: 'single', score: 1,
    stem: 'あたらしい くつを かいました。「あたらしい」の ただしい かきかたは どれですか。',
    options: ['新らしい', '新しい', '新い', '新たらしい'],
    answer: '2',
    explain: '「新しい」的送り仮名從「し」開始。這是常見錯誤——很多人會多寫成「新らしい」，但正式寫法只有「新しい」。',
    source: { book: 'JLPT N5', chapter: '送り仮名', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_okurigana', topicIds: ['jpv_okurigana'] },
  },

  // ── jpv_kanji-writing（由讀音選漢字）──
  {
    id: 'n5-own-b4-09', subject: '日本語', year: 2026, paper: 'original-batch4', number: 9,
    type: 'single', score: 1,
    stem: 'あさ 「がっこう」へ いきます。「がっこう」の かんじは どれですか。',
    options: ['学校', '学枝', '字校', '学交'],
    answer: '1',
    explain: '「がっこう」＝学校。誘答都是形近字替換：枝（えだ）、字（じ）、交（こう）——字形像但意思完全不同。',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-writing', topicIds: ['jpv_kanji-writing'] },
  },
  {
    id: 'n5-own-b4-10', subject: '日本語', year: 2026, paper: 'original-batch4', number: 10,
    type: 'single', score: 1,
    stem: 'この 「みせ」は やすいです。「みせ」の かんじは どれですか。',
    options: ['店', '広', '席', '底'],
    answer: '1',
    explain: '「みせ」＝店。誘答是形近或部首相似的字：広（ひろい）、席（せき）、底（そこ）。',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-writing', topicIds: ['jpv_kanji-writing'] },
  },

  // ── jpv_kanji-shape-confusion（形近漢字）──
  {
    id: 'n5-own-b4-11', subject: '日本語', year: 2026, paper: 'original-batch4', number: 11,
    type: 'single', score: 1,
    stem: 'ひるやすみに 「やすみます」。ただしい かんじは どれですか。',
    options: ['休みます', '体みます', '本みます', '木みます'],
    answer: '1',
    explain: '「休」是人＋木（人靠在樹旁休息）。「体」是人＋本，意思是身體——兩個字只差一橫，是最常見的形近錯誤。',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-shape-confusion', topicIds: ['jpv_kanji-shape-confusion'] },
  },
  {
    id: 'n5-own-b4-12', subject: '日本語', year: 2026, paper: 'original-batch4', number: 12,
    type: 'single', score: 1,
    stem: 'わたしは 「おおきい」いぬが すきです。ただしい かんじは どれですか。',
    options: ['大きい', '太きい', '犬きい', '天きい'],
    answer: '1',
    explain: '「大」多一點是「太」（ふとい＝粗），多一橫是「天」，加一點在右上是「犬」——這四個字全靠一筆之差區分。',
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-shape-confusion', topicIds: ['jpv_kanji-shape-confusion'] },
  },

  // ── jpv_counters（助数詞）──
  {
    id: 'n5-own-b4-13', subject: '日本語', year: 2026, paper: 'original-batch4', number: 13,
    type: 'single', score: 1,
    stem: 'えんぴつを 3（　　）ください。',
    options: ['ぼん', 'ほん', 'ぽん', 'まい'],
    answer: '1',
    explain: '細長物用「本」，但讀音會隨數字變：1本＝いっぽん、3本＝さんぼん、6本＝ろっぽん。3 接濁音「ぼん」。「まい」用於薄平物（紙、襯衫）。',
    source: { book: 'JLPT N5', chapter: '助数詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_counters', topicIds: ['jpv_counters'] },
  },
  {
    id: 'n5-own-b4-14', subject: '日本語', year: 2026, paper: 'original-batch4', number: 14,
    type: 'single', score: 1,
    stem: 'かみを 5（　　）ください。',
    options: ['ほん', 'まい', 'さつ', 'ひき'],
    answer: '2',
    explain: '紙、切符、シャツ 這類薄平的東西用「枚（まい）」。本＝細長物、冊＝書本、匹＝小動物——助数詞選錯是 N5 高頻失分點。',
    source: { book: 'JLPT N5', chapter: '助数詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_counters', topicIds: ['jpv_counters'] },
  },

  // ── jpv_time-words（時間表現）──
  {
    id: 'n5-own-b4-15', subject: '日本語', year: 2026, paper: 'original-batch4', number: 15,
    type: 'single', score: 1,
    stem: 'きょうの つぎの ひは （　　）です。',
    options: ['きのう', 'あした', 'おととい', 'まいにち'],
    answer: '2',
    explain: '今天的下一天是「あした」（明天）。きのう＝昨天、おととい＝前天、まいにち＝每天（不是特定某一天）。',
    source: { book: 'JLPT N5', chapter: '時間表現', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_time-words', topicIds: ['jpv_time-words'] },
  },
  {
    id: 'n5-own-b4-16', subject: '日本語', year: 2026, paper: 'original-batch4', number: 16,
    type: 'single', score: 1,
    stem: 'あさ おきて、よるは ねます。「ひるま」は いつですか。',
    options: ['あさの まえ', 'あさと よるの あいだ', 'よるの あと', 'ねる とき'],
    answer: '2',
    explain: '「ひるま（昼間）」是早上到晚上之間的白天時段。朝→昼→夕方→夜 是一天的順序，時間詞要成組記。',
    source: { book: 'JLPT N5', chapter: '時間表現', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_time-words', topicIds: ['jpv_time-words'] },
  },

  // ── jpv_basic-nouns（基本名詞）──
  {
    id: 'n5-own-b4-17', subject: '日本語', year: 2026, paper: 'original-batch4', number: 17,
    type: 'single', score: 1,
    stem: 'てがみを かくとき、（　　）を つかいます。',
    options: ['ぼうし', 'えんぴつ', 'くつした', 'まど'],
    answer: '2',
    explain: '寫信要用「えんぴつ（鉛筆）」。ぼうし＝帽子、くつした＝襪子、まど＝窗戶，都與書寫無關。',
    source: { book: 'JLPT N5', chapter: '語彙', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_basic-nouns', topicIds: ['jpv_basic-nouns'] },
  },
  {
    id: 'n5-own-b4-18', subject: '日本語', year: 2026, paper: 'original-batch4', number: 18,
    type: 'single', score: 1,
    stem: 'あついので （　　）を あけました。',
    options: ['まど', 'いす', 'ほん', 'とけい'],
    answer: '1',
    explain: '因為熱所以打開的是「まど（窗戶）」。いす＝椅子、ほん＝書、とけい＝時鐘，都不是能開來通風的東西。',
    source: { book: 'JLPT N5', chapter: '語彙', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_basic-nouns', topicIds: ['jpv_basic-nouns'] },
  },

  // ── jpv_position-nouns（位置名詞）──
  {
    id: 'n5-own-b4-19', subject: '日本語', year: 2026, paper: 'original-batch4', number: 19,
    type: 'single', score: 1,
    stem: 'ねこが つくえの （　　）に います。つくえより ひくい ところです。',
    options: ['うえ', 'した', 'なか', 'よこ'],
    answer: '2',
    explain: '比桌子低的位置是「した（下）」。うえ＝上、なか＝裡面、よこ＝旁邊。位置名詞要成組記：上下・中外・前後・左右。',
    source: { book: 'JLPT N5', chapter: '位置名詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_position-nouns', topicIds: ['jpv_position-nouns'] },
  },
  {
    id: 'n5-own-b4-20', subject: '日本語', year: 2026, paper: 'original-batch4', number: 20,
    type: 'single', score: 1,
    stem: 'ゆうびんきょくは ぎんこうと コンビニの （　　）に あります。',
    options: ['あいだ', 'うしろ', 'まえ', 'となり'],
    answer: '1',
    explain: '夾在兩個地點中間用「〜と〜の あいだ」。となり 是「隔壁」只能對一個對象；まえ／うしろ 是前後不是中間。',
    source: { book: 'JLPT N5', chapter: '位置名詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_position-nouns', topicIds: ['jpv_position-nouns'] },
  },
];
