"use client";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
}

export default function Chip({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
}: ChipProps) {
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
      backgroundColor: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
    },
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '12px' },
    md: { padding: '4px 12px', fontSize: '14px' },
  };

  return (
    <span
      className="inline-flex items-center gap-1 font-medium"
      style={{
        borderRadius: 'var(--radius-full)',
        ...sizes[size],
        ...variantStyles[variant],
      }}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
          style={{ color: 'inherit' }}
        >
          x
        </button>
      )}
    </span>
  );
}
