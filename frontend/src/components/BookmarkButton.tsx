"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}

export default function BookmarkButton({
  isBookmarked,
  onToggle,
  size = "md",
}: BookmarkButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  };

  const sizes = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl",
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizes[size]}
        flex items-center justify-center rounded-full
        transition-all duration-200
        ${isBookmarked
          ? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 dark:bg-yellow-900/30"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700"
        }
        ${animating ? "scale-125" : "scale-100"}
      `}
      title={isBookmarked ? "取消收藏" : "收藏"}
    >
      {isBookmarked ? "★" : "☆"}
    </button>
  );
}
