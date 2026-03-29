"use client";

import { useState, useEffect } from "react";

interface ParserPreset {
  feed_type: string;
  title_selector: string | null;
  content_selector: string | null;
  author_selector: string | null;
  date_format: string | null;
}

export default function ParserRulesPage() {
  const [presets, setPresets] = useState<Record<string, ParserPreset>>({});
  const [loading, setLoading] = useState(true);
  const [selectedFeed, setSelectedFeed] = useState("zhihu");
  const [testUrl, setTestUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadPresets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPresets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/parser-rules/presets`);
      const data = await res.json();
      setPresets(data);
    } catch (error) {
      console.error("Failed to load presets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPreset = async (feedType: string) => {
    try {
      const res = await fetch(`${API_BASE}/parser-rules/${feedType}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to get preset:", error);
      return null;
    }
  };

  const testRule = async () => {
    if (!testUrl.trim()) return;

    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${API_BASE}/parser-rules/test?feed_url=${encodeURIComponent(testUrl)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presets[selectedFeed])
      });
      const data = await res.json();
      setTestResult(data);
    } catch (error) {
      console.error("Failed to test rule:", error);
    } finally {
      setTesting(false);
    }
  };

  const selectedPreset = presets[selectedFeed];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔧 解析规则</h1>
          <p className="text-gray-600 dark:text-gray-400">
            自定义 RSS 解析规则，优化内容提取
          </p>
        </header>

        {/* Preset Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">📋 预设规则</h2>
          {loading ? (
            <div className="animate-pulse">加载中...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setSelectedFeed(key)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedFeed === key
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium capitalize">{key}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {preset.title_selector || "无标题选择器"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rule Details */}
        {selectedPreset && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="font-semibold mb-4">规则详情: {selectedFeed}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">标题选择器</label>
                <code className="block p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  {selectedPreset.title_selector || "(未设置)"}
                </code>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">内容选择器</label>
                <code className="block p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  {selectedPreset.content_selector || "(未设置)"}
                </code>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">作者选择器</label>
                <code className="block p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  {selectedPreset.author_selector || "(未设置)"}
                </code>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">日期格式</label>
                <code className="block p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  {selectedPreset.date_format || "(未设置)"}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Test Rule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">🧪 测试规则</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="输入 Feed URL 进行测试"
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
            <button
              onClick={testRule}
              disabled={testing || !testUrl.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {testing ? "测试中..." : "测试"}
            </button>
          </div>

          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium mb-2">测试结果:</div>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ 提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• CSS 选择器用于定位页面元素</li>
            <li>• 标题选择器应选中文章标题元素</li>
            <li>• 内容选择器应选中文章正文元素</li>
            <li>• 测试功能会实际抓取页面验证规则</li>
          </ul>
        </div>
      </div>
    </main>
  );
}