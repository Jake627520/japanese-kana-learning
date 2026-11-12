import { describe, it, expect } from 'vitest';
import { UNITS, getUnitText } from './unitsData';
import { ALL_LEARNABLE_KANA, HIRAGANA_DATA } from './kanaData';
import { CONFUSABLE_GROUPS } from './confusableData';
import { LANGUAGES } from '../i18n';
import type { Language } from '../i18n/types';
import type { NavigationTab } from '../types';

const ALL_IDS = new Set(ALL_LEARNABLE_KANA.map((k) => k.id));
const HIRAGANA_IDS = new Set(HIRAGANA_DATA.map((k) => k.id));
const GROUP_IDS = new Set(CONFUSABLE_GROUPS.map((g) => g.id));
const VALID_TABS: NavigationTab[] = [
  'home', 'grid', 'study', 'quiz', 'review', 'special',
  'jlpt', 'shadowing', 'chat', 'writing', 'confusable', 'units',
];

describe('單元學習資料', () => {
  it('有 14 個單元（U0–U13），id 為 u0–u13 且唯一', () => {
    expect(UNITS).toHaveLength(14);
    const ids = UNITS.map((u) => u.id);
    expect(ids).toEqual(
      Array.from({ length: 14 }, (_, i) => `u${i}`),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每個單元的假名 id 都真實存在於 kanaData', () => {
    for (const unit of UNITS) {
      for (const kanaId of unit.kanaIds) {
        expect(ALL_IDS.has(kanaId), `${unit.id} 的假名 ${kanaId} 不存在`).toBe(true);
      }
      expect(new Set(unit.kanaIds).size).toBe(unit.kanaIds.length);
    }
  });

  it('標題、副標題、驗收標準與每一個教學點都有 6 種語言（zh-TW、zh-CN、en、ko、es、pt-BR）', () => {
    for (const unit of UNITS) {
      for (const field of [unit.title, unit.subtitle, unit.acceptance]) {
        for (const lang of LANGUAGES) {
          expect(field[lang], `${unit.id} 缺 ${lang}`).toBeTruthy();
        }
      }
      expect(unit.teachingPoints.length).toBeGreaterThan(0);
      for (const point of unit.teachingPoints) {
        for (const lang of LANGUAGES) {
          expect(point[lang], `${unit.id} 教學點缺 ${lang}`).toBeTruthy();
        }
      }
    }
  });

  it('連結指到的分頁都在 NavigationTab 內；書寫連結只用平假名基本音；易混連結的群組真實存在', () => {
    for (const unit of UNITS) {
      expect(unit.links.length).toBeGreaterThan(0);
      for (const link of unit.links) {
        expect(VALID_TABS).toContain(link.tab);
        if (link.kanaId) {
          expect(ALL_IDS.has(link.kanaId), `${unit.id} 連結的假名 ${link.kanaId} 不存在`).toBe(true);
        }
        if (link.tab === 'writing') {
          expect(link.kanaId, `${unit.id} 的書寫連結必須帶平假名基本音 id`).toBeTruthy();
          expect(HIRAGANA_IDS.has(link.kanaId as string), `${unit.id} 的書寫連結 ${link.kanaId} 不在平假名基本音內`).toBe(true);
        }
        if (link.groupId) {
          expect(link.tab).toBe('confusable');
          expect(GROUP_IDS.has(link.groupId), `${unit.id} 連結的易混群組 ${link.groupId} 不存在`).toBe(true);
        }
      }
    }
  });

  it('getUnitText：6 種語言各自回傳對應文字，不靠回退', () => {
    const unit = UNITS[0];
    for (const lang of LANGUAGES) {
      expect(getUnitText(unit.title, lang)).toBe(unit.title[lang]);
    }
    // pt-BR 專項：確認第 10 單元（濁音）標題有 pt-BR，不走英文回退
    expect(getUnitText(UNITS[10].title, 'pt-BR')).toBe('Lição 10: sons sonoros e semissonoros');
  });

  it('ら行教學點在任何語言都不寫「不是 l」／"not l"／"nem l"，只正面描述彈音 [ɾ]', () => {
    const u8 = UNITS[8];
    const point = u8.teachingPoints[1];
    for (const lang of LANGUAGES) {
      const text = point[lang] as string;
      expect(text, `${lang} 仍有「不是 l」類寫法`).not.toMatch(/not l|nem l|不是 l|不是l|ไม่ใช่ l/);
      expect(text, `${lang} 缺少 [ɾ] 標記`).toContain('[ɾ]');
    }
  });
});
