"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  icon?: string;
}

export default function CopyButton({ text, className = "", icon }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      } ${className}`}
    >
      <span>{copied ? "已复制" : icon || "复制"}</span>
    </button>
  );
}
