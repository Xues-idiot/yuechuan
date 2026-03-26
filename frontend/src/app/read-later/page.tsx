"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, FeedItem, FeedItemDetail } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function ReadLaterPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 直接调用后端 API 获取稍后阅读列表
        const data = await api.getReadLaterItems(50, 0);
        setItems(data.items);
      } catch (e) {
        console.error("加载失败", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRemove(itemId: number) {
    await api.removeReadLater(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">📋 稍后阅读</h1>
            <p className="text-gray-500 mt-1">保存内容稍后阅读</p>
          </div>
          <ThemeToggle />
        </header>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">📋</p>
            <p>暂无待读内容</p>
            <p className="text-sm mt-2">点击内容详情页的「稍后阅读」按钮来保存内容</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.feed_id}-${item.id}`}
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <Link href={`/feeds/${item.feed_id}/items/${item.id}`} className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      {item.author && <span>{item.author}</span>}
                      {item.published_at && (
                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-4 px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                  >
                    移除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
