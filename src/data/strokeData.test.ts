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

describe('筆順說明與 KanjiVG 一致', () => {
  const step = (id: string, i: number) => HIRAGANA_STROKES[id].steps[i];

  it('た 的 ③④ 是由左往右的短橫，不是撇', () => {
    for (const i of [2, 3]) {
      expect(step('h_ta', i)['zh-TW']).toMatch(/橫/);
      expect(step('h_ta', i)['zh-TW']).not.toMatch(/撇/);
      expect(step('h_ta', i).en).toMatch(/horizontal/);
      expect(step('h_ta', i).en).not.toMatch(/sweep/i);
    }
  });

  it('せ 和 よ 第一畫是橫', () => {
    expect(step('h_se', 0).en).toMatch(/^① Long horizontal/);
    expect(step('h_yo', 0).en).toMatch(/^① Short horizontal/);
  });

  it('あ 的提醒不再宣稱 あ／お 的圈在左下或右下', () => {
    const note = HIRAGANA_STROKES.h_a.note!;
    expect(note['zh-TW']).not.toMatch(/[左右]下/);
    expect(note['zh-CN']).not.toMatch(/[左右]下/);
    expect(note.en).not.toMatch(/lower (left|right)/);
    expect(note.ko).not.toMatch(/(왼쪽|오른쪽) 아래/);
    expect(note.es).not.toMatch(/abajo a la (izquierda|derecha)/);
    expect(note.en).toMatch(/dot at the upper right/);
  });

  it('お ② 寫明在底部往左繞小圈，再往右畫大弧線', () => {
    expect(step('h_o', 1)['zh-TW']).toMatch(/底部往左上繞一個小圈.*往右畫出大弧線/);
    expect(step('h_o', 1).en).toMatch(/small loop to the left at the bottom.*sweep wide to the right/);
  });

  it('う、ら 第一畫都是由左往右的短點，ら 不是撇', () => {
    for (const id of ['h_u', 'h_ra']) {
      const guide = HIRAGANA_STROKES[id];
      expect(guide.steps[0]['zh-TW']).toMatch(/由左往右/);
      for (const text of [guide.steps[0]['zh-TW'], guide.note!['zh-TW']]) expect(text).not.toMatch(/撇/);
      expect(guide.steps[0].en).not.toMatch(/sweep/i);
    }
  });
});
