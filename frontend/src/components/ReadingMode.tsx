"use client";

import { useState, useEffect } from "react";
import { api, ReadingModeSettings, ReadingModePreview } from "@/lib/api";

export default function ReadingModePage() {
  const [settings, setSettings] = useState<ReadingModeSettings>({
    font_size: 18,
    line_height: 1.8,
    font_family: "system-ui",
    theme: "light",
    width: "normal",
    auto_mark_read: true,
    show_images: true,
    text_align: "left",
  });

  const [preview, setPreview] = useState<ReadingModePreview | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
    loadPreview();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getReadingModeSettings();
      setSettings(data);
    } catch (error) {
      console.error("加载设置失败", error);
    }
  };

  const loadPreview = async () => {
    try {
      const data = await api.getReadingModePreview();
      setPreview(data);
    } catch (error) {
      console.error("加载预览配置失败", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.updateReadingModeSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("保存设置失败", error);
    } finally {
      setSaving(false);
    }
  };

  const themeColors = {
    light: { bg: "#ffffff", text: "#333333" },
    dark: { bg: "#1a1a1a", text: "#e0e0e0" },
    sepia: { bg: "#f4ecd8", text: "#5b4636" },
  };

  const widthMap: Record<string, string> = {
    narrow: "600px",
    normal: "720px",
    wide: "900px",
    full: "100%",
  };

  const currentTheme = themeColors[settings.theme];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">阅读模式</h1>
          <p className="text-gray-600 dark:text-gray-400">
            自定义阅读体验，找到最适合自己的阅读方式
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 设置面板 */}
          <div className="space-y-6">
            {/* 字体设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-semibold mb-4">字体</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    字体大小: {settings.font_size}px
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="24"
                    step="2"
                    value={settings.font_size}
                    onChange={(e) =>
                      setSettings({ ...settings, font_size: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>小</span>
                    <span>大</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    行高: {settings.line_height}
                  </label>
                  <input
                    type="range"
                    min="1.4"
                    max="2.2"
                    step="0.2"
                    value={settings.line_height}
                    onChange={(e) =>
                      setSettings({ ...settings, line_height: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>紧凑</span>
                    <span>宽松</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    字体
                  </label>
                  <select
                    value={settings.font_family}
                    onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700"
                  >
                    {preview?.fonts.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 主题设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-semibold mb-4">主题</h2>
              <div className="grid grid-cols-3 gap-3">
                {preview?.themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSettings({ ...settings, theme: t.value as typeof settings.theme })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.theme === t.value
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: t.bg, color: t.text }}
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 宽度设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-semibold mb-4">阅读宽度</h2>
              <div className="grid grid-cols-4 gap-2">
                {preview?.widths.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setSettings({ ...settings, width: w.value as typeof settings.width })}
                    className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                      settings.width === w.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 其他设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-semibold mb-4">其他</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.auto_mark_read}
                    onChange={(e) => setSettings({ ...settings, auto_mark_read: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">滚动到底部自动标记已读</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.show_images}
                    onChange={(e) => setSettings({ ...settings, show_images: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">显示文章图片</span>
                </label>

                <div>
                  <label className="block text-sm mb-2">文字对齐</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSettings({ ...settings, text_align: "left" })}
                      className={`py-2 rounded-lg text-sm ${
                        settings.text_align === "left"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      左对齐
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, text_align: "justify" })}
                      className={`py-2 rounded-lg text-sm ${
                        settings.text_align === "justify"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      两端对齐
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                saved
                  ? "bg-green-500 text-white"
                  : saving
                  ? "bg-gray-400 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {saved ? "已保存" : saving ? "保存中..." : "保存设置"}
            </button>
          </div>

          {/* 预览面板 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold mb-4">预览</h2>
            <div
              className="rounded-lg p-6 transition-colors"
              style={{
                backgroundColor: currentTheme.bg,
                color: currentTheme.text,
                fontFamily: settings.font_family,
                fontSize: `${settings.font_size}px`,
                lineHeight: settings.line_height,
                maxWidth: widthMap[settings.width],
                margin: "0 auto",
                textAlign: settings.text_align,
              }}
            >
              <h3
                className="font-bold mb-4"
                style={{ fontSize: `${settings.font_size * 1.25}px` }}
              >
                文章标题示例
              </h3>
              <p className="mb-4">
                这是一段示例文字，用于预览您的阅读模式设置效果。良好的阅读体验需要合适的字体大小、行高和对比度。
              </p>
              <p className="mb-4">
                调整设置左边的选项，观察右侧预览区域的变化。找到最适合您的阅读方式。
              </p>
              {settings.show_images && (
                <div className="bg-gray-200 dark:bg-gray-700 rounded h-32 mb-4 flex items-center justify-center text-xs">
                  图片预览区域
                </div>
              )}
              <p>
                继续阅读更多内容来测试您的设置。阅读愉快！
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
