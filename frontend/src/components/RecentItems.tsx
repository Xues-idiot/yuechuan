"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, FeedItem } from "@/lib/api";

export default function RecentItems() {
  const [items, setItems] = useState<Array<{ id: number; feed_id: number; title: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecent();
  }, []);

  async function loadRecent() {
    setLoading(true);
    try {
      const feeds = await api.listFeeds();
      const recent: Array<{ id: number; feed_id: number; title: string; published_at?: string }> = [];

      for (const feed of feeds.slice(0, 3)) {
        try {
          const feedItems = await api.listFeedItems(feed.id, 5, 0);
          recent.push(
            ...feedItems
              .filter((i) => !i.is_read)
              .slice(0, 2)
              .map((i) => ({ id: i.id, feed_id: feed.id, title: i.title, published_at: i.published_at }))
          );
        } catch {
          // 忽略错误
        }
      }

      // 按时间排序
      recent.sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });

      setItems(recent.slice(0, 5));
    } catch (e) {
      console.error("Failed to load recent:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">📖 待阅读</h3>
        <Link href="/history" className="text-sm text-blue-600 hover:underline">
          查看全部
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">暂无待阅读内容</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.feed_id}-${item.id}`}
              href={`/feeds/${item.feed_id}/items/${item.id}`}
              className="block text-sm line-clamp-1 hover:text-blue-600"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
