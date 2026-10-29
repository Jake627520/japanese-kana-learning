import { describe, it, expect } from 'vitest';
import { ALL_KANA_AUDIO } from './kanaAudioMap';
import { ALL_LEARNABLE_KANA } from './kanaData';

// 聽力干擾選項演算法（QuizView.tsx 的 getListeningDistractors）沒有 export，無法在這裡呼叫；
// 這裡驗證它依賴的資料前提：每個假名都有音檔，且同類型的假名足夠湊出 3 個不重複干擾項。

const entries = Object.entries(ALL_KANA_AUDIO);

describe('ALL_KANA_AUDIO', () => {
  it('共 208 筆（清音、濁音、半濁音、拗音）', () => {
    expect(entries).toHaveLength(208);
  });

  it('音檔 id 不重複', () => {
    const ids = entries.map(([, id]) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每筆都對應到一個可學習假名，且字元相符', () => {
    const byId = new Map(ALL_LEARNABLE_KANA.map((k) => [k.id, k]));
    for (const [char, id] of entries) {
      expect(byId.get(id)?.kana, `${char} → ${id}`).toBe(char);
    }
  });

  it('每個可學習假名都有音檔（聽力模式點了不會沒聲音）', () => {
    const audioIds = new Set(entries.map(([, id]) => id));
    const missing = ALL_LEARNABLE_KANA.filter((k) => !audioIds.has(k.id)).map((k) => k.id);
    expect(missing).toEqual([]);
  });
});

describe('聽力干擾選項的資料前提', () => {
  it('可學習假名 id 不重複', () => {
    const ids = ALL_LEARNABLE_KANA.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('id 前綴與 type 一致（h/hd/hp/hy = hiragana、k/kd/kp/ky = katakana）', () => {
    // 只看 'k_' 前綴會把 kd_/kp_/ky_ 誤判成平假名
    for (const k of ALL_LEARNABLE_KANA) {
      expect(k.id, k.id).toMatch(k.type === 'katakana' ? /^k[dpy]?_/ : /^h[dpy]?_/);
    }
  });

  it('平假名、片假名各自至少 4 個（目標 + 3 個同類型干擾項）', () => {
    const hira = ALL_LEARNABLE_KANA.filter((k) => k.type === 'hiragana').length;
    const kata = ALL_LEARNABLE_KANA.filter((k) => k.type === 'katakana').length;
    expect(hira).toBeGreaterThanOrEqual(4);
    expect(kata).toBeGreaterThanOrEqual(4);
    expect(hira + kata).toBe(ALL_LEARNABLE_KANA.length);
  });
});
