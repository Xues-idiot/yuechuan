"use client";

import Toggle from "./Toggle";

interface SyncSettingsProps {
  settings: {
    enabled: boolean;
    autoSync: boolean;
    syncInterval: number;
    syncOnStartup: boolean;
  };
  onChange: (settings: any) => void;
}

export default function SyncSettings({
  settings,
  onChange,
}: SyncSettingsProps) {
  return (
    <div className="space-y-4">
      <Toggle
        label="启用同步"
        description="同步阅读进度和设置"
        checked={settings.enabled}
        onChange={(checked) => onChange({ ...settings, enabled: checked })}
      />

      {settings.enabled && (
        <div className="pl-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700">
          <Toggle
            label="自动同步"
            description="定期自动同步数据"
            checked={settings.autoSync}
            onChange={(checked) => onChange({ ...settings, autoSync: checked })}
          />

          {settings.autoSync && (
            <div className="pl-4">
              <label className="block text-sm font-medium mb-2">
                同步间隔: {settings.syncInterval} 分钟
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={settings.syncInterval}
                onChange={(e) =>
                  onChange({ ...settings, syncInterval: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          )}

          <Toggle
            label="启动时同步"
            description="应用启动时自动同步"
            checked={settings.syncOnStartup}
            onChange={(checked) =>
              onChange({ ...settings, syncOnStartup: checked })
            }
          />
        </div>
      )}
    </div>
  );
}
