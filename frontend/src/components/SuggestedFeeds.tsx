"use client";

interface SuggestedFeed {
  name: string;
  url: string;
  description: string;
  category: string;
  reason: string;
}

const SUGGESTED_FEEDS: SuggestedFeed[] = [
  {
    name: "AI 科技",
    url: "tech",
    description: "最新的人工智能和科技资讯",
    category: "科技",
    reason: "基于你的阅读偏好推荐",
  },
  {
    name: "产品设计",
    url: "design",
    description: "产品设计和用户体验相关",
    category: "设计",
    reason: "热门订阅源",
  },
  {
    name: "编程开发",
    url: "dev",
    description: "编程技巧和开发教程",
    category: "技术",
    reason: "与你收藏的内容相关",
  },
];

export default function SuggestedFeeds() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">为你推荐</h3>
        <button className="text-sm text-blue-600 hover:underline">
          查看更多
        </button>
      </div>

      <div className="space-y-3">
        {SUGGESTED_FEEDS.map((feed) => (
          <div
            key={feed.url}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{feed.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{feed.description}</p>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                + 订阅
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                {feed.category}
              </span>
              <span className="text-xs text-gray-400">{feed.reason}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
