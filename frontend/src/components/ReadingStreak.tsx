"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_read_days: number;
  today_read_count: number;
  today_items: Array<{ id: number; title: string; url: string }>;
  week_logs: Array<{ date: string; items_read: number; reading_time_minutes: number }>;
}

// Icons
function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.023 2.1c-1.517-.65-3.148-.065-4.242.92-1.094.985-1.72 2.33-1.72 3.83 0 2.387 1.818 4.32 4.062 4.32.38 0 .75-.04 1.1-.12-.02.14-.03.28-.03.42 0 .66.19 1.27.52 1.8-.74-.07-1.45-.35-2.04-.81-.56-.43-.95-1.02-1.14-1.69-.14.46-.22.94-.22 1.44 0 1.32.52 2.56 1.47 3.48l.02.02c.97.94 2.4 1.53 3.89 1.53 2.9 0 5.29-2.16 5.63-4.93.14-.03.28-.05.41-.08.06-.01.11-.03.17-.04.06-.01.11-.03.17-.04.02 0 .04-.01.06-.02.06-.02.12-.03.18-.05.05-.01.1-.03.15-.05.05-.02.11-.03.16-.05.05-.02.1-.04.15-.06.05-.02.1-.04.14-.06.05-.02.09-.04.14-.06.04-.02.09-.04.13-.06.04-.02.08-.04.12-.07.04-.02.08-.04.12-.07.04-.02.07-.04.11-.07.04-.02.07-.05.11-.07.03-.02.07-.05.1-.07.03-.03.07-.05.1-.08.03-.03.06-.05.09-.08.03-.03.06-.05.08-.08l.09-.09c.02-.03.05-.06.07-.09.02-.03.04-.06.06-.1.02-.03.04-.06.05-.09.02-.03.03-.06.05-.1.01-.03.03-.06.04-.09.01-.03.03-.06.04-.1.01-.03.02-.06.03-.1.01-.03.02-.06.03-.1 0-.03.02-.06.02-.1v-.1c0-.03.01-.07.01-.1v-.1c0-.04 0-.07-.01-.11v-.11c0-.03-.01-.06-.01-.1 0-.03-.01-.06-.01-.1-.01-.03-.01-.06-.02-.09s-.01-.06-.02-.09-.01-.06-.02-.09-.02-.06-.02-.09-.02-.06-.02-.09-.02-.06-.03-.09-.02-.06-.03-.09-.02-.06-.04-.09-.02-.06-.04-.09-.03-.06-.04-.09-.03-.06-.04-.09-.03-.05-.04-.08-.03-.06-.05-.09-.03-.05-.05-.08-.04-.06-.05-.08-.04-.05-.06-.08-.04-.05-.06-.08-.04-.05-.06-.07-.05-.05-.07-.08-.05-.05-.07-.07-.05-.05-.08-.07-.05-.05-.08-.07-.06-.05-.08-.07-.06-.04-.09-.07-.06-.04-.09-.06-.06-.04-.09-.06-.07-.04-.1-.06-.07-.04-.1-.06-.07-.04-.1-.05-.07-.03-.1-.05-.07-.03-.1-.05-.08-.03-.11-.04c-.03-.01-.06-.02-.09-.03-.03-.01-.07-.02-.1-.03-.03-.01-.07-.02-.1-.03-.03 0-.06-.01-.1-.02l-.1-.02c-.03 0-.07-.01-.1-.02-.04 0-.07-.01-.11-.01h-.1c-.04 0-.07-.01-.11-.01h-.1c-.04 0-.07 0-.11-.01h-.1c-.04 0-.07 0-.1.01-.03 0-.07.01-.1.01-.03 0-.07.01-.1.01-.04.01-.07.01-.1.02-.03 0-.07.01-.1.02-.04.01-.07.01-.1.02-.03.01-.07.02-.1.02-.03.01-.07.02-.1.02-.03.01-.06.02-.09.03-.03.01-.06.02-.09.03-.03.01-.06.02-.09.03-.03.01-.06.02-.09.03-.03.01-.06.02-.09.03-.03.01-.05.02-.08.03-.03.01-.05.02-.08.04-.02.01-.05.02-.08.03-.02.01-.05.02-.07.03-.02.01-.05.02-.07.03-.02.01-.04.02-.07.03-.02.01-.04.02-.06.03-.02.01-.04.02-.06.03-.02.01-.04.02-.06.03-.02.01-.04.02-.05.03-.02.01-.03.02-.05.03-.02.01-.03.02-.05.03-.01.01-.03.02-.04.02-.01.01-.03.02-.04.03-.01.01-.03.02-.04.02-.01.01-.02.02-.04.03-.01.01-.02.02-.03.02-.01.01-.02.02-.03.02 0 0-.01.01-.02.02l-.03.03c-.01 0-.01.01-.02.02-.01.01-.02.02-.02.02s-.01.01-.01.01c-.01.01-.01.01 0 0-1.85-.75-3.18-2.57-3.18-4.73 0-.61.1-1.19.29-1.74.19-.56.46-1.06.8-1.5l.02-.02c.35-.45.78-.82 1.27-1.1.49-.28 1.04-.46 1.62-.52.58-.06 1.17-.02 1.72.12.55.14 1.05.38 1.48.71.43.33.8.74 1.09 1.21.29.47.5 1 .64 1.55.14.55.17 1.12.11 1.69-.06.57-.23 1.11-.49 1.59-.26.48-.6.9-1.02 1.25-.42.35-.9.61-1.41.79-.51.18-1.05.27-1.6.27-.93 0-1.82-.22-2.59-.63-.77-.41-1.42-1-1.89-1.71l-.02-.02c-.47-.71-.74-1.54-.74-2.44 0-.84.25-1.64.69-2.31.44-.67 1.07-1.21 1.81-1.56.74-.35 1.57-.48 2.41-.36.84.12 1.6.45 2.2.97l.02.02c.6.52 1.02 1.22 1.19 2.01.17.79.05 1.6-.33 2.32-.38.72-1.01 1.28-1.79 1.6l-.02.02c-.78.32-1.66.33-2.46.03-.8-.3-1.48-.85-1.94-1.55l-.02-.02c-.46-.7-.66-1.54-.55-2.36.11-.82.47-1.58 1.02-2.16.55-.58 1.29-.98 2.09-1.12.8-.14 1.62-.03 2.34.31.72.34 1.32.89 1.71 1.56l.02.02c.39.67.54 1.45.41 2.22-.13.77-.52 1.48-1.08 2.02-.56.54-1.29.87-2.07.95l-.02.02c-.78.08-1.56-.08-2.23-.46-.67-.38-1.19-.97-1.49-1.67l-.02-.02c-.3-.7-.36-1.49-.17-2.24.19-.75.63-1.41 1.24-1.9.61-.49 1.38-.75 2.18-.75.8 0 1.56.26 2.16.75.6.49 1.01 1.16 1.18 1.9.17.74.06 1.51-.31 2.19-.37.68-1 1.21-1.75 1.51l-.02.02c-.75.3-1.59.34-2.38.11-.79-.23-1.47-.7-1.95-1.33l-.02-.02c-.48-.63-.74-1.41-.72-2.21.02-.8.31-1.56.83-2.17.52-.61 1.23-1.04 2.03-1.22.8-.18 1.63-.14 2.39.11.76.25 1.41.71 1.87 1.31l.02.02c.46.6.7 1.32.69 2.06 0 .74-.24 1.45-.67 2.03-.43.58-1.05 1.01-1.75 1.24l-.02.02c-.7.23-1.47.24-2.19.03-.72-.21-1.36-.61-1.82-1.14l-.02-.02c-.46-.53-.74-1.2-.79-1.9-.05-.7.1-1.4.42-1.99.32-.59.8-1.06 1.39-1.35.59-.29 1.26-.39 1.93-.28.67.11 1.28.4 1.75.83l.02.02c.47.43.8.99.94 1.61.14.62.08 1.26-.16 1.84-.24.58-.67 1.06-1.21 1.38-.54.32-1.17.44-1.79.35-.62-.09-1.18-.38-1.61-.81l-.02-.02c-.43-.43-.71-.99-.79-1.59-.08-.6.02-1.22.28-1.76.26-.54.68-.98 1.19-1.27.51-.29 1.1-.42 1.69-.38.59.04 1.14.25 1.59.59l.02.02c.45.34.79.81.97 1.34.18.53.18 1.1.01 1.63-.17.53-.5.99-.94 1.32-.44.33-.99.51-1.55.51-.56 0-1.09-.18-1.51-.51l-.02-.02c-.42-.33-.72-.79-.85-1.31-.13-.52-.1-1.07.08-1.57.18-.5.51-.93.94-1.22.43-.29.95-.43 1.48-.39l-.07.02Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

