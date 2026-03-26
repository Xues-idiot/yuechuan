"use client";

export function getBrowserInfo(): {
  name: string;
  version: string;
  os: string;
  isMobile: boolean;
} {
  if (typeof window === "undefined") {
    return { name: "Unknown", version: "0", os: "Unknown", isMobile: false };
  }

  const ua = navigator.userAgent;

  let name = "Unknown";
  let version = "0";

  if (ua.includes("Firefox")) {
    name = "Firefox";
    version = ua.match(/Firefox\/(\d+)/)?.[1] || "0";
  } else if (ua.includes("Chrome")) {
    name = "Chrome";
    version = ua.match(/Chrome\/(\d+)/)?.[1] || "0";
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    name = "Safari";
    version = ua.match(/Version\/(\d+)/)?.[1] || "0";
  } else if (ua.includes("Edge")) {
    name = "Edge";
    version = ua.match(/Edge\/(\d+)/)?.[1] || "0";
  }

  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS")) os = "iOS";

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  return { name, version, os, isMobile };
}

export function getScreenSize(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return {
    width: window.screen.width,
    height: window.screen.height,
  };
}

export function getViewportSize(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
