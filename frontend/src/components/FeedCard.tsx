"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MoreVertical, RefreshCw, Trash2, Radio } from "lucide-react";

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
  onClick?: () => void;
  isRefreshing?: boolean;
  isSelected?: boolean;
}

export default function FeedCard({ feed, onRefresh, onDelete, onClick, isRefreshing, isSelected }: FeedCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const platformColors: Record<string, string> = {
    wechat: "#07C160",
    bilibili: "#00A1D6",
    xiaohongshu: "#FF2442",
    weibo: "#E6162D",
    zhihu: "#0066FF",
  };

  const accentColor = platformColors[feed.feed_type] || "var(--color-primary)";

  return (
    <article
      className={`relative p-4 rounded-[var(--radius-md)] border transition-all duration-[var(--duration-normal)] cursor-pointer ${
        isRefreshing ? "opacity-60" : ""
      }`}
      style={{
        backgroundColor: 'var(--surface-primary)',
        borderColor: isSelected ? accentColor : isHovered ? 'var(--border-hover)' : 'var(--border-default)',
        boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Accent line indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-[var(--radius-md)]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between pl-2">
        <Link href={`/feeds/${feed.id}`} className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Radio className="w-5 h-5" style={{ color: accentColor }} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{feed.name}</h3>
              <p className="text-sm truncate" style={{ color: 'var(--text-tertiary)' }}>
                {feed.feed_type}
              </p>
            </div>
            {feed.unread_count && feed.unread_count > 0 && (
              <span
                className="px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-full)]"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                {feed.unread_count}
              </span>
            )}
          </div>
          <p className="text-sm line-clamp-1 mb-2" style={{ color: 'var(--text-secondary)' }}>
            {feed.description || feed.url}
          </p>
          {feed.category && (
            <span
              className="inline-block px-2 py-0.5 text-xs rounded-[var(--radius-sm)] font-medium"
              style={{
                backgroundColor: 'var(--surface-secondary)',
                color: 'var(--text-secondary)',
              }}
            >
              {feed.category}
            </span>
          )}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-2 rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)]"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
            aria-label="更多操作"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="w-5 h-5" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-1 w-40 py-1 rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] z-[var(--z-dropdown)] fade-in"
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh?.();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-[var(--duration-fast)]"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                刷新
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-[var(--duration-fast)]"
                style={{ color: 'var(--color-error)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                删除
              </button>
            </div>
          )}
        </div>
      </div>

      {feed.last_fetched_at && (
        <p className="text-xs mt-3 pl-2" style={{ color: 'var(--text-tertiary)' }}>
          最后更新: {new Date(feed.last_fetched_at).toLocaleDateString()}
        </p>
      )}
    </article>
  );
}
