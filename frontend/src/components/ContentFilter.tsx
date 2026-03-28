"use client";

import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 mr-2" style={{ color: 'var(--text-tertiary)' }}>
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>筛选:</span>
      </div>

      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => toggleFilter(option.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all"
          style={{
            backgroundColor: selected.includes(option.value) ? 'var(--color-primary)' : 'var(--surface-secondary)',
            color: selected.includes(option.value) ? 'white' : 'var(--text-secondary)',
          }}
        >
          {option.label}
          {option.count > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: selected.includes(option.value) ? 'rgba(255,255,255,0.2)' : 'var(--surface-primary)',
              }}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}

      {selected.length > 0 && (
        <button
          onClick={() => {
            setSelected([]);
            onFilterChange?.([]);
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors"
          style={{ color: 'var(--color-error)' }}
        >
          <X className="w-3 h-3" />
          清除
        </button>
      )}
    </div>
  );
}
