import { describe, it, expect } from 'vitest';
import { getOwnJlptQuestions, ALL_N3_TOPICS_UI, ALL_N4_TOPICS_UI, ALL_N5_TOPICS_UI } from './jlpt';
import { KATAKANA_DATA } from './kanaData';
import { ALL_VOCABULARY } from './vocabulary';
import { LANGUAGES, LocalizedText } from '../i18n';
import { JLPT_EXPLANATIONS } from '../test/jlptExplanations';

const question = (id: string) => {
  const q = getOwnJlptQuestions().find((x) => x.id === id);
  if (!q) throw new Error(`找不到題目 ${id}`);
  const explain = Object.fromEntries(LANGUAGES.map((lang) => [lang, JLPT_EXPLANATIONS[lang][id]])) as LocalizedText;
  return { ...q, explain };
};

describe('JLPT 題庫勘誤（.audit/jlpt-source-errors.md）', () => {
  it('N5-ORIG-B2-V-12：朋友給我用 くれました，答案是 3', () => {
    const q = question('N5-ORIG-B2-V-12');
    expect(q.options[2]).toBe('くれました');
    expect(q.options).not.toContain('あげました');
    expect(q.answer).toBe('3');
    for (const lang of LANGUAGES) expect(q.explain[lang], lang).toContain('くれました');
  });

  it('N5-ORIG-B2-V-11：題幹改成 あねから，只剩 もらいました 成立', () => {
    const q = question('N5-ORIG-B2-V-11');
    expect(q.stem).toContain('あねから');
    expect(q.options[2]).toBe('もらいました');
    expect(q.answer).toBe('3');
    for (const lang of LANGUAGES) expect(q.explain[lang], lang).toContain('から');
  });

  it('N5-ORIG-B3-P-21：解說的結論是用「と」的那句', () => {
    const q = question('N5-ORIG-B3-P-21');
    expect(q.answer).toBe('4');
    expect(q.options[3]).toBe('りんごと バナナと みかんを かいました。');
    expect(q.explain['zh-TW']).toContain('故選「りんごと バナナと みかんを かいました」');
    expect(q.explain['zh-CN']).toContain('所以选「りんごと バナナと みかんを かいました」');
  });

  it('N5-ORIG-B3-P-30：連接形容詞的是「パンや きれいです」', () => {
    const q = question('N5-ORIG-B3-P-30');
    expect(q.options[0]).toBe('パンや きれいです。');
    expect(q.explain['zh-TW']).toContain('「パンや きれいです」連接形容詞');
    expect(q.explain['zh-CN']).toContain('「パンや きれいです」连接形容词');
  });

  it('n5-own-b4-05：かたかな 不連濁是例外，不是因為音讀', () => {
    const q = question('n5-own-b4-05');
    expect(q.explain['zh-TW']).not.toMatch(/漢語|同理/);
    expect(q.explain['zh-CN']).not.toMatch(/汉语|同理/);
    expect(q.explain['zh-TW']).toContain('例外');
  });

  it('n5-own-b4-04：訓讀與音讀「通常」不混用', () => {
    const q = question('n5-own-b4-04');
    expect(q.explain['zh-TW']).toContain('通常不會');
    expect(q.explain['zh-CN']).toContain('通常不会');
    expect(q.explain.en).toContain('normally');
    expect(q.explain.ko).toContain('보통');
  });

  it('n4-own-b2-12：も 是「竟然多達」，解說要指出 で 不能接在數量詞後面', () => {
    const q = question('n4-own-b2-12');
    expect(q.options[Number(q.answer) - 1]).toBe('も');
    expect(q.stem).toContain('近いと 聞いて いた');
    expect(q.explain['zh-TW']).toContain('「二時間で かかりました」不成立');
    expect(q.explain['zh-CN']).toContain('「二時間で かかりました」不成立');
  });

  it('n3-own-b2-23：上に 的前後必須同方向，解說要指出哪句方向相反', () => {
    const q = question('n3-own-b2-23');
    expect(q.options[Number(q.answer) - 1]).toBe('この へやは 広い 上に、駅からも 近い。');
    expect(q.explain['zh-TW']).toContain('寬敞是優點、房租貴是缺點，<b>方向相反</b>');
    expect(q.explain['zh-CN']).toContain('宽敞是优点、房租贵是缺点，<b>方向相反</b>');
  });

  it('n3-own-b2-13：わけには いかない 並不是「沒有別的選項」', () => {
    const q = question('n3-own-b2-13');
    expect(q.explain['zh-TW']).toContain('並不是沒有別的選項');
    expect(q.explain['zh-CN']).toContain('并不是没有别的选项');
  });
});

