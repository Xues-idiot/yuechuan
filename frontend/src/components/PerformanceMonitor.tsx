"use client";

import { useState, useEffect } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  apiLatency: number;
  renderTime: number;
  memoryUsage?: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 记录页面加载时间
    const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (perfData) {
      setMetrics({
        pageLoadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        apiLatency: 0,
        renderTime: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      });
    }
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 w-8 h-8 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700"
        title="显示性能指标"
      >
        ⚡
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">⚡ 性能指标</h4>
        <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">页面加载:</span>
          <span className={metrics?.pageLoadTime && metrics.pageLoadTime < 2000 ? "text-green-600" : "text-red-600"}>
            {metrics?.pageLoadTime}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">渲染时间:</span>
          <span className={metrics?.renderTime && metrics.renderTime < 1000 ? "text-green-600" : "text-yellow-600"}>
            {metrics?.renderTime}ms
          </span>
        </div>
      </div>
    </div>
  );
}
