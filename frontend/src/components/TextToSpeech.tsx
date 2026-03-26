"use client";

import { useState, useEffect, useRef } from "react";

interface TextToSpeechOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
}

interface TextToSpeechResult {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

export function useTextToSpeech({
  text,
  lang = "zh-CN",
  rate = 1,
  pitch = 1,
}: TextToSpeechOptions): TextToSpeechResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const play = () => {
    if (!isSupported) return;

    // 停止之前的播放
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (!isSupported) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (!isSupported) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // 清理
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    play,
    pause: () => {
      pause();
      resume();
    },
    stop,
  };
}

export default function TextToSpeech({
  text,
  lang = "zh-CN",
}: {
  text: string;
  lang?: string;
}) {
  const { isSupported, isPlaying, play, stop } = useTextToSpeech({ text, lang });

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isPlaying ? stop : play}
      className={`p-2 rounded-full transition-colors ${
        isPlaying
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      }`}
      title={isPlaying ? "停止朗读" : "朗读全文"}
    >
      {isPlaying ? "🔊" : "🔈"}
    </button>
  );
}
