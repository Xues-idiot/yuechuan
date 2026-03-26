// 阅川 Service Worker v2 - 完整离线支持
const CACHE_VERSION = "v2";
const CACHE_NAME = `yuechuan-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  "/",
  "/feeds",
  "/search",
  "/stats",
  "/discover",
  "/settings",
  "/history",
  "/starred",
  "/read-later",
  "/review",
];

// 离线页面
const OFFLINE_PAGE = "/offline.html";

// 安装事件 - 缓存核心资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 先尝试添加静态资源
      try {
        await cache.addAll(STATIC_ASSETS);
      } catch (e) {
        console.warn("Some static assets failed to cache:", e);
      }
      // 创建离线页面
      await cache.put(
        OFFLINE_PAGE,
        new Response(
          `<!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>离线 - 阅川</title>
            <style>
              body { font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
              .container { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h1 { color: #666; } p { color: #999; }
              button { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer; margin-top: 1rem; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📡 当前离线</h1>
              <p>请检查您的网络连接</p>
              <button onclick="location.reload()">重试</button>
            </div>
          </body>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        )
      );
    })
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith("yuechuan-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截 - 智能缓存策略
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // API 请求 - 网络优先，降级到缓存
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功响应也缓存一份
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cloned);
            });
          }
          return response;
        })
        .catch(async () => {
          // 网络失败，尝试返回缓存
          const cached = await caches.match(request);
          if (cached) return cached;
          // 返回离线 JSON 响应
          return new Response(
            JSON.stringify({ error: "offline", message: "当前离线" }),
            { headers: { "Content-Type": "application/json" } }
          );
        })
    );
    return;
  }

  // 静态资源 - 缓存优先
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate: 返回缓存同时更新
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }
        });
        return cachedResponse;
      }

      // 没有缓存，尝试网络
      return fetch(request).then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cloned);
          });
        }
        return response;
      }).catch(() => {
        // 网络也失败，对于 HTML 请求返回离线页面
        if (request.headers.get("accept")?.includes("text/html")) {
          return caches.match(OFFLINE_PAGE);
        }
        return new Response("Offline", { status: 503 });
      });
    })
  );
});

// 后台同步
self.addEventListener("sync", (event) => {
  const syncHandlers = {
    "sync-read-later": syncReadLater,
    "sync-progress": syncProgress,
    "sync-offline-actions": syncOfflineActions,
  };

  if (syncHandlers[event.tag as keyof typeof syncHandlers]) {
    event.waitUntil(syncHandlers[event.tag as keyof typeof syncHandlers]());
  }
});

async function syncReadLater() {
  try {
    const db = await openDB();
    const tx = db.transaction("offline-actions", "readonly");
    const store = tx.objectStore("offline-actions");
    const actions = await store.getAll();

    for (const action of actions) {
      if (action.type === "read-later") {
        await fetch("/api/read-later/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_id: action.item_id }),
        });
      }
    }

    // 清除已同步的操作
    const deleteTx = db.transaction("offline-actions", "readwrite");
    deleteTx.objectStore("offline-actions").clear();
  } catch (e) {
    console.error("Failed to sync read later:", e);
  }
}

async function syncProgress() {
  try {
    const db = await openDB();
    const tx = db.transaction("reading-progress", "readonly");
    const store = tx.objectStore("reading-progress");
    const progress = await store.getAll();

    if (progress.length > 0) {
      await fetch("/api/progress/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });
    }
  } catch (e) {
    console.error("Failed to sync progress:", e);
  }
}

async function syncOfflineActions() {
  await syncReadLater();
  await syncProgress();
}

// IndexedDB 辅助
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("yuechuan-offline", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("offline-actions")) {
        db.createObjectStore("offline-actions", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("reading-progress")) {
        db.createObjectStore("reading-progress", { keyPath: "item_id" });
      }
    };
  });
}

// 推送通知
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "阅川";
  const options = {
    body: data.body || "您有新的内容待阅读",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    data: data.url,
    actions: [
      { action: "open", title: "阅读" },
      { action: "dismiss", title: "忽略" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知点击
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // 尝试聚焦已有窗口
      for (const client of clientList) {
        if (client.url.includes(location.origin) && "focus" in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // 没有窗口则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// 定期同步 - 每 15 分钟检查新内容
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-new-content") {
    event.waitUntil(checkNewContent());
  }
});

async function checkNewContent() {
  try {
    const response = await fetch("/api/stats/unread-count");
    if (response.ok) {
      const data = await response.json();
      if (data.total_unread > 0) {
        await self.registration.showNotification("阅川", {
          body: `您有 ${data.total_unread} 篇新内容待阅读`,
          icon: "/icon-192.png",
          badge: "/badge-72.png",
          tag: "new-content",
        });
      }
    }
  } catch (e) {
    console.error("Failed to check new content:", e);
  }
}

// 消息处理
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
