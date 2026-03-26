"use client";

interface ActivityTimelineProps {
  events: Array<{
    id: string;
    date: string;
    title: string;
    description?: string;
    type: "read" | "star" | "note" | "share";
  }>;
  onEventClick?: (event: any) => void;
}

const typeIcons = {
  read: "📖",
  star: "⭐",
  note: "📝",
  share: "🔗",
};

const typeColors = {
  read: "border-blue-500",
  star: "border-yellow-500",
  note: "border-green-500",
  share: "border-purple-500",
};

export default function ActivityTimeline({
  events,
  onEventClick,
}: ActivityTimelineProps) {
  return (
    <div className="relative">
      {/* 连接线 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative pl-10 cursor-pointer"
            onClick={() => onEventClick?.(event)}
          >
            {/* 图标 */}
            <div
              className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-gray-800 ${typeColors[event.type]}`}
            >
              {typeIcons[event.type]}
            </div>

            {/* 内容 */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="text-xs text-gray-500 mb-1">{event.date}</div>
              <h4 className="font-medium text-sm">{event.title}</h4>
              {event.description && (
                <p className="text-xs text-gray-500 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 py-8">暂无活动记录</p>
      )}
    </div>
  );
}
