import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LanguageSelector } from './LanguageSelector';
import { I18nContext, Language, translate, translateAroundCount } from '../i18n';
import { messages } from '../test/dictionaries';

// The menu starts closed, so this is what a viewer sees after closing it mid-switch.
const renderClosed = (failedLanguage: Language | null) => {
  const en = messages('en');
  const value = {
    language: 'en' as const,
    setLanguage: () => {},
    pendingLanguage: null,
    failedLanguage,
    dismissLanguageError: () => {},
    t: (path: string, params?: Record<string, string | number>) => translate(en, path, params),
    tAroundCount: (path: string, count: number) => translateAroundCount(en, path, count),
  };
  return renderToStaticMarkup(createElement(I18nContext.Provider, { value }, createElement(LanguageSelector)));
};

describe('LanguageSelector failure notice', () => {
  it('announces a failed switch with the menu closed, with reload and dismiss controls', () => {
    const html = renderClosed('ko');
    expect(html).not.toContain('role="listbox"');
    expect(html).toMatch(/<div role="alert"[^>]*>.*Couldn&#x27;t load 한국어\./);
    expect(html).toContain('Reload Page');
    expect(html).toContain('aria-label="Close"');
  });

  it('shows nothing once the failure is cleared', () => {
    expect(renderClosed(null)).not.toContain('role="alert"');
  });
});
