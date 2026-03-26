"use client";

import { useState, useEffect } from "react";

interface Highlight {
  id: number;
  item_id: number;
  text: string;
  note: string | null;
  color: string;
  start_offset: number;
  end_offset: number;
  created_at: string;
}

interface FeedItem {
  id: number;
  title: string;
  url: string;
}

const HIGHLIGHT_COLORS = [
  { value: "yellow", label: "黄色", bg: "bg-yellow-200" },
  { value: "green", label: "绿色", bg: "bg-green-200" },
  { value: "blue", label: "蓝色", bg: "bg-blue-200" },
  { value: "pink", label: "粉色", bg: "bg-pink-200" },
  { value: "purple", label: "紫色", bg: "bg-purple-200" },
];

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [items, setItems] = useState<Map<number, FeedItem>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    setLoading(true);
    try {
      // 加载所有高亮 - 通过获取所有feed items的高亮
      const feedsRes = await fetch(`${API_BASE}/feeds`);
      const feeds = await feedsRes.json();

      const allHighlights: Highlight[] = [];
      const itemMap = new Map<number, FeedItem>();

      // 遍历所有feed获取items和highlights
      for (const feed of (feeds || []).slice(0, 10)) {
        try {
          const itemsRes = await fetch(`${API_BASE}/feeds/${feed.id}/items?limit=20`);
          const itemsData = await itemsRes.json();

          for (const item of itemsData || []) {
            itemMap.set(item.id, item);

            try {
              const hlRes = await fetch(`${API_BASE}/highlights/item/${item.id}`);
              const hls = await hlRes.json();
              allHighlights.push(...(hls || []));
            } catch {
              // item has no highlights
            }
          }
        } catch {
          // skip this feed
        }
      }

      setHighlights(allHighlights.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
      setItems(itemMap);
    } catch (error) {
      console.error("Failed to load highlights:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateHighlightNote = async (highlightId: number) => {
    try {
      const highlight = highlights.find(h => h.id === highlightId);
      if (!highlight) return;

      await fetch(`${API_BASE}/highlights/${highlightId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: highlight.item_id,
          text: highlight.text,
          note: noteText,
          color: highlight.color,
          start_offset: highlight.start_offset,
          end_offset: highlight.end_offset
        })
      });

      setHighlights(highlights.map(h =>
        h.id === highlightId ? { ...h, note: noteText } : h
      ));
      setEditingNote(null);
      setNoteText("");
    } catch (error) {
      console.error("Failed to update highlight:", error);
    }
  };

  const deleteHighlight = async (highlightId: number) => {
    if (!confirm("确定要删除这条高亮吗？")) return;

    try {
      await fetch(`${API_BASE}/highlights/${highlightId}`, { method: "DELETE" });
      setHighlights(highlights.filter(h => h.id !== highlightId));
    } catch (error) {
      console.error("Failed to delete highlight:", error);
    }
  };

  const getColorClass = (color: string) => {
    return HIGHLIGHT_COLORS.find(c => c.value === color)?.bg || "bg-yellow-200";
  };

  const filteredHighlights = highlights.filter(h => {
    if (filterColor && h.color !== filterColor) return false;
    if (searchText && !h.text.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">✏️ 高亮笔记</h1>
              <p className="text-gray-600 dark:text-gray-400">
                管理你的文章高亮和笔记
              </p>
            </div>
            <button
              onClick={loadHighlights}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              🔄 刷新
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索高亮内容..."
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">颜色:</span>
              <button
                onClick={() => setFilterColor(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  !filterColor ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                全部
              </button>
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setFilterColor(color.value)}
                  className={`w-8 h-8 rounded-full ${color.bg} ${
                    filterColor === color.value ? "ring-2 ring-blue-500" : ""
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">{highlights.length}</div>
            <div className="text-sm text-gray-500">总高亮</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">
              {highlights.filter(h => h.note).length}
            </div>
            <div className="text-sm text-gray-500">有笔记</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">
              {HIGHLIGHT_COLORS.map(c => highlights.filter(h => h.color === c.value).length).reduce((a, b) => Math.max(a, b), 0)}
            </div>
            <div className="text-sm text-gray-500">最多颜色</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold">{filteredHighlights.length}</div>
            <div className="text-sm text-gray-500">当前显示</div>
          </div>
        </div>

        {/* Highlights List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">高亮列表</h2>
          </div>

          {loading ? (
            <div className="p-4 animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : filteredHighlights.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">📝</p>
              <p>暂无高亮</p>
              <p className="text-sm mt-1">在阅读文章时选择文本可创建高亮</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {filteredHighlights.map((highlight) => {
                const item = items.get(highlight.item_id);

                return (
                  <div key={highlight.id} className="p-4">
                    {/* Article info */}
                    {item && (
                      <div className="text-xs text-gray-500 mb-2">
                        来自: <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{item.title}</a>
                      </div>
                    )}

                    {/* Highlight text */}
                    <div className={`p-3 rounded-lg ${getColorClass(highlight.color)} mb-2`}>
                      <p className="text-sm">{highlight.text}</p>
                    </div>

                    {/* Note */}
                    {editingNote === highlight.id ? (
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="添加笔记..."
                          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => updateHighlightNote(highlight.id)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => { setEditingNote(null); setNoteText(""); }}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                        >
                          取消
                        </button>
                      </div>
                    ) : highlight.note ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 pl-2 border-l-2 border-gray-300">
                        📝 {highlight.note}
                      </p>
                    ) : (
                      <button
                        onClick={() => { setEditingNote(highlight.id); setNoteText(highlight.note || ""); }}
                        className="text-xs text-gray-400 hover:text-blue-500 mb-2"
                      >
                        + 添加笔记
                      </button>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{formatDate(highlight.created_at)}</span>
                      <button
                        onClick={() => deleteHighlight(highlight.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Color Legend */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold text-sm mb-3">颜色说明</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            {HIGHLIGHT_COLORS.map((color) => (
              <div key={color.value} className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded ${color.bg}`}></span>
                <span className="text-gray-600 dark:text-gray-400">{color.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}