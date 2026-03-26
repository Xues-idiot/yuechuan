"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FeedActivity {
  feedId: number;
  feedName: string;
  itemsRead: number;
  lastRead: string;
  avatar?: string;
}

const ACTIVITY_KEY = "feed_activity";

export default function FeedActivity() {
  const [activities, setActivities] = useState<FeedActivity[]>([]);

  useEffect(() => {
    // 从 localStorage 加载
    const saved = localStorage.getItem(ACTIVITY_KEY);
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch {
        // ignore invalid JSON, use mock data
        const mock: FeedActivity[] = [
          { feedId: 1, feedName: "科技资讯", itemsRead: 42, lastRead: new Date().toISOString() },
          { feedId: 2, feedName: "产品经理", itemsRead: 28, lastRead: new Date(Date.now() - 86400000).toISOString() },
          { feedId: 3, feedName: "创业投资", itemsRead: 15, lastRead: new Date(Date.now() - 172800000).toISOString() },
        ];
        setActivities(mock);
      }
    } else {
      // 模拟数据
      const mock: FeedActivity[] = [
        { feedId: 1, feedName: "科技资讯", itemsRead: 42, lastRead: new Date().toISOString() },
        { feedId: 2, feedName: "产品经理", itemsRead: 28, lastRead: new Date(Date.now() - 86400000).toISOString() },
        { feedId: 3, feedName: "创业投资", itemsRead: 15, lastRead: new Date(Date.now() - 172800000).toISOString() },
      ];
      setActivities(mock);
    }
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 className="font-semibold mb-3">📊 阅读活跃度</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">暂无数据</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.feedId} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {activity.feedName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.feedName}</p>
                <p className="text-xs text-gray-500">
                  {activity.itemsRead} 篇已读
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
