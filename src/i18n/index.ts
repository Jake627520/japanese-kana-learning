import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Language, TranslationSchema } from './types';
export type { Language, TranslationSchema };
import { zhTW } from './zh-TW';
import { zhCN } from './zh-CN';
import { en } from './en';
import { ko } from './ko';
import { es } from './es';

export * from './types';
export { localize } from './localize';

export const translations: Record<Language, TranslationSchema> = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  en: en,
  ko: ko,
  es: es,
};

export function isLanguage(v: unknown): v is Language {
  return typeof v === 'string' && Object.hasOwn(translations, v);
}

export const LANGUAGE_STORAGE_KEY = 'kana_learning_language';

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh-TW';

  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(saved)) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read language preference from localStorage:', e);
  }

  try {
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
    const lower = browserLang.toLowerCase();
    const primary = lower.split('-')[0];

    if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-mo') || lower.startsWith('zh-hant')) {
      return 'zh-TW';
    }
    if (lower.startsWith('zh-cn') || lower.startsWith('zh-sg') || lower.startsWith('zh-hans') || lower.startsWith('zh')) {
      return 'zh-CN';
    }
    if (lower.startsWith('en')) {
      return 'en';
    }
    if (primary === 'ko') {
      return 'ko';
    }
    if (primary === 'es') {
      return 'es';
    }
  } catch (e) {
    console.warn('Failed to detect browser language:', e);
  }

  return 'zh-TW';
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: TranslateParams) => string;
  tAroundCount: (path: string, count: number) => [before: string, after: string];
  dictionary: TranslationSchema;
}

const I18nContext = createContext<I18nContextType | null>(null);

function resolvePath(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  const segments = path.split('.');
  let current: unknown = obj;

  for (const seg of segments) {
    if (current && typeof current === 'object' && seg in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return current;
}

const pluralRules = new Map<Language, Intl.PluralRules>();

function pluralCategory(lang: Language, count: number): Intl.LDMLPluralRule {
  let rules = pluralRules.get(lang);
  if (!rules) {
    rules = new Intl.PluralRules(lang);
    pluralRules.set(lang, rules);
  }
  return rules.select(count);
}

// A plural form is the key plus a CLDR category suffix (`_one`, `_few`...).
// Locales add only the forms they need; everything else uses the bare key.
function lookup(lang: Language, path: string, count: number | undefined): string | undefined {
  const dictionary = translations[lang];
  if (count !== undefined) {
    const form = resolvePath(dictionary, `${path}_${pluralCategory(lang, count)}`);
    if (typeof form === 'string') return form;
  }
  const val = resolvePath(dictionary, path);
  return typeof val === 'string' ? val : undefined;
}

export type TranslateParams = Record<string, string | number>;

function template(lang: Language, path: string, count: number | undefined): string {
  const val = lookup(lang, path, count) ?? (lang === 'en' ? undefined : lookup('en', path, count));
  if (val === undefined) {
    console.warn(`[i18n] Translation missing for key: "${path}" in language: "${lang}"`);
    return path;
  }
  return val;
}

export function translate(lang: Language, path: string, params?: TranslateParams): string {
  const val = template(lang, path, typeof params?.count === 'number' ? params.count : undefined);
  if (!params) return val;
  return Object.entries(params).reduce(
    (acc, [key, replacement]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(replacement)),
    val,
  );
}

/**
 * The text before and after `{count}` in a count phrase, so the number can be
 * styled apart from its unit while the locale keeps its own spacing and order.
 */
export function translateAroundCount(lang: Language, path: string, count: number): [before: string, after: string] {
  const [before, after = ''] = template(lang, path, count).split('{count}');
  return [before, after];
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to persist language preference to localStorage:', e);
    }
  };

  const dictionary = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  const t = useMemo(
    () => (path: string, params?: TranslateParams) => translate(language, path, params),
    [language],
  );

  const tAroundCount = useMemo(
    () => (path: string, count: number) => translateAroundCount(language, path, count),
    [language],
  );

  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t, tAroundCount, dictionary } },
    children
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
