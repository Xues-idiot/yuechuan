"use client";

import { useState, useMemo } from "react";

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface ContentFilterProps {
  feedType?: string;
  onFilterChange?: (filters: string[]) => void;
}

export default function ContentFilter({ feedType, onFilterChange }: ContentFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const filterOptions: FilterOption[] = useMemo(() => {
    if (feedType === "wechat") {
      return [
        { value: "article", label: "文章", count: 0 },
        { value: "video", label: "视频", count: 0 },
        { value: "image", label: "图片", count: 0 },
      ];
    }
    if (feedType === "bilibili") {
      return [
        { value: "video", label: "视频", count: 0 },
        { value: "article", label: "专栏", count: 0 },
        { value: "audio", label: "音频", count: 0 },
      ];
    }
    return [
      { value: "all", label: "全部", count: 0 },
      { value: "unread", label: "未读", count: 0 },
      { value: "starred", label: "收藏", count: 0 },
      { value: "withNotes", label: "有笔记", count: 0 },
      { value: "withSummary", label: "有摘要", count: 0 },
    ];
  }, [feedType]);

  function toggleFilter(value: string) {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    onFilterChange?.(newSelected);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => toggleFilter(option.value)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            selected.includes(option.value)
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {option.label}
          {option.count > 0 && (
            <span className="ml-1 text-xs opacity-75">({option.count})</span>
          )}
        </button>
      ))}
      {selected.length > 0 && (
        <button
          onClick={() => {
            setSelected([]);
            onFilterChange?.([]);
          }}
          className="px-3 py-1 text-sm text-gray-500 hover:text-red-500"
        >
          清除筛选
        </button>
      )}
    </div>
  );
}
