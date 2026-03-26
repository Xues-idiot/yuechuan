"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface ReadingGoal {
  daily: number;      // 每日目标
  weekly: number;     // 每周目标
  monthly: number;    // 每月目标
}

interface ReadingProgress {
  daily: number;
  weekly: number;
  monthly: number;
}

const GOAL_STORAGE_KEY = "reading_goal";

export default function ReadingGoalWidget() {
  const [goals, setGoals] = useState<ReadingGoal>({
    daily: 5,
    weekly: 30,
    monthly: 100,
  });
  const [progress, setProgress] = useState<ReadingProgress>({ daily: 0, weekly: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  useEffect(() => {
    // 从 localStorage 加载目标
    const saved = localStorage.getItem(GOAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGoals(parsed);
        setTempGoals(parsed);
      } catch {
        // ignore invalid JSON
      }
    }
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const stats = await api.getReadingStats();
      // 使用后端返回的 read_items 作为总阅读数
      // 注意：后端目前不提供日/周/月的细分数据，这里用 read_items 代替
      setProgress({
        daily: 0, // 后端暂不提供每日数据
        weekly: 0, // 后端暂不提供每周数据
        monthly: stats.read_items || 0, // 使用总阅读数作为参考
      });
    } catch (e) {
      // 忽略错误
    } finally {
      setLoading(false);
    }
  }

  function saveGoals() {
    setGoals(tempGoals);
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(tempGoals));
    setShowSettings(false);
  }

  function getProgressPercent(current: number, goal: number): number {
    return Math.min(100, Math.round((current / goal) * 100));
  }

  function getProgressColor(percent: number): string {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 70) return "bg-blue-500";
    if (percent >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  }

  if (loading) {
    return <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">📊 阅读目标</h3>
        <button
          onClick={() => {
            setTempGoals(goals);
            setShowSettings(!showSettings);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          {showSettings ? "取消" : "设置目标"}
        </button>
      </div>

      {showSettings ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">每日目标（篇）</label>
            <input
              type="number"
              value={tempGoals.daily}
              onChange={(e) => setTempGoals({ ...tempGoals, daily: parseInt(e.target.value) || 0 })}
              min={1}
              max={100}
              className="w-full px-3 py-1 border rounded dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">每周目标（篇）</label>
            <input
              type="number"
              value={tempGoals.weekly}
              onChange={(e) => setTempGoals({ ...tempGoals, weekly: parseInt(e.target.value) || 0 })}
              min={1}
              max={500}
              className="w-full px-3 py-1 border rounded dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">每月目标（篇）</label>
            <input
              type="number"
              value={tempGoals.monthly}
              onChange={(e) => setTempGoals({ ...tempGoals, monthly: parseInt(e.target.value) || 0 })}
              min={1}
              max={2000}
              className="w-full px-3 py-1 border rounded dark:bg-gray-700"
            />
          </div>
          <button
            onClick={saveGoals}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 每日 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">今日</span>
              <span className={progress.daily >= goals.daily ? "text-green-600" : ""}>
                {progress.daily} / {goals.daily} 篇
                {progress.daily >= goals.daily && " ✅"}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(getProgressPercent(progress.daily, goals.daily))} transition-all duration-300`}
                style={{ width: `${getProgressPercent(progress.daily, goals.daily)}%` }}
              />
            </div>
          </div>

          {/* 每周 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">本周</span>
              <span className={progress.weekly >= goals.weekly ? "text-green-600" : ""}>
                {progress.weekly} / {goals.weekly} 篇
                {progress.weekly >= goals.weekly && " ✅"}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(getProgressPercent(progress.weekly, goals.weekly))} transition-all duration-300`}
                style={{ width: `${getProgressPercent(progress.weekly, goals.weekly)}%` }}
              />
            </div>
          </div>

          {/* 每月 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">本月</span>
              <span className={progress.monthly >= goals.monthly ? "text-green-600" : ""}>
                {progress.monthly} / {goals.monthly} 篇
                {progress.monthly >= goals.monthly && " ✅"}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(getProgressPercent(progress.monthly, goals.monthly))} transition-all duration-300`}
                style={{ width: `${getProgressPercent(progress.monthly, goals.monthly)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
