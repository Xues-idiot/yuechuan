"use client";

interface ItemActionsBarProps {
  onMarkRead?: () => void;
  onMarkUnread?: () => void;
  onStar?: () => void;
  onUnstar?: () => void;
  onShare?: () => void;
  onAddNote?: () => void;
  onDelete?: () => void;
  isRead?: boolean;
  isStarred?: boolean;
}

export default function ItemActionsBar({
  onMarkRead,
  onMarkUnread,
  onStar,
  onUnstar,
  onShare,
  onAddNote,
  onDelete,
  isRead = false,
  isStarred = false,
}: ItemActionsBarProps) {
  return (
    <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <button
        onClick={isRead ? onMarkUnread : onMarkRead}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title={isRead ? "标记未读" : "标记已读"}
      >
        {isRead ? "📬" : "📭"}
      </button>

      <button
        onClick={isStarred ? onUnstar : onStar}
        className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors ${
          isStarred ? "text-yellow-500" : ""
        }`}
        title={isStarred ? "取消收藏" : "收藏"}
      >
        {isStarred ? "⭐" : "☆"}
      </button>

      <button
        onClick={onAddNote}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="添加笔记"
      >
        📝
      </button>

      <button
        onClick={onShare}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="分享"
      >
        🔗
      </button>

      <div className="flex-1" />

      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
        title="删除"
      >
        🗑️
      </button>
    </div>
  );
}
