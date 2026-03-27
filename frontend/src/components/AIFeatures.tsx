"use client";

import { useState, useEffect, useRef } from "react";

interface AIFeaturesProps {
  content: string;
  itemId: number;
}

export default function AIFeatures({ content, itemId }: AIFeaturesProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<"summary" | "translate" | "keypoints" | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleAction(action: "summary" | "translate" | "keypoints") {
    setLoading(true);
    setMode(action);
    setShowPanel(true);

    // 模拟 AI 处理
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (action === "summary") {
      setResult("这是内容的摘要：文章主要讨论了产品设计和用户体验的重要性...");
    } else if (action === "translate") {
      setResult("This is the English translation of the content...");
    } else if (action === "keypoints") {
      setResult("• 要点1: 产品设计需要考虑用户需求\n• 要点2: 用户体验是核心\n• 要点3: 持续迭代优化");
    }

    setLoading(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        🤖 AI 助手
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">AI 助手</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleAction("summary")}
                className="flex-1 px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded hover:bg-blue-100"
              >
                摘要
              </button>
              <button
                onClick={() => handleAction("translate")}
                className="flex-1 px-3 py-1 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded hover:bg-purple-100"
              >
                翻译
              </button>
              <button
                onClick={() => handleAction("keypoints")}
                className="flex-1 px-3 py-1 text-sm bg-green-50 dark:bg-green-900/30 text-green-600 rounded hover:bg-green-100"
              >
                要点
              </button>
            </div>
          </div>

          <div className="p-4 max-h-64 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                <span className="ml-2 text-sm text-gray-500">
                  AI 处理中...
                </span>
              </div>
            ) : result ? (
              <div className="text-sm whitespace-pre-wrap">{result}</div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                选择上方按钮开始处理
              </p>
            )}
          </div>

          {result && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert("已复制");
                }}
                className="w-full py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                复制结果
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
