"use client";

// Skeleton component with design system integration
export default function Skeleton({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton rounded"
      style={{
        width,
        height,
        backgroundColor: 'var(--surface-secondary)',
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonLine({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton rounded"
      style={{
        width,
        height,
        backgroundColor: 'var(--surface-secondary)',
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      className="p-4 rounded-lg border card"
      role="status"
      aria-label="加载中"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--surface-primary)',
      }}
    >
      <SkeletonLine width="70%" height="1.25rem" />
      <div className="mt-3 space-y-2">
        <SkeletonLine width="100%" height="0.875rem" />
        <SkeletonLine width="90%" height="0.875rem" />
      </div>
      <div className="mt-3 flex gap-2">
        <SkeletonLine width="4rem" height="1.5rem" />
        <SkeletonLine width="4rem" height="1.5rem" />
      </div>
      <span className="sr-only">加载中...</span>
    </div>
  );
}

export function SkeletonFeedItem() {
  return (
    <div
      className="flex gap-4 p-4 rounded-lg border card"
      role="status"
      aria-label="加载中"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--surface-primary)',
      }}
    >
      <SkeletonLine width="5rem" height="5rem" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="80%" height="1.25rem" />
        <SkeletonLine width="60%" height="0.875rem" />
        <SkeletonLine width="40%" height="0.75rem" />
      </div>
      <span className="sr-only">加载中...</span>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto space-y-4">
        <SkeletonLine width="60%" height="2rem" />
        <SkeletonFeedItem />
        <SkeletonFeedItem />
        <SkeletonFeedItem />
        <SkeletonFeedItem />
      </div>
    </main>
  );
}
