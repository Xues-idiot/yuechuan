"use client";

import { useCallback, useMemo } from "react";
import { useTheme } from "./ThemeProvider";

// Sun icon for light mode
function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
    </svg>
  );
}

// Moon icon for dark mode
function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646Z" />
    </svg>
  );
}

// Monitor icon for auto mode
function MonitorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = useCallback(() => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("auto");
    else setTheme("light");
  }, [theme, setTheme]);

  const labels = useMemo(() => ({
    light: "浅色",
    dark: "深色",
    auto: "自动",
  }), []);

  const currentIcon = useMemo(() => {
    if (theme === "light") return <SunIcon />;
    if (theme === "dark") return <MoonIcon />;
    return <MonitorIcon />;
  }, [theme]);

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        color: 'var(--text-secondary)',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      title={`当前: ${labels[theme]} (点击切换)`}
      aria-label={`主题: ${labels[theme]}`}
    >
      {currentIcon}
    </button>
  );
}
