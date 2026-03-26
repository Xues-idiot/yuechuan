"use client";

import Card from "./Card";

interface StatsOverviewProps {
  stats: {
    totalFeeds: number;
    totalItems: number;
    unreadItems: number;
    starredItems: number;
    totalReadTime: number; // 分钟
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const formatReadTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">📊 数据概览</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalFeeds}</div>
          <div className="text-xs text-gray-500 mt-1">订阅源</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalItems}</div>
          <div className="text-xs text-gray-500 mt-1">总内容</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.unreadItems}</div>
          <div className="text-xs text-gray-500 mt-1">未读</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.starredItems}</div>
          <div className="text-xs text-gray-500 mt-1">收藏</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatReadTime(stats.totalReadTime)}
          </div>
          <div className="text-xs text-gray-500 mt-1">阅读时长</div>
        </div>
      </div>
    </Card>
  );
}
