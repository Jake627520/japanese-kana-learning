import { Language } from '../i18n';
import { JlptExplanations } from '../data/jlpt/explanations';
import { explanations as zhTW } from '../data/jlpt/explanations.zh-TW';
import { explanations as zhCN } from '../data/jlpt/explanations.zh-CN';
import { explanations as en } from '../data/jlpt/explanations.en';
import { explanations as ko } from '../data/jlpt/explanations.ko';
import { explanations as es } from '../data/jlpt/explanations.es';

export const JLPT_EXPLANATIONS: Record<Language, JlptExplanations> = { 'zh-TW': zhTW, 'zh-CN': zhCN, en, ko, es };
