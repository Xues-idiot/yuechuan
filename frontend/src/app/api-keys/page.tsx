"use client";

import { useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKey, setShowKey] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const createKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName })
      });
      const data = await res.json();

      if (data.key) {
        setKeys([...keys, data]);
        setNewKeyName("");
      }
    } catch (error) {
      console.error("Failed to create key:", error);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("确定要删除这个 API Key 吗？")) return;

    try {
      await fetch(`${API_BASE}/api-keys/${id}`, { method: "DELETE" });
      setKeys(keys.filter(k => k.id !== id));
    } catch (error) {
      console.error("Failed to delete key:", error);
    }
  };

  const maskKey = (key: string) => {
    if (key.length < 8) return "***";
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "从未使用";
    return new Date(dateStr).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔑 API Keys</h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理第三方应用访问密钥
          </p>
        </header>

        {/* Create New Key */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">➕ 创建新密钥</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="给密钥起个名字"
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
            <button
              onClick={createKey}
              disabled={!newKeyName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              创建
            </button>
          </div>
        </div>

        {/* Keys List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">你的密钥</h2>
          </div>

          {keys.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">🔐</p>
              <p>暂无 API Keys</p>
              <p className="text-sm mt-1">创建第一个密钥来启用第三方应用访问</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {keys.map((key) => (
                <div key={key.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{key.name}</span>
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      删除
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <code className="flex-1 font-mono text-sm truncate">
                      {showKey === key.id ? key.key : maskKey(key.key)}
                    </code>
                    <button
                      onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      {showKey === key.id ? "隐藏" : "显示"}
                    </button>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 mt-2">
                    <span>创建于 {formatDate(key.created_at)}</span>
                    <span>上次使用 {formatDate(key.last_used)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ 安全提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 请妥善保管你的 API Key，不要泄露给他人</li>
            <li>• 定期清理不再使用的密钥</li>
            <li>• API Key 只显示一次，忘记后需要重新生成</li>
          </ul>
        </div>
      </div>
    </main>
  );
}