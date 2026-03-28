"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calendar } from "lucide-react";

interface ChartData {
  date: string;
  value: number;
}

export default function ReadingStatsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<"week" | "month">("week");

  useEffect(() => {
    const now = new Date();
    const mock: ChartData[] = [];
    const days = period === "week" ? 7 : 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000);
      mock.push({
        date: date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
        value: Math.floor(Math.random() * 20) + 5,
      });
    }

    setData(mock);
  }, [period]);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const totalReads = data.reduce((sum, d) => sum + d.value, 0);
  const avgReads = Math.round(totalReads / data.length);

  return (
    <div
      className="p-5 rounded-[var(--radius-lg)] border"
      style={{
        backgroundColor: 'var(--surface-primary)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>
            阅读趋势
          </h3>
        </div>
        <div className="flex gap-1 p-1 rounded-[var(--radius-md)]" style={{ backgroundColor: 'var(--surface-secondary)' }}>
          <button
            onClick={() => setPeriod("week")}
            className={`px-3 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-all ${
              period === "week"
                ? ""
                : ""
            }`}
            style={{
              backgroundColor: period === "week" ? 'var(--color-primary)' : 'transparent',
              color: period === "week" ? 'white' : 'var(--text-secondary)',
            }}
          >
            本周
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-all`}
            style={{
              backgroundColor: period === "month" ? 'var(--color-primary)' : 'transparent',
              color: period === "month" ? 'white' : 'var(--text-secondary)',
            }}
          >
            本月
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-36 mb-4">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div
              className="w-full rounded-t transition-all duration-[var(--duration-normal)]"
              style={{
                height: `${Math.max((d.value / maxValue) * 100, 4)}%`,
                backgroundColor: 'var(--color-primary)',
                opacity: 0.8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              }}
            />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {period === "week" ? d.date.split(' ')[1] : d.date}
            </span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-between pt-4 rounded-[var(--radius-md)]"
        style={{ borderTop: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            总阅读
          </span>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {totalReads} 篇
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            日均
          </span>
          <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            {avgReads} 篇
          </span>
        </div>
      </div>
    </div>
  );
}
