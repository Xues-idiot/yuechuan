"use client";

import { useState, useEffect, useRef } from "react";

interface SpeechPlayerProps {
  text: string;
  className?: string;
}

export default function SpeechPlayer({ text, className = "" }: SpeechPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function play() {
    if (!window.speechSynthesis) return;

    // 停止之前的朗读
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }

  function stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isPlaying ? stop : play}
      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${className} ${
        isPlaying
          ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30"
          : "border-gray-300 hover:bg-gray-50"
      }`}
      title={isPlaying ? "停止朗读" : "朗读全文"}
    >
      {isPlaying ? (
        <>
          <span className="mr-1">⏹</span> 停止
        </>
      ) : (
        <>
          <span className="mr-1">🔊</span> 朗读
        </>
      )}
    </button>
  );
}
