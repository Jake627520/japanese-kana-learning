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

/** A chunk request can hang on a stalled network without ever rejecting. */
export const LANGUAGE_SWITCH_TIMEOUT_MS = 15_000;

export interface LanguageSwitcher {
  getState(): LanguageSwitchState;
  subscribe(listener: () => void): () => void;
  /** A newer request supersedes the pending one; the current language cancels it. */
  request(language: Language): void;
  dismiss(): void;
  /** Stops the pending request's timeout. */
  dispose(): void;
}

interface LanguageSwitcherDeps {
  load: (language: Language) => Promise<Messages>;
  /** Called only when a loaded dictionary replaces the one on screen. */
  persist: (language: Language) => void;
  timeoutMs?: number;
}

export function createLanguageSwitcher(
  initial: Messages,
  { load, persist, timeoutMs = LANGUAGE_SWITCH_TIMEOUT_MS }: LanguageSwitcherDeps,
): LanguageSwitcher {
  let state: LanguageSwitchState = { messages: initial, pending: null, failed: null };
  let lastId = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();

  const dispatch = (action: LanguageSwitchAction) => {
    const next = languageSwitchReducer(state, action);
    if (next === state) return;
    // The timeout belongs to the pending request, so it ends when that request settles or is replaced.
    if (next.pending !== state.pending) clearTimeout(timeout);
    const applied = next.messages !== state.messages;
    state = next;
    if (applied) persist(next.messages.language);
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    request(language) {
      const id = ++lastId;
      dispatch({ type: 'request', id, language });
      if (state.pending?.id !== id) return;
      timeout = setTimeout(() => {
        console.warn(`[i18n] Loading language "${language}" timed out after ${timeoutMs} ms`);
        dispatch({ type: 'failed', id });
      }, timeoutMs);
      load(language).then(
        (messages) => dispatch({ type: 'loaded', id, messages }),
        (e) => {
          console.warn(`[i18n] Failed to load language "${language}":`, e);
          dispatch({ type: 'failed', id });
        },
      );
    },
    dismiss: () => dispatch({ type: 'dismiss' }),
    dispose: () => clearTimeout(timeout),
  };
}
