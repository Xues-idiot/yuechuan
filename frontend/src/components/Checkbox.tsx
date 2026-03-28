"use client";

import { useId } from "react";
import { Check, Minus } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  id,
  className = "",
  description,
  error,
  indeterminate = false,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const descriptionId = description ? `${checkboxId}-description` : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center h-5 mt-0.5">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : checked}
          aria-describedby={descriptionId}
          aria-invalid={!!error}
          className="peer w-5 h-5 rounded-[var(--radius-sm)] appearance-none cursor-pointer transition-all duration-150"
          style={{
            accentColor: 'var(--color-primary)',
            backgroundColor: 'var(--surface-primary)',
            border: `2px solid ${error ? 'var(--color-error)' : checked ? 'var(--color-primary)' : 'var(--border-default)'}`,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--border-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = error ? 'var(--color-error)' : checked ? 'var(--color-primary)' : 'var(--border-default)';
            }
          }}
          onKeyDown={handleKeyDown}
        />
        {(checked || indeterminate) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {indeterminate ? (
              <Minus className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            ) : (
              <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium cursor-pointer select-none"
            style={{
              color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {label}
          </label>
          {description && (
            <p
              id={descriptionId}
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-error)' }} role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
