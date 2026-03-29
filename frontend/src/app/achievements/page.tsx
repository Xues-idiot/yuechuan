"use client";

import { useState, useEffect } from "react";
import { Trophy, Lock, Sparkles, RefreshCw, TrendingUp, Calendar } from "lucide-react";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--text-inverse)' }}>
                <Trophy className="w-7 h-7" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>成就</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  完成任务，解锁成就
                </p>
              </div>
            </div>
            <button
              onClick={loadAchievements}
              className="btn btn-secondary gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              刷新
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-elevated p-5 text-center border relative overflow-hidden" style={{ borderColor: 'var(--color-accent)' }}>
            <div className="absolute inset-0 opacity-5" style={{ background: 'linear-gradient(135deg, var(--color-accent), transparent)' }} />
            <div className="relative">
              <div className="text-4xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>{unlockedCount}</div>
              <div className="text-sm flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                已解锁
              </div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="relative">
              <div className="text-4xl font-bold mb-1" style={{ color: 'var(--text-tertiary)' }}>{achievements.length - unlockedCount}</div>
              <div className="text-sm flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                未解锁
              </div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="relative">
              <div className="text-4xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
              </div>
              <div className="text-sm flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                完成率
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "unlocked", "locked"] as const).map((f, index) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f === "all" ? "全部" : f === "unlocked" ? "已解锁" : "进行中"}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-36 skeleton rounded-xl"></div>
            ))
          ) : (
            filteredAchievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] spring-in ${
                  achievement.unlocked
                    ? 'card-elevated'
                    : 'card'
                }`}
                style={{
                  backgroundColor: achievement.unlocked ? 'var(--surface-elevated)' : 'var(--surface-primary)',
                  borderColor: achievement.unlocked ? 'var(--color-accent)' : 'var(--border-default)',
                  backdropFilter: achievement.unlocked ? 'blur(12px)' : 'none',
                  animationDelay: `${index * 75}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-4xl transition-transform duration-300 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  {achievement.unlocked && (
                    <div className="p-1.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)15' }}>
                      <Trophy className="w-4 h-4" style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="font-semibold mb-0.5" style={{ color: achievement.unlocked ? 'var(--color-accent)' : 'var(--text-primary)' }}>
                  {achievement.name}
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>{achievement.description}</div>

                {achievement.unlocked ? (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-success)' }}>
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    已解锁 {formatDate(achievement.unlocked_at)}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-default)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500 progress-fill"
                          style={{
                            width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                            backgroundColor: 'var(--color-primary)'
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {achievement.progress} / {achievement.target}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Tips Card */}
        <div className="mt-6 p-5 rounded-xl border" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)' }}>
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            成就提示
          </h3>
          <ul className="text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--color-accent)' }}>•</span>
              保持每日阅读习惯，解锁连续阅读成就
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--color-accent)' }}>•</span>
              使用AI功能可以获得AI用户成就
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--color-accent)' }}>•</span>
              收藏和分享文章可以解锁更多成就
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}