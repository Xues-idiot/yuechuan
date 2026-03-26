"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, FeedItem } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function StarredPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 直接调用后端 API 获取收藏列表
        const bookmarkedItems = await api.getBookmarks(50, 0);

        // 按时间排序（创建副本避免修改原数组）
        const sortedItems = [...bookmarkedItems].sort((a, b) => {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateB - dateA;
        });

        setItems(sortedItems);
      } catch (e) {
        console.error("加载失败", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
            <h1 className="text-2xl font-bold">⭐ 我的收藏</h1>
            <p className="text-gray-500 mt-1">收藏的内容</p>
          </div>
          <ThemeToggle />
        </header>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">☆</p>
            <p>暂无收藏</p>
            <p className="text-sm mt-2">点击内容详情页的收藏按钮来收藏内容</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Link
                key={`${item.feed_id}-${item.id}`}
                href={`/feeds/${item.feed_id}/items/${item.id}`}
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-yellow-500 text-lg">★</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      {item.author && <span>{item.author}</span>}
                      {item.published_at && (
                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    {item.tags && (
                      <div className="flex gap-1 mt-2">
                        {item.tags.split(",").filter(Boolean).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
