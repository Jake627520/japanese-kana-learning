import { describe, it, expect } from 'vitest';
import { getOwnJlptQuestions } from './jlpt';

/**
 * 自創題的題幹要用真實 JLPT 的提問方式。
 * 這裡擋的是「只有這個題庫才會出現、實際考試不會考」的形式。
 */
describe('JLPT 題幹格式', () => {
  const questions = getOwnJlptQuestions();

  it('不用「正しくない ものは どれですか」這種反向提問', () => {
    // 真實 もんだい5（用法）一律問「つかい方として 正しい ものは どれですか」，
    // 要考生挑出唯一正確的一句，而不是從三句正確裡挑出錯的那句。
    const inverted = questions.filter((q) => /正しくない|まちがって いる|間違って いる/.test(q.stem));
    expect(inverted.map((q) => q.id)).toEqual([]);
  });

  it('用法題的題幹用「つかい方として 正しい」', () => {
    // 只看「問用法」的題幹，不是句子裡剛好出現「つかい方」的填空題。
    const usage = questions.filter((q) => /つかい方(が|として|は)\s*(正しい|正しくない)/.test(q.stem));
    expect(usage.length).toBeGreaterThan(0);
    for (const q of usage) {
      expect(q.stem, q.id).toContain('つかい方として 正しい ものは どれですか');
    }
  });

  it('不用日文問日文文法（後設題）', () => {
    // 實際考試只在句子或文章的語境裡出題。
    // 「〜の いみは どれですか」這類問法只有這個題庫會出現，
    // 唯一的例外是読解裡問畫線處的「〜とは、どういう ことですか」。
    const META = [
      /の\s*いみは\s*どれですか/,
      /何を\s*あらわして\s*いますか/,
      /どんな\s*気持ちを\s*あらわして/,
      /どんな\s*はたらきを\s*して/,
      /ちがいとして|ちがいの\s*せつめい/,
      /順に\s*ならべると/,
      /どんな\s*文に\s*なりますか/,
      /つぎの\s*中で|次の\s*中で/,
    ];
    const meta = questions.filter((q) => META.some((re) => re.test(q.stem)));
    expect(meta.map((q) => q.id)).toEqual([]);
  });
});
