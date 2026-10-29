import { describe, it, expect, vi, afterEach } from 'vitest';
import { getInitialLanguage, isLanguage, localize, translate, translateAroundCount, translations, LANGUAGE_STORAGE_KEY, Language } from './index';
import { formatNextReviewText } from '../utils/storage';

const stubBrowserLanguage = (language: string) => vi.stubGlobal('navigator', { language });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getInitialLanguage：瀏覽器語言偵測', () => {
  it.each<[string, Language]>([
    ['ko-KR', 'ko'],
    ['ko', 'ko'],
    ['es-ES', 'es'],
    ['es-419', 'es'],
    ['es', 'es'],
    ['en-US', 'en'],
    ['zh-TW', 'zh-TW'],
    ['zh-CN', 'zh-CN'],
  ])('%s -> %s', (browser, expected) => {
    stubBrowserLanguage(browser);
    expect(getInitialLanguage()).toBe(expected);
  });

  it('不支援的語言退回 zh-TW', () => {
    stubBrowserLanguage('fr-FR');
    expect(getInitialLanguage()).toBe('zh-TW');
  });

  it('不把 ko、es 開頭的其他語言碼誤判（kok、est）', () => {
    stubBrowserLanguage('kok-IN');
    expect(getInitialLanguage()).toBe('zh-TW');
    stubBrowserLanguage('est');
    expect(getInitialLanguage()).toBe('zh-TW');
  });

  it.each<Language>(['ko', 'es'])('已儲存的 %s 優先於瀏覽器語言', (saved) => {
    stubBrowserLanguage('en-US');
    localStorage.setItem(LANGUAGE_STORAGE_KEY, saved);
    expect(getInitialLanguage()).toBe(saved);
  });

  it('已儲存的值不是支援的語言時，改用瀏覽器語言', () => {
    stubBrowserLanguage('ko-KR');
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
    expect(getInitialLanguage()).toBe('ko');
  });
});

describe('isLanguage', () => {
  it('接受 registry 裡的每個語言，拒絕其他值', () => {
    for (const lang of Object.keys(translations)) expect(isLanguage(lang)).toBe(true);
    for (const bad of ['fr', 'toString', '', null, 3]) expect(isLanguage(bad)).toBe(false);
  });
});

describe('localize：缺少的語言退回英文', () => {
  const partial = { 'zh-TW': '學校', en: 'school' };

  it('有當前語言就用當前語言', () => {
    expect(localize({ ...partial, ko: '학교' }, 'ko')).toBe('학교');
  });

  it('缺當前語言時用英文，而不是 zh-TW', () => {
    expect(localize(partial, 'ko')).toBe('school');
    expect(localize(partial, 'es')).toBe('school');
    expect(localize(partial, 'zh-CN')).toBe('school');
  });

  it('空字串視為缺少', () => {
    expect(localize({ ...partial, es: '' }, 'es')).toBe('school');
  });
});

describe('translate：依 count 選複數形', () => {
  it('count 為 1 時，en、es 用 _one 形', () => {
    expect(translate('en', 'chat.rowQuizIntro', { row: 'ん行', count: 1 })).toBe('ん行 done! Quick quiz: 1 question ✏️');
    expect(translate('es', 'chat.rowQuizIntro', { row: 'ん行', count: 1 })).toBe('¡Terminaste la fila ん行! Test rápido: 1 pregunta ✏️');
    expect(translate('es', 'analytics.recommendationSrsDue', { count: 1 })).toMatch(/^Tienes 1 kana pendiente de repaso\./);
  });

  it('其他數量用原本的 key', () => {
    expect(translate('en', 'chat.rowQuizIntro', { row: 'あ行', count: 5 })).toBe('あ行 done! Quick quiz: 5 questions ✏️');
    expect(translate('es', 'header.streakDays', { count: 0 })).toBe('0 días');
  });

  it('沒有複數形的語言照常用原本的 key', () => {
    expect(translate('ko', 'chat.rowQuizIntro', { row: 'ん行', count: 1 })).toBe('ん行 완료! 짧은 퀴즈 1문제 ✏️');
  });

  it('count 是字串時不選複數形', () => {
    expect(translate('en', 'header.streakDays', { count: '1' })).toBe('1 days');
  });
});

describe('數字＋單位的間距由各語系決定', () => {
  it.each<[Language, string, string]>([
    ['ko', '5일', '5개'],
    ['zh-TW', '5 天', '5 個'],
    ['zh-CN', '5 天', '5 个'],
    ['en', '5 days', '5 kana'],
    ['es', '5 días', '5 kana'],
  ])('%s', (lang, days, kana) => {
    expect(translate(lang, 'header.streakDays', { count: 5 })).toBe(days);
    expect(translate(lang, 'common.kanaCount', { count: 5 })).toBe(kana);
  });

  it('en、es 的 1 用單數', () => {
    expect(translate('en', 'header.streakDays', { count: 1 })).toBe('1 day');
    expect(translate('es', 'header.streakDays', { count: 1 })).toBe('1 día');
  });
});

describe('translateAroundCount：數字前後的文字，讓數字能單獨放大', () => {
  it.each<[Language, number, string, string]>([
    ['zh-TW', 5, '', ' 天'],
    ['ko', 5, '', '일'],
    ['en', 5, '', ' days'],
    ['en', 1, '', ' day'],
    ['es', 1, '', ' día'],
  ])('%s %i -> [%s, %s]', (lang, count, before, after) => {
    expect(translateAroundCount(lang, 'header.streakDays', count)).toEqual([before, after]);
  });

  it('前後文字夾住數字後等於 translate 的結果', () => {
    for (const lang of Object.keys(translations) as Language[]) {
      for (const count of [0, 1, 2, 7, 11]) {
        for (const key of ['header.streakDays', 'common.kanaCount']) {
          const [before, after] = translateAroundCount(lang, key, count);
          expect(before + count + after).toBe(translate(lang, key, { count }));
        }
      }
    }
  });
});

describe('formatNextReviewText：下次複習時間依語言顯示', () => {
  const now = Date.UTC(2026, 0, 1);
  const minute = 60 * 1000;
  const fmt = (lang: Language, at: string | number | null) =>
    formatNextReviewText(at, (path, params) => translate(lang, path, params), now);

  it('未排程、已到期', () => {
    expect(fmt('en', null)).toBe('Not scheduled');
    expect(fmt('en', 'not a date')).toBe('Not scheduled');
    expect(fmt('ko', now - minute)).toBe('지금');
    expect(fmt('zh-TW', now)).toBe('已到期');
  });

  it.each<[Language, number, string]>([
    ['zh-TW', 30 * minute, '30 分鐘後'],
    ['en', 30 * minute, 'in 30 minutes'],
    ['en', 20 * 1000, 'in 1 minute'],
    ['ko', 3 * 60 * minute, '3시간 후'],
    ['es', 60 * minute, 'en 1 hora'],
    ['es', 2 * 24 * 60 * minute, 'en 2 días'],
  ])('%s +%ims -> %s', (lang, offset, expected) => {
    expect(fmt(lang, now + offset)).toBe(expected);
  });
});

describe('chat.welcomeMsg 的 {script} 用句中寫法', () => {
  it('es 句中小寫', () => {
    const script = translate('es', 'chat.scriptHiragana');
    expect(translate('es', 'chat.welcomeMsg', { script })).toContain('Te guiaré por el hiragana');
  });
});
