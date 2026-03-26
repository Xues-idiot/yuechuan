"use client";

interface FeedPreferencesProps {
  prefs: {
    defaultView: "list" | "card";
    sortBy: "date" | "title";
    sortOrder: "asc" | "desc";
    showThumbnails: boolean;
    showExcerpts: boolean;
  };
  onChange: (prefs: any) => void;
}

export default function FeedPreferences({ prefs, onChange }: FeedPreferencesProps) {
  return (
    <div className="space-y-6">
      {/* 默认视图 */}
      <div>
        <label className="block text-sm font-medium mb-2">默认视图</label>
        <div className="flex gap-2">
          {[
            { value: "list", label: "列表", icon: "📋" },
            { value: "card", label: "卡片", icon: "🃏" },
          ].map((view) => (
            <button
              key={view.value}
              onClick={() => onChange({ ...prefs, defaultView: view.value })}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-1 ${
                prefs.defaultView === view.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{view.icon}</span>
              <span className="text-sm">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 排序 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">排序方式</label>
          <select
            value={prefs.sortBy}
            onChange={(e) => onChange({ ...prefs, sortBy: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="date">按日期</option>
            <option value="title">按标题</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">排序顺序</label>
          <select
            value={prefs.sortOrder}
            onChange={(e) => onChange({ ...prefs, sortOrder: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>
        </div>
      </div>

      {/* 显示选项 */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.showThumbnails}
            onChange={(e) => onChange({ ...prefs, showThumbnails: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">显示缩略图</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.showExcerpts}
            onChange={(e) => onChange({ ...prefs, showExcerpts: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">显示摘要</span>
        </label>
      </div>
    </div>
  );
}
