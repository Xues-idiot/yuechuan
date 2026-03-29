"use client";

import { useState } from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  noPadding?: boolean;
}

export default function Card({
  title,
  children,
  footer,
  actions,
  onClick,
  hoverable = false,
  className = "",
  noPadding = false,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isInteractive = hoverable || onClick;

  return (
    <article
      className={`rounded-[var(--radius-md)] overflow-hidden transition-all duration-[var(--duration-normal)] ${
        isInteractive ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-default)',
        boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        borderColor: isHovered ? 'var(--border-hover)' : 'var(--border-default)',
        transform: isHovered && isInteractive ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => isInteractive && setIsHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {(title || actions) && (
        <header
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--border-default)' }}
        >
          {title && (
            <h3
              className="font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
              title={title}
            >
              {title}
            </h3>
          )}
          {actions && <div className="flex gap-2 flex-shrink-0">{actions}</div>}
        </header>
      )}
      <div className={noPadding ? "" : "p-4"}>{children}</div>
      {footer && (
        <footer
          className="px-4 py-3"
          style={{
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--surface-secondary)',
          }}
        >
          {footer}
        </footer>
      )}
    </article>
  );
}
