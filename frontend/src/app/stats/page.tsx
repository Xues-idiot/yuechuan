"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getGoal, getTodayProgress, getWeekProgress, setGoal as saveGoal, ReadingGoal } from "@/lib/reading-goal";
import ThemeToggle from "@/components/ThemeToggle";

interface ReadingStats {
  total_items: number;
  read_items: number;
  unread_items: number;
  starred_items: number;
  ai_summarized: number;
  ai_translated: number;
  knowledge_saved: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState<ReadingGoal>({ daily: 5, weekly: 30 });
  const [todayProgress, setTodayProgress] = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);
  const [showGoalEdit, setShowGoalEdit] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getReadingStats();
        setStats(data);
        setGoal(getGoal());
        setTodayProgress(getTodayProgress());
        setWeekProgress(getWeekProgress());
      } catch (e) {
        console.error("加载统计失败", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSaveGoal(newGoal: ReadingGoal) {
    saveGoal(newGoal);
    setGoal(newGoal);
    setShowGoalEdit(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-500">加载中...</p>
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-500">加载失败</p>
          <Link href="/" className="text-blue-600 hover:underline">返回</Link>
        </div>
      </main>
    );
  }

  const readRate = stats.total_items > 0
    ? Math.round((stats.read_items / stats.total_items) * 100)
    : 0;

  const todayPercent = Math.min(100, Math.round((todayProgress / goal.daily) * 100));
  const weekPercent = Math.min(100, Math.round((weekProgress / goal.weekly) * 100));

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">阅读统计</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* 阅读目标 */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">阅读目标</h2>
            <button
              onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showGoalEdit ? "收起" : "设置目标"}
            </button>
          </div>

          {showGoalEdit && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">每日目标（篇）</label>
                  <input
                    type="number"
                    value={goal.daily}
                    onChange={(e) => setGoal({ ...goal, daily: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={100}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">每周目标（篇）</label>
                  <input
                    type="number"
                    value={goal.weekly}
                    onChange={(e) => setGoal({ ...goal, weekly: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={500}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveGoal(goal)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存目标
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* 每日目标 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>今日阅读</span>
                <span>{todayProgress} / {goal.daily} 篇 ({todayPercent}%)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${todayPercent}%` }}
                />
              </div>
            </div>

            {/* 每周目标 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>本周阅读</span>
                <span>{weekProgress} / {goal.weekly} 篇 ({weekPercent}%)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${weekPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 阅读概览 */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">阅读概览</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.total_items}</div>
              <div className="text-sm text-gray-500">总内容数</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{readRate}%</div>
              <div className="text-sm text-gray-500">已读率</div>
            </div>
          </div>
        </div>

        {/* 详细数据 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">{stats.read_items}</div>
            <div className="text-sm text-gray-500">已读</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">{stats.unread_items}</div>
            <div className="text-sm text-gray-500">未读</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600">{stats.starred_items}</div>
            <div className="text-sm text-gray-500">收藏</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600">{stats.knowledge_saved}</div>
            <div className="text-sm text-gray-500">知识库</div>
          </div>
        </div>

        {/* AI 功能使用 */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">AI 功能使用</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">AI 摘要生成</span>
              <span className="font-semibold text-blue-600">{stats.ai_summarized} 篇</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">AI 翻译</span>
              <span className="font-semibold text-purple-600">{stats.ai_translated} 篇</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
