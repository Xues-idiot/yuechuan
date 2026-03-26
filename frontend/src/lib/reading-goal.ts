const GOAL_KEY = "reading_goal";
const PROGRESS_KEY = "reading_progress";

export interface ReadingGoal {
  daily: number;  // 每日阅读目标（篇数）
  weekly: number; // 每周阅读目标
}

export interface ReadingProgress {
  date: string;  // YYYY-MM-DD
  read_count: number;
}

export function getGoal(): ReadingGoal {
  const stored = localStorage.getItem(GOAL_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { daily: 5, weekly: 30 };
    }
  }
  return { daily: 5, weekly: 30 };
}

export function setGoal(goal: ReadingGoal) {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
}

export function getProgress(): ReadingProgress[] {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function addProgress(count: number = 1) {
  const today = new Date().toISOString().split("T")[0];
  const progress = getProgress();

  const existing = progress.find((p) => p.date === today);
  if (existing) {
    existing.read_count += count;
  } else {
    progress.push({ date: today, read_count: count });
  }

  // 只保留最近90天的数据
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const filtered = progress.filter((p) => p.date >= cutoff.toISOString().split("T")[0]);

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(filtered));
}

export function getTodayProgress(): number {
  const today = new Date().toISOString().split("T")[0];
  const progress = getProgress();
  const todayProgress = progress.find((p) => p.date === today);
  return todayProgress?.read_count || 0;
}

export function getWeekProgress(): number {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const progress = getProgress();
  return progress
    .filter((p) => p.date >= weekAgo.toISOString().split("T")[0])
    .reduce((sum, p) => sum + p.read_count, 0);
}
