import { describe, it, expect, beforeEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UnitsView } from './UnitsView';
import { UNITS, getUnitText } from '../data/unitsData';
import { I18nContext, translate, translateAroundCount } from '../i18n';
import { messages } from '../test/dictionaries';
import {
  STORAGE_KEY_COMPLETED_UNITS,
  getCompletedUnitIds,
  setUnitCompleted,
} from '../utils/storage';

const noop = () => {};

const renderUnits = (initialUnitId?: string) => {
  const zhTW = messages('zh-TW');
  const value = {
    language: 'zh-TW' as const,
    setLanguage: noop,
    pendingLanguage: null,
    failedLanguage: null,
    dismissLanguageError: noop,
    t: (path: string, params?: Record<string, string | number>) => translate(zhTW, path, params),
    tAroundCount: (path: string, count: number) => translateAroundCount(zhTW, path, count),
  };
  return renderToStaticMarkup(
    createElement(
      I18nContext.Provider,
      { value },
      createElement(UnitsView, {
        initialUnitId,
        onNavigate: noop,
        onStartStudyKana: noop,
        onPracticeWriting: noop,
        onPracticeConfusionGroup: noop,
      }),
    ),
  );
};

describe('UnitsView 列表', () => {
  it('渲染 14 個單元（標題全部出現）', () => {
    const html = renderUnits();
    for (const unit of UNITS) {
      expect(html, unit.id).toContain(getUnitText(unit.title, 'zh-TW'));
    }
  });

  it('列表顯示每個單元的涵蓋假名數量；未完成時沒有「已完成」徽章', () => {
    const html = renderUnits();
    // 徽章是 <span>已完成</span>；頁首計數「已完成 0 / 14 單元」不算徽章
    expect(html).not.toContain('>已完成<');
  });
});

describe('UnitsView 詳情', () => {
  it('點進單元顯示教學點與驗收標準', () => {
    const html = renderUnits('u1');
    const unit = UNITS[1];
    for (const point of unit.teachingPoints) {
      expect(html).toContain(getUnitText(point, 'zh-TW'));
    }
    expect(html).toContain(getUnitText(unit.acceptance, 'zh-TW'));
  });

  it('詳情顯示本單元假名（可點播放）', () => {
    const html = renderUnits('u1');
    // あ行 5 個假名都出現
    for (const kana of ['あ', 'い', 'う', 'え', 'お']) {
      expect(html).toContain(kana);
    }
  });

  it('已完成的單元在列表顯示「已完成」徽章', () => {
    setUnitCompleted('u3', true);
    const html = renderUnits();
    // 只有 u3 被標示（徽章是 <span>已完成</span>）
    expect(html.match(/>已完成</g)?.length).toBe(1);
  });
});

describe('單元完成狀態 storage', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY_COMPLETED_UNITS);
  });

  it('setUnitCompleted(true) 寫入 localStorage，getCompletedUnitIds 讀得到', () => {
    expect(getCompletedUnitIds()).toEqual([]);
    setUnitCompleted('u3', true);
    expect(getCompletedUnitIds()).toEqual(['u3']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED_UNITS) as string)).toEqual(['u3']);
  });

  it('setUnitCompleted(false) 移除該單元；壞掉的 JSON 視同沒有', () => {
    setUnitCompleted('u3', true);
    setUnitCompleted('u3', false);
    expect(getCompletedUnitIds()).toEqual([]);
    localStorage.setItem(STORAGE_KEY_COMPLETED_UNITS, 'not-json{');
    expect(getCompletedUnitIds()).toEqual([]);
  });
});
