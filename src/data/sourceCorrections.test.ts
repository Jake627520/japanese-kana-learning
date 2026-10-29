import { describe, it, expect } from 'vitest';
import { getOwnJlptQuestions, ALL_N3_TOPICS_UI } from './jlpt';
import { KATAKANA_DATA } from './kanaData';
import { ALL_VOCABULARY } from './vocabulary';
import { LANGUAGES } from '../i18n';


const question = (id: string) => {
  const q = getOwnJlptQuestions().find((x) => x.id === id);
  if (!q) throw new Error(`找不到題目 ${id}`);
  return q;
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

  it('n4-own-b2-12：「大概兩小時吧」是 二時間ぐらい 那個選項', () => {
    const q = question('n4-own-b2-12');
    expect(q.options[2]).toContain('二時間ぐらい');
    expect(q.explain['zh-TW']).toContain('・「二時間ぐらいだろうと よそうして いる」（大概兩小時吧）');
    expect(q.explain['zh-CN']).toContain('・「二時間ぐらいだろうと よそうして いる」（大概两小时吧）');
  });

  it('n3-own-b2-23：せいかくも いい 是兩個優點，雨まで 是兩件倒楣事', () => {
    const q = question('n3-own-b2-23');
    expect(q.options[2]).toContain('せいかくも いい');
    expect(q.options[3]).toContain('雨まで');
    expect(q.explain['zh-TW']).toContain('「頭が いい 上に、せいかくも いい」都是兩個優點，「道に まよった 上に、雨まで 降って きた」是兩個倒楣事');
    expect(q.explain['zh-CN']).toContain('「頭が いい 上に、せいかくも いい」都是两个优点，「道に まよった 上に、雨まで 降って きた」是两个倒霉事');
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
