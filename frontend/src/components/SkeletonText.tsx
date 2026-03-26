"use client";

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
}

export default function SkeletonText({
  lines = 3,
  lastLineWidth = "80%",
}: SkeletonTextProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? lastLineWidth : "100%",
          }}
        />
      ))}
    </div>
  );
}
