"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  className = "",
  placeholder = "搜索内容...",
  autoFocus = false,
  value: externalValue,
  onChange: externalOnChange,
  onFocus,
  onSearch,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showShortcut, setShowShortcut] = useState(true);
  const router = useRouter();

  // Support both controlled and uncontrolled modes
  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = externalOnChange || setInternalValue;

  const handleClear = useCallback(() => {
    setValue("");
  }, [setValue]);

  // Listen for Cmd/Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      // Escape key to clear input when focused
      if (e.key === 'Escape' && focused) {
        e.preventDefault();
        handleClear();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focused, handleClear]);

  // Hide shortcut hint when user starts typing
  useEffect(() => {
    if (value) setShowShortcut(false);
    else setShowShortcut(true);
  }, [value]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value.trim());
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  }, [value, onSearch, router]);

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div
        className={`relative rounded-xl transition-all duration-250 ${
          focused ? "scale-[1.02]" : ""
        }`}
        style={{
          backgroundColor: 'var(--surface-glass)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${focused ? 'var(--border-focus)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: focused
            ? '0 0 0 3px rgba(3, 105, 161, 0.15), var(--shadow-glass)'
            : 'var(--shadow-sm)',
        }}
      >
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-11 px-4 py-2 pl-11 rounded-xl transition-colors bg-transparent"
          style={{ color: 'var(--text-primary)' }}
          role="searchbox"
          aria-label={placeholder}
          autoComplete="off"
        />
        {/* Keyboard shortcut hint */}
        {showShortcut && !focused && (
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded border transition-opacity"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
              opacity: 0.7,
            }}
          >
            <span>⌘</span><span>K</span>
          </kbd>
        )}
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors"
          style={{ color: focused ? 'var(--color-primary)' : 'var(--text-tertiary)' }}
          aria-hidden="true"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all hover:scale-110"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--text-tertiary)'
            }}
            aria-label="清除搜索"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
