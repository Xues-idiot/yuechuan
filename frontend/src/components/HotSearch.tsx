"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

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
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>热门搜索</span>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-6 rounded animate-pulse"
              style={{ backgroundColor: 'var(--surface-secondary)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return 'var(--color-warning)'; // gold
    if (index === 1) return '#9CA3AF'; // silver
    if (index === 2) return '#B87333'; // bronze
    return null;
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>热门搜索</span>

      <div className="space-y-2">
        {hotList.slice(0, 10).map((item, index) => (
          <button
            key={item.keyword}
            onClick={() => onSelect(item.keyword)}
            className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span
              className="w-6 text-center text-sm font-medium"
              style={{
                color: getMedalColor(index) || 'var(--text-tertiary)'
              }}
            >
              {index < 3 ? (
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                `#${index + 1}`
              )}
            </span>
            <span className="flex-1 text-left text-sm" style={{ color: 'var(--text-primary)' }}>
              {item.keyword}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {item.search_count || item.热度}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}