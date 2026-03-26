"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface EmptyStateProps {
  type: "feeds" | "items" | "search" | "starred" | "history" | "review";
  onAction?: () => void;
}

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const states = {
    feeds: {
      icon: "📡",
      title: "还没有订阅源",
      description: "添加你的第一个订阅源，开始阅读之旅",
      action: "添加订阅源",
      href: "/feeds",
    },
    items: {
      icon: "📭",
      title: "暂无内容",
      description: "这个订阅源还没有内容，稍后再来看看吧",
      action: null,
      href: null,
    },
    search: {
      icon: "🔍",
      title: "没有找到结果",
      description: "尝试其他关键词或调整筛选条件",
      action: null,
      href: null,
    },
    starred: {
      icon: "☆",
      title: "暂无收藏",
      description: "收藏的内容会显示在这里，方便以后查阅",
      action: "开始阅读",
      href: "/feeds",
    },
    history: {
      icon: "📜",
      title: "暂无阅读历史",
      description: "开始阅读后会在这里显示历史记录",
      action: "开始阅读",
      href: "/feeds",
    },
    review: {
      icon: "🧠",
      title: "没有待复习内容",
      description: "为重要内容添加笔记，它们会自动加入复习队列",
      action: "添加笔记",
      href: "/feeds",
    },
  };

  const state = states[type];

  if (!show) return null;

  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4 opacity-50">{state.icon}</div>
      <h2 className="text-xl font-semibold mb-2">{state.title}</h2>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{state.description}</p>
      {state.action && state.href && (
        <Link
          href={state.href}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {state.action}
        </Link>
      )}
      {state.action && !state.href && (
        <button
          onClick={() => onAction?.()}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {state.action}
        </button>
      )}
    </div>
  );
}
