"use client";

interface UnreadToggleProps {
  isUnread: boolean;
  onToggle: () => void;
}

export default function UnreadToggle({ isUnread, onToggle }: UnreadToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        isUnread
          ? "border-blue-500 bg-blue-500"
          : "border-gray-300 bg-white dark:bg-gray-800"
      }`}
      title={isUnread ? "标记为已读" : "标记为未读"}
    >
      {isUnread && <div className="w-2 h-2 rounded-full bg-white" />}
    </button>
  );
}
