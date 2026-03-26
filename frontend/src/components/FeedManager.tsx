"use client";

import { useState, useEffect } from "react";
import { api, Feed } from "@/lib/api";

interface FeedStats {
  feedId: number;
  name: string;
  itemCount: number;
  unreadCount: number;
  lastFetched: string | null;
}

export default function FeedStatsPanel() {
  const [stats, setStats] = useState<FeedStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const feeds = await api.listFeeds();
      const statsPromises = feeds.slice(0, 10).map(async (feed) => {
        try {
          const items = await api.listFeedItems(feed.id, 100, 0);
          return {
            feedId: feed.id,
            name: feed.name,
            itemCount: items.length,
            unreadCount: items.filter((i) => !i.is_read).length,
            lastFetched: feed.last_fetched_at,
          };
        } catch {
          return {
            feedId: feed.id,
            name: feed.name,
            itemCount: 0,
            unreadCount: 0,
            lastFetched: feed.last_fetched_at,
          };
        }
      });

      const results = await Promise.all(statsPromises);
      setStats(results);
    } catch (e) {
      console.error("Failed to load stats:", e);
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">📊 订阅源统计</h3>
        <button
          onClick={loadStats}
          className="text-sm text-blue-600 hover:underline"
        >
          刷新
        </button>
      </div>
      <div className="space-y-3">
        {stats.length === 0 ? (
          <p className="text-sm text-gray-500">暂无订阅源</p>
        ) : (
          stats.map((s) => (
            <div key={s.feedId} className="flex items-center justify-between text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.name}</p>
                <p className="text-xs text-gray-500">
                  {s.itemCount} 篇 / {s.unreadCount} 未读
                </p>
              </div>
              {s.lastFetched && (
                <span className="text-xs text-gray-400">
                  {new Date(s.lastFetched).toLocaleDateString()}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
