"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function UnreadManager() {
  const [total, setTotal] = useState(0);
  const [feeds, setFeeds] = useState<Array<{ feed_id: number; name: string; unread_count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // 定时刷新
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const data = await api.getUnreadCount();
      setTotal(data.total_unread || 0);
      setFeeds(data.feeds || []);
    } catch (e) {
      console.error("Failed to load unread count:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">📬 未读统计</h3>
        <span className="text-2xl font-bold text-blue-600">{total}</span>
      </div>
      {feeds.length > 0 && (
        <div className="space-y-1">
          {feeds.slice(0, 5).map((feed) => (
            <div
              key={feed.feed_id}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate text-gray-600 dark:text-gray-400">
                {feed.name}
              </span>
              <span className="text-gray-500">{feed.unread_count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
