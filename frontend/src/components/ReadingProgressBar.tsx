"use client";

import { useEffect, useState } from "react";

interface ReadingProgressBarProps {
  target: React.RefObject<HTMLElement>;
}

export default function ReadingProgressBar({ target }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const calculateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const scrolled = -rect.top;
      const total = elementHeight - windowHeight;

      if (total <= 0) {
        setProgress(100);
        return;
      }

      const percentage = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(percentage);
    };

    calculateProgress();
    window.addEventListener("scroll", calculateProgress);
    window.addEventListener("resize", calculateProgress);

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [target]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[var(--z-fixed)] h-1 transition-all duration-150"
      style={{ backgroundColor: 'var(--border-default)' }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
    >
      <div
        className="h-full transition-all duration-150"
        style={{
          width: `${progress}%`,
          backgroundColor: 'var(--color-primary)'
        }}
      />
    </div>
  );
}
