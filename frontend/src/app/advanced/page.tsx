"use client";

import { useState } from "react";
import AdvancedSearch from "@/components/AdvancedSearch";

export default function AdvancedPage() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Advanced Features</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enhanced reading experience and search
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
            Advanced Search
          </button>
          <button
            onClick={() => setActiveTab("reading")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "reading"
                ? "border-blue-500 text-blue-500"
                : "border-transparent"
            }`}
          >
            Reading Mode
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "batch"
                ? "border-blue-500 text-blue-500"
                : "border-transparent"
            }`}
          >
            Batch Operations
          </button>
        </div>

        {activeTab === "search" && <AdvancedSearch />}
        {activeTab === "reading" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Reading Mode Settings</h3>
            <p className="text-gray-500">Configure your reading experience</p>
          </div>
        )}
        {activeTab === "batch" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Batch Operations</h3>
            <p className="text-gray-500">
              Select multiple items to perform batch operations
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
