"use client";

import Toggle from "./Toggle";
import Slider from "./Slider";

interface QuickSettingsProps {
  settings: {
    autoRefresh: boolean;
    refreshInterval: number;
    notifications: boolean;
    compactMode: boolean;
    showThumbnails: boolean;
  };
  onChange: (settings: any) => void;
}

export default function QuickSettings({
  settings,
  onChange,
}: QuickSettingsProps) {
  return (
    <div className="space-y-6">
      <Toggle
        label="自动刷新"
        description="自动刷新订阅源内容"
        checked={settings.autoRefresh}
        onChange={(checked) => onChange({ ...settings, autoRefresh: checked })}
      />

      {settings.autoRefresh && (
        <Slider
          label="刷新间隔"
          value={settings.refreshInterval}
          onChange={(value) => onChange({ ...settings, refreshInterval: value })}
          min={5}
          max={60}
          step={5}
          formatValue={(v) => `${v} 分钟`}
        />
      )}

      <Toggle
        label="通知"
        description="接收新内容通知"
        checked={settings.notifications}
        onChange={(checked) => onChange({ ...settings, notifications: checked })}
      />

      <Toggle
        label="紧凑模式"
        description="减少列表项间距"
        checked={settings.compactMode}
        onChange={(checked) => onChange({ ...settings, compactMode: checked })}
      />

      <Toggle
        label="显示缩略图"
        description="在列表中显示内容缩略图"
        checked={settings.showThumbnails}
        onChange={(checked) => onChange({ ...settings, showThumbnails: checked })}
      />
    </div>
  );
}
