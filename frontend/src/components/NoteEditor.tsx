"use client";

import { useState } from "react";

interface NoteEditorProps {
  initialContent?: string;
  placeholder?: string;
  onSave?: (content: string) => void;
}

export default function NoteEditor({
  initialContent = "",
  placeholder = "写下你的想法...",
  onSave,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  function handleSave() {
    onSave?.(content);
    setIsEditing(false);
  }

  if (!isEditing && !content) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500"
      >
        + 添加笔记
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存笔记
        </button>
        <button
          onClick={() => {
            setContent(initialContent);
            setIsEditing(false);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
      </div>
    </div>
  );
}
