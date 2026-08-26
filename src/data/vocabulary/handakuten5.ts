import { VocabularyItem } from './vocabularyTypes';

export const HANDAKUTEN_5_VOCABULARY: VocabularyItem[] = [
  {
    id: 'vocab_pan',
    word: 'ぱん',
    romaji: 'pan',
    primaryKanaId: 'hp_pa',
    kanaLinks: ['hp_pa', 'h_n'],
    type: 'noun',
    meaning: {
      'zh-TW': '麵包',
      'zh-CN': '面包',
      'en': 'bread',
    },
    audioKey: 'vocab_pan',
    tag: 'handakuten5',
  },
  {
    id: 'vocab_enpitsu',
    word: 'えんぴつ',
    kanji: '鉛筆',
    romaji: 'enpitsu',
    primaryKanaId: 'hp_pi',
    // 閱讀順序: え (h_e) -> ん (h_n) -> ぴ (hp_pi) -> つ (h_tsu)
    kanaLinks: ['h_e', 'h_n', 'hp_pi', 'h_tsu'],
    type: 'noun',
    meaning: {
      'zh-TW': '鉛筆',
      'zh-CN': '铅笔',
      'en': 'pencil',
    },
    audioKey: 'vocab_enpitsu',
    tag: 'handakuten5',
  },
  {
    id: 'vocab_tempura',
    word: 'てんぷら',
    kanji: '天ぷら',
    romaji: 'tempura',
    primaryKanaId: 'hp_pu',
    // 閱讀順序: て (h_te) -> ん (h_n) -> ぷ (hp_pu) -> ら (h_ra)
    kanaLinks: ['h_te', 'h_n', 'hp_pu', 'h_ra'],
    type: 'noun',
    meaning: {
      'zh-TW': '天婦羅',
      'zh-CN': '天妇罗',
      'en': 'tempura',
    },
    audioKey: 'vocab_tempura',
    tag: 'handakuten5',
  },
  {
    id: 'vocab_pen',
    word: 'ぺん',
    romaji: 'pen',
    primaryKanaId: 'hp_pe',
    kanaLinks: ['hp_pe', 'h_n'],
    type: 'noun',
    meaning: {
      'zh-TW': '筆',
      'zh-CN': '笔',
      'en': 'pen',
    },
    audioKey: 'vocab_pen',
    tag: 'handakuten5',
  },
  {
    id: 'vocab_sanpo',
    word: 'さんぽ',
    kanji: '散歩',
    romaji: 'sanpo',
    primaryKanaId: 'hp_po',
    // 閱讀順序: さ (h_sa) -> ん (h_n) -> ぽ (hp_po)
    kanaLinks: ['h_sa', 'h_n', 'hp_po'],
    type: 'noun',
    meaning: {
      'zh-TW': '散步',
      'zh-CN': '散步',
      'en': 'walk / stroll',
    },
    audioKey: 'vocab_sanpo',
    tag: 'handakuten5',
  },
];
