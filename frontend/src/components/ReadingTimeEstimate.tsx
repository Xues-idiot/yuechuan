"use client";

interface ReadingTimeEstimateProps {
  content: string;
  showIcon?: boolean;
}

export default function ReadingTimeEstimate({
  content,
  showIcon = true,
}: ReadingTimeEstimateProps) {
  // 估算阅读时间（约每分钟400中文字，200英文词）
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  const totalMinutes = chineseChars / 400 + englishWords / 200;
  const minutes = Math.max(1, Math.ceil(totalMinutes));

  const formatTime = () => {
    if (minutes < 1) return "< 1 分钟";
    if (minutes === 1) return "1 分钟";
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} 小时 ${mins} 分钟`;
  };

  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
      {showIcon && <span>⏱️</span>}
      <span>{formatTime()}</span>
    </span>
  );
}
