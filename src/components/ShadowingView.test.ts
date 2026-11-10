import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LANGUAGES } from '../i18n';
import { DICTIONARIES } from '../test/dictionaries';

describe('跟讀慢速標示', () => {
  it('五種語言標示的速度等於慢速音檔生成時的速度', () => {
    const script = readFileSync(join(process.cwd(), 'scripts/gen-audio.mjs'), 'utf8');
    const tempo = script.match(/const SLOW_TEMPO = ([\d.]+);/)?.[1];
    expect(tempo).toBeDefined();
    for (const lang of LANGUAGES) {
      expect(DICTIONARIES[lang].shadowing.slow, lang).toContain(`(${tempo}x)`);
    }
  });

  it('慢速音檔照原速播放，不再額外降速', () => {
    const view = readFileSync(join(process.cwd(), 'src/components/ShadowingView.tsx'), 'utf8');
    expect(view).not.toMatch(/playPreGeneratedClip\(clipPath, isSlow/);
  });
});

describe('跟讀第五步名稱', () => {
  it('寫的是對照回放，不暗示有自動評分或發音回饋', () => {
    for (const lang of LANGUAGES) {
      expect(DICTIONARIES[lang].shadowing.feedback, lang).not.toMatch(/評估|评估|反饋|反馈|feedback|피드백|comentarios|pronunciation|발음|pronunciación/i);
    }
  });
});
