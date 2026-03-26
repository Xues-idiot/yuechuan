"use client";

import { useState } from "react";
import ItemCard from "./ItemCard";

interface SimilarItemsProps {
  items: any[];
  currentItemId?: number;
  onItemClick?: (item: any) => void;
  loading?: boolean;
}

export default function SimilarItems({
  items,
  currentItemId,
  onItemClick,
  loading = false,
}: SimilarItemsProps) {
  const [expanded, setExpanded] = useState(false);

  const filteredItems = items
    .filter((item) => item.id !== currentItemId)
    .slice(0, expanded ? items.length : 4);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">相关内容</h3>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">相关内容</h3>
        <span className="text-sm text-gray-500">{items.length} 篇</span>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            compact
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>

      {items.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
        >
          {expanded ? "收起" : `查看更多 (${items.length - 4})`}
        </button>
      )}
    </div>
  );
}