describe('內容勘誤（.audit/content-source-errors.md 接線時直接修）', () => {
  it('k_ya#0：ひろいヤード 是寬敞的院子', () => {
    const ex = KATAKANA_DATA.find((k) => k.id === 'k_ya')!.examples[0];
    expect(ex.sentenceMeaning['zh-TW']).toBe('是很寬敞的院子。');
    expect(ex.meaning['zh-TW']).toContain('院子');
  });

  it('jpg_n3-youni-purpose：限制的是 ように 前面的動詞', () => {
    const topic = ALL_N3_TOPICS_UI.find((t) => t.id === 'jpg_n3-youni-purpose')!;
    expect(topic.description['zh-TW']).toContain('前半（ように前面的動詞）');
    expect(topic.description['zh-TW']).not.toContain('後半');
  });

  it('詞彙 ひょう（表）不含「豹」的意思', () => {
    const hyou = ALL_VOCABULARY.find((v) => v.word === 'ひょう' && v.kanji === '表')!;
    for (const lang of LANGUAGES) expect(hyou.meaning[lang], lang).not.toMatch(/豹|leopard|표범|leopardo/i);
  });
});

describe('en/ko/es 解說母語審校', () => {
  it('en：吃藥對照英文 take，に沿って 不用 work in line with the plan，代わりに 的例句是「你」', () => {
    expect(JLPT_EXPLANATIONS.en['N5-ORIG-B2-V-14']).toContain('Where English uses “take,” Japanese uses のむ');
    for (const text of Object.values(JLPT_EXPLANATIONS.en)) expect(text).not.toContain('work in line with the plan');
    expect(JLPT_EXPLANATIONS.en['n3-own-b2-05']).toContain('I teach you Japanese, and in return you teach me English');
  });

  it('ko：냄새／맛 是正向提示，解決 寫成 解決（する）', () => {
    expect(JLPT_EXPLANATIONS.ko['n4-own-b1-05']).toContain("한국어에서 '냄새'와 '맛'을 구분하듯");
    expect(JLPT_EXPLANATIONS.ko['n3-own-b3-02']).toContain('解決（する）');
  });

  it('es：吃藥對照 tomar，かいけち 不用中古漢語 -t 解釋', () => {
    expect(JLPT_EXPLANATIONS.es['N5-ORIG-B2-V-14']).toContain('(en lugar de «tomarse»)');
    expect(JLPT_EXPLANATIONS.es['n3-own-b3-01']).not.toContain('chino antiguo');
  });

  it('pt-BR：吃藥對照 tomar remédio，術語用 forma TE/TA 與 on\'yomi，不用直引號', () => {
    expect(JLPT_EXPLANATIONS['pt-BR']['N5-ORIG-B2-V-14']).toContain('tomar remédio');
    for (const [id, text] of Object.entries(JLPT_EXPLANATIONS['pt-BR'])) {
      expect(text, id).not.toContain('"');
      expect(text, id).not.toMatch(/forma -(te|ta|nai|masu)\b|(on|kun)[-’]yomi/);
    }
  });

  it('引號與標籤：es 用 «» 與 Respuesta correcta:，en 不用直引號，ko 的韓文不放進 「」', () => {
    for (const [id, text] of Object.entries(JLPT_EXPLANATIONS.es)) {
      expect(text, id).not.toContain('Correcta:');
      expect(text, id).not.toMatch(/[“”]/);
    }
    expect(JLPT_EXPLANATIONS.es['n4-own-b1-01']).toMatch(/^Respuesta correcta:/);
    expect(JLPT_EXPLANATIONS.es['n3-own-b1-01']).toMatch(/^Respuesta correcta:/);
    for (const [id, text] of Object.entries(JLPT_EXPLANATIONS.en)) expect(text, id).not.toContain('"');
    const koreanOnlyBracket = /「[^「」ぁ-ヿ㐀-鿿]*[가-힣][^「」ぁ-ヿ㐀-鿿]*」/;
    for (const [id, text] of Object.entries(JLPT_EXPLANATIONS.ko)) expect(text, id).not.toMatch(koreanOnlyBracket);
  });
});

describe('en 引號標點（美式：逗號句號在收尾引號內）', () => {
  it('en 解說與主題文字沒有 ”, 或 ”. （含 ”</b>, 的情況）', () => {
    const bad = /”(<\/b>)?[,.]/;
    for (const [id, text] of Object.entries(JLPT_EXPLANATIONS.en)) expect(text, id).not.toMatch(bad);
    for (const t of [...ALL_N5_TOPICS_UI, ...ALL_N4_TOPICS_UI, ...ALL_N3_TOPICS_UI]) {
      expect(t.name.en, t.id).not.toMatch(bad);
      expect(t.description.en, t.id).not.toMatch(bad);
    }
  });
});
