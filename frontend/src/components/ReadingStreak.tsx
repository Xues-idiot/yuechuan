"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_read_days: number;
  today_read_count: number;
  today_items: Array<{ id: number; title: string; url: string }>;
  week_logs: Array<{ date: string; items_read: number; reading_time_minutes: number }>;
}

export default function ReadingStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    try {
      const data = await api.getStreak();
      setStreak(data);
    } catch (error) {
      console.error("Failed to load streak:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!streak) return null;

  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">📅 阅读打卡</h3>
        {streak.current_streak > 0 && (
          <span className="text-sm text-orange-500 font-medium">
            🔥 {streak.current_streak} 天连续
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center" title={`周${day}: 0 篇`}>
              <div
                className="w-full aspect-square rounded-sm transition-colors"
                style={{ backgroundColor: "rgba(156, 163, 175, 0.2)" }}
              />
              <div className="text-xs text-gray-500 mt-1">周{day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
          <div className="text-2xl font-bold text-orange-500">{streak.current_streak}</div>
          <div className="text-xs text-gray-500">当前连续</div>
        </div>
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="text-2xl font-bold text-blue-500">{streak.longest_streak}</div>
          <div className="text-xs text-gray-500">最长连续</div>
        </div>
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="text-2xl font-bold text-green-500">{streak.today_read_count}</div>
          <div className="text-xs text-gray-500">今日已读</div>
        </div>
      </div>

      {streak.today_items.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="text-sm text-gray-500 mb-2">今日已读</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {streak.today_items.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
