export { N5_TOPICS_BATCH1 } from './n5TopicsBatch1';
export { N5_TOPICS_BATCH2 } from './n5TopicsBatch2';
export { N5_ORIGINAL_BATCH1 } from './n5OriginalBatch1';
export { N5_ORIGINAL_BATCH2 } from './n5OriginalBatch2';

import { N5_TOPICS_BATCH1 } from './n5TopicsBatch1';
import { N5_TOPICS_BATCH2 } from './n5TopicsBatch2';
import { N5_ORIGINAL_BATCH1 } from './n5OriginalBatch1';
import { N5_ORIGINAL_BATCH2 } from './n5OriginalBatch2';
import { JlptQuestion, JlptTopic } from '../../types';

export const ALL_N5_TOPICS_UI: JlptTopic[] = [
  ...N5_TOPICS_BATCH1,
  ...N5_TOPICS_BATCH2,
];

export function getOwnJlptQuestions(): JlptQuestion[] {
  return [...N5_ORIGINAL_BATCH1, ...N5_ORIGINAL_BATCH2].filter(
    (q) => q.source.license === 'own' && q.source.origin === 'own'
  );
}

export function getQuestionsByTopic(topicId: string): JlptQuestion[] {
  return getOwnJlptQuestions().filter(
    (q) => q.topics.primary === topicId || q.topics.topicIds.includes(topicId)
  );
}
