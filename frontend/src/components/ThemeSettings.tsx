"use client";

import { useState } from "react";
import Button from "./Button";

interface ThemeSettingsProps {
  currentTheme?: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export default function ThemeSettings({
  currentTheme = "system",
  onThemeChange,
}: ThemeSettingsProps) {
  const themes = [
    { value: "light", label: "浅色", icon: "☀️", description: "使用浅色主题" },
    { value: "dark", label: "深色", icon: "🌙", description: "使用深色主题" },
    { value: "system", label: "跟随系统", icon: "💻", description: "跟随系统设置" },
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500">选择主题</h3>

      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2 ${
              currentTheme === theme.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl">{theme.icon}</span>
            <span className="text-sm font-medium">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
