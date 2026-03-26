"use client";

interface SearchResultProps {
  query: string;
  result: {
    title: string;
    snippet: string;
    url: string;
    feedName?: string;
    publishedAt?: string;
  };
  onClick?: () => void;
}

export default function SearchResult({ query, result, onClick }: SearchResultProps) {
  // 高亮搜索关键词
  const highlightQuery = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-800'>$1</mark>");
  };

  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h4
        className="font-medium line-clamp-1"
        dangerouslySetInnerHTML={{ __html: highlightQuery(result.title) }}
      />

      <p
        className="text-sm text-gray-500 mt-2 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: highlightQuery(result.snippet) }}
      />

      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
        {result.feedName && <span>{result.feedName}</span>}
        {result.publishedAt && (
          <span>{new Date(result.publishedAt).toLocaleDateString("zh-CN")}</span>
        )}
      </div>
    </div>
  );
}
