"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [rsshubUrl, setRsshubUrl] = useState("");
  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [saved, setSaved] = useState(false);
  const [testingNotion, setTestingNotion] = useState(false);
  const [notionStatus, setNotionStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem("openai_api_key") || "");
    setRsshubUrl(localStorage.getItem("rsshub_url") || "https://rsshub.app");
    setNotionApiKey(localStorage.getItem("notion_api_key") || "");
    setNotionDatabaseId(localStorage.getItem("notion_database_id") || "");
  }, []);

  function handleSave() {
    localStorage.setItem("openai_api_key", apiKey);
    localStorage.setItem("rsshub_url", rsshubUrl);
    localStorage.setItem("notion_api_key", notionApiKey);
    localStorage.setItem("notion_database_id", notionDatabaseId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleTestNotion() {
    if (!notionApiKey || !notionDatabaseId) {
      setNotionStatus({ success: false, message: "请填写完整的 Notion 配置" });
      return;
    }

    setTestingNotion(true);
    setNotionStatus(null);

    try {
      const result = await api.testNotionConnection(notionApiKey, notionDatabaseId);
      if (result.success) {
        setNotionStatus({ success: true, message: `连接成功！用户: ${result.user || "Unknown"}` });
      } else {
        setNotionStatus({ success: false, message: result.error || "连接失败" });
      }
    } catch (e) {
      setNotionStatus({ success: false, message: "连接失败，请检查 API Key 和数据库 ID" });
    } finally {
      setTestingNotion(false);
    }
  }

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

        {/* API 设置 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🔑 API 配置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                用于 AI 摘要和翻译功能
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RSSHub 地址</label>
              <input
                type="text"
                value={rsshubUrl}
                onChange={(e) => setRsshubUrl(e.target.value)}
                placeholder="https://rsshub.app"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                如果官方 RSSHub 访问缓慢，可以部署自己的 RSSHub 实例
              </p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {saved ? "✓ 已保存" : "保存设置"}
            </button>
          </div>
        </section>

        {/* Notion 集成 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">📓 Notion 集成</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Notion API Key</label>
              <input
                type="password"
                value={notionApiKey}
                onChange={(e) => setNotionApiKey(e.target.value)}
                placeholder="secret_..."
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                在 Notion 开发者平台创建 Integration 获取
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notion 数据库 ID</label>
              <input
                type="text"
                value={notionDatabaseId}
                onChange={(e) => setNotionDatabaseId(e.target.value)}
                placeholder="数据库 ID（URL 中的一段）"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                数据库需要包含：标题、来源、链接、发布日期等属性
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTestNotion}
                disabled={testingNotion}
                className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50"
              >
                {testingNotion ? "测试中..." : "测试连接"}
              </button>
              {notionStatus && (
                <span className={notionStatus.success ? "text-green-600" : "text-red-600"}>
                  {notionStatus.success ? "✓" : "✗"} {notionStatus.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 外观设置 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🎨 外观</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">深色模式</p>
                <p className="text-sm text-gray-500">切换浅色/深色主题</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">语言</p>
                <p className="text-sm text-gray-500">选择界面显示语言</p>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">💾 数据管理</h2>
          <div className="space-y-2">
            <Link
              href="/data"
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div>
                <p className="font-medium">导出/导入/备份</p>
                <p className="text-sm text-gray-500">管理您的数据</p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </section>

        {/* 关于 */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">ℹ️ 关于</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>阅川</strong> - 多平台内容聚合阅读器</p>
            <p>版本: 0.2.0</p>
            <p>技术栈: Next.js + FastAPI + PostgreSQL + ChromaDB</p>
            <p className="pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub →
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
