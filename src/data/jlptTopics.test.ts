import { describe, it, expect } from 'vitest';
import { getOwnJlptQuestions, findJlptTopic, ALL_N4_TOPICS_UI, ALL_N3_TOPICS_UI } from './jlpt';

describe('findJlptTopic', () => {
  it('每一題的主知識點都查得到名稱，不分級別', () => {
    const missing = getOwnJlptQuestions()
      .map((q) => q.topics.primary)
      .filter((id) => findJlptTopic(id) === undefined);
    expect(missing).toEqual([]);
  });

  it('N4 與 N3 的知識點回傳該級別的條目', () => {
    for (const topic of [ALL_N4_TOPICS_UI[0], ALL_N3_TOPICS_UI[0]]) {
      expect(findJlptTopic(topic.id)).toBe(topic);
    }
  });
});
