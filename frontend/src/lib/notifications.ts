// 简单的通知系统
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "notifications";

export function getNotifications(): Notification[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 50))); // 只保留最近50条
}

export function addNotification(
  title: string,
  message: string,
  type: Notification["type"] = "info"
): Notification {
  const notifications = getNotifications();

  const notification: Notification = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    message,
    type,
    timestamp: Date.now(),
    read: false,
  };

  notifications.unshift(notification);
  saveNotifications(notifications);

  // 显示浏览器通知（如果用户授权）
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body: message });
  }

  return notification;
}

export function markAsRead(id: string) {
  const notifications = getNotifications();
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
  }
}

export function markAllAsRead() {
  const notifications = getNotifications();
  notifications.forEach((n) => (n.read = true));
  saveNotifications(notifications);
}

export function clearNotifications() {
  saveNotifications([]);
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

// 请求通知权限
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// 检查是否支持通知
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | null {
  if (!("Notification" in window)) {
    return null;
  }
  return Notification.permission;
}
