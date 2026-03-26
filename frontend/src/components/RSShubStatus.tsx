"use client";

import { useState, useEffect } from "react";

export default function RSShubStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const rsshubUrl = localStorage.getItem("rsshub_url") || "https://rsshub.app";
    setUrl(rsshubUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let isMounted = true;

    async function checkStatus() {
      setStatus("checking");
      const start = Date.now();

      try {
        const response = await fetch(`${rsshubUrl}/`, {
          method: "HEAD",
          signal: controller.signal,
        });

        if (!isMounted) return;

        clearTimeout(timeout);

        if (response.ok) {
          setStatus("online");
          setLatency(Date.now() - start);
        } else {
          setStatus("offline");
        }
      } catch {
        if (!isMounted) return;
        setStatus("offline");
      }
    }

    checkStatus();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  function checkStatus(rsshubUrl: string) {
    // Legacy function kept for manual checks
    setStatus("checking");
    const start = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch(`${rsshubUrl}/`, {
      method: "HEAD",
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeout);
        if (response.ok) {
          setStatus("online");
          setLatency(Date.now() - start);
        } else {
          setStatus("offline");
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        setStatus("offline");
      });
  }

  function handleCheck() {
    if (url) {
      checkStatus(url);
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">🌐 RSSHub 状态</h3>
        <button
          onClick={handleCheck}
          className="text-sm text-blue-600 hover:underline"
        >
          检测
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              status === "online"
                ? "bg-green-500"
                : status === "offline"
                ? "bg-red-500"
                : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-sm">
            {status === "online"
              ? "在线"
              : status === "offline"
              ? "离线"
              : "检测中..."}
          </span>
          {latency !== null && status === "online" && (
            <span className="text-xs text-gray-500">({latency}ms)</span>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://rsshub.app"
            className="flex-1 px-3 py-1 text-sm border rounded dark:bg-gray-700"
          />
          <button
            onClick={() => {
              localStorage.setItem("rsshub_url", url);
            }}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            保存
          </button>
        </div>

        {status === "offline" && (
          <p className="text-xs text-red-500">
            RSSHub 不可用，请检查地址或部署自己的 RSSHub 实例
          </p>
        )}
      </div>
    </div>
  );
}
