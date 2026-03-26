"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string[];
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  details,
}: InfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">{message}</p>

        {details && details.length > 0 && (
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-500">
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button variant="primary" onClick={onClose}>
            我知道了
          </Button>
        </div>
      </div>
    </Modal>
  );
}
