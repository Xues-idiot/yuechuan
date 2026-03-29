"use client";

import { useState, useEffect } from "react";

interface TimelineEntry {
  date: string;
  count: number;
  items: Array<{
    id: number;
    title: string;
    url: string;
    feed_name: string;
  }>;
}

export default function ReadingTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reading-timeline`);
      const data = await res.json();
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error("Failed to load timeline:", error);
      // 生成模拟数据用于展示
      setTimeline(generateMockTimeline());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTimeline = () => {
    const entries: TimelineEntry[] = [];
    const now = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = Math.floor(Math.random() * 10) + 1;

      entries.push({
        date: dateStr,
        count,
        items: Array.from({ length: Math.min(count, 3) }, (_, idx) => ({
          id: i * 10 + idx,
          title: `文章标题 ${i * 10 + idx + 1}`,
          url: "#",
          feed_name: `订阅源 ${idx + 1}`
        }))
      });
    }
    return entries;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) return "今天";
    if (dateStr === yesterday.toISOString().split("T")[0]) return "昨天";

    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      weekday: "short"
    });
  };

  const getTotalArticles = () => timeline.reduce((sum, e) => sum + e.count, 0);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📈 阅读时间线</h1>
              <p className="text-gray-600 dark:text-gray-400">
                可视化你的阅读历史
              </p>
            </div>
            <button
              onClick={loadTimeline}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">{timeline.length}</div>
            <div className="text-sm text-gray-500">阅读天数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-green-500">{getTotalArticles()}</div>
            <div className="text-sm text-gray-500">文章总数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-purple-500">
              {timeline.length > 0 ? Math.round(getTotalArticles() / timeline.length) : 0}
            </div>
            <div className="text-sm text-gray-500">日均阅读</div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📊 近14天阅读趋势</h2>
          <div className="flex items-end gap-1 h-24">
            {timeline.slice(0, 14).map((entry, index) => {
              const maxCount = Math.max(...timeline.map(e => e.count), 1);
              const height = (entry.count / maxCount) * 100;

              return (
                <div
                  key={entry.date}
                  className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${entry.date}: ${entry.count} 篇`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>14天前</span>
            <span>今天</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">📅 阅读详情</h2>
          </div>

          {loading ? (
            <div className="p-4 animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : timeline.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>暂无阅读记录</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {timeline.map((entry) => (
                <div key={entry.date}>
                  <button
                    onClick={() => setExpandedDate(expandedDate === entry.date ? null : entry.date)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="w-20 text-sm font-medium">{formatDate(entry.date)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min((entry.count / 10) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-500">{entry.count}</div>
                    <div className="text-gray-400">{expandedDate === entry.date ? "▲" : "▼"}</div>
                  </button>

                  {expandedDate === entry.date && (
                    <div className="px-4 pb-4 ml-4">
                      <div className="space-y-2">
                        {entry.items.map((item) => (
                          <a
                            key={item.id}
                            href={item.url}
                            className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-gray-400 mt-1">{item.feed_name}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 点击日期可展开查看当天阅读的文章</li>
            <li>• 柱状图高度表示阅读量</li>
            <li>• 保持每日阅读习惯，养成知识积累</li>
          </ul>
        </div>
      </div>
    </main>
  );
}