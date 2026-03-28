import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 主色调 - Cyan
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        // 强调色 - Amber
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
        },
        // 状态色
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        // 文字色
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
        },
        // 表面色
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          elevated: "var(--surface-elevated)",
        },
        // 边框色
        border: {
          DEFAULT: "var(--border-default)",
          hover: "var(--border-hover)",
          focus: "var(--border-focus)",
        },
        // 背景色
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        reading: "720px",
        content: "1200px",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease forwards",
        "slide-in": "slideIn 0.25s ease forwards",
        "spring-in": "springScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "spring-slide": "springSlide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "spring-slide-left": "springSlideLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "spring-slide-right": "springSlideRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-scale": "fadeScale 0.3s ease forwards",
        shimmer: "shimmer 1.5s infinite",
        spin: "spin 1s linear infinite",
        "spin-slow": "spinSlow 2s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
        breathe: "breathe 3s ease-in-out infinite",
        bounce: "bounce 0.6s ease-in-out infinite",
        "slide-over": "slideOver 0.3s ease-out forwards",
        "fade-out": "fadeOut 0.3s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        springScale: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "50%": { transform: "scale(1.02)" },
          "70%": { transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        springSlide: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "40%": { opacity: "1", transform: "translateY(-4px)" },
          "70%": { transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        springSlideLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "40%": { opacity: "1", transform: "translateX(4px)" },
          "70%": { transform: "translateX(-2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        springSlideRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "40%": { opacity: "1", transform: "translateX(-4px)" },
          "70%": { transform: "translateX(2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeScale: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        slideOver: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
