"use client";

import { useState, useEffect } from "react";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

interface AlertBannerProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  glassmorphism?: boolean;
  animated?: boolean;
}

export default function AlertBanner({
  message,
  type = "info",
  action,
  onDismiss,
  glassmorphism = true,
  animated = true,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      onDismiss?.();
    }, 200);
  };

  const styles = {
    info: {
      bg: 'rgba(14, 165, 233, 0.12)',
      border: 'rgba(14, 165, 233, 0.25)',
      text: 'var(--color-info)',
      glassBg: 'rgba(14, 165, 233, 0.08)',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: 'var(--color-success)',
      glassBg: 'rgba(16, 185, 129, 0.08)',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: 'var(--color-warning)',
      glassBg: 'rgba(245, 158, 11, 0.08)',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: 'var(--color-error)',
      glassBg: 'rgba(239, 68, 68, 0.08)',
    },
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  };

  const IconComponent = icons[type];

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3 border rounded-lg
        transition-all duration-300 ease-out overflow-hidden
        ${animated ? (isDismissed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0') : ''}
      `}
      style={{
        backgroundColor: glassmorphism ? styles[type].glassBg : styles[type].bg,
        borderColor: styles[type].border,
        backdropFilter: glassmorphism ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: glassmorphism ? 'blur(12px)' : 'none',
        boxShadow: glassmorphism ? 'var(--shadow-glass)' : 'none',
        transform: isVisible && animated ? 'translateY(0)' : 'translateY(-8px)',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Subtle gradient overlay for glassmorphism effect */}
      {glassmorphism && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${styles[type].glassBg} 0%, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Animated left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{
          backgroundColor: styles[type].text,
          opacity: 0.8,
        }}
        aria-hidden="true"
      />

      <IconComponent
        className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
        style={{ color: styles[type].text }}
        aria-hidden="true"
      />

      <span className="flex-1 text-sm font-medium" style={{ color: styles[type].text }}>
        {message}
      </span>

      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-semibold px-3 py-1 rounded-md transition-all duration-150 hover:scale-105 active:scale-95"
          style={{
            color: styles[type].text,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${styles[type].text}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {action.label}
        </button>
      )}

      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-md transition-all duration-150 hover:scale-105 active:scale-95"
          style={{ color: styles[type].text }}
          aria-label="关闭提示"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${styles[type].text}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
