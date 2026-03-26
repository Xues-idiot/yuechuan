"use client";

import Slider from "./Slider";

interface GoalSettingsProps {
  goals: {
    dailyTarget: number;
    weeklyTarget: number;
    reminderEnabled: boolean;
    reminderTime: string;
  };
  onChange: (goals: any) => void;
}

export default function GoalSettings({ goals, onChange }: GoalSettingsProps) {
  return (
    <div className="space-y-6">
      <Slider
        label="每日阅读目标"
        value={goals.dailyTarget}
        onChange={(value) => onChange({ ...goals, dailyTarget: value })}
        min={1}
        max={50}
        formatValue={(v) => `${v} 篇`}
      />

      <Slider
        label="每周阅读目标"
        value={goals.weeklyTarget}
        onChange={(value) => onChange({ ...goals, weeklyTarget: value })}
        min={7}
        max={300}
        formatValue={(v) => `${v} 篇`}
      />

      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">提醒</div>
          <div className="text-sm text-gray-500">阅读目标提醒时间</div>
        </div>
        <input
          type="time"
          value={goals.reminderTime}
          onChange={(e) => onChange({ ...goals, reminderTime: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}
