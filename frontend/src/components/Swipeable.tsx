"use client";

import { useState, useEffect } from "react";

interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export default function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeableProps) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      setStartX(e.touches[0].clientX);
      setIsDragging(true);
    }

    function handleTouchMove(e: TouchEvent) {
      if (!isDragging) return;
      setCurrentX(e.touches[0].clientX);
    }

    function handleTouchEnd() {
      const diff = currentX - startX;

      if (diff > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (diff < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }

      setIsDragging(false);
      setCurrentX(0);
    }

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, currentX, startX, threshold, onSwipeLeft, onSwipeRight]);

  const translateX = isDragging ? currentX - startX : 0;

  return (
    <div
      className="transition-transform"
      style={{ transform: `translateX(${translateX}px)` }}
    >
      {children}
    </div>
  );
}
