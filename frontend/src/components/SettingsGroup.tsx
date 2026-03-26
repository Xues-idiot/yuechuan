"use client";

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsGroup({
  title,
  children,
  className = "",
}: SettingsGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function SettingsItem({
  icon,
  title,
  description,
  children,
  onClick,
}: SettingsItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 ${onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="font-medium">{title}</div>
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}
