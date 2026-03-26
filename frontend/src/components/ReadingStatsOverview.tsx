"use client";

import { useState, useEffect } from "react";

interface ReadingStatsOverviewProps {
  period?: "today" | "week" | "month" | "all";
}

export default function ReadingStatsOverview({
  period = "week",
}: ReadingStatsOverviewProps) {
  const [stats, setStats] = useState({
    totalRead: 0,
    totalTime: 0,
    avgPerDay: 0,
    streak: 0,
    topFeed: "",
    completion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据
    setTimeout(() => {
      setStats({
        totalRead: 47,
        totalTime: 320,
        avgPerDay: 7,
        streak: 12,
        topFeed: "科技资讯",
        completion: 78,
      });
      setLoading(false);
    }, 500);
  }, [period]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="text-3xl font-bold text-blue-600">{stats.totalRead}</div>
        <div className="text-sm text-gray-500">总阅读篇数</div>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <div className="text-3xl font-bold text-green-600">
          {Math.floor(stats.totalTime / 60)}h
        </div>
        <div className="text-sm text-gray-500">总阅读时长</div>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <div className="text-3xl font-bold text-purple-600">{stats.avgPerDay}</div>
        <div className="text-sm text-gray-500">日均阅读</div>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
        <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
        <div className="text-sm text-gray-500">连续阅读天数</div>
      </div>
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
        <div className="text-3xl font-bold text-pink-600">{stats.topFeed}</div>
        <div className="text-sm text-gray-500">阅读最多</div>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <div className="text-3xl font-bold text-yellow-600">{stats.completion}%</div>
        <div className="text-sm text-gray-500">目标完成率</div>
      </div>
    </div>
  );
}
