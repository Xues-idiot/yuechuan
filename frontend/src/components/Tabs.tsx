"use client";

import { useRef, useCallback, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "default"
}: TabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        do {
          newIndex = newIndex > 0 ? newIndex - 1 : tabs.length - 1;
        } while (tabs[newIndex].disabled && newIndex !== currentIndex);
        if (!tabs[newIndex].disabled) {
          onChange(tabs[newIndex].id);
          (tabListRef.current?.children[newIndex] as HTMLElement)?.focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        do {
          newIndex = newIndex < tabs.length - 1 ? newIndex + 1 : 0;
        } while (tabs[newIndex].disabled && newIndex !== currentIndex);
        if (!tabs[newIndex].disabled) {
          onChange(tabs[newIndex].id);
          (tabListRef.current?.children[newIndex] as HTMLElement)?.focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        const firstEnabled = tabs.findIndex(t => !t.disabled);
        if (firstEnabled >= 0) {
          onChange(tabs[firstEnabled].id);
          (tabListRef.current?.children[firstEnabled] as HTMLElement)?.focus();
        }
        break;
      case 'End':
        e.preventDefault();
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (!tabs[i].disabled) {
            onChange(tabs[i].id);
            (tabListRef.current?.children[i] as HTMLElement)?.focus();
            break;
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(tabs[currentIndex].id);
        break;
    }
  }, [tabs, onChange]);

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled;

    const baseClasses = "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-t-md";

    if (variant === "pills") {
      return (
        <button
          key={tab.id}
          onClick={() => !isDisabled && onChange(tab.id)}
          onKeyDown={(e) => !isDisabled && handleKeyDown(e, index)}
          disabled={isDisabled}
          role="tab"
          aria-selected={isActive}
          aria-disabled={isDisabled}
          tabIndex={isActive ? 0 : -1}
          className={`${baseClasses} rounded-full border`}
          style={{
            borderColor: isActive ? 'var(--color-primary)' : 'transparent',
            backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
            color: isDisabled ? 'var(--text-tertiary)' : isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span
              style={{
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--surface-secondary)',
                color: isActive ? 'white' : 'var(--text-tertiary)',
              }}
              aria-label={`${tab.count} 项`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    }

    if (variant === "underline") {
      return (
        <button
          key={tab.id}
          onClick={() => !isDisabled && onChange(tab.id)}
          onKeyDown={(e) => !isDisabled && handleKeyDown(e, index)}
          disabled={isDisabled}
          role="tab"
          aria-selected={isActive}
          aria-disabled={isDisabled}
          tabIndex={isActive ? 0 : -1}
          className={`${baseClasses} border-b-2`}
          style={{
            borderBottomColor: isActive ? 'var(--color-primary)' : 'transparent',
            color: isDisabled ? 'var(--text-tertiary)' : isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span
              style={{
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                color: isActive ? 'var(--color-primary)' : 'var(--text-tertiary)',
              }}
              aria-label={`${tab.count} 项`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    }

    // Default variant
    return (
      <button
        key={tab.id}
        onClick={() => !isDisabled && onChange(tab.id)}
        onKeyDown={(e) => !isDisabled && handleKeyDown(e, index)}
        disabled={isDisabled}
        role="tab"
        aria-selected={isActive}
        aria-disabled={isDisabled}
        tabIndex={isActive ? 0 : -1}
        className={`${baseClasses}`}
        style={{
          borderBottom: variant === "default" ? (isActive ? '2px solid var(--color-primary)' : '2px solid transparent') : undefined,
          color: isDisabled ? 'var(--text-tertiary)' : isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
          backgroundColor: 'transparent',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
        {tab.label}
        {tab.count !== undefined && (
          <span
            style={{
              padding: '2px 8px',
              fontSize: '12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
              color: isActive ? 'var(--color-primary)' : 'var(--text-tertiary)',
            }}
            aria-label={`${tab.count} 项`}
          >
            {tab.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      className={`flex ${className}`}
      style={variant !== "pills" ? { borderBottom: '1px solid var(--border-default)' } : undefined}
    >
      {tabs.map((tab, index) => renderTab(tab, index))}
    </div>
  );
}
