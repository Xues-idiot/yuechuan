"use client";

import { useState } from "react";
import Calendar from "./Calendar";

interface HistoryCalendarProps {
  historyDates: string[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export default function HistoryCalendar({
  historyDates,
  onDateSelect,
  selectedDate,
}: HistoryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const hasHistory = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return historyDates.includes(dateStr);
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          ←
        </button>
        <span className="font-medium">
          {year}年 {monthNames[month]}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          →
        </button>
      </div>

      {/* 星期 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const hasHistoryDay = hasHistory(day);
          const isSelected = selectedDate === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          return (
            <button
              key={day}
              onClick={() => {
                if (hasHistoryDay) {
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  onDateSelect(dateStr);
                }
              }}
              disabled={!hasHistoryDay}
              className={`
                w-8 h-8 text-sm rounded-full flex items-center justify-center
                ${hasHistoryDay
                  ? "hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
                }
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${hasHistoryDay && !isSelected ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30" />
          <span>有阅读记录</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span>选中日期</span>
        </div>
      </div>
    </div>
  );
}
