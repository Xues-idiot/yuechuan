"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Link2, CheckCircle2, ExternalLink, Lightbulb } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  configured: boolean;
  icon: React.ReactNode;
}

const NotionIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z"/>
  </svg>
);

const PocketIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M21.927 0H2.072C.928 0 0 .928 0 2.072v19.856C0 23.072.928 24 2.072 24h19.856C23.072 24 24 23.072 24 21.928V2.072C24 .928 23.072 0 21.927 0zm-7.19 15.287c-1.632 0-2.962-1.287-2.962-2.873 0-1.586 1.33-2.873 2.962-2.873 1.586 0 2.908 1.287 2.908 2.873 0 1.586-1.322 2.873-2.908 2.873zm-6.94 5.39V6.18l5.35 6.22c-.94 1.132-1.55 2.555-1.55 4.144 0 1.677.747 3.142 1.863 4.143L12 18.96l-5.203-3.01v2.726z"/>
  </svg>
);

const InstapaperIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M21.945 2.27L12.014 12.2l2.821 2.82-8.486 8.485c-.78.78-2.047.78-2.828 0l-.707-.707 9.9-9.9-7.778-7.778 6.5-6.5.707.707c.78.78.78 2.047 0 2.828L3.1 19.172c-.39.39-.39 1.024 0 1.414l.707.707c.39.39 1.024.39 1.414 0l9.9-9.9-2.821-2.82 9.9-9.9c.78-.78.78-2.047 0-2.828l-.707-.707c-.78-.78-2.047-.78-2.828 0L10.8 15.31l-6.5-6.5c-.78-.78-.78-2.047 0-2.828l.707-.707c.78-.78 2.047-.78 2.828 0l9.9 9.9z"/>
  </svg>
);

const ReadwiseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export default function SettingsIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "notion",
      name: "Notion",
      description: "导出阅读笔记到 Notion 数据库",
      connected: true,
      configured: true,
      icon: <NotionIcon />,
    },
    {
      id: "pocket",
      name: "Pocket",
      description: "同步阅读列表到 Pocket",
      connected: false,
      configured: false,
      icon: <PocketIcon />,
    },
    {
      id: "instapaper",
      name: "Instapaper",
      description: "同步阅读列表到 Instapaper",
      connected: false,
      configured: false,
      icon: <InstapaperIcon />,
    },
    {
      id: "readwise",
      name: "Readwise",
      description: "同步高亮笔记到 Readwise",
      connected: false,
      configured: false,
      icon: <ReadwiseIcon />,
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(i =>
      i.id === id ? { ...i, connected: !i.connected } : i
    ));
  };

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
              第三方集成
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Integration List */}
        <div className="space-y-4">
          {integrations.map((integration) => (
            <section
              key={integration.id}
              className="p-5 rounded-[var(--radius-md)] border transition-all duration-[var(--duration-fast)]"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: integration.connected ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                    color: integration.connected ? 'var(--color-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {integration.name}
                      </h2>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {integration.description}
                      </p>
                    </div>
                    {integration.id === 'notion' ? (
                      <Button
                        variant={integration.connected ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => toggleIntegration(integration.id)}
                        icon={integration.connected ? <CheckCircle2 className="w-4 h-4" /> : undefined}
                      >
                        {integration.connected ? "已连接" : "连接"}
                      </Button>
                    ) : (
                      <Link href={`/integrations/${integration.id}`}>
                        <Button variant="outline" size="sm">
                          配置
                        </Button>
                      </Link>
                    )}
                  </div>

                  {integration.connected && integration.configured && (
                    <div
                      className="mt-3 p-3 rounded-[var(--radius-sm)]"
                      style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    >
                      <span
                        className="inline-flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-success)' }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        已配置并连接
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Info Section */}
        <section
          className="mt-6 p-5 rounded-[var(--radius-md)]"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-info)' }} />
            <div>
              <h3 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                关于第三方集成
              </h3>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <li>连接第三方服务可以同步你的阅读数据</li>
                <li>Pocket 和 Instapaper 使用相同的 API</li>
                <li>Readwise 专门用于同步高亮笔记</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}