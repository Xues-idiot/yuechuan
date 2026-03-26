"use client";

import { useState } from "react";
import Link from "next/link";

interface FeedCardProps {
  feed: {
    id: number;
    name: string;
    url: string;
    feed_type: string;
    description?: string;
    avatar_url?: string;
    category?: string;
    last_fetched_at?: string;
    unread_count?: number;
  };
  onRefresh?: () => void;
  onDelete?: () => void;
}

export default function FeedCard({ feed, onRefresh, onDelete }: FeedCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const platformIcons: Record<string, string> = {
    wechat: "💬",
    bilibili: "📺",
    xiaohongshu: "📕",
    weibo: "📢",
    zhihu: "💬",
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between">
        <Link href={`/feeds/${feed.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{platformIcons[feed.feed_type] || "📁"}</span>
            <h3 className="font-semibold truncate">{feed.name}</h3>
            {feed.unread_count && feed.unread_count > 0 && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {feed.unread_count}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">
            {feed.description || feed.url}
          </p>
          {feed.category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-600 rounded">
              {feed.category}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onRefresh?.();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                刷新
              </button>
              <button
                onClick={() => {
                  onDelete?.();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                删除
              </button>
            </div>
          )}
        </div>
      </div>

      {feed.last_fetched_at && (
        <p className="text-xs text-gray-400 mt-2">
          最后更新: {new Date(feed.last_fetched_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
