"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { api, FeedItem } from "@/lib/api";

// Icons
function BookIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0 6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

export default function RecentItems() {
  const [items, setItems] = useState<Array<{ id: number; feed_id: number; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = useCallback(async () => {
    setLoading(true);
    try {
      const feeds = await api.listFeeds();
      const recent: Array<{ id: number; feed_id: number; title: string; published_at?: string }> = [];

      for (const feed of feeds.slice(0, 3)) {
        try {
          const feedItems = await api.listFeedItems(feed.id, 5, 0);
          recent.push(
            ...feedItems
              .filter((i) => !i.is_read)
              .slice(0, 2)
              .map((i) => ({ id: i.id, feed_id: feed.id, title: i.title, published_at: i.published_at }))
          );
        } catch {
          // ignore error
        }
      }

      recent.sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });

      setItems(recent.slice(0, 5));
    } catch (e) {
      console.error("Failed to load recent:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const memoizedItems = useMemo(() => items, [items]);

  if (loading) {
    return (
      <div
        className="card-elevated p-5 h-[180px]"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="skeleton h-full rounded" />
      </div>
    );
  }

  return (
    <div
      className="card-elevated p-5 transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--color-primary)' }}>
            <BookIcon />
          </span>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            待阅读
          </h3>
        </div>
        <Link
          href="/history"
          className="flex items-center gap-1 text-sm transition-colors hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          <span>查看全部</span>
          <ArrowRightIcon />
        </Link>
      </div>

      {memoizedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 text-center">
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            暂无待阅读内容
          </p>
          <Link
            href="/discover"
            className="text-sm mt-2 transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            发现新内容
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {memoizedItems.map((item, index) => (
            <Link
              key={`${item.feed_id}-${item.id}`}
              href={`/feeds/${item.feed_id}/items/${item.id}`}
              className="flex items-center gap-2 group transition-all"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                animation: `fadeSlideIn 0.3s ease forwards`,
                animationDelay: `${index * 50}ms`,
                opacity: 0,
              }}
            >
              <span
                className="flex-shrink-0 transition-all"
                style={{ color: hoveredId === item.id ? 'var(--color-primary)' : 'var(--text-tertiary)' }}
              >
                <CircleIcon />
              </span>
              <span
                className="text-sm truncate flex-1 transition-colors"
                style={{ color: hoveredId === item.id ? 'var(--color-primary)' : 'var(--text-secondary)' }}
              >
                {item.title}
              </span>
              <span
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                style={{
                  color: 'var(--color-primary)',
                  transform: hoveredId === item.id ? 'translateX(0)' : 'translateX(-4px)',
                }}
              >
                <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
