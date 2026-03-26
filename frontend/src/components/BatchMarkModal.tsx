"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface BatchMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: (action: "read" | "unread" | "star" | "unstar") => void;
}

export default function BatchMarkModal({
  isOpen,
  onClose,
  selectedCount,
  onConfirm,
}: BatchMarkModalProps) {
  const [action, setAction] = useState<"read" | "unread" | "star" | "unstar">("read");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      onConfirm(action);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: "read", label: "标记已读", icon: "📭", description: "将选中的内容标记为已读" },
    { value: "unread", label: "标记未读", icon: "📬", description: "将选中的内容标记为未读" },
    { value: "star", label: "添加收藏", icon: "⭐", description: "将选中的内容添加到收藏" },
    { value: "unstar", label: "取消收藏", icon: "☆", description: "将选中的内容从收藏中移除" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="批量操作" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          已选择 {selectedCount} 个项目
        </p>

        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAction(opt.value as typeof action)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                action === opt.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm} loading={loading}>
            确认
          </Button>
        </div>
      </div>
    </Modal>
  );
}
