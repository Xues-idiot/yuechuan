"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Radio, Mail, Search, Star, BookOpen, Brain } from "lucide-react";

interface EmptyStateProps {
  type: "feeds" | "items" | "search" | "starred" | "history" | "review";
  onAction?: () => void;
  customTitle?: string;
  customDescription?: string;
  customAction?: string;
  customHref?: string;
  className?: string;
}

export default function EmptyState({
  type,
  onAction,
  customTitle,
  customDescription,
  customAction,
  customHref,
  className = "",
}: EmptyStateProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const states = {
    feeds: {
      icon: Radio,
      title: "还没有订阅源",
      description: "添加你的第一个订阅源，开始阅读之旅",
      action: "添加订阅源",
      href: "/feeds",
    },
    items: {
      icon: Mail,
      title: "暂无内容",
      description: "这个订阅源还没有内容，稍后再来看看吧",
      action: null,
      href: null,
    },
    search: {
      icon: Search,
      title: "没有找到结果",
      description: "尝试其他关键词或调整筛选条件",
      action: null,
      href: null,
    },
    starred: {
      icon: Star,
      title: "暂无收藏",
      description: "收藏的内容会显示在这里，方便以后查阅",
      action: "开始阅读",
      href: "/feeds",
    },
    history: {
      icon: BookOpen,
      title: "暂无阅读历史",
      description: "开始阅读后会在这里显示历史记录",
      action: "开始阅读",
      href: "/feeds",
    },
    review: {
      icon: Brain,
      title: "没有待复习内容",
      description: "为重要内容添加笔记，它们会自动加入复习队列",
      action: "添加笔记",
      href: "/feeds",
    },
  };

  const state = states[type];
  const IconComponent = state.icon;

  const title = customTitle || state.title;
  const description = customDescription || state.description;
  const action = customAction !== undefined ? customAction : state.action;
  const href = customHref !== undefined ? customHref : state.href;

  if (!show) return null;

  return (
    <div
      className={`text-center py-16 px-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{ backgroundColor: 'var(--surface-secondary)' }}
      >
        <IconComponent className="w-10 h-10" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <p className="mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      {action && href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {action}
        </Link>
      )}
      {action && !href && (
        <button
          onClick={() => onAction?.()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
