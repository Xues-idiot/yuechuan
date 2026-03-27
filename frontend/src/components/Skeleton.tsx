// 默认导出使用 SkeletonLine
export default function Skeleton({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
      style={{ width, height }}
    />
  );
}

export function SkeletonLine({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <SkeletonLine width="70%" height="1.25rem" />
      <div className="mt-3 space-y-2">
        <SkeletonLine width="100%" height="0.875rem" />
        <SkeletonLine width="90%" height="0.875rem" />
      </div>
      <div className="mt-3 flex gap-2">
        <SkeletonLine width="4rem" height="1.5rem" />
        <SkeletonLine width="4rem" height="1.5rem" />
      </div>
    </div>
  );
}

export function SkeletonFeedItem() {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <SkeletonLine width="5rem" height="5rem" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="80%" height="1.25rem" />
        <SkeletonLine width="60%" height="0.875rem" />
        <SkeletonLine width="40%" height="0.75rem" />
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <main className="min-h-screen p-8">
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
