"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";

interface TranscriptionViewProps {
  itemId: number;
  existingTranscription?: string;
  onTranscriptionSaved?: (text: string) => void;
}

export default function TranscriptionView({
  itemId,
  existingTranscription,
  onTranscriptionSaved,
}: TranscriptionViewProps) {
  const [transcription, setTranscription] = useState(existingTranscription || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await api.transcribeAudio(file);
      const text = result.text;
      setTranscription(text);
      onTranscriptionSaved?.(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "转录失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleUrlTranscribe() {
    const url = prompt("请输入音视频 URL：");
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/transcribe/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("转录失败");
      }

      const result = await response.json();
      setTranscription(result.text);
      onTranscriptionSaved?.(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "转录失败");
    } finally {
      setLoading(false);
    }
  }

  function handlePlayAudio() {
    if (transcription && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(transcription);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(transcription);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">视频转录</h3>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "转录中..." : "上传音视频"}
          </button>
          <button
            onClick={handleUrlTranscribe}
            disabled={loading}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            URL 转录
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      {transcription && (
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="whitespace-pre-wrap text-sm">{transcription}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePlayAudio}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              🔊 朗读
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              📋 复制
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
