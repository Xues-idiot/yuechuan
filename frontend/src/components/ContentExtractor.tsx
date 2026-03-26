"use client";

import { useState } from "react";

interface ContentExtractorProps {
  html: string;
  onExtracted?: (text: string) => void;
}

export function extractTextFromHtml(html: string): string {
  // 简单的 HTML 到纯文本的转换
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

export function extractMainContent(html: string): string {
  // 尝试提取主要内容区域
  const patterns = [
    /<article[^>]*>(.*?)<\/article>/i,
    /<main[^>]*>(.*?)<\/main>/i,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)<\/div>/i,
    /<div[^>]*class="[^"]*post[^"]*"[^>]*>(.*?)<\/div>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return extractTextFromHtml(match[1]);
    }
  }

  // 如果没有匹配到，返回全文提取
  return extractTextFromHtml(html);
}

export function extractImages(html: string): string[] {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }

  return images;
}

export function extractMetadata(html: string): {
  title?: string;
  description?: string;
  ogImage?: string;
} {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
  const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);

  return {
    title: titleMatch?.[1]?.trim(),
    description: descMatch?.[1]?.trim(),
    ogImage: ogImageMatch?.[1]?.trim(),
  };
}

export default function ContentExtractor({ html }: ContentExtractorProps) {
  const [mode, setMode] = useState<"html" | "text" | "content">("text");

  const renderContent = () => {
    switch (mode) {
      case "html":
        return (
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            {html.slice(0, 1000)}...
          </pre>
        );
      case "text":
        return (
          <div className="prose dark:prose-invert max-w-none">
            {extractTextFromHtml(html)}
          </div>
        );
      case "content":
        return (
          <div className="prose dark:prose-invert max-w-none">
            {extractMainContent(html)}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <button
          onClick={() => setMode("text")}
          className={`px-3 py-1 text-sm rounded ${
            mode === "text"
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          }`}
        >
          纯文本
        </button>
        <button
          onClick={() => setMode("content")}
          className={`px-3 py-1 text-sm rounded ${
            mode === "content"
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          }`}
        >
          内容
        </button>
        <button
          onClick={() => setMode("html")}
          className={`px-3 py-1 text-sm rounded ${
            mode === "html"
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          }`}
        >
          HTML
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
