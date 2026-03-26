"use client";

import { useState } from "react";
import EmptyState from "./EmptyState";
import ItemCard from "./ItemCard";

interface ReadLaterListProps {
  items: any[];
  onItemClick?: (item: any) => void;
  onRemove?: (itemId: number) => void;
  onClearAll?: () => void;
}

export default function ReadLaterList({
  items,
  onItemClick,
  onRemove,
  onClearAll,
}: ReadLaterListProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.is_read;
    if (filter === "read") return item.is_read;
    return true;
  });

  if (items.length === 0) {
    return <EmptyState type="feeds" />;
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filter === "all"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            全部 ({items.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filter === "unread"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            未读 ({items.filter((i) => !i.is_read).length})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filter === "read"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            已读 ({items.filter((i) => i.is_read).length})
          </button>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:underline"
          >
            清空全部
          </button>
        )}
      </div>

      {/* 列表 */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item)}
            showActions
            actions={[
              {
                label: "移除",
                icon: "🗑️",
                onClick: () => onRemove?.(item.id),
              },
            ]}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          没有匹配的内容
        </p>
      )}
    </div>
  );
}
