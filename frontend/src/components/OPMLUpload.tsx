"use client";

import { useState, useCallback } from "react";
import Button from "./Button";

interface OPMLUploadProps {
  onUpload: (content: string) => Promise<void>;
}

export default function OPMLUpload({ onUpload }: OPMLUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    // 预览文件内容
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPreview(content.slice(0, 500) + (content.length > 500 ? "..." : ""));
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const content = await file.text();
      await onUpload(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 文件选择 */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".opml,.xml"
          onChange={handleFileChange}
          className="hidden"
          id="opml-file"
        />
        <label
          htmlFor="opml-file"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <span className="text-4xl">📁</span>
          <span className="text-sm text-gray-500">
            {file ? file.name : "点击选择 OPML 文件"}
          </span>
        </label>
      </div>

      {/* 预览 */}
      {preview && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">预览：</div>
          <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
            {preview}
          </pre>
        </div>
      )}

      {/* 错误 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* 上传按钮 */}
      {file && (
        <Button
          onClick={handleUpload}
          loading={loading}
          className="w-full"
        >
          导入订阅源
        </Button>
      )}
    </div>
  );
}
