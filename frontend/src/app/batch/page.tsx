"use client";

import { useState, useEffect } from "react";

interface FeedItem {
  id: number;
  title: string;
  url: string;
  feed_id: number;
  is_read: boolean;
  is_starred: boolean;
  tags: string | null;
  published_at: string | null;
}

interface Feed {
  id: number;
  name: string;
}

export default function BatchOperationsPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [operating, setOperating] = useState(false);
  const [feedFilter, setFeedFilter] = useState<number | null>(null);
  const [feeds, setFeeds] = useState<Feed[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadFeeds();
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFeeds = async () => {
    try {
      const res = await fetch(`${API_BASE}/feeds`);
      const data = await res.json();
      setFeeds(data || []);
    } catch (error) {
      console.error("Failed to load feeds:", error);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/feeds`;
      if (feedFilter) {
        url = `${API_BASE}/feeds/${feedFilter}/items?limit=100`;
      } else {
        // 获取所有订阅源的前100个文章
        const allItems: FeedItem[] = [];
        for (const feed of feeds.slice(0, 5)) {
          try {
            const res = await fetch(`${API_BASE}/feeds/${feed.id}/items?limit=20`);
            const data = await res.json();
            allItems.push(...(data || []));
          } catch {
            // skip
          }
        }
        setItems(allItems);
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      const data = await res.json();
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const batchOperation = async (operation: string, value?: string) => {
    if (selectedIds.size === 0) {
      alert("请先选择文章");
      return;
    }

    if (!confirm(`确定要对 ${selectedIds.size} 篇文章执行此操作吗？`)) {
      return;
    }

    setOperating(true);
    try {
      const res = await fetch(`${API_BASE}/batch/operation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_ids: Array.from(selectedIds),
          operation,
          value
        })
      });

      const result = await res.json();

      if (result.success) {
        alert(`成功更新 ${result.affected} 篇文章`);
        setSelectedIds(new Set());
        loadItems();
      } else if (result.failed && result.failed.length > 0) {
        alert(`部分失败: ${result.failed.length} 篇失败`);
      }
    } catch (error) {
      console.error("Batch operation failed:", error);
      alert("操作失败");
    } finally {
      setOperating(false);
    }
  };

  const markAllRead = async () => {
    if (!confirm(`确定要标记所有 ${items.length} 篇文章为已读吗？`)) {
      return;
    }

    setOperating(true);
    try {
      const res = await fetch(`${API_BASE}/batch/mark-all-read`, {
        method: "POST",
        headers: feedFilter ? { "Content-Type": "application/json" } : undefined,
        body: feedFilter ? JSON.stringify({ feed_id: feedFilter }) : undefined
      });

      const result = await res.json();

      if (result.success) {
        alert(`成功标记 ${result.affected} 篇文章为已读`);
        loadItems();
      }
    } catch (error) {
      console.error("Mark all read failed:", error);
      alert("操作失败");
    } finally {
      setOperating(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📑 批量操作</h1>
          <p className="text-gray-600 dark:text-gray-400">
            一次对多篇文章执行操作
          </p>
        </header>

        {/* 操作栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={feedFilter || ""}
                onChange={(e) => {
                  setFeedFilter(e.target.value ? Number(e.target.value) : null);
                  loadItems();
                }}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
              >
                <option value="">所有订阅源</option>
                {feeds.map((feed) => (
                  <option key={feed.id} value={feed.id}>
                    {feed.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1" />

            <div className="text-sm text-gray-500">
              已选择: {selectedIds.size} / {items.length}
            </div>

            <button
              onClick={markAllRead}
              disabled={operating || items.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              全部标为已读
            </button>
          </div>
        </div>

        {/* 批量操作 */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                批量操作:
              </span>
              <button
                onClick={() => batchOperation("mark_read")}
                disabled={operating}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm disabled:opacity-50"
              >
                ✅ 标记已读
              </button>
              <button
                onClick={() => batchOperation("mark_unread")}
                disabled={operating}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm disabled:opacity-50"
              >
                📖 标记未读
              </button>
              <button
                onClick={() => batchOperation("star")}
                disabled={operating}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm disabled:opacity-50"
              >
                ⭐ 收藏
              </button>
              <button
                onClick={() => batchOperation("unstar")}
                disabled={operating}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm disabled:opacity-50"
              >
                ☆ 取消收藏
              </button>
              <button
                onClick={() => {
                  const tag = prompt("请输入标签:");
                  if (tag) batchOperation("add_tag", tag);
                }}
                disabled={operating}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm disabled:opacity-50"
              >
                🏷️ 添加标签
              </button>
            </div>
          </div>
        )}

        {/* 文章列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === items.length && items.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">全选</span>
            </label>
            <button
              onClick={loadItems}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>

          {loading ? (
            <div className="p-4 animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>暂无文章</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    selectedIds.has(item.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sm hover:text-blue-500 truncate block"
                    >
                      {item.title}
                    </a>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      {item.is_read ? (
                        <span className="text-green-500">✅ 已读</span>
                      ) : (
                        <span className="text-gray-400">📖 未读</span>
                      )}
                      {item.is_starred && <span>⭐ 收藏</span>}
                      {item.tags && (
                        <span className="truncate">🏷️ {item.tags}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        batchOperation(item.is_read ? "mark_unread" : "mark_read")
                      }
                      className="p-2 text-gray-400 hover:text-blue-500 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={item.is_read ? "标记未读" : "标记已读"}
                    >
                      {item.is_read ? "📖" : "✅"}
                    </button>
                    <button
                      onClick={() =>
                        batchOperation(item.is_starred ? "unstar" : "star")
                      }
                      className="p-2 text-gray-400 hover:text-yellow-500 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={item.is_starred ? "取消收藏" : "收藏"}
                    >
                      {item.is_starred ? "⭐" : "☆"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 勾选文章后，可以对选中的文章执行批量操作</li>
            <li>• 点击表头的复选框可以全选当前列表中的所有文章</li>
            <li>• 支持按订阅源筛选文章</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
