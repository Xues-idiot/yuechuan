"use client";

interface AboutAppProps {
  version?: string;
}

export default function AboutApp({ version = "1.0.0" }: AboutAppProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-2xl font-bold">阅川</h2>
        <p className="text-gray-500">YueChuan Reader</p>
        <p className="text-sm text-gray-400 mt-1">版本 {version}</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">构建时间</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">许可证</span>
          <span>MIT</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-500 text-center mb-4">
          基于 AI 的 RSS 阅读器，支持多平台内容聚合
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">🤖</div>
            <div className="text-xs text-gray-500">AI 摘要</div>
          </div>
          <div>
            <div className="text-2xl mb-1">🧠</div>
            <div className="text-xs text-gray-500">间隔重复</div>
          </div>
          <div>
            <div className="text-2xl mb-1">🔄</div>
            <div className="text-xs text-gray-500">多平台</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-xs text-gray-400 text-center">
          © 2024 阅川 · 专注于高效阅读
        </p>
      </div>
    </div>
  );
}
