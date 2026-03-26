"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Locale = "zh-CN" | "en-US";

interface LocaleConfig {
  locale: Locale;
  dir: "ltr" | "rtl";
  name: string;
}

const locales: Record<Locale, LocaleConfig> = {
  "zh-CN": {
    locale: "zh-CN",
    dir: "ltr",
    name: "简体中文",
  },
  "en-US": {
    locale: "en-US",
    dir: "ltr",
    name: "English",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  availableLocales: LocaleConfig[];
}

const I18nContext = createContext<I18nContextType | null>(null);

// 翻译字典
const translations: Record<Locale, Record<string, string>> = {
  "zh-CN": {
    // 导航
    "nav.home": "首页",
    "nav.feeds": "订阅源",
    "nav.discover": "发现",
    "nav.search": "搜索",
    "nav.stats": "统计",
    "nav.settings": "设置",
    "nav.history": "历史",
    "nav.readLater": "稍后阅读",
    "nav.starred": "收藏",
    "nav.review": "复习",

    // 操作
    "action.add": "添加",
    "action.delete": "删除",
    "action.edit": "编辑",
    "action.save": "保存",
    "action.cancel": "取消",
    "action.refresh": "刷新",
    "action.export": "导出",
    "action.import": "导入",
    "action.share": "分享",
    "action.copy": "复制",
    "action.translate": "翻译",
    "action.summarize": "摘要",
    "action.speak": "朗读",
    "action.star": "收藏",
    "action.unstar": "取消收藏",
    "action.markRead": "标记已读",
    "action.markUnread": "标记未读",

    // 状态
    "status.loading": "加载中...",
    "status.saving": "保存中...",
    "status.refreshing": "刷新中...",
    "status.noData": "暂无数据",
    "status.error": "加载失败",
    "status.success": "操作成功",

    // 订阅源
    "feed.addNew": "添加订阅源",
    "feed.name": "名称",
    "feed.url": "ID/频道名",
    "feed.platform": "平台",
    "feed.category": "分类",
    "feed.lastUpdated": "最后更新",
    "feed.noFeeds": "暂无订阅源",
    "feed.deleteConfirm": "确定删除此订阅源吗？",

    // 文章
    "article.summary": "摘要",
    "article.translation": "翻译",
    "article.notes": "笔记",
    "article.tags": "标签",
    "article.related": "相关内容",
    "article.readTime": "阅读时间",
    "article.publishedAt": "发布时间",

    // 设置
    "settings.apiKey": "API 密钥",
    "settings.rsshubUrl": "RSSHub 地址",
    "settings.theme": "主题",
    "settings.themeLight": "浅色",
    "settings.themeDark": "深色",
    "settings.themeAuto": "自动",
    "settings.language": "语言",
    "settings.notion": "Notion 集成",
    "settings.notionApiKey": "Notion API Key",
    "settings.notionDatabaseId": "Notion 数据库 ID",

    // 统计
    "stats.readingGoal": "阅读目标",
    "stats.articlesRead": "已读文章",
    "stats.timeSpent": "阅读时长",
    "stats.streak": "连续阅读",
    "stats.weekly": "本周",
    "stats.monthly": "本月",
    "stats.allTime": "全部",

    // 复习
    "review.spacedRepetition": "间隔复习",
    "review.nextReview": "下次复习",
    "review.easeFactor": "难度因子",
    "review.interval": "间隔",
    "review.startReview": "开始复习",
    "review.noReviews": "暂无待复习内容",

    // 错误信息
    "error.network": "网络错误，请检查连接",
    "error.server": "服务器错误，请稍后重试",
    "error.unauthorized": "请先配置 API 密钥",
    "error.notFound": "未找到相关内容",
  },
  "en-US": {
    // Navigation
    "nav.home": "Home",
    "nav.feeds": "Feeds",
    "nav.discover": "Discover",
    "nav.search": "Search",
    "nav.stats": "Stats",
    "nav.settings": "Settings",
    "nav.history": "History",
    "nav.readLater": "Read Later",
    "nav.starred": "Starred",
    "nav.review": "Review",

    // Actions
    "action.add": "Add",
    "action.delete": "Delete",
    "action.edit": "Edit",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.refresh": "Refresh",
    "action.export": "Export",
    "action.import": "Import",
    "action.share": "Share",
    "action.copy": "Copy",
    "action.translate": "Translate",
    "action.summarize": "Summarize",
    "action.speak": "Speak",
    "action.star": "Star",
    "action.unstar": "Unstar",
    "action.markRead": "Mark Read",
    "action.markUnread": "Mark Unread",

    // Status
    "status.loading": "Loading...",
    "status.saving": "Saving...",
    "status.refreshing": "Refreshing...",
    "status.noData": "No data",
    "status.error": "Failed to load",
    "status.success": "Success",

    // Feeds
    "feed.addNew": "Add Feed",
    "feed.name": "Name",
    "feed.url": "ID/Channel",
    "feed.platform": "Platform",
    "feed.category": "Category",
    "feed.lastUpdated": "Last Updated",
    "feed.noFeeds": "No feeds yet",
    "feed.deleteConfirm": "Delete this feed?",

    // Article
    "article.summary": "Summary",
    "article.translation": "Translation",
    "article.notes": "Notes",
    "article.tags": "Tags",
    "article.related": "Related",
    "article.readTime": "Read Time",
    "article.publishedAt": "Published",

    // Settings
    "settings.apiKey": "API Key",
    "settings.rsshubUrl": "RSSHub URL",
    "settings.theme": "Theme",
    "settings.themeLight": "Light",
    "settings.themeDark": "Dark",
    "settings.themeAuto": "Auto",
    "settings.language": "Language",
    "settings.notion": "Notion Integration",
    "settings.notionApiKey": "Notion API Key",
    "settings.notionDatabaseId": "Notion Database ID",

    // Stats
    "stats.readingGoal": "Reading Goal",
    "stats.articlesRead": "Articles Read",
    "stats.timeSpent": "Time Spent",
    "stats.streak": "Streak",
    "stats.weekly": "This Week",
    "stats.monthly": "This Month",
    "stats.allTime": "All Time",

    // Review
    "review.spacedRepetition": "Spaced Repetition",
    "review.nextReview": "Next Review",
    "review.easeFactor": "Ease Factor",
    "review.interval": "Interval",
    "review.startReview": "Start Review",
    "review.noReviews": "No items to review",

    // Errors
    "error.network": "Network error",
    "error.server": "Server error",
    "error.unauthorized": "Please configure API key first",
    "error.notFound": "Not found",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locale") as Locale;
      if (saved && locales[saved]) return saved;
    }
    return "zh-CN";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale][key] || translations["zh-CN"][key] || key;
    },
    [locale]
  );

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    dir: locales[locale].dir,
    availableLocales: Object.values(locales),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
