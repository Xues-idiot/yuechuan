"use client";

import Link from "next/link";
import { User, Bell, Key, Palette, Link2, Database, Info, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: "个人资料",
      description: "头像、姓名和联系信息",
      href: "/settings/profile",
      icon: User,
    },
    {
      title: "通知设置",
      description: "推送通知和提醒偏好",
      href: "/settings/notifications",
      icon: Bell,
    },
    {
      title: "API 配置",
      description: "管理 OpenAI、RSSHub、Notion 等 API 设置",
      href: "/settings/api",
      icon: Key,
    },
    {
      title: "外观",
      description: "主题、语言等显示设置",
      href: "/settings/appearance",
      icon: Palette,
    },
    {
      title: "第三方集成",
      description: "Notion、Pocket、Instapaper 等",
      href: "/settings/integrations",
      icon: Link2,
    },
    {
      title: "数据管理",
      description: "导出、导入和备份数据",
      href: "/data",
      icon: Database,
    },
    {
      title: "关于",
      description: "版本信息和技术栈",
      href: "/settings/about",
      icon: Info,
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm mb-3 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回
            </Link>
            <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
              设置
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </header>

        {/* Settings Sections */}
        <div className="space-y-3">
          {settingsGroups.map((group) => (
            <Link
              key={group.href}
              href={group.href}
              className="group block p-5 rounded-[var(--radius-md)] border transition-all duration-[var(--duration-fast)]"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--shadow-card)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}
                >
                  <group.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {group.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {group.description}
                  </p>
                </div>
                <ChevronRight
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div
          className="mt-8 p-4 rounded-[var(--radius-md)] text-center"
          style={{ backgroundColor: 'var(--surface-secondary)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            按{' '}
            <kbd
              className="px-2 py-1 rounded text-xs font-mono"
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)'
              }}
            >
              ?
            </kbd>{' '}
            查看键盘快捷键
          </p>
        </div>
      </div>
    </main>
  );
}