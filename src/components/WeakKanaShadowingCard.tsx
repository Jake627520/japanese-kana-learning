import React from 'react';
import { NavigationTab } from '../types';
import { ALL_LEARNABLE_KANA } from '../data/kanaData';
import { SHADOWING_SENTENCES } from '../data/shadowing';
import { Target, Headphones, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';

interface Props {
  wrongKanaIds: string[];
  onNavigate: (tab: NavigationTab) => void;
}

const toHira = (c: string) =>
  c && c >= 'ァ' && c <= 'ヶ' ? String.fromCharCode(c.charCodeAt(0) - 0x60) : c;

export function WeakKanaShadowingCard({ wrongKanaIds, onNavigate }: Props) {
  const { t } = useI18n();
  const idToChar = new Map(ALL_LEARNABLE_KANA.map((k) => [k.id, k.kana] as const));
  const weakChars = [
    ...new Set(
      wrongKanaIds.map((id) => toHira(idToChar.get(id) || '')).filter(Boolean),
    ),
  ];
  if (weakChars.length === 0) return null;

  const weakSet = new Set(weakChars);
  const matches = SHADOWING_SENTENCES.map((s) => ({
    s,
    hit: (s.focusKana || []).filter((c) => weakSet.has(c)),
  }))
    .filter((x) => x.hit.length > 0)
    .sort((a, b) => b.hit.length - a.hit.length)
    .slice(0, 3);

  if (matches.length === 0) return null;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-[#00A86B]" />
        <h3 className="text-sm font-extrabold text-[#1E293B]">{t('home.weakShadowing.title')}</h3>
      </div>
      <p className="text-xs text-[#64748B] leading-relaxed">
        {t('home.weakShadowing.desc')}
        {weakChars.slice(0, 8).map((c) => (
          <span
            key={c}
            className="inline-block mx-0.5 px-1.5 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded font-bold"
          >
            {c}
          </span>
        ))}
      </p>
      <div className="space-y-2">
        {matches.map(({ s, hit }) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#F1F5F9]"
          >
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#1E293B] truncate">{s.japanese}</div>
              <div className="text-[11px] text-[#64748B]">
                {hit.map((c) => (
                  <span key={c} className="font-extrabold text-[#00A86B]">
                    {c}{' '}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onNavigate('shadowing')}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] transition-all cursor-pointer"
      >
        <Headphones className="w-4 h-4" /> {t('home.weakShadowing.btnPractice')} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
