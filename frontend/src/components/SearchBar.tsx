"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  className = "",
  placeholder = "搜索内容...",
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleClear() {
    setQuery("");
  }

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
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-11 px-4 py-2 pl-11 rounded-xl transition-colors bg-transparent"
          style={{ color: 'var(--text-primary)' }}
          aria-label="搜索"
        />
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors"
          style={{ color: focused ? 'var(--color-primary)' : 'var(--text-tertiary)' }}
          aria-hidden="true"
        />
        {query && (
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
