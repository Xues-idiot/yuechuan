"use client";

import { useState } from "react";
import Button from "./Button";
import Badge from "./Badge";

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
      // 多选模式
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    } else {
      // 单选模式
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
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        {hasSelection && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
          >
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
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors ${
                isSelected
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 border border-transparent"
              }`}
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
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
          >
            {isExpanded ? "收起" : `+${options.length - 8} 更多`}
          </button>
        )}
      </div>
    </div>
  );
}
