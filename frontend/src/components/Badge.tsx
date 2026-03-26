"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-600 dark:bg-green-900/30",
    warning: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30",
    danger: "bg-red-100 text-red-600 dark:bg-red-900/30",
    info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-block rounded-full font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
