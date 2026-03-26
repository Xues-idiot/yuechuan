"use client";

import { useState } from "react";
import Button from "./Button";

interface ContentActionsProps {
  item: {
    id: number;
    is_read: boolean;
    is_starred: boolean;
  };
  onMarkRead?: () => void;
  onMarkUnread?: () => void;
  onStar?: () => void;
  onUnstar?: () => void;
  onShare?: () => void;
  onAddNote?: () => void;
  onDelete?: () => void;
}

export default function ContentActions({
  item,
  onMarkRead,
  onMarkUnread,
  onStar,
  onUnstar,
  onShare,
  onAddNote,
  onDelete,
}: ContentActionsProps) {
  const [showMore, setShowMore] = useState(false);

  const primaryActions = [
    {
      icon: item.is_read ? "📬" : "📭",
      label: item.is_read ? "标记未读" : "标记已读",
      onClick: item.is_read ? onMarkUnread : onMarkRead,
    },
    {
      icon: item.is_starred ? "⭐" : "☆",
      label: item.is_starred ? "取消收藏" : "收藏",
      onClick: item.is_starred ? onUnstar : onStar,
    },
    { icon: "📝", label: "添加笔记", onClick: onAddNote },
    { icon: "🔗", label: "分享", onClick: onShare },
  ];

  const secondaryActions = [
    { icon: "🗑️", label: "删除", onClick: onDelete, danger: true },
  ];

  return (
    <div className="flex items-center gap-2">
      {primaryActions.map((action) => (
        <Button
          key={action.label}
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          title={action.label}
        >
          {action.icon}
        </Button>
      ))}

      {showMore && (
        <>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />
          {secondaryActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              title={action.label}
              className={action.danger ? "text-red-500" : ""}
            >
              {action.icon}
            </Button>
          ))}
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMore(!showMore)}
        className="text-gray-400"
      >
        {showMore ? "▲" : "▼"}
      </Button>
    </div>
  );
}
