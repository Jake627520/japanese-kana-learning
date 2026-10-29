import type { Language } from '../i18n';
import type { JlptExplanations } from '../data/jlpt/explanations';

/** `failures` counts failed loads of `language` in a row; switching language starts over. */
export type ExplanationsState = { language: Language; failures: number } & (
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'ready'; byId: JlptExplanations }
);

export type ExplanationsEvent =
  | { type: 'load'; language: Language }
  | { type: 'loaded'; byId: JlptExplanations }
  | { type: 'failed' };

export function explanationsReducer(state: ExplanationsState, event: ExplanationsEvent): ExplanationsState {
  switch (event.type) {
    case 'load':
      return {
        language: event.language,
        failures: event.language === state.language ? state.failures : 0,
        status: 'loading',
      };
    case 'loaded':
      return { language: state.language, failures: 0, status: 'ready', byId: event.byId };
    case 'failed':
      return { language: state.language, failures: state.failures + 1, status: 'failed' };
  }
}

/**
 * Browsers may cache a failed dynamic import for the page's lifetime (Chromium and
 * older Safari do), so once an in-place retry has also failed, only a page reload
 * can fetch the chunk again.
 */
export function offersReload(state: ExplanationsState): boolean {
  return state.status === 'failed' && state.failures > 1;
}
