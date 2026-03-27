"use client";

import { useState, useMemo } from "react";

interface TagCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function TagCloud({ tags, onTagClick }: TagCloudProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // 统计标签频率
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [tags]);

  function getFontSize(count: number, max: number) {
    const min = 12;
    const maxSize = 24;
    return min + ((count / max) * (maxSize - min));
  }

  function getColor(count: number, max: number) {
    if (count >= max * 0.7) return "text-red-500";
    if (count >= max * 0.4) return "text-orange-500";
    if (count >= max * 0.2) return "text-yellow-500";
    return "text-gray-500";
  }

  if (tagCounts.length === 0) {
    return null;
  }

  const maxCount = tagCounts[0][1];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 className="font-semibold mb-3">🏷️ 标签云</h3>
      <div className="flex flex-wrap gap-2">
        {tagCounts.map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => {
              setSelected(selected === tag ? null : tag);
              onTagClick?.(tag);
            }}
            className={`hover:opacity-80 transition-opacity ${
              selected === tag ? "ring-2 ring-blue-500 rounded" : ""
            }`}
            style={{
              fontSize: `${getFontSize(count, maxCount)}px`,
            }}
          >
            <span className={getColor(count, maxCount)}>{tag}</span>
            <span className="text-xs text-gray-400 ml-1">({count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
