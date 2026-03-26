"use client";

interface TagCloudProps {
  tags: Array<{ name: string; count: number }>;
  onTagClick?: (tag: string) => void;
  maxTags?: number;
}

export default function TagCloud({ tags, onTagClick, maxTags = 50 }: TagCloudProps) {
  const sortedTags = [...tags].sort((a, b) => b.count - a.count).slice(0, maxTags);
  const maxCount = Math.max(...sortedTags.map((t) => t.count), 1);

  const getFontSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-lg";
    if (ratio > 0.6) return "text-base";
    if (ratio > 0.4) return "text-sm";
    return "text-xs";
  };

  const getColor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-blue-600 dark:text-blue-400";
    if (ratio > 0.6) return "text-green-600 dark:text-green-400";
    if (ratio > 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {sortedTags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => onTagClick?.(tag.name)}
          className={`${getFontSize(tag.count)} ${getColor(tag.count)} hover:underline`}
        >
          #{tag.name}
          <span className="ml-1 text-xs opacity-60">({tag.count})</span>
        </button>
      ))}
    </div>
  );
}
