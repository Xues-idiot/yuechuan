"use client";

import { useState } from "react";

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  autoFocus?: boolean;
}

export default function SearchBox({
  placeholder = "搜索...",
  value,
  onChange,
  onSearch,
  autoFocus = false,
}: SearchBoxProps) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full px-4 py-2 pl-10 border rounded-lg transition-colors ${
          focused
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-gray-300 dark:border-gray-600"
        }`}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onSearch?.("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </form>
  );
}
