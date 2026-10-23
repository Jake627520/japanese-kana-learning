import { KanaItem } from '../types';
import { KATAKANA_DATA } from './katakanaData';
import { DAKUTEN_DATA } from './dakutenData';
import { HANDAKUTEN_DATA } from './handakutenData';
import { YOUON_DATA } from './youonData';
export { KATAKANA_DATA } from './katakanaData';
export { DAKUTEN_DATA } from './dakutenData';
export { HANDAKUTEN_DATA } from './handakutenData';
export { YOUON_DATA } from './youonData';

export const HIRAGANA_DATA: KanaItem[] = [
  {
    "id": "h_a",
    "type": "hiragana",
    "kana": "あ",
    "romaji": "a",
    "row": "あ行",
    "col": "あ段",
    "examples": [
      {
        "word": "あさ",
        "romaji": "asa",
        "meaning": {
          "zh-TW": "早晨",
          "zh-CN": "早晨",
          "en": "morning",
          "ko": "아침",
          "es": "mañana (parte del día)"
        },
        "sentence": "あさです。",
        "sentenceMeaning": {
          "zh-TW": "是早晨。",
          "zh-CN": "是早晨。",
          "en": "It's morning.",
          "ko": "아침이에요.",
          "es": "Es de mañana."
        },
        "sentenceDisplay": "あさ です。"
      },
      {
        "word": "あめ",
        "romaji": "ame",
        "meaning": {
          "zh-TW": "下雨 / 糖果",
          "zh-CN": "下雨 / 糖果",
          "en": "rain / candy",
          "ko": "비 / 사탕",
          "es": "lluvia / caramelo"
        },
        "sentence": "あめがふります。",
        "sentenceMeaning": {
          "zh-TW": "下雨了。",
          "zh-CN": "下雨了。",
          "en": "It's raining.",
          "ko": "비가 와요.",
          "es": "Llueve."
        },
        "sentenceDisplay": "あめ が ふります。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_i",
    "type": "hiragana",
    "kana": "い",
    "romaji": "i",
    "row": "あ行",
    "col": "い段",
    "examples": [
      {
        "word": "いぬ",
        "romaji": "inu",
        "meaning": {
          "zh-TW": "狗",
          "zh-CN": "狗",
          "en": "dog",
          "ko": "개",
          "es": "perro"
        },
        "sentence": "かわいいいぬです。",
        "sentenceMeaning": {
          "zh-TW": "是可愛的狗。",
          "zh-CN": "是可爱的狗。",
          "en": "It's a cute dog.",
          "ko": "귀여운 개예요.",
          "es": "Es un perro adorable."
        },
        "sentenceDisplay": "かわいい いぬ です。"
      },
      {
        "word": "いえ",
        "romaji": "ie",
        "meaning": {
          "zh-TW": "家",
          "zh-CN": "家",
          "en": "house, home",
          "ko": "집",
          "es": "casa"
        },
        "sentence": "いえにかえります。",
        "sentenceMeaning": {
          "zh-TW": "回家。",
          "zh-CN": "回家。",
          "en": "I'm going home.",
          "ko": "집에 돌아가요.",
          "es": "Vuelvo a casa."
        },
        "sentenceDisplay": "いえ に かえります。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_u",
    "type": "hiragana",
    "kana": "う",
    "romaji": "u",
    "row": "あ行",
    "col": "う段",
    "examples": [
      {
        "word": "うみ",
        "romaji": "umi",
        "meaning": {
          "zh-TW": "大海",
          "zh-CN": "大海",
          "en": "sea, ocean",
          "ko": "바다",
          "es": "mar"
        },
        "sentence": "うみがきれいですね。",
        "sentenceMeaning": {
          "zh-TW": "大海真漂亮呢。",
          "zh-CN": "大海真漂亮呢。",
          "en": "The sea is beautiful, isn't it?",
          "ko": "바다가 예쁘네요.",
          "es": "El mar es precioso, ¿verdad?"
        },
        "sentenceDisplay": "うみ が きれい です ね。"
      },
      {
        "word": "うた",
        "romaji": "uta",
        "meaning": {
          "zh-TW": "歌曲",
          "zh-CN": "歌曲",
          "en": "song",
          "ko": "노래",
          "es": "canción"
        },
        "sentence": "うたをうたいます。",
        "sentenceMeaning": {
          "zh-TW": "唱歌。",
          "zh-CN": "唱歌。",
          "en": "I sing a song.",
          "ko": "노래를 불러요.",
          "es": "Canto una canción."
        },
        "sentenceDisplay": "うた を うたいます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_e",
    "type": "hiragana",
    "kana": "え",
    "romaji": "e",
    "row": "あ行",
    "col": "え段",
    "examples": [
      {
        "word": "えき",
        "romaji": "eki",
        "meaning": {
          "zh-TW": "車站",
          "zh-CN": "车站",
          "en": "station",
          "ko": "역",
          "es": "estación (de tren)"
        },
        "sentence": "えきはどこですか。",
        "sentenceMeaning": {
          "zh-TW": "請問車站在哪裡？",
          "zh-CN": "请问车站在哪里？",
          "en": "Where is the station?",
          "ko": "역은 어디예요?",
          "es": "¿Dónde está la estación?"
        },
        "sentenceDisplay": "えき は どこ です か。"
      },
      {
        "word": "えんぴつ",
        "romaji": "empitsu",
        "meaning": {
          "zh-TW": "鉛筆",
          "zh-CN": "铅笔",
          "en": "pencil",
          "ko": "연필",
          "es": "lápiz"
        },
        "sentence": "えんぴつでかきます。",
        "sentenceMeaning": {
          "zh-TW": "用鉛筆寫。",
          "zh-CN": "用铅笔写。",
          "en": "I write with a pencil.",
          "ko": "연필로 써요.",
          "es": "Escribo con un lápiz."
        },
        "sentenceDisplay": "えんぴつ で かきます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_o",
    "type": "hiragana",
    "kana": "お",
    "romaji": "o",
    "row": "あ行",
    "col": "お段",
    "examples": [
      {
        "word": "おんがく",
        "romaji": "ongaku",
        "meaning": {
          "zh-TW": "音樂",
          "zh-CN": "音乐",
          "en": "music",
          "ko": "음악",
          "es": "música"
        },
        "sentence": "おんがくをききます。",
        "sentenceMeaning": {
          "zh-TW": "聽音樂。",
          "zh-CN": "听音乐。",
          "en": "I listen to music.",
          "ko": "음악을 들어요.",
          "es": "Escucho música."
        },
        "sentenceDisplay": "おんがく を ききます。"
      },
      {
        "word": "おちゃ",
        "romaji": "ocha",
        "meaning": {
          "zh-TW": "茶",
          "zh-CN": "茶",
          "en": "tea",
          "ko": "차",
          "es": "té"
        },
        "sentence": "おちゃをのみます。",
        "sentenceMeaning": {
          "zh-TW": "喝茶。",
          "zh-CN": "喝茶。",
          "en": "I drink tea.",
          "ko": "차를 마셔요.",
          "es": "Tomo té."
        },
        "sentenceDisplay": "おちゃ を のみます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ka",
    "type": "hiragana",
    "kana": "か",
    "romaji": "ka",
    "row": "か行",
    "col": "あ段",
    "examples": [
      {
        "word": "かさ",
        "romaji": "kasa",
        "meaning": {
          "zh-TW": "傘",
          "zh-CN": "伞",
          "en": "umbrella",
          "ko": "우산",
          "es": "paraguas"
        },
        "sentence": "かさをさします。",
        "sentenceMeaning": {
          "zh-TW": "撐傘。",
          "zh-CN": "撑伞。",
          "en": "I put up my umbrella.",
          "ko": "우산을 써요.",
          "es": "Abro el paraguas."
        },
        "sentenceDisplay": "かさ を さします。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ki",
    "type": "hiragana",
    "kana": "き",
    "romaji": "ki",
    "row": "か行",
    "col": "い段",
    "examples": [
      {
        "word": "きのう",
        "romaji": "kinou",
        "meaning": {
          "zh-TW": "昨天",
          "zh-CN": "昨天",
          "en": "yesterday",
          "ko": "어제",
          "es": "ayer"
        },
        "sentence": "きのうははれでした。",
        "sentenceMeaning": {
          "zh-TW": "昨天是晴天。",
          "zh-CN": "昨天是晴天。",
          "en": "Yesterday was sunny.",
          "ko": "어제는 맑았어요.",
          "es": "Ayer hizo buen tiempo."
        },
        "sentenceDisplay": "きのう は はれ でした。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ku",
    "type": "hiragana",
    "kana": "く",
    "romaji": "ku",
    "row": "か行",
    "col": "う段",
    "examples": [
      {
        "word": "くるま",
        "romaji": "kuruma",
        "meaning": {
          "zh-TW": "車子",
          "zh-CN": "汽车",
          "en": "car",
          "ko": "자동차",
          "es": "coche, auto"
        },
        "sentence": "あかいくるまです。",
        "sentenceMeaning": {
          "zh-TW": "是紅色的車子。",
          "zh-CN": "是红色的汽车。",
          "en": "It's a red car.",
          "ko": "빨간 자동차예요.",
          "es": "Es un coche rojo."
        },
        "sentenceDisplay": "あかい くるま です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ke",
    "type": "hiragana",
    "kana": "け",
    "romaji": "ke",
    "row": "か行",
    "col": "え段",
    "examples": [
      {
        "word": "けいさつ",
        "romaji": "keisatsu",
        "meaning": {
          "zh-TW": "警察",
          "zh-CN": "警察",
          "en": "police",
          "ko": "경찰",
          "es": "policía"
        },
        "sentence": "けいさつにでんわします。",
        "sentenceMeaning": {
          "zh-TW": "給警察打電話。",
          "zh-CN": "给警察打电话。",
          "en": "I call the police.",
          "ko": "경찰에 전화해요.",
          "es": "Llamo a la policía."
        },
        "sentenceDisplay": "けいさつ に でんわ します。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ko",
    "type": "hiragana",
    "kana": "こ",
    "romaji": "ko",
    "row": "か行",
    "col": "お段",
    "examples": [
      {
        "word": "こども",
        "romaji": "kodomo",
        "meaning": {
          "zh-TW": "小孩",
          "zh-CN": "小孩",
          "en": "child",
          "ko": "아이",
          "es": "niño, niños"
        },
        "sentence": "こどもがあそんでいます。",
        "sentenceMeaning": {
          "zh-TW": "小孩在玩耍。",
          "zh-CN": "小孩在玩耍。",
          "en": "The children are playing.",
          "ko": "아이가 놀고 있어요.",
          "es": "Los niños están jugando."
        },
        "sentenceDisplay": "こども が あそんで います。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_sa",
    "type": "hiragana",
    "kana": "さ",
    "romaji": "sa",
    "row": "さ行",
    "col": "あ段",
    "examples": [
      {
        "word": "さくら",
        "romaji": "sakura",
        "meaning": {
          "zh-TW": "櫻花",
          "zh-CN": "樱花",
          "en": "cherry blossom",
          "ko": "벚꽃",
          "es": "flor de cerezo"
        },
        "sentence": "さくらがさきました。",
        "sentenceMeaning": {
          "zh-TW": "櫻花開了。",
          "zh-CN": "樱花开了。",
          "en": "The cherry blossoms have bloomed.",
          "ko": "벚꽃이 피었어요.",
          "es": "Florecieron los cerezos."
        },
        "sentenceDisplay": "さくら が さきました。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_shi",
    "type": "hiragana",
    "kana": "し",
    "romaji": "shi",
    "row": "さ行",
    "col": "い段",
    "examples": [
      {
        "word": "しんぶん",
        "romaji": "shimbun",
        "meaning": {
          "zh-TW": "報紙",
          "zh-CN": "报纸",
          "en": "newspaper",
          "ko": "신문",
          "es": "periódico"
        },
        "sentence": "しんぶんをよみます。",
        "sentenceMeaning": {
          "zh-TW": "讀報紙。",
          "zh-CN": "读报纸。",
          "en": "I read the newspaper.",
          "ko": "신문을 읽어요.",
          "es": "Leo el periódico."
        },
        "sentenceDisplay": "しんぶん を よみます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_su",
    "type": "hiragana",
    "kana": "す",
    "romaji": "su",
    "row": "さ行",
    "col": "う段",
    "examples": [
      {
        "word": "すし",
        "romaji": "sushi",
        "meaning": {
          "zh-TW": "壽司",
          "zh-CN": "寿司",
          "en": "sushi",
          "ko": "초밥",
          "es": "sushi"
        },
        "sentence": "すしをたべます。",
        "sentenceMeaning": {
          "zh-TW": "吃壽司。",
          "zh-CN": "吃寿司。",
          "en": "I eat sushi.",
          "ko": "초밥을 먹어요.",
          "es": "Como sushi."
        },
        "sentenceDisplay": "すし を たべます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_se",
    "type": "hiragana",
    "kana": "せ",
    "romaji": "se",
    "row": "さ行",
    "col": "え段",
    "examples": [
      {
        "word": "せんせい",
        "romaji": "sensei",
        "meaning": {
          "zh-TW": "老師",
          "zh-CN": "老师",
          "en": "teacher",
          "ko": "선생님",
          "es": "profesor, profesora"
        },
        "sentence": "やさしいせんせいです。",
        "sentenceMeaning": {
          "zh-TW": "是親切的老師。",
          "zh-CN": "是亲切的老师。",
          "en": "They're a kind teacher.",
          "ko": "친절한 선생님이에요.",
          "es": "Es una profesora amable."
        },
        "sentenceDisplay": "やさしい せんせい です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_so",
    "type": "hiragana",
    "kana": "そ",
    "romaji": "so",
    "row": "さ行",
    "col": "お段",
    "examples": [
      {
        "word": "そら",
        "romaji": "sora",
        "meaning": {
          "zh-TW": "天空",
          "zh-CN": "天空",
          "en": "sky",
          "ko": "하늘",
          "es": "cielo"
        },
        "sentence": "そらがあおいです。",
        "sentenceMeaning": {
          "zh-TW": "天空很藍。",
          "zh-CN": "天空很蓝。",
          "en": "The sky is blue.",
          "ko": "하늘이 파래요.",
          "es": "El cielo está azul."
        },
        "sentenceDisplay": "そら が あおい です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ta",
    "type": "hiragana",
    "kana": "た",
    "romaji": "ta",
    "row": "た行",
    "col": "あ段",
    "examples": [
      {
        "word": "たまご",
        "romaji": "tamago",
        "meaning": {
          "zh-TW": "雞蛋",
          "zh-CN": "鸡蛋",
          "en": "egg",
          "ko": "달걀",
          "es": "huevo"
        },
        "sentence": "たまごをたべます。",
        "sentenceMeaning": {
          "zh-TW": "吃雞蛋。",
          "zh-CN": "吃鸡蛋。",
          "en": "I eat an egg.",
          "ko": "달걀을 먹어요.",
          "es": "Como huevos."
        },
        "sentenceDisplay": "たまご を たべます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_chi",
    "type": "hiragana",
    "kana": "ち",
    "romaji": "chi",
    "row": "た行",
    "col": "い段",
    "examples": [
      {
        "word": "ちず",
        "romaji": "chizu",
        "meaning": {
          "zh-TW": "地圖",
          "zh-CN": "地图",
          "en": "map",
          "ko": "지도",
          "es": "mapa"
        },
        "sentence": "ちずをみます。",
        "sentenceMeaning": {
          "zh-TW": "看地圖。",
          "zh-CN": "看地图。",
          "en": "I look at the map.",
          "ko": "지도를 봐요.",
          "es": "Miro el mapa."
        },
        "sentenceDisplay": "ちず を みます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_tsu",
    "type": "hiragana",
    "kana": "つ",
    "romaji": "tsu",
    "row": "た行",
    "col": "う段",
    "examples": [
      {
        "word": "つくえ",
        "romaji": "tsukue",
        "meaning": {
          "zh-TW": "桌子",
          "zh-CN": "桌子",
          "en": "desk",
          "ko": "책상",
          "es": "escritorio, mesa"
        },
        "sentence": "つくえのうえです。",
        "sentenceMeaning": {
          "zh-TW": "在桌子上。",
          "zh-CN": "在桌子上。",
          "en": "It's on the desk.",
          "ko": "책상 위예요.",
          "es": "Está sobre el escritorio."
        },
        "sentenceDisplay": "つくえ の うえ です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_te",
    "type": "hiragana",
    "kana": "て",
    "romaji": "te",
    "row": "た行",
    "col": "え段",
    "examples": [
      {
        "word": "てがみ",
        "romaji": "tegami",
        "meaning": {
          "zh-TW": "信件",
          "zh-CN": "信",
          "en": "letter",
          "ko": "편지",
          "es": "carta"
        },
        "sentence": "てがみをかきます。",
        "sentenceMeaning": {
          "zh-TW": "寫信。",
          "zh-CN": "写信。",
          "en": "I write a letter.",
          "ko": "편지를 써요.",
          "es": "Escribo una carta."
        },
        "sentenceDisplay": "てがみ を かきます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_to",
    "type": "hiragana",
    "kana": "と",
    "romaji": "to",
    "row": "た行",
    "col": "お段",
    "examples": [
      {
        "word": "とけい",
        "romaji": "tokei",
        "meaning": {
          "zh-TW": "時鐘",
          "zh-CN": "钟表",
          "en": "clock, watch",
          "ko": "시계",
          "es": "reloj"
        },
        "sentence": "とけいをみます。",
        "sentenceMeaning": {
          "zh-TW": "看時鐘。",
          "zh-CN": "看钟表。",
          "en": "I look at the clock.",
          "ko": "시계를 봐요.",
          "es": "Miro el reloj."
        },
        "sentenceDisplay": "とけい を みます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_na",
    "type": "hiragana",
    "kana": "な",
    "romaji": "na",
    "row": "な行",
    "col": "あ段",
    "examples": [
      {
        "word": "なつ",
        "romaji": "natsu",
        "meaning": {
          "zh-TW": "夏天",
          "zh-CN": "夏天",
          "en": "summer",
          "ko": "여름",
          "es": "verano"
        },
        "sentence": "あついなつです。",
        "sentenceMeaning": {
          "zh-TW": "炎熱的夏天。",
          "zh-CN": "炎热的夏天。",
          "en": "It's a hot summer.",
          "ko": "더운 여름이에요.",
          "es": "Es un verano caluroso."
        },
        "sentenceDisplay": "あつい なつ です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ni",
    "type": "hiragana",
    "kana": "に",
    "romaji": "ni",
    "row": "な行",
    "col": "い段",
    "examples": [
      {
        "word": "にく",
        "romaji": "niku",
        "meaning": {
          "zh-TW": "肉",
          "zh-CN": "肉",
          "en": "meat",
          "ko": "고기",
          "es": "carne"
        },
        "sentence": "にくをたべます。",
        "sentenceMeaning": {
          "zh-TW": "吃肉。",
          "zh-CN": "吃肉。",
          "en": "I eat meat.",
          "ko": "고기를 먹어요.",
          "es": "Como carne."
        },
        "sentenceDisplay": "にく を たべます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_nu",
    "type": "hiragana",
    "kana": "ぬ",
    "romaji": "nu",
    "row": "な行",
    "col": "う段",
    "examples": [
      {
        "word": "いぬ",
        "romaji": "inu",
        "meaning": {
          "zh-TW": "狗",
          "zh-CN": "狗",
          "en": "dog",
          "ko": "개",
          "es": "perro"
        },
        "sentence": "いぬがいます。",
        "sentenceMeaning": {
          "zh-TW": "有狗。",
          "zh-CN": "有狗。",
          "en": "There is a dog.",
          "ko": "개가 있어요.",
          "es": "Hay un perro."
        },
        "sentenceDisplay": "いぬ が います。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ne",
    "type": "hiragana",
    "kana": "ね",
    "romaji": "ne",
    "row": "な行",
    "col": "え段",
    "examples": [
      {
        "word": "ねこ",
        "romaji": "neko",
        "meaning": {
          "zh-TW": "貓",
          "zh-CN": "猫",
          "en": "cat",
          "ko": "고양이",
          "es": "gato"
        },
        "sentence": "ねこがすきです。",
        "sentenceMeaning": {
          "zh-TW": "我喜歡貓。",
          "zh-CN": "我喜欢猫。",
          "en": "I like cats.",
          "ko": "고양이를 좋아해요.",
          "es": "Me gustan los gatos."
        },
        "sentenceDisplay": "ねこ が すき です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_no",
    "type": "hiragana",
    "kana": "の",
    "romaji": "no",
    "row": "な行",
    "col": "お段",
    "examples": [
      {
        "word": "のみもの",
        "romaji": "nomimono",
        "meaning": {
          "zh-TW": "飲料",
          "zh-CN": "饮料",
          "en": "drink, beverage",
          "ko": "음료",
          "es": "bebida"
        },
        "sentence": "つめたいのみものです。",
        "sentenceMeaning": {
          "zh-TW": "是冷飲。",
          "zh-CN": "是冷饮。",
          "en": "It's a cold drink.",
          "ko": "시원한 음료예요.",
          "es": "Es una bebida fría."
        },
        "sentenceDisplay": "つめたい のみもの です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ha",
    "type": "hiragana",
    "kana": "は",
    "romaji": "ha",
    "row": "は行",
    "col": "あ段",
    "examples": [
      {
        "word": "はな",
        "romaji": "hana",
        "meaning": {
          "zh-TW": "花 / 鼻子",
          "zh-CN": "花 / 鼻子",
          "en": "flower / nose",
          "ko": "꽃 / 코",
          "es": "flor / nariz"
        },
        "sentence": "きれいなはなです。",
        "sentenceMeaning": {
          "zh-TW": "是美麗的花。",
          "zh-CN": "是美丽的花。",
          "en": "It's a beautiful flower.",
          "ko": "예쁜 꽃이에요.",
          "es": "Es una flor bonita."
        },
        "sentenceDisplay": "きれいな はな です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_hi",
    "type": "hiragana",
    "kana": "ひ",
    "romaji": "hi",
    "row": "は行",
    "col": "い段",
    "examples": [
      {
        "word": "ひかり",
        "romaji": "hikari",
        "meaning": {
          "zh-TW": "光",
          "zh-CN": "光",
          "en": "light",
          "ko": "빛",
          "es": "luz"
        },
        "sentence": "ひかりがさしこみます。",
        "sentenceMeaning": {
          "zh-TW": "陽光照進來。",
          "zh-CN": "阳光照进来。",
          "en": "Light streams in.",
          "ko": "빛이 들어와요.",
          "es": "Entra la luz."
        },
        "sentenceDisplay": "ひかり が さしこみます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_fu",
    "type": "hiragana",
    "kana": "ふ",
    "romaji": "fu",
    "row": "は行",
    "col": "う段",
    "examples": [
      {
        "word": "ふね",
        "romaji": "fune",
        "meaning": {
          "zh-TW": "船",
          "zh-CN": "船",
          "en": "boat, ship",
          "ko": "배",
          "es": "barco"
        },
        "sentence": "ふねにのります。",
        "sentenceMeaning": {
          "zh-TW": "搭船。",
          "zh-CN": "坐船。",
          "en": "I get on the boat.",
          "ko": "배를 타요.",
          "es": "Subo al barco."
        },
        "sentenceDisplay": "ふね に のります。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_he",
    "type": "hiragana",
    "kana": "へ",
    "romaji": "he",
    "row": "は行",
    "col": "え段",
    "examples": [
      {
        "word": "へや",
        "romaji": "heya",
        "meaning": {
          "zh-TW": "房間",
          "zh-CN": "房间",
          "en": "room",
          "ko": "방",
          "es": "habitación"
        },
        "sentence": "ひろいへやです。",
        "sentenceMeaning": {
          "zh-TW": "是寬敞的房間。",
          "zh-CN": "是宽敞的房间。",
          "en": "It's a spacious room.",
          "ko": "넓은 방이에요.",
          "es": "Es una habitación amplia."
        },
        "sentenceDisplay": "ひろい へや です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ho",
    "type": "hiragana",
    "kana": "ほ",
    "romaji": "ho",
    "row": "は行",
    "col": "お段",
    "examples": [
      {
        "word": "ほん",
        "romaji": "hon",
        "meaning": {
          "zh-TW": "書本",
          "zh-CN": "书本",
          "en": "book",
          "ko": "책",
          "es": "libro"
        },
        "sentence": "ほんをよみます。",
        "sentenceMeaning": {
          "zh-TW": "讀書。",
          "zh-CN": "读书。",
          "en": "I read a book.",
          "ko": "책을 읽어요.",
          "es": "Leo un libro."
        },
        "sentenceDisplay": "ほん を よみます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ma",
    "type": "hiragana",
    "kana": "ま",
    "romaji": "ma",
    "row": "ま行",
    "col": "あ段",
    "examples": [
      {
        "word": "まち",
        "romaji": "machi",
        "meaning": {
          "zh-TW": "城鎮",
          "zh-CN": "城镇",
          "en": "town",
          "ko": "마을, 동네",
          "es": "ciudad, pueblo"
        },
        "sentence": "しずかなまちです。",
        "sentenceMeaning": {
          "zh-TW": "是安靜的城鎮。",
          "zh-CN": "是安静的城镇。",
          "en": "It's a quiet town.",
          "ko": "조용한 동네예요.",
          "es": "Es un pueblo tranquilo."
        },
        "sentenceDisplay": "しずかな まち です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_mi",
    "type": "hiragana",
    "kana": "み",
    "romaji": "mi",
    "row": "ま行",
    "col": "い段",
    "examples": [
      {
        "word": "みず",
        "romaji": "mizu",
        "meaning": {
          "zh-TW": "水",
          "zh-CN": "水",
          "en": "water",
          "ko": "물",
          "es": "agua"
        },
        "sentence": "みずをのみます。",
        "sentenceMeaning": {
          "zh-TW": "喝水。",
          "zh-CN": "喝水。",
          "en": "I drink water.",
          "ko": "물을 마셔요.",
          "es": "Bebo agua."
        },
        "sentenceDisplay": "みず を のみます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_mu",
    "type": "hiragana",
    "kana": "む",
    "romaji": "mu",
    "row": "ま行",
    "col": "う段",
    "examples": [
      {
        "word": "むし",
        "romaji": "mushi",
        "meaning": {
          "zh-TW": "昆蟲",
          "zh-CN": "昆虫",
          "en": "insect, bug",
          "ko": "벌레",
          "es": "insecto"
        },
        "sentence": "むしがいます。",
        "sentenceMeaning": {
          "zh-TW": "有昆蟲。",
          "zh-CN": "有昆虫。",
          "en": "There's a bug.",
          "ko": "벌레가 있어요.",
          "es": "Hay un insecto."
        },
        "sentenceDisplay": "むし が います。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_me",
    "type": "hiragana",
    "kana": "め",
    "romaji": "me",
    "row": "ま行",
    "col": "え段",
    "examples": [
      {
        "word": "め",
        "romaji": "me",
        "meaning": {
          "zh-TW": "眼睛",
          "zh-CN": "眼睛",
          "en": "eye",
          "ko": "눈",
          "es": "ojo"
        },
        "sentence": "めをとじます。",
        "sentenceMeaning": {
          "zh-TW": "閉上眼睛。",
          "zh-CN": "闭上眼睛。",
          "en": "I close my eyes.",
          "ko": "눈을 감아요.",
          "es": "Cierro los ojos."
        },
        "sentenceDisplay": "め を とじます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_mo",
    "type": "hiragana",
    "kana": "も",
    "romaji": "mo",
    "row": "ま行",
    "col": "お段",
    "examples": [
      {
        "word": "もり",
        "romaji": "mori",
        "meaning": {
          "zh-TW": "森林",
          "zh-CN": "森林",
          "en": "forest",
          "ko": "숲",
          "es": "bosque"
        },
        "sentence": "ふかいもりです。",
        "sentenceMeaning": {
          "zh-TW": "是深邃的森林。",
          "zh-CN": "是深邃的森林。",
          "en": "It's a deep forest.",
          "ko": "깊은 숲이에요.",
          "es": "Es un bosque profundo."
        },
        "sentenceDisplay": "ふかい もり です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ya",
    "type": "hiragana",
    "kana": "や",
    "romaji": "ya",
    "row": "や行",
    "col": "あ段",
    "examples": [
      {
        "word": "やま",
        "romaji": "yama",
        "meaning": {
          "zh-TW": "山",
          "zh-CN": "山",
          "en": "mountain",
          "ko": "산",
          "es": "montaña"
        },
        "sentence": "たかいやまです。",
        "sentenceMeaning": {
          "zh-TW": "是高山。",
          "zh-CN": "是高山。",
          "en": "It's a high mountain.",
          "ko": "높은 산이에요.",
          "es": "Es una montaña alta."
        },
        "sentenceDisplay": "たかい やま です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_yu",
    "type": "hiragana",
    "kana": "ゆ",
    "romaji": "yu",
    "row": "や行",
    "col": "う段",
    "examples": [
      {
        "word": "ゆき",
        "romaji": "yuki",
        "meaning": {
          "zh-TW": "雪",
          "zh-CN": "雪",
          "en": "snow",
          "ko": "눈 (내리는 눈)",
          "es": "nieve"
        },
        "sentence": "ゆきがふります。",
        "sentenceMeaning": {
          "zh-TW": "下雪了。",
          "zh-CN": "下雪了。",
          "en": "It's snowing.",
          "ko": "눈이 와요.",
          "es": "Nieva."
        },
        "sentenceDisplay": "ゆき が ふります。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_yo",
    "type": "hiragana",
    "kana": "よ",
    "romaji": "yo",
    "row": "や行",
    "col": "お段",
    "examples": [
      {
        "word": "よる",
        "romaji": "yoru",
        "meaning": {
          "zh-TW": "夜晚",
          "zh-CN": "夜晚",
          "en": "night",
          "ko": "밤",
          "es": "noche"
        },
        "sentence": "しずかなよるです。",
        "sentenceMeaning": {
          "zh-TW": "是安靜的夜晚。",
          "zh-CN": "是安静的夜晚。",
          "en": "It's a quiet night.",
          "ko": "조용한 밤이에요.",
          "es": "Es una noche tranquila."
        },
        "sentenceDisplay": "しずかな よる です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ra",
    "type": "hiragana",
    "kana": "ら",
    "romaji": "ra",
    "row": "ら行",
    "col": "あ段",
    "examples": [
      {
        "word": "らいしゅう",
        "romaji": "raishuu",
        "meaning": {
          "zh-TW": "下週",
          "zh-CN": "下周",
          "en": "next week",
          "ko": "다음 주",
          "es": "la semana que viene"
        },
        "sentence": "らいしゅうあいます。",
        "sentenceMeaning": {
          "zh-TW": "下週見。",
          "zh-CN": "下周见。",
          "en": "We'll meet next week.",
          "ko": "다음 주에 만나요.",
          "es": "Nos vemos la semana que viene."
        },
        "sentenceDisplay": "らいしゅう あいます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ri",
    "type": "hiragana",
    "kana": "り",
    "romaji": "ri",
    "row": "ら行",
    "col": "い段",
    "examples": [
      {
        "word": "りんご",
        "romaji": "ringo",
        "meaning": {
          "zh-TW": "蘋果",
          "zh-CN": "苹果",
          "en": "apple",
          "ko": "사과",
          "es": "manzana"
        },
        "sentence": "あかいりんごです。",
        "sentenceMeaning": {
          "zh-TW": "是紅蘋果。",
          "zh-CN": "是红苹果。",
          "en": "It's a red apple.",
          "ko": "빨간 사과예요.",
          "es": "Es una manzana roja."
        },
        "sentenceDisplay": "あかい りんご です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ru",
    "type": "hiragana",
    "kana": "る",
    "romaji": "ru",
    "row": "ら行",
    "col": "う段",
    "examples": [
      {
        "word": "るす",
        "romaji": "rusu",
        "meaning": {
          "zh-TW": "不在家",
          "zh-CN": "不在家",
          "en": "being away from home",
          "ko": "부재중",
          "es": "ausencia (no estar en casa)"
        },
        "sentence": "いまはるすです。",
        "sentenceMeaning": {
          "zh-TW": "現在不在家。",
          "zh-CN": "现在不在家。",
          "en": "Nobody is home right now.",
          "ko": "지금은 집에 없어요.",
          "es": "Ahora no hay nadie en casa."
        },
        "sentenceDisplay": "いま は るす です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_re",
    "type": "hiragana",
    "kana": "れ",
    "romaji": "re",
    "row": "ら行",
    "col": "え段",
    "examples": [
      {
        "word": "れきし",
        "romaji": "rekishi",
        "meaning": {
          "zh-TW": "歷史",
          "zh-CN": "历史",
          "en": "history",
          "ko": "역사",
          "es": "historia"
        },
        "sentence": "れきしをべんきょうします。",
        "sentenceMeaning": {
          "zh-TW": "學習歷史。",
          "zh-CN": "学习历史。",
          "en": "I study history.",
          "ko": "역사를 공부해요.",
          "es": "Estudio historia."
        },
        "sentenceDisplay": "れきし を べんきょう します。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_ro",
    "type": "hiragana",
    "kana": "ろ",
    "romaji": "ro",
    "row": "ら行",
    "col": "お段",
    "examples": [
      {
        "word": "ろうそく",
        "romaji": "rousoku",
        "meaning": {
          "zh-TW": "蠟燭",
          "zh-CN": "蜡烛",
          "en": "candle",
          "ko": "양초",
          "es": "vela"
        },
        "sentence": "ろうそくをつけます。",
        "sentenceMeaning": {
          "zh-TW": "點燃蠟燭。",
          "zh-CN": "点燃蜡烛。",
          "en": "I light a candle.",
          "ko": "양초에 불을 붙여요.",
          "es": "Enciendo una vela."
        },
        "sentenceDisplay": "ろうそく を つけます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_wa",
    "type": "hiragana",
    "kana": "わ",
    "romaji": "wa",
    "row": "わ行",
    "col": "あ段",
    "examples": [
      {
        "word": "わたし",
        "romaji": "watashi",
        "meaning": {
          "zh-TW": "我",
          "zh-CN": "我",
          "en": "I, me",
          "ko": "나, 저",
          "es": "yo"
        },
        "sentence": "わたしはがくせいです。",
        "sentenceMeaning": {
          "zh-TW": "我是學生。",
          "zh-CN": "我是学生。",
          "en": "I am a student.",
          "ko": "저는 학생이에요.",
          "es": "Soy estudiante."
        },
        "sentenceDisplay": "わたし は がくせい です。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_wo",
    "type": "hiragana",
    "kana": "を",
    "romaji": "wo",
    "row": "わ行",
    "col": "お段",
    "examples": [
      {
        "word": "ほん",
        "romaji": "hon",
        "meaning": {
          "zh-TW": "書（を：把～ 助詞，接在動作對象後面）",
          "zh-CN": "书（を：把～ 助词，接在动作对象后面）",
          "en": "book (を: particle that marks the direct object of an action)",
          "ko": "책 (を: 동작의 대상 뒤에 붙는 조사, '~을/를')",
          "es": "libro (を: partícula que se coloca tras el objeto directo de la acción)"
        },
        "sentence": "ほんをよみます。",
        "sentenceMeaning": {
          "zh-TW": "讀書。",
          "zh-CN": "读书。",
          "en": "I read a book.",
          "ko": "책을 읽어요.",
          "es": "Leo un libro."
        },
        "sentenceDisplay": "ほん を よみます。"
      }
    ],
    "category": "basic-hiragana"
  },
  {
    "id": "h_n",
    "type": "hiragana",
    "kana": "ん",
    "romaji": "n",
    "row": "ん行",
    "col": "ん",
    "examples": [
      {
        "word": "にほん",
        "romaji": "nihon",
        "meaning": {
          "zh-TW": "日本",
          "zh-CN": "日本",
          "en": "Japan",
          "ko": "일본",
          "es": "Japón"
        },
        "sentence": "にほんにいきます。",
        "sentenceMeaning": {
          "zh-TW": "去日本。",
          "zh-CN": "去日本。",
          "en": "I'm going to Japan.",
          "ko": "일본에 가요.",
          "es": "Voy a Japón."
        },
        "sentenceDisplay": "にほん に いきます。"
      }
    ],
    "category": "basic-hiragana"
  }
];

export const ALL_KANA_DATA: KanaItem[] = [
  ...HIRAGANA_DATA,
  ...KATAKANA_DATA,
];

export const ALL_LEARNABLE_KANA: KanaItem[] = [
  ...HIRAGANA_DATA,
  ...KATAKANA_DATA,
  ...DAKUTEN_DATA,
  ...HANDAKUTEN_DATA,
  ...YOUON_DATA,
];
