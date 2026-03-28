"use client";

import { useId } from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  showMinMax?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  showMinMax = true,
  disabled = false,
  className = "",
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Home':
        e.preventDefault();
        onChange(min);
        break;
      case 'End':
        e.preventDefault();
        onChange(max);
        break;
      case 'PageUp':
        e.preventDefault();
        onChange(Math.min(max, value + step * 5));
        break;
      case 'PageDown':
        e.preventDefault();
        onChange(Math.max(min, value - step * 5));
        break;
    }
  };

  return (
    <div className={`space-y-2 ${className}`} style={{ opacity: disabled ? 0.6 : 1 }}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              id={`${sliderId}-label`}
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {label}
            </label>
          )}
          {showValue && (
            <output
              htmlFor={sliderId}
              className="text-sm font-medium"
              style={{ color: 'var(--color-primary)' }}
              aria-live="polite"
            >
              {formatValue(value)}
            </output>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track background */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%',
            left: 0,
            height: '8px',
            transform: 'translateY(-50%)',
            width: '100%',
            backgroundColor: 'var(--border-default)',
          }}
        />

        {/* Active track */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%',
            left: 0,
            height: '8px',
            transform: 'translateY(-50%)',
            width: `${percentage}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />

        <input
          type="range"
          id={sliderId}
          value={value}
          onChange={(e) => !disabled && onChange(Number(e.target.value))}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-labelledby={label ? `${sliderId}-label` : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          className="w-full rounded-full appearance-none cursor-pointer relative z-10 slider-thumb"
          style={{
            height: '8px',
            accentColor: 'var(--color-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {showMinMax && (
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .slider-thumb::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider-thumb:focus-visible {
          outline: none;
        }
        .slider-thumb:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px var(--color-primary-light), 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
