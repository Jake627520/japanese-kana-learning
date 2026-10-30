// 視覺主題（試用中）。色票在 themes.css，這裡只負責「目前用哪一套」與載入該主題需要的字型。
// 'original' 不設 data-theme，走 :root 的原版色票，所以切回原版就是完全原本的樣子。

export type ThemeId = 'original' | 'aizome' | 'sakura' | 'yagaku';

export const THEMES: { id: ThemeId; label: string; swatch: [string, string] }[] = [
  { id: 'original', label: '原版・和紙', swatch: ['#F4EEDE', '#5C6B3D'] },
  { id: 'aizome', label: '藍染', swatch: ['#E8EFF8', '#31518F'] },
  { id: 'sakura', label: '桜餅', swatch: ['#FAEAEB', '#9A3E6C'] },
  { id: 'yagaku', label: '夜学（深色）', swatch: ['#0D131F', '#D5A237'] },
];

const STORAGE_KEY = 'kana-theme';

const THEME_FONTS: Partial<Record<ThemeId, string>> = {
  sakura: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap',
};

function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function getInitialTheme(): ThemeId {
  // ?theme=aizome 方便直接分享某個主題的預覽連結
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  if (isThemeId(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    // 無痕模式或封鎖儲存時就用原版
  }
  return 'original';
}

export function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  if (theme === 'original') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);

  const fontHref = THEME_FONTS[theme];
  if (fontHref && !document.querySelector(`link[href="${fontHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontHref;
    document.head.appendChild(link);
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 存不了也沒關係，只是下次打開回到原版
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}
