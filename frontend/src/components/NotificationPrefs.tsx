"use client";

import Toggle from "./Toggle";

interface NotificationPrefsProps {
  prefs: {
    enabled: boolean;
    reviewReminder: boolean;
    newContent: boolean;
    goalAchieved: boolean;
  };
  onChange: (prefs: any) => void;
}

export default function NotificationPrefs({
  prefs,
  onChange,
}: NotificationPrefsProps) {
  return (
    <div className="space-y-4">
      <Toggle
        label="启用通知"
        checked={prefs.enabled}
        onChange={(checked) => onChange({ ...prefs, enabled: checked })}
      />

      {prefs.enabled && (
        <div className="pl-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700">
          <Toggle
            label="复习提醒"
            description="间隔复习到期时通知"
            checked={prefs.reviewReminder}
            onChange={(checked) => onChange({ ...prefs, reviewReminder: checked })}
          />

          <Toggle
            label="新内容"
            description="订阅源更新时通知"
            checked={prefs.newContent}
            onChange={(checked) => onChange({ ...prefs, newContent: checked })}
          />

          <Toggle
            label="目标达成"
            description="阅读目标完成时通知"
            checked={prefs.goalAchieved}
            onChange={(checked) => onChange({ ...prefs, goalAchieved: checked })}
          />
        </div>
      )}
    </div>
  );
}
