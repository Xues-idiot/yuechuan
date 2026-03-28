"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
  color?: "primary" | "white" | "current";
}

export default function LoadingSpinner({
  size = "md",
  text,
  fullScreen = false,
  className = "",
  color = "primary"
}: LoadingSpinnerProps) {
  const sizes = {
    sm: { width: '16px', height: '16px', borderWidth: '2px' },
    md: { width: '32px', height: '32px', borderWidth: '3px' },
    lg: { width: '48px', height: '48px', borderWidth: '4px' },
  };

  const getBorderColor = () => {
    switch (color) {
      case 'primary':
        return 'var(--color-primary)';
      case 'white':
        return 'white';
      case 'current':
        return 'currentColor';
      default:
        return 'var(--color-primary)';
    }
  };

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="animate-spin rounded-full"
        style={{
          width: sizes[size].width,
          height: sizes[size].height,
          border: `${sizes[size].borderWidth} solid ${getBorderColor()}`,
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
        }}
        aria-hidden="true"
      />
      <span className="sr-only">加载中，请稍候</span>
      {text && (
        <p className="mt-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-[var(--z-modal)]"
        style={{ backgroundColor: 'var(--background)' }}
        role="progressbar"
        aria-label="页面加载中"
      >
        {spinner}
      </div>
    );
  }

  return (
    <div className="py-8" role="status" aria-label="加载中">
      {spinner}
    </div>
  );
}
