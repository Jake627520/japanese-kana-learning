import type { Language } from './types';

export function localize(value: Partial<Record<Language, string>>, lang: Language): string {
  return value[lang] || value.en || '';
}
