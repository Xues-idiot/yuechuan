"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_days: number;
  today_read: number;
  today_goal: number;
  last_read_date: string;
  history: { date: string; read_count: number }[];
}

export default function StreakPage() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = () => {
    setLoading(true);

    // 模拟数据
    const today = new Date().toISOString().split("T")[0];
    const mockData: StreakData = {
      current_streak: 5,
      longest_streak: 12,
      total_days: 45,
      today_read: 8,
      today_goal: 10,
      last_read_date: today,
      history: generateMockHistory()
    };

    // 从 localStorage 读取真实数据
    const saved = localStorage.getItem("reading_streak");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStreakData(parsed);
      } catch {
        setStreakData(mockData);
      }
    } else {
      setStreakData(mockData);
    }
    setLoading(false);
  };

  const generateMockHistory = () => {
    const history = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      // 随机生成阅读数量，模拟streak
      const readCount = Math.random() > 0.2 ? Math.floor(Math.random() * 15) + 1 : 0;
      history.push({ date: dateStr, read_count: readCount });
    }
    return history;
  };

  const handleMarkRead = () => {
    if (!streakData) return;

    const today = new Date().toISOString().split("T")[0];
    const newData = { ...streakData };

    // 更新今天的阅读数
    const todayIndex = newData.history.findIndex(h => h.date === today);
    if (todayIndex >= 0) {
      newData.history[todayIndex].read_count++;
    } else {
      newData.history.push({ date: today, read_count: 1 });
    }

    newData.today_read = newData.history[todayIndex]?.read_count || 1;

    // 检查是否达成今日目标
    if (newData.today_read >= newData.today_goal && !celebrating) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    }

    // 更新连续阅读天数
    updateStreak(newData);

    // 保存
    localStorage.setItem("reading_streak", JSON.stringify(newData));
    setStreakData(newData);
  };

  const updateStreak = (data: StreakData) => {
    const today = new Date();
    let currentStreak = 0;

    // 从今天向前计算连续天数
    for (let i = 0; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayData = data.history.find(h => h.date === dateStr);

      if (dayData && dayData.read_count >= data.today_goal) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    data.current_streak = currentStreak;
    if (currentStreak > data.longest_streak) {
      data.longest_streak = currentStreak;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
  };

  const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月`;
  };

  const isToday = (dateStr: string) => {
    return dateStr === new Date().toISOString().split("T")[0];
  };

  const getIntensity = (count: number, goal: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    const ratio = count / goal;
    if (ratio >= 1) return "bg-green-500";
    if (ratio >= 0.5) return "bg-green-400";
    if (ratio >= 0.25) return "bg-green-300";
    return "bg-green-200";
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/features" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
                ← 返回功能页
              </Link>
              <h1 className="text-4xl font-bold mb-2">📅 阅读打卡</h1>
              <p className="text-gray-600 dark:text-gray-400">
                保持每日阅读习惯，连续打卡追踪
              </p>
            </div>
            <button
              onClick={handleMarkRead}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
            >
              📖 标记已读
            </button>
          </div>
        </header>

        {/* 庆祝动画 */}
        {celebrating && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-8xl animate-bounce">🎉</div>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-5xl font-bold mb-1">{streakData?.current_streak}</div>
            <div className="text-sm opacity-90">当前连续</div>
            <div className="text-xs mt-1 opacity-70">天</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-500">{streakData?.longest_streak}</div>
            <div className="text-sm text-gray-500">最长连续</div>
            <div className="text-xs text-gray-400 mt-1">天</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-blue-500">{streakData?.total_days}</div>
            <div className="text-sm text-gray-500">总打卡</div>
            <div className="text-xs text-gray-400 mt-1">天</div>
          </div>
        </div>

        {/* 今日进度 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">今日进度</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${streakData?.today_read >= streakData!.today_goal ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700"}`}>
              {streakData?.today_read} / {streakData?.today_goal} 篇
            </span>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${streakData?.today_read >= streakData!.today_goal ? "bg-green-500" : "bg-blue-500"}`}
              style={{ width: `${Math.min(((streakData?.today_read || 0) / (streakData?.today_goal || 10)) * 100, 100)}%` }}
            />
          </div>
          {streakData?.today_read >= streakData!.today_goal && (
            <p className="text-center text-green-500 mt-2 font-medium">🎉 今日目标已达成！</p>
          )}
        </div>

        {/* 热力图日历 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4">阅读日历</h2>
          <div className="grid grid-cols-7 gap-2">
            {/* 星期标签 */}
            <div className="text-center text-xs text-gray-400 mb-2">
              <div>日</div>
            </div>
            {[1, 2, 3, 4, 5, 6].map(d => (
              <div key={d} className="text-center text-xs text-gray-400 mb-2">
                <div>{["一", "二", "三", "四", "五", "六"][d - 1]}</div>
              </div>
            ))}

            {/* 日历格子 */}
            {streakData?.history.map((day, idx) => {
              const date = new Date(day.date);
              const dayOfWeek = date.getDay();
              const isFirstDay = idx === 0 || date.getDate() === 1;

              return (
                <div key={day.date} className="relative">
                  {/* 月份标签 */}
                  {isFirstDay && dayOfWeek !== 0 && (
                    <div className="absolute top-0 left-0 text-xs text-gray-400 -mt-5">
                      {getMonthName(day.date)}
                    </div>
                  )}
                  {/* 日期格子 */}
                  <div
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-xs
                      ${getIntensity(day.read_count, streakData.today_goal)}
                      ${isToday(day.date) ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900" : ""}
                      transition-all hover:scale-110 cursor-pointer
                    `}
                    title={`${day.date}: ${day.read_count}篇`}
                  >
                    <span className={day.read_count > 0 ? "text-white font-medium" : "text-gray-400"}>
                      {formatDate(day.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
            <span>少</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-4 h-4 rounded bg-green-200"></div>
              <div className="w-4 h-4 rounded bg-green-300"></div>
              <div className="w-4 h-4 rounded bg-green-400"></div>
              <div className="w-4 h-4 rounded bg-green-500"></div>
            </div>
            <span>多</span>
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 如何保持连续阅读</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 设定一个可以实现的每日目标</li>
            <li>• 选择一个固定的阅读时间</li>
            <li>• 每天至少阅读 {streakData?.today_goal || 10} 篇文章来保持连续</li>
            <li>• 可以使用「标记已读」按钮来手动记录阅读</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
