"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ExportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => Promise<void>;
}

export default function ExportMenu({ isOpen, onClose, onExport }: ExportMenuProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setLoading(format);
    try {
      await onExport(format);
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const formats = [
    {
      id: "opml",
      name: "OPML",
      description: "导出所有订阅源，适合导入其他阅读器",
      icon: "📋",
    },
    {
      id: "json",
      name: "JSON",
      description: "导出所有数据，包含订阅源和内容",
      icon: "📄",
    },
    {
      id: "csv",
      name: "CSV",
      description: "导出阅读记录为表格格式",
      icon: "📊",
    },
    {
      id: "markdown",
      name: "Markdown",
      description: "导出收藏内容为 Markdown 格式",
      icon: "📝",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="导出数据" size="md">
      <div className="space-y-3">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => handleExport(format.id)}
            disabled={loading !== null}
            className="w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{format.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{format.name}</div>
                <div className="text-sm text-gray-500">{format.description}</div>
              </div>
              {loading === format.id && (
                <span className="text-blue-500 animate-spin">⏳</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="w-full">
          取消
        </Button>
      </div>
    </Modal>
  );
}
