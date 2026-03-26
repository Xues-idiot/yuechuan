"use client";

import { useCallback, useEffect, useRef } from "react";
import { api } from "./api";

interface ReadingProgress {
  item_id: number;
  position: number;
  scroll_position?: number;
  completed: boolean;
}

interface UseProgressSyncOptions {
  itemId: number;
  onProgressLoad?: (progress: ReadingProgress) => void;
  debounceMs?: number;
}

/**
 * 阅读进度同步 Hook
 * 自动保存阅读进度到服务器
 */
export function useProgressSync({ itemId, onProgressLoad, debounceMs = 1000 }: UseProgressSyncOptions) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<ReadingProgress | null>(null);

  // 加载进度
  useEffect(() => {
    if (!itemId) return;

    api.getReadingPosition(itemId).then((data) => {
      lastSavedRef.current = {
        item_id: itemId,
        position: data.position,
        scroll_position: data.scroll_position,
        completed: data.completed,
      };
      onProgressLoad?.(lastSavedRef.current);
    }).catch(() => {
      // 忽略错误，使用默认进度
    });
  }, [itemId, onProgressLoad]);

  // 保存进度（防抖）
  const saveProgress = useCallback(
    (progress: Omit<ReadingProgress, "item_id">) => {
      const newProgress: ReadingProgress = {
        item_id: itemId,
        ...progress,
      };

      // 检查是否真的有变化
      if (
        lastSavedRef.current &&
        lastSavedRef.current.position === newProgress.position &&
        lastSavedRef.current.scroll_position === newProgress.scroll_position &&
        lastSavedRef.current.completed === newProgress.completed
      ) {
        return;
      }

      // 清除之前的定时器
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // 设置新的定时器
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await api.syncProgress([newProgress]);
          lastSavedRef.current = newProgress;
        } catch (e) {
          console.error("Failed to sync progress:", e);
        }
      }, debounceMs);
    },
    [itemId, debounceMs]
  );

  // 更新阅读位置
  const updatePosition = useCallback(
    (position: number, scrollPosition?: number) => {
      saveProgress({ position, scroll_position: scrollPosition, completed: position >= 95 });
    },
    [saveProgress]
  );

  // 标记完成
  const markCompleted = useCallback(async () => {
    // 清除待处理的保存
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    try {
      await api.markAsCompleted(itemId);
      lastSavedRef.current = {
        item_id: itemId,
        position: 100,
        scroll_position: undefined,
        completed: true,
      };
    } catch (e) {
      console.error("Failed to mark completed:", e);
    }
  }, [itemId]);

  // 清理
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    updatePosition,
    markCompleted,
    lastSaved: lastSavedRef.current,
  };
}

/**
 * 全局阅读进度管理器
 * 用于批量同步和冲突处理
 */
class ProgressSyncManager {
  private queue: Map<number, ReadingProgress> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(progress: Map<number, ReadingProgress>) => void> = new Set();

  startAutoSync(intervalMs = 5000) {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.flush();
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async flush() {
    if (this.queue.size === 0) return;

    const toSync = Array.from(this.queue.values());
    this.queue.clear();

    try {
      await api.syncProgress(toSync);
    } catch (e) {
      // 失败时放回队列
      toSync.forEach((p) => this.queue.set(p.item_id, p));
      console.error("Failed to sync progress:", e);
    }
  }

  update(progress: ReadingProgress) {
    this.queue.set(progress.item_id, progress);
  }

  subscribe(listener: (progress: Map<number, ReadingProgress>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const progressSyncManager = new ProgressSyncManager();
