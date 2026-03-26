"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface ExportOptionsProps {
  itemId: number;
  itemTitle: string;
}

export default function ExportOptions({ itemId, itemTitle }: ExportOptionsProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  async function handleExport(format: "markdown" | "json" | "notion") {
    setExporting(format);
    setShowPanel(true);

    try {
      if (format === "markdown") {
        // Markdown 导出 - 从详情页获取内容
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/feeds/0/items/${itemId}`);
        if (!response.ok) throw new Error("获取内容失败");
        const item = await response.json();
        const content = item.content || item.content_text || "";
        const markdown = `# ${item.title}\n\n${item.author ? `作者: ${item.author}\n` : ""}${item.published_at ? `发布日期: ${new Date(item.published_at).toLocaleDateString()}\n` : ""}\n\n---\n\n${content}`;
        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
        downloadBlob(blob, `${itemTitle}.md`, "text/markdown");
      } else if (format === "json") {
        // JSON 导出 - 从详情页获取内容
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/feeds/0/items/${itemId}`);
        if (!response.ok) throw new Error("获取内容失败");
        const item = await response.json();
        const blob = new Blob([JSON.stringify(item, null, 2)], {
          type: "application/json",
        });
        downloadBlob(blob, `${itemTitle}.json`, "application/json");
      } else if (format === "notion") {
        // Notion 导出
        await api.exportToNotion(itemId);
        alert("已导出到 Notion！");
      }
    } catch (e) {
      alert(`导出失败: ${e instanceof Error ? e.message : "未知错误"}`);
    } finally {
      setExporting(null);
    }
  }

  function downloadBlob(blob: Blob, filename: string, mimeType: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        disabled={exporting !== null}
      >
        {exporting ? "导出中..." : "📤 导出"}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
          <div className="p-2">
            <button
              onClick={() => handleExport("markdown")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>📝</span>
              <span className="text-sm">Markdown</span>
            </button>
            <button
              onClick={() => handleExport("json")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>📋</span>
              <span className="text-sm">JSON</span>
            </button>
            <button
              onClick={() => handleExport("notion")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>📓</span>
              <span className="text-sm">Notion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
