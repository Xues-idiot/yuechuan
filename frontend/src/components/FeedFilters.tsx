"use client";

interface FeedFiltersProps {
  feeds: Array<{ id: number; name: string }>;
  selectedFeedIds: number[];
  onChange: (feedIds: number[]) => void;
}

export default function FeedFilters({
  feeds,
  selectedFeedIds,
  onChange,
}: FeedFiltersProps) {
  const toggleFeed = (feedId: number) => {
    if (selectedFeedIds.includes(feedId)) {
      onChange(selectedFeedIds.filter((id) => id !== feedId));
    } else {
      onChange([...selectedFeedIds, feedId]);
    }
  };

  const selectAll = () => {
    onChange(feeds.map((f) => f.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">筛选订阅源</span>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-blue-600 hover:underline">
            全选
          </button>
          <button onClick={clearAll} className="text-xs text-gray-500 hover:underline">
            清除
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {feeds.map((feed) => (
          <button
            key={feed.id}
            onClick={() => toggleFeed(feed.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedFeedIds.includes(feed.id)
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            }`}
          >
            {feed.name}
          </button>
        ))}
      </div>
    </div>
  );
}
