"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
}: ToggleProps) {
  const sizes = {
    sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
  };

  return (
    <div className="flex items-start gap-3">
      <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`${
        checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
      } relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${sizes[size].track}`}
    >
      <span
        className={`${
          checked ? sizes[size].translate : "translate-x-1"
        } inline-block rounded-full bg-white shadow transform transition-transform ${
          sizes[size].thumb
        }`}
      />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && <div className="font-medium">{label}</div>}
          {description && <div className="text-sm text-gray-500">{description}</div>}
        </div>
      )}
    </div>
  );
}
