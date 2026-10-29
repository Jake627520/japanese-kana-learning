import { JlptQuestion } from '../../types';

// N3 原創題 Batch1：知識點 1–10（推量、複合動詞、句型基準、因果），每點 3 題。
//
// N3 比 N4 難的地方在於「四個選項文法上都成立，只有一個語感對」。所以這一批的
// 誘答刻意大量使用<b>形近或義近的句型</b>：わけがない／わけではない 差一個字、
// おかげで／せいで 方向相反、ために 同形卻有目的與原因兩種意思。
// 答錯時看選項就知道自己是哪一種誤解。
//
// ⚠ source.confirmed 一律 false：這批由模型原創，自然度尚未經第三方覆核。
export const N3_ORIGINAL_BATCH1: JlptQuestion[] = [
  // ── jpg_n3-wake-ga-nai ──
  {
    id: 'n3-own-b1-01', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 1,
    type: 'single', score: 1,
    stem: 'あんなに 正直な 彼が、うそを つく（　　）。',
    options: ['ことになる', 'わけがない', 'わけだ', 'ものだ'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '推量與否定', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-wake-ga-nai', topicIds: ['jpg_n3-wake-ga-nai'] },
  },
  {
    id: 'n3-own-b1-02', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 2,
    type: 'single', score: 1,
    stem: '「静かだ」に 「わけがない」を つけると どう なりますか。',
    options: ['静かだわけがない', '静かわけがない', '静かのわけがない', '静かなわけがない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '推量與否定', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-wake-ga-nai', topicIds: ['jpg_n3-wake-ga-nai'] },
  },
  {
    id: 'n3-own-b1-03', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 3,
    type: 'single', score: 1,
    stem: '日本語が 話せない（　　）が、人の 前では まだ 自信が ない。',
    options: ['わけがない', 'わけだ', 'わけにはいかない', 'わけではない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '推量與否定', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-wake-ga-nai', topicIds: ['jpg_n3-wake-ga-nai'] },
  },

  // ── jpg_n3-ni-chigainai ──
  {
    id: 'n3-own-b1-04', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 4,
    type: 'single', score: 1,
    stem: 'へやの 電気が 消えて いる。もう 寝た（　　）。',
    options: ['わけではない', 'ことにする', 'ものだ', 'に違いない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '推量與確定', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-chigainai', topicIds: ['jpg_n3-ni-chigainai'] },
  },
  {
    id: 'n3-own-b1-05', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 5,
    type: 'single', score: 1,
    stem: 'この 字の きれいさから 見て、あの 人は 先生（　　）。',
    options: ['なに違いない', 'のに違いない', 'に違いない', 'だに違いない'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '推量與確定', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-chigainai', topicIds: ['jpg_n3-ni-chigainai'] },
  },
  {
    id: 'n3-own-b1-06', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 6,
    type: 'single', score: 1,
    stem: '「かもしれない」「だろう」「に違いない」を、確信の 強い 順に ならべると？',
    options: ['だろう → に違いない → かもしれない', '三つとも 同じ ぐらい', 'かもしれない → だろう → に違いない', 'に違いない → だろう → かもしれない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '推量與確定', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-chigainai', topicIds: ['jpg_n3-ni-chigainai'] },
  },

  // ── jpg_n3-kiru ──
  {
    id: 'n3-own-b1-07', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 7,
    type: 'single', score: 1,
    stem: 'とても つらかったが、42キロを 走り （　　）ました。',
    options: ['始め', 'かけ', '出し', '切り'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '複合動詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-kiru', topicIds: ['jpg_n3-kiru'] },
  },
  {
    id: 'n3-own-b1-08', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 8,
    type: 'single', score: 1,
    stem: '「使う」に 「〜切る」を つけると どう なりますか。',
    options: ['使い切る', '使う切る', '使った切る', '使って切る'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '複合動詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-kiru', topicIds: ['jpg_n3-kiru'] },
  },
  {
    id: 'n3-own-b1-09', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 9,
    type: 'single', score: 1,
    stem: '「お金を 使い切った」の いみは どれですか。',
    options: ['つかい方を まちがえた', 'つかうのを とちゅうで やめた', 'ぜんぶ つかって、のこって いない', 'すこしだけ つかった'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '複合動詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-kiru', topicIds: ['jpg_n3-kiru'] },
  },

  // ── jpg_n3-naosu ──
  {
    id: 'n3-own-b1-10', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 10,
    type: 'single', score: 1,
    stem: 'まちがいが 多かったので、レポートを 書き（　　）ました。',
    options: ['始め', '切り', '終わり', '直し'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '複合動詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-naosu', topicIds: ['jpg_n3-naosu'] },
  },
  {
    id: 'n3-own-b1-11', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 11,
    type: 'single', score: 1,
    stem: 'オーダースーツの サイズを まちがえて つたえて しまったので、（　　）て もらいました。',
    options: ['作り直し', '作り続け', '作り始め', '作り切り'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '複合動詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-naosu', topicIds: ['jpg_n3-naosu'] },
  },
  {
    id: 'n3-own-b1-12', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 12,
    type: 'single', score: 1,
    stem: '「読み直す」と 「読み終わる」の ちがいとして 正しい ものは どれですか。',
    options: ['どちらも 同じ いみ', '読み直す＝もう一度 読む、読み終わる＝読むのが 終わる', 'どちらも 「読み始める」の いみ', '読み直す＝読むのを やめる、読み終わる＝もう一度 読む'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '複合動詞', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-naosu', topicIds: ['jpg_n3-naosu', 'jpg_n3-kiru'] },
  },

  // ── jpg_n3-osore-ga-aru ──
  {
    id: 'n3-own-b1-13', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 13,
    type: 'single', score: 1,
    stem: '今夜から あすの 朝に かけて、大雨に より 川の 水が あふれる （　　）あります。',
    options: ['ことが', '恐れが', 'ものが', 'わけが'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '警告與推量', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-osore-ga-aru', topicIds: ['jpg_n3-osore-ga-aru'] },
  },
  {
    id: 'n3-own-b1-14', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 14,
    type: 'single', score: 1,
    stem: '「恐れがある」の つかい方が 正しくない ものは どれですか。',
    options: ['あしたは すばらしい 天気に なる 恐れが あります。', '台風が 上陸する 恐れが あります。', '地震で 建物が たおれる 恐れが あります。', 'この 薬は 副作用の 恐れが あります。'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '警告與推量', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-osore-ga-aru', topicIds: ['jpg_n3-osore-ga-aru'] },
  },
  {
    id: 'n3-own-b1-15', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 15,
    type: 'single', score: 1,
    stem: 'この 工事に は、事故（　　）恐れが あります。',
    options: ['の', 'を', 'が', 'に'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '警告與推量', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-osore-ga-aru', topicIds: ['jpg_n3-osore-ga-aru'] },
  },

  // ── jpg_n3-ni-sotte ──
  {
    id: 'n3-own-b1-16', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 16,
    type: 'single', score: 1,
    stem: 'この 道（　　）まっすぐ 行くと、右に 駅が 見えます。',
    options: ['について', 'に関して', 'に対して', 'に沿って'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '句型與基準', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-sotte', topicIds: ['jpg_n3-ni-sotte'] },
  },
  {
    id: 'n3-own-b1-17', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 17,
    type: 'single', score: 1,
    stem: 'こちらの 計画（　　）、じゅんびを 進めて ください。',
    options: ['に比べて', 'にとって', 'に沿って', 'によって'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '句型與基準', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-sotte', topicIds: ['jpg_n3-ni-sotte'] },
  },
  {
    id: 'n3-own-b1-18', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 18,
    type: 'single', score: 1,
    stem: '海岸（　　）、ホテルが ならんで います。',
    options: ['によると', 'に対する', 'に沿って', 'に関する'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '句型與基準', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-sotte', topicIds: ['jpg_n3-ni-sotte'] },
  },

  // ── jpg_n3-ni-kanshite ──
  {
    id: 'n3-own-b1-19', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 19,
    type: 'single', score: 1,
    stem: 'これは 環境問題に （　　）本です。',
    options: ['関して', '関され', '関し', '関する'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '話題與主題', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-kanshite', topicIds: ['jpg_n3-ni-kanshite'] },
  },
  {
    id: 'n3-own-b1-20', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 20,
    type: 'single', score: 1,
    stem: 'その 件（　　）は、後ほど ご説明いたします。',
    options: ['に関する', 'に沿って', 'にわたって', 'に関して'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '話題與主題', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-kanshite', topicIds: ['jpg_n3-ni-kanshite'] },
  },
  {
    id: 'n3-own-b1-21', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 21,
    type: 'single', score: 1,
    stem: '「に関して」と 「について」の ちがいとして いちばん いい せつめいは どれですか。',
    options: ['いみは ほぼ 同じだが、に関して の ほうが あらたまった 場面で つかう', '二つは まったく ちがう いみ', 'に関して は 場所、について は 時間に つかう', 'に関して は 否定文、について は 肯定文に つかう'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '話題與主題', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-kanshite', topicIds: ['jpg_n3-ni-kanshite'] },
  },

  // ── jpg_n3-to-tomonin ──
  {
    id: 'n3-own-b1-22', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 22,
    type: 'single', score: 1,
    stem: '時代が 変わる（　　）、人々の 考え方も 変わって いく。',
    options: ['かわりに', 'とともに', 'おかげで', 'せいで'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '時間與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-to-tomonin', topicIds: ['jpg_n3-to-tomonin'] },
  },
  {
    id: 'n3-own-b1-23', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 23,
    type: 'single', score: 1,
    stem: '「家族と ともに 新しい 町へ ひっこした」の 「とともに」の いみは どれですか。',
    options: ['家族と いっしょに', '家族の ために', '家族に くらべて', '家族の かわりに'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '時間與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-to-tomonin', topicIds: ['jpg_n3-to-tomonin'] },
  },
  {
    id: 'n3-own-b1-24', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 24,
    type: 'single', score: 1,
    stem: '年を とる（　　）、目が 悪く なって きた。',
    options: ['ばかりに', 'とともに', 'わけで', 'ものだから'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '時間與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-to-tomonin', topicIds: ['jpg_n3-to-tomonin', 'jpg_n3-nitsurete'] },
  },

  // ── jpg_n3-tame-ni（原因）──
  {
    id: 'n3-own-b1-25', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 25,
    type: 'single', score: 1,
    stem: '事故の（　　）、電車が 一時間 止まりました。',
    options: ['ために', 'ばかりに', 'とおりに', 'ように'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tame-ni', topicIds: ['jpg_n3-tame-ni'] },
  },
  {
    id: 'n3-own-b1-26', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 26,
    type: 'single', score: 1,
    stem: '「病気の ために 会社を 休んだ」の 「ために」は 何を あらわして いますか。',
    options: ['手段', '目的', '条件', '原因'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tame-ni', topicIds: ['jpg_n3-tame-ni', 'jpg_n3-tame-ni-purpose'] },
  },
  {
    id: 'n3-own-b1-27', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 27,
    type: 'single', score: 1,
    stem: '「ために」が 原因を あらわす とき、後ろの 文は どんな 文に なりますか。',
    options: ['かならず 疑問文', '多くは 意志の ない できごと（〜が 止まった・〜が 遅れた など）', 'かならず 話す人が 自分で 決めた 行動', 'かならず 命令文'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-tame-ni', topicIds: ['jpg_n3-tame-ni'] },
  },

  // ── jpg_n3-okage-de ──
  {
    id: 'n3-own-b1-28', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 28,
    type: 'single', score: 1,
    stem: '先生の（　　）、しけんに 合格 できました。',
    options: ['せいで', 'ために', 'おかげで', 'くせに'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-okage-de', topicIds: ['jpg_n3-okage-de', 'jpg_n3-sei-de'] },
  },
  {
    id: 'n3-own-b1-29', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 29,
    type: 'single', score: 1,
    stem: 'みんなが 手伝って くれた（　　）、思ったより 早く 終わりました。',
    options: ['おかげに', 'おかげで', 'おかげだ', 'おかげの'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-okage-de', topicIds: ['jpg_n3-okage-de'] },
  },
  {
    id: 'n3-own-b1-30', subject: '日本語', year: 2026, paper: 'n3-original-batch1', number: 30,
    type: 'single', score: 1,
    stem: '「おかげで」の つかい方が 正しくない ものは どれですか。',
    options: ['道が こんで いた おかげで、会議に 遅れて しまった。', '薬を 飲んだ おかげで、熱が 下がった。', '友だちの おかげで、いい 仕事が 見つかった。', '天気が よかった おかげで、写真が きれいに とれた。'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-okage-de', topicIds: ['jpg_n3-okage-de', 'jpg_n3-sei-de'] },
  },
];
