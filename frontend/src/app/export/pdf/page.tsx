"use client";

import { useState } from "react";

export default function ExportPdfPage() {
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<"pdf" | "html" | "markdown">("pdf");
  const [options, setOptions] = useState({
    includeImages: true,
    includeSummary: true,
    includeNotes: true,
    includeMetadata: true
  });

  const handleExport = async () => {
    setExporting(true);
    // 模拟导出
    await new Promise(resolve => setTimeout(resolve, 1500));
    setExporting(false);
    alert(`${format.toUpperCase()} 导出功能需要后端支持`);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📄 导出文章</h1>
          <p className="text-gray-600 dark:text-gray-400">
            将文章导出为 PDF、HTML 或 Markdown 格式
          </p>
        </header>

        {/* Format Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📋 导出格式</h2>
          <div className="grid grid-cols-3 gap-3">
            {(["pdf", "html", "markdown"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`p-4 rounded-lg border text-center transition-colors ${
                  format === f
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="text-2xl mb-1">
                  {f === "pdf" ? "📄" : f === "html" ? "🌐" : "📝"}
                </div>
                <div className="font-medium text-sm">
                  {f === "pdf" ? "PDF" : f === "html" ? "HTML" : "Markdown"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">⚙️ 导出选项</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span>包含图片</span>
              <input
                type="checkbox"
                checked={options.includeImages}
                onChange={(e) => setOptions({ ...options, includeImages: e.target.checked })}
                className="w-5 h-5 rounded text-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>包含 AI 摘要</span>
              <input
                type="checkbox"
                checked={options.includeSummary}
                onChange={(e) => setOptions({ ...options, includeSummary: e.target.checked })}
                className="w-5 h-5 rounded text-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>包含笔记</span>
              <input
                type="checkbox"
                checked={options.includeNotes}
                onChange={(e) => setOptions({ ...options, includeNotes: e.target.checked })}
                className="w-5 h-5 rounded text-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>包含元数据（发布时间、来源等）</span>
              <input
                type="checkbox"
                checked={options.includeMetadata}
                onChange={(e) => setOptions({ ...options, includeMetadata: e.target.checked })}
                className="w-5 h-5 rounded text-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {exporting ? "导出中..." : `导出为 ${format.toUpperCase()}`}
        </button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• PDF 格式适合打印和分享</li>
            <li>• Markdown 格式适合进一步编辑</li>
            <li>• HTML 格式适合创建网页</li>
          </ul>
        </div>
      </div>
    </main>
  );
}