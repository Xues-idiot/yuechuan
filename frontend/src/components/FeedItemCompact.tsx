"use client";

interface FeedItemCompactProps {
  item: {
    id: number;
    title: string;
    feedName?: string;
    publishedAt?: string;
    isRead?: boolean;
  };
  onClick?: () => void;
}

export default function FeedItemCompact({
  item,
  onClick,
}: FeedItemCompactProps) {
  return (
    <div
      className={`p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
        item.isRead ? "opacity-60" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {!item.isRead && (
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{item.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            {item.feedName && <span>{item.feedName}</span>}
            {item.publishedAt && (
              <span>
                {new Date(item.publishedAt).toLocaleDateString("zh-CN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
