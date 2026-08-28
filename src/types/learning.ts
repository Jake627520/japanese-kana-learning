export type LearningEventType =
  | 'quiz_answer'
  | 'review_complete'
  | 'writing_complete'
  | 'shadowing_complete';

export interface LearningEvent {
  id: string;
  timestamp: number;
  type: LearningEventType;
  source: string;
  kanaId?: string;
  selectedKanaId?: string;
  correct?: boolean;
}

export type CreateLearningEventInput = Omit<LearningEvent, 'id' | 'timestamp'> & {
  id?: string;
  timestamp?: number;
};
