"use client";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
}

export default function Divider({
  orientation = "horizontal",
  spacing = "md",
}: DividerProps) {
  const spacings = {
    none: "",
    sm: "my-1",
    md: "my-3",
    lg: "my-6",
  };

  if (orientation === "vertical") {
    return (
      <div
        className={`w-px h-full bg-gray-200 dark:bg-gray-700 ${spacings[spacing].replace("my-", "mx-")}`}
      />
    );
  }

  return <div className={`w-full h-px bg-gray-200 dark:bg-gray-700 ${spacings[spacing]}`} />;
}
