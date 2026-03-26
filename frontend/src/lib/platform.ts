"use client";

export function isServer(): boolean {
  return typeof window === "undefined";
}

export function isClient(): boolean {
  return typeof window !== "undefined";
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isDesktop(): boolean {
  return !isMobile();
}

export function supportsTouch(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export function supportsNotifications(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window;
}

export function supportsClipboard(): boolean {
  if (typeof window === "undefined") return false;
  return "clipboard" in navigator;
}

export function supportsShare(): boolean {
  if (typeof window === "undefined") return false;
  return "share" in navigator;
}

export function supportsServiceWorker(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator;
}

export function supportsWebPush(): boolean {
  if (typeof window === "undefined") return false;
  return "PushManager" in window;
}
