import { describe, it, expect } from 'vitest';
import { HIRAGANA_STROKES } from './strokeData';
import { HIRAGANA_DATA } from './kanaData';
import { LANGUAGES, LocalizedText } from '../i18n';

const circled = (text: string) => text.match(/[①-⑳]/g) ?? [];
const kana = (text: string) => [...new Set(text.match(/[ぁ-ゟ]/g))].sort();

const fields = Object.entries(HIRAGANA_STROKES).flatMap(([id, guide]) => [
  ...guide.steps.map((step, i) => ({ where: `${id}.steps[${i}]`, value: step })),
  ...(guide.note ? [{ where: `${id}.note`, value: guide.note }] : []),
]) as { where: string; value: LocalizedText }[];

describe('平假名筆順說明：五種語言', () => {
  it('每個平假名都有筆順說明', () => {
    for (const k of HIRAGANA_DATA) {
      expect(HIRAGANA_STROKES[k.id], k.id).toBeDefined();
    }
    expect(fields).toHaveLength(137);
  });

  it('每個欄位在每個語言都非空', () => {
    for (const { where, value } of fields) {
      for (const lang of LANGUAGES) {
        const text = value[lang];
        expect(typeof text === 'string' && text.trim() !== '', `${where} 缺 ${lang}`).toBe(true);
      }
    }
  });

  it('每個語言的圈號與假名都和 zh-TW 一致', () => {
    for (const { where, value } of fields) {
      for (const lang of LANGUAGES) {
        expect(circled(value[lang]), `${where} ${lang} 圈號`).toEqual(circled(value['zh-TW']));
        expect(kana(value[lang]), `${where} ${lang} 假名`).toEqual(kana(value['zh-TW']));
      }
    }
  });

  it('每個條目的圈號總數和 zh-TW 一致，且等於步驟數', () => {
    for (const [id, guide] of Object.entries(HIRAGANA_STROKES)) {
      for (const lang of LANGUAGES) {
        const count = guide.steps.flatMap((s) => circled(s[lang])).length;
        expect(count, `${id} ${lang}`).toBe(guide.steps.flatMap((s) => circled(s['zh-TW'])).length);
        expect(count, `${id} ${lang}`).toBe(guide.steps.length);
      }
    }
  });
});
