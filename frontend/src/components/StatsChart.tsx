"use client";

interface StatsChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  type?: "bar" | "line" | "pie";
}

export default function StatsChart({ data, title, type = "bar" }: StatsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  if (type === "bar") {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {title && <h3 className="font-semibold mb-4">{title}</h3>}

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color || colors[index % colors.length]} transition-all`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "pie") {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {title && <h3 className="font-semibold mb-4">{title}</h3>}

        <div className="flex items-center gap-6">
          {/* 饼图 */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {data.reduce((acc, item, index) => {
                const percentage = item.value / total;
                const offset = acc.offset;
                acc.elements.push(
                  <circle
                    key={item.label}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={getCSSColor(colors[index % colors.length])}
                    strokeWidth="4"
                    strokeDasharray={`${percentage * 88} ${88 - percentage * 88}`}
                    strokeDashoffset={-offset}
                  />
                );
                acc.offset += percentage * 88;
                return acc;
              }, { elements: [] as JSX.Element[], offset: 0 }).elements}
            </svg>
          </div>

          {/* 图例 */}
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color || colors[index % colors.length]}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                  {item.label}
                </span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function getCSSColor(className: string): string {
  const colorMap: Record<string, string> = {
    "bg-blue-500": "#3b82f6",
    "bg-green-500": "#22c55e",
    "bg-yellow-500": "#eab308",
    "bg-red-500": "#ef4444",
    "bg-purple-500": "#a855f7",
    "bg-pink-500": "#ec4899",
    "bg-indigo-500": "#6366f1",
    "bg-teal-500": "#14b8a6",
  };
  return colorMap[className] || "#6b7280";
}
