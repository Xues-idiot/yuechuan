"use client";

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
        <span className="text-sm text-blue-500 animate-pulse">🔄 刷新中...</span>
      ) : (
        <>
          <span className="text-sm text-gray-400">
            最后更新: {formatTime(lastRefreshedAt)}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="手动刷新"
            >
              🔄
            </button>
          )}
        </>
      )}
    </div>
  );
}
