"use client";

import { useState, useEffect, use, useCallback, useRef } from "react";
import Link from "next/link";
import { api, Feed, FeedItem, ApiError } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type FilterType = "all" | "unread" | "starred";
type SortType = "published" | "title" | "read_time";

export type { FilterType, SortType };

export default function FeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const feedId = parseInt(id);

  const [feed, setFeed] = useState<Feed | null>(null);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("published");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const currentFeed = await api.getFeed(feedId);
      setFeed(currentFeed);

      const itemsData = await api.listFeedItems(feedId);
      setItems(itemsData);
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "加载失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [feedId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = items
    .filter((item) => {
      if (filter === "unread") return !item.is_read;
      if (filter === "starred") return item.is_starred;
      return true;
    })
    .sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title, "zh-CN");
      }
      // Default: sort by published date (newest first)
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });

  const unreadCount = items.filter((i) => !i.is_read).length;
  const listRef = useRef<HTMLDivElement>(null);

  function toggleSelect(itemId: number) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedIds(newSelected);
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  }

  async function handleBulkMarkRead() {
    if (selectedIds.size === 0) return;
    for (const itemId of selectedIds) {
      try {
        await api.updateFeedItem(feedId, itemId, { is_read: true });
      } catch (e) {
        console.error(`标记 ${itemId} 失败`, e);
      }
    }
    setSelectedIds(new Set());
    setSelectMode(false);
    loadData();
  }

  async function handleBulkStar() {
    if (selectedIds.size === 0) return;
    for (const itemId of selectedIds) {
      try {
        await api.updateFeedItem(feedId, itemId, { is_starred: true });
      } catch (e) {
        console.error(`收藏 ${itemId} 失败`, e);
      }
    }
    setSelectedIds(new Set());
    setSelectMode(false);
    loadData();
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0 || !feed) return;
    if (!confirm(`确定将 "${feed.name}" 的 ${unreadCount} 篇内容全部标记为已读吗？`)) return;
    try {
      await api.markAllAsRead(feedId);
      loadData();
    } catch (e) {
      alert("操作失败");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">加载中...</p>
        </div>
      </main>
    );
  }

  if (error || !feed) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-500">{error || "订阅源不存在"}</p>
          <Link href="/feeds" className="text-blue-600 hover:underline">返回</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <Link href="/feeds" className="text-sm text-gray-500 hover:text-blue-500 block">
              ← 返回订阅源列表
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{feed.name}</h1>
              {feed.description && (
                <p className="text-gray-600 mt-1">{feed.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                >
                  全部已读 ({unreadCount})
                </button>
              )}
              <button
                onClick={loadData}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                刷新
              </button>
            </div>
          </div>
        </header>

        {/* 筛选器与排序 */}
        <div className="mb-6 flex flex-wrap gap-2 items-center justify-between" role="region" aria-label="过滤和排序选项">
          <div className="flex gap-2" role="group" aria-label="状态过滤">
            {(["all", "unread", "starred"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {f === "all" ? "全部" : f === "unread" ? "未读" : "已收藏"}
                <span className="ml-1 text-xs opacity-75" aria-label={`${f === "all" ? items.length : f === "unread" ? items.filter(i => !i.is_read).length : items.filter(i => i.is_starred).length} 篇`}>
                  ({f === "all" ? items.length : f === "unread" ? items.filter(i => !i.is_read).length : items.filter(i => i.is_starred).length})
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-3 py-1 text-sm border rounded-full dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="published">最新优先</option>
              <option value="title">按标题</option>
            </select>
            {selectMode ? (
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                {selectedIds.size === filteredItems.length ? "取消全选" : "全选"}
              </button>
            ) : (
              <button
                onClick={() => setSelectMode(true)}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
              >
                ☑️ 多选
              </button>
            )}
          </div>
        </div>

        {/* 批量操作栏 */}
        {selectMode && selectedIds.size > 0 && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-between">
            <span className="text-sm">已选择 {selectedIds.size} 篇</span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkMarkRead}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                标记已读
              </button>
              <button
                onClick={handleBulkStar}
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                批量收藏
              </button>
              <button
                onClick={() => {
                  setSelectMode(false);
                  setSelectedIds(new Set());
                }}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{filter === "all" ? "暂无内容" : filter === "unread" ? "暂无未读内容" : "暂无收藏"}</p>
            {filter === "all" && <p className="text-sm mt-2">点击「刷新」获取最新内容</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                aria-label={item.title}
                className={`relative block p-4 bg-white dark:bg-gray-800 rounded-lg border transition-colors ${
                  selectedIds.has(item.id)
                    ? "border-purple-500 ring-1 ring-purple-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500"
                }`}
              >
                <div className="flex gap-4">
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-1 w-5 h-5 rounded"
                    />
                  )}
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-2 font-serif">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      {item.author && <span>{item.author}</span>}
                      {item.published_at && (
                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    {item.ai_summary && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.ai_summary}
                      </p>
                    )}
                  </div>
                  {!selectMode && (
                    <Link
                      href={`/feeds/${feedId}/items/${item.id}`}
                      className="absolute inset-0"
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
