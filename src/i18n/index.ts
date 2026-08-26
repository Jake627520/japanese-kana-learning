import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Language, TranslationSchema } from './types';
import { zhTW } from './zh-TW';
import { zhCN } from './zh-CN';
import { en } from './en';

export * from './types';

export const translations: Record<Language, TranslationSchema> = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  en: en,
};

export const LANGUAGE_STORAGE_KEY = 'kana_learning_language';

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh-TW';

  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (saved && (saved === 'zh-TW' || saved === 'zh-CN' || saved === 'en')) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read language preference from localStorage:', e);
  }

  try {
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
    const lower = browserLang.toLowerCase();

    if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-mo') || lower.startsWith('zh-hant')) {
      return 'zh-TW';
    }
    if (lower.startsWith('zh-cn') || lower.startsWith('zh-sg') || lower.startsWith('zh-hans') || lower.startsWith('zh')) {
      return 'zh-CN';
    }
    if (lower.startsWith('en')) {
      return 'en';
    }
  } catch (e) {
    console.warn('Failed to detect browser language:', e);
  }

  return 'zh-TW';
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to persist language preference to localStorage:', e);
    }
  };

  const dictionary = useMemo(() => {
    return translations[language] || translations['zh-TW'];
  }, [language]);

  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>): string => {
      let val = resolvePath(dictionary, path);

      // Fallback to zh-TW if missing in current dictionary
      if (val === undefined && language !== 'zh-TW') {
        val = resolvePath(translations['zh-TW'], path);
      }

      if (typeof val !== 'string') {
        console.warn(`[i18n] Translation missing for key: "${path}" in language: "${language}"`);
        return path;
      }

      if (params) {
        return Object.entries(params).reduce((acc, [key, replacement]) => {
          return acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(replacement));
        }, val);
      }

      return val;
    };
  }, [dictionary, language]);

  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t, dictionary } },
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
