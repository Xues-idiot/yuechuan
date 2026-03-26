"use client";

interface WeeklyActivityProps {
  data: Array<{
    day: string;
    count: number;
    minutes: number;
  }>;
}

export default function WeeklyActivity({ data }: WeeklyActivityProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4">本周阅读活动</h3>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, index) => {
          const height = (day.count / maxCount) * 100;
          const isToday = index === data.length - 1;

          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-lg transition-all ${
                  isToday
                    ? "bg-blue-500"
                    : day.count > 0
                    ? "bg-blue-300 dark:bg-blue-700"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
                style={{ height: `${Math.max(height, 4)}%` }}
                title={`${day.count} 篇, ${day.minutes} 分钟`}
              />
              <span className={`text-xs ${isToday ? "font-medium text-blue-600" : "text-gray-500"}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
        <span>本周阅读</span>
        <span className="font-medium">
          {data.reduce((sum, d) => sum + d.count, 0)} 篇
        </span>
      </div>
    </div>
  );
}
