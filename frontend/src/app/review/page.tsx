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

export default function ReviewPage() {
  const [dueItems, setDueItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ total: 0, due: 0, reviewed_today: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

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
            const items = getReviewItems();
            const item = items.find((i) => i.item_id === serverItem.item.id);
            if (item) {
              item.ease_factor = ease_factor;
              item.interval = interval;
              item.next_review = next_review;
              // 保持本地的复习次数和笔记
              saveReviewItems(items);
            }
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

  function handleKeyDown(e: KeyboardEvent) {
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
          <p className="text-gray-500">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8" onKeyDown={handleKeyDown}>
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 mb-2 block">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold">🧠 间隔复习</h1>
            <p className="text-gray-500 mt-1">基于间隔重复算法巩固记忆</p>
          </div>
          <div className="flex items-center gap-3">
            {syncing && <span className="text-sm text-gray-400">同步中...</span>}
            <ThemeToggle />
          </div>
        </header>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-500">总复习项</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.due}</div>
            <div className="text-xs text-gray-500">待复习</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.reviewed_today}</div>
            <div className="text-xs text-gray-500">今日已复习</div>
          </div>
        </div>

        {dueItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold mb-2">太棒了！</h2>
            <p className="text-gray-500">今天没有待复习的内容了</p>
            <p className="text-sm text-gray-400 mt-2">
              收藏带笔记的内容会自动加入复习队列
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span>{currentIndex + 1} / {dueItems.length}</span>
              <span className="text-xs">键盘: 空格=显示, 0/1=忘记, 2/3=模糊, 4=良好, 5=完美</span>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border mb-6">
              <h2 className="text-lg font-semibold mb-4">{dueItems[currentIndex].title}</h2>

              {/* 复习间隔信息 */}
              {dueItems[currentIndex].next_review && (
                <div className="text-xs text-gray-400 mb-3">
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
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  显示内容 (空格键)
                </button>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap mb-6">
                    {dueItems[currentIndex].content.slice(0, 300)}
                    {dueItems[currentIndex].content.length > 300 ? "..." : ""}
                  </p>

                  {dueItems[currentIndex].notes && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">📝 我的笔记</div>
                      <p className="text-sm">{dueItems[currentIndex].notes}</p>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 mb-4">这次记住了吗？</div>
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => handleReview(0)}
                      className="py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200"
                      title="完全忘记 (0)"
                    >
                      忘记
                    </button>
                    <button
                      onClick={() => handleReview(2)}
                      className="py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200"
                      title="模糊 (2)"
                    >
                      模糊
                    </button>
                    <button
                      onClick={() => handleReview(3)}
                      className="py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200"
                      title="记得 (3)"
                    >
                      记得
                    </button>
                    <button
                      onClick={() => handleReview(4)}
                      className="py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200"
                      title="良好 (4)"
                    >
                      良好
                    </button>
                    <button
                      onClick={() => handleReview(5)}
                      className="py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200"
                      title="完美 (5)"
                    >
                      完美
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        <div className="text-center text-sm text-gray-400">
          <p>提示：在阅读内容时写下笔记，内容会自动加入复习队列</p>
        </div>
      </div>
    </main>
  );
}
