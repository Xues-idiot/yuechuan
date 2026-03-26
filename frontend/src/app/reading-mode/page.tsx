"use client";

import { useState, useEffect } from "react";
import type { ReadingModeSettings, ReadingModePreview } from "@/lib/api";

export default function ReadingModePage() {
  const [settings, setSettings] = useState<ReadingModeSettings>({
    font_size: 18,
    line_height: 1.8,
    font_family: "system-ui",
    theme: "light",
    width: "normal",
    auto_mark_read: true,
    show_images: true,
    text_align: "left"
  });
  const [preview, setPreview] = useState<ReadingModePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsRes, previewRes] = await Promise.all([
        fetch(`${API_BASE}/reading-mode/settings`),
        fetch(`${API_BASE}/reading-mode/preview`)
      ]);

      const settingsData = await settingsRes.json();
      const previewData = await previewRes.json();

      setSettings(settingsData);
      setPreview(previewData);
    } catch (error) {
      console.error("Failed to load reading mode data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`${API_BASE}/reading-mode/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const getThemeStyles = () => {
    switch (settings.theme) {
      case "dark":
        return { background: "#1a1a1a", color: "#e0e0e0" };
      case "sepia":
        return { background: "#f4ecd8", color: "#5b4636" };
      default:
        return { background: "#ffffff", color: "#333333" };
    }
  };

  const getWidthStyle = () => {
    switch (settings.width) {
      case "narrow":
        return { maxWidth: "600px" };
      case "wide":
        return { maxWidth: "900px" };
      case "full":
        return { maxWidth: "100%" };
      default:
        return { maxWidth: "720px" };
    }
  };

  const themeStyles = getThemeStyles();
  const widthStyle = getWidthStyle();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📖 阅读模式</h1>
              <p className="text-gray-600 dark:text-gray-400">
                自定义你的阅读体验
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } disabled:opacity-50`}
            >
              {saving ? "保存中..." : saved ? "已保存!" : "保存设置"}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings Panel */}
            <div className="space-y-6">
              {/* Font Size */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">字体大小</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="14"
                    max="24"
                    value={settings.font_size}
                    onChange={(e) =>
                      setSettings({ ...settings, font_size: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-lg font-mono w-12 text-center">
                    {settings.font_size}px
                  </span>
                </div>
              </div>

              {/* Line Height */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">行高</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="14"
                    max="22"
                    step="2"
                    value={settings.line_height * 10}
                    onChange={(e) =>
                      setSettings({ ...settings, line_height: Number(e.target.value) / 10 })
                    }
                    className="flex-1"
                  />
                  <span className="text-lg font-mono w-12 text-center">
                    {settings.line_height}
                  </span>
                </div>
              </div>

              {/* Font Family */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">字体</h2>
                <div className="grid grid-cols-2 gap-2">
                  {preview?.fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSettings({ ...settings, font_family: font.value })}
                      className={`px-4 py-2 rounded-lg border text-left transition-colors ${
                        settings.font_family === font.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="text-sm">{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">主题</h2>
                <div className="grid grid-cols-3 gap-3">
                  {preview?.themes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setSettings({ ...settings, theme: theme.value as any })}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        settings.theme === theme.value
                          ? "border-blue-500 ring-2 ring-blue-500"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                      style={{ background: theme.bg, color: theme.text }}
                    >
                      <div className="text-2xl mb-1">
                        {theme.value === "light" ? "☀️" : theme.value === "dark" ? "🌙" : "📜"}
                      </div>
                      <span className="text-sm">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Width */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">内容宽度</h2>
                <div className="grid grid-cols-4 gap-2">
                  {preview?.widths.map((width) => (
                    <button
                      key={width.value}
                      onClick={() => setSettings({ ...settings, width: width.value as any })}
                      className={`px-3 py-2 rounded-lg border text-center text-sm transition-colors ${
                        settings.width === width.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {width.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Alignment */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">文本对齐</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, text_align: "left" })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      settings.text_align === "left"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    左对齐
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, text_align: "justify" })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      settings.text_align === "justify"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    两端对齐
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold mb-4">其他选项</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>自动标记已读</span>
                    <input
                      type="checkbox"
                      checked={settings.auto_mark_read}
                      onChange={(e) =>
                        setSettings({ ...settings, auto_mark_read: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>显示图片</span>
                    <input
                      type="checkbox"
                      checked={settings.show_images}
                      onChange={(e) =>
                        setSettings({ ...settings, show_images: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 className="font-semibold">预览</h2>
              </div>
              <div
                className="p-6 overflow-auto"
                style={{
                  background: themeStyles.background,
                  color: themeStyles.color,
                  fontFamily: settings.font_family,
                  fontSize: `${settings.font_size}px`,
                  lineHeight: settings.line_height,
                  textAlign: settings.text_align,
                  ...widthStyle
                }}
              >
                <h1
                  className="text-2xl font-bold mb-4"
                  style={{ fontSize: `${settings.font_size * 1.5}px` }}
                >
                  文章标题示例
                </h1>
                <p className="mb-4">
                  这是一个预览文本，用来展示阅读模式的设置效果。你可以调整字体大小、行高、字体样式、主题和内容宽度来获得最佳的阅读体验。
                </p>
                <p className="mb-4">
                  阅读是获取知识的重要方式，一个舒适的阅读环境可以大大提高阅读效率和体验。通过自定义阅读模式，你可以根据自己的喜好来调整页面的显示方式。
                </p>
                {settings.show_images && (
                  <div className="bg-gray-200 dark:bg-gray-700 rounded p-8 text-center mb-4">
                    图片预览区域
                  </div>
                )}
                <p style={{ color: themeStyles.color, opacity: 0.7 }}>
                  点击「保存设置」按钮来应用你的更改。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 调整左侧设置，右侧实时预览效果</li>
            <li>• 「自动标记已读」会在滚动到文章底部时自动标记为已读</li>
            <li>• 深色主题适合在光线较暗的环境中使用</li>
            <li>• 窄宽度有助于减少眼睛移动，提高阅读舒适度</li>
          </ul>
        </div>
      </div>
    </main>
  );
}