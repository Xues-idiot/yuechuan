"use client";

import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  change?: {
    value: number;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    default: "bg-gray-50 dark:bg-gray-800",
    success: "bg-green-50 dark:bg-green-900/20",
    warning: "bg-yellow-50 dark:bg-yellow-900/20",
    danger: "bg-red-50 dark:bg-red-900/20",
  };

  const valueColors = {
    default: "text-gray-900 dark:text-gray-100",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  return (
    <Card className={`p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${valueColors[variant]}`}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm ${
                  change.value > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {change.value > 0 ? "↑" : "↓"} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500">{change.label}</span>
            </div>
          )}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </Card>
  );
}
