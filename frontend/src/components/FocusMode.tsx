"use client";

import { useState, useEffect } from "react";

interface FocusModeProps {
  children: React.ReactNode;
}

export default function FocusMode({ children }: FocusModeProps) {
  const [enabled, setEnabled] = useState(false);
  const [timer, setTimer] = useState(25 * 60); // 25分钟
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRunning(false);
      // 播放提示音或显示通知
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("阅川 - 专注模式", {
          body: "专注时间结束，休息一下吧！",
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function startTimer() {
    setIsRunning(true);
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimer(25 * 60);
  }

  function toggleFocus() {
    setEnabled(!enabled);
    if (enabled) {
      setIsRunning(false);
    }
  }

  if (!enabled) {
    return (
      <button
        onClick={toggleFocus}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        title="专注阅读模式"
      >
        🍅 专注模式
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-6xl font-bold font-mono mb-8">{formatTime(timer)}</h2>

        <div className="flex items-center justify-center gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              开始专注
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              暂停
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            重置
          </button>
        </div>

        <button
          onClick={toggleFocus}
          className="text-gray-500 hover:text-gray-700"
        >
          退出专注模式 (Esc)
        </button>

        <p className="mt-8 text-sm text-gray-400">
          专注时间可以提高阅读效率
        </p>
      </div>

      {/* 键盘 Esc 退出 */}
      {typeof window !== "undefined" && (
        <KeyboardEventListener
          onEsc={() => {
            if (enabled) toggleFocus();
          }}
        />
      )}
    </div>
  );
}

function KeyboardEventListener({ onEsc }: { onEsc: () => void }) {
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") onEsc();
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onEsc]);
  return null;
}
