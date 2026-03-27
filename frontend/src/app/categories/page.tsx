"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  color: string;
  feed_count: number;
}

const PRESET_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, color: selectedColor })
      });
      const data = await res.json();

      if (data.id) {
        setCategories([...categories, { id: data.id, name: newCategory, color: selectedColor, feed_count: 0 }]);
        setNewCategory("");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const updateCategory = async (id: number) => {
    if (!editName.trim()) return;

    try {
      await fetch(`${API_BASE}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName })
      });

      setCategories(categories.map(c =>
        c.id === id ? { ...c, name: editName } : c
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("确定要删除这个分类吗？")) return;

    try {
      await fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📁 订阅源分类</h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理你的订阅源分类
          </p>
        </header>

        {/* Add Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold mb-4">➕ 添加分类</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="分类名称"
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
            <div className="flex gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color ? "ring-2 ring-offset-2 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={createCategory}
              disabled={!newCategory.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              添加
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">分类列表</h2>
          </div>

          {loading ? (
            <div className="p-4 animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📂</p>
              <p>暂无分类</p>
              <p className="text-sm mt-1">创建第一个分类来组织你的订阅源</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />

                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && updateCategory(cat.id)}
                    />
                  ) : (
                    <span className="flex-1 font-medium">{cat.name}</span>
                  )}

                  <span className="text-sm text-gray-400">{cat.feed_count} 个订阅源</span>

                  <div className="flex gap-2">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={() => updateCategory(cat.id)}
                          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                          className="px-2 py-1 text-sm text-gray-400 hover:text-blue-500"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="px-2 py-1 text-sm text-gray-400 hover:text-red-500"
                        >
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 点击分类颜色可选择不同的颜色</li>
            <li>• 编辑分类后点击保存按钮确认</li>
            <li>• 删除分类不会删除其中的订阅源</li>
          </ul>
        </div>
      </div>
    </main>
  );
}