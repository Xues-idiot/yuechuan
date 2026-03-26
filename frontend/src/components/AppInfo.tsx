"use client";

interface AppInfoProps {
  version?: string;
}

export default function AppInfo({ version = "1.0.0" }: AppInfoProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="text-5xl mb-3">📖</div>
        <h2 className="text-xl font-bold">阅川</h2>
        <p className="text-sm text-gray-500">YueChuan</p>
        <p className="text-xs text-gray-400 mt-1">v{version}</p>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">构建日期</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">许可证</span>
          <span>MIT</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t space-y-3">
        <p className="text-sm text-center text-gray-500">
          AI 驱动的 RSS 阅读器，支持多平台聚合
        </p>
        <div className="flex justify-center gap-4 text-2xl">
          <span title="AI 摘要">🤖</span>
          <span title="间隔复习">🧠</span>
          <span title="多平台">🔄</span>
          <span title="离线支持">📴</span>
        </div>
      </div>
    </div>
  );
}
