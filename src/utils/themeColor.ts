// Canvas 不認得 CSS 變數，畫之前先從 <html> 取出目前主題的實際色值。
export function themeColor(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
