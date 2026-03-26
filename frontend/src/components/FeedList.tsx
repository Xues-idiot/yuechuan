"use client";

import { useState } from "react";
import FeedCard from "./FeedCard";
import EmptyState from "./EmptyState";

interface FeedListProps {
  feeds: any[];
  onFeedClick?: (feed: any) => void;
  onRefreshFeed?: (feedId: number) => void;
  selectedFeedId?: number;
}

export default function FeedList({
  feeds,
  onFeedClick,
  onRefreshFeed,
  selectedFeedId,
}: FeedListProps) {
  const [refreshingId, setRefreshingId] = useState<number | null>(null);

  const handleRefresh = async (feedId: number) => {
    setRefreshingId(feedId);
    try {
      await onRefreshFeed?.(feedId);
    } finally {
      setRefreshingId(null);
    }
  };

  if (feeds.length === 0) {
    return <EmptyState type="feeds" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feeds.map((feed) => (
        <FeedCard
          key={feed.id}
          feed={feed}
          onClick={() => onFeedClick?.(feed)}
          onRefresh={() => handleRefresh(feed.id)}
          isRefreshing={refreshingId === feed.id}
          isSelected={selectedFeedId === feed.id}
        />
      ))}
    </div>
  );
}
