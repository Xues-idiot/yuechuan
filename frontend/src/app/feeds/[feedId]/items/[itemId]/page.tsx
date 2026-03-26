"use client";

import { useState, useEffect, use, useCallback, useRef } from "react";
import Link from "next/link";
import { api, FeedItemDetail, SimilarItem, estimateReadingTime } from "@/lib/api";
import { downloadMarkdown, exportToMarkdown, copyToClipboard } from "@/lib/export";
import { addProgress } from "@/lib/reading-goal";
import { useProgressSync } from "@/lib/progress-sync";
import ThemeToggle from "@/components/ThemeToggle";
import SpeechPlayer from "@/components/SpeechPlayer";
import TranscriptionView from "@/components/TranscriptionView";
import NotionExportButton from "@/components/NotionExportButton";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ feedId: string; itemId: string }>;
}) {
  const { feedId, itemId } = use(params);
  const feedIdNum = parseInt(feedId);
  const itemIdNum = parseInt(itemId);

  const [item, setItem] = useState<FeedItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState<string | null>(null);
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [isReadLater, setIsReadLater] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTranscription, setShowTranscription] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 阅读进度跟踪
  const { updatePosition, markCompleted } = useProgressSync({
    itemId: itemIdNum,
    onProgressLoad: (progress) => setReadingProgress(progress.position),
  });

  // 滚动监听
  useEffect(() => {
    function handleScroll() {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      const progress = scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 100;
      setReadingProgress(progress);
      updatePosition(progress, scrollTop);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updatePosition]);

  // 键盘快捷键
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "s":
          if (!aiLoading) handleSummarize();
          break;
        case "t":
          if (!aiLoading) handleTranslate();
          break;
        case "k":
          handleToggleStar();
          break;
        case "n":
          setShowNotes((prev) => !prev);
          break;
        case "r":
          setShowSimilar((prev) => !prev);
          break;
        case "v":
          setShowTranscription((prev) => !prev);
          break;
        case "Escape":
          setShowNotes(false);
          setShowSimilar(false);
          setShowTranscription(false);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, aiLoading]);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await api.getFeedItem(feedIdNum, itemIdNum);
        setItem(data);
        setTags(data.tags || "");
        setNotes(data.notes || "");
        // 标记为已读并记录进度
        if (!data.is_read) {
          await api.updateFeedItem(feedIdNum, itemIdNum, { is_read: true });
          addProgress();
        }
        // 检查是否在稍后阅读列表（使用 is_starred 字段）
        setIsReadLater(data.is_starred);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [feedIdNum, itemIdNum]);

  async function handleSummarize() {
    if (!item) return;
    setAiLoading(true);
    setAiAction("summarize");
    try {
      const result = await api.summarizeItem(itemIdNum);
      setItem({ ...item, ai_summary: result.summary });
    } catch (e) {
      alert("生成摘要失败，请稍后重试");
    } finally {
      setAiLoading(false);
      setAiAction(null);
    }
  }

  async function handleTranslate() {
    if (!item) return;
    setAiLoading(true);
    setAiAction("translate");
    try {
      const result = await api.translateItem(itemIdNum);
      setItem({ ...item, ai_translated: result.translation });
    } catch (e) {
      alert("翻译失败，请稍后重试");
    } finally {
      setAiLoading(false);
      setAiAction(null);
    }
  }

  async function handleAddToKnowledge() {
    if (!item) return;
    try {
      await api.addToKnowledge(itemIdNum);
      alert("已添加到知识库");
      setShowSimilar(true);
      loadSimilarItems();
    } catch (e) {
      alert("添加到知识库失败");
    }
  }

  async function loadSimilarItems() {
    try {
      const result = await api.getSimilarItems(itemIdNum);
      setSimilarItems(result.results);
    } catch (e) {
      console.error("获取相关推荐失败", e);
    }
  }

  async function handleShowSimilar() {
    if (!showSimilar) {
      setShowSimilar(true);
      if (similarItems.length === 0) {
        loadSimilarItems();
      }
    } else {
      setShowSimilar(false);
    }
  }

  async function handleSaveTagsAndNotes() {
    if (!item) return;
    setSaving(true);
    try {
      const updated = await api.updateFeedItem(feedIdNum, itemIdNum, {
        tags,
        notes,
      });
      setItem(updated);
      setShowNotes(false);
      alert("保存成功");
    } catch (e) {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStar() {
    if (!item) return;
    try {
      const updated = await api.updateFeedItem(feedIdNum, itemIdNum, {
        is_starred: !item.is_starred,
      });
      setItem(updated);
    } catch (e) {
      alert("操作失败");
    }
  }

  function handleExportMarkdown() {
    if (!item) return;
    downloadMarkdown(item);
  }

  function handleCopyMarkdown() {
    if (!item) return;
    const md = exportToMarkdown(item);
    copyToClipboard(md);
    alert("已复制到剪贴板");
  }

  function handleShare() {
    if (!item) return;
    const shareData = {
      title: item.title,
      text: item.ai_summary || item.content_text?.slice(0, 200) || "",
      url: item.url || window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      // Fallback: copy link
      copyToClipboard(shareData.url);
      alert("链接已复制到剪贴板");
    }
  }

  async function handleToggleReadLater() {
    if (!item) return;
    if (isReadLater) {
      await api.removeReadLater(itemIdNum);
      setIsReadLater(false);
    } else {
      await api.readLater(itemIdNum);
      setIsReadLater(true);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">加载中...</p>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">{error || "内容不存在"}</p>
          <Link href={`/feeds/${feedIdNum}`} className="text-blue-600 hover:underline">
            返回
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href={`/feeds/${feedIdNum}`}
              className="text-sm text-gray-500 hover:text-blue-500 mb-4 block"
            >
              ← 返回 {item.feed?.name || "订阅源"}
            </Link>
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
              {item.author && <span>作者: {item.author}</span>}
              {item.published_at && (
                <span>{new Date(item.published_at).toLocaleString()}</span>
              )}
              <span>约 {estimateReadingTime(item.content_text || "")} 分钟阅读</span>
              {item.is_starred && <span className="text-yellow-500">★ 已收藏</span>}
              <span className="text-xs">{readingProgress}% 已读</span>
            </div>
            {item.tags && (
              <div className="flex gap-1 mt-2">
                {item.tags.split(",").filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ThemeToggle />
        </header>

        {/* 操作区 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={handleToggleReadLater}
            className={`px-4 py-2 text-sm rounded-lg border ${
              isReadLater
                ? "bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900/30"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            📋 {isReadLater ? "已在稍后阅读" : "稍后阅读"}
          </button>
          <button
            onClick={handleToggleStar}
            className={`px-4 py-2 text-sm rounded-lg border ${
              item.is_starred
                ? "bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900/30"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {item.is_starred ? "★ 已收藏" : "☆ 收藏"}
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            {showNotes ? "收起笔记" : "📝 笔记 (N)"}
          </button>
          <button
            onClick={handleSummarize}
            disabled={aiLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {aiLoading && aiAction === "summarize" ? "生成中..." : "🧠 摘要 (S)"}
          </button>
          <button
            onClick={handleTranslate}
            disabled={aiLoading}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {aiLoading && aiAction === "translate" ? "翻译中..." : "🌐 翻译 (T)"}
          </button>
          <button
            onClick={() => setShowTranscription(!showTranscription)}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            🎬 转录 (V)
          </button>
          <button
            onClick={handleShowSimilar}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            {showSimilar ? "隐藏相关推荐" : "🔍 推荐 (R)"}
          </button>
          <SpeechPlayer
            text={(item.content_text || "") + (item.ai_summary ? "。摘要：" + item.ai_summary : "")}
          />
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            🔗 分享
          </button>
          <div className="relative group">
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
              📤 导出
            </button>
            <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border hidden group-hover:block z-10">
              <button
                onClick={handleExportMarkdown}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                下载 Markdown
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                复制到剪贴板
              </button>
            </div>
          </div>
          <NotionExportButton itemId={itemIdNum} itemTitle={item.title} />
        </div>

        {/* 视频转录面板 */}
        {showTranscription && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <TranscriptionView
              itemId={itemIdNum}
              existingTranscription={item.transcription}
              onTranscriptionSaved={(text) => {
                setItem({ ...item, transcription: text });
              }}
            />
          </div>
        )}

        {/* 笔记编辑区 */}
        {showNotes && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">标签（用逗号分隔）</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="科技, AI, 产品"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-4"
            />
            <h3 className="font-semibold text-sm mb-3">笔记</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="写下你的想法..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-4"
            />
            <button
              onClick={handleSaveTagsAndNotes}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        )}

        {item.ai_summary && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">AI 摘要</h3>
            <p className="text-gray-700 dark:text-gray-300">{item.ai_summary}</p>
          </div>
        )}

        {/* 相关推荐 */}
        {showSimilar && similarItems.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">相关推荐</h3>
            <div className="space-y-2">
              {similarItems.map((s) => (
                <Link
                  key={s.item_id}
                  href={`/feeds/${s.feed_id}/items/${s.item_id}`}
                  className="block p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 hover:border-green-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{s.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {s.feed_name} · 相似度 {Math.round(s.score * 100)}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {item.image_url && (
          <img
            src={item.image_url}
            alt=""
            className="w-full max-h-96 object-cover rounded-lg mb-6"
          />
        )}

        <article ref={contentRef} className="prose dark:prose-invert max-w-none">
          {item.content ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <p className="text-gray-600">{item.content_text || "暂无内容"}</p>
          )}
        </article>

        {item.ai_translated && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">中文翻译</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {item.ai_translated}
            </p>
          </div>
        )}

        {item.transcription && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">视频转录</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {item.transcription}
            </p>
          </div>
        )}

        {/* 笔记区域 */}
        {item.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">📝 我的笔记</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {item.notes}
            </p>
          </div>
        )}

        {/* 键盘快捷键提示 */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer hover:text-gray-600">键盘快捷键</summary>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">S</kbd> 生成摘要</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">T</kbd> 翻译</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">K</kbd> 收藏/取消收藏</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">N</kbd> 笔记</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">R</kbd> 相关推荐</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd> 关闭面板</span>
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
