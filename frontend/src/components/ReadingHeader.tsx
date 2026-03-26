"use client";

interface ReadingHeaderProps {
  feedName: string;
  itemCount: number;
  unreadCount: number;
  onBack?: () => void;
}

export default function ReadingHeader({
  feedName,
  itemCount,
  unreadCount,
  onBack,
}: ReadingHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ←
          </button>
        )}
        <div>
          <h2 className="font-semibold">{feedName}</h2>
          <p className="text-sm text-gray-500">
            {itemCount} 篇内容 · {unreadCount} 篇未读
          </p>
        </div>
      </div>
    </div>
  );
}
