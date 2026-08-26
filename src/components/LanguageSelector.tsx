import React, { useState, useRef, useEffect } from 'react';
import { useI18n, Language } from '../i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'mobile';
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export function LanguageSelector({ variant = 'header' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useI18n();
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

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('header.selectLanguage')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#475569] hover:text-[#1E293B] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] active:scale-95 transition-all shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#00A86B]/30 ${
          isOpen ? 'ring-2 ring-[#00A86B]/40 border-[#00A86B]' : ''
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-[#00A86B]" />
        <span className="hidden sm:inline">{currentLangObj.label}</span>
        <span className="sm:hidden">{currentLangObj.flag}</span>
        <ChevronDown className={`w-3 h-3 text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('header.selectLanguage')}
          className="absolute right-0 mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#F0FDF7] text-[#00A86B]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00A86B]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
