"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface AutoRefreshProps {
  intervalMinutes?: number;
}

export default function AutoRefresh({ intervalMinutes = 30 }: AutoRefreshProps) {
  const [enabled, setEnabled] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      await api.refreshAllFeeds();
      setLastRefresh(new Date());
      // 重置下次刷新时间
      setNextRefresh(new Date(Date.now() + intervalMinutes * 60 * 1000));
    } catch (e) {
      console.error("Auto refresh failed:", e);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, intervalMinutes]);

  useEffect(() => {
    if (!enabled) return;

    // 设置下次刷新时间
    const next = new Date(Date.now() + intervalMinutes * 60 * 1000);
    setNextRefresh(next);

    // 倒计时
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((next.getTime() - Date.now()) / 1000));
      setCountdown(remaining);

      if (remaining === 0) {
        handleRefresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, intervalMinutes, handleRefresh]);

  function formatTime(date: Date) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCountdown(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4"
        />
        <span>自动刷新</span>
      </label>

      {enabled && (
        <>
          {lastRefresh && (
            <span className="text-gray-500">
              上次: {formatTime(lastRefresh)}
            </span>
          )}
          {nextRefresh && countdown > 0 && (
            <span className="text-gray-500">
              下次: {formatCountdown(countdown)}
            </span>
          )}
          {refreshing && (
            <span className="text-blue-500">刷新中...</span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-2 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            立即刷新
          </button>
        </>
      )}
    </div>
  );
}
