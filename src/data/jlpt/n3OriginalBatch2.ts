import { JlptQuestion } from '../../types';

// N3 原創題 Batch2：知識點 11–20（因果的另一面、替代、傳聞、比例變化與句尾），每點 3 題。
//
// 這一批集中在<b>成對出現、只差語感</b>的句型：おかげで／せいで 方向相反、
// ものだ／ことだ 一個是感慨一個是建議、最中に／あいだに 一個帶被打斷的不巧感。
// 誘答一律取自這些真實的混淆來源。
//
// source.confirmed：全批 true。實際做過的驗證有三層——
//   1. 三輪 fresh-context 覆核：修掉 13 題雙重正解與數十處解說的錯誤規則。
//   2. 四語翻譯時逐題對照（zh-CN／en／ko／es）：譯者回報、再逐題核實後列入
//      .audit/jlpt-source-errors.md，共 10 筆，全部已修。跨語翻譯是有效的
//      交叉檢查——譯不出來的地方，多半是原文自己有問題。
//   3. en／ko／es 的母語者審閱（見 .audit/review-ko.md、review-es.md）。
// 沒做過的：日語母語教師的正式簽核。解說裡的文法規則若與教材衝突，以教材為準。
export const N3_ORIGINAL_BATCH2: JlptQuestion[] = [
  // ── jpg_n3-sei-de ──
  {
    id: 'n3-own-b2-01', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 1,
    type: 'single', score: 1,
    stem: '寝不足の（　　）、朝から 頭が 痛い。',
    options: ['おかげで', 'せいで', 'とおりに', 'ように'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-sei-de', topicIds: ['jpg_n3-sei-de', 'jpg_n3-okage-de'] },
  },
  {
    id: 'n3-own-b2-02', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 2,
    type: 'single', score: 1,
    stem: '雨（　　）せいで、試合が 中止に なりました。',
    options: ['が', 'に', 'を', 'の'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-sei-de', topicIds: ['jpg_n3-sei-de'] },
  },
  {
    id: 'n3-own-b2-03', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 3,
    type: 'single', score: 1,
    stem: '「せいで」の つかい方として 正しい ものは どれですか。',
    options: ['大きな 音の せいで、ぜんぜん ねむれなかった。', '先生が 教えて くれた せいで、テストが よく できました。', '早く 寝た せいで、今朝は とても 元気です。', 'あしたは 雨が 降る せいで、かさを 持って 行きます。'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '因果關係', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-sei-de', topicIds: ['jpg_n3-sei-de', 'jpg_n3-okage-de'] },
  },

  // ── jpg_n3-kawarini ──
  {
    id: 'n3-own-b2-04', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 4,
    type: 'single', score: 1,
    stem: '店長が 病気なので、今日は 私が 店長（　　）会議に 出ます。',
    options: ['の代わりに', 'が代わりに', 'を代わりに', 'に代わりに'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '替代與對換', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-kawarini', topicIds: ['jpg_n3-kawarini'] },
  },
  {
    id: 'n3-own-b2-05', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 5,
    type: 'single', score: 1,
    stem: '私が 日本語を 教える（　　）、彼に 英語を 教えて もらって います。',
    options: ['おかげで', '代わりに', 'ために', 'ながら'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '替代與對換', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-kawarini', topicIds: ['jpg_n3-kawarini'] },
  },
  {
    id: 'n3-own-b2-06', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 6,
    type: 'single', score: 1,
    stem: '「代わりに」の 二つの つかい方は どれと どれですか。',
    options: ['原因を あらわす ／ 結果を あらわす', 'だれかの 代理を する ／ 交換の 条件を あらわす', '肯定を あらわす ／ 否定を あらわす', '時間を あらわす ／ 場所を あらわす'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '替代與對換', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-kawarini', topicIds: ['jpg_n3-kawarini'] },
  },

  // ── jpg_n3-to-iu-koto-da ──
  {
    id: 'n3-own-b2-07', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 7,
    type: 'single', score: 1,
    stem: '（メールで）田中さんは 来月 帰国する（　　）。',
    options: ['に違いありません', 'わけがありません', 'ことにします', 'とのことです'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '傳聞與引用', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-to-iu-koto-da', topicIds: ['jpg_n3-to-iu-koto-da'] },
  },
  {
    id: 'n3-own-b2-08', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 8,
    type: 'single', score: 1,
    stem: '「とのことだ」の つかい方として 正しい ものは どれですか。',
    options: ['わたしは 来月 帰国する とのことです。', '（社内れんらく）山田さんは 来月 無事に 帰国する とのことです。', '空が 暗いので、雨が 降る とのことです。', '田中さんに 会った とのことが あります。'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '傳聞與引用', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-to-iu-koto-da', topicIds: ['jpg_n3-to-iu-koto-da'] },
  },
  {
    id: 'n3-own-b2-09', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 9,
    type: 'single', score: 1,
    stem: '天気予報（　　）、あしたは 雪が 降ると いう ことです。',
    options: ['によると', 'に対して', 'について', 'に沿って'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '傳聞與引用', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-to-iu-koto-da', topicIds: ['jpg_n3-to-iu-koto-da'] },
  },

  // ── jpg_n3-nitsurete ──
  {
    id: 'n3-own-b2-10', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 10,
    type: 'single', score: 1,
    stem: '日本語が 上手に なる（　　）、勉強が 楽しく なって きた。',
    options: ['にとって', 'に対して', 'によって', 'につれて'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '比例與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-nitsurete', topicIds: ['jpg_n3-nitsurete'] },
  },
  {
    id: 'n3-own-b2-11', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 11,
    type: 'single', score: 1,
    stem: '時間が （　　）に つれて、事故の きおくも うすれて いった。',
    options: ['たって', 'たち', 'たつ', 'たった'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '比例與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-nitsurete', topicIds: ['jpg_n3-nitsurete'] },
  },
  {
    id: 'n3-own-b2-12', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 12,
    type: 'single', score: 1,
    stem: '係員の しじ（　　）、順番に お進みください。',
    options: ['にしたがって', 'によると', 'とともに', 'につれて'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '比例與變化', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-nitsurete', topicIds: ['jpg_n3-nitsurete'] },
  },

  // ── jpg_n3-shika-naikara ──
  {
    id: 'n3-own-b2-13', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 13,
    type: 'single', score: 1,
    stem: '終電が なくなって しまった。タクシーも 見つからない。家までは 歩いて 20分だ。歩いて 帰る（　　）。',
    options: ['ことが ある', 'はずが ない', 'しかない', 'わけには いかない'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '限定與決斷', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-shika-naikara', topicIds: ['jpg_n3-shika-naikara'] },
  },
  {
    id: 'n3-own-b2-14', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 14,
    type: 'single', score: 1,
    stem: '電車が 止まって しまった。うごくまで （　　）。',
    options: ['待たしかない', '待ちしかない', '待ってしかない', '待つしかない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '限定與決斷', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-shika-naikara', topicIds: ['jpg_n3-shika-naikara'] },
  },
  {
    id: 'n3-own-b2-15', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 15,
    type: 'single', score: 1,
    stem: '「やるしかない」に いちばん 近い 気持ちは どれですか。',
    options: ['やるかどうか まだ 決めて いない', 'やりたくて たまらない', 'やらなくても いい', 'ほかに 方法が ないので、やるほか ない'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '限定與決斷', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-shika-naikara', topicIds: ['jpg_n3-shika-naikara'] },
  },

  // ── jpg_n3-ni-kareshite（〜に対して）──
  {
    id: 'n3-own-b2-16', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 16,
    type: 'single', score: 1,
    stem: 'お客様（　　）は、ていねいな 言葉を つかいましょう。',
    options: ['にとって', 'に対して', 'に沿って', 'につれて'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '對象與對比', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-kareshite', topicIds: ['jpg_n3-ni-kareshite'] },
  },
  {
    id: 'n3-own-b2-17', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 17,
    type: 'single', score: 1,
    stem: '兄が 活発な（　　）対して、弟は とても 静かだ。',
    options: ['に', 'を', 'のに', 'は'],
    answer: '3',
    source: { book: 'JLPT N3', chapter: '對象與對比', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-kareshite', topicIds: ['jpg_n3-ni-kareshite'] },
  },
  {
    id: 'n3-own-b2-18', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 18,
    type: 'single', score: 1,
    stem: '「に対して」の 二つの つかい方は どれと どれですか。',
    options: ['原因 ／ 目的', '時間 ／ 場所', '伝聞 ／ 推量', 'ある 相手への たいど ／ 二つの ことの 対比'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '對象與對比', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ni-kareshite', topicIds: ['jpg_n3-ni-kareshite'] },
  },

  // ── jpg_n3-saichuu ──
  {
    id: 'n3-own-b2-19', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 19,
    type: 'single', score: 1,
    stem: '会議の（　　）、とつぜん 電話が 鳴りだした。',
    options: ['ところに', 'たびに', 'うちに', '最中に'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '時間與干擾', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-saichuu', topicIds: ['jpg_n3-saichuu'] },
  },
  {
    id: 'n3-own-b2-20', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 20,
    type: 'single', score: 1,
    stem: '食事を （　　）最中に、お客さんが 来て しまった。',
    options: ['して', 'して いる', 'した', 'する'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '時間與干擾', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-saichuu', topicIds: ['jpg_n3-saichuu'] },
  },
  {
    id: 'n3-own-b2-21', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 21,
    type: 'single', score: 1,
    stem: '「最中」の つかい方として 正しい ものは どれですか。',
    options: ['会議が 終わった 最中に、電話が ありました。', '食事の 最中に 電話が 鳴って、ゆっくり 食べられなかった。', '毎朝 7時の 最中に 家を 出ます。', 'あしたから 一週間の 最中、旅行に 行きます。'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '時間與干擾', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-saichuu', topicIds: ['jpg_n3-saichuu'] },
  },

  // ── jpg_n3-ueni ──
  {
    id: 'n3-own-b2-22', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 22,
    type: 'single', score: 1,
    stem: 'この 店は 料理が おいしい（　　）、値段も 安い。',
    options: ['上に', 'に対して', 'かわりに', 'わりに'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '累加與遞進', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ueni', topicIds: ['jpg_n3-ueni'] },
  },
  {
    id: 'n3-own-b2-23', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 23,
    type: 'single', score: 1,
    stem: '「上に」の つかい方として 正しい ものは どれですか。',
    options: ['この へやは 広い 上に、家賃が 高い。', '道に まよった 上に、しんせつな 人に 助けて もらった。', '彼は 日本語が 上手の 上に、英語も 話せる。', 'この へやは 広い 上に、駅からも 近い。'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '累加與遞進', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ueni', topicIds: ['jpg_n3-ueni'] },
  },
  {
    id: 'n3-own-b2-24', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 24,
    type: 'single', score: 1,
    stem: 'この 部屋は しずか（　　）上に、日当たりも いい。',
    options: ['で', 'だ', 'の', 'な'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '累加與遞進', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-ueni', topicIds: ['jpg_n3-ueni'] },
  },

  // ── jpg_n3-mono-da ──
  {
    id: 'n3-own-b2-25', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 25,
    type: 'single', score: 1,
    stem: '子どもの ころは、よく この 川で 泳いだ（　　）。',
    options: ['ものだ', 'ところだ', 'ことだ', 'ばかりだ'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '感嘆與常理', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-mono-da', topicIds: ['jpg_n3-mono-da'] },
  },
  {
    id: 'n3-own-b2-26', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 26,
    type: 'single', score: 1,
    stem: '年を とると、昔の ことを 思い出す（　　）。',
    options: ['ものだ', 'とのことだ', 'ことだ', 'しかない'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '感嘆與常理', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-mono-da', topicIds: ['jpg_n3-mono-da'] },
  },
  {
    id: 'n3-own-b2-27', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 27,
    type: 'single', score: 1,
    stem: '「〜ものだ」と 「〜ことだ」の ちがいとして いちばん いい せつめいは どれですか。',
    options: ['ものだ は 一般的な 常識や 感慨、ことだ は 相手への ぐたいてきな アドバイス', 'ものだ は アドバイス、ことだ は 常識', 'ものだ は 過去、ことだ は 未来に つかう', '二つとも 同じ いみ'],
    answer: '1',
    source: { book: 'JLPT N3', chapter: '感嘆與常理', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-mono-da', topicIds: ['jpg_n3-mono-da', 'jpg_n3-koto-da'] },
  },

  // ── jpg_n3-koto-da ──
  {
    id: 'n3-own-b2-28', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 28,
    type: 'single', score: 1,
    stem: '（医者が 患者に）早く なおしたければ、とにかく 早く 寝る（　　）。',
    options: ['ところです', 'ばかりです', 'ものです', 'ことです'],
    answer: '4',
    source: { book: 'JLPT N3', chapter: '建議與忠告', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-koto-da', topicIds: ['jpg_n3-koto-da', 'jpg_n3-mono-da'] },
  },
  {
    id: 'n3-own-b2-29', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 29,
    type: 'single', score: 1,
    stem: '体を こわさない ように、むりを （　　）ことです。',
    options: ['し', 'しない', 'した', 'して'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '建議與忠告', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-koto-da', topicIds: ['jpg_n3-koto-da', 'jpg_n3-youni-purpose'] },
  },
  {
    id: 'n3-own-b2-30', subject: '日本語', year: 2026, paper: 'n3-original-batch2', number: 30,
    type: 'single', score: 1,
    stem: '「試験に 合格したいんですが、どう すれば いいでしょうか。」「とにかく、毎日 少しずつ 続ける（　　）。」',
    options: ['つもりです', 'ことです', 'ところです', 'そうです'],
    answer: '2',
    source: { book: 'JLPT N3', chapter: '建議與忠告', level: 'N3', confirmed: true, license: 'own', origin: 'own' },
    topics: { primary: 'jpg_n3-koto-da', topicIds: ['jpg_n3-koto-da'] },
  },
];
