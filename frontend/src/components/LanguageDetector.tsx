"use client";

interface LanguageDetectorProps {
  text: string;
  onDetected: (language: string) => void;
}

export function detectLanguage(text: string): string {
  // 简单语言检测：基于字符集
  const chineseRegex = /[\u4e00-\u9fff]/g;
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/g;
  const koreanRegex = /[\uac00-\ud7af]/g;

  const chineseChars = (text.match(chineseRegex) || []).length;
  const japaneseChars = (text.match(japaneseRegex) || []).length;
  const koreanChars = (text.match(koreanRegex) || []).length;

  const total = text.length;

  if (chineseChars / total > 0.3) return "zh";
  if (japaneseChars / total > 0.3) return "ja";
  if (koreanChars / total > 0.3) return "ko";

  // 默认返回英语
  return "en";
}

export default function LanguageDetector({ text, onDetected }: LanguageDetectorProps) {
  const language = detectLanguage(text);
  onDetected(language);

  const languageNames: Record<string, string> = {
    zh: "中文",
    ja: "日语",
    ko: "韩语",
    en: "英语",
  };

  return (
    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
      {languageNames[language] || language}
    </span>
  );
}
