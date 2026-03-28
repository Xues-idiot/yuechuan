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

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  );
}

function TranslationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 4.5-12-4.5 12Zm0 0L3.75 9m4.5 0 4.5 12" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
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
      <main className="min-h-screen p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto">
          <p style={{ color: 'var(--text-secondary)' }}>加载中...</p>
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto">
          <p style={{ color: 'var(--color-error)' }}>加载失败</p>
          <Link href="/" style={{ color: 'var(--color-primary)' }}>返回</Link>
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
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* 头部 */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="flex items-center gap-1 text-sm mb-3 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeftIcon />
              <span>返回</span>
            </Link>
            <h1 className="text-3xl font-bold font-serif" style={{ color: 'var(--text-primary)' }}>
              阅读统计
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* 阅读目标卡片 */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              阅读目标
            </h2>
            <button
              onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-sm transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              {showGoalEdit ? "收起" : "设置目标"}
            </button>
          </div>

          {showGoalEdit && (
            <div
              className="mb-5 p-4 rounded-lg"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    每日目标（篇）
                  </label>
                  <input
                    type="number"
                    value={goal.daily}
                    onChange={(e) => setGoal({ ...goal, daily: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={100}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    每周目标（篇）
                  </label>
                  <input
                    type="number"
                    value={goal.weekly}
                    onChange={(e) => setGoal({ ...goal, weekly: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={500}
                    className="input"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSaveGoal(goal)}
                className="btn btn-primary mt-4"
              >
                保存目标
              </button>
            </div>
          )}

          <div className="space-y-5">
            {/* 每日目标 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>今日阅读</span>
                <span style={{ color: 'var(--text-primary)' }}>{todayProgress} / {goal.daily} 篇 ({todayPercent}%)</span>
              </div>
              <div
                className="w-full rounded-full h-2"
                style={{ backgroundColor: 'var(--border-default)' }}
                role="progressbar"
                aria-valuenow={todayProgress}
                aria-valuemin={0}
                aria-valuemax={goal.daily}
                aria-label={`今日阅读进度: ${todayProgress} / ${goal.daily} 篇`}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${todayPercent}%`,
                    backgroundColor: 'var(--color-primary)'
                  }}
                />
              </div>
            </div>

            {/* 每周目标 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>本周阅读</span>
                <span style={{ color: 'var(--text-primary)' }}>{weekProgress} / {goal.weekly} 篇 ({weekPercent}%)</span>
              </div>
              <div
                className="w-full rounded-full h-2"
                style={{ backgroundColor: 'var(--border-default)' }}
                role="progressbar"
                aria-valuenow={weekProgress}
                aria-valuemin={0}
                aria-valuemax={goal.weekly}
                aria-label={`本周阅读进度: ${weekProgress} / ${goal.weekly} 篇`}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${weekPercent}%`,
                    backgroundColor: 'var(--color-success)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 阅读概览 */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            阅读概览
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="text-center p-5 rounded-xl"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
              role="group"
              aria-label="总内容数"
            >
              <div
                className="text-4xl font-bold mb-1"
                style={{ color: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {stats.total_items}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                总内容数
              </div>
            </div>
            <div
              className="text-center p-5 rounded-xl"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
              role="group"
              aria-label="已读率"
            >
              <div
                className="text-4xl font-bold mb-1"
                style={{ color: 'var(--color-success)' }}
                aria-hidden="true"
              >
                {readRate}%
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                已读率
              </div>
            </div>
          </div>
        </div>

        {/* 详细数据 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { value: stats.read_items, label: '已读', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
            { value: stats.unread_items, label: '未读', color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
            { value: stats.starred_items, label: '收藏', color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
            { value: stats.knowledge_saved, label: '知识库', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          ].map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* AI 功能使用 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            AI 功能使用
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}
                >
                  <span style={{ color: 'var(--color-primary)' }}>
                    <SparklesIcon />
                  </span>
                </div>
                <span style={{ color: 'var(--text-primary)' }}>AI 摘要生成</span>
              </div>
              <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {stats.ai_summarized} 篇
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}
                >
                  <span style={{ color: 'var(--color-primary)' }}>
                    <TranslationIcon />
                  </span>
                </div>
                <span style={{ color: 'var(--text-primary)' }}>AI 翻译</span>
              </div>
              <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {stats.ai_translated} 篇
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
