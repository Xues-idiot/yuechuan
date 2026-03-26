"use client";

import { useState, useEffect } from "react";

interface SwipeActionProps {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  children: React.ReactNode;
}

export default function SwipeAction({
  leftActions,
  rightActions,
  children,
}: SwipeActionProps) {
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // 限制滑动范围
    const maxLeft = leftActions ? 80 : 0;
    const maxRight = rightActions ? -80 : 0;

    if (diff > 0 && leftActions) {
      setOffset(Math.min(diff, maxLeft));
    } else if (diff < 0 && rightActions) {
      setOffset(Math.max(diff, maxRight));
    }
  };

  const handleTouchEnd = () => {
    if (offset > 40) {
      setOffset(leftActions ? 80 : 0);
    } else if (offset < -40) {
      setOffset(rightActions ? -80 : 0);
    } else {
      setOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-center w-20 bg-blue-500 text-white"
          style={{ transform: `translateX(-100%)`, opacity: offset > 0 ? 1 : 0 }}
        >
          {leftActions}
        </div>
      )}

      {/* Right Actions */}
      {rightActions && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-red-500 text-white"
          style={{ transform: `translateX(100%)`, opacity: offset < 0 ? 1 : 0 }}
        >
          {rightActions}
        </div>
      )}

      {/* Content */}
      <div
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
