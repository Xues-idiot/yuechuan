"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, XCircle, Info, AlertTriangle, Bell } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationToastProps {
  title: string;
  body?: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
}

const typeConfig: Record<NotificationType, {
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  progressColor: string;
  iconColor: string;
}> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    progressColor: 'var(--color-success)',
    iconColor: 'var(--color-success)',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    progressColor: 'var(--color-error)',
    iconColor: 'var(--color-error)',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'rgba(14, 165, 233, 0.1)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    progressColor: 'var(--color-info)',
    iconColor: 'var(--color-info)',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    progressColor: 'var(--color-warning)',
    iconColor: 'var(--color-warning)',
  },
};

export default function NotificationToast({
  title,
  body,
  type = "info",
  duration = 5000,
  onClose,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const config = typeConfig[type];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className="w-80 rounded-[var(--radius-md)] border shadow-lg overflow-hidden animate-slide-in"
      style={{
        backgroundColor: 'var(--surface-primary)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.bgColor }}
        >
          <span style={{ color: config.iconColor }}>
            {type === "info" ? <Bell className="w-5 h-5" /> : config.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className="font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h4>
          {body && (
            <p
              className="mt-1 text-sm line-clamp-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {body}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-tertiary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div
        className="h-1"
        style={{ backgroundColor: 'var(--surface-secondary)' }}
      >
        <div
          className="h-full transition-all duration-50"
          style={{
            width: `${progress}%`,
            backgroundColor: config.progressColor,
          }}
        />
      </div>
    </div>
  );
}
