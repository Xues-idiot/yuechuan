"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface NotionExportButtonProps {
  itemId: number;
  itemTitle: string;
}

export default function NotionExportButton({ itemId, itemTitle }: NotionExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleExportToNotion() {
    setIsExporting(true);
    setShowError(false);
    try {
      const result = await api.exportToNotion(itemId);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (e) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-purple-300 text-purple-600 text-sm rounded-lg hover:bg-purple-50 disabled:opacity-50"
      >
        📓 {isExporting ? "导出中..." : "Notion"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border z-20">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">导出到 Notion</p>
            <p className="text-sm font-medium truncate">{itemTitle}</p>
          </div>
          <button
            onClick={handleExportToNotion}
            disabled={isExporting}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {isExporting ? "导出中..." : "导出当前内容"}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            取消
          </button>
        </div>
      )}

      {showSuccess && (
        <div className="fixed bottom-4 right-4 px-4 py-3 bg-green-100 border border-green-300 rounded-lg shadow-lg z-50">
          <span className="text-green-700">✓ 已成功导出到 Notion</span>
        </div>
      )}

      {showError && (
        <div className="fixed bottom-4 right-4 px-4 py-3 bg-red-100 border border-red-300 rounded-lg shadow-lg z-50">
          <span className="text-red-700">✗ 导出失败，请检查 Notion 配置</span>
        </div>
      )}
    </div>
  );
}