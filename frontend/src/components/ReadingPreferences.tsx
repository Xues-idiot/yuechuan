"use client";

import { useState } from "react";

interface ReadingPreferencesProps {
  preferences: {
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    readingMode: "light" | "sepia" | "dark";
  };
  onChange: (prefs: any) => void;
}

export default function ReadingPreferences({
  preferences,
  onChange,
}: ReadingPreferencesProps) {
  const [fontSizeHover, setFontSizeHover] = useState(false);
  const [lineHeightHover, setLineHeightHover] = useState(false);

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">阅读偏好设置</legend>

      {/* 字体大小 */}
      <div className="transition-all duration-300">
        <label
          htmlFor="font-size-slider"
          className="block text-sm font-medium mb-3 transition-colors duration-200"
          style={{ color: fontSizeHover ? 'var(--color-primary)' : 'var(--text-secondary)' }}
        >
          字体大小: {preferences.fontSize}px
        </label>
        <div className="relative">
          <input
            id="font-size-slider"
            type="range"
            min="12"
            max="24"
            value={preferences.fontSize}
            onChange={(e) =>
              onChange({ ...preferences, fontSize: Number(e.target.value) })
            }
            onMouseEnter={() => setFontSizeHover(true)}
            onMouseLeave={() => setFontSizeHover(false)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-200"
            style={{
              accentColor: 'var(--color-primary)',
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((preferences.fontSize - 12) / 12) * 100}%, var(--border-default) ${((preferences.fontSize - 12) / 12) * 100}%, var(--border-default) 100%)`
            }}
            aria-valuemin={12}
            aria-valuemax={24}
            aria-valuenow={preferences.fontSize}
            aria-valuetext={`${preferences.fontSize}像素`}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md pointer-events-none transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-primary)',
              left: `calc(${((preferences.fontSize - 12) / 12) * 100}% - 8px)`,
              transform: `translateY(-50%) scale(${fontSizeHover ? 1.2 : 1})`,
              boxShadow: fontSizeHover ? '0 0 0 4px var(--color-primary-light)' : 'var(--shadow-md)'
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>小</span>
          <span>大</span>
        </div>
      </div>

      {/* 字体 */}
      <div>
        <label
          htmlFor="font-family-select"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          字体
        </label>
        <select
          id="font-family-select"
          value={preferences.fontFamily}
          onChange={(e) =>
            onChange({ ...preferences, fontFamily: e.target.value })
          }
          className="input"
        >
          <option value="system-ui">系统字体</option>
          <option value="serif">衬线字体</option>
          <option value="sans-serif">无衬线字体</option>
          <option value="monospace">等宽字体</option>
        </select>
      </div>

      {/* 行高 */}
      <div className="transition-all duration-300">
        <label
          htmlFor="line-height-slider"
          className="block text-sm font-medium mb-3 transition-colors duration-200"
          style={{ color: lineHeightHover ? 'var(--color-primary)' : 'var(--text-secondary)' }}
        >
          行高: {preferences.lineHeight}
        </label>
        <div className="relative">
          <input
            id="line-height-slider"
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={preferences.lineHeight}
            onChange={(e) =>
              onChange({ ...preferences, lineHeight: Number(e.target.value) })
            }
            onMouseEnter={() => setLineHeightHover(true)}
            onMouseLeave={() => setLineHeightHover(false)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-200"
            style={{
              accentColor: 'var(--color-primary)',
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((preferences.lineHeight - 1) / 1) * 100}%, var(--border-default) ${((preferences.lineHeight - 1) / 1) * 100}%, var(--border-default) 100%)`
            }}
            aria-valuemin={1}
            aria-valuemax={2}
            aria-valuenow={preferences.lineHeight}
            aria-valuetext={`${preferences.lineHeight}`}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md pointer-events-none transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-primary)',
              left: `calc(${((preferences.lineHeight - 1) / 1) * 100}% - 8px)`,
              transform: `translateY(-50%) scale(${lineHeightHover ? 1.2 : 1})`,
              boxShadow: lineHeightHover ? '0 0 0 4px var(--color-primary-light)' : 'var(--shadow-md)'
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>紧凑</span>
          <span>宽松</span>
        </div>
      </div>

      {/* 阅读模式 */}
      <div role="group" aria-labelledby="reading-mode-label">
        <span id="reading-mode-label" className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
          阅读模式
        </span>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "浅色", bg: "#FFFFFF", text: "#0F172A", border: "#E2E8F0", darkBg: "#FFFFFF", darkText: "#0F172A", darkBorder: "#E2E8F0" },
            { value: "sepia", label: "护眼", bg: "#FEF3C7", text: "#78350F", border: "#FDE68A", darkBg: "#FEF3C7", darkText: "#78350F", darkBorder: "#FDE68A" },
            { value: "dark", label: "深色", bg: "#1E293B", text: "#F8FAFC", border: "#334155", darkBg: "#0F172A", darkText: "#F8FAFC", darkBorder: "#334155" },
          ].map((mode) => {
            const isSelected = preferences.readingMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  onChange({
                    ...preferences,
                    readingMode: mode.value as typeof preferences.readingMode,
                  })
                }
                className="p-4 rounded-[var(--radius-md)] border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: mode.bg,
                  color: mode.text,
                  borderColor: isSelected ? 'var(--color-primary)' : mode.border,
                  boxShadow: isSelected
                    ? '0 0 0 3px var(--color-primary-light), 0 4px 12px rgba(3, 105, 161, 0.2)'
                    : 'var(--shadow-sm)',
                  outlineColor: 'var(--border-focus)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span className="text-sm font-medium block">{mode.label}</span>
                {isSelected && (
                  <div
                    className="mt-2 mx-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
