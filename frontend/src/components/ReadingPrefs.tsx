"use client";

interface ReadingPrefsProps {
  prefs: {
    fontSize: number;
    lineHeight: number;
    readingMode: "light" | "sepia" | "dark";
  };
  onChange: (prefs: any) => void;
}

export default function ReadingPrefs({ prefs, onChange }: ReadingPrefsProps) {
  return (
    <div className="space-y-6">
      {/* 字体大小 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          字体大小: {prefs.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="24"
          value={prefs.fontSize}
          onChange={(e) => onChange({ ...prefs, fontSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* 行高 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          行高: {prefs.lineHeight}
        </label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={prefs.lineHeight}
          onChange={(e) => onChange({ ...prefs, lineHeight: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* 阅读模式 */}
      <div>
        <label className="block text-sm font-medium mb-3">阅读模式</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "light", label: "浅色", className: "bg-white text-gray-900" },
            { value: "sepia", label: "护眼", className: "bg-amber-50 text-amber-900" },
            { value: "dark", label: "深色", className: "bg-gray-900 text-gray-100" },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() =>
                onChange({
                  ...prefs,
                  readingMode: mode.value as typeof prefs.readingMode,
                })
              }
              className={`p-4 rounded-lg border-2 transition-colors ${mode.className} ${
                prefs.readingMode === mode.value
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
