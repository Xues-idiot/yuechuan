"use client";

import Card from "./Card";
import { Rss, FileText, Eye, Star, Clock } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalFeeds: number;
    totalItems: number;
    unreadItems: number;
    starredItems: number;
    totalReadTime: number; // 分钟
  };
}

const statItems = [
  { key: "feeds", icon: Rss, label: "订阅源", color: "var(--color-primary)" },
  { key: "items", icon: FileText, label: "总内容", color: "var(--color-success)" },
  { key: "unread", icon: Eye, label: "未读", color: "var(--color-warning)" },
  { key: "starred", icon: Star, label: "收藏", color: "var(--color-starred)" },
  { key: "readTime", icon: Clock, label: "阅读时长", color: "var(--color-info)" },
];

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const formatReadTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getValue = (key: string) => {
    switch (key) {
      case "feeds": return stats.totalFeeds;
      case "items": return stats.totalItems;
      case "unread": return stats.unreadItems;
      case "starred": return stats.starredItems;
      case "readTime": return formatReadTime(stats.totalReadTime);
      default: return 0;
    }
  };

  return (
    <Card className="p-6">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}
      >
        数据概览
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statItems.map(({ key, icon: Icon, label, color }) => (
          <div key={key} className="text-center">
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] mb-2"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold" style={{ color }}>{getValue(key)}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
