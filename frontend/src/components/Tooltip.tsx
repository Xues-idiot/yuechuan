"use client";

import { useState, useRef, useEffect, useId } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  disabled = false,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={() => {
        setIsFocused(true);
        showTooltip();
      }}
      onBlur={() => {
        setIsFocused(false);
        hideTooltip();
      }}
    >
      {children}
      {visible && !disabled && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute ${positions[position]} z-[var(--z-tooltip)] whitespace-nowrap`}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            backgroundColor: 'var(--surface-primary)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-default)',
          }}
        >
          {content}
        </div>
      )}
      {!disabled && (
        <div className="sr-only" aria-live="polite">
          {isFocused ? content : null}
        </div>
      )}
    </div>
  );
}
