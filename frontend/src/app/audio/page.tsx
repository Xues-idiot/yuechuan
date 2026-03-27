"use client";

import { useState } from "react";

export default function AudioPage() {
  const [settings, setSettings] = useState({
    voice: "zh-CN",
    speed: 1.0,
    autoPlay: false,
    skipSilence: false
  });
  const [playing, setPlaying] = useState(false);

  const voices = [
    { id: "zh-CN", name: "中文女声", lang: "zh-CN" },
    { id: "zh-CN-Yunyang", name: "中文男声", lang: "zh-CN" },
    { id: "en-US", name: "英文女声", lang: "en-US" },
    { id: "en-US-Jenny", name: "英文女声(美)", lang: "en-US" }
  ];

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔊 语音播放</h1>
          <p className="text-gray-600 dark:text-gray-400">
            文字转语音，让文章可以听
          </p>
        </header>

        {/* Player Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">👁️ 播放预览</h2>
          <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            {playing ? (
              <div className="space-y-4">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.random() * 30}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPlaying(false)}
                  className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ⏸️ 暂停
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl">🔊</div>
                <button
                  onClick={() => setPlaying(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  ▶️ 开始播放
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              选择一篇文章后点击播放按钮开始听书
            </p>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">🎤 声音设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">语音</label>
              <div className="grid grid-cols-2 gap-2">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSettings({ ...settings, voice: voice.id })}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      settings.voice === voice.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="font-medium text-sm">{voice.name}</div>
                    <div className="text-xs text-gray-400">{voice.lang}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">
                语速: {settings.speed}x
              </label>
              <div className="flex gap-2">
                {speeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSettings({ ...settings, speed })}
                    className={`flex-1 p-2 rounded-lg border text-center text-sm transition-colors ${
                      settings.speed === speed
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold mb-4">⚙️ 选项</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span>自动播放下一个文章</span>
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => setSettings({ ...settings, autoPlay: e.target.checked })}
                className="w-5 h-5 rounded text-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>跳过空白部分</span>
              <input
                type="checkbox"
                checked={settings.skipSilence}
                onChange={(e) => setSettings({ ...settings, skipSilence: e.target.checked })}
                className="w-5 h-5 rounded text-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 在阅读文章页面，点击语音按钮开始听书</li>
            <li>• 调整语速找到最适合你的听力速度</li>
            <li>• 建议使用耳机获得更好的体验</li>
          </ul>
        </div>
      </div>
    </main>
  );
}