"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsApiPage() {
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
      const response = await fetch("http://localhost:8000/notion/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: notionApiKey,
          database_id: notionDatabaseId
        })
      });
      const result = await response.json();
      if (result.success) {
        setNotionStatus({ success: true, message: "连接成功！" });
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
            <Link href="/settings" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回设置
            </Link>
            <h1 className="text-2xl font-bold">API 配置</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* API Keys */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🔑 API 密钥</h2>
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

        {/* Notion Integration */}
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

        {/* Quick Links */}
        <section className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-medium mb-2">相关链接</h3>
          <div className="space-y-1 text-sm">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              OpenAI API Keys →
            </a>
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              Notion Integrations →
            </a>
            <a
              href="https://docs.rsshub.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              RSSHub 文档 →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}