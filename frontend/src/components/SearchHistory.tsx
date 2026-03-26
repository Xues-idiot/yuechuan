"use client";

import { useState, useEffect } from "react";
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
        <span className="text-sm font-medium text-gray-500">搜索历史</span>
        <Button variant="ghost" size="sm" onClick={clearAllHistory}>
          清除
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((query) => (
          <div
            key={query}
            className="group inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
          >
            <button
              onClick={() => onSelect(query)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              {query}
            </button>
            <button
              onClick={() => removeFromHistory(query)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
