"use client";

import { useState, useEffect } from "react";

interface SpeedStats {
  average_speed: number; // 字/分钟
  fastest_speed: number;
  slowest_speed: number;
  total_articles: number;
  total_time: number; // 分钟
}

export default function ReadingSpeedPage() {
  const [stats, setStats] = useState<SpeedStats>({
    average_speed: 450,
    fastest_speed: 680,
    slowest_speed: 220,
    total_articles: 0,
    total_time: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reading-speed?period=${selectedPeriod}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSpeedLevel = (speed: number) => {
    if (speed >= 600) return { label: "快速", color: "text-green-500", bg: "bg-green-100" };
    if (speed >= 400) return { label: "正常", color: "text-blue-500", bg: "bg-blue-100" };
    return { label: "慢速", color: "text-orange-500", bg: "bg-orange-100" };
  };

  const speedLevel = getSpeedLevel(stats.average_speed);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">⚡ 阅读速度</h1>
              <p className="text-gray-600 dark:text-gray-400">
                追踪你的阅读效率
              </p>
            </div>
            <button
              onClick={loadStats}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {(["week", "month", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedPeriod === p
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {p === "week" ? "本周" : p === "month" ? "本月" : "全部"}
            </button>
          ))}
        </div>

        {/* Main Speed Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 text-center">
          <div className="text-6xl font-bold mb-2">{stats.average_speed}</div>
          <div className="text-gray-500 mb-4">字/分钟</div>
          <div className={`inline-block px-4 py-2 rounded-full ${speedLevel.bg} ${speedLevel.color} font-medium`}>
            {speedLevel.label}阅读者
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 mb-1">最快速度</div>
            <div className="text-2xl font-bold text-green-500">{stats.fastest_speed}</div>
            <div className="text-xs text-gray-400">字/分钟</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 mb-1">最慢速度</div>
            <div className="text-2xl font-bold text-orange-500">{stats.slowest_speed}</div>
            <div className="text-xs text-gray-400">字/分钟</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 mb-1">阅读文章数</div>
            <div className="text-2xl font-bold text-blue-500">{stats.total_articles}</div>
            <div className="text-xs text-gray-400">篇</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 mb-1">总阅读时间</div>
            <div className="text-2xl font-bold text-purple-500">{Math.round(stats.total_time / 60)}</div>
            <div className="text-xs text-gray-400">小时</div>
          </div>
        </div>

        {/* Speed Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold mb-4">📊 速度参考</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">600+ 字/分钟</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">快速</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">400-600 字/分钟</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">200-400 字/分钟</span>
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs">慢速</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">&lt;200 字/分钟</span>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">需要练习</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 提升技巧</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 减少回读，集中注意力</li>
            <li>• 扩大视野，一次看多个词</li>
            <li>• 避免默读，用眼睛而不是声音阅读</li>
            <li>• 定期练习可以提升阅读速度</li>
          </ul>
        </div>
      </div>
    </main>
  );
}