"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

let toastId = 0;
const toastListeners: Set<(toasts: ToastItem[]) => void> = new Set();
let toasts: ToastItem[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function showToast(
  type: ToastItem["type"],
  message: string,
  duration = 4000
) {
  const id = String(++toastId);
  const toast: ToastItem = { id, type, message, duration };
  toasts = [...toasts, toast];
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function clearAllToasts() {
  toasts = [];
  notifyListeners();
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.add(setCurrentToasts);
    return () => {
      toastListeners.delete(setCurrentToasts);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  const colors: Record<ToastItem["type"], { bg: string; border: string; text: string }> = {
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: 'var(--color-success)' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: 'var(--color-error)' },
    info: { bg: 'rgba(14, 165, 233, 0.1)', border: 'rgba(14, 165, 233, 0.3)', text: 'var(--color-info)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: 'var(--color-warning)' },
  };

  return (
    <div
      className="fixed bottom-20 right-4 z-[var(--z-toast)] space-y-2 max-w-sm"
      role="region"
      aria-label="通知提示"
      aria-live="polite"
    >
      {currentToasts.map((toast) => {
        const IconComponent = icons[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-md)] border shadow-lg animate-slide-in"
            style={{
              backgroundColor: colors[toast.type].bg,
              borderColor: colors[toast.type].border,
            }}
          >
            <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors[toast.type].text }} aria-hidden="true" />
            <span className="flex-1 text-sm" style={{ color: colors[toast.type].text }}>{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 p-1 rounded transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-tertiary)' }}
              aria-label="关闭提示"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
