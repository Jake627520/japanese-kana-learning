import { describe, it, expect } from 'vitest';
import { languageSwitchReducer, LanguageSwitchAction, LanguageSwitchState } from './languageSwitch';
import type { Messages } from './index';
import type { Language, TranslationSchema } from './types';

const messagesFor = (language: Language): Messages => ({ language, dictionary: {} as TranslationSchema });
const initial: LanguageSwitchState = { messages: messagesFor('en'), pending: null, failed: null };
const run = (...actions: LanguageSwitchAction[]) => actions.reduce(languageSwitchReducer, initial);

describe('language switch state', () => {
  it('shows the requested language as pending, then applies it', () => {
    expect(run({ type: 'request', id: 1, language: 'ko' }).pending?.language).toBe('ko');
    const done = run({ type: 'request', id: 1, language: 'ko' }, { type: 'loaded', id: 1, messages: messagesFor('ko') });
    expect(done).toEqual({ messages: messagesFor('ko'), pending: null, failed: null });
  });

  it('reports a failure for the language that failed and keeps the current one', () => {
    const state = run({ type: 'request', id: 1, language: 'ko' }, { type: 'failed', id: 1 });
    expect(state).toEqual({ messages: messagesFor('en'), pending: null, failed: 'ko' });
  });

  it('ignores an older request that resolves after a newer one', () => {
    const state = run(
      { type: 'request', id: 1, language: 'ko' },
      { type: 'request', id: 2, language: 'es' },
      { type: 'loaded', id: 1, messages: messagesFor('ko') },
    );
    expect(state.messages.language).toBe('en');
    expect(state.pending?.language).toBe('es');
  });

  it('does not report an older failure once a newer request succeeded', () => {
    const state = run(
      { type: 'request', id: 1, language: 'ko' },
      { type: 'request', id: 2, language: 'es' },
      { type: 'loaded', id: 2, messages: messagesFor('es') },
      { type: 'failed', id: 1 },
    );
    expect(state).toEqual({ messages: messagesFor('es'), pending: null, failed: null });
  });

  it('choosing the current language cancels the switch in flight', () => {
    const state = run(
      { type: 'request', id: 1, language: 'ko' },
      { type: 'request', id: 2, language: 'en' },
      { type: 'loaded', id: 1, messages: messagesFor('ko') },
    );
    expect(state).toEqual({ messages: messagesFor('en'), pending: null, failed: null });
  });

  it('a new request or a dismiss clears the failure notice', () => {
    const failed = [{ type: 'request', id: 1, language: 'ko' }, { type: 'failed', id: 1 }] as const;
    expect(run(...failed, { type: 'dismiss' }).failed).toBeNull();
    expect(run(...failed, { type: 'request', id: 2, language: 'es' }).failed).toBeNull();
  });
});
