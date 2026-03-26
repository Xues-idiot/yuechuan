"use client";

interface ContentMetadataProps {
  author?: string;
  publishedAt?: string;
  feedName?: string;
  readTime?: number;
  className?: string;
}

export default function ContentMetadata({
  author,
  publishedAt,
  feedName,
  readTime,
  className = "",
}: ContentMetadataProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 text-sm text-gray-500 ${className}`}>
      {author && (
        <span className="flex items-center gap-1">
          <span>👤</span>
          <span>{author}</span>
        </span>
      )}

      {publishedAt && (
        <span className="flex items-center gap-1">
          <span>📅</span>
          <span>{formatDate(publishedAt)}</span>
        </span>
      )}

      {feedName && (
        <span className="flex items-center gap-1">
          <span>📡</span>
          <span>{feedName}</span>
        </span>
      )}

      {readTime && readTime > 0 && (
        <span className="flex items-center gap-1">
          <span>⏱️</span>
          <span>{readTime} 分钟</span>
        </span>
      )}
    </div>
  );
}
