import { KanaItem } from '../types';
import { KATAKANA_DATA } from './katakanaData';
import { DAKUTEN_DATA } from './dakutenData';
import { HANDAKUTEN_DATA } from './handakutenData';
export { KATAKANA_DATA } from './katakanaData';
export { DAKUTEN_DATA } from './dakutenData';
export { HANDAKUTEN_DATA } from './handakutenData';

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
        "meaning": "早晨",
        "sentence": "あさです。",
        "sentenceMeaning": "是早晨。",
        "sentenceDisplay": "あさ です。"
      },
      {
        "word": "あめ",
        "romaji": "ame",
        "meaning": "下雨 / 糖果",
        "sentence": "あめがふります。",
        "sentenceMeaning": "下雨了。",
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
        "meaning": "狗",
        "sentence": "かわいいいぬです。",
        "sentenceMeaning": "是可愛的狗。",
        "sentenceDisplay": "かわいい いぬ です。"
      },
      {
        "word": "いえ",
        "romaji": "ie",
        "meaning": "家",
        "sentence": "いえにかえります。",
        "sentenceMeaning": "回家。",
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
        "meaning": "大海",
        "sentence": "うみがきれいですね。",
        "sentenceMeaning": "大海真漂亮呢。",
        "sentenceDisplay": "うみ が きれい です ね。"
      },
      {
        "word": "うた",
        "romaji": "uta",
        "meaning": "歌曲",
        "sentence": "うたをうたいます。",
        "sentenceMeaning": "唱歌。",
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
        "meaning": "車站",
        "sentence": "えきはどこですか。",
        "sentenceMeaning": "請問車站在哪裡？",
        "sentenceDisplay": "えき は どこ です か。"
      },
      {
        "word": "えんぴつ",
        "romaji": "empitsu",
        "meaning": "鉛筆",
        "sentence": "えんぴつでかきます。",
        "sentenceMeaning": "用鉛筆寫。",
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
        "meaning": "音樂",
        "sentence": "おんがくをききます。",
        "sentenceMeaning": "聽音樂。",
        "sentenceDisplay": "おんがく を ききます。"
      },
      {
        "word": "おちゃ",
        "romaji": "ocha",
        "meaning": "茶",
        "sentence": "おちゃをのみます。",
        "sentenceMeaning": "喝茶。",
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
        "meaning": "傘",
        "sentence": "かさをさします。",
        "sentenceMeaning": "撐傘。",
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
        "meaning": "昨天",
        "sentence": "きのうははれでした。",
        "sentenceMeaning": "昨天是晴天。",
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
        "meaning": "車子",
        "sentence": "あかいくるまです。",
        "sentenceMeaning": "是紅色的車子。",
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
        "meaning": "警察",
        "sentence": "けいさつにでんわします。",
        "sentenceMeaning": "給警察打電話。",
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
        "meaning": "小孩",
        "sentence": "こどもがあそんでいます。",
        "sentenceMeaning": "小孩在玩耍。",
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
        "meaning": "櫻花",
        "sentence": "さくらがさきました。",
        "sentenceMeaning": "櫻花開了。",
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
        "meaning": "報紙",
        "sentence": "しんぶんをよみます。",
        "sentenceMeaning": "讀報紙。",
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
        "meaning": "壽司",
        "sentence": "すしをたべます。",
        "sentenceMeaning": "吃壽司。",
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
        "meaning": "老師",
        "sentence": "やさしいせんせいです。",
        "sentenceMeaning": "是親切的老師。",
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
        "meaning": "天空",
        "sentence": "そらがあおいです。",
        "sentenceMeaning": "天空很藍。",
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
        "meaning": "雞蛋",
        "sentence": "たまごをたべます。",
        "sentenceMeaning": "吃雞蛋。",
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
        "meaning": "地圖",
        "sentence": "ちずをみます。",
        "sentenceMeaning": "看地圖。",
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
        "meaning": "桌子",
        "sentence": "つくえのうえです。",
        "sentenceMeaning": "在桌子上。",
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
        "meaning": "信件",
        "sentence": "てがみをかきます。",
        "sentenceMeaning": "寫信。",
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
        "meaning": "時鐘",
        "sentence": "とけいをみます。",
        "sentenceMeaning": "看時鐘。",
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
        "meaning": "夏天",
        "sentence": "あついなつです。",
        "sentenceMeaning": "炎熱的夏天。",
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
        "meaning": "肉",
        "sentence": "にくをたべます。",
        "sentenceMeaning": "吃肉。",
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
        "meaning": "狗",
        "sentence": "いぬがいます。",
        "sentenceMeaning": "有狗。",
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
        "meaning": "貓",
        "sentence": "ねこがすきです。",
        "sentenceMeaning": "我喜歡貓。",
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
        "meaning": "飲料",
        "sentence": "つめたいのみものです。",
        "sentenceMeaning": "是冷飲。",
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
        "meaning": "花 / 鼻子",
        "sentence": "きれいなはなです。",
        "sentenceMeaning": "是美麗的花。",
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
        "meaning": "光",
        "sentence": "ひかりがさしこみます。",
        "sentenceMeaning": "陽光照進來。",
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
        "meaning": "船",
        "sentence": "ふねにのります。",
        "sentenceMeaning": "搭船。",
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
        "meaning": "房間",
        "sentence": "ひろいへやです。",
        "sentenceMeaning": "是寬敞的房間。",
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
        "meaning": "書本",
        "sentence": "ほんをよみます。",
        "sentenceMeaning": "讀書。",
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
        "meaning": "城鎮",
        "sentence": "しずかなまちです。",
        "sentenceMeaning": "是安靜的城鎮。",
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
        "meaning": "水",
        "sentence": "みずをのみます。",
        "sentenceMeaning": "喝水。",
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
        "meaning": "昆蟲",
        "sentence": "むしがいます。",
        "sentenceMeaning": "有昆蟲。",
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
        "meaning": "眼睛",
        "sentence": "めをとじます。",
        "sentenceMeaning": "閉上眼睛。",
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
        "meaning": "森林",
        "sentence": "ふかいもりです。",
        "sentenceMeaning": "是深邃的森林。",
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
        "meaning": "山",
        "sentence": "たかいやまです。",
        "sentenceMeaning": "是高山。",
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
        "meaning": "雪",
        "sentence": "ゆきがふります。",
        "sentenceMeaning": "下雪了。",
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
        "meaning": "夜晚",
        "sentence": "しずかなよるです。",
        "sentenceMeaning": "是安靜的夜晚。",
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
        "meaning": "下週",
        "sentence": "らいしゅうあいます。",
        "sentenceMeaning": "下週見。",
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
        "meaning": "蘋果",
        "sentence": "あかいりんごです。",
        "sentenceMeaning": "是紅蘋果。",
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
        "meaning": "不在家",
        "sentence": "いまはるすです。",
        "sentenceMeaning": "現在不在家。",
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
        "meaning": "歷史",
        "sentence": "れきしをべんきょうします。",
        "sentenceMeaning": "學習歷史。",
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
        "meaning": "蠟燭",
        "sentence": "ろうそくをつけます。",
        "sentenceMeaning": "點燃蠟燭。",
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
        "meaning": "我",
        "sentence": "わたしはがくせいです。",
        "sentenceMeaning": "我是學生。",
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
        "meaning": "書（を：把～ 助詞，接在動作對象後面）",
        "sentence": "ほんをよみます。",
        "sentenceMeaning": "讀書。",
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
        "meaning": "日本",
        "sentence": "にほんにいきます。",
        "sentenceMeaning": "去日本。",
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
];
