"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--text-secondary)',
    },
    success: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      color: 'var(--color-success)',
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      color: 'var(--color-warning)',
    },
    danger: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      color: 'var(--color-error)',
    },
    info: {
      backgroundColor: 'rgba(14, 165, 233, 0.15)',
      color: 'var(--color-info)',
    },
    primary: {
      backgroundColor: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
    },
  };

  const dotColors = {
    default: 'var(--text-tertiary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-error)',
    info: 'var(--color-info)',
    primary: 'var(--color-primary)',
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '12px' },
    md: { padding: '4px 12px', fontSize: '14px' },
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${className}`}
      style={{
        borderRadius: 'var(--radius-full)',
        ...sizes[size],
        ...variantStyles[variant],
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColors[variant] }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}