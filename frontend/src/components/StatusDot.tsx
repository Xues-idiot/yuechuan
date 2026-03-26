"use client";

interface StatusDotProps {
  status: "online" | "offline" | "busy" | "away";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export default function StatusDot({
  status,
  size = "md",
  pulse = false,
}: StatusDotProps) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <span
        className={`${sizes[size]} rounded-full ${colors[status]}`}
      />
      {pulse && (
        <span
          className={`absolute inset-0 w-full h-full rounded-full ${colors[status]} animate-ping opacity-75`}
        />
      )}
    </div>
  );
}
