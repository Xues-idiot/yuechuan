"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function UnreadBadge() {
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getUnreadCount();
        setTotalUnread(data.total_unread);
      } catch (e) {
        // 忽略错误
      }
    }
    load();
    // 每60秒刷新一次
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (totalUnread === 0) return null;

  return (
    <Link
      href="/feeds"
      className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full min-w-[20px]"
    >
      {totalUnread > 99 ? "99+" : totalUnread}
    </Link>
  );
}
