"use client";

import { useState, useCallback } from "react";
import Collapsible from "./Collapsible";
import Button from "./Button";
import { Calendar, CheckCircle, Rss, Tag, RotateCcw } from "lucide-react";

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
      {/* Date Range */}
      <Collapsible
        title="时间范围"
        defaultOpen
        icon={<Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />}
      >
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
              className="px-3 py-1.5 text-sm rounded-full transition-all"
              style={{
                backgroundColor: filters.dateRange === option.value ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                color: filters.dateRange === option.value ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: filters.dateRange === option.value ? '1px solid var(--color-primary)' : '1px solid transparent',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Collapsible>

      {/* Read Status */}
      <Collapsible
        title="状态"
        defaultOpen
        icon={<CheckCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />}
      >
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
              className="px-3 py-1.5 text-sm rounded-full transition-all"
              style={{
                backgroundColor: filters.readStatus === option.value ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                color: filters.readStatus === option.value ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: filters.readStatus === option.value ? '1px solid var(--color-primary)' : '1px solid transparent',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Collapsible>

      {/* Feeds */}
      {feeds.length > 0 && (
        <Collapsible
          title={`订阅源 (${feeds.length})`}
          icon={<Rss className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />}
        >
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {feeds.map((feed) => (
              <button
                key={feed.id}
                onClick={() => toggleFeed(feed.id)}
                className="px-3 py-1.5 text-sm rounded-full transition-all"
                style={{
                  backgroundColor: filters.feedIds.includes(feed.id) ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                  color: filters.feedIds.includes(feed.id) ? 'var(--color-primary)' : 'var(--text-secondary)',
                  border: filters.feedIds.includes(feed.id) ? '1px solid var(--color-primary)' : '1px solid transparent',
                }}
              >
                {feed.name}
              </button>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Collapsible
          title={`标签 (${tags.length})`}
          icon={<Tag className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />}
        >
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="px-3 py-1.5 text-sm rounded-full transition-all"
                style={{
                  backgroundColor: filters.tags.includes(tag) ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                  color: filters.tags.includes(tag) ? 'var(--color-primary)' : 'var(--text-secondary)',
                  border: filters.tags.includes(tag) ? '1px solid var(--color-primary)' : '1px solid transparent',
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4" style={{ borderTop: '1px solid var(--border-default)' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            清除所有筛选
          </Button>
        </div>
      )}
    </div>
  );
}
