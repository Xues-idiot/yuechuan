"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Plus,
  X,
  Trash2,
  Star,
  History,
  ArrowLeft,
} from "lucide-react";
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
              <ArrowLeft className="w-4 h-4" />
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
                <RefreshCw className={`w-4 h-4 ${refreshingAll ? "animate-spin" : ""}`} />
                <span>{refreshingAll ? "刷新中..." : "刷新全部"}</span>
              </button>
            )}
            <button
              onClick={() => setShowAdd(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
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
                <Star className="w-4 h-4" />
                <span>收藏</span>
              </Link>
              <Link
                href="/history"
                className="btn btn-secondary flex items-center gap-2"
              >
                <History className="w-4 h-4" />
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
                        <RefreshCw className={`w-4 h-4 ${refreshingId === feed.id ? "animate-spin" : ""}`} />
                        <span>{refreshingId === feed.id ? "刷新中..." : "刷新"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(feed)}
                        disabled={deletingId === feed.id}
                        className="btn btn-ghost flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <Trash2 className="w-4 h-4" />
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
                <X className="w-5 h-5" />
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
                <X className="w-5 h-5" />
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
