"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const QUICK_ADD_TEMPLATES = [
  {
    platform: "wechat",
    name: "科技爱好者",
    url: "techlover",
    description: "科技资讯",
  },
  {
    platform: "bilibili",
    name: "AI前沿",
    url: "bilibili-ai",
    description: "B站AIUP主",
  },
  {
    platform: "zhihu",
    name: "产品经理",
    url: "zhihu",
    description: "知乎产品经理",
  },
];

export default function QuickImport() {
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);

  async function handleQuickAdd(template: (typeof QUICK_ADD_TEMPLATES)[0]) {
    setAdding(template.url);
    try {
      await api.createFeed({
        name: template.name,
        url: template.url,
        feed_type: template.platform,
      });
      setAdded([...added, template.url]);
    } catch (e) {
      alert(`添加 ${template.name} 失败`);
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 className="font-semibold mb-3">⚡ 快速添加</h3>
      <p className="text-sm text-gray-500 mb-3">
        一键添加热门订阅源
      </p>
      <div className="space-y-2">
        {QUICK_ADD_TEMPLATES.map((template) => (
          <button
            key={template.url}
            onClick={() => handleQuickAdd(template)}
            disabled={adding !== null || added.includes(template.url)}
            className={`w-full flex items-center justify-between p-2 rounded border ${
              added.includes(template.url)
                ? "bg-green-50 border-green-200"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="text-left">
              <p className="text-sm font-medium">{template.name}</p>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>
            <div>
              {added.includes(template.url) ? (
                <span className="text-green-500">✓ 已添加</span>
              ) : (
                <span className="text-blue-500">
                  {adding === template.url ? "添加中..." : "+ 添加"}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
