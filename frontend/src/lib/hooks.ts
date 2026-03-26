"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface UseSearchOptions<T> {
  debounceMs?: number;
  onResults?: (results: T[]) => void;
}

export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  options: UseSearchOptions<T> = {}
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { debounceMs = 300, onResults } = options;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchFn(query);
        setResults(data);
        onResults?.(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Search failed"));
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, searchFn, debounceMs, onResults]);

  return { query, setQuery, results, loading, error };
}

export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<T[]>,
  options: { pageSize?: number; threshold?: number } = {}
) {
  const { pageSize = 20, threshold = 100 } = options;
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);
    try {
      const newItems = await fetchFn(page);
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...newItems]);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Load failed"));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSize, loading, hasMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - threshold
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore, threshold]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, loading, hasMore, error, loadMore, reset };
}

export function useKeyboardShortcuts(
  shortcuts: Record<string, () => void>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框中的按键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = [
        e.ctrlKey && "ctrl",
        e.shiftKey && "shift",
        e.altKey && "alt",
        e.metaKey && "meta",
        e.key,
      ]
        .filter(Boolean)
        .join("+");

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export function use阅读时长估算(content: string) {
  const [estimatedMinutes, setEstimatedMinutes] = useState(1);

  useEffect(() => {
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    const totalMinutes = chineseChars / 400 + englishWords / 200;
    setEstimatedMinutes(Math.max(1, Math.ceil(totalMinutes)));
  }, [content]);

  return estimatedMinutes;
}
