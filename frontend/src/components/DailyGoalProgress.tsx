"use client";

interface DailyGoalProgressProps {
  current: number;
  target: number;
  unit?: string;
}

export default function DailyGoalProgress({
  current,
  target,
  unit = "篇",
}: DailyGoalProgressProps) {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isComplete = current >= target;

  const getMessage = () => {
    if (isComplete) return "今日目标已完成！🎉";
    const remaining = target - current;
    return `再读 ${remaining} ${unit} 即可完成目标`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">今日目标</span>
        <span className={`text-sm ${isComplete ? "text-green-600" : "text-gray-500"}`}>
          {current} / {target} {unit}
        </span>
      </div>

      {/* 进度条 */}
      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-500 ${
            isComplete
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : "bg-gradient-to-r from-blue-400 to-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 百分比 */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
        <span className="text-sm text-gray-500">{getMessage()}</span>
      </div>
    </div>
  );
}
