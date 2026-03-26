"use client";

interface NotesListProps {
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    itemTitle?: string;
  }>;
  onNoteClick?: (note: any) => void;
  onDelete?: (noteId: string) => void;
}

export default function NotesList({ notes, onNoteClick, onDelete }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-4 block">📝</span>
        <p>还没有笔记</p>
        <p className="text-sm">在阅读时添加笔记，它们会显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNoteClick?.(note)}
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
                  onDelete(note.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
