"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { FileText, Database, Table, FileCode, Download, Loader2 } from "lucide-react";

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
      icon: FileText,
      color: "var(--color-info)",
    },
    {
      id: "json",
      name: "JSON",
      description: "导出所有数据，包含订阅源和内容",
      icon: Database,
      color: "var(--color-success)",
    },
    {
      id: "csv",
      name: "CSV",
      description: "导出阅读记录为表格格式",
      icon: Table,
      color: "var(--color-warning)",
    },
    {
      id: "markdown",
      name: "Markdown",
      description: "导出收藏内容为 Markdown 格式",
      icon: FileCode,
      color: "var(--color-primary)",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="导出数据" size="md">
      <div className="space-y-3">
        {formats.map((format) => {
          const Icon = format.icon;
          const isLoading = loading === format.id;

          return (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              disabled={loading !== null}
              className="w-full p-4 text-left rounded-[var(--radius-md)] border transition-all hover:shadow-[var(--shadow-card-hover)]"
              style={{
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${format.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: format.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {format.name}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {format.description}
                  </div>
                </div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <Download className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-default)' }}>
        <Button variant="outline" onClick={onClose} className="w-full">
          取消
        </Button>
      </div>
    </Modal>
  );
}
