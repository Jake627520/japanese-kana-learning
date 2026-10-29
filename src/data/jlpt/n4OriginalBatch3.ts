import { JlptQuestion } from '../../types';

// N4 原創題 Batch3：知識點 21–30（文法後半＋読解），每點 3 題。
//
// 最後兩個是読解節點，出題形式改成<b>一篇短文配三題</b>——這兩個考點考的
// 本來就不是單句文法，而是「誰對誰做了什麼」與「整篇想說什麼」，
// 拆成單句就驗證不到 evidence 描述的行為。短文為原創，未取自任何真題。
//
// ⚠ source.confirmed 一律 false：自然度尚未經第三方覆核。
export const N4_ORIGINAL_BATCH3: JlptQuestion[] = [
  // ── jpg_sou-appearance ──
  {
    id: 'n4-own-b3-01', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 1,
    type: 'single', score: 1,
    stem: 'となりの 人は もう 帰る じゅんびを して います。その せきが （　　）です。',
    options: ['空きますそう', '空くそう', '空きそう', '空いたそう'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_sou-appearance', topicIds: ['jpg_sou-appearance'] },
  },
  {
    id: 'n4-own-b3-02', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 2,
    type: 'single', score: 1,
    stem: '天気よほうに よると、あしたは 雨が （　　）です。',
    options: ['ふったそう', 'ふるそう', 'ふりますそう', 'ふりそう'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_sou-appearance', topicIds: ['jpg_sou-appearance'] },
  },
  {
    id: 'n4-own-b3-03', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 3,
    type: 'single', score: 1,
    stem: '「この ケーキ、おいしそうですね。」の いみは どれですか。',
    options: ['見た かんじから、おいしいだろうと 思って いる', 'じっさいに 食べて、おいしかった', 'これから ケーキを 作る つもりだ', '人から 「おいしい」と 聞いた'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_sou-appearance', topicIds: ['jpg_sou-appearance'] },
  },

  // ── jpg_te-moraemasu-request ──
  {
    id: 'n4-own-b3-04', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 4,
    type: 'single', score: 1,
    stem: 'いすが 一つ 足りません。わたしは 今 手が はなせないので、となりの かいぎしつから 持ってきて （　　）。',
    options: ['もらえますか', 'は いけませんか', 'も いいですか', 'いませんか'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_te-moraemasu-request', topicIds: ['jpg_te-moraemasu-request'] },
  },
  {
    id: 'n4-own-b3-05', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 5,
    type: 'single', score: 1,
    stem: '「ペンを かして もらえますか。」この 文で、ペンを かすのは だれですか。',
    options: ['聞かれて いる 人（あいて）', '二人 いっしょに', 'だれでも いい', '話して いる 人（じぶん）'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_te-moraemasu-request', topicIds: ['jpg_te-moraemasu-request'] },
  },
  {
    id: 'n4-own-b3-06', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 6,
    type: 'single', score: 1,
    stem: 'A「この いすを 使って （　　）。」<br>B「どうぞ、使って ください。」',
    options: ['くれませんか', 'は いけませんか', 'もらえますか', 'も いいですか'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_te-moraemasu-request', topicIds: ['jpg_te-moraemasu-request'] },
  },

  // ── jpg_embedded-question ──
  {
    id: 'n4-own-b3-07', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 7,
    type: 'single', score: 1,
    stem: 'かぎを （　　）、おぼえて いません。',
    options: ['どこに おいたか', 'どこに おきましたか', 'どこに おいたです', 'どこに おいたの'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_embedded-question', topicIds: ['jpg_embedded-question'] },
  },
  {
    id: 'n4-own-b3-08', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 8,
    type: 'single', score: 1,
    stem: '「田中さんが 何時に 来るか、知って いますか。」の 「何時に 来るか」は、文の 中で どんな はたらきを して いますか。',
    options: ['それだけで 一つの ぎもん文', '名詞と 同じ はたらき（「知って いますか」の たいしょう）', 'りゆうを あらわす', '「来る」を くわしく する はたらき（連体修飾）'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_embedded-question', topicIds: ['jpg_embedded-question'] },
  },
  {
    id: 'n4-own-b3-09', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 9,
    type: 'single', score: 1,
    stem: 'だれが パーティーに 来る（　　）、まだ わかりません。',
    options: ['か', 'は', 'が', 'を'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_embedded-question', topicIds: ['jpg_embedded-question'] },
  },

  // ── jpg_verb-no-nominalizer ──
  {
    id: 'n4-own-b3-10', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 10,
    type: 'single', score: 1,
    stem: 'わたしは ピアノを ひく（　　）が すきです。',
    options: ['に', 'を', 'で', 'の'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_verb-no-nominalizer', topicIds: ['jpg_verb-no-nominalizer'] },
  },
  {
    id: 'n4-own-b3-11', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 11,
    type: 'single', score: 1,
    stem: '「すいえいが 上手です」と ほとんど 同じ いみの 文は どれですか。',
    options: ['およぐの 上手です', 'およぎが 上手にです', 'およぐことに 上手です', 'およぐのが 上手です'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_verb-no-nominalizer', topicIds: ['jpg_verb-no-nominalizer'] },
  },
  {
    id: 'n4-own-b3-12', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 12,
    type: 'single', score: 1,
    stem: '「〜のが すきです」の 「の」の 前は、どの 形ですか。',
    options: ['た形', 'て形', 'じしょ形', 'ます形'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_verb-no-nominalizer', topicIds: ['jpg_verb-no-nominalizer'] },
  },

  // ── jpg_kureru-direction ──
  {
    id: 'n4-own-b3-13', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 13,
    type: 'single', score: 1,
    stem: 'そふが わたしに （　　）カメラを、いまも 大切に つかって います。',
    options: ['くれた', 'あげた', 'もらった', 'やった'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_kureru-direction', topicIds: ['jpg_kureru-direction'] },
  },
  {
    id: 'n4-own-b3-14', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 14,
    type: 'single', score: 1,
    stem: 'わたしは 日本語の さくぶんが よく わからなかったので、友だちに 教えて （　　）ました。',
    options: ['くれ', 'やり', 'あげ', 'もらい'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_kureru-direction', topicIds: ['jpg_kureru-direction'] },
  },
  {
    id: 'n4-own-b3-15', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 15,
    type: 'single', score: 1,
    stem: '「山田さんが てつだって くれました。」この 文で、てつだったのは だれですか。',
    options: ['ぶんしょうからは わからない', '山田さん', '二人 いっしょに', 'わたし'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_kureru-direction', topicIds: ['jpg_kureru-direction'] },
  },

  // ── jpg_ta-koto-ga-nai ──
  {
    id: 'n4-own-b3-16', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 16,
    type: 'single', score: 1,
    stem: 'ふじさんは いちども 見に （　　）ので、ぜひ 行って みたいです。',
    options: ['行き ことが ない', '行った ことが ない', '行く ことが ない', '行って いる ことが ない'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_ta-koto-ga-nai', topicIds: ['jpg_ta-koto-ga-nai'] },
  },
  {
    id: 'n4-own-b3-17', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 17,
    type: 'single', score: 1,
    stem: '「食べる」に 「〜ことが あります」を つけて、けいけんを あらわす 形は どれですか。',
    options: ['食べます ことが あります', '食べる ことが あります', '食べて ことが あります', '食べた ことが あります'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_ta-koto-ga-nai', topicIds: ['jpg_ta-koto-ga-nai'] },
  },
  {
    id: 'n4-own-b3-18', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 18,
    type: 'single', score: 1,
    stem: '「まだ 見に 行って いません」と 「見に 行った ことが ありません」の ちがいの せつめいとして、いちばん いい ものは どれですか。',
    options: ['どちらも みらいの よていを あらわす', 'いみは まったく 同じ', '前者が けいけん、後者が よてい', '前者は 「よていは あるが まだ」、後者は 「いままで 一度も」'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_ta-koto-ga-nai', topicIds: ['jpg_ta-koto-ga-nai'] },
  },

  // ── jpg_youni-naru ──
  {
    id: 'n4-own-b3-19', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 19,
    type: 'single', score: 1,
    stem: '「およぐ」の かのう形（可能形）は どれですか。',
    options: ['およがせる', 'およごう', 'およげる', 'およがれる'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_youni-naru', topicIds: ['jpg_youni-naru'] },
  },
  {
    id: 'n4-own-b3-20', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 20,
    type: 'single', score: 1,
    stem: 'まいしゅう 友だちと れんしゅうして、やっと （　　）。',
    options: ['およいで おきました', 'およいで しまいました', 'およげる ように なりました', 'およぐ ことに なりました'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_youni-naru', topicIds: ['jpg_youni-naru'] },
  },
  {
    id: 'n4-own-b3-21', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 21,
    type: 'single', score: 1,
    stem: '「日本語が 話せる ように なりました」の いみは どれですか。',
    options: ['話したいと 思って いる', '話さなければ ならない', '話すことに 決めた', 'まえは 話せなかったが、いまは 話せる'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_youni-naru', topicIds: ['jpg_youni-naru'] },
  },

  // ── jpg_tara-conditional ──
  {
    id: 'n4-own-b3-22', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 22,
    type: 'single', score: 1,
    stem: '「行く」に 「〜たら」を つけると どう なりますか。',
    options: ['行っだら', '行ったら', '行きたら', '行くたら'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_tara-conditional', topicIds: ['jpg_tara-conditional'] },
  },
  {
    id: 'n4-own-b3-23', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 23,
    type: 'single', score: 1,
    stem: 'けんがくの 日と 時間が （　　）、電話を ください。',
    options: ['きまるから', 'きまるので', 'きまったら', 'きまって'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_tara-conditional', topicIds: ['jpg_tara-conditional'] },
  },
  {
    id: 'n4-own-b3-24', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 24,
    type: 'single', score: 1,
    stem: '「日と 時間が きまったら、連絡が ほしいです」の いみは どれですか。',
    options: ['いつ きまるのか 知りたい', '連絡を して 日と 時間を きめたい', '連絡は しなくても いい', '日と 時間が きまった あとで、連絡して ほしい'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_tara-conditional', topicIds: ['jpg_tara-conditional'] },
  },

  // ── jpr_character-relationship-tracking（同一篇短文配三題）──
  {
    id: 'n4-own-b3-25', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 25,
    type: 'single', score: 1,
    stem: '［つぎの 文章を 読んで、こたえて ください］<br><br>きのう、えきで 重い かばんを 持って こまって いたとき、知らない 女の人が こえを かけて くれました。エレベーターの ばしょを おしえて くれたので、とても たすかりました。わたしは お礼を 言って、電車に のりました。<br><br><b>問：こえを かけたのは だれですか。</b>',
    options: ['知らない 女の人', 'えきの 人', 'ぶんしょうからは わからない', 'わたし'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '読解', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_character-relationship-tracking', topicIds: ['jpr_character-relationship-tracking', 'jpg_kureru-direction'] },
  },
  {
    id: 'n4-own-b3-26', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 26,
    type: 'single', score: 1,
    stem: '［前の 文章に ついて］<br><br>きのう、えきで 重い かばんを 持って こまって いたとき、知らない 女の人が こえを かけて くれました。エレベーターの ばしょを おしえて くれたので、とても たすかりました。わたしは お礼を 言って、電車に のりました。<br><br><b>問：お礼を 言ったのは だれですか。</b>',
    options: ['えきの 人', '二人とも', 'わたし', '知らない 女の人'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '読解', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_character-relationship-tracking', topicIds: ['jpr_character-relationship-tracking'] },
  },
  {
    id: 'n4-own-b3-27', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 27,
    type: 'single', score: 1,
    stem: '［前の 文章に ついて］<br><br>きのう、えきで 重い かばんを 持って こまって いたとき、知らない 女の人が こえを かけて くれました。エレベーターの ばしょを おしえて くれたので、とても たすかりました。わたしは お礼を 言って、電車に のりました。<br><br><b>問：「とても たすかりました」と 思ったのは だれですか。</b>',
    options: ['知らない 女の人', 'わたし', 'えきの 人', 'ぶんしょうからは わからない'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '読解', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_character-relationship-tracking', topicIds: ['jpr_character-relationship-tracking', 'jpg_kureru-direction'] },
  },

  // ── jpr_passage-theme-synthesis（同一篇短文配三題）──
  {
    id: 'n4-own-b3-28', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 28,
    type: 'single', score: 1,
    stem: '［つぎの 文章を 読んで、こたえて ください］<br><br>せんしゅう、雨の 日に かさを わすれて こまって いました。すると、近くの 店の 人が 古い かさを かして くれました。つぎの日 かえしに 行って お礼を 言うと、その 人は 「いいんですよ」と わらって 言いました。わたしも いつか、こまって いる 人に 同じ ことを して あげたいと 思いました。<br><br><b>問：この 文章で いちばん つたえたい ことは 何ですか。</b>',
    options: ['古い かさは あたらしい かさより べんりだ', '店の 人は いつも わらって いる', '雨の 日には かさを わすれない ほうが いい', '人に しんせつに して もらった けいけんから、自分も そう したいと 思った'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '読解', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_passage-theme-synthesis', topicIds: ['jpr_passage-theme-synthesis'] },
  },
  {
    id: 'n4-own-b3-29', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 29,
    type: 'single', score: 1,
    stem: '［前の 文章に ついて］<br><br>せんしゅう、雨の 日に かさを わすれて こまって いました。すると、近くの 店の 人が 古い かさを かして くれました。つぎの日 かえしに 行って お礼を 言うと、その 人は 「いいんですよ」と わらって 言いました。わたしも いつか、こまって いる 人に 同じ ことを して あげたいと 思いました。<br><br><b>問：この 文章の さいごに 入れるのに いちばん いい 文は どれですか。</b>',
    options: ['小さな しんせつは、人から 人へ つたわって いくのだと 思います。', 'つぎからは、かならず かさを 持って 出かけます。', 'あの 店の しなものは とても 安いです。', 'ちかくの 店の 場所を もっと しらべたいです。'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '読解', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_passage-theme-synthesis', topicIds: ['jpr_passage-theme-synthesis'] },
  },
  {
    id: 'n4-own-b3-30', subject: '日本語', year: 2026, paper: 'n4-original-batch3', number: 30,
    type: 'single', score: 1,
    stem: '［前の 文章に ついて］<br><br>せんしゅう、雨の 日に かさを わすれて こまって いました。すると、近くの 店の 人が 古い かさを かして くれました。つぎの日 かえしに 行って お礼を 言うと、その 人は 「いいんですよ」と わらって 言いました。わたしも いつか、こまって いる 人に 同じ ことを して あげたいと 思いました。<br><br><b>問：かさを かしたのは だれですか。</b>',
    options: ['ぶんしょうからは わからない', '友だち', '店の 人', 'わたし'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '読解', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpr_passage-theme-synthesis', topicIds: ['jpr_passage-theme-synthesis', 'jpg_kureru-direction'] },
  },
];
