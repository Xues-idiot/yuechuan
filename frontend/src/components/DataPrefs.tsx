"use client";

import Toggle from "./Toggle";

interface DataPrefsProps {
  prefs: {
    cacheEnabled: boolean;
    cacheSize: number;
    offlineEnabled: boolean;
    autoDeleteOld: boolean;
    autoDeleteDays: number;
  };
  onChange: (prefs: any) => void;
}

export default function DataPrefs({ prefs, onChange }: DataPrefsProps) {
  return (
    <div className="space-y-4">
      <Toggle
        label="启用缓存"
        description="缓存内容以便离线阅读"
        checked={prefs.cacheEnabled}
        onChange={(checked) => onChange({ ...prefs, cacheEnabled: checked })}
      />

      {prefs.cacheEnabled && (
        <div className="pl-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium mb-2">
              缓存大小限制: {prefs.cacheSize} MB
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={prefs.cacheSize}
              onChange={(e) => onChange({ ...prefs, cacheSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      <Toggle
        label="离线模式"
        description="在无网络时继续阅读"
        checked={prefs.offlineEnabled}
        onChange={(checked) => onChange({ ...prefs, offlineEnabled: checked })}
      />

      <Toggle
        label="自动清理"
        description="自动删除旧内容"
        checked={prefs.autoDeleteOld}
        onChange={(checked) => onChange({ ...prefs, autoDeleteOld: checked })}
      />

      {prefs.autoDeleteOld && (
        <div className="pl-4">
          <label className="block text-sm font-medium mb-2">
            保留天数: {prefs.autoDeleteDays} 天
          </label>
          <input
            type="range"
            min="7"
            max="90"
            step="7"
            value={prefs.autoDeleteDays}
            onChange={(e) =>
              onChange({ ...prefs, autoDeleteDays: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
