"use client";

interface AlertBannerProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export default function AlertBanner({
  message,
  type = "info",
  action,
  onDismiss,
}: AlertBannerProps) {
  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${types[type]}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span className="flex-1 text-sm">{message}</span>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium hover:underline"
        >
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="text-lg opacity-50 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}
