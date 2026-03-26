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
        <label className="block text-sm font-medium mb-2">
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
        />
      </div>

      {/* 字体 */}
      <div>
        <label className="block text-sm font-medium mb-2">字体</label>
        <select
          value={preferences.fontFamily}
          onChange={(e) =>
            onChange({ ...preferences, fontFamily: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="system-ui">系统字体</option>
          <option value="serif">衬线字体</option>
          <option value="sans-serif">无衬线字体</option>
          <option value="monospace">等宽字体</option>
        </select>
      </div>

      {/* 行高 */}
      <div>
        <label className="block text-sm font-medium mb-2">
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
        />
      </div>

      {/* 阅读模式 */}
      <div>
        <label className="block text-sm font-medium mb-2">阅读模式</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "light", label: "浅色", bg: "bg-white", text: "text-gray-900" },
            { value: "sepia", label: "护眼", bg: "bg-amber-50", text: "text-amber-900" },
            { value: "dark", label: "深色", bg: "bg-gray-900", text: "text-gray-100" },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() =>
                onChange({
                  ...preferences,
                  readingMode: mode.value as typeof preferences.readingMode,
                })
              }
              className={`p-3 rounded-lg border-2 transition-colors ${mode.bg} ${mode.text} ${
                preferences.readingMode === mode.value
                  ? "border-blue-500"
                  : "border-gray-200"
              }`}
            >
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
