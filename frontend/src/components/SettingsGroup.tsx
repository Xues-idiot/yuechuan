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
      <h3
        className="text-sm font-medium uppercase tracking-wide"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {title}
      </h3>
      <div
        className="rounded-[var(--radius-md)] border divide-y"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-default)',
        }}
      >
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
      className={`flex items-center gap-4 p-4 transition-colors ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {title}
        </div>
        {description && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
