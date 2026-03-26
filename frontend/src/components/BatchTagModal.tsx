"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import TagInput from "./TagInput";

interface BatchTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onApply: (tags: string[]) => void;
}

export default function BatchTagModal({
  isOpen,
  onClose,
  selectedCount,
  onApply,
}: BatchTagModalProps) {
  const [tags, setTags] = useState<string[]>([]);

  const handleApply = () => {
    onApply(tags);
    setTags([]);
    onClose();
  };

  const handleClose = () => {
    setTags([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="批量添加标签" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          为选中的 {selectedCount} 个项目添加标签
        </p>

        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="输入标签后按回车"
          suggestions={["重要", "技术", "产品", "设计", "阅读"]}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleApply} disabled={tags.length === 0}>
            应用标签
          </Button>
        </div>
      </div>
    </Modal>
  );
}
