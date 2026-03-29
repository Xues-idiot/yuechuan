"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 text-center py-2 text-sm z-[var(--z-fixed)] flex items-center justify-center gap-2"
      style={{
        backgroundColor: 'var(--color-warning)',
        color: 'white'
      }}
      role="alert"
      aria-live="polite"
    >
      <WifiOff className="w-4 h-4" aria-hidden="true" />
      当前处于离线状态，部分功能可能不可用
    </div>
  );
}
