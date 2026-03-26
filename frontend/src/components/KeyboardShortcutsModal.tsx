"use client";

import { useState } from "react";
import Modal from "./Modal";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { category: "导航", items: [
    { keys: ["g", "h"], description: "返回首页" },
    { keys: ["g", "f"], description: "前往订阅源" },
    { keys: ["g", "s"], description: "前往搜索" },
    { keys: ["g", "n"], description: "前往通知" },
    { keys: ["g", "r"], description: "前往复习" },
  ]},
  { category: "阅读", items: [
    { keys: ["j"], description: "下一项" },
    { keys: ["k"], description: "上一项" },
    { keys: ["Enter", "o"], description: "打开选中项" },
    { keys: ["m"], description: "标记已读/未读" },
    { keys: ["s"], description: "收藏/取消收藏" },
    { keys: ["t"], description: "添加标签" },
  ]},
  { category: "操作", items: [
    { keys: ["r"], description: "刷新当前视图" },
    { keys: ["a"], description: "全选" },
    { keys: ["x"], description: "选择/取消选择" },
    { keys: ["?"], description: "显示快捷键" },
    { keys: ["Esc"], description: "关闭对话框/取消" },
  ]},
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [activeCategory, setActiveCategory] = useState("导航");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="键盘快捷键" size="lg">
      <div className="flex gap-6">
        {/* 分类列表 */}
        <div className="w-32 space-y-1">
          {SHORTCUTS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                activeCategory === cat.category
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* 快捷键列表 */}
        <div className="flex-1 space-y-4">
          {SHORTCUTS.filter((cat) => cat.category === activeCategory).map((cat) => (
            <div key={cat.category}>
              {cat.items.map((item) => (
                <div
                  key={item.description}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </span>
                  <div className="flex gap-1">
                    {item.keys.map((key) => (
                      <kbd
                        key={key}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t text-xs text-gray-500">
        <p>提示：按住 Shift 再按字母键可以输入大写字母</p>
      </div>
    </Modal>
  );
}
