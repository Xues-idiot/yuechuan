"use client";

import { useState } from "react";

interface QuickFilterOption {
  label: string;
  value: string;
}

interface QuickFilterProps {
  options: QuickFilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function QuickFilter({ options, value, onChange }: QuickFilterProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === option.value
              ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
