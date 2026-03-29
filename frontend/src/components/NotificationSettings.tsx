"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface NotificationPrefs {
  enabled: boolean;
  soundEnabled: boolean;
  newContent: boolean;
  reviewReminder: boolean;
  goalAchieved: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const PREFS_KEY = "notification_prefs";

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    enabled: true,
    soundEnabled: true,
    newContent: true,
    reviewReminder: true,
    goalAchieved: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(PREFS_KEY);
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }

    // 检查浏览器是否支持通知
    if (!("Notification" in window)) {
      alert("您的浏览器不支持通知功能");
    }
  }, []);

  function handleSave() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleRequestPermission() {
    if (!("Notification" in window)) {
      alert("您的浏览器不支持通知功能");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPrefs({ ...prefs, enabled: true });
      alert("通知权限已授予！");
    } else {
      alert("通知权限被拒绝");
    }
  }

  async function handleTestNotification() {
    if (!prefs.enabled) {
      alert("请先启用通知");
      return;
    }

    setTesting(true);
    try {
      // 发送测试通知
      new Notification("阅川测试", {
        body: "这是一条测试通知，用于验证通知功能是否正常。",
        icon: "/icon-192.png",
      });
    } catch (e) {
      alert("发送通知失败：" + (e instanceof Error ? e.message : "未知错误"));
    } finally {
      setTesting(false);
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
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

        {/* 通知权限 */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-lg)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            通知权限
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>浏览器通知</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  状态:{" "}
                  {typeof Notification !== "undefined"
                    ? Notification.permission === "granted"
                      ? "已授权"
                      : Notification.permission === "denied"
                      ? "已拒绝"
                      : "未授权"
                    : "不支持"}
                </p>
              </div>
              {typeof Notification !== "undefined" &&
                Notification.permission !== "granted" && (
                  <button
                    onClick={handleRequestPermission}
                    className="px-4 py-2 rounded-[var(--radius-sm)] font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                  >
                    授权通知
                  </button>
                )}
            </div>
            {typeof Notification !== "undefined" &&
              Notification.permission === "granted" && (
                <button
                  onClick={handleTestNotification}
                  disabled={testing}
                  className="px-4 py-2 rounded-[var(--radius-sm)] border transition-colors"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                >
                  {testing ? "发送中..." : "发送测试通知"}
                </button>
              )}
          </div>
        </section>

        {/* 通知类型 */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-lg)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            通知类型
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-default)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
            >
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>新内容通知</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>订阅源更新时通知</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.newContent}
                onChange={(e) =>
                  setPrefs({ ...prefs, newContent: e.target.checked })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-default)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
            >
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>复习提醒</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>间隔复习到期时通知</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.reviewReminder}
                onChange={(e) =>
                  setPrefs({ ...prefs, reviewReminder: e.target.checked })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-default)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
            >
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>目标达成</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>阅读目标完成时通知</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.goalAchieved}
                onChange={(e) =>
                  setPrefs({ ...prefs, goalAchieved: e.target.checked })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-default)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
            >
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>通知声音</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>收到通知时播放提示音</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.soundEnabled}
                onChange={(e) =>
                  setPrefs({ ...prefs, soundEnabled: e.target.checked })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </label>
          </div>
        </section>

        {/* 免打扰时间 */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-lg)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            免打扰时间
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-default)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
            >
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>启用免打扰</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>在指定时间段内静音</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.quietHoursEnabled}
                onChange={(e) =>
                  setPrefs({ ...prefs, quietHoursEnabled: e.target.checked })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </label>

            {prefs.quietHoursEnabled && (
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>开始时间</label>
                  <input
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) =>
                      setPrefs({ ...prefs, quietHoursStart: e.target.value })
                    }
                    className="input"
                    style={{ width: '120px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>结束时间</label>
                  <input
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) =>
                      setPrefs({ ...prefs, quietHoursEnd: e.target.value })
                    }
                    className="input"
                    style={{ width: '120px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-[var(--radius-md)] font-medium transition-colors"
          style={{
            backgroundColor: saved ? 'var(--color-success)' : 'var(--color-primary)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            if (!saved) e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          }}
          onMouseLeave={(e) => {
            if (!saved) e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          {saved ? "已保存" : "保存设置"}
        </button>
      </div>
    </main>
  );
}
