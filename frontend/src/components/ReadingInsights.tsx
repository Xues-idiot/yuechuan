"use client";

import { useState, useEffect } from "react";

interface Insight {
  type: "streak" | "topic" | "time" | "feed";
  icon: string;
  title: string;
  value: string;
  description: string;
}

export default function ReadingInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据
    const mockInsights: Insight[] = [
      {
        type: "streak",
        icon: "🔥",
        title: "连续阅读",
        value: "7 天",
        description: "你已连续阅读 7 天！继续保持",
      },
      {
        type: "topic",
        icon: "📚",
        title: "最爱话题",
        value: "科技",
        description: "你阅读了 42 篇科技相关文章",
      },
      {
        type: "time",
        icon: "⏰",
        title: "阅读高峰",
        value: "晚上 9-11 点",
        description: "这是你阅读最活跃的时间段",
      },
      {
        type: "feed",
        icon: "⭐",
        title: "活跃订阅源",
        value: "科技资讯",
        description: "该订阅源为你贡献了最多的阅读内容",
      },
    ];
    setInsights(mockInsights);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">📈 阅读洞察</h3>
      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div>
                <p className="text-xs text-gray-500">{insight.title}</p>
                <p className="text-lg font-bold">{insight.value}</p>
                <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
