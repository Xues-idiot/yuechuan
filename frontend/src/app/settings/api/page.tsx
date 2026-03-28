"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Key, ExternalLink, ChevronRight, CheckCircle2, XCircle, Loader2, Info } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";

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

  const quickLinks = [
    { label: "OpenAI API Keys", href: "https://platform.openai.com/api-keys" },
    { label: "Notion Integrations", href: "https://www.notion.so/my-integrations" },
    { label: "RSSHub 文档", href: "https://docs.rsshub.app" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 text-sm mb-3 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回设置
            </Link>
            <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
              API 配置
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* API Keys Section */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-md)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <Key className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              API 密钥
            </h2>
          </div>

          <div className="space-y-5">
            {/* OpenAI API Key */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="input"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                用于 AI 摘要和翻译功能
              </p>
            </div>

            {/* RSSHub URL */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                RSSHub 地址
              </label>
              <input
                type="text"
                value={rsshubUrl}
                onChange={(e) => setRsshubUrl(e.target.value)}
                placeholder="https://rsshub.app"
                className="input"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                如果官方 RSSHub 访问缓慢，可以部署自己的 RSSHub 实例
              </p>
            </div>

            <Button onClick={handleSave} variant="primary">
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  已保存
                </>
              ) : (
                "保存设置"
              )}
            </Button>
          </div>
        </section>

        {/* Notion Integration Section */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-md)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <span className="text-lg font-serif font-bold" style={{ color: 'var(--color-primary)' }}>N</span>
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notion 集成
            </h2>
          </div>

          <div className="space-y-5">
            {/* Notion API Key */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Notion API Key
              </label>
              <input
                type="password"
                value={notionApiKey}
                onChange={(e) => setNotionApiKey(e.target.value)}
                placeholder="secret_..."
                className="input"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                在 Notion 开发者平台创建 Integration 获取
              </p>
            </div>

            {/* Notion Database ID */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Notion 数据库 ID
              </label>
              <input
                type="text"
                value={notionDatabaseId}
                onChange={(e) => setNotionDatabaseId(e.target.value)}
                placeholder="数据库 ID（URL 中的一段）"
                className="input"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                数据库需要包含：标题、来源、链接、发布日期等属性
              </p>
            </div>

            {/* Test Connection */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleTestNotion}
                variant="outline"
                disabled={testingNotion}
                icon={testingNotion ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              >
                {testingNotion ? "测试中..." : "测试连接"}
              </Button>
              {notionStatus && (
                <span
                  className="inline-flex items-center gap-1 text-sm"
                  style={{ color: notionStatus.success ? 'var(--color-success)' : 'var(--color-error)' }}
                >
                  {notionStatus.success ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {notionStatus.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section
          className="p-5 rounded-[var(--radius-md)]"
          style={{ backgroundColor: 'var(--surface-secondary)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
            <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
              相关链接
            </h3>
          </div>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}