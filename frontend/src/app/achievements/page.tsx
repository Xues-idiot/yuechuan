"use client";

import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/achievements`);
      const data = await res.json();
      setAchievements(data.achievements || getMockAchievements());
    } catch (error) {
      console.error("Failed to load achievements:", error);
      setAchievements(getMockAchievements());
    } finally {
      setLoading(false);
    }
  };

  const getMockAchievements = (): Achievement[] => [
    { id: "first_read", name: "初次阅读", description: "阅读你的第一篇文章", icon: "📖", progress: 1, target: 1, unlocked: true, unlocked_at: "2026-03-20" },
    { id: "bookworm_10", name: "书虫10", description: "阅读10篇文章", icon: "📚", progress: 10, target: 10, unlocked: true, unlocked_at: "2026-03-22" },
    { id: "bookworm_100", name: "书虫100", description: "阅读100篇文章", icon: "📚", progress: 45, target: 100, unlocked: false },
    { id: "streak_7", name: "连续7天", description: "保持7天阅读 streak", icon: "🔥", progress: 5, target: 7, unlocked: false },
    { id: "streak_30", name: "连续30天", description: "保持30天阅读 streak", icon: "🔥", progress: 5, target: 30, unlocked: false },
    { id: "collector_10", name: "收藏家", description: "收藏10篇文章", icon: "⭐", progress: 8, target: 10, unlocked: false },
    { id: "share_5", name: "分享者", description: "分享5篇文章", icon: "📤", progress: 3, target: 5, unlocked: false },
    { id: "ai_user", name: "AI 用户", description: "使用AI功能10次", icon: "🤖", progress: 12, target: 10, unlocked: true, unlocked_at: "2026-03-21" },
    { id: "night_owl", name: "夜猫子", description: "在午夜后阅读", icon: "🦉", progress: 1, target: 1, unlocked: true, unlocked_at: "2026-03-23" },
    { id: "early_bird", name: "早起鸟", description: "在早上6点前阅读", icon: "🐦", progress: 0, target: 1, unlocked: false },
  ];

  const filteredAchievements = achievements.filter(a => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🏆 成就</h1>
              <p className="text-gray-600 dark:text-gray-400">
                完成任务，解锁成就
              </p>
            </div>
            <button
              onClick={loadAchievements}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-yellow-500">{unlockedCount}</div>
            <div className="text-sm text-gray-500">已解锁</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-gray-400">{achievements.length - unlockedCount}</div>
            <div className="text-sm text-gray-500">未解锁</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">
              {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">完成率</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "unlocked", "locked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {f === "all" ? "全部" : f === "unlocked" ? "已解锁" : "进行中"}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            ))
          ) : (
            filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-colors ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className={`font-semibold ${achievement.unlocked ? "text-yellow-700 dark:text-yellow-400" : ""}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 mb-2">{achievement.description}</div>

                {achievement.unlocked ? (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    ✓ 已解锁 {formatDate(achievement.unlocked_at)}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {achievement.progress} / {achievement.target}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 成就提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 保持每日阅读习惯，解锁连续阅读成就</li>
            <li>• 使用AI功能可以获得AI用户成就</li>
            <li>• 收藏和分享文章可以解锁更多成就</li>
          </ul>
        </div>
      </div>
    </main>
  );
}