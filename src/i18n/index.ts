import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef, useCallback } from 'react';
import { Language, TranslationSchema } from './types';
export type { Language, TranslationSchema };

export * from './types';
export { localize } from './localize';

// Each dictionary is its own chunk, so a visitor downloads only the language in use.
const dictionaryLoaders: Record<Language, () => Promise<TranslationSchema>> = {
  'zh-TW': () => import('./zh-TW').then((m) => m.zhTW),
  'zh-CN': () => import('./zh-CN').then((m) => m.zhCN),
  en: () => import('./en').then((m) => m.en),
  ko: () => import('./ko').then((m) => m.ko),
  es: () => import('./es').then((m) => m.es),
};

export const LANGUAGES = Object.keys(dictionaryLoaders) as Language[];

/** A dictionary together with the language whose plural rules it follows. */
export interface Messages {
  language: Language;
  dictionary: TranslationSchema;
}

export async function loadMessages(language: Language): Promise<Messages> {
  return { language, dictionary: await dictionaryLoaders[language]() };
}

/**
 * The dictionary to boot with: the wanted language, else the first other one that loads.
 * A chunk fails when it was never cached and the network is down, or after a deploy
 * removed it; any working language beats a blank page. zh-TW and en come first as the
 * most used. The stored preference is left alone so the wanted language returns once
 * its chunk can load again. Resolves to null when nothing loads.
 */
export async function loadBootMessages(wanted: Language, load = loadMessages): Promise<Messages | null> {
  for (const language of new Set<Language>([wanted, 'zh-TW', 'en', ...LANGUAGES])) {
    try {
      return await load(language);
    } catch (e) {
      console.warn(`[i18n] Failed to load language "${language}":`, e);
    }
  }
  return null;
}

export function isLanguage(v: unknown): v is Language {
  return typeof v === 'string' && Object.hasOwn(dictionaryLoaders, v);
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
  /** Rejects when the dictionary cannot load; the current language stays in place. */
  setLanguage: (lang: Language) => Promise<void>;
  t: (path: string, params?: TranslateParams) => string;
  tAroundCount: (path: string, count: number) => [before: string, after: string];
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
// There is no fallback to another language: TranslationSchema and validate-i18n
// already require every dictionary to be complete.
function template({ language, dictionary }: Messages, path: string, count: number | undefined): string {
  if (count !== undefined) {
    const form = resolvePath(dictionary, `${path}_${pluralCategory(language, count)}`);
    if (typeof form === 'string') return form;
  }
  const val = resolvePath(dictionary, path);
  if (typeof val === 'string') return val;
  console.warn(`[i18n] Translation missing for key: "${path}" in language: "${language}"`);
  return path;
}

export type TranslateParams = Record<string, string | number>;

export function translate(messages: Messages, path: string, params?: TranslateParams): string {
  const val = template(messages, path, typeof params?.count === 'number' ? params.count : undefined);
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
export function translateAroundCount(messages: Messages, path: string, count: number): [before: string, after: string] {
  const [before, after = ''] = template(messages, path, count).split('{count}');
  return [before, after];
}

/** `initial` must already be loaded so the first render never shows raw keys. */
export function I18nProvider({ initial, children }: { initial: Messages; children: ReactNode }) {
  const [messages, setMessages] = useState(initial);
  const requested = useRef(initial.language);
  const { language } = messages;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // The current dictionary stays on screen until the new one has loaded.
  const setLanguage = useCallback(async (lang: Language) => {
    requested.current = lang;
    const next = await loadMessages(lang);
    if (requested.current !== lang) return;
    setMessages(next);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to persist language preference to localStorage:', e);
    }
  }, []);

  const value = useMemo<I18nContextType>(
    () => ({
      language,
      setLanguage,
      t: (path, params) => translate(messages, path, params),
      tAroundCount: (path, count) => translateAroundCount(messages, path, count),
    }),
    [messages, language, setLanguage],
  );

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
