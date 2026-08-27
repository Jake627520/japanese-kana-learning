import { LearningEvent, CreateLearningEventInput } from '../types/learning';

export const LEARNING_EVENTS_STORAGE_KEY = 'learning-events-v1';
export const MAX_LEARNING_EVENTS = 500;

/**
 * Retrieve all learning events from LocalStorage.
 * Safe fallback on missing storage or corrupted JSON.
 */
export function getLearningEvents(): LearningEvent[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(LEARNING_EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LearningEvent[];
  } catch (e) {
    console.error('Failed to read learning events from storage:', e);
    return [];
  }
}

/**
 * Record a new learning event.
 * Automatically generates a unique ID, assigns timestamp, and trims to the latest 500 records.
 */
export function logLearningEvent(input: CreateLearningEventInput): LearningEvent {
  const event: LearningEvent = {
    id: input.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: input.timestamp || Date.now(),
    type: input.type,
    source: input.source,
    ...(input.kanaId ? { kanaId: input.kanaId } : {}),
    ...(input.correct !== undefined ? { correct: input.correct } : {}),
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return event;
  }

  try {
    const current = getLearningEvents();
    const updated = [event, ...current].slice(0, MAX_LEARNING_EVENTS);
    localStorage.setItem(LEARNING_EVENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save learning event:', e);
  }

  return event;
}

/**
 * Clear all learning events.
 */
export function clearLearningEvents(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.removeItem(LEARNING_EVENTS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear learning events:', e);
  }
}
