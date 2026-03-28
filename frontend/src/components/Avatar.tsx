"use client";

import { useState, useId } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  glassmorphism?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  xs: { width: '20px', height: '20px', fontSize: '8px', badge: '6px' },
  sm: { width: '24px', height: '24px', fontSize: '10px', badge: '8px' },
  md: { width: '32px', height: '32px', fontSize: '12px', badge: '10px' },
  lg: { width: '48px', height: '48px', fontSize: '14px', badge: '12px' },
  xl: { width: '64px', height: '64px', fontSize: '18px', badge: '14px' },
};

const statusColors = {
  online: 'var(--color-success)',
  offline: 'var(--text-tertiary)',
  busy: 'var(--color-error)',
  away: 'var(--color-warning)',
};

const statusLabels = {
  online: '在线',
  offline: '离线',
  busy: '忙碌',
  away: '离开',
};

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  glassmorphism = false,
  onClick,
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const dimensions = sizeMap[size];
  const avatarId = useId();

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = name ? getInitials(name) : "?";
  const accessibleName = alt || name || "用户头像";

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: dimensions.width,
    height: dimensions.height,
    flexShrink: 0,
  };

  const avatarStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
    border: '2px solid var(--surface-primary)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all var(--duration-fast) ease',
    ...(glassmorphism && {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      backgroundColor: 'var(--surface-glass)',
    }),
  };

  const fallbackStyle: React.CSSProperties = {
    ...avatarStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--surface-secondary)',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
    fontSize: dimensions.fontSize,
  };

  const statusStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: dimensions.badge,
    height: dimensions.badge,
    borderRadius: 'var(--radius-full)',
    backgroundColor: status ? statusColors[status] : 'transparent',
    border: '2px solid var(--surface-primary)',
  };

  const handleError = () => {
    setImageError(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      style={containerStyle}
      className={className}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `${accessibleName}，点击查看详情` : undefined}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={accessibleName}
          style={avatarStyle}
          onError={handleError}
          aria-labelledby={onClick ? avatarId : undefined}
        />
      ) : (
        <div
          style={fallbackStyle}
          role="img"
          aria-label={accessibleName}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          style={statusStyle}
          aria-label={statusLabels[status]}
          role="img"
        />
      )}
    </div>
  );
}
