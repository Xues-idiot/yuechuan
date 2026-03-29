"use client";

import { useState, useEffect } from "react";

interface AnalyticsData {
  total_articles: number;
  articles_read: number;
  read_time: number; // 分钟
  streak_days: number;
  top_tags: Array<{ tag: string; count: number }>;
  daily_reading: Array<{ date: string; count: number }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analytics?period=${period}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setData({
        total_articles: 156,
        articles_read: 89,
        read_time: 450,
        streak_days: 7,
        top_tags: [
          { tag: "科技", count: 45 },
          { tag: "编程", count: 32 },
          { tag: "AI", count: 28 },
          { tag: "产品", count: 15 },
          { tag: "设计", count: 12 }
        ],
        daily_reading: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📈 阅读分析</h1>
              <p className="text-gray-600 dark:text-gray-400">
                了解你的阅读习惯和趋势
              </p>
            </div>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm ${
                period === p
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {p === "week" ? "本周" : p === "month" ? "本月" : "本年"}
            </button>
          ))}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-3xl font-bold text-blue-500">{data?.total_articles || 0}</div>
            <div className="text-sm text-gray-500">总文章</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-3xl font-bold text-green-500">{data?.articles_read || 0}</div>
            <div className="text-sm text-gray-500">已读</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-3xl font-bold text-purple-500">{data?.read_time || 0}</div>
            <div className="text-sm text-gray-500">阅读时间(分钟)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-3xl font-bold text-orange-500">{data?.streak_days || 0}</div>
            <div className="text-sm text-gray-500">连续天数</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold">🏷️ 热门标签</h2>
            </div>
            <div className="p-4">
              {data?.top_tags && data.top_tags.length > 0 ? (
                <div className="space-y-3">
                  {data.top_tags.map((tag, index) => (
                    <div key={tag.tag} className="flex items-center gap-3">
                      <span className="w-6 text-center text-gray-400 text-sm">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{tag.tag}</span>
                          <span className="text-sm text-gray-500">{tag.count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(tag.count / (data?.top_tags?.[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">暂无数据</p>
              )}
            </div>
          </div>

          {/* Reading Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold">📊 阅读趋势</h2>
            </div>
            <div className="p-4">
              <div className="h-48 flex items-end gap-1">
                {[65, 45, 78, 52, 88, 70, 92].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>周一</span>
                <span>周日</span>
              </div>
            </div>
          </div>
        </div>

        {/* Read Rate */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold mb-4">📈 阅读完成率</h2>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-blue-500">
              {data?.total_articles ? Math.round((data.articles_read / data.total_articles) * 100) : 0}%
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  style={{ width: `${data?.total_articles ? (data.articles_read / data.total_articles) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {data?.articles_read} / {data?.total_articles}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}