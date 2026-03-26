"use client";

import { useState, useEffect } from "react";

interface ChartData {
  date: string;
  value: number;
}

export default function ReadingStatsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<"week" | "month">("week");

  useEffect(() => {
    // 模拟数据
    const now = new Date();
    const mock: ChartData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000);
      mock.push({
        date: date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
        value: Math.floor(Math.random() * 20) + 5,
      });
    }

    setData(mock);
  }, [period]);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">📈 阅读趋势</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("week")}
            className={`px-3 py-1 text-xs rounded ${
              period === "week"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1 text-xs rounded ${
              period === "month"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            本月
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{
                height: `${(d.value / maxValue) * 100}%`,
                minHeight: "4px",
              }}
            />
            <span className="text-xs text-gray-500">{d.date}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>总阅读: {data.reduce((sum, d) => sum + d.value, 0)} 篇</span>
        <span>日均: {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)} 篇</span>
      </div>
    </div>
  );
}
