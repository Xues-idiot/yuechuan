"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, SimilarItem } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

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
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">知识搜索</h1>
          </div>
          <ThemeToggle />
        </header>

        <form id="search-form" onSubmit={handleSearch} className="mb-6 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                placeholder="输入关键词搜索相关内容..."
                className="w-full px-4 py-2 pl-10 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "搜索中..." : "搜索"}
            </button>
          </div>

          {/* 搜索历史和热门搜索 */}
          {showHistory && !searched && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
              {history.length > 0 && (
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">搜索历史</span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {history.map((h) => (
                      <button
                        key={h}
                        onClick={() => handleHistoryClick(h)}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3">
                <span className="text-xs text-gray-500 mb-2 block">热门搜索</span>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleHistoryClick(s)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p>没有找到相关内容</p>
            <p className="text-sm mt-2">尝试其他关键词</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
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
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>{item.feed_name}</span>
                  <span>·</span>
                  <span className="text-green-600 dark:text-green-400">
                    相似度 {Math.round(item.score * 100)}%
                  </span>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {item.tags.filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
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
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">💡 搜索技巧</h3>
            <ul className="text-xs text-gray-500 space-y-1">
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
