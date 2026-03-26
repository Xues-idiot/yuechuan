"use client";

import { useState } from "react";
import EmptyState from "./EmptyState";
import ItemCard from "./ItemCard";
import Pagination from "./Pagination";

interface BookmarksListProps {
  items: any[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onItemClick?: (item: any) => void;
  onRemoveBookmark?: (itemId: number) => void;
}

export default function BookmarksList({
  items,
  total,
  page,
  pageSize,
  onPageChange,
  onItemClick,
  onRemoveBookmark,
}: BookmarksListProps) {
  if (items.length === 0) {
    return <EmptyState type="starred" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          共 {total} 个收藏
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item)}
            showActions
            actions={[
              {
                label: "取消收藏",
                icon: "☆",
                onClick: () => onRemoveBookmark?.(item.id),
              },
            ]}
          />
        ))}
      </div>

      {total > pageSize && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
