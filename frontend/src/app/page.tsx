"use client";

import Link from "next/link";
import {
  Rss,
  Search,
  BarChart3,
  Settings,
  History,
  Bookmark,
  Brain,
  Sparkles,
  Compass,
  Check,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import Onboarding from "@/components/Onboarding";
import RSShubStatus from "@/components/RSShubStatus";
import ReadingGoalWidget from "@/components/ReadingGoalWidget";
import ReadingStreak from "@/components/ReadingStreak";
import RecentItems from "@/components/RecentItems";

const menuItems = [
  { href: "/feeds", icon: <Rss className="w-6 h-6" />, title: "订阅源管理", description: "添加和管理你的内容订阅源" },
  { href: "/discover", icon: <Compass className="w-6 h-6" />, title: "发现内容", description: "浏览热门订阅源推荐" },
  { href: "/search", icon: <Search className="w-6 h-6" />, title: "知识搜索", description: "搜索知识库中的相关内容" },
  { href: "/stats", icon: <BarChart3 className="w-6 h-6" />, title: "阅读统计", description: "查看你的阅读数据和AI使用统计" },
  { href: "/settings", icon: <Settings className="w-6 h-6" />, title: "设置", description: "配置 API 和外观设置" },
  { href: "/history", icon: <History className="w-6 h-6" />, title: "阅读历史", description: "查看你的阅读记录" },
  { href: "/read-later", icon: <Bookmark className="w-6 h-6" />, title: "稍后阅读", description: "保存内容稍后阅读" },
  { href: "/review", icon: <Brain className="w-6 h-6" />, title: "间隔复习", description: "AI 辅助巩固记忆" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Onboarding />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* 头部 */}
        <header className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-serif" style={{ color: 'var(--text-primary)' }}>
              阅川
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              阅读如江河，内容汇聚
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <ThemeToggle />
          </div>
        </header>

        {/* 状态栏卡片 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <RSShubStatus />
          <ReadingGoalWidget />
          <ReadingStreak />
          <RecentItems />
        </div>

        {/* 功能菜单 - 3列网格 */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-200"
              style={{ borderColor: 'var(--border-default)' }}
              aria-label={`${item.title} - ${item.description}`}
            >
              <div
                className="p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <span className="text-primary" style={{ color: 'var(--color-primary)' }} aria-hidden="true">
                  {item.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h2>
                <p className="text-sm line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 新功能入口 */}
        <Link
          href="/features"
          className="block p-6 rounded-xl mb-10 transition-all duration-200 hover:shadow-lg group"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(245, 158, 11, 0.1) 100%)',
            border: '1px solid var(--border-default)'
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--color-primary)' }}>
              <Sparkles className="w-6 h-6" />
            </span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              新功能
            </h2>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              查看所有新功能
            </span>
            <svg className="w-5 h-5 ml-auto transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </Link>

        {/* 已完成功能列表 */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            已完成功能
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {[
              "多平台订阅", "AI摘要生成", "AI翻译", "知识图谱",
              "标签与笔记", "阅读统计", "间隔复习", "暗色模式",
              "视频转录", "Notion导出", "进度同步", "国际化",
              "阅读打卡", "自定义分类", "阅读成就", "智能过滤",
              "阅读提醒", "订阅健康", "每周摘要", "专注模式",
              "数据备份", "API管理", "Pocket集成", "文章高亮"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
