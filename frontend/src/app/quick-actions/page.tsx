"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: string;
  shortcut: string | null;
}

export default function QuickActionsPage() {
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [result, setResult] = useState<{ action: string; message: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/quick-actions`);
      const data = await res.json();
      setActions(data);
    } catch (error) {
      console.error("Failed to load quick actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (actionId: string) => {
    setExecuting(actionId);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/quick-actions/execute/${actionId}`, {
        method: "POST"
      });
      const data = await res.json();

      if (data.success) {
        const action = actions.find(a => a.id === actionId);
        setResult({ action: action?.name || actionId, message: data.message });
      }
    } catch (error) {
      console.error("Failed to execute action:", error);
      setResult({ action: "错误", message: "操作执行失败" });
    } finally {
      setExecuting(null);
    }
  };

  const getActionHandler = (actionId: string) => {
    // Some actions navigate to specific pages
    switch (actionId) {
      case "add_feed":
        return () => window.location.href = "/feeds";
      case "search":
        return () => window.location.href = "/search";
      case "focus_mode":
        return () => window.location.href = "/focus-mode";
      case "achievements":
        return () => window.location.href = "/achievements";
      case "streak":
        return () => window.location.href = "/streak";
      case "export":
        return () => window.location.href = "/data";
      default:
        return () => executeAction(actionId);
    }
  };

  const groupedActions = {
    common: ["mark_all_read", "refresh_all", "search", "focus_mode"],
    tools: ["add_feed", "export"],
    progress: ["achievements", "streak"]
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚡ 快捷操作</h1>
          <p className="text-gray-600 dark:text-gray-400">
            快速访问常用功能
          </p>
        </header>

        {/* Result Toast */}
        {result && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="font-medium">{result.action}</span>
              <span className="text-gray-600 dark:text-gray-400">{result.message}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Common Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold">常用操作</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {actions
                  .filter(a => groupedActions.common.includes(a.id))
                  .map(action => (
                    <button
                      key={action.id}
                      onClick={getActionHandler(action.id)}
                      disabled={executing === action.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{action.name}</div>
                          {action.shortcut && (
                            <div className="text-xs text-gray-400 mt-1">
                              {action.shortcut}
                            </div>
                          )}
                        </div>
                        {executing === action.id && (
                          <span className="text-sm text-blue-500">执行中...</span>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold">工具</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {actions
                  .filter(a => groupedActions.tools.includes(a.id))
                  .map(action => (
                    <button
                      key={action.id}
                      onClick={getActionHandler(action.id)}
                      disabled={executing === action.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{action.name}</div>
                          {action.shortcut && (
                            <div className="text-xs text-gray-400 mt-1">
                              {action.shortcut}
                            </div>
                          )}
                        </div>
                        {executing === action.id && (
                          <span className="text-sm text-blue-500">执行中...</span>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold">进度与成就</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {actions
                  .filter(a => groupedActions.progress.includes(a.id))
                  .map(action => (
                    <button
                      key={action.id}
                      onClick={getActionHandler(action.id)}
                      disabled={executing === action.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{action.name}</div>
                          {action.shortcut && (
                            <div className="text-xs text-gray-400 mt-1">
                              {action.shortcut}
                            </div>
                          )}
                        </div>
                        {executing === action.id && (
                          <span className="text-sm text-blue-500">执行中...</span>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 点击快捷操作可快速执行对应功能</li>
            <li>• 部分操作会跳转到相关页面</li>
            <li>• 你可以在键盘快捷键设置中自定义快捷键</li>
          </ul>
        </div>
      </div>
    </main>
  );
}