"use client";

import { useI18n } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";

export default function LanguageSelector() {
  const { locale, setLocale, availableLocales } = useI18n();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLocale = availableLocales.find((l) => l.locale === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-[var(--radius-sm)] transition-colors"
        style={{
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLocale?.name || "中文"}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-48 rounded-[var(--radius-md)] border shadow-lg z-[var(--z-dropdown)]"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
          }}
        >
          {availableLocales.map((loc) => (
            <button
              key={loc.locale}
              onClick={() => {
                setLocale(loc.locale);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-[var(--radius-md)] last:rounded-b-[var(--radius-md)]"
              style={{
                color: locale === loc.locale ? 'var(--color-primary)' : 'var(--text-primary)',
                backgroundColor: locale === loc.locale ? 'var(--color-primary-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (locale !== loc.locale) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (locale !== loc.locale) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{loc.name}</span>
              {locale === loc.locale && (
                <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
