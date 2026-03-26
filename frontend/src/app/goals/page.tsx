"use client";

import { useState, useEffect, useCallback } from "react";

interface GoalProgress {
  current: number;
  target: number;
  progress: number;
  remaining: number;
  completed: boolean;
}

interface GoalData {
  type: string;
  target: number;
  current: number;
}

export default function GoalsPage() {
  const [dailyGoal, setDailyGoal] = useState<GoalData>({ type: "daily", target: 10, current: 0 });
  const [weeklyGoal, setWeeklyGoal] = useState<GoalData>({ type: "weekly", target: 50, current: 0 });
  const [dailyProgress, setDailyProgress] = useState<GoalProgress | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<GoalProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState<{ type: string; value: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const loadGoals = useCallback(async () => {
    try {
      const [goalsRes, progressRes] = await Promise.all([
        fetch(`${API_BASE}/reading-goals/current`),
        fetch(`${API_BASE}/reading-goals/progress`)
      ]);

      const goalsData = await goalsRes.json();
      const progressData = await progressRes.json();

      setDailyGoal(goalsData.daily);
      setWeeklyGoal(goalsData.weekly);
      setDailyProgress(progressData.daily);
      setWeeklyProgress(progressData.weekly);
    } catch (error) {
      console.error("Failed to load goals:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleUpdateTarget = async () => {
    if (!editTarget) return;

    const newTarget = parseInt(editTarget.value, 10);
    if (isNaN(newTarget) || newTarget < 1) {
      alert("请输入有效的目标数量");
      return;
    }

    setSaving(true);
    try {
      const goalType = editTarget.type;
      const goalData = goalType === "daily" ? dailyGoal : weeklyGoal;

      await fetch(`${API_BASE}/reading-goals/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: goalType,
          target: newTarget,
          current: goalData.current,
          period_start: new Date().toISOString().split("T")[0],
          period_end: new Date().toISOString().split("T")[0]
        })
      });

      if (goalType === "daily") {
        setDailyGoal({ ...dailyGoal, target: newTarget });
      } else {
        setWeeklyGoal({ ...weeklyGoal, target: newTarget });
      }

      setEditTarget(null);
      loadGoals();
    } catch (error) {
      console.error("Failed to update goal:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleIncrement = async (goalType: string) => {
    try {
      await fetch(`${API_BASE}/reading-goals/increment/${goalType}`, {
        method: "POST"
      });
      loadGoals();
    } catch (error) {
      console.error("Failed to increment:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 阅读目标</h1>
          <p className="text-gray-600 dark:text-gray-400">
            设定目标，养成阅读习惯
          </p>
        </header>

        <div className="space-y-6">
          {/* 每日目标 */}
          <GoalCard
            title="📅 每日目标"
            description="今天要阅读多少篇文章？"
            goal={dailyGoal}
            progress={dailyProgress}
            onEdit={() => setEditTarget({ type: "daily", value: String(dailyGoal.target) })}
            onIncrement={() => handleIncrement("daily")}
            onSave={handleUpdateTarget}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
            saving={saving}
          />

          {/* 每周目标 */}
          <GoalCard
            title="📆 每周目标"
            description="本周要阅读多少篇文章？"
            goal={weeklyGoal}
            progress={weeklyProgress}
            onEdit={() => setEditTarget({ type: "weekly", value: String(weeklyGoal.target) })}
            onIncrement={() => handleIncrement("weekly")}
            onSave={handleUpdateTarget}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
            saving={saving}
          />

          {/* 提示 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 小贴士</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• 设定可实现的目标更容易坚持</li>
              <li>• 完成目标后会自动记录到打卡天数</li>
              <li>• 点击 +1 按钮可以手动增加阅读计数</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

interface GoalCardProps {
  title: string;
  description: string;
  goal: GoalData;
  progress: GoalProgress | null;
  onEdit: () => void;
  onIncrement: () => void;
  onSave: () => void;
  editTarget: { type: string; value: string } | null;
  setEditTarget: (v: { type: string; value: string } | null) => void;
  saving: boolean;
}

function GoalCard({
  title,
  description,
  goal,
  progress,
  onEdit,
  onIncrement,
  onSave,
  editTarget,
  setEditTarget,
  saving
}: GoalCardProps) {
  const isEditing = editTarget?.type === goal.type;
  const progressPercent = progress?.progress || 0;
  const isCompleted = progress?.completed || false;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${isCompleted ? "ring-2 ring-green-500" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isCompleted && (
          <span className="text-2xl">🏆</span>
        )}
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>
            {progress?.current || 0} / {goal.target} 篇
          </span>
          <span className={isCompleted ? "text-green-500 font-semibold" : "text-gray-500"}>
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        {progress && (
          <p className="text-xs text-gray-500 mt-1">
            {progress.completed
              ? "🎉 目标已完成！"
              : `还差 ${progress.remaining} 篇完成目标`}
          </p>
        )}
      </div>

      {/* 操作 */}
      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <input
              type="number"
              value={editTarget.value}
              onChange={(e) => setEditTarget({ type: goal.type, value: e.target.value })}
              className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-center bg-white dark:bg-gray-900"
              min="1"
              autoFocus
            />
            <button
              onClick={onSave}
              disabled={saving}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
            <button
              onClick={() => setEditTarget(null)}
              className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
            >
              取消
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onIncrement}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              +1 阅读
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
            >
              修改目标
            </button>
          </>
        )}
      </div>
    </div>
  );
}
