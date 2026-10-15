import { describe, it, expect } from 'vitest';
import { CONFUSABLE_GROUPS } from './confusableData';
import { ALL_LEARNABLE_KANA } from './kanaData';
import { ALL_KANA_AUDIO } from './kanaAudioMap';

// 取代 scripts/test-confusion-taxonomy.py、test-confusion-training.py、test-c1-2-manual-qa.py 的資料檢查。
// 原腳本用 regex 掃 confusableData.ts 原始碼；這裡直接 import 真資料。

const kanaById = new Map(ALL_LEARNABLE_KANA.map((k) => [k.id, k]));
const audioIds = new Set(Object.values(ALL_KANA_AUDIO));

// test-confusion-taxonomy.py:57-61 / :71 的分類
const VISUAL_IDS = [
  'cf_nu_me', 'cf_ru_ro', 'cf_ne_re_wa', 'cf_sa_chi', 'cf_ki_sa',
  'cf_ha_ho', 'cf_ma_ki', 'cf_ta_na', 'cf_ko_ni', 'cf_ra_u',
  'cf_so_n_kata', 'cf_ku_wa_u_kata', 'cf_su_nu_kata', 'cf_te_ra_kata',
  'cf_no_me_kata', 'cf_a_ma_kata',
];
const BOTH_IDS = ['cf_su_mu', 'cf_a_o', 'cf_tsu_shi', 'cf_i_ri', 'cf_shi_tsu_kata'];

describe('CONFUSABLE_GROUPS 資料完整性', () => {
  it('共 21 組，id 不重複且以 cf_ 開頭', () => {
    const ids = CONFUSABLE_GROUPS.map((g) => g.id);
    expect(ids).toHaveLength(21);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^cf_[a-z_]+$/);
  });

  it('每組 2–3 個成員，組內不重複（特訓選項數 = 成員數）', () => {
    for (const g of CONFUSABLE_GROUPS) {
      expect(g.members.length, g.id).toBeGreaterThanOrEqual(2);
      expect(g.members.length, g.id).toBeLessThanOrEqual(3);
      expect(new Set(g.members).size, g.id).toBe(g.members.length);
    }
  });

  it('每個成員都是存在的假名 id', () => {
    for (const g of CONFUSABLE_GROUPS) {
      for (const m of g.members) {
        expect(kanaById.has(m), `${g.id} 的 ${m} 不在 ALL_LEARNABLE_KANA`).toBe(true);
      }
    }
  });

  it('category 只能是 hiragana / katakana，且成員的 type 與 category 一致（平片不混）', () => {
    for (const g of CONFUSABLE_GROUPS) {
      expect(['hiragana', 'katakana']).toContain(g.category);
      for (const m of g.members) {
        expect(kanaById.get(m)?.type, `${g.id} 的 ${m}`).toBe(g.category);
        expect(m.startsWith(g.category === 'katakana' ? 'k_' : 'h_'), `${g.id} 的 ${m}`).toBe(true);
      }
    }
  });

  it('沒有兩組的成員集合相同', () => {
    const keys = CONFUSABLE_GROUPS.map((g) => [...g.members].sort().join('|'));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('每組都有非空的判斷點 distinguish', () => {
    for (const g of CONFUSABLE_GROUPS) expect(g.distinguish.trim().length, g.id).toBeGreaterThan(0);
  });
});

describe('CONFUSABLE_GROUPS modality 分類（test-confusion-taxonomy.py Test 1/3/4）', () => {
  it('每組都有合法的 modality（未設定則視為 visual）', () => {
    for (const g of CONFUSABLE_GROUPS) {
      expect(['visual', 'listening', 'both']).toContain(g.modality ?? 'visual');
    }
  });

  it('16 組 visual、5 組 both，正好涵蓋全部 21 組', () => {
    const byId = new Map(CONFUSABLE_GROUPS.map((g) => [g.id, g]));
    for (const id of VISUAL_IDS) expect(byId.get(id)?.modality, id).toBe('visual');
    for (const id of BOTH_IDS) expect(byId.get(id)?.modality, id).toBe('both');
    expect(new Set([...VISUAL_IDS, ...BOTH_IDS])).toEqual(new Set(byId.keys()));
  });

  it('可做聽力特訓的組（listening / both），每個成員都有音檔', () => {
    const listeningGroups = CONFUSABLE_GROUPS.filter((g) => g.modality === 'listening' || g.modality === 'both');
    expect(listeningGroups.length).toBeGreaterThanOrEqual(4); // test-c1-2-manual-qa.py:76
    for (const g of listeningGroups) {
      for (const m of g.members) expect(audioIds.has(m), `${g.id} 的 ${m} 沒有音檔`).toBe(true);
    }
  });
});
