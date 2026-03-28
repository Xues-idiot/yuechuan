"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";

interface ReadingGoal {
  daily: number;
  weekly: number;
  monthly: number;
}

interface ReadingProgress {
  daily: number;
  weekly: number;
  monthly: number;
}

const GOAL_STORAGE_KEY = "reading_goal";

// Chart icon for header
function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const loadProgress = useCallback(async () => {
    try {
      const stats = await api.getReadingStats();
      setProgress({
        daily: 0,
        weekly: 0,
        monthly: stats.read_items || 0,
      });
    } catch (e) {
      // ignore error
    } finally {
      setLoading(false);
    }
  }, []);

  const saveGoals = useCallback(() => {
    setGoals(tempGoals);
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(tempGoals));
    setShowSettings(false);
  }, [tempGoals]);

  const progressData = useMemo(() => ({
    daily: { percent: Math.min(100, Math.round((progress.daily / goals.daily) * 100)), completed: progress.daily >= goals.daily },
    weekly: { percent: Math.min(100, Math.round((progress.weekly / goals.weekly) * 100)), completed: progress.weekly >= goals.weekly },
    monthly: { percent: Math.min(100, Math.round((progress.monthly / goals.monthly) * 100)), completed: progress.monthly >= goals.monthly },
  }), [progress, goals]);

  const getProgressColor = useCallback((percent: number) => {
    if (percent >= 100) return "var(--color-success)";
    if (percent >= 70) return "var(--color-primary)";
    if (percent >= 40) return "var(--color-warning)";
    return "var(--text-tertiary)";
  }, []);

  if (loading) {
    return (
      <div
        className="card-elevated p-4 h-[180px]"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="skeleton h-full rounded" />
      </div>
    );
  }

  return (
    <div
      className="card-elevated p-5 transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--color-primary)' }}>
            <ChartIcon />
          </span>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            阅读目标
          </h3>
        </div>
        <button
          onClick={() => {
            setTempGoals(goals);
            setShowSettings(!showSettings);
          }}
          className="btn btn-ghost flex items-center gap-1 text-sm py-1 px-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <SettingsIcon />
          <span>{showSettings ? "取消" : "设置"}</span>
        </button>
      </div>

      {showSettings ? (
        <div className="space-y-3 animate-fade-in">
          {[
            { key: 'daily', label: '每日目标（篇）', max: 100 },
            { key: 'weekly', label: '每周目标（篇）', max: 500 },
            { key: 'monthly', label: '每月目标（篇）', max: 2000 },
          ].map(({ key, label, max }) => (
            <div key={key}>
              <label className="text-sm mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </label>
              <input
                type="number"
                value={tempGoals[key as keyof ReadingGoal]}
                onChange={(e) => setTempGoals({ ...tempGoals, [key]: parseInt(e.target.value) || 0 })}
                min={1}
                max={max}
                className="input"
              />
            </div>
          ))}
          <button
            onClick={saveGoals}
            className="btn btn-primary w-full"
          >
            保存
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            { key: 'daily', label: '今日', value: progress.daily, goal: goals.daily, data: progressData.daily },
            { key: 'weekly', label: '本周', value: progress.weekly, goal: goals.weekly, data: progressData.weekly },
            { key: 'monthly', label: '本月', value: progress.monthly, goal: goals.monthly, data: progressData.monthly },
          ].map(({ key, label, value, goal, data }) => (
            <div key={key} className="group">
              <div className="flex justify-between text-sm mb-1.5">
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span
                  className="flex items-center gap-1 transition-colors"
                  style={{ color: data.completed ? 'var(--color-success)' : 'var(--text-primary)' }}
                >
                  {value} / {goal} 篇
                  {data.completed && <CheckIcon />}
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden transition-all duration-300"
                style={{ backgroundColor: 'var(--border-default)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: mounted ? `${data.percent}%` : '0%',
                    backgroundColor: getProgressColor(data.percent),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
