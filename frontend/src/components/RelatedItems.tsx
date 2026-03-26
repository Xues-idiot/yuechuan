"use client";

import { useState } from "react";
import ItemCard from "./ItemCard";

interface RelatedItemsProps {
  items: any[];
  onItemClick?: (item: any) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function RelatedItems({
  items,
  onItemClick,
  onRefresh,
  loading = false,
}: RelatedItemsProps) {
  const [expanded, setExpanded] = useState(false);

  const displayItems = expanded ? items : items.slice(0, 3);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">相关内容</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`text-sm text-blue-600 hover:underline ${loading ? "animate-spin" : ""}`}
          >
            🔄 刷新
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          暂无相关内容
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {displayItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                compact
                onClick={() => onItemClick?.(item)}
              />
            ))}
          </div>

          {items.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
            >
              {expanded ? "收起" : `查看更多 (${items.length - 3})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
