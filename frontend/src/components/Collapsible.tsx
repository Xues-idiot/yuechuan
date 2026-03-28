"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
  icon,
  className = "",
  disabled = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonId = useRef(`collapsible-title-${Math.random().toString(36).substr(2, 9)}`);
  const contentId = useRef(`collapsible-content-${Math.random().toString(36).substr(2, 9)}`);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleToggle();
        break;
      case 'ArrowDown':
        if (!isOpen) {
          e.preventDefault();
          handleToggle();
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          e.preventDefault();
          handleToggle();
        }
        break;
    }
  }, [disabled, isOpen, handleToggle]);

  return (
    <div
      className={`rounded-[var(--radius-md)] overflow-hidden ${className}`}
      style={{
        border: '1px solid var(--border-default)',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <button
        id={buttonId.current}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId.current}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-inset"
        style={{
          backgroundColor: 'var(--surface-secondary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          }
        }}
      >
        <div className="flex items-center gap-2">
          {icon && <span aria-hidden="true">{icon}</span>}
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-[var(--duration-fast)]"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-tertiary)',
          }}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId.current}
        ref={contentRef}
        role="region"
        aria-labelledby={buttonId.current}
        hidden={!isOpen}
        className="p-4"
        style={{
          color: 'var(--text-primary)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
