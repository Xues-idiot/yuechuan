"use client";

import { useId } from "react";

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "error";
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
  className?: string;
  striped?: boolean;
  animated?: boolean;
}

export default function Progress({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  color = "primary",
  label,
  showValue = false,
  formatValue,
  className = "",
  striped = false,
  animated = false,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  };

  const colors = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
  };

  const barColor = colors[color];
  const progressId = useId();

  const getAriaValueText = () => {
    if (formatValue) {
      return formatValue(value, max);
    }
    return `${value} / ${max}`;
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label
              id={`${progressId}-label`}
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span
              className="text-sm font-medium"
              style={{ color: barColor }}
              aria-live="polite"
            >
              {formatValue ? formatValue(value, max) : `${value} / ${max}`}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        id={progressId}
        aria-labelledby={label ? `${progressId}-label` : undefined}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={getAriaValueText()}
        className={`w-full rounded-full overflow-hidden ${animated && striped ? 'progress-striped-animated' : ''}`}
        style={{
          height: sizes[size],
          backgroundColor: 'var(--border-default)',
        }}
      >
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
            ...(striped && {
              backgroundImage: `linear-gradient(
                45deg,
                rgba(255,255,255,0.15) 25%,
                transparent 25%,
                transparent 50%,
                rgba(255,255,255,0.15) 50%,
                rgba(255,255,255,0.15) 75%,
                transparent 75%,
                transparent
              )`,
              backgroundSize: '1rem 1rem',
            }),
          }}
        />
      </div>

      {showLabel && !label && !showValue && (
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}

      <style>{`
        @keyframes progress-bar-stripes {
          from {
            background-position: 1rem 0;
          }
          to {
            background-position: 0 0;
          }
        }
        .progress-striped-animated > div {
          animation: progress-bar-stripes 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
