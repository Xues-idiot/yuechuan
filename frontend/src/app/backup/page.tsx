"use client";

import { useState } from "react";

export default function BackupPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleExport = async (type: "json" | "opml") => {
    setExporting(type);
    setMessage(null);

    try {
      const endpoints: Record<string, string> = {
        json: `${API_BASE}/backup/export`,
        opml: `${API_BASE}/backup/opml`
      };

      const res = await fetch(endpoints[type]);
      const data = await res.json();

      if (data.url || data.content) {
        const content = data.url ? await fetch(data.url).then(r => r.text()) : data.content;
        const filename = `yuechuan-backup-${new Date().toISOString().split("T")[0]}.${type === "opml" ? "opml" : "json"}`;
        const blob = new Blob([content], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        setMessage({ type: "success", text: `导出成功: ${filename}` });
      }
    } catch (error) {
      console.error("Export failed:", error);
      setMessage({ type: "error", text: "导出失败，请重试" });
    } finally {
      setExporting(null);
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    setMessage(null);

    try {
      const content = await file.text();
      const isOPML = file.name.endsWith(".opml");

      const res = await fetch(`${API_BASE}/backup/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          type: isOPML ? "opml" : "json"
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: `导入成功: ${data.imported || 0} 条记录` });
      } else {
        setMessage({ type: "error", text: data.error || "导入失败" });
      }
    } catch (error) {
      console.error("Import failed:", error);
      setMessage({ type: "error", text: "导入失败，请检查文件格式" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">💾 数据管理</h1>
          <p className="text-gray-600 dark:text-gray-400">
            导出、导入和备份你的阅读数据
          </p>
        </header>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}>
            <span className={message.type === "success" ? "text-green-600" : "text-red-600"}>
              {message.text}
            </span>
          </div>
        )}

        {/* Export */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📤 导出数据</h2>
          <p className="text-sm text-gray-500 mb-4">
            将你的订阅源、标签和设置导出为备份文件
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleExport("json")}
              disabled={exporting === "json"}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-left disabled:opacity-50"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium">JSON 格式</div>
              <div className="text-xs text-gray-500">完整数据备份</div>
              {exporting === "json" && (
                <div className="text-xs text-blue-500 mt-1">导出中...</div>
              )}
            </button>
            <button
              onClick={() => handleExport("opml")}
              disabled={exporting === "opml"}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-left disabled:opacity-50"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">OPML 格式</div>
              <div className="text-xs text-gray-500">订阅源列表导出</div>
              {exporting === "opml" && (
                <div className="text-xs text-green-500 mt-1">导出中...</div>
              )}
            </button>
          </div>
        </div>

        {/* Import */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📥 导入数据</h2>
          <p className="text-sm text-gray-500 mb-4">
            从备份文件恢复你的数据，或导入 OPML 订阅源列表
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json,.opml"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              disabled={importing}
              className="hidden"
            />
            <div className={`p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors ${importing ? "opacity-50" : ""}`}>
              <div className="text-4xl mb-2">📁</div>
              <div className="font-medium">
                {importing ? "导入中..." : "点击选择文件"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                支持 JSON 和 OPML 格式
              </div>
            </div>
          </label>
        </div>

        {/* Auto Backup Info */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium mb-2">💡 关于自动备份</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 建议定期手动导出备份重要数据</li>
            <li>• OPML 格式可导入到其他 RSS 阅读器</li>
            <li>• JSON 格式包含完整数据，可用于完整恢复</li>
          </ul>
        </div>
      </div>
    </main>
  );
}