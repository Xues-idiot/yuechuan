"use client";

import { useState, useEffect, useRef } from "react";

interface FocusSettings {
  enabled: boolean;
  hide_sidebar: boolean;
  hide_notifications: boolean;
  dim_others: boolean;
  font_size: number;
  line_height: number;
  font_family: string;
  auto_timer_minutes: number;
}

interface FocusSession {
  session_id: number;
  started_at: string;
  duration_minutes: number;
  item_id: number | null;
  paused?: boolean;
}

export default function FocusModePage() {
  const [settings, setSettings] = useState<FocusSettings>({
    enabled: false,
    hide_sidebar: true,
    hide_notifications: true,
    dim_others: true,
    font_size: 18,
    line_height: 1.8,
    font_family: "system-ui",
    auto_timer_minutes: 0
  });
  const [session, setSession] = useState<FocusSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (session && !session.paused) {
      timerRef.current = setInterval(() => {
        const start = new Date(session.started_at).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - start) / 60000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/focus-mode/settings`);
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch(`${API_BASE}/focus-mode/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const startSession = async (duration: number = 30) => {
    try {
      const res = await fetch(`${API_BASE}/focus-mode/session/start?duration_minutes=${duration}`, {
        method: "POST"
      });
      const data = await res.json();
      setSession({
        session_id: data.session_id,
        started_at: data.started_at,
        duration_minutes: duration,
        item_id: null
      });
      setElapsed(0);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  const endSession = async () => {
    if (!session) return;
    try {
      await fetch(`${API_BASE}/focus-mode/session/${session.session_id}/end`, {
        method: "POST"
      });
      setSession(null);
      setElapsed(0);
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  const togglePause = async () => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/focus-mode/session/${session.session_id}/pause`, {
        method: "POST"
      });
      const data = await res.json();
      setSession({ ...session, paused: data.paused });
    } catch (error) {
      console.error("Failed to toggle pause:", error);
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  };

  const getProgress = () => {
    if (!session) return 0;
    return Math.min(100, (elapsed / session.duration_minutes) * 100);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 专注模式</h1>
          <p className="text-gray-600 dark:text-gray-400">
            减少干扰，专注阅读
          </p>
        </header>

        {/* Active Session */}
        {session && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 mb-6 text-white">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{formatTime(elapsed)}</div>
              <div className="text-sm opacity-80 mb-4">
                / {formatTime(session.duration_minutes)} 目标
              </div>
              <div className="h-2 bg-white/30 rounded-full mb-4">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={togglePause}
                  className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  {session.paused ? "▶️ 继续" : "⏸️ 暂停"}
                </button>
                <button
                  onClick={endSession}
                  className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-white/90"
                >
                  结束专注
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {!session && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="font-semibold mb-4">专注计时器</h2>
              <div className="grid grid-cols-3 gap-3">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => startSession(mins)}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-center"
                  >
                    <div className="text-2xl font-bold">{mins}</div>
                    <div className="text-xs text-gray-500">分钟</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-4">专注设置</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>隐藏侧边栏</span>
                  <input
                    type="checkbox"
                    checked={settings.hide_sidebar}
                    onChange={(e) => setSettings({ ...settings, hide_sidebar: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>隐藏通知</span>
                  <input
                    type="checkbox"
                    checked={settings.hide_notifications}
                    onChange={(e) => setSettings({ ...settings, hide_notifications: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>降低其他内容亮度</span>
                  <input
                    type="checkbox"
                    checked={settings.dim_others}
                    onChange={(e) => setSettings({ ...settings, dim_others: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-500"
                  />
                </label>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span>字体大小</span>
                    <span className="font-mono">{settings.font_size}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="24"
                    value={settings.font_size}
                    onChange={(e) => setSettings({ ...settings, font_size: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span>行高</span>
                    <span className="font-mono">{settings.line_height}</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="22"
                    step="2"
                    value={settings.line_height * 10}
                    onChange={(e) => setSettings({ ...settings, line_height: Number(e.target.value) / 10 })}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存设置"}
              </button>
            </div>
          </>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 专注技巧</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 番茄工作法：25分钟专注 + 5分钟休息</li>
            <li>• 找一个安静的环境</li>
            <li>• 关闭手机通知</li>
            <li>• 设定具体目标</li>
          </ul>
        </div>
      </div>
    </main>
  );
}