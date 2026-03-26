"use client";

import { useState } from "react";
import Button from "./Button";

interface DataManagementProps {
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
}

export default function DataManagement({
  onExport,
  onImport,
  onClear,
}: DataManagementProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-4">
      {/* 导出 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">导出数据</h4>
            <p className="text-sm text-gray-500">下载您的所有数据</p>
          </div>
          <Button variant="outline" onClick={onExport}>
            导出
          </Button>
        </div>
      </div>

      {/* 导入 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">导入数据</h4>
            <p className="text-sm text-gray-500">从备份文件恢复数据</p>
          </div>
          <Button variant="outline" onClick={onImport}>
            导入
          </Button>
        </div>
      </div>

      {/* 清除 */}
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-600">清除所有数据</h4>
            <p className="text-sm text-red-500">删除所有本地存储的数据</p>
          </div>
          <Button
            variant="danger"
            onClick={() => setShowConfirm(true)}
          >
            清除
          </Button>
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">确认清除</h3>
            <p className="text-gray-500 mb-4">
              此操作不可恢复。您确定要删除所有本地数据吗？
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                取消
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onClear();
                  setShowConfirm(false);
                }}
              >
                确认清除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
