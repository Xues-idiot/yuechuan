"use client";

import { useI18n } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";

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
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span className="text-lg">🌐</span>
        <span>{currentLocale?.name || "中文"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {availableLocales.map((loc) => (
            <button
              key={loc.locale}
              onClick={() => {
                setLocale(loc.locale);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                locale === loc.locale ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : ""
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
