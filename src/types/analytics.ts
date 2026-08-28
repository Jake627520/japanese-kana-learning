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

export interface AIRecommendation {
  priority: 'high' | 'medium' | 'normal';
  targetKanaId?: string;
  recommendedAction: 'writing' | 'shadowing' | 'review' | 'quiz';
  titleKey: string;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
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
