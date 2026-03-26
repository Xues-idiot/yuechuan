"use client";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
}

export default function Step({
  type = "info",
  title,
  children,
  onDismiss,
}: AlertProps) {
  const types = {
    info: {
      bg: "bg-blue-50 border-blue-200",
      title: "text-blue-800",
      body: "text-blue-700",
      icon: "ℹ️",
    },
    success: {
      bg: "bg-green-50 border-green-200",
      title: "text-green-800",
      body: "text-green-700",
      icon: "✅",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      title: "text-yellow-800",
      body: "text-yellow-700",
      icon: "⚠️",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      title: "text-red-800",
      body: "text-red-700",
      icon: "❌",
    },
  };

  const style = types[type];

  return (
    <div className={`${style.bg} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{style.icon}</span>
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${style.title} mb-1`}>{title}</h4>}
          <div className={`${style.body}`}>{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`text-gray-400 hover:${style.title}`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
