"use client";

import { useState, useEffect } from "react";
import { X, History } from "lucide-react";
import Button from "./Button";

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  onClear: () => void;
}

export default function SearchHistory({ onSelect, onClear }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);
  const STORAGE_KEY = "search_history";
  const MAX_HISTORY = 20;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    const newHistory = [
      query,
      ...history.filter((h) => h !== query),
    ].slice(0, MAX_HISTORY);

    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const removeFromHistory = (query: string) => {
    const newHistory = history.filter((h) => h !== query);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    onClear();
  };

  // 暴露方法给父组件
  useEffect(() => {
    (window as any).__searchHistoryAdd = addToHistory;
    (window as any).__searchHistoryClear = clearAllHistory;
    return () => {
      delete (window as any).__searchHistoryAdd;
      delete (window as any).__searchHistoryClear;
    };
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <History className="w-4 h-4" aria-hidden="true" />
          搜索历史
        </span>
        <Button variant="ghost" size="sm" onClick={clearAllHistory}>
          清除
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((query) => (
          <div
            key={query}
            className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <button
              onClick={() => onSelect(query)}
              className="hover:underline"
              style={{ color: 'var(--text-primary)' }}
            >
              {query}
            </button>
            <button
              onClick={() => removeFromHistory(query)}
              className="p-0.5 rounded hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label={`移除 ${query}`}
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
