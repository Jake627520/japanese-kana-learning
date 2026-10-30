import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CHOUON_RULES, KATAKANA_CHOUON_EXAMPLES } from './SpecialSoundsView';
import { CONTENT_AUDIO } from '../data/contentAudioMap';
import { LANGUAGES } from '../i18n';

describe('長音區：每條規則都有能聽的例詞', () => {
  it('平假名每一段規則都有平假名例詞', () => {
    expect(CHOUON_RULES).toHaveLength(5);
    for (const rule of CHOUON_RULES) expect(rule.word, rule.column).toMatch(/^[ぁ-ゟ]+$/);
  });

  it('片假名有用「ー」的例詞', () => {
    expect(KATAKANA_CHOUON_EXAMPLES.length).toBeGreaterThanOrEqual(4);
    for (const e of KATAKANA_CHOUON_EXAMPLES) expect(e.word).toContain('ー');
  });

  it('每個例詞都有各語言的意思，也有 VOICEVOX 音檔', () => {
    for (const e of [...CHOUON_RULES, ...KATAKANA_CHOUON_EXAMPLES]) {
      for (const lang of LANGUAGES) expect(e.meaning[lang], `${e.word} ${lang}`).toBeTruthy();
      const audioId = CONTENT_AUDIO[e.word];
      expect(audioId, e.word).toBeDefined();
      expect(existsSync(join('public', 'audio', 'content', `${audioId}.mp3`)), `${e.word} → ${audioId}`).toBe(true);
    }
  });
});
