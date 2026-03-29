"use client";

import { useState, useEffect } from "react";

interface Reminder {
  id: number;
  reminder_type: string;
  time: string;
  days_of_week: string | null;
  enabled: boolean;
  message: string | null;
  last_sent_at: string | null;
}

const REMINDER_TYPES = [
  { value: "daily", label: "每日提醒", icon: "📅" },
  { value: "weekly", label: "每周提醒", icon: "📆" },
  { value: "custom", label: "自定义", icon: "⚙️" },
];

const DAYS_OF_WEEK = [
  { value: "0", label: "周日" },
  { value: "1", label: "周一" },
  { value: "2", label: "周二" },
  { value: "3", label: "周三" },
  { value: "4", label: "周四" },
  { value: "5", label: "周五" },
  { value: "6", label: "周六" },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    reminder_type: "daily",
    time: "09:00",
    days_of_week: "",
    message: "",
    enabled: true
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReminders = async () => {
    try {
      const res = await fetch(`${API_BASE}/reminders`);
      const data = await res.json();
      setReminders(data);
    } catch (error) {
      console.error("Failed to load reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await fetch(`${API_BASE}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      await loadReminders();
      setShowForm(false);
      setFormData({
        reminder_type: "daily",
        time: "09:00",
        days_of_week: "",
        message: "",
        enabled: true
      });
    } catch (error) {
      console.error("Failed to create reminder:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个提醒吗？")) return;

    try {
      await fetch(`${API_BASE}/reminders/${id}`, { method: "DELETE" });
      await loadReminders();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const handleToggle = async (id: number, enabled: boolean) => {
    try {
      const reminder = reminders.find((r) => r.id === id);
      if (!reminder) return;

      await fetch(`${API_BASE}/reminders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reminder,
          enabled: !enabled
        })
      });
      await loadReminders();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
    }
  };

  const formatDays = (days: string | null) => {
    if (!days) return "每天";
    return days.split(",").map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label).join(", ");
  };

  const getTypeLabel = (type: string) => {
    return REMINDER_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">⏰ 阅读提醒</h1>
              <p className="text-gray-600 dark:text-gray-400">
                设置提醒，养成阅读习惯
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showForm ? "取消" : "+ 添加提醒"}
            </button>
          </div>
        </header>

        {/* 添加表单 */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
          >
            <h2 className="font-semibold mb-4">新建提醒</h2>

            <div className="space-y-4">
              {/* 提醒类型 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  提醒类型
                </label>
                <div className="flex gap-2">
                  {REMINDER_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, reminder_type: type.value })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        formData.reminder_type === type.value
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 时间 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  提醒时间
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>

              {/* 星期（自定义类型） */}
              {formData.reminder_type === "custom" && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    选择星期
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          const current = formData.days_of_week ? formData.days_of_week.split(",") : [];
                          if (current.includes(day.value)) {
                            setFormData({
                              ...formData,
                              days_of_week: current.filter((d) => d !== day.value).join(",")
                            });
                          } else {
                            setFormData({
                              ...formData,
                              days_of_week: [...current, day.value].join(",")
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          formData.days_of_week?.split(",").includes(day.value)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 自定义消息 */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  提醒消息（可选）
                </label>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="每天进步一点点！"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {saving ? "保存中..." : "保存提醒"}
              </button>
            </div>
          </form>
        )}

        {/* 提醒列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-6 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : reminders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>暂无提醒</p>
              <p className="text-sm mt-1">点击上方按钮添加第一个提醒</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${reminder.enabled ? "bg-green-500" : "bg-gray-300"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {REMINDER_TYPES.find((t) => t.value === reminder.reminder_type)?.icon}
                        {" "}
                        {reminder.time}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDays(reminder.days_of_week)}
                      </span>
                    </div>
                    {reminder.message && (
                      <p className="text-sm text-gray-500 mt-1">{reminder.message}</p>
                    )}
                    {reminder.last_sent_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        上次发送: {new Date(reminder.last_sent_at).toLocaleString("zh-CN")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(reminder.id, reminder.enabled)}
                    className={`px-3 py-1 rounded text-sm ${
                      reminder.enabled
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700"
                    }`}
                  >
                    {reminder.enabled ? "已开启" : "已关闭"}
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 提示 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 小贴士</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 建议设置每天固定时间阅读，形成习惯</li>
            <li>• 早起后或睡前是阅读的好时机</li>
            <li>• 提醒需要在浏览器中开启通知权限才能生效</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
