"use client";

import { useState } from "react";

interface ShareCardProps {
  title: string;
  description?: string;
  url: string;
}

export default function ShareCard({ title, description, url }: ShareCardProps) {
  const [showPanel, setShowPanel] = useState(false);

  const shareOptions = [
    {
      name: "微信",
      icon: "💬",
      color: "bg-green-500",
      action: () => {
        // 微信分享需要使用微信开放标签，实际实现需要后端支持
        alert("请截图分享到微信");
      },
    },
    {
      name: "微博",
      icon: "🔴",
      color: "bg-red-500",
      action: () => {
        window.open(
          `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: "🐦",
      color: "bg-blue-400",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
    {
      name: "复制链接",
      icon: "🔗",
      color: "bg-gray-500",
      action: () => {
        navigator.clipboard.writeText(url);
        alert("链接已复制");
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        分享
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium truncate">{title}</p>
            {description && (
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="p-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => {
                  option.action();
                  setShowPanel(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
