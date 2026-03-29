"use client";

import { useState, useEffect } from "react";
import { FileText, CheckCircle2, Eye, Star } from "lucide-react";

interface QuickStatsProps {
  feedId: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  bgColor: string;
  loading: boolean;
}

function StatItem({ icon, value, label, color, bgColor, loading }: StatItemProps) {
  if (loading) {
    return (
      <div
        className="p-3 rounded-[var(--radius-md)] animate-pulse"
        style={{ backgroundColor: 'var(--surface-secondary)' }}
      >
        <div className="h-7 w-10 mx-auto rounded mb-1" style={{ backgroundColor: 'var(--border-default)' }} />
        <div className="h-3 w-8 mx-auto rounded" style={{ backgroundColor: 'var(--border-default)' }} />
      </div>
    );
  }

  return (
    <div
      className="p-3 rounded-[var(--radius-md)] text-center transition-all duration-[var(--duration-normal)] group cursor-default hover:shadow-[var(--shadow-card)]"
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        className="inline-flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] mb-2 transition-transform duration-[var(--duration-normal)] group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </div>
    </div>
  );
}

export default function QuickStats({ feedId }: QuickStatsProps) {
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    starred: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setTimeout(() => {
        setStats({
          total: 156,
          read: 98,
          unread: 58,
          starred: 12,
        });
        setLoading(false);
      }, 500);
    };

    fetchStats();
  }, [feedId]);

  const statItems = [
    {
      icon: <FileText className="w-4 h-4" />,
      value: stats.total,
      label: "总篇数",
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary-light)',
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      value: stats.read,
      label: "已读",
      color: 'var(--color-success)',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      icon: <Eye className="w-4 h-4" />,
      value: stats.unread,
      label: "未读",
      color: 'var(--color-warning)',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
    {
      icon: <Star className="w-4 h-4" />,
      value: stats.starred,
      label: "收藏",
      color: 'var(--color-starred)',
      bgColor: 'rgba(234, 179, 8, 0.15)',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {statItems.map((item, index) => (
        <StatItem key={item.label} {...item} loading={loading} />
      ))}
    </div>
  );
}
