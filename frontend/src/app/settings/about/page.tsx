"use client";

import Link from "next/link";
import { BookOpen, Code2, Database, Bot, CheckCircle2, ExternalLink, GitBranch, FileText, Heart, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsAboutPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/settings"
              className="text-sm flex items-center gap-1 mb-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeftIcon />
              返回设置
            </Link>
            <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>关于</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* App Info */}
        <section className="mb-8 p-8 rounded-xl border text-center card">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <BookOpen className="w-8 h-8" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: 'var(--text-primary)' }}>阅川</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>多平台内容聚合阅读器</p>
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            版本 0.2.0
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-8 p-6 rounded-xl border card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Code2 className="w-5 h-5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            技术栈
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "前端", desc: "Next.js 15 + React + Tailwind" },
              { title: "后端", desc: "Python + FastAPI + SQLAlchemy" },
              { title: "数据库", desc: "PostgreSQL + ChromaDB", icon: Database },
              { title: "AI", desc: "OpenAI GPT + Whisper", icon: Bot },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: 'var(--surface-secondary)', borderColor: 'var(--border-default)' }}
              >
                <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-8 p-6 rounded-xl border card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            核心功能
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              "多平台内容聚合",
              "AI 摘要与翻译",
              "知识图谱",
              "阅读目标追踪",
              "间隔复习",
              "专注模式",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="mb-8 p-6 rounded-xl border card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ExternalLink className="w-5 h-5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            链接
          </h2>
          <div className="space-y-3">
            {[
              { href: "https://github.com", icon: GitBranch, title: "GitHub", desc: "查看源代码" },
              { href: "https://github.com/issues", icon: FileText, title: "反馈问题", desc: "报告 Bug 或请求功能" },
              { href: "https://github.com", icon: BookOpen, title: "文档", desc: "使用指南" },
            ].map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--surface-primary)',
                }}
              >
                <link.icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
                <div className="flex-1">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{link.title}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{link.desc}</div>
                </div>
                <ExternalLink className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        {/* Credits */}
        <section className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--surface-secondary)', borderColor: 'var(--border-default)' }}>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Heart className="w-5 h-5" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            致谢
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            阅川基于开源项目构建，感谢所有贡献者。
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            特别鸣谢：RSSHub、FreshRSS、Miniflux
          </p>
        </section>
      </div>
    </main>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}