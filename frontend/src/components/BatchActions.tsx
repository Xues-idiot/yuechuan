"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { CheckCircle, Star, StarOff, Tag, X, Loader2 } from "lucide-react";

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

  const buttonClass = "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-all disabled:opacity-50";

  return (
    <div
      className="fixed bottom-6 right-6 rounded-[var(--radius-lg)] p-4 z-[var(--z-fixed)]"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xl)',
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          已选择 <span style={{ color: 'var(--color-primary)' }}>{selectedIds.size}</span> 项
        </span>
        <button
          onClick={onCancel}
          className="p-1 rounded-[var(--radius-sm)] transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleBatchMarkRead}
          disabled={loading}
          className={`${buttonClass} text-white`}
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {action === "markRead" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {action === "markRead" ? "处理中..." : "全部标为已读"}
        </button>

        <button
          onClick={() => handleBatchMarkStarred(true)}
          disabled={loading}
          className={`${buttonClass} text-white`}
          style={{ backgroundColor: 'var(--color-warning)' }}
        >
          {action === "star" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Star className="w-4 h-4" />
          )}
          {action === "star" ? "处理中..." : "批量收藏"}
        </button>

        <button
          onClick={() => handleBatchMarkStarred(false)}
          disabled={loading}
          className={`${buttonClass}`}
          style={{
            backgroundColor: 'var(--surface-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {action === "unstar" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <StarOff className="w-4 h-4" />
          )}
          {action === "unstar" ? "处理中..." : "取消收藏"}
        </button>

        <button
          onClick={handleBatchAddTags}
          disabled={loading}
          className={`${buttonClass}`}
          style={{
            backgroundColor: 'var(--surface-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {action === "addTags" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Tag className="w-4 h-4" />
          )}
          {action === "addTags" ? "处理中..." : "添加标签"}
        </button>
      </div>
    </div>
  );
}
