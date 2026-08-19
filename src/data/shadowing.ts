export interface ShadowingSentence {
  id: string;
  japanese: string;
  reading: string;
  romaji: string;
  meaning: string;
  focus: string;
}

export const SHADOWING_SENTENCES: ShadowingSentence[] = [
  {
    id: 'sh-01',
    japanese: 'はじめまして、どうぞよろしくおねがいします。',
    reading: 'はじめまして、どうぞよろしくおねがいします。',
    romaji: 'Hajimemashite, douzo yoroshiku onegaishimasu.',
    meaning: '初次見面，請多多指教。',
    focus: '初次見面自我介紹常用禮貌語調',
  },
  {
    id: 'sh-02',
    japanese: 'これは わたしのかばんです。',
    reading: 'これは わたしのかばんです。',
    romaji: 'Kore wa watashi no kaban desu.',
    meaning: '這是我的包包。',
    focus: '助詞「は」「の」的自然語調與停頓',
  },
  {
    id: 'sh-03',
    japanese: 'まいにち あさ 7じに おきます。',
    reading: 'まいにち あさ 7じに おきます。',
    romaji: 'Mainichi asa shichiji ni okimasu.',
    meaning: '每天早上 7 點起床。',
    focus: '時間助詞「に」與動詞「おきます」的節奏',
  },
  {
    id: 'sh-04',
    japanese: 'いっしょに コーヒーを のみませんか。',
    reading: 'いっしょに コーヒーを のみませんか。',
    romaji: 'Issho ni koohii o nomimasen ka.',
    meaning: '要不要一起喝杯咖啡呢？',
    focus: '促音「っ」與邀約句型「〜ませんか」句尾上揚語調',
  },
  {
    id: 'sh-05',
    japanese: 'きのう としょかんで ほんを よみました。',
    reading: 'きのう としょかんで ほんを よみました。',
    romaji: 'Kinou toshokan de hon o yomimashita.',
    meaning: '昨天在圖書館讀了書。',
    focus: '場所助詞「で」與過去式「〜ました」發音',
  },
  {
    id: 'sh-06',
    japanese: 'すみません、えきは どこですか。',
    reading: 'すみません、えきは どこですか。',
    romaji: 'Sumimasen, eki wa doko desu ka.',
    meaning: '不好意思，請問車站站在哪裡？',
    focus: '詢問方向時禮貌語氣與問句尾音',
  },
  {
    id: 'sh-07',
    japanese: 'この りんごは とても おいしいです。',
    reading: 'この りんごは とても おいしいです。',
    romaji: 'Kono ringo wa totemo oishii desu.',
    meaning: '這個蘋果非常美味。',
    focus: '副詞「とても」的強調語氣與形容詞結尾',
  },
  {
    id: 'sh-08',
    japanese: 'バスで がっこうへ いきます。',
    reading: 'バスで がっこうへ いきます。',
    romaji: 'Basu de gakkou e ikimasu.',
    meaning: '搭公車去學校。',
    focus: '交通手段「で」與移動方向助詞「へ (e)」',
  },
  {
    id: 'sh-09',
    japanese: 'あした ともだちと えいがを みます。',
    reading: 'あした ともだちと えいがを みます。',
    romaji: 'Ashita tomodachi to eiga o mimasu.',
    meaning: '明天和朋友一起看電影。',
    focus: '伴隨助詞「と」與受詞助詞「を」的平穩過渡',
  },
  {
    id: 'sh-10',
    japanese: 'きょうは てんきが とても いいですね。',
    reading: 'きょうは てんきが とても いいですね。',
    romaji: 'Kyou wa tenki ga totemo ii desu ne.',
    meaning: '今天天氣真好呢。',
    focus: '句尾共感終助詞「ね」的自然降調與延伸',
  },
];
