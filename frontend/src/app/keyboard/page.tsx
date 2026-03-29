"use client";

import { useState, useEffect } from "react";

interface Shortcut {
  key: string;
  modifiers: string[];
  action: string;
  description: string;
}

const PRESET_SHORTCUTS: Shortcut[] = [
  { key: "j", modifiers: [], action: "next_item", description: "下一项" },
  { key: "k", modifiers: [], action: "prev_item", description: "上一项" },
  { key: "o", modifiers: [], action: "open_item", description: "打开文章" },
  { key: "m", modifiers: [], action: "mark_read", description: "标记已读/未读" },
  { key: "s", modifiers: [], action: "star_item", description: "收藏/取消收藏" },
  { key: "r", modifiers: [], action: "refresh", description: "刷新" },
  { key: "/", modifiers: [], action: "search", description: "搜索" },
  { key: "f", modifiers: [], action: "focus_mode", description: "专注模式" },
  { key: "?", modifiers: [], action: "show_help", description: "显示帮助" },
  { key: "t", modifiers: ["ctrl"], action: "new_tab", description: "新标签页" },
  { key: "w", modifiers: ["ctrl"], action: "close_tab", description: "关闭标签页" },
  { key: "n", modifiers: ["ctrl"], action: "next_tab", description: "下一个标签" },
];

export default function KeyboardShortcutsPage() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(PRESET_SHORTCUTS);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<{ key: string; modifiers: string[] } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadShortcuts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadShortcuts = async () => {
    try {
      const res = await fetch(`${API_BASE}/keyboard-shortcuts`);
      const data = await res.json();
      if (data && data.length > 0) {
        setShortcuts(data);
      }
    } catch (error) {
      // 使用默认快捷键
    }
  };

  const handleRecord = (action: string) => {
    setRecording(action);
    setNewKey(null);

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const modifiers: string[] = [];
      if (e.ctrlKey) modifiers.push("ctrl");
      if (e.shiftKey) modifiers.push("shift");
      if (e.altKey) modifiers.push("alt");
      if (e.metaKey) modifiers.push("meta");

      const key = e.key.toLowerCase();

      // 忽略纯修饰键
      if (["control", "shift", "alt", "meta"].includes(key)) {
        return;
      }

      setNewKey({ key, modifiers });
      setRecording(null);

      // 移除监听
      document.removeEventListener("keydown", handleKeyDown);
    };

    document.addEventListener("keydown", handleKeyDown);
  };

  const handleSave = async (action: string) => {
    if (!newKey) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/keyboard-shortcuts/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newKey.key,
          modifiers: newKey.modifiers,
          action,
          description: shortcuts.find((s) => s.action === action)?.description || ""
        })
      });

      // 更新本地状态
      setShortcuts(
        shortcuts.map((s) =>
          s.action === action ? { ...s, key: newKey.key, modifiers: newKey.modifiers } : s
        )
      );
      setNewKey(null);
    } catch (error) {
      console.error("Failed to save shortcut:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/keyboard-shortcuts/reset`, { method: "POST" });
      setShortcuts(PRESET_SHORTCUTS);
    } catch (error) {
      console.error("Failed to reset shortcuts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatShortcut = (shortcut: Shortcut) => {
    const parts = [...shortcut.modifiers, shortcut.key.toUpperCase()];
    return parts.join(" + ");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">⌨️ 键盘快捷键</h1>
              <p className="text-gray-600 dark:text-gray-400">
                自定义你的阅读操作快捷键
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              重置为默认
            </button>
          </div>
        </header>

        {/* 快捷键列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">操作快捷键</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.action} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500">{shortcut.description}</div>
                </div>

                <div className="flex items-center gap-2">
                  {recording === shortcut.action ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-500">按下快捷键...</span>
                      <button
                        onClick={() => setRecording(null)}
                        className="px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        取消
                      </button>
                    </div>
                  ) : newKey && newKey.key === shortcut.key && newKey.modifiers.join(",") === shortcut.modifiers.join(",") ? (
                    <div className="flex items-center gap-2">
                      <kbd className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-mono">
                        {formatShortcut(shortcut)}
                      </kbd>
                      <button
                        onClick={() => handleSave(shortcut.action)}
                        disabled={loading}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setNewKey(null)}
                        className="px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                        {formatShortcut(shortcut)}
                      </kbd>
                      <button
                        onClick={() => handleRecord(shortcut.action)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        修改
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 点击「修改」后按下你想要的快捷键组合即可</li>
            <li>• 可以组合使用 Ctrl、Shift、Alt 等修饰键</li>
            <li>• 部分快捷键可能与浏览器或系统冲突</li>
          </ul>
        </div>

        {/* 修饰键说明 */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold text-sm mb-3">修饰键说明</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono">Ctrl</kbd>
              <span className="ml-2 text-gray-500">Control 键</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono">Shift</kbd>
              <span className="ml-2 text-gray-500">Shift 键</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono">Alt</kbd>
              <span className="ml-2 text-gray-500">Alt/Option 键</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono">Meta</kbd>
              <span className="ml-2 text-gray-500">Command/Cmd 键</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
