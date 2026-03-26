"use client";

import { useState, useEffect, useRef } from "react";

interface HighlightMenuProps {
  onHighlight: (text: string, color: string) => void;
  onCopy: () => void;
  onShare: () => void;
}

const HIGHLIGHT_COLORS = [
  { name: "黄色", value: "#fef08a" },
  { name: "绿色", value: "#bbf7d0" },
  { name: "蓝色", value: "#bfdbfe" },
  { name: "粉色", value: "#fbcfe8" },
  { name: "橙色", value: "#fed7aa" },
];

export default function HighlightMenu({ onHighlight, onCopy, onShare }: HighlightMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleHighlight = (color: string) => {
    const selection = window.getSelection();
    if (selection) {
      onHighlight(selection.toString(), color);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2"
      style={{ left: position.x, top: position.y, transform: "translate(-50%, -100%)" }}
    >
      <div className="flex items-center gap-1">
        {/* 颜色选择 */}
        <div className="flex items-center gap-1 px-1">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleHighlight(color.value)}
              title={color.name}
              className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />

        {/* 操作按钮 */}
        <button
          onClick={() => {
            onCopy();
            setIsOpen(false);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="复制"
        >
          📋
        </button>
        <button
          onClick={() => {
            onShare();
            setIsOpen(false);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="分享"
        >
          🔗
        </button>
      </div>
    </div>
  );
}
