// 间隔重复复习算法 (SM-2 算法简化版)
export interface ReviewItem {
  id: number;
  item_id: number;
  title: string;
  content: string;
  notes?: string;       // 用户笔记（可选）
  ease_factor: number;  // 难度因子
  interval: number;     // 复习间隔(天)
  repetitions: number;  // 复习次数
  next_review: string;   // 下次复习时间 (ISO date)
  last_review: string;   // 上次复习时间 (ISO date)
}

const STORAGE_KEY = "spaced_repetition";

export function getReviewItems(): ReviewItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveReviewItems(items: ReviewItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToReviewQueue(
  itemId: number,
  title: string,
  content: string,
  notes?: string
): ReviewItem {
  const items = getReviewItems();

  // 检查是否已经在队列中
  const existing = items.find((i) => i.item_id === itemId);
  if (existing) {
    // 如果提供了新笔记，更新它
    if (notes !== undefined) {
      existing.notes = notes;
      saveReviewItems(items);
    }
    return existing;
  }

  const newItem: ReviewItem = {
    id: Date.now(),
    item_id: itemId,
    title,
    content,
    notes,
    ease_factor: 2.5,
    interval: 1,
    repetitions: 0,
    next_review: new Date().toISOString(),
    last_review: new Date().toISOString(),
  };

  items.push(newItem);
  saveReviewItems(items);
  return newItem;
}

export function getDueReviews(): ReviewItem[] {
  const items = getReviewItems();
  const now = new Date();
  return items.filter((item) => new Date(item.next_review) <= now);
}

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5;  // 0-5 评分，0=完全忘记，5=完美记住
}

// SM-2 算法实现
export function recordReview(itemId: number, result: ReviewResult): ReviewItem | null {
  const items = getReviewItems();
  const item = items.find((i) => i.item_id === itemId);

  if (!item) return null;

  const { quality } = result;

  if (quality < 3) {
    // 忘记 - 重置
    item.repetitions = 0;
    item.interval = 1;
  } else {
    // 记住 - 增加间隔
    if (item.repetitions === 0) {
      item.interval = 1;
    } else if (item.repetitions === 1) {
      item.interval = 6;
    } else {
      item.interval = Math.round(item.interval * item.ease_factor);
    }
    item.repetitions += 1;
  }

  // 更新难度因子
  item.ease_factor = Math.max(
    1.3,
    item.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // 计算下次复习时间
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + item.interval);
  item.next_review = nextDate.toISOString();
  item.last_review = new Date().toISOString();

  saveReviewItems(items);
  return item;
}

export function removeFromReviewQueue(itemId: number) {
  const items = getReviewItems();
  const filtered = items.filter((i) => i.item_id !== itemId);
  saveReviewItems(filtered);
}

export function getReviewStats() {
  const items = getReviewItems();
  const due = getDueReviews();
  const today = new Date().toISOString().split("T")[0];

  const reviewedToday = items.filter(
    (i) => i.last_review.split("T")[0] === today
  ).length;

  return {
    total: items.length,
    due: due.length,
    reviewed_today: reviewedToday,
  };
}
