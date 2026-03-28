"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Search, Filter, X, Clock, Bookmark } from "lucide-react";

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

  const clearFilters = () => {
    setFilters({ is_read: undefined, is_starred: undefined, tags: "" });
    setQuery("");
    setResults([]);
    setTotal(0);
  };

  const hasActiveFilters = filters.is_read !== undefined || filters.is_starred !== undefined || filters.tags !== "";

  return (
    <div
      className="p-6 rounded-[var(--radius-lg)] border"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-glass)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-primary-light)' }}
        >
          <Search className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            高级搜索
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            通过关键词、状态和标签筛选内容
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            type="text"
            placeholder="搜索标题、内容、摘要..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-md)] border transition-all input"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-default)',
            }}
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>筛选:</span>
          </div>

          <select
            value={filters.is_read === undefined ? "" : String(filters.is_read)}
            onChange={(e) =>
              setFilters({
                ...filters,
                is_read: e.target.value === "" ? undefined : e.target.value === "true",
              })
            }
            className="px-3 py-1.5 rounded-[var(--radius-sm)] border text-sm transition-all"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: filters.is_read !== undefined ? 'var(--color-primary)' : 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
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
            className="px-3 py-1.5 rounded-[var(--radius-sm)] border text-sm transition-all"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: filters.is_starred !== undefined ? 'var(--color-primary)' : 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="">全部收藏</option>
            <option value="true">已收藏</option>
            <option value="false">未收藏</option>
          </select>

          <input
            type="text"
            placeholder="标签 (逗号分隔)"
            value={filters.tags}
            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded-[var(--radius-sm)] border text-sm input"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: filters.tags ? 'var(--color-primary)' : 'var(--border-default)',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-[var(--radius-md)] font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                搜索中...
              </span>
            ) : (
              '搜索'
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-[var(--radius-md)] font-medium transition-all hover:opacity-70"
              style={{
                backgroundColor: 'var(--surface-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {total > 0 && (
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-default)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              找到 <span style={{ color: 'var(--color-primary)' }}>{total}</span> 条结果
            </span>
          </div>

          <div className="space-y-3">
            {results.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-[var(--radius-md)] border transition-all hover:shadow-[var(--shadow-card-hover)]"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="font-medium text-sm truncate mb-1" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-1">
                    {item.is_read ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-unread)' }} />
                    )}
                    {item.is_read ? '已读' : '未读'}
                  </span>
                  {item.is_starred && (
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3" style={{ color: 'var(--color-starred)' }} />
                      已收藏
                    </span>
                  )}
                  {item.tags && (
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      #{item.tags}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
