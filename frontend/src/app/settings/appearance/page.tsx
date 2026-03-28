"use client";

import Link from "next/link";
import { Sun, Moon, Monitor, ChevronRight, Globe, Palette, Eye } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsAppearancePage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: "light" as const,
      label: "浅色模式",
      icon: Sun,
      description: "明亮的阅读环境",
    },
    {
      value: "dark" as const,
      label: "深色模式",
      icon: Moon,
      description: "减少眼睛疲劳",
    },
    {
      value: "auto" as const,
      label: "跟随系统",
      icon: Monitor,
      description: "自动适配设备设置",
    },
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
              外观设置
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Theme Selection */}
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
              <Palette className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              主题
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className="p-4 rounded-[var(--radius-md)] border-2 transition-all duration-[var(--duration-fast)] flex flex-col items-center gap-2"
                style={{
                  borderColor: theme === option.value ? 'var(--color-primary)' : 'var(--border-default)',
                  backgroundColor: theme === option.value ? 'var(--color-primary-light)' : 'transparent',
                }}
              >
                <option.icon
                  className="w-6 h-6"
                  style={{ color: theme === option.value ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme === option.value ? 'var(--color-primary)' : 'var(--text-primary)' }}
                >
                  {option.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
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
              <Globe className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                语言
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                选择界面显示语言
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <LanguageSelector />
          </div>
        </section>

        {/* Preview */}
        <section
          className="p-6 rounded-[var(--radius-md)] border"
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
              <Eye className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              预览
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Light Preview */}
            <div
              className="p-4 rounded-[var(--radius-md)]"
              style={{
                backgroundColor: '#FAFBFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <div className="text-xs mb-3" style={{ color: '#94A3B8' }}>浅色模式</div>
              <div
                className="rounded p-3"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
              >
                <div className="h-2 rounded mb-2" style={{ backgroundColor: '#CBD5E1' }}></div>
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: '#E2E8F0' }}></div>
              </div>
            </div>

            {/* Dark Preview */}
            <div
              className="p-4 rounded-[var(--radius-md)]"
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
              }}
            >
              <div className="text-xs mb-3" style={{ color: '#64748B' }}>深色模式</div>
              <div
                className="rounded p-3"
                style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
              >
                <div className="h-2 rounded mb-2" style={{ backgroundColor: '#475569' }}></div>
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: '#334155' }}></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}