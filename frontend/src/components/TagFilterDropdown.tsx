"use client";

import { useState } from "react";
import Button from "./Button";

interface TagFilterDropdownProps {
  tags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagFilterDropdown({
  tags,
  selectedTags,
  onChange,
}: TagFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      <Button
        variant={selectedTags.length > 0 ? "primary" : "outline"}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        标签筛选 {selectedTags.length > 0 && `(${selectedTags.length})`}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-20 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">选择标签</span>
              {selectedTags.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  清除
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {tags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">#{tag}</span>
                </label>
              ))}
            </div>

            {tags.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                暂无可用标签
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
