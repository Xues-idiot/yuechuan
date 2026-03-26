"use client";

import { useState, useEffect } from "react";
import { api, Feed, FeedItem } from "@/lib/api";

interface BatchActionsProps {
  selectedIds: Set<number>;
  feedId: number;
  onComplete: () => void;
  onCancel: () => void;
}

export default function BatchActions({
  selectedIds,
  feedId,
  onComplete,
  onCancel,
}: BatchActionsProps) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<string | null>(null);

  async function handleBatchMarkRead() {
    setLoading(true);
    setAction("markRead");
    try {
      for (const id of selectedIds) {
        await api.updateFeedItem(feedId, id, { is_read: true });
      }
      onComplete();
    } catch (e) {
      alert("批量操作失败");
    } finally {
      setLoading(false);
      setAction(null);
    }
  }

  async function handleBatchMarkStarred(starred: boolean) {
    setLoading(true);
    setAction(starred ? "star" : "unstar");
    try {
      for (const id of selectedIds) {
        await api.updateFeedItem(feedId, id, { is_starred: starred });
      }
      onComplete();
    } catch (e) {
      alert("批量操作失败");
    } finally {
      setLoading(false);
      setAction(null);
    }
  }

  async function handleBatchAddTags() {
    const tags = prompt("请输入标签（用逗号分隔）：");
    if (!tags) return;

    setLoading(true);
    setAction("addTags");
    try {
      for (const id of selectedIds) {
        // 获取现有标签并添加新标签
        const item = await api.getFeedItem(feedId, id);
        const existingTags = item.tags || "";
        const newTags = existingTags
          ? `${existingTags},${tags}`
          : tags;
        await api.updateFeedItem(feedId, id, { tags: newTags });
      }
      onComplete();
    } catch (e) {
      alert("批量操作失败");
    } finally {
      setLoading(false);
      setAction(null);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center gap-4 mb-3">
        <span className="text-sm text-gray-500">已选择 {selectedIds.size} 项</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleBatchMarkRead}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {action === "markRead" ? "处理中..." : "全部标为已读"}
        </button>
        <button
          onClick={() => handleBatchMarkStarred(true)}
          disabled={loading}
          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {action === "star" ? "处理中..." : "批量收藏"}
        </button>
        <button
          onClick={() => handleBatchMarkStarred(false)}
          disabled={loading}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          {action === "unstar" ? "处理中..." : "取消收藏"}
        </button>
        <button
          onClick={handleBatchAddTags}
          disabled={loading}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          {action === "addTags" ? "处理中..." : "添加标签"}
        </button>
      </div>
    </div>
  );
}
