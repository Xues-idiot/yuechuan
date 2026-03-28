"use client";

import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", disabled, ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {label}
            {props.required && (
              <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-[var(--radius-sm)] border transition-all duration-[var(--duration-fast)]
            focus:outline-none
            ${error ? "border-[var(--color-error)]" : "border-[var(--border-default)]"}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            ${className}
          `}
          style={{
            backgroundColor: disabled ? 'var(--surface-secondary)' : 'var(--surface-primary)',
            color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
            boxShadow: error
              ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
              : 'none',
          }}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onFocus={(e) => {
            if (!error && !disabled) {
              e.currentTarget.style.borderColor = 'var(--border-focus)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(3, 105, 161, 0.15)';
            }
          }}
          onBlur={(e) => {
            if (!error && !disabled) {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>
        )}
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-error)' }} role="alert">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", disabled, ...props }, ref) => {
    const inputId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {label}
            {props.required && (
              <span className="text-[var(--color-error)] ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-[var(--radius-sm)] border transition-colors resize-none
            ${error ? "border-[var(--color-error)]" : "border-[var(--border-default)]"}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            ${className}
          `}
          style={{
            backgroundColor: disabled ? 'var(--surface-secondary)' : 'var(--surface-primary)',
            color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
          }}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{hint}</p>
        )}
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-error)' }} role="alert">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Input;