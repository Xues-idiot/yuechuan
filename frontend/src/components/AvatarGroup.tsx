"use client";

import Image from "next/image";

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
    sm: { width: 24, height: 24, className: "w-6 h-6 text-xs" },
    md: { width: 32, height: 32, className: "w-8 h-8 text-sm" },
    lg: { width: 40, height: 40, className: "w-10 h-10 text-base" },
  };

  return (
    <div className="flex items-center">
      {displayed.map((avatar, index) => (
        <div
          key={index}
          className={`${sizes[size].className} rounded-full flex items-center justify-center text-white font-medium border-2 ${
            index > 0 ? "-ml-2" : ""
          }`}
          style={{
            zIndex: displayed.length - index,
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            borderColor: 'var(--surface-primary)',
          }}
        >
          {avatar.src ? (
            <Image
              src={avatar.src}
              alt={avatar.alt || avatar.name || ""}
              width={sizes[size].width}
              height={sizes[size].height}
              className="w-full h-full rounded-full object-cover"
              unoptimized
            />
          ) : (
            (avatar.name || avatar.alt || "?").charAt(0).toUpperCase()
          )}
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={`${sizes[size].className} rounded-full flex items-center justify-center font-medium border-2 -ml-2`}
          style={{
            zIndex: 0,
            backgroundColor: 'var(--surface-secondary)',
            color: 'var(--text-tertiary)',
            borderColor: 'var(--surface-primary)',
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
