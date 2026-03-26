"use client";

import { useState, useCallback } from "react";
import Collapsible from "./Collapsible";
import Badge from "./Badge";
import Button from "./Button";

interface SearchFiltersProps {
  feeds: Array<{ id: number; name: string }>;
  tags: string[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  feedIds: number[];
  tags: string[];
  dateRange: "all" | "today" | "week" | "month";
  readStatus: "all" | "read" | "unread";
}

export default function SearchFilters({
  feeds,
  tags,
  onFilterChange,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    feedIds: [],
    tags: [],
    dateRange: "all",
    readStatus: "all",
  });

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const newFilters = { ...filters, ...updates };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const toggleFeed = (feedId: number) => {
    const newFeedIds = filters.feedIds.includes(feedId)
      ? filters.feedIds.filter((id) => id !== feedId)
      : [...filters.feedIds, feedId];
    updateFilters({ feedIds: newFeedIds });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      feedIds: [],
      tags: [],
      dateRange: "all",
      readStatus: "all",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.feedIds.length > 0 ||
    filters.tags.length > 0 ||
    filters.dateRange !== "all" ||
    filters.readStatus !== "all";

  return (
    <div className="space-y-4">
      {/* 日期范围 */}
      <Collapsible title="时间范围" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "全部" },
            { value: "today", label: "今天" },
            { value: "week", label: "本周" },
            { value: "month", label: "本月" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilters({
                  dateRange: option.value as FilterState["dateRange"],
                })
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filters.dateRange === option.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Collapsible>

      {/* 已读状态 */}
      <Collapsible title="状态" defaultOpen>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "全部" },
            { value: "unread", label: "未读" },
            { value: "read", label: "已读" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilters({
                  readStatus: option.value as FilterState["readStatus"],
                })
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filters.readStatus === option.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Collapsible>

      {/* 订阅源 */}
      {feeds.length > 0 && (
        <Collapsible title={`订阅源 (${feeds.length})`}>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {feeds.map((feed) => (
              <button
                key={feed.id}
                onClick={() => toggleFeed(feed.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.feedIds.includes(feed.id)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                }`}
              >
                {feed.name}
              </button>
            ))}
          </div>
        </Collapsible>
      )}

      {/* 标签 */}
      {tags.length > 0 && (
        <Collapsible title={`标签 (${tags.length})`}>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.tags.includes(tag)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </Collapsible>
      )}

      {/* 清除筛选 */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full"
          >
            清除所有筛选
          </Button>
        </div>
      )}
    </div>
  );
}
