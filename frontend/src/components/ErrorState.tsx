"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
  variant?: "default" | "compact" | "card";
}

export default function ErrorState({
  message = "出错了",
  description,
  onRetry,
  showHomeLink = false,
  variant = "default",
}: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    if (!onRetry) return;
    setRetrying(true);
    onRetry();
    setTimeout(() => setRetrying(false), 1000);
  };

  if (variant === "compact") {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg border fade-in"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
        }}
        role="alert"
      >
        <AlertCircle
          className="w-5 h-5 flex-shrink-0"
          style={{ color: 'var(--color-error)' }}
          aria-hidden="true"
        />
        <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </span>
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="p-1.5 rounded-md transition-colors hover:bg-black/5 disabled:opacity-50"
            style={{ color: 'var(--color-error)' }}
            aria-label="重试"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className="p-6 rounded-xl border text-center fade-in"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-default)',
        }}
        role="alert"
      >
        <div
          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <AlertCircle
            className="w-7 h-7"
            style={{ color: 'var(--color-error)' }}
            aria-hidden="true"
          />
        </div>
        <h3
          className="text-base font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {message}
        </h3>
        {description && (
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {description}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="btn btn-primary"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
              重试
            </button>
          )}
          {showHomeLink && (
            <Link href="/" className="btn btn-secondary">
              <Home className="w-4 h-4" aria-hidden="true" />
              返回首页
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center fade-in" role="alert">
      {/* Animated error icon */}
      <div className="relative mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <AlertCircle
            className="w-10 h-10"
            style={{ color: 'var(--color-error)' }}
            aria-hidden="true"
          />
        </div>
        {/* Decorative ring */}
        <div
          className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
          style={{ borderColor: 'var(--color-error)' }}
          aria-hidden="true"
        />
      </div>

      <h3
        className="text-lg font-medium mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {message}
      </h3>

      {description && (
        <p className="text-sm max-w-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
          {description}
        </p>
      )}

      <div className="flex items-center gap-3 mt-2">
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="btn btn-primary"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
            重试
          </button>
        )}
        {showHomeLink && (
          <Link href="/" className="btn btn-secondary">
            <Home className="w-4 h-4" aria-hidden="true" />
            返回首页
          </Link>
        )}
      </div>

      {/* Suggestion text */}
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        如果问题持续存在，请刷新页面或联系支持团队
      </p>
    </div>
  );
}
