"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const POPULAR_FEEDS = [
  { name: "36氪", url: "36kr", feed_type: "wechat", description: "创业投资科技媒体" },
  { name: "少数派", url: "sspai", feed_type: "wechat", description: "数字生活指南" },
  { name: "AI前线", url: "ai-front", feed_type: "wechat", description: "人工智能技术" },
  { name: "罗翔", url: "lxznew", feed_type: "wechat", description: "法律知识普及" },
  { name: "科技美学", url: "kjmx", feed_type: "wechat", description: "数码科技评测" },
  { name: "爱可可", url: "airing", feed_type: "wechat", description: "互联网观察" },
];

const PLATFORM_GUIDES = [
  {
    platform: "微信公众号",
    feed_type: "wechat",
    icon: "💬",
    howToFind: "1. 关注公众号后，点击右上角菜单\n2. 选择「设置」→ 「账户信息」\n3. 复制公众号的 RSS ID（如：gh_xxx）",
    example: "如：36氪的 RSS ID 是 36kr",
  },
  {
    platform: "哔哩哔哩",
    feed_type: "bilibili",
    icon: "📺",
    howToFind: "1. 进入 UP 主个人主页\n2. 复制主页 URL 中的用户 ID\n或搜索 B站视频的 BV 号",
    example: "如：BV1xx411c7mD",
  },
  {
    platform: "小红书",
    feed_type: "xiaohongshu",
    icon: "📕",
    howToFind: "1. 进入小红书用户主页\n2. 复制用户主页链接\n或使用小红书笔记链接",
    example: "复制笔记或用户主页 URL",
  },
  {
    platform: "微博",
    feed_type: "weibo",
    icon: "📱",
    howToFind: "1. 进入微博用户主页\n2. 复制用户主页链接\n或用户微博 ID",
    example: "如：科技少年 mrtech",
  },
  {
    platform: "知乎",
    feed_type: "zhihu",
    icon: "❓",
    howToFind: "1. 进入知乎用户主页\n2. 复制用户主页链接\n或用户 ID",
    example: "如：zhihu.com/people/xxx",
  },
];

export default function DiscoverPage() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">发现订阅源</h1>
            <p className="text-gray-500 mt-1">探索优质内容源</p>
          </div>
          <ThemeToggle />
        </header>

        {/* 热门推荐 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">热门推荐</h2>
          <div className="grid gap-3">
            {POPULAR_FEEDS.map((feed) => (
              <div
                key={feed.url}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{feed.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{feed.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    微信公众号
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 平台指南 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">各平台订阅指南</h2>
          <div className="space-y-4">
            {PLATFORM_GUIDES.map((guide) => (
              <details
                key={guide.feed_type}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center gap-2">
                  <span>{guide.icon}</span>
                  <span>{guide.platform}</span>
                  <svg
                    className="w-4 h-4 ml-auto transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p className="whitespace-pre-line">{guide.howToFind}</p>
                  <p className="text-blue-600 dark:text-blue-400">{guide.example}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* RSSHub 说明 */}
        <section className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">关于 RSSHub</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            阅川使用 RSSHub 将各平台的内容转换为 RSS 格式。如果你无法订阅某个账号，
            可能是该平台限制或 RSSHub 暂未支持。
          </p>
          <a
            href="https://docs.rsshub.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            了解更多关于 RSSHub →
          </a>
        </section>
      </div>
    </main>
  );
}
