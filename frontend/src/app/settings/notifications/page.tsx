"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Bell, Mail, Smartphone, MessageSquare, Calendar, AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

export default function SettingsNotificationsPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: "push",
      label: "推送通知",
      description: "接收浏览器推送通知",
      enabled: true,
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      id: "email",
      label: "邮件通知",
      description: "接收重要更新的邮件提醒",
      enabled: false,
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: "daily",
      label: "每日摘要",
      description: "每日阅读总结和推荐内容",
      enabled: true,
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: "comments",
      label: "评论通知",
      description: "有人评论你的内容时通知",
      enabled: false,
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: "alerts",
      label: "告警通知",
      description: "系统异常和重要事件告警",
      enabled: true,
      icon: <AlertCircle className="w-5 h-5" />,
    },
  ]);

  const togglePreference = (id: string) => {
    setPreferences(preferences.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 text-sm mb-3 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回设置
            </Link>
            <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
              通知设置
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Notification Preferences */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-md)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                通知偏好
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                选择你希望接收的通知类型
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-4 rounded-[var(--radius-md)] transition-colors"
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-default)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  >
                    {pref.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                      {pref.label}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {pref.description}
                    </div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  role="switch"
                  aria-checked={pref.enabled}
                  onClick={() => togglePreference(pref.id)}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: pref.enabled ? 'var(--color-primary)' : 'var(--border-default)',
                  }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                    style={{
                      backgroundColor: 'white',
                      left: pref.enabled ? '22px' : '4px',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quiet Hours */}
        <section
          className="p-5 rounded-[var(--radius-md)] border"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3 className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
            免打扰时段
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
            在此时段内不会发送任何通知
          </p>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>
                开始时间
              </label>
              <input
                type="time"
                defaultValue="22:00"
                className="input"
                style={{ width: '120px' }}
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-tertiary)' }}>
                结束时间
              </label>
              <input
                type="time"
                defaultValue="08:00"
                className="input"
                style={{ width: '120px' }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}