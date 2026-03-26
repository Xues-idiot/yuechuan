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

  // 获取所有分类
  const categories = [...new Set(feeds.map((f) => f.category).filter(Boolean))] as string[];

  // 按分类过滤
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
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <SkeletonFeedItem />
          <SkeletonFeedItem />
          <SkeletonFeedItem />
          <SkeletonFeedItem />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <UnreadBadge />
          </div>
          <div>
            <h1 className="text-2xl font-bold">订阅源管理</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {feeds.length > 0 && (
              <button
                onClick={handleRefreshAll}
                disabled={refreshingAll}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {refreshingAll ? "刷新中..." : "🔄 刷新全部"}
              </button>
            )}
            <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            添加订阅源
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p>{error}</p>
            <button onClick={loadFeeds} className="text-sm underline mt-2">
              重试
            </button>
          </div>
        )}

        {feeds.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">还没有订阅源</p>
            <button
              onClick={() => setShowAdd(true)}
              className="text-blue-600 hover:underline"
            >
              添加第一个订阅源
            </button>
          </div>
        ) : (
          <>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategory === null
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                  }`}
                >
                  全部
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/starred"
                className="px-4 py-2 text-sm text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50"
              >
                ⭐ 收藏
              </Link>
              <Link
                href="/history"
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                📜 历史
              </Link>
              <button
                onClick={handleExportOPML}
                className="px-4 py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50"
              >
                📥 导出 OPML
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                📤 导入 OPML
              </button>
            </div>
          </>
        )}

          <div className="space-y-3">
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <Link href={`/feeds/${feed.id}`} className="flex-1">
                    <h3 className="font-semibold hover:text-blue-600">{feed.name}</h3>
                    <p className="text-sm text-gray-500">{feed.description || feed.url}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {PLATFORMS.find((p) => p.value === feed.feed_type)?.label || feed.feed_type}
                      </span>
                      {feed.category && (
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          {feed.category}
                        </span>
                      )}
                      {feed.last_fetched_at && (
                        <span className="text-xs text-gray-400">
                          最后更新: {new Date(feed.last_fetched_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleRefresh(feed)}
                      disabled={refreshingId === feed.id}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      {refreshingId === feed.id ? "刷新中..." : "刷新"}
                    </button>
                    <button
                      onClick={() => handleDelete(feed)}
                      disabled={deletingId === feed.id}
                      className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === feed.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">添加订阅源</h2>
              <form onSubmit={handleAddFeed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">名称</label>
                  <input
                    type="text"
                    value={newFeed.name}
                    onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                    placeholder="如：科技资讯"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">平台</label>
                  <select
                    value={newFeed.feed_type}
                    onChange={(e) => setNewFeed({ ...newFeed, feed_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID/频道名</label>
                  <input
                    type="text"
                    value={newFeed.url}
                    onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                    placeholder="微信公众号ID、B站用户名等"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? "添加中..." : "添加"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showImport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">导入 OPML</h2>
              <p className="text-sm text-gray-500 mb-4">
                粘贴从其他 RSS 阅读器导出的 OPML 内容
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="<?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?>..."
                rows={10}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
              />
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleImportOPML}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  导入
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
