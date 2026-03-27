"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const SHORTCUT_GROUPS = [
  {
    title: "导航",
    shortcuts: [
      { keys: ["g", "h"], description: "返回首页" },
      { keys: ["g", "f"], description: "转到订阅源" },
      { keys: ["g", "s"], description: "转到收藏" },
      { keys: ["g", "r"], description: "转到阅读历史" },
      { keys: ["g", "t"], description: "转到标签" },
      { keys: ["?"], description: "显示快捷键帮助" },
    ]
  },
  {
    title: "文章操作",
    shortcuts: [
      { keys: ["j"], description: "下一篇文章" },
      { keys: ["k"], description: "上一篇文章" },
      { keys: ["Enter"], description: "打开文章" },
      { keys: ["o"], description: "在新标签页打开" },
      { keys: ["m"], description: "标记已读/未读" },
      { keys: ["s"], description: "收藏/取消收藏" },
      { keys: ["n"], description: "添加笔记" },
      { keys: ["T"], description: "添加到稍后阅读" },
    ]
  },
  {
    title: "AI 功能",
    shortcuts: [
      { keys: ["a"], description: "生成 AI 摘要" },
      { keys: ["t"], description: "翻译文章" },
      { keys: ["K"], description: "收藏到知识库" },
      { keys: ["r"], description: "AI 推荐相关内容" },
    ]
  },
  {
    title: "订阅源操作",
    shortcuts: [
      { keys: ["R"], description: "刷新当前订阅源" },
      { keys: ["M"], description: "标记当前订阅源全部已读" },
      { keys: ["+"], description: "添加订阅源" },
      { keys: ["-"], description: "删除订阅源" },
    ]
  },
  {
    title: "搜索",
    shortcuts: [
      { keys: ["/"], description: "打开搜索" },
      { keys: ["Ctrl", "Enter"], description: "执行搜索" },
      { keys: ["Esc"], description: "关闭搜索/返回" },
    ]
  },
  {
    title: "视图切换",
    shortcuts: [
      { keys: ["v"], description: "切换视图模式" },
      { keys: ["f"], description: "专注模式" },
      { keys: ["z"], description: "切换暗色模式" },
      { keys: ["1-9"], description: "跳转至第 N 个订阅源" },
    ]
  }
];

export default function KeyboardShortcutsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/keyboard" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">⌨️ 键盘快捷键</h1>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHORTCUT_GROUPS.map((group) => (
            <div
              key={group.title}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold">{group.title}</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx}>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-mono">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 mx-0.5">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <section className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 按 <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> 可以随时打开快捷键帮助面板</li>
            <li>• 组合键如 <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">g</kbd> + <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">h</kbd> 表示先按 <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">g</kbd> 再按 <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">h</kbd></li>
            <li>• 你可以在设置中自定义部分快捷键</li>
          </ul>
        </section>
      </div>
    </main>
  );
}