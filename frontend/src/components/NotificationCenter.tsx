"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  url?: string;
  read: boolean;
  created_at: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // 每30秒刷新一次
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    try {
      const notifications = await api.getNotifications(50, 0);
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length);
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await api.markNotificationRead(id);
      loadNotifications();
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (e) {
      console.error("Failed to mark all notifications as read:", e);
    }
  }

  async function handleClear() {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (e) {
      console.error("Failed to clear notifications:", e);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)]"
        style={{
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-medium"
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--text-inverse)',
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0"
            style={{ zIndex: 'var(--z-modal-backdrop)' }}
            onClick={() => setShowDropdown(false)}
          />
          <div
            className="absolute right-0 mt-2 w-80 rounded-[var(--radius-lg)] overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 'var(--z-modal)',
            }}
          >
            <div
              className="p-4 flex items-center justify-between"
              style={{
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                通知
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  全部已读
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--color-error)' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  清空
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
                  暂无通知
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className="p-4 transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      backgroundColor: !n.read ? 'var(--color-primary-light)' : 'transparent',
                      opacity: !n.read ? 0.9 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!n.read) {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                        e.currentTarget.style.opacity = '1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!n.read) {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                        e.currentTarget.style.opacity = '0.9';
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {n.title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {n.body}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-xs ml-2 transition-colors"
                          style={{ color: 'var(--color-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          标为已读
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
