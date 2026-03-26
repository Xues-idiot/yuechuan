"use client";

import { useState } from "react";

interface SyncStatusProps {
  lastSyncedAt?: string;
  isSyncing?: boolean;
  onSync?: () => void;
}

export default function SyncStatus({
  lastSyncedAt,
  isSyncing = false,
  onSync,
}: SyncStatusProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "从未同步";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "刚刚同步";
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} 小时前`;
    return date.toLocaleString("zh-CN");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        {isSyncing ? (
          <>
            <span className="animate-spin">🔄</span>
            <span>同步中...</span>
          </>
        ) : (
          <>
            <span>✓</span>
            <span>{formatTime(lastSyncedAt)}</span>
          </>
        )}
      </button>

      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute top-full right-0 mt-2 z-20 w-64 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <h4 className="font-medium mb-2">同步状态</h4>
            <p className="text-sm text-gray-500 mb-3">
              最后同步: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "从未"}
            </p>
            {onSync && (
              <button
                onClick={() => {
                  onSync();
                  setShowDetails(false);
                }}
                disabled={isSyncing}
                className="w-full py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSyncing ? "同步中..." : "立即同步"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
