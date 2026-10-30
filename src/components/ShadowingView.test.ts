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
