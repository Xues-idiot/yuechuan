"use client";

import { useState, useEffect } from "react";
import { Flame, BookOpen, Clock, Star } from "lucide-react";

interface Insight {
  type: "streak" | "topic" | "time" | "feed";
  title: string;
  value: string;
  description: string;
}

const insightIcons = {
  streak: Flame,
  topic: BookOpen,
  time: Clock,
  feed: Star,
};

const insightColors = {
  streak: "var(--color-accent)",
  topic: "var(--color-primary)",
  time: "var(--color-info)",
  feed: "var(--color-starred)",
};

export default function ReadingInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据
    const mockInsights: Insight[] = [
      {
        type: "streak",
        title: "连续阅读",
        value: "7 天",
        description: "你已连续阅读 7 天！继续保持",
      },
      {
        type: "topic",
        title: "最爱话题",
        value: "科技",
        description: "你阅读了 42 篇科技相关文章",
      },
      {
        type: "time",
        title: "阅读高峰",
        value: "晚上 9-11 点",
        description: "这是你阅读最活跃的时间段",
      },
      {
        type: "feed",
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
          <div
            key={i}
            className="h-32 rounded-[var(--radius-md)] animate-pulse"
            style={{ backgroundColor: 'var(--surface-secondary)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>阅读洞察</h3>
      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const Icon = insightIcons[insight.type];
          const iconColor = insightColors[insight.type];
          return (
            <div
              key={i}
              className="p-4 rounded-[var(--radius-md)] border transition-all"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-[var(--radius-sm)]"
                  style={{ backgroundColor: `${iconColor}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: iconColor }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{insight.title}</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{insight.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
