import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createLanguageSwitcher,
  languageSwitchReducer,
  LanguageSwitchAction,
  LanguageSwitchState,
  LANGUAGE_SWITCH_TIMEOUT_MS,
} from './languageSwitch';
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

describe('language switcher', () => {
  const flush = async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve();
  };

  const setup = () => {
    const loads = new Map<Language, { resolve: (m: Messages) => void; reject: (e: unknown) => void }>();
    const persist = vi.fn();
    const switcher = createLanguageSwitcher(messagesFor('en'), {
      load: (language) => new Promise<Messages>((resolve, reject) => loads.set(language, { resolve, reject })),
      persist,
    });
    return { switcher, loads, persist };
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('a newer request supersedes the pending one, and the older result is ignored', async () => {
    const { switcher, loads, persist } = setup();
    switcher.request('ko');
    switcher.request('es');
    loads.get('ko')!.resolve(messagesFor('ko'));
    await flush();
    expect(switcher.getState()).toEqual({ messages: messagesFor('en'), pending: { id: 2, language: 'es' }, failed: null });

    loads.get('es')!.resolve(messagesFor('es'));
    await flush();
    expect(switcher.getState()).toEqual({ messages: messagesFor('es'), pending: null, failed: null });
    expect(persist.mock.calls).toEqual([['es']]);
  });

  it('a load that never settles fails after the timeout', () => {
    const { switcher } = setup();
    switcher.request('ko');
    vi.advanceTimersByTime(LANGUAGE_SWITCH_TIMEOUT_MS - 1);
    expect(switcher.getState().pending?.language).toBe('ko');
    vi.advanceTimersByTime(1);
    expect(switcher.getState()).toEqual({ messages: messagesFor('en'), pending: null, failed: 'ko' });
  });

  it('a load that arrives after the timeout is neither applied nor saved', async () => {
    const { switcher, loads, persist } = setup();
    switcher.request('ko');
    vi.advanceTimersByTime(LANGUAGE_SWITCH_TIMEOUT_MS);
    loads.get('ko')!.resolve(messagesFor('ko'));
    await flush();
    expect(switcher.getState()).toEqual({ messages: messagesFor('en'), pending: null, failed: 'ko' });
    expect(persist).not.toHaveBeenCalled();
  });

  it('the timeout ends when the request settles, is superseded or cancelled, or the switcher is disposed', async () => {
    const { switcher, loads } = setup();
    switcher.request('ko');
    expect(vi.getTimerCount()).toBe(1);
    loads.get('ko')!.reject(new Error('offline'));
    await flush();
    expect(switcher.getState().failed).toBe('ko');
    expect(vi.getTimerCount()).toBe(0);

    switcher.request('es');
    switcher.request('zh-TW');
    expect(vi.getTimerCount()).toBe(1);
    switcher.request('en');
    expect(vi.getTimerCount()).toBe(0);

    switcher.request('es');
    switcher.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('dismissing clears the failure, and so does a later switch that succeeds', async () => {
    const { switcher, loads } = setup();
    switcher.request('ko');
    vi.advanceTimersByTime(LANGUAGE_SWITCH_TIMEOUT_MS);
    switcher.dismiss();
    expect(switcher.getState().failed).toBeNull();

    switcher.request('ko');
    vi.advanceTimersByTime(LANGUAGE_SWITCH_TIMEOUT_MS);
    expect(switcher.getState().failed).toBe('ko');
    switcher.request('es');
    loads.get('es')!.resolve(messagesFor('es'));
    await flush();
    expect(switcher.getState()).toEqual({ messages: messagesFor('es'), pending: null, failed: null });
  });

  it('tells subscribers about each change', () => {
    const { switcher } = setup();
    const listener = vi.fn();
    switcher.subscribe(listener);
    switcher.request('ko');
    vi.advanceTimersByTime(LANGUAGE_SWITCH_TIMEOUT_MS);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
