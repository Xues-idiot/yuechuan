"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  configured?: boolean;
}

export default function SettingsIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "notion",
      name: "Notion",
      icon: "📓",
      description: "导出阅读笔记到 Notion",
      connected: false,
      configured: false
    },
    {
      id: "pocket",
      name: "Pocket",
      icon: "📦",
      description: "同步阅读列表到 Pocket",
      connected: false,
      configured: false
    },
    {
      id: "instapaper",
      name: "Instapaper",
      icon: "📑",
      description: "同步阅读列表到 Instapaper",
      connected: false,
      configured: false
    },
    {
      id: "readwise",
      name: "Readwise",
      icon: "📚",
      description: "同步高亮笔记到 Readwise",
      connected: false,
      configured: false
    },
    {
      id: "notion",
      name: "Notion",
      icon: "📓",
      description: "导出阅读笔记到 Notion",
      connected: false,
      configured: false
    }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(i =>
      i.id === id ? { ...i, connected: !i.connected } : i
    ));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/settings" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回设置
            </Link>
            <h1 className="text-2xl font-bold">第三方集成</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Notion */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📓</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Notion</h2>
                  <p className="text-sm text-gray-500">导出阅读笔记到 Notion 数据库</p>
                </div>
                <button
                  onClick={() => toggleIntegration("notion")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    integrations.find(i => i.id === "notion")?.connected
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {integrations.find(i => i.id === "notion")?.connected ? "已连接" : "未连接"}
                </button>
              </div>

              {integrations.find(i => i.id === "notion")?.connected && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-green-700 dark:text-green-300">
                    ✓ 已配置并连接
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pocket */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📦</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Pocket</h2>
                  <p className="text-sm text-gray-500">同步阅读列表到 Pocket</p>
                </div>
                <Link
                  href="/integrations/pocket"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  配置
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Instapaper */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📑</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Instapaper</h2>
                  <p className="text-sm text-gray-500">同步阅读列表到 Instapaper</p>
                </div>
                <button
                  onClick={() => toggleIntegration("instapaper")}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  连接
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Readwise */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📚</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Readwise</h2>
                  <p className="text-sm text-gray-500">同步高亮笔记到 Readwise</p>
                </div>
                <button
                  onClick={() => toggleIntegration("readwise")}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  连接
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 关于第三方集成</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 连接第三方服务可以同步你的阅读数据</li>
            <li>• Pocket 和 Instapaper 使用相同的 API</li>
            <li>• Readwise 专门用于同步高亮笔记</li>
          </ul>
        </section>
      </div>
    </main>
  );
}