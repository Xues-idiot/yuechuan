"use client";

import { useState } from "react";
import AdvancedSearch from "@/components/AdvancedSearch";

export default function AdvancedPage() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">高级功能</h1>
          <p className="text-gray-600 dark:text-gray-400">
            增强的阅读体验和搜索
          </p>
        </header>

        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "search"
                ? "border-blue-500 text-blue-500"
                : "border-transparent"
            }`}
          >
            高级搜索
          </button>
          <button
            onClick={() => setActiveTab("reading")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "reading"
                ? "border-blue-500 text-blue-500"
                : "border-transparent"
            }`}
          >
            阅读模式
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "batch"
                ? "border-blue-500 text-blue-500"
                : "border-transparent"
            }`}
          >
            批量操作
          </button>
        </div>

        {activeTab === "search" && <AdvancedSearch />}
        {activeTab === "reading" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">阅读模式设置</h3>
            <p className="text-gray-500">配置您的阅读体验</p>
          </div>
        )}
        {activeTab === "batch" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">批量操作</h3>
            <p className="text-gray-500">
              选择多个项目执行批量操作
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
