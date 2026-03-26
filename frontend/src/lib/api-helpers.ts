"use client";

import { api } from "./api";

const CACHE_PREFIX = "api_cache_";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheTime: number = CACHE_EXPIRY
): Promise<T> {
  const cacheKey = CACHE_PREFIX + key;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const entry: CacheEntry<T> = JSON.parse(cached);
      if (Date.now() - entry.timestamp < cacheTime) {
        return entry.data;
      }
    }
  } catch {
    // 忽略缓存读取错误
  }

  const data = await fetcher();

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch {
    // 忽略缓存写入错误
  }

  return data;
}

export async function invalidateCache(key?: string) {
  if (key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  } else {
    // 清除所有 API 缓存
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}

export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  retries: number = 3
): Promise<T> {
  return retry(
    () => fetch(url, options).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }),
    retries
  );
}
