"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    is_read: undefined as boolean | undefined,
    is_starred: undefined as boolean | undefined,
    tags: "",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await api.advancedSearch({
        q: query || undefined,
        is_read: filters.is_read,
        is_starred: filters.is_starred,
        tags: filters.tags || undefined,
      });
      setResults(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold mb-4">🔍 高级搜索</h3>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="搜索标题、内容、摘要..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
        />

        <div className="flex gap-2 flex-wrap">
          <select
            value={filters.is_read === undefined ? "" : String(filters.is_read)}
            onChange={(e) =>
              setFilters({
                ...filters,
                is_read: e.target.value === "" ? undefined : e.target.value === "true",
              })
            }
            className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm"
          >
            <option value="">全部状态</option>
            <option value="true">已读</option>
            <option value="false">未读</option>
          </select>

          <select
            value={filters.is_starred === undefined ? "" : String(filters.is_starred)}
            onChange={(e) =>
              setFilters({
                ...filters,
                is_starred: e.target.value === "" ? undefined : e.target.value === "true",
              })
            }
            className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm"
          >
            <option value="">全部收藏</option>
            <option value="true">已收藏</option>
            <option value="false">未收藏</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="标签 (逗号分隔)"
          value={filters.tags}
          onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "搜索中..." : "搜索"}
        </button>
      </div>

      {total > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          找到 {total} 条结果
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 border border-gray-100 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="font-medium text-sm truncate">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {item.is_read ? "✅" : "📖"} {item.is_starred ? "⭐" : ""}
                {item.tags && <span className="ml-2">🏷️ {item.tags}</span>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
