"use client";

import { Sparkles, Target, Flame } from "lucide-react";

interface GoalProgressProps {
  current: number;
  target: number;
  unit?: string;
  streakDays?: number;
}

export default function GoalProgress({
  current,
  target,
  unit = "篇",
  streakDays = 0,
}: GoalProgressProps) {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isComplete = current >= target;

  const getMessage = () => {
    if (isComplete) return "目标达成！继续加油";
    const remaining = target - current;
    return `再读 ${remaining} ${unit} 即可完成目标`;
  };

  return (
    <div
      className="p-5 rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface-primary)',
        borderColor: isComplete ? 'var(--color-success)' : 'var(--border-default)',
        boxShadow: isComplete ? 'var(--shadow-glass)' : 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <Target
              className="w-4 h-4"
              style={{ color: 'var(--color-primary)' }}
              aria-hidden="true"
            />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            今日目标
          </span>
        </div>
        {streakDays > 0 && (
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--text-inverse)' }}
          >
            <Flame className="w-3 h-3" aria-hidden="true" />
            {streakDays}天
          </div>
        )}
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-sm"
          style={{ color: isComplete ? 'var(--color-success)' : 'var(--text-secondary)' }}
        >
          {current} / {target} {unit}
        </span>
        <span
          className={`text-sm font-semibold ${isComplete ? '' : 'breathe'}`}
          style={{ color: isComplete ? 'var(--color-success)' : 'var(--color-primary)' }}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-3 rounded-full overflow-hidden mb-3"
        style={{ backgroundColor: 'var(--border-default)' }}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isComplete ? 'progress-fill' : ''
          }`}
          style={{
            width: `${percentage}%`,
            background: isComplete
              ? 'linear-gradient(90deg, var(--color-success), var(--color-primary))'
              : 'linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))',
            boxShadow: isComplete
              ? '0 0 12px var(--color-success)'
              : 'none',
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className={`text-base font-semibold ${isComplete ? '' : ''}`}
          style={{ color: isComplete ? 'var(--color-success)' : 'var(--text-primary)' }}
        >
          {getMessage()}
        </span>
        {isComplete && (
          <Sparkles
            className="w-5 h-5 breathe"
            style={{ color: 'var(--color-accent)' }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
