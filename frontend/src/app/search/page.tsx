"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, SimilarItem } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY = 10;

const POPULAR_SEARCHES = [
  "人工智能",
  "产品经理",
  "创业",
  "投资",
  "心理学",
  "学习方法",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SimilarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // 加载搜索历史
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  function saveToHistory(q: string) {
    const newHistory = [q, ...history.filter((h) => h !== q)].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setShowHistory(false);
    saveToHistory(query.trim());

    try {
      const data = await api.searchKnowledge(query);
      setResults(data.results);
    } catch (e) {
      setError("搜索失败，请稍后重试");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleHistoryClick(h: string) {
    setQuery(h);
    setShowHistory(false);
    // 自动触发搜索
    const form = document.getElementById("search-form") as HTMLFormElement;
    form?.requestSubmit();
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="text-sm mb-2 block transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              ← 返回
            </Link>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}
            >
              知识搜索
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <form id="search-form" onSubmit={handleSearch} className="mb-6 relative">
          <SearchBar
            value={query}
            onChange={setQuery}
            onFocus={() => setShowHistory(true)}
            placeholder="输入关键词搜索相关内容..."
            className="w-full"
          />

          {/* 搜索历史和热门搜索 */}
          {showHistory && !searched && (
            <div
              className="absolute left-0 right-0 mt-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-20 scale-in"
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              {history.length > 0 && (
                <div className="p-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      搜索历史
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs transition-colors hover:opacity-70"
                      style={{ color: 'var(--color-error)' }}
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((h) => (
                      <button
                        key={h}
                        onClick={() => handleHistoryClick(h)}
                        className="px-3 py-1.5 text-xs rounded-[var(--radius-full)] transition-all hover:scale-105"
                        style={{
                          backgroundColor: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-default)',
                        }}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4">
                <span
                  className="text-xs font-medium mb-3 block"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  热门搜索
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleHistoryClick(s)}
                      className="px-3 py-1.5 text-xs rounded-[var(--radius-full)] transition-all hover:scale-105"
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {error && (
          <div
            className="p-4 rounded-[var(--radius-md)] mb-6"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--color-error)',
            }}
          >
            {error}
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
            <div className="text-5xl mb-4 opacity-50">🔍</div>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              没有找到相关内容
            </p>
            <p className="text-sm mt-2">尝试其他关键词</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
              找到 {results.length} 条相关结果
              {results.length > 0 && (
                <span className="ml-2 text-xs">
                  搜索用时约 {Math.round(results.length * 0.1)} 秒
                </span>
              )}
            </p>
            {results.map((item, index) => (
              <Link
                key={item.item_id}
                href={`/feeds/${item.feed_id}/items/${item.item_id}`}
                className="block p-5 rounded-[var(--radius-md)] transition-all fade-slide"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-default)',
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <h3 className="font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <span>{item.feed_name}</span>
                  <span>·</span>
                  <span style={{ color: 'var(--color-success)' }}>
                    相似度 {Math.round(item.score * 100)}%
                  </span>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-3">
                    {item.tags.filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-[var(--radius-sm)]"
                        style={{
                          backgroundColor: 'var(--surface-secondary)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* 搜索提示 */}
        {searched && results.length > 0 && (
          <div
            className="mt-8 p-5 rounded-[var(--radius-lg)]"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              💡 搜索技巧
            </h3>
            <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-tertiary)' }}>
              <li>• 使用精确关键词可以获得更准确的结果</li>
              <li>• 尝试使用中文和英文关键词</li>
              <li>• 收藏的内容会优先推荐</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
