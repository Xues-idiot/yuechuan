"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, TrendingUp, Flame, Star, Target } from "lucide-react";

interface ReadingStatsOverviewProps {
  period?: "today" | "week" | "month" | "all";
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  delay: number;
  loading: boolean;
}

function StatCard({ icon, value, label, color, bgColor, delay, loading }: StatCardProps) {
  if (loading) {
    return (
      <div
        className="p-4 rounded-[var(--radius-lg)] animate-pulse"
        style={{
          backgroundColor: 'var(--surface-secondary)',
        }}
      >
        <div className="h-10 w-10 rounded-[var(--radius-md)] mb-3" style={{ backgroundColor: 'var(--border-default)' }} />
        <div className="h-8 w-16 rounded mb-2" style={{ backgroundColor: 'var(--border-default)' }} />
        <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--border-default)' }} />
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-[var(--radius-lg)] spring-slide group cursor-default transition-all duration-[var(--duration-normal)] hover:shadow-[var(--shadow-card-hover)]"
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] mb-3 transition-transform duration-[var(--duration-normal)] group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </div>
    </div>
  );
}

export default function ReadingStatsOverview({
  period = "week",
}: ReadingStatsOverviewProps) {
  const [stats, setStats] = useState({
    totalRead: 0,
    totalTime: 0,
    avgPerDay: 0,
    streak: 0,
    topFeed: "",
    completion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据
    setTimeout(() => {
      setStats({
        totalRead: 47,
        totalTime: 320,
        avgPerDay: 7,
        streak: 12,
        topFeed: "科技资讯",
        completion: 78,
      });
      setLoading(false);
    }, 500);
  }, [period]);

  const statConfig = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      value: stats.totalRead,
      label: "总阅读篇数",
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary-light)',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: `${Math.floor(stats.totalTime / 60)}h`,
      label: "总阅读时长",
      color: 'var(--color-success)',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: stats.avgPerDay,
      label: "日均阅读",
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      value: stats.streak,
      label: "连续阅读天数",
      color: 'var(--color-warning)',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      icon: <Star className="w-5 h-5" />,
      value: stats.topFeed,
      label: "阅读最多",
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.15)',
    },
    {
      icon: <Target className="w-5 h-5" />,
      value: `${stats.completion}%`,
      label: "目标完成率",
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger-container">
      {statConfig.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 50} loading={loading} />
      ))}
    </div>
  );
}
