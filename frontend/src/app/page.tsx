"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import Onboarding from "@/components/Onboarding";
import RSShubStatus from "@/components/RSShubStatus";
import ReadingGoalWidget from "@/components/ReadingGoalWidget";
import ReadingStreak from "@/components/ReadingStreak";
import RecentItems from "@/components/RecentItems";

// Lucide Icons
function RssIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75c0-3.314-2.686-6-6-6h-1.5a4.75 4.75 0 0 1 0-9.5h1.5a6 6 0 0 1 6 6v.75m-6 0V5.25a6 6 0 1 1-12 0v13.5m6-13.5c3.314 0 6 2.686 6 6h-1.5a4.75 4.75 0 0 0-4.5 4.5v.75m0 0h1.5m-1.5 0H17m-7.5 0V18a6 6 0 1 1 12 0v-2.25m-7.5 0h7.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.322c1.1-.128 1.907-1.077 1.907-2.185h8.186ZM4.5 21h15" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

const menuItems = [
  { href: "/feeds", icon: <RssIcon />, title: "订阅源管理", description: "添加和管理你的内容订阅源" },
  { href: "/discover", icon: <DiscoverIcon />, title: "发现内容", description: "浏览热门订阅源推荐" },
  { href: "/search", icon: <SearchIcon />, title: "知识搜索", description: "搜索知识库中的相关内容" },
  { href: "/stats", icon: <StatsIcon />, title: "阅读统计", description: "查看你的阅读数据和AI使用统计" },
  { href: "/settings", icon: <SettingsIcon />, title: "设置", description: "配置 API 和外观设置" },
  { href: "/history", icon: <HistoryIcon />, title: "阅读历史", description: "查看你的阅读记录" },
  { href: "/read-later", icon: <BookmarkIcon />, title: "稍后阅读", description: "保存内容稍后阅读" },
  { href: "/review", icon: <BrainIcon />, title: "间隔复习", description: "AI 辅助巩固记忆" },
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
              <SparklesIcon />
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
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
