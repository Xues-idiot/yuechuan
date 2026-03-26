"use client";

interface ItemListProps {
  items: any[];
  onItemClick?: (item: any) => void;
  selectedIds?: number[];
  onSelect?: (id: number) => void;
  onSelectAll?: () => void;
  showCheckbox?: boolean;
}

export default function ItemList({
  items,
  onItemClick,
  selectedIds = [],
  onSelect,
  onSelectAll,
  showCheckbox = false,
}: ItemListProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
            selectedIds.includes(item.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
          }`}
          onClick={() => onItemClick?.(item)}
        >
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={(e) => {
                e.stopPropagation();
                onSelect?.(item.id);
              }}
              className="mt-1 w-4 h-4 rounded"
            />
          )}

          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h3 className={`font-medium line-clamp-1 ${item.is_read ? "text-gray-500" : ""}`}>
              {item.title}
            </h3>

            {/* 摘要 */}
            {item.content_text && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.content_text.slice(0, 150)}...
              </p>
            )}

            {/* 元信息 */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              {item.author && <span>👤 {item.author}</span>}
              {item.published_at && (
                <span>
                  {new Date(item.published_at).toLocaleDateString("zh-CN")}
                </span>
              )}
              {item.feed_name && <span>📡 {item.feed_name}</span>}
            </div>

            {/* 标签 */}
            {item.tags && (
              <div className="flex gap-1 mt-2">
                {item.tags.split(",").slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 状态图标 */}
          <div className="flex flex-col gap-2">
            {!item.is_read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            {item.is_starred && <span className="text-yellow-500">⭐</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
