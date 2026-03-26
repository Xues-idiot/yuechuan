"use client";

import { useState } from "react";
import Card from "./Card";

interface ReadingInsightsPanelProps {
  stats: {
    totalRead: number;
    totalTime: number; // 分钟
    avgReadTime: number;
    streakDays: number;
    topTags: Array<{ tag: string; count: number }>;
    topFeeds: Array<{ name: string; count: number }>;
  };
}

export default function ReadingInsightsPanel({ stats }: ReadingInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tags" | "feeds">("overview");

  const tabs = [
    { value: "overview", label: "总览" },
    { value: "tags", label: "标签" },
    { value: "feeds", label: "订阅源" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">📊 阅读洞察</h3>

      {/* 标签切换 */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as typeof activeTab)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === tab.value
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 总览 */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{stats.totalRead}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">总阅读篇数</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{stats.streakDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">连续阅读天数</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(stats.totalTime / 60)}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">总阅读时长</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{stats.avgReadTime}m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">平均阅读时长</div>
          </div>
        </div>
      )}

      {/* 标签统计 */}
      {activeTab === "tags" && (
        <div className="space-y-3">
          {stats.topTags.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              还没有标签数据
            </p>
          ) : (
            stats.topTags.map((item, index) => (
              <div key={item.tag} className="flex items-center gap-3">
                <span className="w-6 text-center text-gray-400">{index + 1}</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  #{item.tag}
                </span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(item.count / stats.topTags[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">{item.count}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* 订阅源统计 */}
      {activeTab === "feeds" && (
        <div className="space-y-3">
          {stats.topFeeds.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              还没有订阅源数据
            </p>
          ) : (
            stats.topFeeds.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-6 text-center text-gray-400">{index + 1}</span>
                <span className="flex-1 text-sm truncate">{item.name}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(item.count / stats.topFeeds[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">{item.count}</span>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
