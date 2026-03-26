"use client";

import { useState } from "react";
import Button from "./Button";

interface BatchActionBarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions: Array<{
    label: string;
    icon?: string;
    onClick: () => void;
    variant?: "default" | "danger";
  }>;
}

export default function BatchActionBar({
  selectedCount,
  onSelectAll,
  onClearSelection,
  actions,
}: BatchActionBarProps) {
  const [showActions, setShowActions] = useState(false);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg">
        <span className="text-sm font-medium">
          已选择 {selectedCount} 项
        </span>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        <button
          onClick={onSelectAll}
          className="text-sm text-blue-600 hover:underline"
        >
          全选
        </button>

        <button
          onClick={onClearSelection}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
        >
          取消
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClearSelection();
            }}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              action.variant === "danger"
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            }`}
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
