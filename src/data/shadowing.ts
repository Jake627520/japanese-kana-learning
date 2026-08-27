import { Language } from '../i18n';

export type LocalizedString = Record<Language, string>;

export interface ShadowingSentence {
  id: string;
  japanese: string;
  kana: string;
  reading?: string;
  romaji: string;
  meaning: LocalizedString | string;
  focus?: LocalizedString | string;
  tags?: string[];
  tip?: LocalizedString | string;
  focusKana?: string[]; // 這句適合練的「難音」假名（用來和使用者弱點假名比對推薦）
  // 預先生成的高品質音檔（VOICEVOX）。留空時自動退回瀏覽器 Web Speech，
  // 所以填不填都能用——這讓音檔可以一句一句補，不必等全部生完才上線。
  // 路徑相對於站台 base（例如 'audio/shadowing/sh-01.mp3'）。
  audio?: { normal?: string; slow?: string };
}

export function getShadowingText(
  value: LocalizedString | string | undefined,
  lang: Language = 'zh-TW'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value['zh-TW'] || value['zh-CN'] || value['en'] || '';
}

export const SHADOWING_SENTENCES: ShadowingSentence[] = [
  {
    id: 'sh-01',
    japanese: 'はじめまして、どうぞよろしくおねがいします。',
    kana: 'はじめまして、どうぞよろしくおねがいします。',
    reading: 'はじめまして、どうぞよろしくおねがいします。',
    romaji: 'Hajimemashite, douzo yoroshiku onegaishimasu.',
    meaning: {
      'zh-TW': '初次見面，請多多指教。',
      'zh-CN': '初次见面，请多关照。',
      'en': 'Nice to meet you. Pleased to meet you.',
    },
    focus: {
      'zh-TW': '初次見面自我介紹常用禮貌語調',
      'zh-CN': '初次见面自我介绍常用礼貌语调',
      'en': 'Polite intonation for self-introductions',
    },
    tags: ['greeting'],
    tip: {
      'zh-TW': '注意「はじめまして」與「おねがいします」禮貌語氣的平穩降調。',
      'zh-CN': '注意“はじめまして”与“おねがいします”礼貌语气的平稳降调。',
      'en': 'Note the gentle falling intonation on "hajimemashite" and "onegaishimasu".',
    },
    focusKana: ['し'],
    audio: { normal: 'audio/shadowing/sh-01.mp3', slow: 'audio/shadowing/sh-01-slow.mp3' },
  },
  {
    id: 'sh-02',
    japanese: 'これは わたしのかばんです。',
    kana: 'これは わたしのかばんです。',
    reading: 'これは わたしのかばんです。',
    romaji: 'Kore wa watashi no kaban desu.',
    meaning: {
      'zh-TW': '這是我的包包。',
      'zh-CN': '这是我的包。',
      'en': 'This is my bag.',
    },
    focus: {
      'zh-TW': '助詞「は」「の」的自然語調與停頓',
      'zh-CN': '助词“は”“の”的自然语调与停顿',
      'en': 'Natural rhythm and pauses around particles "wa" and "no"',
    },
    tags: ['daily'],
    tip: {
      'zh-TW': '助詞「は（wa）」「の」與名詞之間的自然連貫與微幅停頓。',
      'zh-CN': '助词“は（wa）”“の”与名词之间的自然连贯与微幅停顿。',
      'en': 'Smooth flow and slight pauses between nouns and particles "wa" / "no".',
    },
    audio: { normal: 'audio/shadowing/sh-02.mp3', slow: 'audio/shadowing/sh-02-slow.mp3' },
  },
  {
    id: 'sh-03',
    japanese: 'まいにち あさ 7じに おきます。',
    kana: 'まいにち あさ しちじに おきます。',
    reading: 'まいにち あさ 7じに おきます。',
    romaji: 'Mainichi asa shichiji ni okimasu.',
    meaning: {
      'zh-TW': '每天早上 7 點起床。',
      'zh-CN': '每天早上 7 点起床。',
      'en': 'I wake up at 7:00 every morning.',
    },
    focus: {
      'zh-TW': '時間助詞「に」與動詞「おきます」的節奏',
      'zh-CN': '时间助词“に”与动词“おきます”的节奏',
      'en': 'Rhythm with time particle "ni" and verb "okimasu"',
    },
    tags: ['daily', 'time'],
    tip: {
      'zh-TW': '時間助詞「に」與動作動詞「おきます」的輕快節奏。',
      'zh-CN': '时间助词“に”与动作动词“おきます”的轻快节奏。',
      'en': 'Crisp rhythm on time particle "ni" leading into "okimasu".',
    },
    focusKana: ['し', 'ち'],
    audio: { normal: 'audio/shadowing/sh-03.mp3', slow: 'audio/shadowing/sh-03-slow.mp3' },
  },
  {
    id: 'sh-04',
    japanese: 'いっしょに コーヒーを のみませんか。',
    kana: 'いっしょに コーヒーを のみませんか。',
    reading: 'いっしょに コーヒーを のみませんか。',
    romaji: 'Issho ni koohii o nomimasen ka.',
    meaning: {
      'zh-TW': '要不要一起喝杯咖啡呢？',
      'zh-CN': '要不要一起喝杯咖啡呢？',
      'en': 'Would you like to have coffee together?',
    },
    focus: {
      'zh-TW': '促音「っ」與邀約句型「〜ませんか」句尾上揚語調',
      'zh-CN': '促音“っ”与邀约句型“〜ませんか”句尾上扬语调',
      'en': 'Double consonant pause and rising tone on invitation "~masen ka"',
    },
    tags: ['invitation'],
    tip: {
      'zh-TW': '促音「っ」的停頓拍子與邀約句尾「〜ませんか」的自然微揚。',
      'zh-CN': '促音“っ”的停顿拍子与邀约句尾“〜ませんか”的自然微扬。',
      'en': 'Brief pause on double consonant "っ" and natural lift at the end of "~masen ka".',
    },
    focusKana: ['し'],
    audio: { normal: 'audio/shadowing/sh-04.mp3', slow: 'audio/shadowing/sh-04-slow.mp3' },
  },
  {
    id: 'sh-05',
    japanese: 'きのう としょかんで ほんを よみました。',
    kana: 'きのう としょかんで ほんを よみました。',
    reading: 'きのう としょかんで ほんを よみました。',
    romaji: 'Kinou toshokan de hon o yomimashita.',
    meaning: {
      'zh-TW': '昨天在圖書館讀了書。',
      'zh-CN': '昨天在图书馆看了书。',
      'en': 'I read a book in the library yesterday.',
    },
    focus: {
      'zh-TW': '場所助詞「で」與過去式「〜ました」發音',
      'zh-CN': '场所助词“で”与过去式“〜ました”发音',
      'en': 'Location particle "de" and past tense ending "~mashita"',
    },
    tags: ['past', 'action'],
    tip: {
      'zh-TW': '場所助詞「で」與過去式結尾「〜ました」的順暢過渡。',
      'zh-CN': '场所助词“で”与过去式结尾“〜ました”的顺畅过渡。',
      'en': 'Smooth transition across location particle "de" and past tense "~mashita".',
    },
    focusKana: ['し'],
    audio: { normal: 'audio/shadowing/sh-05.mp3', slow: 'audio/shadowing/sh-05-slow.mp3' },
  },
  {
    id: 'sh-06',
    japanese: 'すみません、えきは どこですか。',
    kana: 'すみません、えきは どこですか。',
    reading: 'すみません、えきは どこですか。',
    romaji: 'Sumimasen, eki wa doko desu ka.',
    meaning: {
      'zh-TW': '不好意思，請問車站在哪裡？',
      'zh-CN': '不好意思，请问车站在哪里？',
      'en': 'Excuse me, where is the station?',
    },
    focus: {
      'zh-TW': '詢問方向時禮貌語氣與問句尾音',
      'zh-CN': '询问方向时礼貌语气与问句尾音',
      'en': 'Polite inquiry tone and rising question ending',
    },
    tags: ['question', 'travel'],
    tip: {
      'zh-TW': '詢問疑問句「どこですか」的自然疑問語調。',
      'zh-CN': '询问疑问句“どこですか”的自然疑问语调。',
      'en': 'Natural rising question tone on "doko desu ka".',
    },
    focusKana: ['す'],
    audio: { normal: 'audio/shadowing/sh-06.mp3', slow: 'audio/shadowing/sh-06-slow.mp3' },
  },
  {
    id: 'sh-07',
    japanese: 'この りんごは とても おいしいです。',
    kana: 'この りんごは とても おいしいです。',
    reading: 'この りんごは とても おいしいです。',
    romaji: 'Kono ringo wa totemo oishii desu.',
    meaning: {
      'zh-TW': '這個蘋果非常美味。',
      'zh-CN': '这个苹果非常美味。',
      'en': 'This apple is very delicious.',
    },
    focus: {
      'zh-TW': '副詞「とても」的強調語氣與形容詞結尾',
      'zh-CN': '副词“とても”的强调语气与形容词结尾',
      'en': 'Emphasis on adverb "totemo" with adjective ending',
    },
    tags: ['adjective', 'taste'],
    tip: {
      'zh-TW': '副詞「とても」的加強語氣與「おいしいです」的起伏。',
      'zh-CN': '副词“とても”的加强语气与“おいしいです”的起伏。',
      'en': 'Expressive emphasis on "totemo" with the cadence of "oishii desu".',
    },
    focusKana: ['り', 'し'],
    audio: { normal: 'audio/shadowing/sh-07.mp3', slow: 'audio/shadowing/sh-07-slow.mp3' },
  },
  {
    id: 'sh-08',
    japanese: 'バスで がっこうへ いきます。',
    kana: 'バスで がっこうへ いきます。',
    reading: 'バスで がっこうへ いきます。',
    romaji: 'Basu de gakkou e ikimasu.',
    meaning: {
      'zh-TW': '搭公車去學校。',
      'zh-CN': '坐公交车去学校。',
      'en': 'I go to school by bus.',
    },
    focus: {
      'zh-TW': '交通手段「で」與移動方向助詞「へ (e)」',
      'zh-CN': '交通手段“で”与移动方向助词“へ (e)”',
      'en': 'Means particle "de" and direction particle "e" (written へ)',
    },
    tags: ['transport', 'movement'],
    tip: {
      'zh-TW': '交通手段「「で」與移動方向助詞「へ (發音 e)」的發音。',
      'zh-CN': '交通手段“で”与移动方向助词“へ (发音 e)”的发音。',
      'en': 'Pronounce particle "へ" as "e" when indicating destination.',
    },
    focusKana: ['す'],
    audio: { normal: 'audio/shadowing/sh-08.mp3', slow: 'audio/shadowing/sh-08-slow.mp3' },
  },
  {
    id: 'sh-09',
    japanese: 'あした ともだちと えいがを みます。',
    kana: 'あした ともだちと えいがを みます。',
    reading: 'あした ともだちと えいがを みます。',
    romaji: 'Ashita tomodachi to eiga o mimasu.',
    meaning: {
      'zh-TW': '明天和朋友一起看電影。',
      'zh-CN': '明天和朋友一起看电影。',
      'en': 'I will watch a movie with a friend tomorrow.',
    },
    focus: {
      'zh-TW': '伴隨助詞「と」與受詞助詞「を」的平穩過渡',
      'zh-CN': '伴随助词“と”与宾语助词“を”的平稳过渡',
      'en': 'Smooth pacing across accompaniment particle "to" and object particle "o"',
    },
    tags: ['plan', 'activity'],
    tip: {
      'zh-TW': '伴隨「と」與賓格「を」在長句中的平衡重音。',
      'zh-CN': '伴随“と”与宾格“を”在长句中的平衡重音。',
      'en': 'Balanced cadence between partner particle "to" and direct object "o".',
    },
    focusKana: ['ち', 'し'],
    audio: { normal: 'audio/shadowing/sh-09.mp3', slow: 'audio/shadowing/sh-09-slow.mp3' },
  },
  {
    id: 'sh-10',
    japanese: 'きょうは てんきが とても いいですね。',
    kana: 'きょうは てんきが とても いいですね。',
    reading: 'きょうは てんきが とても いいですね。',
    romaji: 'Kyou wa tenki ga totemo ii desu ne.',
    meaning: {
      'zh-TW': '今天天氣真好呢。',
      'zh-CN': '今天天气真好呢。',
      'en': 'The weather is very nice today, isn\'t it?',
    },
    focus: {
      'zh-TW': '句尾共感終助詞「ね」的自然降調與延伸',
      'zh-CN': '句尾共鸣终助词“ね”的自然降调与延伸',
      'en': 'Friendly agreement particle "ne" at sentence end',
    },
    tags: ['conversation', 'weather'],
    tip: {
      'zh-TW': '句尾終助詞「ね」的共感語氣與放鬆降調。',
      'zh-CN': '句尾终助词“ね”的共感语气与放松降调。',
      'en': 'Relaxed, friendly tone on final particle "ne" seeking agreement.',
    },
    audio: { normal: 'audio/shadowing/sh-10.mp3', slow: 'audio/shadowing/sh-10-slow.mp3' },
  },
  {
    id: 'sh-11',
    japanese: 'つくえの うえに ほんが あります。',
    kana: 'つくえの うえに ほんが あります。',
    reading: 'つくえの うえに ほんが あります。',
    romaji: 'Tsukue no ue ni hon ga arimasu.',
    meaning: {
      'zh-TW': '桌上有一本書。',
      'zh-CN': '桌上有一本书。',
      'en': 'There is a book on the desk.',
    },
    focus: {
      'zh-TW': '「つ」的清脆發音與存在句「あります」',
      'zh-CN': '“つ”的清脆发音与存在句“あります”',
      'en': 'Crisp "tsu" pronunciation and existence verb "arimasu"',
    },
    tags: ['daily'],
    tip: {
      'zh-TW': '句首「つ」是難音——ts＋不圓唇的 u，別念成「粗」。',
      'zh-CN': '句首“つ”是难点音——ts＋不圆唇的 u，别念成“粗”。',
      'en': 'Focus on crisp "tsu" without rounding your lips excessively.',
    },
    focusKana: ['つ'],
    audio: { normal: 'audio/shadowing/sh-11.mp3', slow: 'audio/shadowing/sh-11-slow.mp3' },
  },
  {
    id: 'sh-12',
    japanese: 'なつやすみに うみへ いきたいです。',
    kana: 'なつやすみに うみへ いきたいです。',
    reading: 'なつやすみに うみへ いきたいです。',
    romaji: 'Natsuyasumi ni umi e ikitai desu.',
    meaning: {
      'zh-TW': '暑假想去海邊。',
      'zh-CN': '暑假想去海边。',
      'en': 'I want to go to the beach during summer vacation.',
    },
    focus: {
      'zh-TW': '「つ」「す」相鄰對比與願望句「〜たいです」',
      'zh-CN': '“つ”“す”相邻对比与愿望句“〜たいです”',
      'en': 'Distinguishing "tsu" vs "su" and desire form "~tai desu"',
    },
    tags: ['plan'],
    tip: {
      'zh-TW': '「なつ（tsu）」與「やすみ（su）」相鄰，剛好練 つ／す 的區別。',
      'zh-CN': '“なつ（tsu）”与“やすみ（su）”相邻，正好练习 つ／す 的区别。',
      'en': 'Practice differentiating "tsu" in "natsu" and "su" in "yasumi".',
    },
    focusKana: ['つ', 'す'],
    audio: { normal: 'audio/shadowing/sh-12.mp3', slow: 'audio/shadowing/sh-12-slow.mp3' },
  },
  {
    id: 'sh-13',
    japanese: 'ふゆは とても さむいです。',
    kana: 'ふゆは とても さむいです。',
    reading: 'ふゆは とても さむいです。',
    romaji: 'Fuyu wa totemo samui desu.',
    meaning: {
      'zh-TW': '冬天非常冷。',
      'zh-CN': '冬天非常冷。',
      'en': 'It is very cold in winter.',
    },
    focus: {
      'zh-TW': '「ふ」的雙唇送氣（非英文 f）',
      'zh-CN': '“ふ”的双唇送气（非英文 f）',
      'en': 'Bilabial voiceless fricative for "fu" (not English "f")',
    },
    tags: ['conversation', 'weather'],
    tip: {
      'zh-TW': '「ふ」上齒不咬下唇，是雙唇留縫吹氣，像吹蠟燭。',
      'zh-CN': '“ふ”上齿不咬下唇，是双唇留缝吹气，像吹蜡烛。',
      'en': 'Blow gently through both lips without touching upper teeth to lower lip.',
    },
    focusKana: ['ふ'],
    audio: { normal: 'audio/shadowing/sh-13.mp3', slow: 'audio/shadowing/sh-13-slow.mp3' },
  },
  {
    id: 'sh-14',
    japanese: 'あたらしい くつを かいました。',
    kana: 'あたらしい くつを かいました。',
    reading: 'あたらしい くつを かいました。',
    romaji: 'Atarashii kutsu o kaimashita.',
    meaning: {
      'zh-TW': '買了新鞋子。',
      'zh-CN': '买了新鞋子。',
      'en': 'I bought new shoes.',
    },
    focus: {
      'zh-TW': '「ら」行彈舌與「つ」的組合',
      'zh-CN': '“ら”行弹舌与“つ”的组合',
      'en': 'Combination of "ra" tap and "tsu"',
    },
    tags: ['past', 'action'],
    tip: {
      'zh-TW': '「あたらしい」的 ら 是彈舌一下，不是捲舌 r 也不是 l。',
      'zh-CN': '“あたらしい”的 ら 是轻弹舌一下，不是卷舌 r 也不是 l。',
      'en': 'Lightly tap the roof of your mouth for "ra" (not English "r" or "l").',
    },
    focusKana: ['ら', 'つ'],
    audio: { normal: 'audio/shadowing/sh-14.mp3', slow: 'audio/shadowing/sh-14-slow.mp3' },
  },
  {
    id: 'sh-15',
    japanese: 'この りょうりは からくないです。',
    kana: 'この りょうりは からくないです。',
    reading: 'この りょうりは からくないです。',
    romaji: 'Kono ryouri wa karakunai desu.',
    meaning: {
      'zh-TW': '這道菜不辣。',
      'zh-CN': '这道菜不辣。',
      'en': 'This dish is not spicy.',
    },
    focus: {
      'zh-TW': '「ら」「り」與拗音「りょ」的彈舌節奏',
      'zh-CN': '“ら”“り”与拗音“りょ”的弹舌节奏',
      'en': 'Rhythm of "ra", "ri", and youon "ryo"',
    },
    tags: ['adjective', 'taste'],
    tip: {
      'zh-TW': '「りょうり」「からくない」連續的 ら行音，一路彈舌別捲舌。',
      'zh-CN': '“りょうり”“からくない”连续的 ら行音，一路弹舌别卷舌。',
      'en': 'Maintain clean Japanese taps through "ryouri" and "karakunai".',
    },
    focusKana: ['ら', 'り'],
    audio: { normal: 'audio/shadowing/sh-15.mp3', slow: 'audio/shadowing/sh-15-slow.mp3' },
  },
  {
    id: 'sh-16',
    japanese: 'よる おそくまで はたらきました。',
    kana: 'よる おそくまで はたらきました。',
    reading: 'よる おそくまで はたらきました。',
    romaji: 'Yoru osoku made hatarakimashita.',
    meaning: {
      'zh-TW': '工作到很晚。',
      'zh-CN': '工作到很晚。',
      'en': 'I worked until late at night.',
    },
    focus: {
      'zh-TW': '「る」「ら」行在句中的輕彈',
      'zh-CN': '“る”“ら”行在句中的轻弹',
      'en': 'Light taps for "ru" and "ra" within the sentence',
    },
    tags: ['past', 'action'],
    tip: {
      'zh-TW': '「よる」的 る 與「はたらき」的 ら，都輕彈一下就走，不要停留。',
      'zh-CN': '“よる”的 る 与“はたらき”的 ら，都轻弹一下就走，不要停留。',
      'en': 'Quick, light taps on "ru" in "yoru" and "ra" in "hataraki".',
    },
    focusKana: ['る', 'ら'],
    audio: { normal: 'audio/shadowing/sh-16.mp3', slow: 'audio/shadowing/sh-16-slow.mp3' },
  },
  {
    id: 'sh-17',
    japanese: 'ひこうきで にほんへ いきます。',
    kana: 'ひこうきで にほんへ いきます。',
    reading: 'ひこうきで にほんへ いきます。',
    romaji: 'Hikouki de nihon e ikimasu.',
    meaning: {
      'zh-TW': '搭飛機去日本。',
      'zh-CN': '坐飞机去日本。',
      'en': 'I go to Japan by airplane.',
    },
    focus: {
      'zh-TW': '「ひ」的清音與交通手段「で」',
      'zh-CN': '“ひ”的清音与交通手段“で”',
      'en': 'Voiceless palatal fricative "hi" and transport particle "de"',
    },
    tags: ['transport', 'travel'],
    tip: {
      'zh-TW': '「ひ」的氣流集中在硬顎，不要念成「西」。',
      'zh-CN': '“ひ”的气流集中在硬腭，不要念成“西”。',
      'en': 'Channel air against the hard palate for "hi" without slurring into "shi".',
    },
    focusKana: ['ひ'],
    audio: { normal: 'audio/shadowing/sh-17.mp3', slow: 'audio/shadowing/sh-17-slow.mp3' },
  },
  {
    id: 'sh-18',
    japanese: 'ちいさい ねこが つくえの したに います。',
    kana: 'ちいさい ねこが つくえの したに います。',
    reading: 'ちいさい ねこが つくえの したに います。',
    romaji: 'Chiisai neko ga tsukue no shita ni imasu.',
    meaning: {
      'zh-TW': '有一隻小貓在桌子下面。',
      'zh-CN': '有一只小猫在桌子下面。',
      'en': 'There is a little cat under the desk.',
    },
    focus: {
      'zh-TW': '「ち」「つ」相鄰對比與存在句「います」',
      'zh-CN': '“ち”“つ”相邻对比与存在句“います”',
      'en': 'Contrasting "chi" vs "tsu" and animate existence verb "imasu"',
    },
    tags: ['daily'],
    tip: {
      'zh-TW': '「ちいさい（chi）」與「つくえ（tsu）」剛好練 ち／つ 的區別。',
      'zh-CN': '“ちいさい（chi）”与“つくえ（tsu）”正好练习 ち／つ 的区别。',
      'en': 'Practice switching clearly between "chi" in "chiisai" and "tsu" in "tsukue".',
    },
    focusKana: ['ち', 'つ'],
    audio: { normal: 'audio/shadowing/sh-18.mp3', slow: 'audio/shadowing/sh-18-slow.mp3' },
  },
];
