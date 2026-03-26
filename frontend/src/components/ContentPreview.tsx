"use client";

import { useState } from "react";

interface ContentPreviewProps {
  content: string;
  maxLength?: number;
  showFull?: boolean;
}

export default function ContentPreview({
  content,
  maxLength = 200,
  showFull: initialShowFull = false,
}: ContentPreviewProps) {
  const [showFull, setShowFull] = useState(initialShowFull);

  if (!content) return null;

  const plainText = content.replace(/<[^>]+>/g, "");
  const needsTruncation = plainText.length > maxLength;

  return (
    <div className="relative">
      <div
        className={`prose dark:prose-invert max-w-none text-sm ${
          !showFull && needsTruncation ? "line-clamp-3" : ""
        }`}
      >
        {plainText}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-blue-600 hover:underline text-sm mt-1"
        >
          {showFull ? "收起" : "展开全部"}
        </button>
      )}
    </div>
  );
}
