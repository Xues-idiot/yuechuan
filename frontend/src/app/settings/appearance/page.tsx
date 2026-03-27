"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function SettingsAppearancePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/settings" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回设置
            </Link>
            <h1 className="text-2xl font-bold">外观设置</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Theme */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🎨 主题</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">深色模式</p>
                <p className="text-sm text-gray-500">切换浅色/深色主题</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🌐 语言</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">界面语言</p>
                <p className="text-sm text-gray-500">选择界面显示语言</p>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">👁️ 预览</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">浅色模式</div>
              <div className="bg-white border border-gray-300 rounded p-2">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">深色模式</div>
              <div className="bg-gray-800 border border-gray-600 rounded p-2">
                <div className="h-2 bg-gray-600 rounded mb-1"></div>
                <div className="h-2 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}