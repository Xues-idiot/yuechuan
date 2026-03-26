"use client";

interface FeedStatsProps {
  feed: {
    name: string;
    itemCount: number;
    unreadCount: number;
    lastFetchedAt?: string;
  };
}

export default function FeedStats({ feed }: FeedStatsProps) {
  const formatLastFetched = (date?: string) => {
    if (!date) return "从未";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} 小时前`;
    return `${Math.floor(diffMins / 1440)} 天前`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-3">{feed.name}</h3>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-blue-600">{feed.itemCount}</div>
          <div className="text-xs text-gray-500">总篇数</div>
        </div>
        <div>
          <div className="text-lg font-bold text-orange-600">{feed.unreadCount}</div>
          <div className="text-xs text-gray-500">未读</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">
            {Math.round(((feed.itemCount - feed.unreadCount) / Math.max(feed.itemCount, 1)) * 100)}%
          </div>
          <div className="text-xs text-gray-500">已读</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
        最后更新: {formatLastFetched(feed.lastFetchedAt)}
      </div>
    </div>
  );
}
