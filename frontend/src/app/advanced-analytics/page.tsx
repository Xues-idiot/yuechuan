"use client";

import { useState, useEffect } from "react";

interface AdvancedReport {
  report_date: string;
  basic_stats: {
    total_articles: number;
    articles_read: number;
    articles_starred: number;
    read_rate: number;
    ai_summarized: number;
    ai_translated: number;
  };
  reading_habits: {
    peak_hour: number;
    time_of_day: string;
    reading_streak: { current: number; longest: number; total_days: number };
  };
  suggestions: string[];
  insights: string[];
}

export default function AdvancedAnalyticsPage() {
  const [report, setReport] = useState<AdvancedReport | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/advanced-analytics/report`);
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🔬 高级分析</h1>
              <p className="text-gray-600 dark:text-gray-400">
                深入了解你的阅读行为
              </p>
            </div>
            <button
              onClick={loadReport}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Basic Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📊 基本统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{report?.basic_stats.total_articles || 0}</div>
              <div className="text-sm text-gray-500">文章总数</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{report?.basic_stats.articles_read || 0}</div>
              <div className="text-sm text-gray-500">已读</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-yellow-500">{report?.basic_stats.articles_starred || 0}</div>
              <div className="text-sm text-gray-500">收藏</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-purple-500">{report?.basic_stats.read_rate || 0}%</div>
              <div className="text-sm text-gray-500">阅读率</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-cyan-500">{report?.basic_stats.ai_summarized || 0}</div>
              <div className="text-sm text-gray-500">AI摘要</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-pink-500">{report?.basic_stats.ai_translated || 0}</div>
              <div className="text-sm text-gray-500">AI翻译</div>
            </div>
          </div>
        </div>

        {/* Reading Habits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📈 阅读习惯</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">高峰时段</div>
              <div className="text-2xl font-bold">{report?.reading_habits.peak_hour || 0}:00</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">阅读时段</div>
              <div className="text-2xl font-bold">{report?.reading_habits.time_of_day || "-"}</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">当前连续</div>
              <div className="text-2xl font-bold">{report?.reading_habits.reading_streak.current || 0} 天</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {report?.reading_habits.reading_streak.longest || 0}
                </div>
                <div className="text-sm text-gray-500">最长连续</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {report?.reading_habits.reading_streak.total_days || 0}
                </div>
                <div className="text-sm text-gray-500">总阅读天数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {report?.insights && report.insights.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="font-semibold mb-4">💡 阅读洞察</h2>
            <div className="space-y-3">
              {report.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-500 mt-0.5">💡</span>
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {report?.suggestions && report.suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4">🎯 优化建议</h2>
            <div className="space-y-3">
              {report.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500 mt-0.5">🎯</span>
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}