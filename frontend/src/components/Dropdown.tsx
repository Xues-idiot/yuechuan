"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "请选择",
  className = "",
  label,
  error,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          handleClose();
        } else {
          setOpen(!open);
          if (!open && selectedIndex >= 0) {
            setFocusedIndex(selectedIndex);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
      case 'Home':
        e.preventDefault();
        if (open) setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        if (open) setFocusedIndex(options.length - 1);
        break;
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (open && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, open]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
          {label}
          {disabled && <span className="text-[var(--text-tertiary)] ml-1">(禁用)</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `dropdown-label-${label}` : undefined}
        className="w-full flex items-center justify-between px-4 py-2 rounded-[var(--radius-sm)] border transition-colors duration-[var(--duration-fast)] focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          borderColor: error ? 'var(--color-error)' : open ? 'var(--border-focus)' : 'var(--border-default)',
          backgroundColor: 'var(--surface-primary)',
          color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
          boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !open) {
            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
            e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--border-default)';
          }
        }}
      >
        <span style={{ color: selected ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
          {selected ? (
            <>
              {selected.icon && <span className="mr-2" aria-hidden="true">{selected.icon}</span>}
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={label || '选项列表'}
          className="absolute z-[var(--z-dropdown)] w-full mt-1 rounded-[var(--radius-md)] shadow-lg overflow-hidden max-h-60 overflow-y-auto"
          style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              tabIndex={index === focusedIndex ? 0 : -1}
              onClick={() => {
                onChange(option.value);
                handleClose();
              }}
              onMouseEnter={(e) => {
                setFocusedIndex(index);
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left transition-colors duration-[var(--duration-fast)] first:rounded-t-[var(--radius-md)] last:rounded-b-[var(--radius-md)]"
              style={{
                color: option.value === value ? 'var(--color-primary)' : 'var(--text-primary)',
                backgroundColor: option.value === value ? 'var(--color-primary-light)' : focusedIndex === index ? 'var(--surface-secondary)' : 'transparent',
              }}
            >
              {option.icon && <span aria-hidden="true">{option.icon}</span>}
              <span className="flex-1">{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}
    </div>
  );
}
