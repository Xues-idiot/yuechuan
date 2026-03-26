"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Slider from "./Slider";

interface ReadingGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: {
    dailyTarget: number;
    streakDays: number;
  };
  onSave: (goal: { dailyTarget: number }) => void;
}

export default function ReadingGoalModal({
  isOpen,
  onClose,
  currentGoal,
  onSave,
}: ReadingGoalModalProps) {
  const [dailyTarget, setDailyTarget] = useState(currentGoal.dailyTarget);

  const handleSave = () => {
    onSave({ dailyTarget });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置阅读目标" size="md">
      <div className="space-y-6">
        {/* 当前进度 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              今日进度
            </span>
            <span className="text-sm font-medium">
              {Math.min(100, Math.round((5 / dailyTarget) * 100))}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${Math.min(100, (5 / dailyTarget) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>已读 5 篇</span>
            <span>目标 {dailyTarget} 篇</span>
          </div>
        </div>

        {/* 连续天数 */}
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <span className="text-3xl">🔥</span>
          <div>
            <div className="font-semibold">{currentGoal.streakDays} 天</div>
            <div className="text-sm text-gray-500">连续阅读</div>
          </div>
        </div>

        {/* 目标设置 */}
        <div className="space-y-4">
          <h3 className="font-medium">每日阅读目标</h3>
          <Slider
            value={dailyTarget}
            onChange={setDailyTarget}
            min={1}
            max={50}
            step={1}
            formatValue={(v) => `${v} 篇/天`}
          />
          <p className="text-sm text-gray-500">
            设置合理的阅读目标，养成良好的阅读习惯
          </p>
        </div>

        {/* 快捷选项 */}
        <div className="flex gap-2">
          {[5, 10, 20, 30].map((value) => (
            <button
              key={value}
              onClick={() => setDailyTarget(value)}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                dailyTarget === value
                  ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {value} 篇
            </button>
          ))}
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSave}>
            保存设置
          </Button>
        </div>
      </div>
    </Modal>
  );
}
