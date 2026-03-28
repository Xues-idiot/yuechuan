"use client";

import { useState, useEffect } from "react";
import { FolderIcon, PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, LightbulbIcon } from "lucide-react";

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
          <h1 className="text-4xl font-bold mb-2 font-serif flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <FolderIcon className="w-8 h-8" aria-hidden="true" />
            订阅源分类
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            管理你的订阅源分类
          </p>
        </header>

        {/* Add Category */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <PlusIcon className="w-5 h-5" aria-hidden="true" />
            添加分类
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="分类名称"
              className="input flex-1"
              style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-default)' }}
              aria-label="分类名称"
            />
            <div className="flex gap-1 items-center" role="group" aria-label="选择颜色">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedColor === color ? "ring-2 ring-offset-2 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`选择颜色 ${color}`}
                  aria-pressed={selectedColor === color}
                />
              ))}
            </div>
            <button
              onClick={createCategory}
              disabled={!newCategory.trim()}
              className="btn btn-primary"
            >
              添加
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="card">
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>分类列表</h2>
          </div>

          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 skeleton rounded" role="status" aria-label="加载中"></div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center" role="status">
              <FolderIcon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
              <p style={{ color: 'var(--text-tertiary)' }}>暂无分类</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>创建第一个分类来组织你的订阅源</p>
            </div>
          ) : (
            <div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 flex items-center gap-4"
                  style={{ borderTop: '1px solid var(--border-default)' }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />

                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input flex-1"
                      autoFocus
                      aria-label="编辑分类名称"
                      onKeyDown={(e) => e.key === "Enter" && updateCategory(cat.id)}
                    />
                  ) : (
                    <span className="flex-1 font-medium" style={{ color: 'var(--text-primary)' }}>{cat.name}</span>
                  )}

                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{cat.feed_count} 个订阅源</span>

                  <div className="flex gap-2">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={() => updateCategory(cat.id)}
                          className="btn btn-primary"
                          aria-label="保存分类"
                        >
                          <CheckIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary"
                          aria-label="取消编辑"
                        >
                          <XIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                          className="btn btn-ghost"
                          style={{ color: 'var(--color-primary)' }}
                          aria-label={`编辑 ${cat.name}`}
                        >
                          <PencilIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="btn btn-ghost"
                          style={{ color: 'var(--color-error)' }}
                          aria-label={`删除 ${cat.name}`}
                        >
                          <TrashIcon className="w-4 h-4" aria-hidden="true" />
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
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-light)' }} role="region" aria-label="使用提示">
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            <LightbulbIcon className="w-5 h-5" aria-hidden="true" />
            使用提示
          </h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>• 点击分类颜色可选择不同的颜色</li>
            <li>• 编辑分类后点击保存按钮确认</li>
            <li>• 删除分类不会删除其中的订阅源</li>
          </ul>
        </div>
      </div>
    </main>
  );
}