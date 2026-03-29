"use client";

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
  return (
    <div className="space-y-6">
      {/* 字体大小 */}
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          字体大小: {preferences.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="24"
          value={preferences.fontSize}
          onChange={(e) =>
            onChange({ ...preferences, fontSize: Number(e.target.value) })
          }
          className="w-full"
          style={{ accentColor: 'var(--color-primary)' }}
        />
      </div>

      {/* 字体 */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          字体
        </label>
        <select
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
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          行高: {preferences.lineHeight}
        </label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={preferences.lineHeight}
          onChange={(e) =>
            onChange({ ...preferences, lineHeight: Number(e.target.value) })
          }
          className="w-full"
          style={{ accentColor: 'var(--color-primary)' }}
        />
      </div>

      {/* 阅读模式 */}
      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          阅读模式
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "浅色", bg: "#FFFFFF", text: "#0F172A", border: "#E2E8F0" },
            { value: "sepia", label: "护眼", bg: "#FEF3C7", text: "#78350F", border: "#FDE68A" },
            { value: "dark", label: "深色", bg: "#0F172A", text: "#F8FAFC", border: "#334155" },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() =>
                onChange({
                  ...preferences,
                  readingMode: mode.value as typeof preferences.readingMode,
                })
              }
              className="p-4 rounded-[var(--radius-md)] border-2 transition-all"
              style={{
                backgroundColor: mode.bg,
                color: mode.text,
                borderColor:
                  preferences.readingMode === mode.value
                    ? 'var(--color-primary)'
                    : mode.border,
                boxShadow:
                  preferences.readingMode === mode.value
                    ? '0 0 0 2px var(--color-primary-light)'
                    : 'none',
              }}
            >
              <span className="text-sm font-medium block">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
