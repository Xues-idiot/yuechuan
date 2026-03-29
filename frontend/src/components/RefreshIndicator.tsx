"use client";

import { RefreshCw } from "lucide-react";

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  lastRefreshedAt?: string;
  onRefresh?: () => void;
}

export default function RefreshIndicator({
  isRefreshing,
  lastRefreshedAt,
  onRefresh,
}: RefreshIndicatorProps) {
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "从未";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} 小时前`;
    return `${Math.floor(diffMins / 1440)} 天前`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRefreshing ? (
        <span
          className="text-sm animate-pulse flex items-center gap-1.5"
          style={{ color: 'var(--color-primary)' }}
        >
          <RefreshCw className="w-4 h-4 spin" aria-hidden="true" />
          刷新中...
        </span>
      ) : (
        <>
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            最后更新: {formatTime(lastRefreshedAt)}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 rounded hover:bg-[var(--surface-secondary)] transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              title="手动刷新"
              aria-label="手动刷新"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
