const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// 阅读时长估算（约每分钟400中文字，200英文词）
export function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const totalMinutes = chineseChars / 400 + englishWords / 200;
  return Math.max(1, Math.ceil(totalMinutes));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface Feed {
  id: number;
  name: string;
  url: string;
  feed_type: string;
  avatar_url?: string;
  description?: string;
  category?: string;
  is_active: boolean;
  last_fetched_at?: string;
  created_at: string;
}

export interface FeedItem {
  id: number;
  feed_id: number;
  guid: string;
  title: string;
  url: string;
  author?: string;
  content?: string;
  content_text?: string;
  image_url?: string;
  published_at?: string;
  is_read: boolean;
  is_starred: boolean;
  ai_summary?: string;
  tags?: string;
  created_at: string;
}

export interface FeedItemDetail extends FeedItem {
  ai_translated?: string;
  transcription?: string;
  notes?: string;
  feed: Feed;
}

export interface SimilarItem {
  item_id: number;
  feed_id: number;
  title: string;
  feed_name: string;
  tags: string[];
  score: number;
}

export interface ReadingModeSettings {
  font_size: number;
  line_height: number;
  font_family: string;
  theme: "light" | "dark" | "sepia";
  width: "narrow" | "normal" | "wide" | "full";
  auto_mark_read: boolean;
  show_images: boolean;
  text_align: "left" | "justify";
}

export interface ReadingModePreview {
  fonts: Array<{ value: string; label: string }>;
  themes: Array<{ value: string; label: string; bg: string; text: string }>;
  sizes: number[];
  line_heights: number[];
  widths: Array<{ value: string; label: string; max_width: string }>;
}

