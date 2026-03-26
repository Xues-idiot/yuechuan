"use client";

import { useState, useEffect } from "react";

interface ScrollIndicatorProps {
  targetRef: React.RefObject<HTMLElement>;
  threshold?: number;
}

export default function ScrollIndicator({
  targetRef,
  threshold = 100,
}: ScrollIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = targetRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setShowIndicator(!isNearBottom);
    };

    const element = targetRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [targetRef, threshold]);

  const scrollToBottom = () => {
    if (!targetRef.current) return;
    targetRef.current.scrollTo({
      top: targetRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!showIndicator) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors flex items-center gap-2"
    >
      滚动到底部
      <span>↓</span>
    </button>
  );
}
