import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_LEARNABLE_KANA } from './kanaData';
import { ALL_VOCABULARY } from './vocabulary';
import { CONTENT_AUDIO } from './contentAudioMap';
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
