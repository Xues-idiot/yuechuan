"use client";

import { useState, useEffect } from "react";

interface TimelineItem {
  date: string;
  count: number;
  feedName: string;
}

export default function ReadingTimeline() {
  const [data, setData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟时间线数据
    const mockData: TimelineItem[] = [
      { date: "今天", count: 5, feedName: "科技资讯" },
      { date: "今天", count: 3, feedName: "产品经理" },
      { date: "昨天", count: 8, feedName: "创业投资" },
      { date: "昨天", count: 2, feedName: "心理学" },
      { date: "3天前", count: 6, feedName: "AI前沿" },
    ];
    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 className="font-semibold mb-4">📅 阅读时间线</h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className="w-16 text-gray-500">{item.date}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, item.count * 10)}%` }}
                />
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400 w-20 truncate">
              {item.feedName}
            </div>
            <div className="text-gray-400 w-8">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
