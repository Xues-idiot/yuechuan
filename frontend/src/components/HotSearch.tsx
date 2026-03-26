"use client";

import { useState, useEffect } from "react";

interface HotSearchItem {
  keyword: string;
 热度: number;
  search_count?: number;
}

interface HotSearchProps {
  onSelect: (keyword: string) => void;
}

export default function HotSearch({ onSelect }: HotSearchProps) {
  const [hotList, setHotList] = useState<HotSearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟热搜数据
    const mockHotSearch: HotSearchItem[] = [
      { keyword: "ChatGPT", 热度: 9856 },
      { keyword: "AI", 热度: 8700 },
      { keyword: "React", 热度: 7650 },
      { keyword: "TypeScript", 热度: 6540 },
      { keyword: "Next.js", 热度: 5430 },
      { keyword: "Tailwind CSS", 热度: 4320 },
      { keyword: "Web3", 热度: 3210 },
      { keyword: "元宇宙", 热度: 2100 },
    ];

    // 实际项目中应该从API获取
    setHotList(mockHotSearch);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-500">热门搜索</span>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getColor = (index: number) => {
    if (index === 0) return "text-orange-500";
    if (index === 1) return "text-gray-500";
    if (index === 2) return "text-amber-600";
    return "text-gray-400";
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-gray-500">热门搜索</span>

      <div className="space-y-2">
        {hotList.slice(0, 10).map((item, index) => (
          <button
            key={item.keyword}
            onClick={() => onSelect(item.keyword)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className={`w-6 text-center text-sm ${getColor(index)}`}>
              {getIcon(index)}
            </span>
            <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">
              {item.keyword}
            </span>
            <span className="text-xs text-gray-400">
              {item.search_count || item.热度}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
