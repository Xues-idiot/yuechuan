"use client";

import { useState, useCallback } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { api } from "@/lib/api";

interface BatchImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (imported: number) => void;
}

interface ImportResult {
  url: string;
  success: boolean;
  message?: string;
}

export default function BatchImport({ isOpen, onClose, onSuccess }: BatchImportProps) {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState<ImportResult[]>([]);
  const [importing, setImporting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleImport = async () => {
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) return;

    setImporting(true);
    setShowResults(false);

    const importResults: ImportResult[] = [];

    for (const url of urlList) {
      try {
        // 自动检测 feed 类型
        let feedType = "rss";
        if (url.includes("atom")) feedType = "atom";
        else if (url.includes("json")) feedType = "json";

        await api.createFeed({
          url,
          name: new URL(url).hostname,
          feed_type: feedType,
        });
        importResults.push({ url, success: true });
      } catch (err) {
        importResults.push({
          url,
          success: false,
          message: err instanceof Error ? err.message : "导入失败",
        });
      }
    }

    setResults(importResults);
    setShowResults(true);
    setImporting(false);

    const successCount = importResults.filter((r) => r.success).length;
    if (successCount > 0) {
      onSuccess?.(successCount);
    }
  };

  const handleClose = () => {
    setUrls("");
    setResults([]);
    setShowResults(false);
    onClose();
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="批量导入订阅源" size="lg">
      <div className="space-y-4">
        {!showResults ? (
          <>
            <p className="text-sm text-gray-500">
              每行输入一个订阅源地址，系统将自动尝试识别类型
            </p>

            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={`https://example.com/feed.xml\nhttps://blog.example.com/atom.xml\nhttps://news.example.com/feed.json`}
              className="w-full h-48 px-3 py-2 border rounded-lg resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button
                onClick={handleImport}
                loading={importing}
                disabled={!urls.trim()}
              >
                开始导入
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-green-600">✅ 成功: {successCount}</span>
              {failCount > 0 && (
                <span className="text-red-600">❌ 失败: {failCount}</span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20"
                      : "bg-red-50 border-red-200 dark:bg-red-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <code className="text-sm break-all">{result.url}</code>
                    <span>{result.success ? "✅" : "❌"}</span>
                  </div>
                  {result.message && (
                    <p className="text-xs text-red-600 mt-1">{result.message}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleClose}>完成</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
