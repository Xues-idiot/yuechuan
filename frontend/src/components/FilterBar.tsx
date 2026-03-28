"use client";

import { useState } from "react";
import Badge from "./Badge";
import { ChevronDown, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  title: string;
  options: FilterOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}

export default function FilterBar({
  title,
  options,
  value,
  onChange,
  multiple = false,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    } else {
      onChange(value.includes(optionValue) ? [] : [optionValue]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const showExpandButton = options.length > 8;
  const displayOptions = isExpanded ? options : options.slice(0, 8);
  const hasSelection = value.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {hasSelection && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-[var(--radius-sm)] transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-error)';
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-3 h-3" />
            清除
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayOptions.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all"
              style={{
                backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--surface-secondary)',
                color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
              }}
            >
              {option.label}
              {option.count !== undefined && (
                <Badge variant={isSelected ? "info" : "default"} size="sm">
                  {option.count}
                </Badge>
              )}
            </button>
          );
        })}

        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
            {isExpanded ? '收起' : `+${options.length - 8} 更多`}
          </button>
        )}
      </div>
    </div>
  );
}
