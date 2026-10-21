import { describe, it, expect } from 'vitest';
import { ALL_VOCABULARY } from './vocabulary';
import { SHADOWING_SENTENCES, getShadowingText } from './shadowing';
import { translations, Language } from '../i18n';

const LANGUAGES = Object.keys(translations) as Language[];

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
