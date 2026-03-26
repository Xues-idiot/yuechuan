"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  hasMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
}

export default function InfiniteScroll({
  children,
  hasMore,
  onLoadMore,
  loading,
  loader,
  endMessage,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div>
      {children}

      <div ref={observerRef} className="py-4">
        {loading && (
          loader || (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )
        )}

        {!hasMore && !loading && endMessage && (
          <div className="text-center text-gray-500 py-4">{endMessage}</div>
        )}
      </div>
    </div>
  );
}
