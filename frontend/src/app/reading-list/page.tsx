"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ReadingListItem {
  id: number;
  title: string;
  url: string;
  feed_name: string;
  added_at: string;
}

export default function ReadingListPage() {
  const [items, setItems] = useState<ReadingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "reading">("all");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadReadingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReadingList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reading-list`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load reading list:", error);
      // 使用空数组
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromList = async (itemId: number) => {
    try {
      await fetch(`${API_BASE}/reading-list/${itemId}`, { method: "DELETE" });
      setItems(items.filter(i => i.id !== itemId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric"
    });
  };

  const filteredItems = items.filter(item => {
    if (filter === "unread") return !item.added_at;
    if (filter === "reading") return true;
    return true;
  });

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📤 阅读列表</h1>
              <p className="text-gray-600 dark:text-gray-400">
                管理你的待读文章
              </p>
            </div>
            <button
              onClick={loadReadingList}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "unread", "reading"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {f === "all" ? "全部" : f === "unread" ? "未读" : "阅读中"}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">{items.length}</div>
            <div className="text-sm text-gray-500">总文章</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{items.filter(i => !i.added_at).length}</div>
            <div className="text-sm text-gray-500">未读</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{items.filter(i => i.added_at).length}</div>
            <div className="text-sm text-gray-500">阅读中</div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold">文章列表</h2>
            <span className="text-sm text-gray-500">{filteredItems.length} 篇</span>
          </div>

          {loading ? (
            <div className="p-4 animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>阅读列表为空</p>
              <Link href="/discover" className="text-blue-500 hover:underline mt-2 inline-block">
                去发现页面添加内容
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-500 block truncate"
                    >
                      {item.title}
                    </a>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>{item.feed_name}</span>
                      <span>添加于 {formatDate(item.added_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFromList(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                      title="移除"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 将文章添加到阅读列表，方便稍后阅读</li>
            <li>• 点击文章标题可在新标签页打开阅读</li>
            <li>• 阅读完成后可标记移除</li>
          </ul>
        </div>
      </div>
    </main>
  );
}