import { FeedItemDetail } from "./api";

export function exportToMarkdown(item: FeedItemDetail): string {
  let md = `# ${item.title}\n\n`;

  if (item.author) {
    md += `**作者**: ${item.author}\n`;
  }
  if (item.published_at) {
    md += `**发布时间**: ${new Date(item.published_at).toLocaleString()}\n`;
  }
  if (item.feed?.name) {
    md += `**来源**: ${item.feed.name}\n`;
  }
  md += `\n---\n\n`;

  if (item.ai_summary) {
    md += `## AI 摘要\n\n${item.ai_summary}\n\n---\n\n`;
  }

  if (item.ai_translated) {
    md += `## 中文翻译\n\n${item.ai_translated}\n\n---\n\n`;
  }

  if (item.notes) {
    md += `## 笔记\n\n${item.notes}\n\n---\n\n`;
  }

  if (item.tags) {
    const tagList = item.tags.split(",").filter(Boolean).map((t) => `#${t.trim()}`).join(" ");
    md += `**标签**: ${tagList}\n\n`;
  }

  if (item.content_text) {
    md += `## 正文\n\n${item.content_text}\n`;
  }

  if (item.url) {
    md += `\n---\n\n**原文链接**: ${item.url}\n`;
  }

  return md;
}

export function downloadMarkdown(item: FeedItemDetail) {
  const md = exportToMarkdown(item);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.title.slice(0, 50).replace(/[^\p{L}\p{N}\s-]/gu, "")}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
