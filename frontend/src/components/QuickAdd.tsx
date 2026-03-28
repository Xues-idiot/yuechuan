"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import { api } from "@/lib/api";
import { validate, ValidationError } from "@/lib/validation";

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (feedId: number) => void;
}

const FEED_TYPES = [
  { value: "rss", label: "RSS" },
  { value: "atom", label: "Atom" },
  { value: "json", label: "JSON Feed" },
];

export default function QuickAdd({ isOpen, onClose, onSuccess }: QuickAddProps) {
  const [url, setUrl] = useState("");
  const [feedType, setFeedType] = useState("rss");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const resetForm = useCallback(() => {
    setUrl("");
    setFeedType("rss");
    setName("");
    setError(null);
    setErrors([]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证
    const validationErrors = validate(
      { url, name, feedType },
      {
        url: { required: true, url: true },
        name: { required: true, minLength: 1, maxLength: 100 },
        feedType: { required: true },
      }
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const feed = await api.createFeed({
        url: url.trim(),
        name: name.trim(),
        feed_type: feedType,
      });

      // 自动刷新获取内容
      try {
        await api.refreshFeed(feed.id);
      } catch {
        // 忽略刷新错误
      }

      onSuccess?.(feed.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加订阅源失败");
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((e) => e.field === field)?.message;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加订阅源" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          label="订阅源地址"
          placeholder="https://example.com/feed.xml"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={getFieldError("url")}
          required
        />

        <Input
          label="名称（可选）"
          placeholder="我的博客"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={getFieldError("name")}
        />

        <Select
          label="订阅源类型"
          value={feedType}
          onChange={(value) => setFeedType(value)}
          options={FEED_TYPES}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" loading={loading}>
            添加
          </Button>
        </div>
      </form>
    </Modal>
  );
}
