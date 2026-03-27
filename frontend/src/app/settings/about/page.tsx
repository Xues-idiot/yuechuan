"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsAboutPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/settings" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回设置
            </Link>
            <h1 className="text-2xl font-bold">关于</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* App Info */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold mb-2">阅川</h2>
          <p className="text-gray-500 mb-4">多平台内容聚合阅读器</p>
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
            版本 0.2.0
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🛠️ 技术栈</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium">前端</div>
              <div className="text-sm text-gray-500">Next.js 15 + React + Tailwind</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium">后端</div>
              <div className="text-sm text-gray-500">Python + FastAPI + SQLAlchemy</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium">数据库</div>
              <div className="text-sm text-gray-500">PostgreSQL + ChromaDB</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium">AI</div>
              <div className="text-sm text-gray-500">OpenAI GPT + Whisper</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">✨ 核心功能</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>多平台内容聚合</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>AI 摘要与翻译</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>知识图谱</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>阅读目标追踪</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>间隔复习</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>专注模式</span>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🔗 链接</h2>
          <div className="space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-xl">📂</span>
              <div>
                <div className="font-medium">GitHub</div>
                <div className="text-sm text-gray-500">查看源代码</div>
              </div>
            </a>
            <a
              href="https://github.com/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-xl">🐛</span>
              <div>
                <div className="font-medium">反馈问题</div>
                <div className="text-sm text-gray-500">报告 Bug 或请求功能</div>
              </div>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-xl">📖</span>
              <div>
                <div className="font-medium">文档</div>
                <div className="text-sm text-gray-500">使用指南</div>
              </div>
            </a>
          </div>
        </section>

        {/* Credits */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">🙏 致谢</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            阅川基于开源项目构建，感谢所有贡献者。
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            特别鸣谢：RSSHub、FreshRSS、Miniflux
          </p>
        </section>
      </div>
    </main>
  );
}