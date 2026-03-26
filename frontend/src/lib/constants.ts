"use client";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "locale",
  USER_PREFS: "yuechuan_user_prefs",
  READING_GOAL: "reading_goal",
  READING_STREAK: "reading_streak",
  NOTIFICATION_PREFS: "notification_prefs",
  SEARCH_HISTORY: "search_history",
  CACHE_PREFIX: "api_cache_",
} as const;

export const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const DEFAULT_SETTINGS = {
  theme: "system" as const,
  language: "zh",
  fontSize: 16,
  lineHeight: 1.6,
  readingMode: "light" as const,
  dailyGoal: 10,
  autoRefresh: true,
  refreshInterval: 30,
  notifications: true,
  compactMode: false,
  showThumbnails: true,
};

export const DATE_FORMATS = {
  FULL: "YYYY年MM月DD日 HH:mm",
  DATE: "YYYY年MM月DD日",
  TIME: "HH:mm",
  RELATIVE: "relative",
} as const;

export const READ_TIME_PER_MINUTE = {
  CHINESE: 400, // 中文字符
  ENGLISH: 200, // 英文单词
} as const;

export const REVIEW_QUALITY_LABELS = {
  0: "忘记",
  1: "模糊",
  2: "模糊",
  3: "记得",
  4: "良好",
  5: "完美",
} as const;
