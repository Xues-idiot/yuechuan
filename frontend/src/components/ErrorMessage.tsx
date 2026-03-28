"use client";

import { AlertCircle, RotateCcw, X } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  title?: string;
}

export default function ErrorMessage({
  message,
  onRetry,
  onDismiss,
  className = "",
  title = "发生错误"
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`p-4 rounded-[var(--radius-md)] ${className}`}
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--color-error)' }}>{title}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{message}</p>
          <div className="flex gap-3 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--color-error)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                }}
                aria-label="重试操作"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                重试
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ color: 'var(--color-error)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                aria-label="忽略错误"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                忽略
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
