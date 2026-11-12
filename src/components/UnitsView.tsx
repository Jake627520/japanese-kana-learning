import React, { useState } from 'react';
import { Volume2, ChevronLeft, Check, BookOpen, Lightbulb, ListOrdered } from 'lucide-react';
import { UNITS, getUnitText, type LearningUnit, type UnitLink } from '../data/unitsData';
import { ALL_LEARNABLE_KANA } from '../data/kanaData';
import { CONFUSABLE_GROUPS } from '../data/confusableData';
import { getCompletedUnitIds, setUnitCompleted } from '../utils/storage';
import { speakJapanese } from '../utils/speech';
import { useI18n } from '../i18n';
import type { KanaItem, NavigationTab } from '../types';

interface UnitsViewProps {
  /** 測試或深連結用：初始就打開的單元 id；平常不傳，顯示列表 */
  initialUnitId?: string | null;
  onNavigate: (tab: NavigationTab) => void;
  onStartStudyKana: (kana: KanaItem) => void;
  onPracticeWriting?: (kana: KanaItem) => void;
  onPracticeConfusionGroup?: (groupId: string) => void;
}

const KANA_BY_ID = new Map(ALL_LEARNABLE_KANA.map((k) => [k.id, k]));

export function UnitsView({
  initialUnitId,
  onNavigate,
  onStartStudyKana,
  onPracticeWriting,
  onPracticeConfusionGroup,
}: UnitsViewProps) {
  const { t, language } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(initialUnitId ?? null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => getCompletedUnitIds());

  const selected: LearningUnit | null = UNITS.find((u) => u.id === selectedId) ?? null;
  const selectedIndex = selected ? UNITS.indexOf(selected) : -1;

  const toggleComplete = (id: string) => {
    const next = setUnitCompleted(id, !completedIds.includes(id));
    setCompletedIds(next);
  };

  const handleLink = (link: UnitLink) => {
    if (link.tab === 'study' && link.kanaId) {
      const kana = KANA_BY_ID.get(link.kanaId);
      if (kana) {
        onStartStudyKana(kana);
        return;
      }
    }
    if (link.tab === 'writing' && link.kanaId && onPracticeWriting) {
      const kana = KANA_BY_ID.get(link.kanaId);
      if (kana) {
        onPracticeWriting(kana);
        return;
      }
    }
    if (link.tab === 'confusable' && link.groupId && onPracticeConfusionGroup) {
      onPracticeConfusionGroup(link.groupId);
      return;
    }
    onNavigate(link.tab);
  };

  const linkLabel = (link: UnitLink): string => {
    const base = t(`nav.${link.tab}`);
    if (link.tab === 'confusable' && link.groupId) {
      const group = CONFUSABLE_GROUPS.find((g) => g.id === link.groupId);
      if (group) {
        const chars = group.members
          .map((id) => KANA_BY_ID.get(id)?.kana)
          .filter(Boolean)
          .join('・');
        return chars ? `${base}（${chars}）` : base;
      }
    }
    if (link.kanaId) {
      const kana = KANA_BY_ID.get(link.kanaId);
      if (kana) return `${base}（${kana.kana}）`;
    }
    return base;
  };

  if (selected) {
    const isCompleted = completedIds.includes(selected.id);
    const kanaItems = selected.kanaIds
      .map((id) => KANA_BY_ID.get(id))
      .filter((k): k is KanaItem => Boolean(k));
    return (
      <div className="space-y-6">
        {/* 詳情頁首 */}
        <div className="bg-[color:var(--paper-bg)] p-6 rounded-3xl border border-[color:var(--paper-85)] shadow-xs">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1 text-xs font-bold text-[color:var(--ink-50)] hover:text-[color:var(--ink-24)] cursor-pointer mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('units.backToList')}
          </button>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-[color:var(--moss-50)]">
                {t('units.unitNumber', { number: selectedIndex + 1 })}
              </p>
              <h2 className="text-xl font-display font-bold text-[color:var(--ink-24)] mt-1">
                {getUnitText(selected.title, language)}
              </h2>
              <p className="text-xs text-[color:var(--ink-50)] mt-1">
                {getUnitText(selected.subtitle, language)}
              </p>
            </div>
            {isCompleted && (
              <span className="shrink-0 px-2.5 py-1 text-xs font-extrabold rounded-full bg-[color:var(--moss-93)] text-[color:var(--moss-50)]">
                {t('units.completedBadge')}
              </span>
            )}
          </div>
        </div>

        {/* 教學重點 */}
        <div className="bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] shadow-xs overflow-hidden">
          <div className="bg-[color:var(--paper-92a)] px-6 py-4 border-b border-[color:var(--kincha-86)]">
            <h3 className="text-base font-display font-bold text-[color:var(--kincha-47)] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t('units.teachingPoints')}
            </h3>
          </div>
          <div className="p-6">
            <ol className="space-y-3 list-decimal list-inside">
              {selected.teachingPoints.map((point, i) => (
                <li key={i} className="text-sm text-[color:var(--ink-33)] leading-relaxed">
                  {getUnitText(point, language)}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* 本單元假名：點了播 VOICEVOX 發音 */}
        <div className="bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[color:var(--paper-92)]">
            <h3 className="text-base font-display font-bold text-[color:var(--ink-24)]">
              {t('units.kanaInUnit')}
            </h3>
          </div>
          <div className="p-6">
            {kanaItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kanaItems.map((kana) => (
                  <button
                    key={kana.id}
                    onClick={() => speakJapanese(kana.kana)}
                    title={t('common.playAudio')}
                    className="flex flex-col items-center min-w-14 px-3 py-2 bg-[color:var(--paper-bg)] border border-[color:var(--paper-92)] rounded-2xl hover:border-[color:var(--moss-50)] hover:bg-[color:var(--moss-95)] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1 text-lg font-extrabold text-[color:var(--ink-24)]">
                      {kana.kana}
                      <Volume2 className="w-3.5 h-3.5 text-[color:var(--ink-50)]" />
                    </span>
                    <span className="text-[11px] font-bold text-[color:var(--moss-50)] uppercase">
                      {kana.romaji}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[color:var(--ink-50)] leading-relaxed">{t('units.noKanaNote')}</p>
            )}
          </div>
        </div>

        {/* 去練習 */}
        <div className="bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[color:var(--paper-92)]">
            <h3 className="text-base font-display font-bold text-[color:var(--ink-24)]">
              {t('units.practiceLinks')}
            </h3>
          </div>
          <div className="p-6 flex flex-wrap gap-2">
            {selected.links.map((link, i) => (
              <button
                key={`${link.tab}-${link.kanaId ?? ''}-${link.groupId ?? ''}-${i}`}
                onClick={() => handleLink(link)}
                className="px-4 py-2.5 rounded-2xl font-bold text-sm bg-gradient-to-br from-[color:var(--moss-50)] to-[color:var(--moss-43)] text-[color:var(--paper-95)] elev-green cursor-pointer"
              >
                {linkLabel(link)}
              </button>
            ))}
          </div>
        </div>

        {/* 驗收標準＋標示完成 */}
        <div className="bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] shadow-xs p-6 space-y-4">
          <div className="flex items-start gap-2 bg-[color:var(--paper-94)] p-3 rounded-xl text-xs text-[color:var(--kincha-47)]">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <span className="font-extrabold">{t('units.acceptance')}：</span>
              {getUnitText(selected.acceptance, language)}
            </span>
          </div>
          <button
            onClick={() => toggleComplete(selected.id)}
            className={`w-full px-4 py-3 rounded-2xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-[color:var(--paper-92)] text-[color:var(--ink-50)]'
                : 'bg-gradient-to-br from-[color:var(--moss-50)] to-[color:var(--moss-43)] text-[color:var(--paper-95)] elev-green'
            }`}
          >
            {isCompleted && <Check className="w-4 h-4" />}
            {isCompleted ? t('units.markIncomplete') : t('units.markComplete')}
          </button>
        </div>
      </div>
    );
  }

  // ── 列表 ──
  return (
    <div className="space-y-6">
      <div className="bg-[color:var(--paper-bg)] p-6 rounded-3xl border border-[color:var(--paper-85)] shadow-xs">
        <h2 className="text-xl font-display font-bold text-[color:var(--ink-24)] flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-[color:var(--moss-50)]" />
          {t('units.title')}
        </h2>
        <p className="text-xs text-[color:var(--ink-50)] mt-1">{t('units.subtitle')}</p>
        <p className="text-xs font-bold text-[color:var(--moss-50)] mt-3">
          {t('units.completedCount', { done: completedIds.length, total: UNITS.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {UNITS.map((unit, index) => {
          const isCompleted = completedIds.includes(unit.id);
          return (
            <button
              key={unit.id}
              onClick={() => setSelectedId(unit.id)}
              className="text-left p-5 bg-[color:var(--paper-bg)] border border-[color:var(--paper-85)] rounded-3xl shadow-xs hover:border-[color:var(--moss-50)] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-extrabold text-[color:var(--moss-50)]">
                  {t('units.unitNumber', { number: index + 1 })}
                </p>
                {isCompleted && (
                  <span className="shrink-0 px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-[color:var(--moss-93)] text-[color:var(--moss-50)]">
                    {t('units.completedBadge')}
                  </span>
                )}
              </div>
              <h3 className="text-base font-display font-bold text-[color:var(--ink-24)] mt-1">
                {getUnitText(unit.title, language)}
              </h3>
              <p className="text-xs text-[color:var(--ink-50)] mt-1 leading-relaxed">
                {getUnitText(unit.subtitle, language)}
              </p>
              {unit.kanaIds.length > 0 && (
                <p className="text-[11px] font-bold text-[color:var(--ink-62)] mt-2">
                  {t('common.kanaCount', { count: unit.kanaIds.length })}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
