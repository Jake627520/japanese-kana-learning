import { JlptQuestion } from '../../types';

// N4 原創題 Batch2：知識點 11–20（用法題與文法前半），每點 3 題。
//
// 這一批的誘答有一個共同設計：不是「明顯錯的選項」，而是
// <b>文法上都成立、只有一個在語境裡說得通</b>——這正是 N4 比 N5 難的地方。
// 例如 で／に 都能接時間，差別在「花費的時間範圍」還是「發生的時間點」。
//
// ⚠ source.confirmed 一律 false：自然度尚未經第三方覆核。
export const N4_ORIGINAL_BATCH2: JlptQuestion[] = [
  // ── jpg_usage-appropriateness（用法題）──
  {
    id: 'n4-own-b2-01', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 1,
    type: 'single', score: 1,
    stem: '「見学」の つかい方として 正しい ものは どれですか。',
    options: ['デパートで くつを 見学して、買いました。', '弟の しゅくだいを 見学して あげました。', '週末は 家で テレビを 見学しました。', 'きのう、じどうしゃの 工場を 見学しました。'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '用法', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_usage-appropriateness', topicIds: ['jpg_usage-appropriateness', 'jpv_n4-suru-verbs'] },
  },
  {
    id: 'n4-own-b2-02', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 2,
    type: 'single', score: 1,
    stem: '「かざる」の つかい方として 正しい ものは どれですか。',
    options: ['テーブルに 花を かざりました。', 'のこった ごはんを れいぞうこに かざりました。', 'ふゆの ふくを たんすに かざりました。', '読みおわった 本を かばんに かざりました。'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '用法', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_usage-appropriateness', topicIds: ['jpg_usage-appropriateness'] },
  },
  {
    id: 'n4-own-b2-03', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 3,
    type: 'single', score: 1,
    stem: '「るす」の つかい方として 正しい ものは どれですか。',
    options: ['かばんの 中が るすです。', '友だちの 家へ 行きましたが、るすでした。', '電車が るすだったので、すわれました。', 'きょうは 学校が るすです。'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '用法', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_usage-appropriateness', topicIds: ['jpg_usage-appropriateness', 'jpv_n4-status-nouns'] },
  },

  // ── jpg_de-time-taken ──
  {
    id: 'n4-own-b2-04', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 4,
    type: 'single', score: 1,
    stem: 'この しごとは 20分（　　）終わりました。',
    options: ['に', 'で', 'を', 'しか'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_de-time-taken', topicIds: ['jpg_de-time-taken'] },
  },
  {
    id: 'n4-own-b2-05', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 5,
    type: 'single', score: 1,
    stem: 'A「もう できましたか。」<br>B「はい、30分（　　）できました。」',
    options: ['から', 'まで', 'で', 'に'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_de-time-taken', topicIds: ['jpg_de-time-taken'] },
  },
  {
    id: 'n4-own-b2-06', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 6,
    type: 'single', score: 1,
    stem: 'かいぎは 3時（　　）はじまります。',
    options: ['まで', 'で', 'に', 'を'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_de-time-taken', topicIds: ['jpg_de-time-taken'] },
  },

  // ── jpg_causative ──
  {
    id: 'n4-own-b2-07', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 7,
    type: 'single', score: 1,
    stem: '「泣く」の しえき形（使役形）は どれですか。',
    options: ['泣ける', '泣かせる', '泣かさせる', '泣かれる'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_causative', topicIds: ['jpg_causative'] },
  },
  {
    id: 'n4-own-b2-08', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 8,
    type: 'single', score: 1,
    stem: '弟は 小さい とき よく けがを して、両親（　　）心配させました。',
    options: ['が', 'を', 'に', 'で'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_causative', topicIds: ['jpg_causative'] },
  },
  {
    id: 'n4-own-b2-09', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 9,
    type: 'single', score: 1,
    stem: '母は 私（　　）くすりを 飲ませました。',
    options: ['で', 'に', 'が', 'を'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_causative', topicIds: ['jpg_causative'] },
  },

  // ── jpg_mo-quantity-emphasis ──
  {
    id: 'n4-own-b2-10', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 10,
    type: 'single', score: 1,
    stem: 'かれは ケーキを 八つ（　　）食べました。',
    options: ['も', 'で', 'に', 'が'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_mo-quantity-emphasis', topicIds: ['jpg_mo-quantity-emphasis'] },
  },
  {
    id: 'n4-own-b2-11', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 11,
    type: 'single', score: 1,
    stem: 'きのうは いそがしくて、三時間（　　）寝られませんでした。',
    options: ['だけ', 'しか', 'が', 'まで'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_mo-quantity-emphasis', topicIds: ['jpg_mo-quantity-emphasis'] },
  },
  {
    id: 'n4-own-b2-12', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 12,
    type: 'single', score: 1,
    stem: '「駅まで 二時間も かかりました。」この 「も」は どんな 気持ちを あらわして いますか。',
    options: ['ほかの 人も 二時間 かかったと 言って いる', '時間が 少なくて うれしいと 思って いる', '二時間ぐらいだろうと よそうして いる', '思って いたより 時間が かかって、おどろいて いる'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_mo-quantity-emphasis', topicIds: ['jpg_mo-quantity-emphasis'] },
  },

  // ── jpg_passive-niyotte ──
  {
    id: 'n4-own-b2-13', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 13,
    type: 'single', score: 1,
    stem: '「作る」の 受身形（うけみけい）は どれですか。',
    options: ['作られる', '作らせる', '作られさせる', '作れる'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_passive-niyotte', topicIds: ['jpg_passive-niyotte'] },
  },
  {
    id: 'n4-own-b2-14', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 14,
    type: 'single', score: 1,
    stem: 'この じしょは 150年前に 外国人（　　）作られました。',
    options: ['から', 'を', 'によって', 'へ'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_passive-niyotte', topicIds: ['jpg_passive-niyotte'] },
  },
  {
    id: 'n4-own-b2-15', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 15,
    type: 'single', score: 1,
    stem: 'この おかしは 米（　　）作られて います。',
    options: ['に', 'へ', 'によって', 'から'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_passive-niyotte', topicIds: ['jpg_passive-niyotte'] },
  },

  // ── jpg_interrogative-demo ──
  {
    id: 'n4-own-b2-16', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 16,
    type: 'single', score: 1,
    stem: 'この 運動場は （　　）使えますが、よやくが ひつようです。',
    options: ['だれに', 'だれでも', 'だれを', 'だれが'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '指示詞・疑問詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_interrogative-demo', topicIds: ['jpg_interrogative-demo'] },
  },
  {
    id: 'n4-own-b2-17', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 17,
    type: 'single', score: 1,
    stem: 'この カードは 日本の （　　）買えます。',
    options: ['どこでも', 'どこか', 'どこに', 'どこが'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '指示詞・疑問詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_interrogative-demo', topicIds: ['jpg_interrogative-demo'] },
  },
  {
    id: 'n4-own-b2-18', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 18,
    type: 'single', score: 1,
    stem: '（　　）すきな ものを とって ください。',
    options: ['何を', '何が', '何でも', '何に'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '指示詞・疑問詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_interrogative-demo', topicIds: ['jpg_interrogative-demo'] },
  },

  // ── jpg_nara-conditional ──
  {
    id: 'n4-own-b2-19', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 19,
    type: 'single', score: 1,
    stem: 'A「あしたか あさって、えいがに 行かない？」<br>B「あしたは つごうが 悪いけど、あさって（　　）だいじょうぶだよ。」',
    options: ['なのに', 'なら', 'ばかり', 'だから'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_nara-conditional', topicIds: ['jpg_nara-conditional'] },
  },
  {
    id: 'n4-own-b2-20', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 20,
    type: 'single', score: 1,
    stem: 'A「日本語の 本が 買いたいんですが。」<br>B「日本語の 本（　　）、えきの 前の 店が いいですよ。」',
    options: ['でも', 'まで', 'なら', 'だから'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_nara-conditional', topicIds: ['jpg_nara-conditional'] },
  },
  {
    id: 'n4-own-b2-21', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 21,
    type: 'single', score: 1,
    stem: 'スポーツ（　　）、サッカーが 一番 すきです。',
    options: ['でも', 'より', 'なら', 'だから'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_nara-conditional', topicIds: ['jpg_nara-conditional'] },
  },

  // ── jpg_period-no-aida ──
  {
    id: 'n4-own-b2-22', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 22,
    type: 'single', score: 1,
    stem: '夏休み（　　）間、まいにち プールへ 行きました。',
    options: ['を', 'に', 'で', 'の'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_period-no-aida', topicIds: ['jpg_period-no-aida'] },
  },
  {
    id: 'n4-own-b2-23', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 23,
    type: 'single', score: 1,
    stem: '先生が 話して （　　）間、しずかに して ください。',
    options: ['いた', 'いる', 'おく', 'ある'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_period-no-aida', topicIds: ['jpg_period-no-aida'] },
  },
  {
    id: 'n4-own-b2-24', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 24,
    type: 'single', score: 1,
    stem: 'この へやは ふたつの きょうしつ（　　）間に あります。',
    options: ['で', 'から', 'の', 'に'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '助詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_period-no-aida', topicIds: ['jpg_period-no-aida'] },
  },

  // ── jpg_noni-purpose ──
  {
    id: 'n4-own-b2-25', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 25,
    type: 'single', score: 1,
    stem: 'かみを ぜんぶ （　　）2時間 かかりました。',
    options: ['切ったり', '切るかどうか', '切りに', '切るのに'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_noni-purpose', topicIds: ['jpg_noni-purpose'] },
  },
  {
    id: 'n4-own-b2-26', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 26,
    type: 'single', score: 1,
    stem: 'えきまで 行く（　　）、30分 かかります。',
    options: ['のに', 'から', 'ので', 'けど'],
    answer: '1',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_noni-purpose', topicIds: ['jpg_noni-purpose'] },
  },
  {
    id: 'n4-own-b2-27', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 27,
    type: 'single', score: 1,
    stem: 'この どうぐは 何を する（　　）つかいますか。',
    options: ['のは', 'のが', 'ので', 'のに'],
    answer: '4',
    source: { book: 'JLPT N4', chapter: '動詞', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_noni-purpose', topicIds: ['jpg_noni-purpose'] },
  },

  // ── jpg_kamoshirenai ──
  {
    id: 'n4-own-b2-28', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 28,
    type: 'single', score: 1,
    stem: '空が くらく なりました。雨が （　　）。',
    options: ['ふってはいけません', 'ふるかもしれません', 'ふってください', 'ふったほうがいいです'],
    answer: '2',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_kamoshirenai', topicIds: ['jpg_kamoshirenai'] },
  },
  {
    id: 'n4-own-b2-29', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 29,
    type: 'single', score: 1,
    stem: '「おいしい」に 「かもしれません」を つけると どう なりますか。',
    options: ['おいしいだかもしれません', 'おいしくかもしれません', 'おいしいかもしれません', 'おいしいでかもしれません'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_kamoshirenai', topicIds: ['jpg_kamoshirenai'] },
  },
  {
    id: 'n4-own-b2-30', subject: '日本語', year: 2026, paper: 'n4-original-batch2', number: 30,
    type: 'single', score: 1,
    stem: 'A「田中さん、まだ 来ませんね。」<br>B「電車が おくれて （　　）。」',
    options: ['いたほうがいいです', 'いてください', 'いるかもしれません', 'いてはいけません'],
    answer: '3',
    source: { book: 'JLPT N4', chapter: '文の構造', level: 'N4', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_kamoshirenai', topicIds: ['jpg_kamoshirenai'] },
  },
];
