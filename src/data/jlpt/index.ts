export { N5_TOPICS_BATCH1 } from './n5TopicsBatch1';
export { N5_ORIGINAL_BATCH1 } from './n5OriginalBatch1';

import { N5_ORIGINAL_BATCH1 } from './n5OriginalBatch1';
import { JlptQuestion } from '../../types';

/** 只返回 own 題；之後擴充時在此過濾 */
export function getOwnJlptQuestions(): JlptQuestion[] {
  return N5_ORIGINAL_BATCH1.filter(
    (q) => q.source.license === 'own' && q.source.origin === 'own'
  );
}

export function getQuestionsByTopic(topicId: string): JlptQuestion[] {
  return getOwnJlptQuestions().filter(
    (q) => q.topics.primary === topicId || q.topics.topicIds.includes(topicId)
  );
}
