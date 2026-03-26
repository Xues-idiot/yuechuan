"use client";

interface ReadabilityScoreProps {
  text: string;
}

interface ReadabilityResult {
  score: number;
  level: string;
  description: string;
}

export function calculateReadability(text: string): ReadabilityResult {
  // 简单的可读性评分（基于句子长度和词汇复杂度）
  const sentences = text.split(/[.!?。！？]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/);
  const avgSentenceLength = words.length / Math.max(sentences.length, 1);

  // 计算平均单词长度
  const avgWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / Math.max(words.length, 1);

  // 简单的评分公式
  const score = Math.round(100 - avgSentenceLength * 2 - avgWordLength * 5);

  let level: string;
  let description: string;

  if (score >= 80) {
    level = "简单";
    description = "易于阅读，适合大多数读者";
  } else if (score >= 60) {
    level = "中等";
    description = "需要一定的阅读能力";
  } else if (score >= 40) {
    level = "较难";
    description = "适合专业读者";
  } else {
    level = "困难";
    description = "需要较强的阅读能力";
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    level,
    description,
  };
}

export default function ReadabilityScore({ text }: ReadabilityScoreProps) {
  const result = calculateReadability(text);

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">可读性评分</span>
        <span className={`text-2xl font-bold ${getColor(result.score)}`}>
          {result.score}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor(result.score).replace("text-", "bg-")}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span className="font-medium">{result.level}</span> - {result.description}
      </div>
    </div>
  );
}
