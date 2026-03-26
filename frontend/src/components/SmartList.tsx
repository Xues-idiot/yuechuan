"use client";

import { useState, useMemo } from "react";

interface SmartListItem {
  id: string;
  title: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  publishedAt?: string;
  isRead?: boolean;
}

interface SmartListProps {
  items: SmartListItem[];
  groups?: string[];
  onItemClick?: (item: SmartListItem) => void;
  onGroupChange?: (group: string) => void;
}

export default function SmartList({
  items,
  groups = [],
  onItemClick,
  onGroupChange,
}: SmartListProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "readTime">("date");
  const [filterUnread, setFilterUnread] = useState(false);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // 按分组筛选
    if (selectedGroup) {
      result = result.filter((item) => item.category === selectedGroup);
    }

    // 筛选未读
    if (filterUnread) {
      result = result.filter((item) => !item.isRead);
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      } else {
        return (b.readTime || 0) - (a.readTime || 0);
      }
    });

    return result;
  }, [items, selectedGroup, sortBy, filterUnread]);

  const handleGroupChange = (group: string) => {
    if (group === selectedGroup) {
      setSelectedGroup(null);
      onGroupChange?.("");
    } else {
      setSelectedGroup(group);
      onGroupChange?.(group);
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 分组标签 */}
        {groups.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => handleGroupChange(group)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedGroup === group
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* 未读筛选 */}
          <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={filterUnread}
              onChange={(e) => setFilterUnread(e.target.checked)}
              className="w-4 h-4"
            />
            仅未读
          </label>

          {/* 排序 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "readTime")}
            className="px-2 py-1.5 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <option value="date">按时间</option>
            <option value="readTime">按阅读时长</option>
          </select>
        </div>
      </div>

      {/* 列表 */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            没有找到匹配的内容
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={`p-4 bg-white dark:bg-gray-800 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                item.isRead
                  ? "border-gray-200 dark:border-gray-700"
                  : "border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 未读标记 */}
                {!item.isRead && (
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${item.isRead ? "text-gray-500" : ""}`}>
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {item.category && <span>{item.category}</span>}
                    {item.readTime && <span>⏱️ {item.readTime} 分钟</span>}
                    {item.publishedAt && (
                      <span>
                        {new Date(item.publishedAt).toLocaleDateString("zh-CN")}
                      </span>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
