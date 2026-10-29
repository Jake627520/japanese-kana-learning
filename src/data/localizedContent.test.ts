import { describe, it, expect } from 'vitest';
import { ALL_VOCABULARY } from './vocabulary';
import { SHADOWING_SENTENCES, getShadowingText } from './shadowing';
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUTEN_DATA, HANDAKUTEN_DATA, YOUON_DATA } from './kanaData';
import { CONFUSABLE_GROUPS } from './confusableData';
import { ALL_N5_TOPICS_UI, ALL_N4_TOPICS_UI, ALL_N3_TOPICS_UI, getOwnJlptQuestions } from './jlpt';
import { LANGUAGES, Language, LocalizedText } from '../i18n';
import { loadJlptExplanations } from './jlpt/explanations';
import { JLPT_EXPLANATIONS } from '../test/jlptExplanations';


describe('詞彙與跟讀內容：每個語言都有非空字串', () => {
  it('涵蓋五個語言', () => {
    expect([...LANGUAGES].sort()).toEqual(['en', 'es', 'ko', 'zh-CN', 'zh-TW']);
  });

  it('每個詞彙的 meaning', () => {
    expect(ALL_VOCABULARY).toHaveLength(208);
    for (const item of ALL_VOCABULARY) {
      for (const lang of LANGUAGES) {
        const text = item.meaning[lang];
        expect(typeof text === 'string' && text.trim() !== '', `${item.id} 缺 ${lang}`).toBe(true);
      }
    }
  });

  it('每個跟讀句的 meaning、focus、tip', () => {
    expect(SHADOWING_SENTENCES).toHaveLength(18);
    for (const sentence of SHADOWING_SENTENCES) {
      for (const field of ['meaning', 'focus', 'tip'] as const) {
        const value = sentence[field];
        expect(typeof value, `${sentence.id}.${field}`).toBe('object');
        for (const lang of LANGUAGES) {
          const text = getShadowingText(value, lang);
          expect(text.trim() !== '', `${sentence.id}.${field} 缺 ${lang}`).toBe(true);
        }
      }
    }
  });
});

describe('假名例詞、易混辨析、JLPT 內容：每個語言都有非空字串', () => {
  const expectComplete = (value: LocalizedText, where: string) => {
    for (const lang of LANGUAGES) {
      const text = value[lang];
      expect(typeof text === 'string' && text.trim() !== '', `${where} 缺 ${lang}`).toBe(true);
    }
  };

  it('每個假名例詞的 meaning、sentenceMeaning', () => {
    const kana = [...HIRAGANA_DATA, ...KATAKANA_DATA, ...DAKUTEN_DATA, ...HANDAKUTEN_DATA, ...YOUON_DATA];
    const examples = kana.flatMap((k) => k.examples.map((ex, i) => ({ ex, where: `${k.id}#${i}` })));
    expect(examples).toHaveLength(213);
    for (const { ex, where } of examples) {
      expectComplete(ex.meaning, `${where}.meaning`);
      expectComplete(ex.sentenceMeaning, `${where}.sentenceMeaning`);
    }
  });

  it('每個易混組的 distinguish', () => {
    expect(CONFUSABLE_GROUPS).toHaveLength(21);
    for (const g of CONFUSABLE_GROUPS) expectComplete(g.distinguish, `${g.id}.distinguish`);
  });

  it('每個 JLPT 知識點的 name、description', () => {
    const topics = [...ALL_N5_TOPICS_UI, ...ALL_N4_TOPICS_UI, ...ALL_N3_TOPICS_UI];
    expect(topics).toHaveLength(90);
    for (const topic of topics) {
      expectComplete(topic.name, `${topic.id}.name`);
      expectComplete(topic.description, `${topic.id}.description`);
    }
  });

  it('每題 JLPT 解說在每個語言模組都有非空字串，沒有多餘的 id，HTML 標籤組成與 zh-TW 一致', () => {
    const tags = (s: string) => (s.match(/<\/?[a-z]+[^>]*>/gi) ?? []).map((t) => t.toLowerCase()).sort().join('');
    const ids = getOwnJlptQuestions().map((q) => q.id);
    expect(ids).toHaveLength(280);
    for (const lang of LANGUAGES) {
      const byId = JLPT_EXPLANATIONS[lang];
      expect(Object.keys(byId).sort(), `${lang} 的題目 id 與題庫不同`).toEqual([...ids].sort());
      for (const id of ids) {
        expect(byId[id].trim(), `${id} 缺 ${lang} 解說`).not.toBe('');
        expect(tags(byId[id]), `${id} ${lang} 的標籤和 zh-TW 不同`).toBe(tags(JLPT_EXPLANATIONS['zh-TW'][id]));
      }
    }
  });

  it.each(LANGUAGES)('loadJlptExplanations(%s) 載入該語言的解說模組', async (lang) => {
    expect(await loadJlptExplanations(lang)).toBe(JLPT_EXPLANATIONS[lang]);
  });
});

describe('getShadowingText：缺語言時退回英文', () => {
  const partial = { 'zh-TW': '你好', en: 'hello' } as Record<Language, string>;

  it('缺 ko 時顯示英文', () => {
    expect(getShadowingText(partial, 'ko')).toBe('hello');
  });

  it('純字串原樣回傳，undefined 回傳空字串', () => {
    expect(getShadowingText('plain', 'es')).toBe('plain');
    expect(getShadowingText(undefined, 'es')).toBe('');
  });
});
