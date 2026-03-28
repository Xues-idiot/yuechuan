"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  getDueReviews,
  recordReview,
  getReviewStats,
  ReviewItem,
  ReviewResult,
} from "@/lib/spaced-repetition";
import ThemeToggle from "@/components/ThemeToggle";
import { CheckCircleIcon, SparklesIcon, PencilIcon, ArrowRightIcon } from "lucide-react";

export default function ReviewPage() {
  const [dueItems, setDueItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ total: 0, due: 0, reviewed_today: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 从服务器同步复习数据
  const syncFromServer = useCallback(async () => {
    setSyncing(true);
    try {
      const serverItems = await api.getReviewItems();
      if (serverItems && serverItems.length > 0) {
        // 合并服务器数据到本地
        const localItems = getDueReviews();
        const localMap = new Map(localItems.map((item) => [item.item_id, item]));

        serverItems.forEach((serverItem) => {
          const existing = localMap.get(serverItem.item.id);
          if (existing) {
            // 使用服务器的数据更新本地间隔重复记录
            const { ease_factor, interval, next_review } = serverItem;
            existing.ease_factor = ease_factor;
            existing.interval = interval;
            existing.next_review = next_review;
          }
        });
      }
    } catch (e) {
      console.error("Failed to sync from server:", e);
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    syncFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadData() {
    setDueItems(getDueReviews());
    setStats(getReviewStats());
    setCurrentIndex(0);
    setShowAnswer(false);
    setLoading(false);
  }

  async function handleReview(quality: ReviewResult["quality"]) {
    if (dueItems.length === 0) return;

    const current = dueItems[currentIndex];

    // 记录本地
    recordReview(current.item_id, { quality });

    // 尝试同步到服务器
    try {
      await api.reviewItem(current.item_id, quality);
    } catch (e) {
      console.error("Failed to sync review to server:", e);
    }

    // 移至下一项
    const newItems = getDueReviews();
    setDueItems(newItems);

    if (newItems.length === 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(Math.min(currentIndex, newItems.length - 1));
    }
    setShowAnswer(false);
    setStats(getReviewStats());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showAnswer) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setShowAnswer(true);
      }
    } else {
      const qualityMap: Record<string, ReviewResult["quality"]> = {
        "0": 0, "1": 0, // 忘记
        "2": 2, "3": 2, // 模糊
        "4": 4, // 良好 (按钮是4)
        "5": 5, // 完美
      };
      if (qualityMap[e.key]) {
        handleReview(qualityMap[e.key]);
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p style={{ color: 'var(--text-secondary)' }}>加载中...</p>
        </div>
      </main>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen p-8" onKeyDown={handleKeyDown} tabIndex={-1} style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm mb-2 block flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <ArrowRightIcon className="w-4 h-4 rotate-180" aria-hidden="true" />
              返回
            </Link>
            <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--text-primary)' }}>间隔复习</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>基于间隔重复算法巩固记忆</p>
          </div>
          <div className="flex items-center gap-3">
            {syncing && <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>同步中...</span>}
            <ThemeToggle />
          </div>
        </header>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-8" role="group" aria-label="复习统计">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{stats.total}</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>总复习项</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>{stats.due}</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>待复习</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{stats.reviewed_today}</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>今日已复习</div>
          </div>
        </div>

        {dueItems.length === 0 ? (
          <div className="text-center py-16 card p-8" role="status">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2 font-serif" style={{ color: 'var(--text-primary)' }}>太棒了！</h2>
            <p style={{ color: 'var(--text-secondary)' }}>今天没有待复习的内容了</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              收藏带笔记的内容会自动加入复习队列
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <span aria-live="polite">{currentIndex + 1} / {dueItems.length}</span>
              <span className="text-xs">键盘: 空格=显示, 0/1=忘记, 2/3=模糊, 4=良好, 5=完美</span>
            </div>

            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 font-serif" style={{ color: 'var(--text-primary)' }}>{dueItems[currentIndex].title}</h2>

              {/* 复习间隔信息 */}
              {dueItems[currentIndex].next_review && (
                <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  下次复习: {new Date(dueItems[currentIndex].next_review).toLocaleDateString()}
                  {" "}
                  间隔: {dueItems[currentIndex].interval} 天
                  {" "}
                  难度: {dueItems[currentIndex].ease_factor.toFixed(1)}
                </div>
              )}

              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="btn btn-primary w-full"
                  autoFocus
                >
                  显示内容 (空格键)
                </button>
              ) : (
                <>
                  <p className="whitespace-pre-wrap mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {dueItems[currentIndex].content.slice(0, 300)}
                    {dueItems[currentIndex].content.length > 300 ? "..." : ""}
                  </p>

                  {dueItems[currentIndex].notes && (
                    <div className="p-3 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                      <div className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                        <PencilIcon className="w-3 h-3" aria-hidden="true" />
                        我的笔记
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{dueItems[currentIndex].notes}</p>
                    </div>
                  )}

                  <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>这次记住了吗？</div>
                  <div className="grid grid-cols-5 gap-2" role="group" aria-label="选择记忆程度">
                    <button
                      onClick={() => handleReview(0)}
                      className="btn"
                      style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                      title="完全忘记 (0)"
                      aria-label="完全忘记"
                    >
                      忘记
                    </button>
                    <button
                      onClick={() => handleReview(2)}
                      className="btn"
                      style={{ backgroundColor: 'var(--color-warning)', color: 'white' }}
                      title="模糊 (2)"
                      aria-label="模糊"
                    >
                      模糊
                    </button>
                    <button
                      onClick={() => handleReview(3)}
                      className="btn"
                      style={{ backgroundColor: 'var(--color-warning)', color: 'white' }}
                      title="记得 (3)"
                      aria-label="记得"
                    >
                      记得
                    </button>
                    <button
                      onClick={() => handleReview(4)}
                      className="btn"
                      style={{ backgroundColor: 'var(--color-success)', color: 'white' }}
                      title="良好 (4)"
                      aria-label="良好"
                    >
                      良好
                    </button>
                    <button
                      onClick={() => handleReview(5)}
                      className="btn btn-primary"
                      title="完美 (5)"
                      aria-label="完美"
                    >
                      <SparklesIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        <div className="text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
          <p>提示：在阅读内容时写下笔记，内容会自动加入复习队列</p>
        </div>
      </div>
    </main>
  );
}
