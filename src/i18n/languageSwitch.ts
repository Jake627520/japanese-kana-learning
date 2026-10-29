import type { Language } from './types';
import type { Messages } from './index';

/** The provider's single source of truth for the dictionary on screen and any switch in flight. */
export interface LanguageSwitchState {
  messages: Messages;
  /** Only the request with this id may settle; any other outcome is stale. */
  pending: { id: number; language: Language } | null;
  /** The language whose latest switch failed, until dismissed or superseded. */
  failed: Language | null;
}

export type LanguageSwitchAction =
  | { type: 'request'; id: number; language: Language }
  | { type: 'loaded'; id: number; messages: Messages }
  | { type: 'failed'; id: number }
  | { type: 'dismiss' };

export function languageSwitchReducer(state: LanguageSwitchState, action: LanguageSwitchAction): LanguageSwitchState {
  switch (action.type) {
    case 'request':
      // Choosing the language already on screen cancels whatever is in flight.
      return action.language === state.messages.language
        ? { messages: state.messages, pending: null, failed: null }
        : { messages: state.messages, pending: { id: action.id, language: action.language }, failed: null };
    case 'loaded':
      return state.pending?.id === action.id ? { messages: action.messages, pending: null, failed: null } : state;
    case 'failed':
      return state.pending?.id === action.id
        ? { messages: state.messages, pending: null, failed: state.pending.language }
        : state;
    case 'dismiss':
      return state.failed === null ? state : { ...state, failed: null };
  }
}
