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
    explain: {
      'zh-TW': '「山」單獨出現讀訓読み「やま」。音読み是「サン」（例：富士山＝ふじさん），單獨當名詞時用訓読み。',
      'zh-CN': '「山」单独出现时读训読み「やま」。音読み是「サン」（例：富士山＝ふじさん），单独作名词时用训読み。',
      'en': 'When 「山」 stands alone, it takes its kun\'yomi (native Japanese reading) 「やま」. Its on\'yomi is 「サン」 (as in 富士山＝ふじさん), but as a standalone noun it uses the kun\'yomi.',
      'ko': '「山」가 단독으로 쓰이면 훈독「やま」로 읽어요. 음독은「サン」(예: 富士山＝ふじさん)이지만, 단독 명사로 쓰일 때는 훈독으로 읽어요.',
      'es': 'Cuando 「山」 aparece solo, se lee con kun\'yomi: 「やま」. Su on\'yomi es 「サン」 (p. ej., 富士山＝ふじさん), pero como sustantivo independiente se usa el kun\'yomi.',
    },
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-kunyomi', topicIds: ['jpv_kanji-kunyomi'] },
  },
  {
    id: 'n5-own-b4-02', subject: '日本語', year: 2026, paper: 'original-batch4', number: 2,
    type: 'single', score: 1,
    stem: 'かばんの 中 に ほんが あります。「中」の 読み方は どれですか。',
    options: ['うえ', 'そと', 'した', 'なか'],
    answer: '4',
    explain: {
      'zh-TW': '「中」單獨當位置名詞時讀訓読み「なか」。誘答都是其他位置名詞的讀音：そと＝外、うえ＝上、した＝下。',
      'zh-CN': '「中」单独作位置名词时读训読み「なか」。干扰项都是其他位置名词的读音：そと＝外、うえ＝上、した＝下。',
      'en': 'As a standalone position noun, 「中」 takes its kun\'yomi 「なか」. The wrong options are readings of other position nouns: そと＝外, うえ＝上, した＝下.',
      'ko': '「中」가 단독으로 위치 명사로 쓰일 때는 훈독「なか」로 읽어요. 오답은 모두 다른 위치 명사의 읽기예요: そと＝外, うえ＝上, した＝下.',
      'es': 'Cuando 「中」 es un sustantivo de posición independiente, se lee con kun\'yomi: 「なか」. Las opciones trampa son lecturas de otros sustantivos de posición: そと＝外, うえ＝上, した＝下.',
    },
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
    explain: {
      'zh-TW': '「大学」是漢語詞，兩字都用音読み：だい＋がく。「おお」是「大」的訓読み（大きい＝おおきい），漢語詞裡不用。',
      'zh-CN': '「大学」是汉语词，两个字都用音読み：だい＋がく。「おお」是「大」的训読み（大きい＝おおきい），汉语词里不用。',
      'en': '「大学」 is a Sino-Japanese compound, so both kanji use on\'yomi: だい＋がく. 「おお」 is the kun\'yomi of 「大」 (as in 大きい＝おおきい) and is not used in such compounds.',
      'ko': '「大学」는 한자어라서 두 글자 모두 음독으로 읽어요: だい＋がく. 한국어 \'대학\'과 같은 한자어예요. 「おお」는「大」의 훈독(大きい＝おおきい)이라서 한자어에는 쓰지 않아요.',
      'es': '「大学」 es una palabra sino-japonesa (kango), así que los dos kanji se leen con on\'yomi: だい＋がく. 「おお」 es el kun\'yomi de 「大」 (大きい＝おおきい) y no se usa en kango.',
    },
    source: { book: 'JLPT N5', chapter: '漢字読み', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-onyomi', topicIds: ['jpv_kanji-onyomi'] },
  },
  {
    id: 'n5-own-b4-04', subject: '日本語', year: 2026, paper: 'original-batch4', number: 4,
    type: 'single', score: 1,
    stem: 'まいにち 電車 で かいしゃへ いきます。「電車」の 読み方は どれですか。',
    options: ['でんしゃ', 'てんしゃ', 'でんくるま', 'かでんしゃ'],
    answer: '1',
    explain: {
      'zh-TW': '「電車」兩字都用音読み：でん＋しゃ。「くるま」是「車」的訓読み，漢語複合詞裡不會訓読み混音読み。',
      'zh-CN': '「電車」两个字都用音読み：でん＋しゃ。「くるま」是「車」的训読み，汉语复合词里不会训読み和音読み混用。',
      'en': 'Both kanji in 「電車」 use on\'yomi: でん＋しゃ. 「くるま」 is the kun\'yomi of 「車」. Sino-Japanese compounds like this normally do not mix kun\'yomi with on\'yomi.',
      'ko': '「電車」는 두 글자 모두 음독으로 읽어요: でん＋しゃ. 「くるま」는「車」의 훈독이고, 이런 한자어 복합어에서는 훈독과 음독을 섞어 읽지 않아요.',
      'es': 'Los dos kanji de 「電車」 se leen con on\'yomi: でん＋しゃ. 「くるま」 es el kun\'yomi de 「車」; en un compuesto sino-japonés normalmente no se mezcla kun\'yomi con on\'yomi.',
    },
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
    explain: {
      'zh-TW': '複合詞的後半第一個音變濁音叫「連濁」：ひら＋かな → ひらがな。同理 かた＋かな → かたかな 不連濁（前項為漢語時常不連濁），連濁有例外，要個別記。',
      'zh-CN': '复合词后半部分的第一个音变成浊音，叫「連濁」：ひら＋かな → ひらがな。但「かた＋かな → かたかな」不连浊，可见连浊有例外，要个别记忆。',
      'en': 'When the first sound of the second part of a compound becomes voiced, this is called rendaku (連濁): ひら＋かな → ひらがな. But かた＋かな → かたかな does not undergo rendaku. Rendaku has exceptions, so learn each word individually.',
      'ko': '복합어 뒷부분의 첫소리가 탁음으로 바뀌는 것을 연탁(連濁)이라고 해요: ひら＋かな → ひらがな. 반면 かた＋かな → かたかな는 연탁이 일어나지 않아요. 연탁에는 예외가 있으니 하나씩 외워야 해요.',
      'es': 'Cuando el primer sonido de la segunda parte de un compuesto se vuelve sonoro, se llama rendaku (連濁): ひら＋かな → ひらがな. En cambio, かた＋かな → かたかな no se sonoriza. El rendaku tiene excepciones y hay que aprenderlas una por una.',
    },
    source: { book: 'JLPT N5', chapter: '連濁', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_rendaku', topicIds: ['jpv_rendaku'] },
  },
  {
    id: 'n5-own-b4-06', subject: '日本語', year: 2026, paper: 'original-batch4', number: 6,
    type: 'single', score: 1,
    stem: 'ちいさい こどもを 「こども」と いいます。「はな」＋「ち」＝ はなぢ（鼻血）。この ように 音が かわるのは どれですか。',
    options: ['て＋かみ → てがみ', 'たか＋い → たかい', 'やま＋みち → やまみち', 'あか＋い → あかい'],
    answer: '1',
    explain: {
      'zh-TW': '「て＋かみ → てがみ（手紙）」的 か 變 が，是連濁。やまみち 的 み 本來就是濁不了的音；あかい・たかい 是形容詞活用，不是複合詞連濁。',
      'zh-CN': '「て＋かみ → てがみ（手紙）」中か变が，是连浊。やまみち 的 み 本来就不能变浊；あかい・たかい 是形容词活用，不是复合词连浊。',
      'en': 'In 「て＋かみ → てがみ（手紙）」, か becomes が. This is rendaku. In やまみち, み has no voiced form, so it cannot change. あかい and たかい are adjective forms, not compounds with rendaku.',
      'ko': '「て＋かみ → てがみ（手紙）」에서 か가 が로 바뀌는 것이 연탁이에요. やまみち의 み는 원래 탁음이 될 수 없는 소리이고, あかい・たかい는 형용사 활용이지 복합어의 연탁이 아니에요.',
      'es': 'En 「て＋かみ → てがみ（手紙）」, か pasa a が: eso es rendaku. En やまみち, み es un sonido que no puede volverse sonoro; あかい y たかい son formas de adjetivo, no compuestos con rendaku.',
    },
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
    explain: {
      'zh-TW': '「食べる」的送り仮名是「べる」——活用會變的部分要寫成假名。只寫「食る」漏了べ，讀者無法判斷是 たべる 還是 くう。',
      'zh-CN': '「食べる」的送り仮名是「べる」，活用时会变化的部分要写成假名。只写「食る」漏掉了べ，读者无法判断是 たべる 还是 くう。',
      'en': 'The okurigana of 「食べる」 is 「べる」, because the part that changes in conjugation is written in kana. 「食る」 leaves out the べ, so the reader cannot tell whether it is たべる or くう.',
      'ko': '「食べる」의 오쿠리가나는「べる」예요. 활용으로 바뀌는 부분은 가나로 써요. 「食る」처럼 쓰면 べ가 빠져서 たべる인지 くう인지 알 수 없어요.',
      'es': 'El okurigana de 「食べる」 es 「べる」: la parte que cambia al conjugar se escribe en kana. Si solo escribes 「食る」, falta べ y quien lo lee no sabe si es たべる o くう.',
    },
    source: { book: 'JLPT N5', chapter: '送り仮名', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_okurigana', topicIds: ['jpv_okurigana'] },
  },
  {
    id: 'n5-own-b4-08', subject: '日本語', year: 2026, paper: 'original-batch4', number: 8,
    type: 'single', score: 1,
    stem: 'あたらしい くつを かいました。「あたらしい」の ただしい かきかたは どれですか。',
    options: ['新らしい', '新しい', '新い', '新たらしい'],
    answer: '2',
    explain: {
      'zh-TW': '「新しい」的送り仮名從「し」開始。這是常見錯誤——很多人會多寫成「新らしい」，但正式寫法只有「新しい」。',
      'zh-CN': '「新しい」的送り仮名从「し」开始。这是常见错误，很多人会多写成「新らしい」，但正式写法只有「新しい」。',
      'en': 'The okurigana of 「新しい」 starts from 「し」. A common mistake is to write 「新らしい」 with an extra ら, but the only standard spelling is 「新しい」.',
      'ko': '「新しい」의 오쿠리가나는「し」부터 시작해요. 흔히「新らしい」라고 잘못 쓰지만, 정식 표기는「新しい」뿐이에요.',
      'es': 'El okurigana de 「新しい」 empieza en 「し」. Es un error frecuente: mucha gente escribe 「新らしい」, pero la única forma correcta es 「新しい」.',
    },
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
    explain: {
      'zh-TW': '「がっこう」＝学校。誘答都是形近字替換：枝（えだ）、字（じ）、交（こう）——字形像但意思完全不同。',
      'zh-CN': '「がっこう」＝学校。干扰项都是形近字替换：枝（えだ）、字（じ）、交（こう），字形相似但意思完全不同。',
      'en': '「がっこう」＝学校. The wrong options swap in look-alike kanji: 枝 (えだ), 字 (じ), 交 (こう). They look similar but mean completely different things.',
      'ko': '「がっこう」＝学校. 오답은 모두 모양이 비슷한 글자로 바꾼 것이에요: 枝(えだ), 字(じ), 交(こう). 모양은 비슷해도 뜻은 전혀 달라요.',
      'es': '「がっこう」＝学校. Las opciones trampa cambian un kanji por otro de forma parecida: 枝（えだ）, 字（じ）, 交（こう）. Se parecen, pero significan cosas totalmente distintas.',
    },
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-writing', topicIds: ['jpv_kanji-writing'] },
  },
  {
    id: 'n5-own-b4-10', subject: '日本語', year: 2026, paper: 'original-batch4', number: 10,
    type: 'single', score: 1,
    stem: 'この 「みせ」は やすいです。「みせ」の かんじは どれですか。',
    options: ['底', '席', '店', '広'],
    answer: '3',
    explain: {
      'zh-TW': '「みせ」＝店。誘答是形近或部首相似的字：広（ひろい）、席（せき）、底（そこ）。',
      'zh-CN': '「みせ」＝店。干扰项是字形或部首相近的字：広（ひろい）、席（せき）、底（そこ）。',
      'en': '「みせ」＝店. The wrong options are kanji with a similar shape or the same radical: 広 (ひろい), 席 (せき), 底 (そこ).',
      'ko': '「みせ」＝店. 오답은 모양이나 부수가 비슷한 글자예요: 広(ひろい), 席(せき), 底(そこ).',
      'es': '「みせ」＝店. Las opciones trampa son kanji de forma o radical parecidos: 広（ひろい）, 席（せき）, 底（そこ）.',
    },
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
    explain: {
      'zh-TW': '「休」是人＋木（人靠在樹旁休息）。「体」是人＋本，意思是身體——兩個字只差一橫，是最常見的形近錯誤。',
      'zh-CN': '「休」是人＋木（人靠在树旁休息）。「体」是人＋本，意思是身体，两个字只差一横，是最常见的形近错误。',
      'en': '「休」 is person + tree (a person resting against a tree). 「体」 is person + 本 and means body. The two kanji differ by just one horizontal stroke, which makes this the most common look-alike mistake.',
      'ko': '「休」는 人＋木(사람이 나무에 기대어 쉬는 모습)이에요. 「体」는 人＋本이고 \'몸\'을 뜻해요. 두 글자는 획 하나 차이라서 가장 흔히 헷갈리는 글자예요.',
      'es': '「休」 es 人＋木 (una persona apoyada en un árbol para descansar). 「体」 es 人＋本 y significa cuerpo. Solo se diferencian en un trazo horizontal, y es la confusión de forma más común.',
    },
    source: { book: 'JLPT N5', chapter: '表記', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_kanji-shape-confusion', topicIds: ['jpv_kanji-shape-confusion'] },
  },
  {
    id: 'n5-own-b4-12', subject: '日本語', year: 2026, paper: 'original-batch4', number: 12,
    type: 'single', score: 1,
    stem: 'わたしは 「おおきい」いぬが すきです。ただしい かんじは どれですか。',
    options: ['太きい', '大きい', '犬きい', '天きい'],
    answer: '2',
    explain: {
      'zh-TW': '「大」多一點是「太」（ふとい＝粗），多一橫是「天」，加一點在右上是「犬」——這四個字全靠一筆之差區分。',
      'zh-CN': '「大」多一点是「太」（ふとい＝粗），多一横是「天」，在右上加一点是「犬」，这四个字全靠一笔之差来区分。',
      'en': '「大」 with an extra dot is 「太」 (ふとい, thick). With an extra horizontal stroke on top, it is 「天」. With a dot at the upper right, it is 「犬」. These four kanji differ by a single stroke.',
      'ko': '「大」에 점 하나를 더하면「太」(ふとい＝굵다), 가로획 하나를 더하면「天」, 오른쪽 위에 점을 찍으면「犬」이에요. 네 글자 모두 한 획 차이로 구별해요.',
      'es': '「大」 con un punto más es 「太」 (ふとい＝grueso), con un trazo horizontal más es 「天」, y con un punto arriba a la derecha es 「犬」. Estos cuatro kanji se distinguen por un solo trazo.',
    },
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
    explain: {
      'zh-TW': '細長物用「本」，但讀音會隨數字變：1本＝いっぽん、3本＝さんぼん、6本＝ろっぽん。3 接濁音「ぼん」。「まい」用於薄平物（紙、襯衫）。',
      'zh-CN': '细长的东西用「本」，但读音会随数字变化：1本＝いっぽん、3本＝さんぼん、6本＝ろっぽん。3 后接浊音「ぼん」。「まい」用于薄而平的东西（纸、衬衫）。',
      'en': 'Long, thin objects use 「本」, but the reading changes with the number: 1本＝いっぽん, 3本＝さんぼん, 6本＝ろっぽん. After 3 it becomes the voiced 「ぼん」. 「まい」 is for thin, flat things (paper, shirts).',
      'ko': '가늘고 긴 물건은「本」으로 세지만, 숫자에 따라 읽기가 바뀌어요: 1本＝いっぽん, 3本＝さんぼん, 6本＝ろっぽん. 3 뒤에서는 탁음「ぼん」이 돼요. 「まい」는 종이나 셔츠 같은 얇고 납작한 물건에 써요.',
      'es': 'Para objetos largos y delgados se usa 「本」, pero la lectura cambia según el número: 1本＝いっぽん, 3本＝さんぼん, 6本＝ろっぽん. Con 3 va la forma sonora 「ぼん」. 「まい」 se usa para cosas planas y delgadas (papel, camisas).',
    },
    source: { book: 'JLPT N5', chapter: '助数詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_counters', topicIds: ['jpv_counters'] },
  },
  {
    id: 'n5-own-b4-14', subject: '日本語', year: 2026, paper: 'original-batch4', number: 14,
    type: 'single', score: 1,
    stem: 'かみを 5（　　）ください。',
    options: ['さつ', 'ひき', 'まい', 'ほん'],
    answer: '3',
    explain: {
      'zh-TW': '紙、切符、シャツ 這類薄平的東西用「枚（まい）」。本＝細長物、冊＝書本、匹＝小動物——助数詞選錯是 N5 高頻失分點。',
      'zh-CN': '纸、车票（切符）、衬衫（シャツ）这类薄而平的东西用「枚（まい）」。本＝细长物、冊＝书本、匹＝小动物，量词选错是 N5 的高频失分点。',
      'en': 'Thin, flat things such as 紙, 切符 and シャツ use 「枚（まい）」. 本 is for long, thin objects, 冊 for books, and 匹 for small animals. Choosing the wrong counter is a common way to lose points at N5.',
      'ko': '紙, 切符, シャツ처럼 얇고 납작한 물건은「枚（まい）」로 세요. 本＝가늘고 긴 물건, 冊＝책, 匹＝작은 동물. 조수사를 잘못 고르는 것은 N5에서 자주 틀리는 부분이에요.',
      'es': 'Para cosas planas y delgadas como el papel, los billetes (切符) o las camisas (シャツ) se usa 「枚（まい）」. 本＝objetos largos y delgados, 冊＝libros, 匹＝animales pequeños. Elegir mal el contador es uno de los errores más frecuentes del N5.',
    },
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
    explain: {
      'zh-TW': '今天的下一天是「あした」（明天）。きのう＝昨天、おととい＝前天、まいにち＝每天（不是特定某一天）。',
      'zh-CN': '今天的下一天是「あした」（明天）。きのう＝昨天、おととい＝前天、まいにち＝每天（不是特定的某一天）。',
      'en': 'The day after today is 「あした」 (tomorrow). きのう＝yesterday, おととい＝the day before yesterday, まいにち＝every day (not one specific day).',
      'ko': '오늘의 다음 날은「あした」(내일)예요. きのう＝어제, おととい＝그저께, まいにち＝매일(특정한 하루가 아님).',
      'es': 'El día después de hoy es 「あした」 (mañana). きのう＝ayer, おととい＝anteayer, まいにち＝todos los días (no es un día concreto).',
    },
    source: { book: 'JLPT N5', chapter: '時間表現', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_time-words', topicIds: ['jpv_time-words'] },
  },
  {
    id: 'n5-own-b4-16', subject: '日本語', year: 2026, paper: 'original-batch4', number: 16,
    type: 'single', score: 1,
    stem: 'あさ おきて、よるは ねます。「ひるま」は いつですか。',
    options: ['あさと よるの あいだ', 'ねる とき', 'あさの まえ', 'よるの あと'],
    answer: '1',
    explain: {
      'zh-TW': '「ひるま（昼間）」是早上到晚上之間的白天時段。朝→昼→夕方→夜 是一天的順序，時間詞要成組記。',
      'zh-CN': '「ひるま（昼間）」是早上到晚上之间的白天时段。朝→昼→夕方→夜 是一天的顺序，时间词要成组记忆。',
      'en': '「ひるま（昼間）」 is the daytime, between morning and night. The order of a day is 朝 → 昼 → 夕方 → 夜, so learn time words as a set.',
      'ko': '「ひるま（昼間）」는 아침부터 밤 사이의 낮 시간대예요. 朝→昼→夕方→夜가 하루의 순서이니, 시간 표현은 묶어서 외우세요.',
      'es': '「ひるま（昼間）」 es el período de día, entre la mañana y la noche. El orden del día es 朝→昼→夕方→夜; aprende las palabras de tiempo en grupo.',
    },
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
    explain: {
      'zh-TW': '寫信要用「えんぴつ（鉛筆）」。ぼうし＝帽子、くつした＝襪子、まど＝窗戶，都與書寫無關。',
      'zh-CN': '写信要用「えんぴつ（铅笔）」。ぼうし＝帽子、くつした＝袜子、まど＝窗户，都与书写无关。',
      'en': 'To write a letter, you use an 「えんぴつ」 (pencil). ぼうし＝hat, くつした＝socks, まど＝window. None of these is for writing.',
      'ko': '편지를 쓸 때는「えんぴつ」(연필)를 써요. ぼうし＝모자, くつした＝양말, まど＝창문으로, 모두 쓰기와 관계없어요.',
      'es': 'Para escribir una carta se usa el 「えんぴつ（鉛筆）」 (lápiz). ぼうし＝sombrero, くつした＝calcetines, まど＝ventana: nada que ver con escribir.',
    },
    source: { book: 'JLPT N5', chapter: '語彙', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_basic-nouns', topicIds: ['jpv_basic-nouns'] },
  },
  {
    id: 'n5-own-b4-18', subject: '日本語', year: 2026, paper: 'original-batch4', number: 18,
    type: 'single', score: 1,
    stem: 'あついので （　　）を あけました。',
    options: ['いす', 'ほん', 'まど', 'とけい'],
    answer: '3',
    explain: {
      'zh-TW': '因為熱所以打開的是「まど（窗戶）」。いす＝椅子、ほん＝書、とけい＝時鐘，都不是能開來通風的東西。',
      'zh-CN': '因为热所以打开的是「まど（窗户）」。いす＝椅子、ほん＝书、とけい＝钟表，都不是能打开来通风的东西。',
      'en': 'It was hot, so the thing that was opened is the 「まど」 (window). いす＝chair, ほん＝book, とけい＝clock. None of these can be opened to let air in.',
      'ko': '더워서 연 것은「まど」(창문)예요. いす＝의자, ほん＝책, とけい＝시계로, 모두 열어서 환기할 수 있는 것이 아니에요.',
      'es': 'Como hace calor, lo que se abre es la 「まど」 (ventana). いす＝silla, ほん＝libro, とけい＝reloj: ninguno se abre para ventilar.',
    },
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
    explain: {
      'zh-TW': '比桌子低的位置是「した（下）」。うえ＝上、なか＝裡面、よこ＝旁邊。位置名詞要成組記：上下・中外・前後・左右。',
      'zh-CN': '比桌子低的位置是「した（下）」。うえ＝上、なか＝里面、よこ＝旁边。位置名词要成组记忆：上下・中外・前后・左右。',
      'en': 'A place lower than the desk is 「した」 (under). うえ＝on top, なか＝inside, よこ＝beside. Learn position nouns in pairs: 上下, 中外, 前後, 左右.',
      'ko': '책상보다 낮은 위치는「した」(아래)예요. うえ＝위, なか＝안, よこ＝옆. 위치 명사는 묶어서 외우세요: 上下・中外・前後・左右.',
      'es': 'La posición más baja que la mesa es 「した」 (debajo). うえ＝encima, なか＝dentro, よこ＝al lado. Aprende los sustantivos de posición en grupos: 上下・中外・前後・左右.',
    },
    source: { book: 'JLPT N5', chapter: '位置名詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_position-nouns', topicIds: ['jpv_position-nouns'] },
  },
  {
    id: 'n5-own-b4-20', subject: '日本語', year: 2026, paper: 'original-batch4', number: 20,
    type: 'single', score: 1,
    stem: 'ゆうびんきょくは ぎんこうと コンビニの （　　）に あります。',
    options: ['まえ', 'となり', 'うしろ', 'あいだ'],
    answer: '4',
    explain: {
      'zh-TW': '夾在兩個地點中間用「〜と〜の あいだ」。となり 是「隔壁」只能對一個對象；まえ／うしろ 是前後不是中間。',
      'zh-CN': '夹在两个地点中间要用「〜と〜の あいだ」。となり 是「隔壁」，只能对应一个对象；まえ／うしろ 是前后，不是中间。',
      'en': 'For something between two places, use 「〜と〜の あいだ」. となり means "next door" and refers to only one thing. まえ and うしろ mean in front and behind, not between.',
      'ko': '두 장소 사이에 끼어 있을 때는「〜と〜の あいだ」를 써요. となり는 \'옆\'이라서 한 대상에만 써요. まえ/うしろ는 앞뒤이지 사이가 아니에요.',
      'es': 'Para algo situado entre dos lugares se usa 「〜と〜の あいだ」. 「となり」 significa «al lado» y solo se refiere a un punto de referencia; まえ／うしろ son delante/detrás, no en medio.',
    },
    source: { book: 'JLPT N5', chapter: '位置名詞', level: 'N5', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpv_position-nouns', topicIds: ['jpv_position-nouns'] },
  },
];
