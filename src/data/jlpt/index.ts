export { N5_TOPICS_BATCH1 } from './n5TopicsBatch1';
export { N5_TOPICS_BATCH2 } from './n5TopicsBatch2';
export { N5_TOPICS_BATCH3 } from './n5TopicsBatch3';
export { N5_ORIGINAL_BATCH1 } from './n5OriginalBatch1';
export { N5_ORIGINAL_BATCH2 } from './n5OriginalBatch2';
export { N5_ORIGINAL_BATCH3 } from './n5OriginalBatch3';
export { N5_ORIGINAL_BATCH4 } from './n5OriginalBatch4';
export { N4_TOPICS_BATCH1 } from './n4TopicsBatch1';
export { N4_TOPICS_BATCH2 } from './n4TopicsBatch2';
export { N4_TOPICS_BATCH3 } from './n4TopicsBatch3';
export { N4_ORIGINAL_BATCH1 } from './n4OriginalBatch1';
export { N4_ORIGINAL_BATCH2 } from './n4OriginalBatch2';
export { N4_ORIGINAL_BATCH3 } from './n4OriginalBatch3';

import { N5_TOPICS_BATCH1 } from './n5TopicsBatch1';
import { N5_TOPICS_BATCH2 } from './n5TopicsBatch2';
import { N5_TOPICS_BATCH3 } from './n5TopicsBatch3';
import { N5_ORIGINAL_BATCH1 } from './n5OriginalBatch1';
import { N5_ORIGINAL_BATCH2 } from './n5OriginalBatch2';
import { N5_ORIGINAL_BATCH3 } from './n5OriginalBatch3';
import { N5_ORIGINAL_BATCH4 } from './n5OriginalBatch4';
import { N4_TOPICS_BATCH1 } from './n4TopicsBatch1';
import { N4_TOPICS_BATCH2 } from './n4TopicsBatch2';
import { N4_TOPICS_BATCH3 } from './n4TopicsBatch3';
import { N4_ORIGINAL_BATCH1 } from './n4OriginalBatch1';
import { N4_ORIGINAL_BATCH2 } from './n4OriginalBatch2';
import { N4_ORIGINAL_BATCH3 } from './n4OriginalBatch3';
import { JlptQuestion, JlptTopic, JlptGrade } from '../../types';

export const ALL_N5_TOPICS_UI: JlptTopic[] = [
  ...N5_TOPICS_BATCH1,
  ...N5_TOPICS_BATCH2,
  ...N5_TOPICS_BATCH3,
];

export const ALL_N4_TOPICS_UI: JlptTopic[] = [
  ...N4_TOPICS_BATCH1,
  ...N4_TOPICS_BATCH2,
  ...N4_TOPICS_BATCH3,
];

// 目前有題庫的級別。N3 的知識點在 nihongo-tiku 已經定義好，但原創題還沒寫，
// 所以刻意不列進來——列了卻點不進去，比不列更糟。
export const AVAILABLE_LEVELS: JlptGrade[] = ['n5', 'n4'];

export function getTopicsByLevel(level: JlptGrade): JlptTopic[] {
  if (level === 'n4') return ALL_N4_TOPICS_UI;
  if (level === 'n5') return ALL_N5_TOPICS_UI;
  return [];
}

// license/origin 都是 own 才放行：這個過濾是公開版能不能散布的界線，
// 不是效能考量——歷屆真題集授權不明，絕對不能混進來。
export function getOwnJlptQuestions(): JlptQuestion[] {
  return [
    ...N5_ORIGINAL_BATCH1,
    ...N5_ORIGINAL_BATCH2,
    ...N5_ORIGINAL_BATCH3,
    ...N5_ORIGINAL_BATCH4,
    ...N4_ORIGINAL_BATCH1,
    ...N4_ORIGINAL_BATCH2,
    ...N4_ORIGINAL_BATCH3,
  ].filter((q) => q.source.license === 'own' && q.source.origin === 'own');
}

// 級別是從題目所屬的知識點推回來的，不是從 source.level 讀的——
// source 是人工填的欄位，知識點歸屬才是題目與級別的唯一連結。
const TOPIC_LEVEL: Record<string, JlptGrade> = (() => {
  const map: Record<string, JlptGrade> = {};
  for (const t of ALL_N5_TOPICS_UI) map[t.id] = 'n5';
  for (const t of ALL_N4_TOPICS_UI) map[t.id] = 'n4';
  return map;
})();

export function getOwnJlptQuestionsByLevel(level: JlptGrade): JlptQuestion[] {
  return getOwnJlptQuestions().filter((q) => TOPIC_LEVEL[q.topics.primary] === level);
}

export function getQuestionsByTopic(topicId: string): JlptQuestion[] {
  return getOwnJlptQuestions().filter(
    (q) => q.topics.primary === topicId || q.topics.topicIds.includes(topicId)
  );
}
