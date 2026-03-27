"use client";

import { useState } from "react";

export default function PocketIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [lastSync, setLastSync] = useState<string | null>(null);

  const connectPocket = async () => {
    if (!apiKey.trim()) {
      alert("请输入 Pocket API Key");
      return;
    }
    // 模拟连接
    setConnected(true);
    setLastSync(new Date().toLocaleString());
  };

  const disconnectPocket = () => {
    setConnected(false);
    setApiKey("");
    setLastSync(null);
  };

  const syncNow = async () => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSync(new Date().toLocaleString());
    setSyncing(false);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📦 Pocket 集成</h1>
          <p className="text-gray-600 dark:text-gray-400">
            与 Pocket/Instapaper 同步阅读列表
          </p>
        </header>

        {/* Connection Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          connected
            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        }`}>
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`}></span>
            <span className="font-medium">
              {connected ? "✓ 已连接到 Pocket" : "未连接"}
            </span>
          </div>
          {lastSync && (
            <div className="text-sm text-gray-500 mt-2">
              上次同步: {lastSync}
            </div>
          )}
        </div>

        {/* Connect/Disconnect */}
        {!connected ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="font-semibold mb-4">连接 Pocket</h2>
            <p className="text-sm text-gray-500 mb-4">
              输入你的 Pocket Consumer Key 来连接账户。你可以在{" "}
              <a href="https://getpocket.com/developer/apps/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Pocket 开发者平台
              </a>{" "}
              创建应用获取 API Key。
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Consumer Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入你的 Pocket Consumer Key"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>
              <button
                onClick={connectPocket}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                连接 Pocket
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-semibold mb-4">同步设置</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>自动同步已读文章</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>同步收藏文章</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>同步标签</span>
                  <input type="checkbox" className="w-5 h-5 rounded text-blue-500" />
                </label>
              </div>
            </div>

            <button
              onClick={syncNow}
              disabled={syncing}
              className="w-full py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {syncing ? "同步中..." : "立即同步"}
            </button>

            <button
              onClick={disconnectPocket}
              className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              断开连接
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 关于 Pocket 集成</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Pocket 是一个稍后阅读服务</li>
            <li>• 连接后可以将在阅川收藏的文章同步到 Pocket</li>
            <li>• 也可以从 Pocket 导入文章到阅川</li>
            <li>• Instapaper 使用相同的 API</li>
          </ul>
        </div>
      </div>
    </main>
  );
}