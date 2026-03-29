"use client";

import { useState, useEffect } from "react";

interface TagData {
  tag: string;
  count: number;
}

interface TagItem {
  id: number;
  title: string;
  url: string;
  feed_id: number;
  tags: string;
  is_read: boolean;
  created_at: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagItems, setTagItems] = useState<TagItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTag) {
      loadTagItems(selectedTag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag]);

  const loadTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/tags`);
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTagItems = async (tag: string) => {
    setLoadingItems(true);
    try {
      const res = await fetch(`${API_BASE}/tags/${encodeURIComponent(tag)}/items`);
      const data = await res.json();
      setTagItems(data);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleRename = async () => {
    if (!editingTag || !newTagName.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/tags/rename?old_name=${encodeURIComponent(editingTag)}&new_name=${encodeURIComponent(newTagName)}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        await loadTags();
        if (selectedTag === editingTag) {
          setSelectedTag(newTagName);
        }
      }
    } catch (error) {
      console.error("Failed to rename:", error);
    } finally {
      setActionLoading(false);
      setEditingTag(null);
      setNewTagName("");
    }
  };

  const handleDelete = async (tag: string) => {
    if (!confirm(`确定要删除标签 "${tag}" 吗？`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tags/${encodeURIComponent(tag)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        await loadTags();
        if (selectedTag === tag) {
          setSelectedTag(null);
          setTagItems([]);
        }
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMerge = async (sourceTag: string, targetTag: string) => {
    if (!confirm(`确定要将 "${sourceTag}" 合并到 "${targetTag}" 吗？`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tags/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_tag: sourceTag, target_tag: targetTag })
      });
      const data = await res.json();
      if (data.success) {
        await loadTags();
        if (selectedTag === sourceTag) {
          setSelectedTag(targetTag);
        }
      }
    } catch (error) {
      console.error("Failed to merge:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏷️ 标签管理</h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理你的所有标签，整理阅读内容
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 标签列表 */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-semibold mb-4">所有标签 ({tags.length})</h2>

              {tags.length === 0 ? (
                <p className="text-gray-500 text-sm">暂无标签</p>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {tags.map(({ tag, count }) => (
                    <div
                      key={tag}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedTag === tag ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{tag}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {count}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTag(tag);
                            setNewTagName(tag);
                          }}
                          className="text-xs text-blue-500 hover:text-blue-600 p-1"
                          title="重命名"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(tag);
                          }}
                          className="text-xs text-red-500 hover:text-red-600 p-1"
                          title="删除"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 标签内容 */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">
                  {selectedTag ? `📌 ${selectedTag}` : "选择标签查看内容"}
                </h2>
                {selectedTag && (
                  <button
                    onClick={() => {
                      const targetTag = tags.find((t) => t.tag !== selectedTag)?.tag;
                      if (targetTag) {
                        handleMerge(selectedTag, targetTag);
                      }
                    }}
                    disabled={tags.length < 2 || actionLoading}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    合并到其他标签
                  </button>
                )}
              </div>

              {!selectedTag ? (
                <p className="text-gray-500 text-sm">← 点击左侧标签查看文章</p>
              ) : loadingItems ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : tagItems.length === 0 ? (
                <p className="text-gray-500 text-sm">该标签下暂无文章</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {tagItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-gray-100 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{item.is_read ? "✅ 已读" : "📖 未读"}</span>
                        <span>{new Date(item.created_at).toLocaleDateString("zh-CN")}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 重命名对话框 */}
        {editingTag && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="font-semibold mb-4">重命名标签</h3>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="新标签名称"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-900"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingTag(null);
                    setNewTagName("");
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  取消
                </button>
                <button
                  onClick={handleRename}
                  disabled={!newTagName.trim() || actionLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {actionLoading ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
