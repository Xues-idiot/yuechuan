"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api, Feed, ApiError } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import UnreadBadge from "@/components/UnreadBadge";
import { SkeletonFeedItem } from "@/components/Skeleton";

const PLATFORMS = [
  { value: "wechat", label: "微信公众号" },
  { value: "bilibili", label: "哔哩哔哩" },
  { value: "xiaohongshu", label: "小红书" },
  { value: "weibo", label: "微博" },
  { value: "zhihu", label: "知乎" },
];

// Icons
function RefreshIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newFeed, setNewFeed] = useState({ name: "", url: "", feed_type: "wechat" });
  const [submitting, setSubmitting] = useState(false);
  const [refreshingId, setRefreshingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState(false);

  async function handleRefreshAll() {
    if (refreshingAll) return;
    setRefreshingAll(true);
    try {
      const result = await api.refreshAllFeeds();
      let totalAdded = 0;
      for (const r of result.results) {
        totalAdded += r.added || 0;
      }
      alert(`刷新完成，新增 ${totalAdded} 篇内容`);
      loadFeeds();
    } catch (e) {
      alert("刷新失败");
    } finally {
      setRefreshingAll(false);
    }
  }

  const loadFeeds = useCallback(async () => {
    try {
      setError(null);
      const data = await api.listFeeds();
      setFeeds(data);
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "加载失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  const categories = [...new Set(feeds.map((f) => f.category).filter(Boolean))] as string[];

  const filteredFeeds = selectedCategory
    ? feeds.filter((f) => f.category === selectedCategory)
    : feeds;

  async function handleAddFeed(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createFeed(newFeed);
      setShowAdd(false);
      setNewFeed({ name: "", url: "", feed_type: "wechat" });
      loadFeeds();
    } catch (e) {
      alert("添加失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(feed: Feed) {
    if (!confirm(`确定删除 "${feed.name}" 吗？`)) return;
    setDeletingId(feed.id);
    try {
      await api.deleteFeed(feed.id);
      loadFeeds();
    } catch (e) {
      alert("删除失败");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRefresh(feed: Feed) {
    setRefreshingId(feed.id);
    try {
      const result = await api.refreshFeed(feed.id);
      alert(`刷新成功：新增 ${result.added} 篇，更新 ${result.updated} 篇`);
      loadFeeds();
    } catch (e) {
      alert("刷新失败");
    } finally {
      setRefreshingId(null);
    }
  }

  async function handleExportOPML() {
    try {
      const result = await api.exportOPML();
      const blob = new Blob([result.content], { type: "text/xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("导出失败");
    }
  }

  async function handleImportOPML() {
    if (!importText.trim()) {
      alert("请粘贴 OPML 内容");
      return;
    }
    try {
      const result = await api.importOPML(importText);
      alert(result.message);
      setShowImport(false);
      setImportText("");
      loadFeeds();
    } catch (e) {
      alert("导入失败");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto space-y-4" role="status" aria-label="加载中">
          <SkeletonFeedItem />
          <SkeletonFeedItem />
          <SkeletonFeedItem />
          <SkeletonFeedItem />
          <span className="sr-only">加载订阅源中...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 头部 */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeftIcon />
              <span>返回</span>
            </Link>
            <UnreadBadge />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {feeds.length > 0 && (
              <button
                onClick={handleRefreshAll}
                disabled={refreshingAll}
                className="btn btn-secondary flex items-center gap-2"
              >
                <RefreshIcon className={`w-4 h-4 ${refreshingAll ? "animate-spin" : ""}`} />
                <span>{refreshingAll ? "刷新中..." : "刷新全部"}</span>
              </button>
            )}
            <button
              onClick={() => setShowAdd(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <PlusIcon />
              <span>添加订阅源</span>
            </button>
          </div>
        </header>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif" style={{ color: 'var(--text-primary)' }}>
            订阅源管理
          </h1>
        </div>

        {/* 错误提示 */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-error)'
            }}
          >
            <span style={{ color: 'var(--color-error)' }}>{error}</span>
            <button
              onClick={loadFeeds}
              className="text-sm underline"
              style={{ color: 'var(--color-error)' }}
            >
              重试
            </button>
          </div>
        )}

        {feeds.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <svg className="w-8 h-8" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </div>
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
              还没有订阅源
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="btn btn-primary"
            >
              添加第一个订阅源
            </button>
          </div>
        ) : (
          <>
            {/* 分类筛选 */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedCategory === null
                      ? "text-white"
                      : ""
                  }`}
                  style={
                    selectedCategory === null
                      ? { backgroundColor: 'var(--color-primary)' }
                      : { backgroundColor: 'var(--surface-secondary)', color: 'var(--text-secondary)' }
                  }
                >
                  全部
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedCategory === cat
                        ? "text-white"
                        : ""
                    }`}
                    style={
                      selectedCategory === cat
                        ? { backgroundColor: 'var(--color-primary)' }
                        : { backgroundColor: 'var(--surface-secondary)', color: 'var(--text-secondary)' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* 快捷操作 */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/starred"
                className="btn btn-secondary flex items-center gap-2"
                style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
              >
                <StarIcon />
                <span>收藏</span>
              </Link>
              <Link
                href="/history"
                className="btn btn-secondary flex items-center gap-2"
              >
                <HistoryIcon />
                <span>历史</span>
              </Link>
              <button
                onClick={handleExportOPML}
                className="btn btn-secondary"
              >
                导出 OPML
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="btn btn-secondary"
              >
                导入 OPML
              </button>
            </div>

            {/* 订阅源列表 */}
            <div className="space-y-3">
              {filteredFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className="card p-4"
                >
                  <div className="flex items-start justify-between">
                    <Link
                      href={`/feeds/${feed.id}`}
                      className="flex-1 min-w-0 group"
                    >
                      <h3
                        className="font-semibold mb-1 group-hover:text-primary transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {feed.name}
                      </h3>
                      <p
                        className="text-sm truncate-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {feed.description || feed.url}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                        >
                          {PLATFORMS.find((p) => p.value === feed.feed_type)?.label || feed.feed_type}
                        </span>
                        {feed.category && (
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#9333EA' }}
                          >
                            {feed.category}
                          </span>
                        )}
                        {feed.last_fetched_at && (
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            更新: {new Date(feed.last_fetched_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleRefresh(feed)}
                        disabled={refreshingId === feed.id}
                        className="btn btn-ghost flex items-center gap-1 text-sm"
                      >
                        <RefreshIcon className={`w-4 h-4 ${refreshingId === feed.id ? "animate-spin" : ""}`} />
                        <span>{refreshingId === feed.id ? "刷新中..." : "刷新"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(feed)}
                        disabled={deletingId === feed.id}
                        className="btn btn-ghost flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <TrashIcon />
                        <span>{deletingId === feed.id ? "删除中..." : "删除"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 添加订阅源模态框 */}
      {showAdd && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                添加订阅源
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleAddFeed} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  名称
                </label>
                <input
                  type="text"
                  value={newFeed.name}
                  onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                  placeholder="如：科技资讯"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  平台
                </label>
                <select
                  value={newFeed.feed_type}
                  onChange={(e) => setNewFeed({ ...newFeed, feed_type: e.target.value })}
                  className="input"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  ID/频道名
                </label>
                <input
                  type="text"
                  value={newFeed.url}
                  onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                  placeholder="微信公众号ID、B站用户名等"
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="btn btn-secondary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? "添加中..." : "添加"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 导入OPML模态框 */}
      {showImport && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                导入 OPML
              </h2>
              <button
                onClick={() => setShowImport(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              粘贴从其他 RSS 阅读器导出的 OPML 内容
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="<?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?>..."
              rows={10}
              className="input font-mono text-sm"
            />
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowImport(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleImportOPML}
                className="btn btn-primary"
              >
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
