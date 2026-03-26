"use client";

interface SkeletonLineProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
}

export default function SkeletonLine({
  width = "100%",
  height = "1em",
  variant = "text",
}: SkeletonLineProps) {
  const getStyles = () => {
    const baseStyles = "bg-gray-200 dark:bg-gray-700 animate-pulse";

    switch (variant) {
      case "circular":
        return `${baseStyles} rounded-full`;
      case "rectangular":
        return `${baseStyles} rounded-lg`;
      default:
        return `${baseStyles} rounded`;
    }
  };

  return (
    <div
      className={getStyles()}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
