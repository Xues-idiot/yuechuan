"use client";

import { useState } from "react";

interface SmartFilter {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  enabled: boolean;
}

const PRESET_FILTERS: SmartFilter[] = [
  {
    id: "tech",
    name: "技术文章",
    description: "只显示技术相关的文章",
    conditions: ["标签包含: 技术, 编程, AI", "来源: 掘金, V2EX"],
    enabled: true
  },
  {
    id: "unread",
    name: "未读优先",
    description: "未读文章排在前面",
    conditions: ["已读状态: 否"],
    enabled: true
  },
  {
    id: "important",
    name: "重要内容",
    description: "识别重要的长文章",
    conditions: ["阅读时间 > 10分钟", "标签包含: 重要, 推荐"],
    enabled: false
  },
  {
    id: "morning",
    name: "晨间阅读",
    description: "适合早上阅读的内容",
    conditions: ["发布时间: 6:00-9:00", "标签包含: 资讯, 日报"],
    enabled: false
  }
];

export default function SmartFiltersPage() {
  const [filters, setFilters] = useState<SmartFilter[]>(PRESET_FILTERS);
  const [editingFilter, setEditingFilter] = useState<string | null>(null);

  const toggleFilter = (id: string) => {
    setFilters(filters.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🧠 智能过滤</h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI 驱动的智能内容过滤
              </p>
            </div>
          </div>
        </header>

        {/* Filter List */}
        <div className="space-y-4">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border transition-colors ${
                filter.enabled
                  ? "border-blue-200 dark:border-blue-800"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="p-4 flex items-start gap-4">
                <div className="flex items-center h-6 mt-1">
                  <input
                    type="checkbox"
                    checked={filter.enabled}
                    onChange={() => toggleFilter(filter.id)}
                    className="w-5 h-5 rounded text-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${!filter.enabled ? "text-gray-400" : ""}`}>
                      {filter.name}
                    </h3>
                    {filter.enabled && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{filter.description}</p>

                  {filter.enabled && (
                    <div className="mt-3 space-y-1">
                      {filter.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">•</span>
                          <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {condition}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setEditingFilter(editingFilter === filter.id ? null : filter.id)}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-blue-500"
                >
                  {editingFilter === filter.id ? "收起" : "编辑"}
                </button>
              </div>

              {editingFilter === filter.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-500 mb-2">筛选条件</div>
                    <div className="space-y-2">
                      {filter.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={condition}
                            className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                          />
                          <button className="text-red-400 hover:text-red-600 text-sm">删除</button>
                        </div>
                      ))}
                    </div>
                    <button className="mt-2 text-sm text-blue-500 hover:text-blue-600">
                      + 添加条件
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Filter */}
        <button className="w-full mt-6 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
          + 创建新的智能过滤器
        </button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 智能过滤器使用 AI 分析内容特征</li>
            <li>• 可以组合多个条件实现复杂过滤</li>
            <li>• 启用的过滤器会实时应用到文章列表</li>
          </ul>
        </div>
      </div>
    </main>
  );
}