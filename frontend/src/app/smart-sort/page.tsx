"use client";

import { useState } from "react";

interface SortOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const SORT_OPTIONS: SortOption[] = [
  { id: "ai", name: "AI 智能排序", description: "根据内容质量相关性排序", icon: "🤖" },
  { id: "time", name: "时间排序", description: "按发布时间从新到旧", icon: "🕐" },
  { id: "feed", name: "订阅源分组", description: "按订阅源分组显示", icon: "📰" },
  { id: "priority", name: "优先级排序", description: "重要内容优先显示", icon: "⭐" },
];

const FILTER_OPTIONS = [
  { id: "all", name: "全部", count: 128 },
  { id: "unread", name: "未读", count: 45 },
  { id: "starred", name: "已收藏", count: 12 },
  { id: "today", name: "今天", count: 23 },
];

export default function SmartSortPage() {
  const [sortBy, setSortBy] = useState("ai");
  const [filterBy, setFilterBy] = useState("all");

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔄 智能排序</h1>
          <p className="text-gray-600 dark:text-gray-400">
            自定义内容排序和筛选方式
          </p>
        </header>

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📊 内容筛选</h2>
          <div className="grid grid-cols-4 gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilterBy(opt.id)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  filterBy === opt.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="text-lg font-bold">{opt.count}</div>
                <div className="text-xs text-gray-500">{opt.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">🎯 排序方式</h2>
          <div className="space-y-3">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`w-full p-4 rounded-lg border text-left transition-colors ${
                  sortBy === opt.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <div className="font-medium">{opt.name}</div>
                    <div className="text-sm text-gray-500">{opt.description}</div>
                  </div>
                </div>
                {sortBy === opt.id && (
                  <div className="mt-2 text-xs text-blue-500">✓ 当前使用</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Sort Settings */}
        {sortBy === "ai" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="font-semibold mb-4">🤖 AI 排序设置</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>基于阅读历史学习</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>高权重：技术内容</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>高权重：长文章</span>
                  <input type="checkbox" className="w-5 h-5 rounded text-blue-500" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold mb-4">👁️ 预览效果</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                  {i}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">文章标题 {i}</div>
                  <div className="text-xs text-gray-400">订阅源名称</div>
                </div>
                <div className="text-xs text-gray-400">
                  {sortBy === "ai" ? "AI 评分 95%" : sortBy === "time" ? "3小时前" : "分组"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• AI 智能排序会根据你的阅读偏好自动优化</li>
            <li>• 长时间使用后，排序会更加精准</li>
            <li>• 可以随时切换回传统排序方式</li>
          </ul>
        </div>
      </div>
    </main>
  );
}