import { KanaReviewState, UserProgress } from '../../types';

export type SRSVersion = 2;

export interface SRSStateV2 {
  kanaId: string;
  due: number;              // epoch ms
  lastReview: number | null; // epoch ms or null

  stability: number;        // days (float >= 0.005)
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
  state: SRSStateV2;
  rating: ReviewRating;
  now: number;
  responseMs?: number;
}

export interface ReviewResult {
  state: SRSStateV2;
  due: number;
}

export interface SRSEngine {
  review(input: ReviewInput): ReviewResult;
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
