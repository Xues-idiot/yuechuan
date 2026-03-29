"use client";

import { useState, useRef } from "react";
import { Star } from "lucide-react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export default function BookmarkButton({
  isBookmarked,
  onToggle,
  size = "md",
  showTooltip = true,
}: BookmarkButtonProps) {
  const [animating, setAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const particleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger particle burst effect on bookmark
    if (!isBookmarked) {
      createParticles(e);
    }

    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 400);
  };

  const createParticles = (e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles = Array.from({ length: 6 }, () => ({
      id: particleIdRef.current++,
      x: centerX + (Math.random() - 0.5) * 20,
      y: centerY + (Math.random() - 0.5) * 20,
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          ${sizes[size]}
          flex items-center justify-center rounded-full
          transition-all duration-200
          ${animating ? "scale-125" : "scale-100"}
        `}
        style={{
          backgroundColor: isBookmarked ? 'rgba(234, 179, 8, 0.15)' : 'var(--surface-secondary)',
          color: isBookmarked ? 'var(--color-starred)' : 'var(--text-tertiary)',
          boxShadow: animating ? '0 0 20px rgba(234, 179, 8, 0.4)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isBookmarked ? 'rgba(234, 179, 8, 0.25)' : 'var(--border-default)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isBookmarked ? 'rgba(234, 179, 8, 0.15)' : 'var(--surface-secondary)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title={showTooltip ? (isBookmarked ? "取消收藏" : "收藏") : undefined}
        aria-label={isBookmarked ? "取消收藏" : "收藏"}
        aria-pressed={isBookmarked}
      >
        <Star
          className="transition-all duration-200"
          style={{
            width: iconSizes[size],
            height: iconSizes[size],
            fill: isBookmarked ? 'currentColor' : 'none',
            transform: animating ? 'rotate(15deg) scale(1.2)' : 'rotate(0deg) scale(1)',
            filter: animating ? 'drop-shadow(0 0 6px currentColor)' : 'none',
          }}
          aria-hidden="true"
        />

        {/* Particle burst effect */}
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full animate-particle"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: 'var(--color-starred)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </button>
    </div>
  );
}
