"use client";

import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface StatsChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  type?: "bar" | "line" | "pie";
}

export default function StatsChart({ data, title, type = "bar" }: StatsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const colors = [
    "var(--color-primary)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-error)",
    "var(--color-info)",
    "#a855f7",
    "#ec4899",
    "#14b8a6",
  ];

  if (type === "bar") {
    return (
      <div
        className="p-5 rounded-[var(--radius-lg)] border"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {title && (
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <h3 className="font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          </div>
        )}

        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-[var(--duration-normal)]"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || colors[index % colors.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "pie") {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
      <div
        className="p-5 rounded-[var(--radius-lg)] border"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {title && (
          <div className="flex items-center gap-2 mb-5">
            <PieChartIcon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <h3 className="font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          </div>
        )}

        <div className="flex items-center gap-6">
          {/* Pie Chart */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {data.reduce((acc, item, index) => {
                const percentage = item.value / total;
                const offset = acc.offset;
                acc.elements.push(
                  <circle
                    key={item.label}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={item.color || colors[index % colors.length]}
                    strokeWidth="4"
                    strokeDasharray={`${percentage * 88} ${88 - percentage * 88}`}
                    strokeDashoffset={-offset}
                    style={{ transition: 'stroke-dasharray var(--duration-normal)' }}
                  />
                );
                acc.offset += percentage * 88;
                return acc;
              }, { elements: [] as JSX.Element[], offset: 0 }).elements}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color || colors[index % colors.length] }}
                />
                <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                  {item.label}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.value}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
