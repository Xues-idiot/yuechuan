"use client";

import { useState, useEffect } from "react";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  shortcut: string;
  action: () => void;
}

export default function QuickActions() {
  const [showPanel, setShowPanel] = useState(false);

  const actions: QuickAction[] = [
    {
      id: "feeds",
      title: "刷新订阅源",
      icon: "🔄",
      shortcut: "r",
      action: () => {
        // 触发全局刷新
        window.dispatchEvent(new CustomEvent("globalRefresh"));
      },
    },
    {
      id: "search",
      title: "快速搜索",
      icon: "🔍",
      shortcut: "/",
      action: () => {
        window.location.href = "/search";
      },
    },
    {
      id: "add",
      title: "添加订阅源",
      icon: "➕",
      shortcut: "a",
      action: () => {
        window.location.href = "/feeds";
      },
    },
    {
      id: "review",
      title: "开始复习",
      icon: "🧠",
      shortcut: "m",
      action: () => {
        window.location.href = "/review";
      },
    },
  ];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 忽略输入框中的按键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "q") {
        setShowPanel((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 快捷键提示 */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 left-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-xl"
        title="快捷命令 (Q)"
      >
        ⚡
      </button>

      {/* 快捷面板 */}
      {showPanel && (
        <div className="fixed bottom-20 left-4 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 z-50">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm font-medium">快捷命令</span>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.action();
                setShowPanel(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="flex-1 text-sm">{action.title}</span>
              <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                {action.shortcut}
              </kbd>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