export default function ReadingStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const loadStreak = useCallback(async () => {
    try {
      const data = await api.getStreak();
      setStreak(data);
    } catch (error) {
      console.error("Failed to load streak:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadStreak();
  }, [loadStreak]);

  const weekDays = useMemo(() => ["一", "二", "三", "四", "五", "六", "日"], []);

  const weekActivity = useMemo(() => {
    if (!streak?.week_logs) return [];
    return weekDays.map((day, index) => {
      const dayIndex = index === 6 ? 0 : index + 1;
      const log = streak.week_logs.find(l => {
        const logDay = new Date(l.date).getDay();
        return logDay === dayIndex;
      });
      return {
        day,
        itemsRead: log?.items_read || 0,
        hasActivity: log && log.items_read > 0,
      };
    });
  }, [streak, weekDays]);

  const stats = useMemo(() => [
    { label: '当前连续', value: streak?.current_streak || 0, color: 'var(--color-warning)', bgColor: 'rgba(245, 158, 11, 0.1)' },
    { label: '最长连续', value: streak?.longest_streak || 0, color: 'var(--color-primary)', bgColor: 'rgba(3, 105, 161, 0.1)' },
    { label: '今日已读', value: streak?.today_read_count || 0, color: 'var(--color-success)', bgColor: 'rgba(16, 185, 129, 0.1)' },
  ], [streak]);

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

  if (!streak) return null;

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
            <CalendarIcon />
          </span>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            阅读打卡
          </h3>
        </div>
        {streak.current_streak > 0 && (
          <span
            className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full transition-all"
            style={{
              color: 'var(--color-warning)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
            }}
          >
            <FlameIcon />
            <span>{streak.current_streak} 天连续</span>
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1">
          {weekActivity.map(({ day, hasActivity }, index) => (
            <div
              key={day}
              className="text-center group"
              title={`周${day}: ${streak.week_logs?.[index]?.items_read || 0} 篇`}
            >
              <div
                className="w-full aspect-square rounded-md transition-all duration-300 transform group-hover:scale-110"
                style={{
                  backgroundColor: hasActivity ? 'var(--color-primary)' : 'var(--border-default)',
                  opacity: mounted ? (hasActivity ? 1 : 0.4) : 0,
                  transform: mounted ? 'scale(1)' : 'scale(0.8)',
                  transitionDelay: `${index * 50}ms`,
                }}
              />
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                周{day}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {stats.map(({ label, value, color, bgColor }) => (
          <div
            key={label}
            className="text-center p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="text-2xl font-bold transition-colors"
              style={{ color, fontFamily: 'var(--font-serif)' }}
            >
              {value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {streak.today_items.length > 0 && (
        <div
          className="border-t pt-3 transition-colors"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            今日已读
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {streak.today_items.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm truncate transition-all group"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="truncate flex-1 group-hover:underline">
                  {item.title}
                </span>
                <span
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <ExternalLinkIcon />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
