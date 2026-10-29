import { Language } from '../../i18n';

/** Question id → explanation HTML in one language. */
export type JlptExplanations = Record<string, string>;

// Explanations are most of the JLPT data; one chunk per language keeps the other four off the wire.
const loaders: Record<Language, () => Promise<JlptExplanations>> = {
  'zh-TW': () => import('./explanations.zh-TW').then((m) => m.explanations),
  'zh-CN': () => import('./explanations.zh-CN').then((m) => m.explanations),
  en: () => import('./explanations.en').then((m) => m.explanations),
  ko: () => import('./explanations.ko').then((m) => m.explanations),
  es: () => import('./explanations.es').then((m) => m.explanations),
};

export function loadJlptExplanations(language: Language): Promise<JlptExplanations> {
  return loaders[language]();
}
