import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Palette } from 'lucide-react';
import { THEMES, ThemeId, applyTheme, getInitialTheme } from '../theme';

export function ThemePicker() {
  const [theme, setTheme] = useState<ThemeId>(getInitialTheme);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (id: ThemeId) => {
    applyTheme(id);
    setTheme(id);
    setIsOpen(false);
  };

  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Theme"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[color:var(--paper-85)] bg-[color:var(--paper-bg)] whitespace-nowrap text-xs font-bold text-[color:var(--ink-43)] hover:text-[color:var(--ink-24)] hover:border-[color:var(--paper-81)] hover:bg-[color:var(--paper-93)] active:scale-95 transition-all shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[color:var(--moss-50)]/30 ${
          isOpen ? 'ring-2 ring-[color:var(--moss-50)]/40 border-[color:var(--moss-50)]' : ''
        }`}
      >
        <Palette className="w-3.5 h-3.5 text-[color:var(--moss-50)]" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`w-3 h-3 text-[color:var(--ink-62)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 mt-1.5 w-44 z-50 bg-[color:var(--paper-bg)] rounded-2xl shadow-xl border border-[color:var(--paper-85)] py-1.5"
        >
          {THEMES.map((item) => {
            const isSelected = item.id === theme;
            return (
              <button
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[color:var(--moss-95)] text-[color:var(--moss-50)]'
                    : 'text-[color:var(--ink-43)] hover:bg-[color:var(--paper-93)] hover:text-[color:var(--ink-24)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {/* 色塊用固定色碼：不論目前是哪個主題，都要看得到該主題本身的底色與主色 */}
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ background: `linear-gradient(135deg, ${item.swatch[0]} 50%, ${item.swatch[1]} 50%)` }}
                  />
                  {item.label}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[color:var(--moss-50)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
