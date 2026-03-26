"use client";

interface NoteCardProps {
  note: {
    id: string;
    content: string;
    createdAt: string;
    itemTitle?: string;
  };
  onClick?: () => void;
  onDelete?: () => void;
}

export default function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {note.itemTitle && (
            <div className="text-xs text-gray-500 mb-2 truncate">
              📄 {note.itemTitle}
            </div>
          )}
          <p className="text-sm line-clamp-3">{note.content}</p>
          <div className="text-xs text-gray-400 mt-2">
            {new Date(note.createdAt).toLocaleString("zh-CN")}
          </div>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
