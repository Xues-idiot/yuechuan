"use client";

import { useState, useEffect } from "react";

interface FeedHealth {
  feed_id: number;
  name: string;
  url: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  last_check_at: string | null;
  last_success_at: string | null;
  consecutive_failures: number;
  error_message: string | null;
}

interface HealthSummary {
  total_feeds: number;
  healthy_feeds: number;
  degraded_feeds: number;
  unhealthy_feeds: number;
}

export default function FeedHealthPage() {
  const [feeds, setFeeds] = useState<FeedHealth[]>([]);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState<number | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadHealthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHealthData = async () => {
    try {
      // 获取健康摘要
      const summaryRes = await fetch(`${API_BASE}/feed-health/summary`);
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // 获取所有订阅源的基本信息
      const feedsRes = await fetch(`${API_BASE}/feeds`);
      const feedsData = await feedsRes.json();

      // 获取每个订阅源的健康状态
      const feedsWithHealth = await Promise.all(
        (feedsData || []).map(async (feed: any) => {
          try {
            const healthRes = await fetch(`${API_BASE}/feed-health/${feed.id}`);
            const healthData = await healthRes.json();
            return {
              feed_id: feed.id,
              name: feed.name,
              url: feed.url,
              status: healthData.status || "unknown",
              last_check_at: healthData.last_check_at,
              last_success_at: healthData.last_success_at,
              consecutive_failures: healthData.consecutive_failures || 0,
              error_message: healthData.error_message
            };
          } catch {
            return {
              feed_id: feed.id,
              name: feed.name,
              url: feed.url,
              status: "unknown" as const,
              last_check_at: null,
              last_success_at: null,
              consecutive_failures: 0,
              error_message: null
            };
          }
        })
      );

      setFeeds(feedsWithHealth);
    } catch (error) {
      console.error("Failed to load health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFeedHealth = async (feedId: number) => {
    setChecking(feedId);
    try {
      await fetch(`${API_BASE}/feed-health/${feedId}/check`, { method: "POST" });
      await loadHealthData();
    } catch (error) {
      console.error("Failed to check feed:", error);
    } finally {
      setChecking(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return { icon: "✅", label: "健康", color: "text-green-500" };
      case "degraded":
        return { icon: "⚠️", label: "缓慢", color: "text-yellow-500" };
      case "unhealthy":
        return { icon: "❌", label: "异常", color: "text-red-500" };
      default:
        return { icon: "❓", label: "未知", color: "text-gray-400" };
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "从未";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "刚刚";
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">💚 订阅源健康</h1>
          <p className="text-gray-600 dark:text-gray-400">
            监控订阅源状态，及时发现问题
          </p>
        </header>

        {/* 摘要卡片 */}
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {summary.total_feeds}
              </div>
              <div className="text-sm text-gray-500">总订阅源</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 p-4">
              <div className="text-2xl font-bold text-green-500">
                {summary.healthy_feeds}
              </div>
              <div className="text-sm text-gray-500">健康</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
              <div className="text-2xl font-bold text-yellow-500">
                {summary.degraded_feeds}
              </div>
              <div className="text-sm text-gray-500">缓慢</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-4">
              <div className="text-2xl font-bold text-red-500">
                {summary.unhealthy_feeds}
              </div>
              <div className="text-sm text-gray-500">异常</div>
            </div>
          </div>
        )}

        {/* 订阅源列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold">订阅源状态</h2>
            <button
              onClick={loadHealthData}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>

          {loading ? (
            <div className="p-4 animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : feeds.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📡</p>
              <p>暂无订阅源</p>
              <p className="text-sm mt-1">添加订阅源后即可查看健康状态</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {feeds.map((feed) => {
                const status = getStatusIcon(feed.status);

                return (
                  <div key={feed.feed_id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{status.icon}</span>
                      <div>
                        <div className="font-medium">{feed.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {feed.url}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </div>
                        <div className="text-xs text-gray-400">
                          {feed.status === "unknown"
                            ? "未检查"
                            : feed.last_success_at
                            ? `成功 ${formatDate(feed.last_success_at)}`
                            : feed.consecutive_failures > 0
                            ? `失败 ${feed.consecutive_failures}次`
                            : "未知"}
                        </div>
                      </div>

                      <button
                        onClick={() => checkFeedHealth(feed.feed_id)}
                        disabled={checking === feed.feed_id}
                        className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50"
                      >
                        {checking === feed.feed_id ? "检查中..." : "检查"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 状态说明 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold text-sm mb-3">📖 状态说明</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <div>
                <div className="font-medium text-green-600 dark:text-green-400">健康</div>
                <div className="text-gray-500">订阅源正常工作</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="font-medium text-yellow-600 dark:text-yellow-400">缓慢</div>
                <div className="text-gray-500">响应时间较长</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <div>
                <div className="font-medium text-red-600 dark:text-red-400">异常</div>
                <div className="text-gray-500">无法获取内容</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
