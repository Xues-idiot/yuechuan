"use client";

import { useState, useEffect } from "react";

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ShareItem {
  title: string;
  url: string;
  content?: string;
}

export default function SharePage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadPlatforms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlatforms = async () => {
    try {
      const res = await fetch(`${API_BASE}/social/platforms`);
      const data = await res.json();
      setPlatforms(data);
    } catch (error) {
      // 使用默认平台
      setPlatforms([
        { id: "twitter", name: "Twitter", icon: "🐦", color: "#1DA1F2" },
        { id: "weibo", name: "Weibo", icon: "🔴", color: "#E6162D" },
        { id: "telegram", name: "Telegram", icon: "✈️", color: "#0088CC" },
        { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "#25D366" },
        { id: "reddit", name: "Reddit", icon: "🤖", color: "#FF4500" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platformId: string) => {
    const title = customTitle || "分享文章";
    const url = customUrl || window.location.href;

    const data = {
      title,
      content: "",
      url
    };

    try {
      if (platformId === "copy") {
        await navigator.clipboard.writeText(`${title}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      const res = await fetch(`${API_BASE}/social/prepare/${platformId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.url) {
        window.open(result.url, "_blank", "width=600,height=400");
      } else if (result.text) {
        await navigator.clipboard.writeText(result.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // fallback: 直接用 URL 打开分享
      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      };

      if (shareUrls[platformId]) {
        window.open(shareUrls[platformId], "_blank", "width=600,height=400");
      }
    }
  };

  const shareViaWebShare = async () => {
    if (!navigator.share) {
      alert("您的浏览器不支持 Web Share API");
      return;
    }

    try {
      await navigator.share({
        title: customTitle || "分享文章",
        text: "来自阅川",
        url: customUrl || window.location.href
      });
    } catch (error) {
      // 用户取消分享
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📤 分享文章</h1>
          <p className="text-gray-600 dark:text-gray-400">
            将精彩内容分享到社交平台
          </p>
        </header>

        {/* 分享内容输入 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">分享内容</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                文章标题
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="输入文章标题"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                文章链接
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        </div>

        {/* 分享平台 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">分享到</h2>

          {loading ? (
            <div className="animate-pulse flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-3xl">{platform.icon}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{platform.name}</span>
                </button>
              ))}

              {/* 复制链接 */}
              <button
                onClick={() => handleShare("copy")}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-3xl">{copied ? "✅" : "📋"}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{copied ? "已复制!" : "复制链接"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Web Share API */}
        {"share" in navigator && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4">系统分享</h2>
            <button
              onClick={shareViaWebShare}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              📱 使用系统分享菜单
            </button>
            <p className="text-xs text-gray-500 mt-2">
              使用设备原生的分享功能，可以分享到更多应用
            </p>
          </div>
        )}

        {/* 提示 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">💡 提示</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 可以直接粘贴文章标题和链接进行分享</li>
            <li>• Twitter 最大支持 280 字符</li>
            <li>• 复制链接后可以在任何地方粘贴分享</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
