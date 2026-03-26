"use client";

import { useState, useEffect, useMemo } from "react";

interface TagSuggestProps {
  content: string;
  existingTags?: string[];
  onSuggest?: (tags: string[]) => void;
}

const COMMON_TAGS = [
  "科技", "产品", "创业", "投资", "AI", "机器学习", "产品经理",
  "商业", "财经", "心理学", "效率", "自我提升", "编程", "前端",
  "后端", "架构", "设计", "用户体验", "增长", "运营", "市场",
];

const PATTERN_TAGS: Record<string, string> = {
  "GPT|ChatGPT|大模型|LLM": "AI",
  "React|Vue|Angular|前端": "前端",
  "Python|JavaScript|Go|Rust": "编程",
  "创业|融资|VC|投资": "创业",
  "产品|需求|功能|迭代": "产品",
  "用户|体验|UI|UX|设计": "设计",
  "增长|运营|推广|获客": "增长",
};

export default function TagSuggest({ content, existingTags = [], onSuggest }: TagSuggestProps) {
  const [suggested, setSuggested] = useState<string[]>([]);

  useEffect(() => {
    if (!content) return;

    const found = new Set<string>();

    // 基于模式匹配
    Object.entries(PATTERN_TAGS).forEach(([pattern, tag]) => {
      if (new RegExp(pattern, "i").test(content)) {
        found.add(tag);
      }
    });

    // 基于词频分析（简单版本）
    const words = content.toLowerCase();
    COMMON_TAGS.forEach((tag) => {
      if (words.includes(tag.toLowerCase()) && !existingTags.includes(tag)) {
        found.add(tag);
      }
    });

    const suggestions = Array.from(found).slice(0, 5);
    setSuggested(suggestions);
    onSuggest?.(suggestions);
  }, [content, existingTags]);

  if (suggested.length === 0) return null;

  return (
    <div className="mt-2">
      <span className="text-xs text-gray-500 mr-2">推荐标签:</span>
      {suggested.map((tag) => (
        <button
          key={tag}
          onClick={() => {
            // 添加标签到输入框
            const event = new CustomEvent("addTag", { detail: tag });
            window.dispatchEvent(event);
          }}
          className="inline-block px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 mr-1"
        >
          + {tag}
        </button>
      ))}
    </div>
  );
}
