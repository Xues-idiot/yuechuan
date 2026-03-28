"use client";

import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeSettingsProps {
  currentTheme?: "light" | "dark" | "auto";
  onThemeChange: (theme: "light" | "dark" | "auto") => void;
}

const themeOptions = [
  {
    value: "light" as const,
    label: "浅色",
    icon: Sun,
    description: "明亮的阅读环境",
  },
  {
    value: "dark" as const,
    label: "深色",
    icon: Moon,
    description: "减少眼睛疲劳",
  },
  {
    value: "auto" as const,
    label: "跟随系统",
    icon: Monitor,
    description: "自动适配设备设置",
  },
];

export default function ThemeSettings({
  currentTheme = "auto",
  onThemeChange,
}: ThemeSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        选择主题
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onThemeChange(option.value)}
            className="p-4 rounded-[var(--radius-md)] border-2 transition-all duration-[var(--duration-fast)] flex flex-col items-center gap-2"
            style={{
              borderColor: currentTheme === option.value ? 'var(--color-primary)' : 'var(--border-default)',
              backgroundColor: currentTheme === option.value ? 'var(--color-primary-light)' : 'transparent',
            }}
          >
            <option.icon
              className="w-6 h-6"
              style={{
                color: currentTheme === option.value ? 'var(--color-primary)' : 'var(--text-secondary)',
              }}
            />
            <span
              className="text-sm font-medium"
              style={{
                color: currentTheme === option.value ? 'var(--color-primary)' : 'var(--text-primary)',
              }}
            >
              {option.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
