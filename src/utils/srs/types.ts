import { KanaReviewState, UserProgress } from '../../types';

export type SRSVersion = 2;

export interface SRSStateV2 {
  kanaId: string;
  due: number;              // epoch ms
  lastReview: number | null; // epoch ms or null

  stability: number;        // days (float > 0)
  difficulty: number;       // 1 ~ 10

  reps: number;
  lapses: number;

  consecutiveCorrect: number;

  version: 2;
}

export type ReviewRating =
  | 'again'
  | 'hard'
  | 'good'
  | 'easy';

export interface ReviewInput {
  rating: ReviewRating;
  reviewedAt?: number;      // epoch ms (defaults to Date.now())
  now?: number;             // backward compatibility alias for reviewedAt
  kanaId?: string;
  responseMs?: number;
}

export interface ReviewResult {
  nextReviewAt: number;     // epoch ms
  state: SRSStateV2;
  due: number;              // backward compatibility alias for nextReviewAt
}

export interface SRSEngine {
  review(state: SRSStateV2 | null, input: ReviewInput): ReviewResult;
  getNextDue?(state: SRSStateV2, now: number): number;
}

export type SRSMode =
  | 'legacy'
  | 'adaptive';

export interface UserProgressV2 {
  schemaVersion: 2;

  masteredKanaIds: string[];
  wrongKanaIds: string[];

  streakDays: number;
  lastStudyDate: string;

  srsStates: Record<string, SRSStateV2>;
  reviewStates?: Record<string, KanaReviewState>;
}
