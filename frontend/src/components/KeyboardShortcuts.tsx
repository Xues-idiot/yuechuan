"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // 全局
  { key: "g h", description: "跳转到首页", category: "导航" },
  { key: "g f", description: "跳转到订阅源", category: "导航" },
  { key: "g s", description: "跳转到搜索", category: "导航" },
  { key: "g s", description: "跳转到统计", category: "导航" },
  { key: "?", description: "显示快捷键帮助", category: "全局" },

  // 阅读页
  { key: "s", description: "生成摘要", category: "阅读" },
  { key: "t", description: "翻译内容", category: "阅读" },
  { key: "k", description: "收藏/取消收藏", category: "阅读" },
  { key: "n", description: "打开笔记", category: "阅读" },
  { key: "v", description: "打开转录", category: "阅读" },
  { key: "r", description: "查看相关推荐", category: "阅读" },
  { key: "Space", description: "显示答案/滚动", category: "阅读" },
  { key: "Esc", description: "关闭面板", category: "全局" },

  // 复习
  { key: "0-6", description: "评分 (0=忘记, 5=完美)", category: "复习" },
];

export default function KeyboardShortcutsPage() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "?" && !e.target) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = [...new Set(SHORTCUTS.map((s) => s.category))];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/settings"
              className="text-sm text-gray-500 hover:text-blue-500 mb-2 block"
            >
              ← 返回设置
            </Link>
            <h1 className="text-2xl font-bold">⌨️ 键盘快捷键</h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          {categories.map((cat) => (
            <div
              key={cat}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border"
            >
              <h2 className="text-lg font-semibold mb-4">{cat}</h2>
              <div className="space-y-2">
                {SHORTCUTS.filter((s) => s.category === cat).map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 提示：在输入框或文本域中，快捷键会被禁用以避免冲突。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
