export interface TodayStats {
  quizCount: number;
  reviewCount: number;
  writingCount: number;
  shadowingCount: number;
  totalActions: number;
}

export interface WeakKanaStat {
  kanaId: string;
  attempts: number;
  wrongCount: number;
  wrongRate: number;
}

export interface DailyTrendItem {
  date: string;
  displayDate: string;
  count: number;
  quizCount: number;
  reviewCount: number;
  writingCount: number;
  shadowingCount: number;
}

export type WeaknessConfidence = 'low' | 'medium' | 'high';

export interface AIRecommendation {
  priority: 'high' | 'medium' | 'normal';
  targetKanaId?: string;
  targetConfusionGroupId?: string;
  recommendedAction: 'writing' | 'shadowing' | 'review' | 'quiz' | 'listening_confusion';
  titleKey: string;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
  evidence?: RecommendationEvidence;
}

export interface RecommendationEvidence {
  listeningAccuracy?: number;
  visualAccuracy?: number;
  gap?: number;
  recentAttempts?: number;
  topDirection?: {
    target: string;
    selected: string;
    count: number;
  };
  confidence?: WeaknessConfidence;
  score?: number;
}

export interface TrainingOutcome {
  groupId: string;
  beforeAccuracy: number;
  afterAccuracy: number;
  sessionAccuracy: number;
  improvement: number;
  remainingTopDirection?: {
    target: string;
    selected: string;
    count: number;
  };
  isResolved: boolean;
}

export type ConfusionMatrix = Record<string, Record<string, number>>;

export interface ConfusionGroupStat {
  groupId: string;
  attempts: number;
  wrongCount: number;
  wrongRate: number;
}

export interface ModalityAccuracy {
  visualAccuracy: number;
  listeningAccuracy: number;
  gap: number;
}

export interface ListeningWeakness {
  kanaId: string;
  attempts: number;
  wrongCount: number;
  listeningAccuracy: number;
  visualAccuracy: number;
  gap: number;
  topConfusionKanaId?: string;
  confidence: WeaknessConfidence;
  score: number;
}

export interface ConfusionWeakness {
  groupId: string;
  memberKanaIds: string[];
  attempts: number;
  wrongCount: number;
  wrongRate: number;
  topDirection?: {
    target: string;
    selected: string;
    count: number;
  };
  confidence: WeaknessConfidence;
  score: number;
}
