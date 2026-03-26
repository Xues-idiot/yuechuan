"use client";

import { useState, useEffect, useCallback } from "react";
import { api, FeedItem } from "@/lib/api";

interface ReadingListItem {
  id: number;
  feedId: number;
  title: string;
  url: string;
  priority: "high" | "medium" | "low";
  estimatedTime: number; // 分钟
}

interface SmartListProps {
  type: "queue" | "prioritized" | "quick-read" | "long-read";
  title: string;
  description: string;
}

export default function SmartLists() {
  const [lists, setLists] = useState<SmartListProps[]>([
    { type: "queue", title: "阅读队列", description: "稍后阅读的内容" },
    { type: "prioritized", title: "优先级列表", description: "AI 推荐的优先阅读" },
    { type: "quick-read", title: "快速阅读", description: "5分钟内可以读完" },
    { type: "long-read", title: "深度阅读", description: "需要更多时间的优质内容" },
  ]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [items, setItems] = useState<ReadingListItem[]>([]);

  async function loadListItems(type: string) {
    setSelectedList(type);

    // 模拟数据
    const mockItems: ReadingListItem[] = [
      { id: 1, feedId: 1, title: "AI 时代的的产品设计", url: "#", priority: "high", estimatedTime: 8 },
      { id: 2, feedId: 2, title: "如何在2024年增长用户", url: "#", priority: "medium", estimatedTime: 5 },
      { id: 3, feedId: 3, title: "深度工作法", url: "#", priority: "low", estimatedTime: 15 },
    ];

    setItems(mockItems);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {lists.map((list) => (
          <button
            key={list.type}
            onClick={() => loadListItems(list.type)}
            className={`p-4 text-left rounded-lg border ${
              selectedList === list.type
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
            }`}
          >
            <h4 className="font-semibold">{list.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{list.description}</p>
          </button>
        ))}
      </div>

      {selectedList && items.length > 0 && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
          <h4 className="font-semibold mb-3">
            {lists.find((l) => l.type === selectedList)?.title}
          </h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.priority === "high"
                      ? "bg-red-500"
                      : item.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="flex-1 text-sm line-clamp-1">{item.title}</span>
                <span className="text-xs text-gray-400">{item.estimatedTime}分钟</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
