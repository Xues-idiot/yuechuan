"use client";

interface FeedDetailHeaderProps {
  feed: {
    name: string;
    description?: string;
    itemCount?: number;
    unreadCount?: number;
  };
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

export default function FeedDetailHeader({
  feed,
  onBack,
  onRefresh,
  onSettings,
}: FeedDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ←
          </button>
        )}

        <div>
          <h1 className="text-xl font-bold">{feed.name}</h1>
          {feed.description && (
            <p className="text-sm text-gray-500 mt-1">{feed.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            {feed.itemCount !== undefined && (
              <span>📰 {feed.itemCount} 篇</span>
            )}
            {feed.unreadCount !== undefined && (
              <span className="text-blue-500">📬 {feed.unreadCount} 未读</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="刷新"
          >
            🔄
          </button>
        )}
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="设置"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
}
