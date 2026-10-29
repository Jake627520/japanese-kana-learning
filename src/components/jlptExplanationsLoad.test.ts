import { describe, it, expect } from 'vitest';
import { explanationsReducer, offersReload, ExplanationsEvent, ExplanationsState } from './jlptExplanationsLoad';

const initial: ExplanationsState = { language: 'en', failures: 0, status: 'loading' };
const run = (...events: ExplanationsEvent[]) => events.reduce(explanationsReducer, initial);

describe('JLPT explanations: retry escalation', () => {
  it('a first failure offers only the in-place retry', () => {
    const state = run({ type: 'failed' });
    expect(state.status).toBe('failed');
    expect(offersReload(state)).toBe(false);
  });

  it('a retry that also fails offers a page reload', () => {
    expect(offersReload(run({ type: 'failed' }, { type: 'load', language: 'en' }, { type: 'failed' }))).toBe(true);
  });

  it('does not offer a reload while the retry is still loading', () => {
    expect(offersReload(run({ type: 'failed' }, { type: 'load', language: 'en' }))).toBe(false);
  });

  it('a successful load clears the failure count', () => {
    const state = run(
      { type: 'failed' },
      { type: 'load', language: 'en' },
      { type: 'loaded', byId: { q1: 'why' } },
      { type: 'load', language: 'en' },
      { type: 'failed' },
    );
    expect(offersReload(state)).toBe(false);
  });

  it('switching language starts the count over', () => {
    const state = run({ type: 'failed' }, { type: 'load', language: 'ko' }, { type: 'failed' });
    expect(state.language).toBe('ko');
    expect(offersReload(state)).toBe(false);
  });
});
