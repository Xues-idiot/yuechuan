"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface NotificationPrefs {
  enabled: boolean;
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
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/settings"
              className="text-sm text-gray-500 hover:text-blue-500 mb-2 block"
            >
              ← 返回设置
            </Link>
            <h1 className="text-2xl font-bold">通知设置</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* 通知权限 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🔔 通知权限</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">浏览器通知</p>
                <p className="text-sm text-gray-500">
                  状态:{" "}
                  {typeof Notification !== "undefined"
                    ? Notification.permission === "granted"
                      ? "已授权 ✓"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {testing ? "发送中..." : "发送测试通知"}
                </button>
              )}
          </div>
        </section>

        {/* 通知类型 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">📋 通知类型</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">新内容通知</p>
                <p className="text-sm text-gray-500">订阅源更新时通知</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.newContent}
                onChange={(e) =>
                  setPrefs({ ...prefs, newContent: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">复习提醒</p>
                <p className="text-sm text-gray-500">间隔复习到期时通知</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.reviewReminder}
                onChange={(e) =>
                  setPrefs({ ...prefs, reviewReminder: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">目标达成</p>
                <p className="text-sm text-gray-500">阅读目标完成时通知</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.goalAchieved}
                onChange={(e) =>
                  setPrefs({ ...prefs, goalAchieved: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
        </section>

        {/* 免打扰时间 */}
        <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🌙 免打扰时间</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">启用免打扰</p>
                <p className="text-sm text-gray-500">在指定时间段内静音</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.quietHoursEnabled}
                onChange={(e) =>
                  setPrefs({ ...prefs, quietHoursEnabled: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            {prefs.quietHoursEnabled && (
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">开始时间</label>
                  <input
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) =>
                      setPrefs({ ...prefs, quietHoursStart: e.target.value })
                    }
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">结束时间</label>
                  <input
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) =>
                      setPrefs({ ...prefs, quietHoursEnd: e.target.value })
                    }
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {saved ? "✓ 已保存" : "保存设置"}
        </button>
      </div>
    </main>
  );
}
