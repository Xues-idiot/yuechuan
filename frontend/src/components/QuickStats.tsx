"use client";

import { useState, useEffect } from "react";

interface QuickStatsProps {
  feedId: number;
}

export default function QuickStats({ feedId }: QuickStatsProps) {
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    starred: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取统计数据
    const fetchStats = async () => {
      setLoading(true);
      // 实际项目中应该从 API 获取
      setTimeout(() => {
        setStats({
          total: 156,
          read: 98,
          unread: 58,
          starred: 12,
        });
        setLoading(false);
      }, 500);
    };

    fetchStats();
  }, [feedId]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-xs text-gray-500">总篇数</div>
      </div>
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <div className="text-2xl font-bold text-green-600">{stats.read}</div>
        <div className="text-xs text-gray-500">已读</div>
      </div>
      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
        <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
        <div className="text-xs text-gray-500">未读</div>
      </div>
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
        <div className="text-2xl font-bold text-yellow-600">{stats.starred}</div>
        <div className="text-xs text-gray-500">收藏</div>
      </div>
    </div>
  );
}