export interface FilterRule {
  field: string;
  operator: string;
  value: string;
  action: string;
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `请求失败: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // 忽略 JSON 解析错误
    }
    const error = new ApiError(message, res.status);
    throw error;
  }

  // 处理 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const api = {
  // Feeds
  async listFeeds(): Promise<Feed[]> {
    return request<Feed[]>(`${API_BASE}/feeds`);
  },

  async getFeed(feedId: number): Promise<Feed> {
    return request<Feed>(`${API_BASE}/feeds/${feedId}`);
  },

  async createFeed(data: { name: string; url: string; feed_type: string }): Promise<Feed> {
    return request<Feed>(`${API_BASE}/feeds`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteFeed(feedId: number): Promise<void> {
    await request(`${API_BASE}/feeds/${feedId}`, { method: "DELETE" });
  },

  async refreshFeed(feedId: number): Promise<{ added: number; updated: number }> {
    return request(`${API_BASE}/refresh/feeds/${feedId}`, { method: "POST" });
  },

  async refreshAllFeeds(): Promise<{ results: Array<{ feed_id: number; name: string; added: number }> }> {
    return request(`${API_BASE}/refresh/feeds`, { method: "POST" });
  },

  // Feed Items
  async listFeedItems(feedId: number, limit = 50, offset = 0): Promise<FeedItem[]> {
    return request<FeedItem[]>(`${API_BASE}/feeds/${feedId}/items?limit=${limit}&offset=${offset}`);
  },

  async getFeedItem(feedId: number, itemId: number): Promise<FeedItemDetail> {
    return request<FeedItemDetail>(`${API_BASE}/feeds/${feedId}/items/${itemId}`);
  },

  async updateFeedItem(feedId: number, itemId: number, data: {
    is_read?: boolean;
    is_starred?: boolean;
    tags?: string;
    notes?: string;
  }): Promise<FeedItemDetail> {
    return request<FeedItemDetail>(`${API_BASE}/feeds/${feedId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async markAllAsRead(feedId: number): Promise<{ updated: number }> {
    return request(`${API_BASE}/feeds/${feedId}/items/mark-all-read`, {
      method: "POST",
    });
  },

  async readLater(itemId: number): Promise<void> {
    // 调用后端 API 添加到稍后阅读
    await request(`${API_BASE}/read-later/add/${itemId}`, { method: "POST" });
  },

  async removeReadLater(itemId: number): Promise<void> {
    await request(`${API_BASE}/read-later/remove/${itemId}`, { method: "DELETE" });
  },

  async getReadLaterItems(limit = 50, offset = 0): Promise<{ items: FeedItem[]; limit: number; offset: number }> {
    return request(`${API_BASE}/read-later?limit=${limit}&offset=${offset}`);
  },

  // Bookmarks (收藏)
  async getBookmarks(limit = 50, offset = 0): Promise<FeedItem[]> {
    return request(`${API_BASE}/bookmarks?limit=${limit}&offset=${offset}`);
  },

  async getBookmarkCount(): Promise<{ count: number }> {
    return request(`${API_BASE}/bookmarks/count`);
  },

  async batchStarItems(itemIds: number[]): Promise<{ success: boolean; updated: number }> {
    return request(`${API_BASE}/bookmarks/batch-star`, {
      method: "POST",
      body: JSON.stringify(itemIds),
    });
  },

  async batchUnstarItems(itemIds: number[]): Promise<{ success: boolean; updated: number }> {
    return request(`${API_BASE}/bookmarks/batch-unstar`, {
      method: "POST",
      body: JSON.stringify(itemIds),
    });
  },

  // Reading History (阅读历史)
  async getReadingHistory(limit = 50, offset = 0): Promise<{ items: FeedItem[]; total: number; limit: number; offset: number }> {
    return request(`${API_BASE}/history?limit=${limit}&offset=${offset}`);
  },

  async markAllAsReadInFeed(feedId: number): Promise<{ success: boolean; feed_id: number; feed_name: string; marked_count: number }> {
    return request(`${API_BASE}/history/mark-all-read?feed_id=${feedId}`, { method: "POST" });
  },

  async clearHistory(beforeDate?: string): Promise<{ success: boolean; cleared_count: number }> {
    const url = beforeDate ? `${API_BASE}/history/clear?before_date=${beforeDate}` : `${API_BASE}/history/clear`;
    return request(url, { method: "DELETE" });
  },

  // OPML
  async exportOPML(): Promise<{ content: string; filename: string }> {
    return request(`${API_BASE}/feeds/opml/export`);
  },

  async importOPML(content: string): Promise<{ imported: number; skipped: number; message: string }> {
    return request(`${API_BASE}/feeds/opml/import`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  // AI
  async summarizeItem(itemId: number): Promise<{ summary: string }> {
    return request(`${API_BASE}/ai/items/${itemId}/summarize`, { method: "POST" });
  },

  async extractKeyPoints(itemId: number): Promise<{ key_points: string[] }> {
    return request(`${API_BASE}/ai/items/${itemId}/key-points`, { method: "POST" });
  },

  async translateItem(itemId: number): Promise<{ translation: string }> {
    return request(`${API_BASE}/ai/items/${itemId}/translate`, { method: "POST" });
  },

  // Knowledge Graph
  async addToKnowledge(itemId: number): Promise<{ status: string }> {
    return request(`${API_BASE}/knowledge/items/${itemId}/add`, { method: "POST" });
  },

  async getSimilarItems(itemId: number, limit = 5): Promise<{ results: SimilarItem[] }> {
    return request(`${API_BASE}/knowledge/items/${itemId}/similar?limit=${limit}`);
  },

  async searchKnowledge(query: string, limit = 5): Promise<{ results: SimilarItem[] }> {
    return request(`${API_BASE}/knowledge/search`, {
      method: "POST",
      body: JSON.stringify({ query, limit }),
    });
  },

  // Stats
  async getReadingStats(): Promise<{
    total_items: number;
    read_items: number;
    unread_items: number;
    starred_items: number;
    ai_summarized: number;
    ai_translated: number;
    knowledge_saved: number;
  }> {
    return request(`${API_BASE}/stats/reading`);
  },

  async getUnreadCount(): Promise<{
    total_unread: number;
    feeds: Array<{ feed_id: number; name: string; unread_count: number }>;
  }> {
    return request(`${API_BASE}/stats/unread-count`);
  },

  // Reading Progress
  async getReadingPosition(itemId: number): Promise<{ position: number; scroll_position: number; completed: boolean }> {
    return request(`${API_BASE}/progress/${itemId}/position`);
  },

  async syncProgress(updates: Array<{ item_id: number; position: number; scroll_position?: number; completed: boolean }>): Promise<{ synced: number }> {
    return request(`${API_BASE}/progress/sync`, {
      method: "POST",
      body: JSON.stringify(updates),
    });
  },

  async markAsCompleted(itemId: number): Promise<{ success: boolean }> {
    return request(`${API_BASE}/progress/${itemId}/complete`, { method: "POST" });
  },

  // Transcription
  async transcribeAudio(file: File, language?: string): Promise<{ text: string; language?: string; segments: any[] }> {
    const formData = new FormData();
    formData.append("file", file);
    if (language) formData.append("language", language);

    const res = await fetch(`${API_BASE}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "转录失败" }));
      throw new ApiError(errorData.detail || "转录失败", res.status);
    }

    return res.json();
  },

  // Notion
  async testNotionConnection(apiKey: string, databaseId: string): Promise<{ success: boolean; user?: string; error?: string }> {
    return request(`${API_BASE}/notion/test`, {
      method: "POST",
      body: JSON.stringify({ api_key: apiKey, database_id: databaseId }),
    });
  },

  async exportToNotion(itemId: number, includeNotes = true, includeTags = true): Promise<{ success: boolean; notion_url?: string; page_id?: string }> {
    return request(`${API_BASE}/notion/export`, {
      method: "POST",
      body: JSON.stringify({ item_id: itemId, include_notes: includeNotes, include_tags: includeTags }),
    });
  },

  // Spaced Repetition
  async getReviewItems(): Promise<Array<{ item: FeedItem; ease_factor: number; interval: number; next_review: string }>> {
    return request(`${API_BASE}/review/items`);
  },

  async reviewItem(itemId: number, quality: number): Promise<{ ease_factor: number; interval: number; next_review: string }> {
    return request(`${API_BASE}/review/items/${itemId}`, {
      method: "POST",
      body: JSON.stringify({ quality }),
    });
  },

  // Reading Streak
  async getStreak(): Promise<{
    current_streak: number;
    longest_streak: number;
    total_read_days: number;
    today_read_count: number;
    today_items: Array<{ id: number; title: string; url: string }>;
    week_logs: Array<{ date: string; items_read: number; reading_time_minutes: number }>;
  }> {
    return request(`${API_BASE}/streak`);
  },

  async recordRead(itemId: number): Promise<{ success: boolean; current_streak: number; today_count: number }> {
    return request(`${API_BASE}/streak/read/${itemId}`, { method: "POST" });
  },

  async getStreakStats(): Promise<{
    total_items: number;
    read_items: number;
    unread_items: number;
    completion_rate: number;
  }> {
    return request(`${API_BASE}/streak/stats`);
  },

  // Notifications
  async getNotifications(limit = 50, offset = 0): Promise<Array<{
    id: string;
    type: string;
    title: string;
    body: string;
    url?: string;
    read: boolean;
    created_at: string;
  }>> {
    return request(`${API_BASE}/notifications?limit=${limit}&offset=${offset}`);
  },

  async markNotificationRead(notificationId: string): Promise<{ success: boolean }> {
    return request(`${API_BASE}/notifications/mark-read/${notificationId}`, { method: "POST" });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean; count?: number }> {
    return request(`${API_BASE}/notifications/mark-all-read`, { method: "POST" });
  },

  async getNotificationSettings(): Promise<{
    enabled: boolean;
    types: {
      review_reminders: boolean;
      new_items: boolean;
      feed_updates: boolean;
      system: boolean;
    };
  }> {
    return request(`${API_BASE}/notifications/settings`);
  },

  async updateNotificationSettings(settings: {
    enabled?: boolean;
    types?: {
      review_reminders?: boolean;
      new_items?: boolean;
      feed_updates?: boolean;
      system?: boolean;
    };
  }): Promise<{ success: boolean }> {
    return request(`${API_BASE}/notifications/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // Categories
  async getCategories(): Promise<Array<{
    id: number;
    name: string;
    icon: string | null;
    color: string | null;
    sort_order: number;
    is_default: boolean;
    feed_count: number;
  }>> {
    return request(`${API_BASE}/categories`);
  },

  async createCategory(data: { name: string; icon?: string; color?: string }): Promise<any> {
    return request(`${API_BASE}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(categoryId: number): Promise<{ success: boolean }> {
    return request(`${API_BASE}/categories/${categoryId}`, { method: "DELETE" });
  },

  // Achievements
  async getAchievements(): Promise<Array<{
    id: number;
    code: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    requirement: number;
    reward_points: number;
    progress: number;
    unlocked: boolean;
  }>> {
    return request(`${API_BASE}/achievements`);
  },

  async getAchievementStats(): Promise<{ total: number; unlocked: number; percentage: number }> {
    return request(`${API_BASE}/achievements/stats`);
  },

  // Weekly Digest
  async getWeeklyDigest(): Promise<{
    start_date: string;
    end_date: string;
    total_articles: number;
    read_articles: number;
    top_feeds: Array<{ feed_id: number; count: number }>;
    top_articles: Array<{ id: number; title: string; url: string }>;
    reading_time_estimate: number;
  }> {
    return request(`${API_BASE}/weekly-digest`);
  },

  // Smart Filters
  async getSmartFilters(): Promise<Array<{
    id: number;
    name: string;
    filter_type: string;
    config: Record<string, any>;
    is_active: boolean;
  }>> {
    return request(`${API_BASE}/smart-filters`);
  },

  async createSmartFilter(data: { name: string; filter_type: string; config: Record<string, any> }): Promise<any> {
    return request(`${API_BASE}/smart-filters`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Reading Speed
  async logReadingSpeed(data: { item_id: number; reading_time_seconds: number; content_length: number; completed: boolean }): Promise<{ success: boolean; speed_wpm: number }> {
    return request(`${API_BASE}/reading-speed/log`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getReadingSpeedStats(): Promise<{
    total_sessions: number;
    total_time_minutes: number;
    avg_speed_wpm: number;
    total_items_read: number;
    completed_items: number;
  }> {
    return request(`${API_BASE}/reading-speed/stats`);
  },

  // Backup
  async exportBackup(): Promise<{ version: string; created_at: string; feeds: any[]; feed_items: any[] }> {
    return request(`${API_BASE}/backup/export`);
  },

  async importBackup(data: { version: string; feeds: any[]; feed_items: any[] }): Promise<{ success: boolean }> {
    return request(`${API_BASE}/backup/import`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Focus Mode
  async getFocusModeSettings(): Promise<{
    enabled: boolean;
    hide_sidebar: boolean;
    hide_notifications: boolean;
    dim_others: boolean;
    font_size: number;
    line_height: number;
    font_family: string;
    auto_timer_minutes: number;
  }> {
    return request(`${API_BASE}/focus-mode/settings`);
  },

  async startFocusSession(itemId?: number, durationMinutes?: number): Promise<{ session_id: number }> {
    return request(`${API_BASE}/focus-mode/session/start?item_id=${itemId || 0}&duration_minutes=${durationMinutes || 30}`, {
      method: "POST",
    });
  },

  // Reading List
  async exportReadingList(format?: string): Promise<any> {
    return request(`${API_BASE}/reading-list/export?format=${format || "json"}`);
  },

  async importReadingList(items: Array<{ title: string; url: string; author?: string }>): Promise<{ success: boolean; imported: number }> {
    return request(`${API_BASE}/reading-list/import`, {
      method: "POST",
      body: JSON.stringify(items),
    });
  },

  // Highlights
  async getHighlights(itemId: number): Promise<Array<{
    id: number;
    item_id: number;
    text: string;
    note: string | null;
    color: string;
    start_offset: number;
    end_offset: number;
  }>> {
    return request(`${API_BASE}/highlights/item/${itemId}`);
  },

  async createHighlight(data: { item_id: number; text: string; note?: string; color?: string }): Promise<any> {
    return request(`${API_BASE}/highlights`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteHighlight(highlightId: number): Promise<{ success: boolean }> {
    return request(`${API_BASE}/highlights/${highlightId}`, { method: "DELETE" });
  },

  // Reminders
  async getReminders(): Promise<Array<{
    id: number;
    reminder_type: string;
    time: string;
    days_of_week: string | null;
    enabled: boolean;
    message: string | null;
  }>> {
    return request(`${API_BASE}/reminders`);
  },

  async createReminder(data: { reminder_type: string; time: string; days_of_week?: string; message?: string }): Promise<any> {
    return request(`${API_BASE}/reminders`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Feed Health
  async getFeedHealthSummary(): Promise<{
    total_feeds: number;
    healthy_feeds: number;
    degraded_feeds: number;
    unhealthy_feeds: number;
  }> {
    return request(`${API_BASE}/feed-health/summary`);
  },

  async checkFeedHealth(feedId: number): Promise<{ success: boolean; status: string }> {
    return request(`${API_BASE}/feed-health/${feedId}/check`, { method: "POST" });
  },

  // Smart Sort
  async getSortedItems(feedId: number, sort: string): Promise<{ items: any[] }> {
    return request(`${API_BASE}/smart-sort/feeds/${feedId}/items?sort=${sort}`);
  },

  async getRecommendations(limit?: number): Promise<{ items: any[] }> {
    return request(`${API_BASE}/smart-sort/recommendations?limit=${limit || 10}`);
  },

  // Reading Timeline
  async getReadingTimeline(days?: number): Promise<Array<{
    date: string;
    items: any[];
    total_read: number;
    total_time_minutes: number;
  }>> {
    return request(`${API_BASE}/reading-timeline?days=${days || 7}`);
  },

  async getMonthlySummary(): Promise<{
    month: string;
    total_read: number;
    total_time_minutes: number;
    daily_avg: number;
    top_feeds: Array<{ feed_id: number; count: number }>;
  }> {
    return request(`${API_BASE}/reading-timeline/monthly`);
  },

  async getReadingInsights(): Promise<{
    total_items: number;
    read_items: number;
    starred_items: number;
    completion_rate: number;
    weekly_trend: Array<{ date: string; count: number }>;
  }> {
    return request(`${API_BASE}/reading-timeline/insights`);
  },

  // Feed Recommendations
  async getFeedRecommendations(limit?: number): Promise<Array<{
    feed_id: number;
    name: string;
    url: string;
    feed_type: string;
    description: string | null;
    category: string | null;
    reason: string;
    popularity: number;
  }>> {
    return request(`${API_BASE}/recommendations/feeds?limit=${limit || 10}`);
  },

  async subscribeRecommendation(recIndex: number): Promise<{ success: boolean; feed_id?: number }> {
    return request(`${API_BASE}/recommendations/subscribe/${recIndex}`, { method: "POST" });
  },

  // Tags Management
  async getAllTags(): Promise<Array<{ tag: string; count: number }>> {
    return request(`${API_BASE}/tags`);
  },

  async renameTag(oldName: string, newName: string): Promise<{ success: boolean; updated: number }> {
    return request(`${API_BASE}/tags/rename?old_name=${oldName}&new_name=${newName}`, { method: "POST" });
  },

  async deleteTag(tag: string): Promise<{ success: boolean; updated: number }> {
    return request(`${API_BASE}/tags/${encodeURIComponent(tag)}`, { method: "DELETE" });
  },

  // Batch Operations
  async batchOperation(data: {
    item_ids: number[];
    operation: string;
    value?: string;
  }): Promise<{ success: boolean; affected: number; failed: number[] }> {
    return request(`${API_BASE}/batch/operation`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async batchMarkAllRead(feedId?: number, beforeDate?: string): Promise<{ success: boolean; affected: number }> {
    let url = `${API_BASE}/batch/mark-all-read`;
    const params = new URLSearchParams();
    if (feedId) params.append("feed_id", String(feedId));
    if (beforeDate) params.append("before_date", beforeDate);
    if (params.toString()) url += `?${params.toString()}`;
    return request(url, { method: "POST" });
  },

  // Advanced Search
  async advancedSearch(params: {
    q?: string;
    feed_id?: number;
    is_read?: boolean;
    is_starred?: boolean;
    tags?: string;
    date_from?: string;
    date_to?: string;
    author?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ items: any[]; total: number; page: number; page_size: number }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    return request(`${API_BASE}/search/advanced?${searchParams.toString()}`);
  },

  async getSearchSuggestions(q: string): Promise<{ titles: string[]; tags: string[]; authors: string[] }> {
    return request(`${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`);
  },

  // Reading Mode
  async getReadingModeSettings(): Promise<{
    font_size: number;
    line_height: number;
    font_family: string;
    theme: string;
    width: string;
    auto_mark_read: boolean;
    show_images: boolean;
    text_align: string;
  }> {
    return request(`${API_BASE}/reading-mode/settings`);
  },

  async updateReadingModeSettings(settings: {
    font_size?: number;
    line_height?: number;
    font_family?: string;
    theme?: string;
    width?: string;
    auto_mark_read?: boolean;
    show_images?: boolean;
    text_align?: string;
  }): Promise<{ success: boolean }> {
    return request(`${API_BASE}/reading-mode/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // Keyboard Shortcuts
  async getKeyboardShortcuts(): Promise<Array<{
    key: string;
    modifiers: string[];
    action: string;
    description: string;
  }>> {
    return request(`${API_BASE}/keyboard-shortcuts`);
  },

  async updateKeyboardShortcut(action: string, key: string, modifiers?: string[]): Promise<{ success: boolean }> {
    return request(`${API_BASE}/keyboard-shortcuts/${action}`, {
      method: "PUT",
      body: JSON.stringify({ key, modifiers: modifiers || [] }),
    });
  },

  async resetKeyboardShortcuts(): Promise<{ success: boolean }> {
    return request(`${API_BASE}/keyboard-shortcuts/reset`, { method: "POST" });
  },

  // Notification Settings
  async getNotificationSettings(): Promise<{
    enabled: boolean;
    review_reminders: boolean;
    new_items: boolean;
    feed_updates: boolean;
    weekly_digest: boolean;
    achievements: boolean;
    desktop_notifications: boolean;
    notification_sound: boolean;
  }> {
    return request(`${API_BASE}/notification-settings`);
  },

  async updateNotificationSettings(settings: {
    enabled?: boolean;
    review_reminders?: boolean;
    new_items?: boolean;
    feed_updates?: boolean;
    weekly_digest?: boolean;
    achievements?: boolean;
    desktop_notifications?: boolean;
    notification_sound?: boolean;
  }): Promise<{ success: boolean }> {
    return request(`${API_BASE}/notification-settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // Dashboard Widgets
  async getDashboardData(): Promise<{
    feeds: { total: number; active: number };
    items: { total: number; unread: number; starred: number };
    streak: { current: number; longest: number; today_read: number };
  }> {
    return request(`${API_BASE}/widgets/dashboard`);
  },

  async getQuickStats(): Promise<{ today_read: number; timestamp: string }> {
    return request(`${API_BASE}/widgets/quick-stats`);
  },

  // Analytics
  async getAnalyticsOverview(): Promise<{
    total_items: number;
    total_feeds: number;
    read_items: number;
    unread_items: number;
    starred_items: number;
    ai_summarized: number;
    ai_translated: number;
  }> {
    return request(`${API_BASE}/analytics/overview`);
  },

  async getFeedAnalysis(): Promise<Array<{
    feed_id: number;
    feed_name: string;
    total: number;
    read: number;
    unread: number;
    read_rate: number;
  }>> {
    return request(`${API_BASE}/analytics/feed-analysis`);
  },

  async getTimeDistribution(): Promise<{
    hourly: number[];
    weekly: number[];
    peak_hour: number;
    peak_day: number;
  }> {
    return request(`${API_BASE}/analytics/time-distribution`);
  },

  async getProductivityScore(): Promise<{
    total_score: number;
    breakdown: { streak: number; reading: number; engagement: number };
    level: string;
    week_read_count: number;
  }> {
    return request(`${API_BASE}/analytics/productivity`);
  },

  // Reading Goals
  async getReadingGoals(): Promise<{
    daily: { type: string; target: number; current: number };
    weekly: { type: string; target: number; current: number };
  }> {
    return request(`${API_BASE}/reading-goals/current`);
  },

  async updateReadingGoal(goal: { type: string; target: number; current?: number }): Promise<{ success: boolean }> {
    return request(`${API_BASE}/reading-goals/update`, {
      method: "POST",
      body: JSON.stringify(goal),
    });
  },

  async getGoalProgress(): Promise<{
    daily: { current: number; target: number; progress: number; remaining: number; completed: boolean };
    weekly: { current: number; target: number; progress: number; remaining: number; completed: boolean };
  }> {
    return request(`${API_BASE}/reading-goals/progress`);
  },

  // Social Share
  async getSharePlatforms(): Promise<Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>> {
    return request(`${API_BASE}/social/platforms`);
  },

  async prepareShare(platform: string, data: { title: string; content: string; url: string }): Promise<{ url?: string; text?: string }> {
    return request(`${API_BASE}/social/prepare/${platform}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Content Filter
  async getFilterPresets(): Promise<Array<{ name: string; rules: FilterRule[] }>> {
    return request(`${API_BASE}/content-filter/presets`);
  },

  async applyContentFilter(preset: { name: string; rules: FilterRule[] }): Promise<{
    count: number;
    items: Array<{ id: number; title: string; url: string; is_read: boolean }>;
  }> {
    return request(`${API_BASE}/content-filter/apply`, {
      method: "POST",
      body: JSON.stringify(preset),
    });
  },

  // Advanced Analytics
  async getAdvancedReport(): Promise<{
    report_date: string;
    basic_stats: {
      total_articles: number;
      articles_read: number;
      articles_starred: number;
      read_rate: number;
      ai_summarized: number;
      ai_translated: number;
    };
    reading_habits: {
      peak_hour: number;
      time_of_day: string;
      reading_streak: { current: number; longest: number; total_days: number };
    };
    suggestions: string[];
    insights: string[];
  }> {
    return request(`${API_BASE}/advanced-analytics/report`);
  },

  async getWeeklyComparison(): Promise<{
    this_week: { read: number; starred: number };
    last_week: { read: number; starred: number };
    change: { read: number; read_pct: number; trend: string };
  }> {
    return request(`${API_BASE}/advanced-analytics/weekly-comparison`);
  },

  async getTopicAnalysis(): Promise<{
    total_unique_tags: number;
    top_tags: Array<{ tag: string; count: number }>;
    analysis: string;
  }> {
    return request(`${API_BASE}/advanced-analytics/topic-analysis`);
  },

  // Reading Mode Settings
  async getReadingModeSettings(): Promise<ReadingModeSettings> {
    return request<ReadingModeSettings>(`${API_BASE}/reading-mode/settings`);
  },

  async updateReadingModeSettings(settings: ReadingModeSettings): Promise<{ success: boolean }> {
    return request(`${API_BASE}/reading-mode/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  async getReadingModePreview(): Promise<ReadingModePreview> {
    return request<ReadingModePreview>(`${API_BASE}/reading-mode/preview`);
  },
};
