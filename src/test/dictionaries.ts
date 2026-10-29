import { Language, Messages, TranslationSchema } from '../i18n';
import { zhTW } from '../i18n/zh-TW';
import { zhCN } from '../i18n/zh-CN';
import { en } from '../i18n/en';
import { ko } from '../i18n/ko';
import { es } from '../i18n/es';

export const DICTIONARIES: Record<Language, TranslationSchema> = { 'zh-TW': zhTW, 'zh-CN': zhCN, en, ko, es };

export const messages = (language: Language): Messages => ({ language, dictionary: DICTIONARIES[language] });
