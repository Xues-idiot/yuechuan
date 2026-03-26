"use client";

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  title?: string;
}

export default function IconButton({
  icon,
  onClick,
  variant = "default",
  size = "md",
  disabled = false,
  title,
}: IconButtonProps) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const variants = {
    default: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
    primary: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        ${sizes[size]}
        ${variants[variant]}
        rounded-lg flex items-center justify-center
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <span>{icon}</span>
    </button>
  );
}
