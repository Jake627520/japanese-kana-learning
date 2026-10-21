import { describe, it, expect, vi, afterEach } from 'vitest';
import { getInitialLanguage, isLanguage, localize, translations, LANGUAGE_STORAGE_KEY, Language } from './index';

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
