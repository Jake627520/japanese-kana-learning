import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_LEARNABLE_KANA } from './kanaData';
import { ALL_VOCABULARY } from './vocabulary';
import { CONTENT_AUDIO } from './contentAudioMap';
import { ALL_KANA_AUDIO } from './kanaAudioMap';
import { VOCABULARY_AUDIO_MAPPING } from './vocabulary/vocabularyAudio';
import { CONFUSABLE_GROUPS } from './confusableData';
import { HIRAGANA_STROKES } from './strokeData';
import { LANGUAGES } from '../i18n';

const card = (id: string) => {
  const k = ALL_LEARNABLE_KANA.find((x) => x.id === id);
  if (!k) throw new Error(`找不到假名 ${id}`);
  return k;
};
const kanaById = new Map(ALL_LEARNABLE_KANA.map((k) => [k.id, k.kana]));
const examples = ALL_LEARNABLE_KANA.flatMap((k) => k.examples.map((e) => ({ id: k.id, ...e })));

describe('例詞勘誤：假造的片假名詞與不自然的例句', () => {
  it('不再出現 ラジオヂオ、ハナヅマ', () => {
    const words = [...examples.map((e) => e.word), ...ALL_VOCABULARY.map((v) => v.word)];
    expect(words).not.toContain('ラジオヂオ');
    expect(words).not.toContain('ハナヅマ');
  });

  it('ヂ、ヅ 卡片的例詞與例句真的用到 チヂ、ツヅ', () => {
    const [dji] = card('kd_dji').examples;
    expect(dji.word).toBe('チヂミ');
    expect(dji.sentence).toContain('チヂミ');
    const [dzu] = card('kd_dzu').examples;
    expect(dzu.word).toBe('ツヅキ');
    expect(dzu.sentence).toContain('ツヅキ');
  });

  it('ヂ、ヅ 的單字卡由真實假名組成，且有發音', () => {
    for (const [kanaId, word] of [['kd_dji', 'チヂミ'], ['kd_dzu', 'ツヅキ']] as const) {
      const item = ALL_VOCABULARY.find((v) => v.primaryKanaId === kanaId);
      expect(item?.word, kanaId).toBe(word);
      expect(item!.kanaLinks.map((id) => kanaById.get(id)).join(''), kanaId).toBe(word);
      expect(CONTENT_AUDIO[word], word).toBeDefined();
    }
  });

  it('ぴゃっ 的例句是貓逃走，片假名一律寫 ピャッ', () => {
    const [h] = card('hy_pya').examples;
    expect(h.sentence).toBe('ねこがぴゃっとにげました。');
    const [k] = card('ky_pya').examples;
    expect(k.sentence).toBe('ねこがピャッとにげました。');
    for (const text of [k.word, k.sentence, k.sentenceDisplay]) {
      expect(text).toContain('ピャッ');
      expect(text).not.toContain('ピャっ');
    }
  });

  it('例句的空格版去掉空格後與例句相同', () => {
    for (const id of ['kd_dji', 'kd_dzu', 'hy_pya', 'ky_pya']) {
      const [e] = card(id).examples;
      expect(e.sentenceDisplay.replace(/ /g, ''), id).toBe(e.sentence);
    }
  });

  it('每個例詞與例句都有音檔，檔案也在', () => {
    for (const e of examples) {
      for (const text of [e.word, e.sentence]) {
        const audioId = CONTENT_AUDIO[text];
        expect(audioId, `${e.id}: ${text}`).toBeDefined();
        expect(existsSync(join('public', 'audio', 'content', `${audioId}.mp3`)), `${text} → ${audioId}`).toBe(true);
      }
    }
  });
});

describe('あ／お：以右上那一點為主要分辨線索', () => {
  const dotFirst: Record<string, [string, string]> = {
    'zh-TW': ['點', '圈'],
    'zh-CN': ['点', '圈'],
    en: ['dot', 'loop'],
    ko: ['점', '고리'],
    es: ['punto', 'bucle'],
  };

  it('每個語言都先講點，再講圈', () => {
    const group = CONFUSABLE_GROUPS.find((g) => g.id === 'cf_a_o')!;
    for (const lang of LANGUAGES) {
      const text = group.distinguish[lang];
      const [dot, loop] = dotFirst[lang];
      expect(text.indexOf(dot), `${lang} 提到點`).toBeGreaterThanOrEqual(0);
      expect(text.indexOf(dot), `${lang} 點在圈之前`).toBeLessThan(text.indexOf(loop));
    }
  });
});

describe('ら／う：以第二畫起筆分辨', () => {
  it('不再說 ら 上面是撇', () => {
    const group = CONFUSABLE_GROUPS.find((g) => g.id === 'cf_ra_u')!;
    expect(group.distinguish['zh-TW']).not.toMatch(/撇/);
    expect(group.distinguish['zh-TW']).toMatch(/起筆/);
    expect(group.distinguish.en).toMatch(/lower stroke starts/);
  });
});

describe('筆順勘誤：か、き、な、と', () => {
  it('步驟數等於筆畫數', () => {
    expect(HIRAGANA_STROKES.h_ka.count).toBe(3);
    expect(HIRAGANA_STROKES.h_ki.count).toBe(4);
    expect(HIRAGANA_STROKES.h_na.count).toBe(4);
    expect(HIRAGANA_STROKES.h_to.count).toBe(2);
    for (const id of ['h_ka', 'h_ki', 'h_na', 'h_to']) {
      expect(HIRAGANA_STROKES[id].steps, id).toHaveLength(HIRAGANA_STROKES[id].count);
    }
  });

  it('筆順與標準一致（以英文說明核對起筆與方向）', () => {
    const en = (id: string) => HIRAGANA_STROKES[id].steps.map((s) => s.en);
    const [ka1, ka2, ka3] = en('h_ka');
    expect(ka1).toMatch(/^① Horizontal.*turns down.*hook/);
    expect(ka2).toMatch(/top down to the lower left/);
    expect(ka3).toMatch(/dot on the right/);

    const ki = en('h_ki');
    expect(ki[2]).toMatch(/from the upper left down to the right/);
    expect(ki[3]).toMatch(/Separate curve at the bottom, starting on the left/);

    const na = en('h_na');
    expect(na[1]).toMatch(/top down to the lower left/);
    expect(na[2]).toMatch(/dot at the upper right/);
    expect(na[3]).toMatch(/middle of the right side.*loop/);

    const [, to2] = en('h_to');
    expect(to2).toMatch(/^② Start at the upper right, go down to the left, then sweep right along the bottom/);
  });
});

describe('詞彙音檔', () => {
  it('每個詞彙都有預錄音檔，不會退回瀏覽器語音', () => {
    const missing = ALL_VOCABULARY.map((v) => VOCABULARY_AUDIO_MAPPING[v.audioKey] || v.word)
      .filter((text) => !ALL_KANA_AUDIO[text] && !CONTENT_AUDIO[text]);
    expect(missing).toEqual([]);
  });
});
