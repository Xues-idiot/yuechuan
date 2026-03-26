"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import CopyButton from "./CopyButton";

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareMenu({ isOpen, onClose, title, url }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "微信",
      icon: "💬",
      url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`,
    },
    {
      name: "邮件",
      icon: "✉️",
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分享" size="sm">
      <div className="space-y-4">
        {/* 复制链接 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border rounded-lg"
          />
          <CopyButton text={url} icon={copied ? "✓" : "📋"} />
        </div>

        {/* 原生分享按钮 */}
        {"share" in navigator && (
          <Button
            variant="primary"
            onClick={handleNativeShare}
            className="w-full"
            icon="📤"
          >
            使用应用分享
          </Button>
        )}

        {/* 社交媒体链接 */}
        <div className="grid grid-cols-4 gap-2">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}
