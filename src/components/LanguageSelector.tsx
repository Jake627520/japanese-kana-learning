import React, { useState, useRef, useEffect } from 'react';
import { useI18n, Language } from '../i18n';
import { Globe, Check, ChevronDown, Loader2, RefreshCw } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'mobile';
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector({ variant = 'header' }: LanguageSelectorProps) {
  const { language, setLanguage, pendingLanguage, failedLanguage, dismissLanguageError, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Every menu closes once the new language is on screen; until then it stays open
  // so a failure is reported where the click happened.
  useEffect(() => {
    setIsOpen(false);
  }, [language]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    if (code === language) setIsOpen(false);
  };

  const failedLabel = LANGUAGES.find((l) => l.code === failedLanguage)?.label;

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          dismissLanguageError();
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('header.selectLanguage')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9CDB2] bg-[#F4EEDE] text-xs font-bold text-[#55503F] hover:text-[#221F18] hover:border-[#CABFA6] hover:bg-[#F0E9D8] active:scale-95 transition-all shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#5C6B3D]/30 ${
          isOpen ? 'ring-2 ring-[#5C6B3D]/40 border-[#5C6B3D]' : ''
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-[#5C6B3D]" />
        <span className="hidden sm:inline">{currentLangObj.label}</span>
        <span className="sm:hidden">{currentLangObj.flag}</span>
        <ChevronDown className={`w-3 h-3 text-[#8F8674] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('header.selectLanguage')}
          className="absolute right-0 mt-1.5 w-40 bg-[#F4EEDE] rounded-2xl shadow-xl border border-[#D9CDB2] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                disabled={pendingLanguage !== null}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer disabled:cursor-wait text-left ${
                  isSelected
                    ? 'bg-[#EEF0E3] text-[#5C6B3D]'
                    : 'text-[#55503F] hover:bg-[#F0E9D8] hover:text-[#221F18]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {pendingLanguage === lang.code ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#8F8674] animate-spin" />
                ) : (
                  isSelected && <Check className="w-3.5 h-3.5 text-[#5C6B3D]" />
                )}
              </button>
            );
          })}
          {failedLabel && (
            <div role="alert" className="mx-1.5 mt-1 px-2.5 py-2 rounded-xl bg-[#EFDBD5] space-y-2">
              <p className="text-[11px] leading-snug font-semibold text-[#A6443A]">
                {t('header.languageLoadFailed', { language: failedLabel })}
              </p>
              {/* A failed chunk import is cached for the page's lifetime, so only a reload can refetch it. */}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-[#F1EFE0] bg-[#5C6B3D] hover:bg-[#47552F] rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                {t('common.reloadPage')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
