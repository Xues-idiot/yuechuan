"use client";

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    name?: string;
    alt?: string;
  }>;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function AvatarGroup({ avatars, max = 4, size = "md" }: AvatarGroupProps) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div className="flex items-center">
      {displayed.map((avatar, index) => (
        <div
          key={index}
          className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium border-2 border-white dark:border-gray-800 ${
            index > 0 ? "-ml-2" : ""
          }`}
          style={{ zIndex: displayed.length - index }}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.alt || avatar.name || ""}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            (avatar.name || avatar.alt || "?").charAt(0).toUpperCase()
          )}
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={`${sizes[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-medium border-2 border-white dark:border-gray-800 -ml-2`}
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
