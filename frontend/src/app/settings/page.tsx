"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function SettingsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">设置</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </header>

        {/* Settings Sections */}
        <div className="space-y-4">
          <Link
            href="/settings/api"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔑</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">API 配置</h2>
                <p className="text-sm text-gray-500">管理 OpenAI、RSSHub、Notion 等 API 设置</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          <Link
            href="/settings/appearance"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🎨</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">外观</h2>
                <p className="text-sm text-gray-500">主题、语言等显示设置</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          <Link
            href="/data"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">💾</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">数据管理</h2>
                <p className="text-sm text-gray-500">导出、导入和备份数据</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>

          <Link
            href="/settings/about"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">ℹ️</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">关于</h2>
                <p className="text-sm text-gray-500">版本信息和技术栈</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
        </div>

        {/* Keyboard Shortcut */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            按 <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> 查看键盘快捷键
          </p>
        </div>
      </div>
    </main>
  );
}