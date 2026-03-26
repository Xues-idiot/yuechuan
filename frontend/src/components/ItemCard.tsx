"use client";

import { useState } from "react";
import Link from "next/link";

interface ItemCardProps {
  item: {
    id: number;
    feed_id: number;
    title: string;
    url?: string;
    author?: string;
    published_at?: string;
    is_read: boolean;
    is_starred: boolean;
    ai_summary?: string;
    tags?: string;
  };
  showFeedName?: boolean;
  feedName?: string;
  onToggleRead?: () => void;
  onToggleStar?: () => void;
  compact?: boolean;
  onClick?: () => void;
  showActions?: boolean;
  actions?: Array<{
    label: string;
    icon: string;
    onClick: () => void;
  }>;
}

export default function ItemCard({
  item,
  showFeedName,
  feedName,
  onToggleRead,
  onToggleStar,
  compact = false,
  onClick,
  showActions,
  actions,
}: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border transition-colors ${
        item.is_read
          ? "border-gray-200 dark:border-gray-700 opacity-75"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-500"
      } ${compact ? "p-2" : "p-4"}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* 状态指示器 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead?.();
          }}
          className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
            item.is_read
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          {item.is_read && <span className="text-white text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <Link href={`/feeds/${item.feed_id}/items/${item.id}`}>
            <h3
              className={`font-semibold line-clamp-2 ${
                item.is_read ? "text-gray-500" : ""
              } ${compact ? "text-sm" : ""}`}
            >
              {item.title}
            </h3>
          </Link>

          <div className={`flex items-center gap-2 text-xs text-gray-500 ${compact ? "mt-0" : "mt-1"}`}>
            {showFeedName && feedName && <span>{feedName}</span>}
            {item.author && <span>{item.author}</span>}
            {item.published_at && (
              <span>{new Date(item.published_at).toLocaleDateString()}</span>
            )}
          </div>

          {/* AI 摘要预览 - compact 模式下不显示 */}
          {item.ai_summary && !expanded && !compact && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.ai_summary}
            </p>
          )}

          {/* 标签 - compact 模式下不显示 */}
          {item.tags && !compact && (
            <div className="flex gap-1 mt-2">
              {item.tags.split(",").slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 操作按钮 - compact 模式下隐藏展开按钮 */}
        <div className="flex items-center gap-1">
          {showActions && actions?.map((action, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
              title={action.label}
            >
              {action.icon}
            </button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            className={`p-2 ${item.is_starred ? "text-yellow-500" : "text-gray-400"}`}
          >
            {item.is_starred ? "★" : "☆"}
          </button>
          {!compact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {expanded ? "▲" : "▼"}
            </button>
          )}
        </div>
      </div>

      {/* 展开内容 - compact 模式下不显示 */}
      {expanded && item.ai_summary && !compact && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {item.ai_summary}
          </p>
        </div>
      )}
    </div>
  );
}
