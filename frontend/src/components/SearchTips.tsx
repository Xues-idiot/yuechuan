"use client";

interface SearchTip {
  icon: string;
  title: string;
  description: string;
}

const TIPS: SearchTip[] = [
  {
    icon: "💡",
    title: "使用双引号",
    description: "搜索精确短语时使用双引号，如 \"人工智能\"",
  },
  {
    icon: "🏷️",
    title: "按标签筛选",
    description: "使用 tag:标签名 筛选特定标签的内容",
  },
  {
    icon: "📅",
    title: "按日期筛选",
    description: "使用 date:2024-01 筛选特定时间段的内容",
  },
  {
    icon: "📰",
    title: "按订阅源筛选",
    description: "使用 feed:订阅源名称 筛选特定来源",
  },
];

export default function SearchTips() {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-500">搜索技巧</h4>
      <div className="grid gap-2">
        {TIPS.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span className="text-lg">{tip.icon}</span>
            <div>
              <div className="text-sm font-medium">{tip.title}</div>
              <div className="text-xs text-gray-500">{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
