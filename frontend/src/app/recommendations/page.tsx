"use client";

import { useState, useEffect } from "react";

interface FeedRecommendation {
  feed_id: number;
  name: string;
  url: string;
  feed_type: string;
  description: string | null;
  category: string | null;
  reason: string;
  popularity: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<FeedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState<Set<number>>(new Set());

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recommendations/feeds`);
      const data = await res.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (rec: FeedRecommendation, index: number) => {
    setSubscribing(index);
    try {
      const res = await fetch(`${API_BASE}/recommendations/subscribe/${index}`, {
        method: "POST"
      });
      const data = await res.json();

      if (data.success) {
        setSubscribed(new Set([...subscribed, index]));
      } else {
        alert(data.error || "订阅失败");
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
      alert("订阅失败");
    } finally {
      setSubscribing(null);
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "tech": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "programming": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "design": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "product": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const groupedByCategory = recommendations.reduce((acc, rec) => {
    const cat = rec.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rec);
    return acc;
  }, {} as Record<string, FeedRecommendation[]>);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📱 发现订阅源</h1>
              <p className="text-gray-600 dark:text-gray-400">
                基于你的兴趣推荐优质订阅源
              </p>
            </div>
            <button
              onClick={loadRecommendations}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <div className="text-sm text-gray-500">推荐数量</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">{Object.keys(groupedByCategory).length}</div>
            <div className="text-sm text-gray-500">分类数量</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">{subscribed.size}</div>
            <div className="text-sm text-gray-500">已订阅</div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-500">暂无推荐</p>
            <p className="text-sm text-gray-400 mt-1">可能是已经订阅了所有推荐源</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByCategory).map(([category, feeds]) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold capitalize flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                    <span className="text-sm text-gray-500 font-normal">{feeds.length} 个推荐</span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {feeds.map((feed, idx) => {
                    const globalIdx = recommendations.indexOf(feed);
                    const isSubscribed = subscribed.has(globalIdx);

                    return (
                      <div key={feed.url} className="p-4 flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{feed.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(feed.category)}`}>
                              {feed.feed_type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{feed.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>💡 {feed.reason}</span>
                            <span>🔥 {feed.popularity}% 热度</span>
                          </div>
                        </div>
                        <button
                          onClick={() => subscribe(feed, globalIdx)}
                          disabled={subscribing === globalIdx || isSubscribed}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isSubscribed
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 cursor-default"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          } disabled:opacity-50`}
                        >
                          {subscribing === globalIdx ? "订阅中..." : isSubscribed ? "✓ 已订阅" : "订阅"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 点击订阅按钮可快速添加推荐订阅源</li>
            <li>• 推荐基于你当前的阅读偏好</li>
            <li>• 多样化订阅有助于拓展知识面</li>
          </ul>
        </div>
      </div>
    </main>
  );
}