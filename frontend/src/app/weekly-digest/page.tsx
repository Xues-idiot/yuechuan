"use client";

import { useState, useEffect } from "react";

interface WeeklyDigest {
  start_date: string;
  end_date: string;
  total_articles: number;
  read_articles: number;
  top_feeds: Array<{ feed_id: number; count: number }>;
  top_articles: Array<{ id: number; title: string; url: string }>;
  reading_time_estimate: number;
}

export default function WeeklyDigestPage() {
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadDigest();
  }, []);

  const loadDigest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/weekly-digest`);
      if (!res.ok) throw new Error("Failed to load digest");
      const data = await res.json();
      setDigest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  };

  const getReadRate = () => {
    if (!digest || digest.total_articles === 0) return 0;
    return Math.round((digest.read_articles / digest.total_articles) * 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">加载失败: {error}</p>
            <button
              onClick={loadDigest}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded hover:bg-red-200"
            >
              重试
            </button>
          </div>
        </div>
      </main>
    );
  }

  const readRate = getReadRate();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📊 本周摘要</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {digest && `${formatDate(digest.start_date)} - ${formatDate(digest.end_date)}`}
              </p>
            </div>
            <button
              onClick={loadDigest}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {digest && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-3xl font-bold text-blue-500">{digest.total_articles}</div>
                <div className="text-sm text-gray-500">文章总数</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-3xl font-bold text-green-500">{digest.read_articles}</div>
                <div className="text-sm text-gray-500">已读文章</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-3xl font-bold text-purple-500">{readRate}%</div>
                <div className="text-sm text-gray-500">完成率</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-3xl font-bold text-orange-500">{digest.reading_time_estimate}</div>
                <div className="text-sm text-gray-500">预估阅读(分钟)</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">阅读进度</span>
                <span className="text-sm text-gray-500">
                  {digest.read_articles} / {digest.total_articles}
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${readRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Feeds */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold">📰 活跃订阅源</h2>
                </div>
                <div className="p-4">
                  {digest.top_feeds.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">暂无数据</p>
                  ) : (
                    <div className="space-y-3">
                      {digest.top_feeds.map((feed, index) => (
                        <div key={feed.feed_id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? "bg-yellow-100 text-yellow-700" :
                            index === 1 ? "bg-gray-100 text-gray-700" :
                            index === 2 ? "bg-orange-100 text-orange-700" :
                            "bg-gray-50 text-gray-500"
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">订阅源 #{feed.feed_id}</div>
                            <div className="text-xs text-gray-400">{feed.count} 篇文章</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Top Articles */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold">⭐ 热门收藏</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {digest.top_articles.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">暂无收藏</p>
                  ) : (
                    digest.top_articles.map((article) => (
                      <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div className="font-medium text-sm truncate">{article.title}</div>
                        <div className="text-xs text-blue-500 mt-1">→ 查看原文</div>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 提升阅读效率</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 设置每日阅读目标，养成阅读习惯</li>
                <li>• 使用专注模式，减少干扰</li>
                <li>• 定期回顾收藏的文章，加深记忆</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}