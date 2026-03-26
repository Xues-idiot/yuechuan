"use client";

interface SelectOptionProps {
  value: string;
  label: string;
  icon?: string;
  onClick: () => void;
  selected?: boolean;
}

export default function SelectOption({
  value,
  label,
  icon,
  onClick,
  selected = false,
}: SelectOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
        selected
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
      }`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="flex-1">{label}</span>
      {selected && <span className="text-blue-500">✓</span>}
    </button>
  );
}
